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

// === ĐÃ XÓA: Không cần dùng thư viện resizable nữa ===
// import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

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

  // === Toggle Sidebar ===
  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  // === Các hàm phát nhạc (không đổi) ===
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

  // === Logic cuộn (không đổi) ===
  useEffect(() => {
    const handleScrollLogic = (el) => {
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScroll = Math.round(scrollHeight - clientHeight);
      const currentScrollTop = Math.round(scrollTop);
      const htmlElement = document.documentElement;
      if (scrollHeight <= clientHeight + 1) {
        htmlElement.classList.remove('at-top', 'at-bottom'); return;
      }
      if (currentScrollTop <= 5) {
        htmlElement.classList.add('at-top'); htmlElement.classList.remove('at-bottom');
      } else if (currentScrollTop >= maxScroll - 5) {
        htmlElement.classList.add('at-bottom'); htmlElement.classList.remove('at-top');
      } else {
        htmlElement.classList.remove('at-top', 'at-bottom');
      }
    };
    const scrollTarget = document.querySelector(SCROLL_SELECTOR);
    if (scrollTarget) {
      const scrollHandler = () => handleScrollLogic(scrollTarget);
      handleScrollLogic(scrollTarget);
      scrollTarget.addEventListener('scroll', scrollHandler, { passive: true });
      window.addEventListener('resize', scrollHandler);
      return () => {
        scrollTarget.removeEventListener('scroll', scrollHandler);
        window.removeEventListener('resize', scrollHandler);
      };
    }
  }, [isLoggedIn, location]);

  const AuthLayout = () => (<div className="w-screen h-screen flex justify-center items-center bg-black"><Outlet /></div>);

  // === SỬA LỖI CUỐI CÙNG: Dùng layout flexbox đơn giản ===
  const MainLayout = () => (
    <div className="bg-black h-screen flex flex-col">
      <Header isLoggedIn={isLoggedIn} />
      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar giờ sẽ tự kiểm soát chiều rộng một cách hoàn hảo */}
        <Sidebar
          isLoggedIn={isLoggedIn}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebarCollapse}
        />

        {/* Vùng nội dung chính sẽ lấp đầy không gian còn lại */}
        <main className="flex-1 min-w-0">
          <div className="h-full overflow-y-auto bg-neutral-900 rounded-lg main-content-scroll p-4">
            <Outlet />
          </div>
        </main>

        {isRightSidebarVisible && (
          <div className="w-[360px] flex-shrink-0 transition-all duration-300 p-2 pl-0">
            <RightSidebar
              song={currentSong}
              artistInfo={currentArtistInfo}
              onClose={handleCloseRightSidebar}
            />
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
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/login1" element={<Login1 />} />
          <Route path="/login2" element={<Login2 />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register1" element={<Register1 />} />
          <Route path="/register2" element={<Register2 />} />
          <Route path="/register3" element={<Register3 />} />
        </Route>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage isLoggedIn={isLoggedIn} onSongSelect={handleSelectSong} />} />
          <Route path="/album/:albumId" element={<AlbumPage onSongSelect={handleSelectSong} />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (<BrowserRouter> <AppLayout /> </BrowserRouter>);
}

export default App;