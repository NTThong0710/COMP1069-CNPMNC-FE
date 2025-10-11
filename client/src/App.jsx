import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PlayerBar from './components/PlayerBar';
import PlayerBarActive from './components/PlayerBarActive';
import RightSidebar from './components/RightSidebar'; 
import HomePage from './pages/HomePage';
import AlbumPage from './pages/AlbumPage';
import SearchPage from './pages/SearchPage';
import Login from './pages/Login';
import Register from './pages/Register';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

// Selector cho vùng nội dung có thể cuộn của BẠN.
const SCROLL_SELECTOR = '.main-content-scroll';

function AppLayout() {
  const location = useLocation(); 
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentArtistInfo, setCurrentArtistInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const audioRef = useRef(null);
  const panelGroupRef = useRef(null);

  const handleSelectSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setIsRightSidebarVisible(true);
    
    // Giả sử bạn có artistsDB, nếu không hãy xóa hoặc comment phần này
    // if (song.artistId && artistsDB[song.artistId]) {
    //   setCurrentArtistInfo(artistsDB[song.artistId]);
    // } else {
    //   setCurrentArtistInfo(null);
    // }
    
    panelGroupRef.current?.setLayout([10, 90]);
  };
  
  const handleCloseRightSidebar = () => {
    setIsRightSidebarVisible(false);
    panelGroupRef.current?.setLayout([30, 70]);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(error => console.log("Playback was prevented.", error));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  const handlePlayPause = () => { if (!currentSong) return; setIsPlaying(!isPlaying); };
  const onTimeUpdate = () => { if (audioRef.current) setTrackProgress(audioRef.current.currentTime); };
  const onLoadedMetadata = () => { if (audioRef.current) setTrackDuration(audioRef.current.duration); };
  const handleLogin = () => setIsLoggedIn(!isLoggedIn);

  // === LOGIC XỬ LÝ CUỘN - ĐÃ CẬP NHẬT THEO YÊU CẦU GIỐNG HỆT BẠN CỦA BẠN ===
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

    // Tìm phần tử cuộn trong layout của BẠN
    const scrollTarget = document.querySelector(SCROLL_SELECTOR);

    if (scrollTarget) {
      const scrollHandler = () => handleScrollLogic(scrollTarget);

      // Gắn các sự kiện giống hệt code của bạn bạn
      scrollTarget.addEventListener('scroll', scrollHandler, { passive: true });
      window.addEventListener('resize', scrollHandler);
      window.addEventListener('load', scrollHandler);

      // Chạy lần đầu
      handleScrollLogic(scrollTarget);

      // Cleanup function
      return () => {
        scrollTarget.removeEventListener('scroll', scrollHandler);
        window.removeEventListener('resize', scrollHandler);
        window.removeEventListener('load', scrollHandler);
      };
    }
  }, [isLoggedIn]); // <-- Đổi dependency array thành [isLoggedIn] giống hệt code của bạn bạn.
  // === KẾT THÚC LOGIC CUỘN ĐÃ CẬP NHẬT ===

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
          <ResizablePanel 
            defaultSize={15} 
            minSize={isLoggedIn ? 10 : 20} 
            maxSize={40}
            className="p-2"
          >
            <Sidebar isLoggedIn={isLoggedIn} /> 
          </ResizablePanel>
          
          <ResizableHandle withHandle className="w-2 bg-black" />
          
          <ResizablePanel 
            defaultSize={70} 
            minSize={60}
            className="p-2"
          >
            {/* Đây là vùng nội dung có thanh cuộn mà logic trên sẽ áp dụng vào */}
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
          progress={trackProgress} 
          duration={trackDuration} 
        />
      ) : (
        <PlayerBar />
      )}
      <button 
        onClick={handleLogin} 
        className="absolute top-5 right-48 z-20 bg-green-500 text-white px-3 py-1 rounded text-xs"
      >
        Toggle Login
      </button>
    </div>
  );

  return (
    <>
      <audio 
        ref={audioRef} 
        src={currentSong?.url} 
        onTimeUpdate={onTimeUpdate} 
        onLoadedMetadata={onLoadedMetadata} 
        onEnded={() => setIsPlaying(false)} 
      ></audio>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/" element={<MainLayout />}>
          <Route index element={ <HomePage isLoggedIn={isLoggedIn} onSongSelect={handleSelectSong} /> } />
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