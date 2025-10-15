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

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

// Selector cho vùng nội dung có thể cuộn.
const SCROLL_SELECTOR = '.main-content-scroll';

function AppLayout() {
  const location = useLocation();
  const panelGroupRef = useRef(null);

  // --- STATE CẤP CAO ĐƯỢC GIỮ LẠI ---
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentArtistInfo, setCurrentArtistInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- STATE MỚI ĐỂ QUẢN LÝ DANH SÁCH PHÁT ---
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffleActive, setShuffleActive] = useState(false);
  const [isRepeatActive, setRepeatActive] = useState(false);

  // --- CÁC STATE, REF VÀ HÀM ĐÃ ĐƯỢC XÓA BỎ ---
  // const [trackProgress, setTrackProgress] = useState(0);
  // const [trackDuration, setTrackDuration] = useState(0);
  // const audioRef = useRef(null);
  // const onTimeUpdate = () => { ... };
  // const onLoadedMetadata = () => { ... };
  // useEffect(() => { if (isPlaying) ... }, [isPlaying, currentSong]); // Logic này cũng đã chuyển đi

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---

  // Cập nhật: Khi chọn bài hát, cần nhận cả danh sách phát và vị trí bài hát
  const handleSelectSong = (song, playlist = [], index = 0) => {
    setCurrentSong(song);
    setCurrentPlaylist(playlist);
    setCurrentIndex(index);
    setIsPlaying(true);
    setIsRightSidebarVisible(true);
    // ... logic khác nếu có
    panelGroupRef.current?.setLayout([10, 90]);
  };

  const handlePlayPause = () => {
    if (!currentSong) return;
    setIsPlaying(!isPlaying);
  };

  // Logic cho Next/Prev
  const handleNextSong = () => {
    if (currentPlaylist.length === 0) return;

    if (isShuffleActive) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * currentPlaylist.length);
      } while (currentPlaylist.length > 1 && randomIndex === currentIndex);
      setCurrentIndex(randomIndex);
      setCurrentSong(currentPlaylist[randomIndex]);
    } else {
      const nextIndex = (currentIndex + 1) % currentPlaylist.length;
      setCurrentIndex(nextIndex);
      setCurrentSong(currentPlaylist[nextIndex]);
    }
  };

  const handlePrevSong = () => {
    if (currentPlaylist.length === 0) return;
    const prevIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    setCurrentIndex(prevIndex);
    setCurrentSong(currentPlaylist[prevIndex]);
  };

  const handleToggleShuffle = () => setShuffleActive(!isShuffleActive);
  const handleToggleRepeat = () => setRepeatActive(!isRepeatActive);

  const handleCloseRightSidebar = () => {
    setIsRightSidebarVisible(false);
    panelGroupRef.current?.setLayout([30, 70]);
  };

  const handleLogin = () => setIsLoggedIn(!isLoggedIn);

  // Logic xử lý cuộn (giữ nguyên)
  useEffect(() => {
    const handleScrollLogic = (el) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
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

    const scrollTarget = document.querySelector(SCROLL_SELECTOR);
    if (scrollTarget) {
      const scrollHandler = () => handleScrollLogic(scrollTarget);
      scrollTarget.addEventListener('scroll', scrollHandler, { passive: true });
      window.addEventListener('resize', scrollHandler);
      window.addEventListener('load', scrollHandler);
      handleScrollLogic(scrollTarget);
      return () => {
        scrollTarget.removeEventListener('scroll', scrollHandler);
        window.removeEventListener('resize', scrollHandler);
        window.removeEventListener('load', scrollHandler);
      };
    }
  }, [isLoggedIn]);

  // --- COMPONENT LAYOUT ---
  const AuthLayout = () => (
    <div className="w-screen h-screen flex justify-center items-center bg-black">
      <Outlet />
    </div>
  );

  const MainLayout = () => (
    <div className="bg-black h-screen flex flex-col">
      <Header isLoggedIn={isLoggedIn} />
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup ref={panelGroupRef} direction="horizontal">
          <ResizablePanel defaultSize={30} minSize={isLoggedIn ? 10 : 20} maxSize={40} className="p-2">
            <Sidebar isLoggedIn={isLoggedIn} />
          </ResizablePanel>
          <ResizableHandle withHandle className="w-2 bg-black" />
          <ResizablePanel defaultSize={70} minSize={60} className="p-2">
            <div className="h-full overflow-y-auto bg-neutral-900 rounded-lg main-content-scroll">
              <Outlet />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
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

      {isLoggedIn ? (
        <PlayerBarActive
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNextSong}
          onPrev={handlePrevSong}
          isShuffleActive={isShuffleActive}
          onToggleShuffle={handleToggleShuffle}
          isRepeatActive={isRepeatActive}
          onToggleRepeat={handleToggleRepeat}
        />
      ) : (
        <PlayerBar />
      )}

      <button onClick={handleLogin} className="absolute top-5 right-48 z-20 bg-green-500 text-white px-3 py-1 rounded text-xs">
        Toggle Login
      </button>
    </div>
  );

  return (
    <>
      {/* Thẻ <audio> đã bị xóa khỏi đây */}
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
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;