import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PlayerBar from './components/PlayerBar';
import PlayerBarActive from './components/PlayerBarActive';
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

// Hằng số cho selector của phần tử cuộn (dùng \\/ để thoát ký tự / trong JS string)
const SCROLL_SELECTOR = '.overflow-y-auto.bg-gradient-to-b.from-neutral-800\\/60.to-black.rounded-lg.m-2';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);

  const audioRef = useRef(null);

  const handleSelectSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(error => console.log("Playback was prevented.", error));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  const handlePlayPause = () => {
    if (!currentSong) return;
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    setTrackProgress(audioRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    setTrackDuration(audioRef.current.duration);
  };

  const handleLogin = () => setIsLoggedIn(!isLoggedIn);

  // === LOGIC XỬ LÝ CUỘN TỐI ƯU (Phiên bản đã sửa lỗi logic) ===
  useEffect(() => {
    const handleScrollLogic = (el) => {
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;

      const maxScroll = Math.round(scrollHeight - clientHeight);
      const currentScrollTop = Math.round(scrollTop);

      // Chúng ta đặt class lên thẻ <html> để CSS có thể sử dụng selector mạnh hơn
      const htmlElement = document.documentElement;

      // Nếu nội dung quá ngắn, không cần class
      if (scrollHeight <= clientHeight + 1) {
        htmlElement.classList.remove('at-top', 'at-bottom');
        return;
      }

      // 💡 ĐIỀU KIỆN ĐẦU TRANG
      if (currentScrollTop <= 5) {
        htmlElement.classList.add('at-top');
        htmlElement.classList.remove('at-bottom');
      }
      // 💡 ĐIỀU KIỆN CUỐI TRANG
      else if (currentScrollTop >= maxScroll - 5) {
        htmlElement.classList.add('at-bottom');
        htmlElement.classList.remove('at-top');
      }
      // Ở GIỮA
      else {
        htmlElement.classList.remove('at-top', 'at-bottom');
      }
    };

    // Tìm phần tử cuộn thực tế
    const scrollTarget = document.querySelector(SCROLL_SELECTOR);

    if (scrollTarget) {
      const scrollHandler = () => handleScrollLogic(scrollTarget);

      // Gắn sự kiện scroll vào DIV nội dung chính
      scrollTarget.addEventListener('scroll', scrollHandler, { passive: true });
      window.addEventListener('resize', scrollHandler);
      window.addEventListener('load', scrollHandler);

      handleScrollLogic(scrollTarget); // Chạy lần đầu

      return () => {
        scrollTarget.removeEventListener('scroll', scrollHandler);
        window.removeEventListener('resize', scrollHandler);
      };
    }
  }, []);
  // === KẾT THÚC LOGIC CUỘN TỐI ƯU ===


  // === Layout riêng cho Login / Register ===
  const AuthLayout = () => {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-black">
        <Outlet />
      </div>
    );
  };

  // Hàm chuyển đổi selector thành chuỗi class thuần
  const mainContentClasses = SCROLL_SELECTOR.replace(/\\/g, '').replace(/\./g, ' ').trim();

  // === Layout chính của App ===
  const MainLayout = () => (
    <div className="bg-black h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isLoggedIn={isLoggedIn} />
        <div className="flex-grow flex flex-col">
          <Header isLoggedIn={isLoggedIn} />
          {/* DIV CUỘN THỰC TẾ */}
          <div className={mainContentClasses}>
            <Outlet />
          </div>
        </div>
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
    <BrowserRouter>
      <audio
        ref={audioRef}
        src={currentSong?.url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      ></audio>

      <Routes>
        {/* Layout riêng cho login/register */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/login1" element={<Login1 />} />
          <Route path="/login2" element={<Login2 />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register1" element={<Register1 />} />
          <Route path="/register2" element={<Register2 />} />
          <Route path="/register3" element={<Register3 />} />
        </Route>

        {/* Layout chính của app */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<HomePage />}
          />
          <Route
            path="/album/:albumId"
            element={<AlbumPage onSongSelect={handleSelectSong} />}
          />
          <Route path="/search" element={<SearchPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
