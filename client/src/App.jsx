// src/App.jsx
import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PlayerBar from './components/PlayerBar';
import PlayerBarActive from './components/PlayerBarActive';
import HomePage from './pages/HomePage';
import AlbumPage from './pages/AlbumPage';
import SearchPage from './pages/SearchPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // === STATE MỚI CHO THANH TIẾN TRÌNH ===
  const [trackProgress, setTrackProgress] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);

  const audioRef = useRef(null);

  const handleSelectSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    // Dùng useEffect để xử lý việc play nhạc an toàn hơn
  };
  
  useEffect(() => {
    if (isPlaying && audioRef.current) {
        audioRef.current.play().catch(error => console.log("Playback was prevented.", error));
    } else if (!isPlaying && audioRef.current) {
        audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);


  const handlePlayPause = () => {
    if (!currentSong) return; // Không làm gì nếu chưa có bài hát nào
    setIsPlaying(!isPlaying);
  };
  
  // === CÁC HÀM XỬ LÝ SỰ KIỆN TỪ THẺ <audio> ===
  const onTimeUpdate = () => {
    setTrackProgress(audioRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    setTrackDuration(audioRef.current.duration);
  };

  const handleLogin = () => setIsLoggedIn(!isLoggedIn);

  return (
    <BrowserRouter>
      {/* Thêm các event listener vào thẻ audio */}
      <audio 
        ref={audioRef} 
        src={currentSong?.url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      ></audio>

      <div className="bg-black h-screen flex flex-col">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isLoggedIn={isLoggedIn} />
          <div className="flex-grow flex flex-col">
            <Header isLoggedIn={isLoggedIn} />
            <div className="overflow-y-auto bg-gradient-to-b from-neutral-800/60 to-black rounded-lg m-2">
              <Routes>
                <Route path="/" element={isLoggedIn ? <AlbumPage onSongSelect={handleSelectSong} /> : <HomePage />} />
                <Route path="/album/:albumId" element={<AlbumPage onSongSelect={handleSelectSong} />} />
                <Route path="/search" element={<SearchPage />} />
              </Routes>
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
        
        <button onClick={handleLogin} className="absolute top-5 right-48 z-20 bg-green-500 text-white px-3 py-1 rounded text-xs">
          Toggle Login
        </button>
      </div>
    </BrowserRouter>
  );
}

export default App;