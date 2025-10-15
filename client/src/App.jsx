import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';

// Components & Pages
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PlayerBar from './components/PlayerBar';
import PlayerBarActive from './components/PlayerBarActive';
import RightSidebar from './components/RightSideBar';
import HomePage from './pages/HomePage';
import AlbumPage from './pages/AlbumPage';
import SearchPage from './pages/SearchPage';
import Login from './pages/Login';
import Login1 from './pages/Login1';
import Login2 from './pages/Login2';
import Register from './pages/Register';
import Register1 from './pages/Register1';
import Register2 from './pages/Register2';
import Register3 from './pages/Register3';

const SCROLL_SELECTOR = '.main-content-scroll';

function AppLayout() {
  const location = useLocation();

  // === STATE ===
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentArtistInfo, setCurrentArtistInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffleActive, setShuffleActive] = useState(false);
  const [isRepeatActive, setRepeatActive] = useState(false);

  // === CÁC HÀM XỬ LÝ (Không đổi) ===
  const handleToggleSidebarCollapse = () => setIsSidebarCollapsed((prev) => !prev);
  const handleSelectSong = (song, playlist = [], index = 0) => {
    setCurrentSong(song);
    setCurrentPlaylist(playlist);
    setCurrentIndex(index);
    setIsPlaying(true);
    setIsRightSidebarVisible(true);
  };
  const handlePlayPause = () => { if (!currentSong) return; setIsPlaying(!isPlaying); };
  const handleNextSong = () => { /* ... */ };
  const handlePrevSong = () => { /* ... */ };
  const handleToggleShuffle = () => setShuffleActive(!isShuffleActive);
  const handleToggleRepeat = () => setRepeatActive(!isRepeatActive);
  const handleCloseRightSidebar = () => setIsRightSidebarVisible(false);
  const handleLogin = () => setIsLoggedIn(!isLoggedIn);

  // === LOGIC CUỘN MỚI (MẠNH MẼ HƠN) ===
  useEffect(() => {
    // 1. Tách hàm xử lý logic ra riêng
    const handleScrollLogic = () => {
      const scrollTarget = document.querySelector(SCROLL_SELECTOR);
      if (!scrollTarget) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollTarget;
      const maxScroll = Math.round(scrollHeight - clientHeight);
      const currentScrollTop = Math.round(scrollTop);
      const htmlElement = document.documentElement;

      if (scrollHeight <= clientHeight + 1) {
        htmlElement.classList.remove('at-top', 'at-bottom');
        return;
      }
      if (currentScrollTop <= 5) {
        htmlElement.classList.add('at-top');
        htmlElement.classList.remove('at-bottom');
      } else if (currentScrollTop >= maxScroll - 5) {
        htmlElement.classList.add('at-bottom');
        htmlElement.classList.remove('at-top');
      } else {
        htmlElement.classList.remove('at-top', 'at-bottom');
      }
    };

    // 2. Tìm phần tử cuộn
    const scrollTarget = document.querySelector(SCROLL_SELECTOR);
    if (scrollTarget) {
      // 3. Gắn các sự kiện
      scrollTarget.addEventListener('scroll', handleScrollLogic, { passive: true });
      window.addEventListener('resize', handleScrollLogic);

      // 4. Chạy lần đầu tiên để có trạng thái đúng
      handleScrollLogic();

      // 5. Hàm dọn dẹp sẽ được gọi mỗi khi useEffect chạy lại
      return () => {
        scrollTarget.removeEventListener('scroll', handleScrollLogic);
        window.removeEventListener('resize', handleScrollLogic);
      };
    }
    // 6. Chạy lại useEffect này mỗi khi CÓ BẤT KỲ THAY ĐỔI NÀO về layout
  }, [isLoggedIn, location, isRightSidebarVisible, isSidebarCollapsed]);
  // Thêm isSidebarCollapsed để đảm bảo an toàn

  const AuthLayout = () => (<div className="w-screen h-screen flex justify-center items-center bg-black"><Outlet /></div>);

  const MainLayout = () => (
    <div className="bg-black h-screen flex flex-col">
      <Header isLoggedIn={isLoggedIn} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isLoggedIn={isLoggedIn} isCollapsed={isSidebarCollapsed} onToggleCollapse={handleToggleSidebarCollapse} />
        <main className="flex-1 min-w-0">
          <div className="h-full overflow-y-auto bg-neutral-900 rounded-lg main-content-scroll p-4">
            <Outlet />
          </div>
        </main>
        {isRightSidebarVisible && (
          <div className="w-[360px] flex-shrink-0 transition-all duration-300 p-2 pl-0">
            <RightSidebar song={currentSong} artistInfo={currentArtistInfo} onClose={handleCloseRightSidebar} />
          </div>
        )}
      </div>
      {isLoggedIn ? (<PlayerBarActive song={currentSong} isPlaying={isPlaying} onPlayPause={handlePlayPause} onNext={handleNextSong} onPrev={handlePrevSong} isShuffleActive={isShuffleActive} onToggleShuffle={handleToggleShuffle} isRepeatActive={isRepeatActive} onToggleRepeat={handleToggleRepeat} />) : (<PlayerBar />)}
      <button onClick={handleLogin} className="absolute top-5 right-48 z-20 bg-green-500 text-white px-3 py-1 rounded text-xs">
        Toggle Login
      </button>
    </div>
  );

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} /> <Route path="/login1" element={<Login1 />} /> <Route path="/login2" element={<Login2 />} />
        <Route path="/register" element={<Register />} /> <Route path="/register1" element={<Register1 />} /> <Route path="/register2" element={<Register2 />} /> <Route path="/register3" element={<Register3 />} />
      </Route>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage isLoggedIn={isLoggedIn} onSongSelect={handleSelectSong} />} />
        <Route path="/album/:albumId" element={<AlbumPage onSongSelect={handleSelectSong} />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>
    </Routes>
  );
}

function App() { return (<BrowserRouter> <AppLayout /> </BrowserRouter>); }
export default App;