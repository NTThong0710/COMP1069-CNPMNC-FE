import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation, Link, Navigate } from "react-router-dom";
import { GoHome, GoSearch, GoBook } from "react-icons/go"; // Icon cho Mobile Nav

// Components & Pages
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PlayerBar from "./components/PlayerBar";
import PlayerBarActive from "./components/PlayerBarActive";
import RightSidebar from "./components/RightSidebar";
import HomePage from "./pages/client/HomePage";
import AlbumPage from "./pages/client/AlbumPage";
import SearchPage from "./pages/client/SearchPage";
import Login from "./pages/client/Login";
import Register from "./pages/client/Register";
import LikedSongs from "./pages/client/LikedSongsPage";
import PlaylistPage from "./pages/client/PlaylistPage";
import ArtistPage from "./pages/client/ArtistPage";
import ProfilePage from "./pages/client/ProfilePage";
import HistoryPage from "./pages/client/HistoryPage";
import SongPage from "./pages/client/SongPage";

import AdminLayout from "./pages/admin/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import SongManager from "./pages/admin/SongManager";

import { useAuth } from "./context/AuthContext";
import ArtistManager from "./pages/admin/ArtistManager";
import UserManager from "./pages/admin/UserManager";
import AdminSettings from "./pages/admin/AdminSettings";
import AlbumManager from "./pages/admin/AlbumManager";

const SCROLL_SELECTOR = ".main-content-scroll";

// === COMPONENT MOBILE NAVIGATION (Chỉ hiện trên Mobile) ===
const MobileNav = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-neutral-800 flex justify-around items-center h-16 z-50 pb-safe">
            <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-white' : 'text-neutral-400'}`}>
                <GoHome size={24} />
                <span className="text-[10px]">Home</span>
            </Link>
            <Link to="/search" className={`flex flex-col items-center gap-1 ${isActive('/search') ? 'text-white' : 'text-neutral-400'}`}>
                <GoSearch size={24} />
                <span className="text-[10px]">Search</span>
            </Link>
            <Link to="/likedSongs" className={`flex flex-col items-center gap-1 ${isActive('/likedSongs') ? 'text-white' : 'text-neutral-400'}`}>
                <GoBook size={24} />
                <span className="text-[10px]">Library</span>
            </Link>
        </div>
    );
};

function AppLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const BASE_API_URL = import.meta.env.VITE_API_URL;

  // State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false); // Mặc định false trên mọi thiết bị
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffleActive, setShuffleActive] = useState(false);
  const [isRepeatActive, setRepeatActive] = useState(false);

  const handleToggleSidebarCollapse = () => setIsSidebarCollapsed((prev) => !prev);
  const handleCloseRightSidebar = () => setIsRightSidebarVisible(false);

  // --- LOGIC PHÁT NHẠC & LỊCH SỬ ---
  const handleSelectSong = (song, playlist = [], index = 0) => {
    setCurrentSong(song);
    setCurrentPlaylist(playlist.length > 0 ? playlist : [song]);
    setCurrentIndex(index);
    setIsPlaying(true); 
    
    // Chỉ mở RightSidebar trên Desktop (md trở lên)
    if (window.innerWidth >= 768) {
        setIsRightSidebarVisible(true);
    }
  };

  useEffect(() => {
    const saveHistory = async () => {
        if (user && currentSong?.id && currentSong.id.length === 24) {
            try {
                await fetch(`${BASE_API_URL}/history`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id || user._id,
                        songId: currentSong.id
                    })
                });
            } catch (error) { console.warn("History auto-save failed", error); }
        }
    };
    const timer = setTimeout(() => saveHistory(), 2000);
    return () => clearTimeout(timer);
  }, [currentSong, user]);

  const handlePlayPause = () => { if (!currentSong) return; setIsPlaying(!isPlaying); };

  const handleNextSong = useCallback(() => {
    if (currentPlaylist.length === 0) return;
    let nextIndex;
    if (isShuffleActive) {
      if (currentPlaylist.length === 1) nextIndex = 0;
      else {
          do { nextIndex = Math.floor(Math.random() * currentPlaylist.length); } 
          while (nextIndex === currentIndex);
      }
    } else {
      nextIndex = (currentIndex + 1) % currentPlaylist.length;
    }
    setCurrentIndex(nextIndex);
    setCurrentSong(currentPlaylist[nextIndex]);
    setIsPlaying(true);
  }, [currentPlaylist, currentIndex, isShuffleActive]);

  const handlePrevSong = () => {
    if (currentPlaylist.length === 0) return;
    const prevIndex = currentIndex === 0 ? currentPlaylist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentSong(currentPlaylist[prevIndex]);
    setIsPlaying(true);
  };

  const handleToggleShuffle = () => setShuffleActive(prev => !prev);
  const handleToggleRepeat = () => setRepeatActive(prev => !prev);

  // --- LAYOUT CHÍNH ---
  const mainLayoutContent = (user?.role === 'admin') ? (
      <Navigate to="/admin" replace />
  ) : (
    <div className="bg-black h-screen flex flex-col">
      
      {/* 1. HEADER (Ẩn trên mobile nếu muốn, nhưng giữ lại để có nút search) */}
      <div className="hidden md:block">
          <Header isLoggedIn={isLoggedIn} />
      </div>
      {/* Mobile Header rút gọn */}
      <div className="md:hidden">
          <Header isLoggedIn={isLoggedIn} />
      </div>
      
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* 2. SIDEBAR (Chỉ hiện trên Desktop/Tablet) */}
        <div className="hidden md:block h-full">
            <Sidebar
                isLoggedIn={isLoggedIn}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={handleToggleSidebarCollapse}
            />
        </div>
        
        {/* 3. MAIN CONTENT */}
        <main className="flex-1 min-w-0 p-0 md:p-2 md:pr-3 relative">
          {/* Thêm padding bottom trên mobile để tránh bị che bởi PlayerBar và MobileNav */}
          <div className="h-full overflow-y-auto bg-black md:bg-neutral-900 md:rounded-lg main-content-scroll pb-32 md:pb-0">
            <Outlet />
          </div>
        </main>

        {/* 4. RIGHT SIDEBAR (Chỉ hiện trên Desktop và khi được bật) */}
        {isRightSidebarVisible && (
          <div className="hidden md:block w-[360px] flex-shrink-0 transition-all duration-300 p-2 pl-0 h-full">
            <RightSidebar
              song={currentSong}
              onClose={handleCloseRightSidebar}
              onSongSelect={handleSelectSong}
            />
          </div>
        )}
      </div>

      {/* 5. PLAYER BAR (Luôn hiện, nằm trên MobileNav) */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40">
          {currentSong ? (
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
             !isLoggedIn && <PlayerBar />
          )}
      </div>

      {/* 6. MOBILE NAVIGATION (Thanh điều hướng dưới cùng cho điện thoại) */}
      <MobileNav />

    </div>
  );

  return (
    <Routes>
      <Route element={<div className="w-screen h-screen flex justify-center items-center bg-black"><Outlet /></div>}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      
      <Route path="/" element={mainLayoutContent}>
        <Route index element={<HomePage isLoggedIn={isLoggedIn} onSongSelect={handleSelectSong} />} />
        <Route path="/album/:albumId" element={<AlbumPage onSongSelect={handleSelectSong} />} />
        <Route path="/search" element={<SearchPage onSongSelect={handleSelectSong} />} />
        <Route path="/likedSongs" element={<LikedSongs onSongSelect={handleSelectSong} />} />
        <Route path="/playlist/:playlistId" element={<PlaylistPage onSongSelect={handleSelectSong} />} />
        <Route path="/artist/:artistId" element={<ArtistPage onSongSelect={handleSelectSong} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/history" element={<HistoryPage onSongSelect={handleSelectSong} />} />
        <Route path="/song/:songId" element={<SongPage onSongSelect={handleSelectSong} />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
         <Route index element={<DashboardHome />} />
         <Route path="songs" element={<SongManager />} />
         <Route path="artists" element={<ArtistManager/>} />
         <Route path="albums" element={<AlbumManager />} />
         <Route path="users" element={<UserManager />} />
         <Route path="settings" element={<AdminSettings />} />
      </Route>

    </Routes>
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