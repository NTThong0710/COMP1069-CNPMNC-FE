import { useEffect, useCallback, useState } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation, Link, Navigate, useNavigate } from "react-router-dom";
import { GoHome, GoBook } from "react-icons/go";
import { FaHistory, FaListUl } from "react-icons/fa";
import { Radio } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSong, setIsPlaying, toggleShuffle, toggleRepeat,
  setCurrentIndex, setCurrentQueueIndex
} from './redux/slices/playerSlice';
import {
  toggleSidebar, setRightSidebarVisible, setRoomModalOpen, setActiveRoomId
} from './redux/slices/uiSlice';

// --- IMPORTS COMPONENTS & PAGES ---
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PlayerBarActive from "./components/PlayerBarActive";
import RightSidebar from "./components/RightSidebar";
import ToastContainer from "./components/ToastContainer";
import CreateRoomModal from "./components/CreateRoomModal";

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
import AuthSuccess from "./pages/client/AuthSuccess";
import DonatePage from './pages/client/DonatePage';
import RoomPage from "./pages/client/RoomPage";
import MyPlaylistsPage from "./pages/client/MyPlaylistsPage"; // IMPORTED NEW PAGE

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import SongManager from "./pages/admin/SongManager";
import ArtistManager from "./pages/admin/ArtistManager";
import UserManager from "./pages/admin/UserManager";
import AdminSettings from "./pages/admin/AdminSettings";
import AlbumManager from "./pages/admin/AlbumManager";

import { useAuth } from "./context/AuthContext";
import { useToast } from "./context/ToastContext";
import { socket } from "./utils/socket";
import { useAudioSocket } from "./hooks/useAudioSocket";

// =========================================================
// 1. MOBILE NAV 
// =========================================================
const MobileNav = ({ onOpenRoom }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const isRoomActive = location.pathname.includes('/room/');

  const navItemClass = (active) =>
    `flex flex-col items-center justify-center gap-1 w-1/5 h-full cursor-pointer transition-colors ${active ? 'text-green-500' : 'text-neutral-400 hover:text-white'}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-neutral-800 flex justify-between items-center h-16 z-50 pb-safe px-1">
      <Link to="/" className={navItemClass(isActive('/'))}>
        <GoHome size={24} />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      <Link to="/history" className={navItemClass(isActive('/history'))}>
        <FaHistory size={22} />
        <span className="text-[10px] font-medium">History</span>
      </Link>
      <div onClick={onOpenRoom} className={navItemClass(isRoomActive)}>
        <div className={`p-1 rounded-full ${isRoomActive ? 'bg-green-500/20' : ''}`}>
          <Radio size={24} className={isRoomActive ? "animate-pulse text-green-500" : ""} />
        </div>
        <span className="text-[10px] font-medium">Party</span>
      </div>
      <Link to="/likedSongs" className={navItemClass(isActive('/likedSongs'))}>
        <GoBook size={24} />
        <span className="text-[10px] font-medium">Liked</span>
      </Link>
      <Link to="/playlists" className={navItemClass(isActive('/playlists'))}>
        <FaListUl size={22} />
        <span className="text-[10px] font-medium">Library</span>
      </Link>
    </div>
  );
};

// =========================================================
// 3. APP LAYOUT
// =========================================================
function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const isLoggedIn = !!user;
  const BASE_API_URL = import.meta.env.VITE_API_URL;

  const dispatch = useDispatch();
  // Redux UI State
  const { isSidebarCollapsed, isRightSidebarVisible, isRoomModalOpen, activeRoomId } = useSelector(state => state.ui);
  // Redux Player State
  const {
    currentSong, isPlaying, currentPlaylist, currentIndex,
    queue, currentQueueIndex, isShuffleActive, isRepeatActive
  } = useSelector(state => state.player);

  const [showMainHeader, setShowMainHeader] = useState(true); // Keep local UI state that is very specific to layout scroll
  const [isNoSongModalOpen, setIsNoSongModalOpen] = useState(false);

  const handleToggleSidebarCollapse = () => dispatch(toggleSidebar());
  const handleCloseRightSidebar = () => dispatch(setRightSidebarVisible(false));
  const handleOpenRoomModal = () => dispatch(setRoomModalOpen(true));
  const handleCloseRoomModal = () => dispatch(setRoomModalOpen(false));

  // --- CUSTOM HOOKS ---
  const { leaveRoom, broadcastSongChange, broadcastPlayPause } = useAudioSocket();

  // --- LOGIC 0: ACTIVE ROOM ---
  useEffect(() => {
    if (location.pathname.includes("/room/")) {
      const roomId = location.pathname.split("/room/")[1];
      dispatch(setActiveRoomId(roomId));
      if (!socket.connected) socket.connect();
    }
  }, [location, dispatch]);

  // --- LOGIC 1: MỞ STREAM PARTY ---
  const handleOpenStreamParty = () => {
    if (activeRoomId) {
      navigate(`/room/${activeRoomId}`);
    } else {
      handleOpenRoomModal();
    }
  };

  // --- LOGIC 2: RỜI PHÒNG ---
  const handleLeaveRoom = () => {
    if (activeRoomId) {
      leaveRoom(); // Use Hook
      addToast("Đã rời phòng Stream", "info");
      navigate("/");
    }
  };

  // --- LOGIC 3: CHỌN BÀI HÁT (Có Socket) ---
  const handleSelectSong = useCallback((song, playlist = [], index = 0) => {
    if (!song) return setIsNoSongModalOpen(true);

    console.log("▶ Playing:", song.title);
    dispatch(setSong({ song, playlist, index }));

    if (window.innerWidth >= 768) dispatch(setRightSidebarVisible(true));

    // Socket Sync via Hook
    broadcastSongChange(song);

  }, [dispatch, broadcastSongChange]);

  // --- LOGIC 4: LẮNG NGHE SOCKET ---
  // (Đã chuyển sang useAudioSocket hook, không cần code ở đây nữa)

  // --- LOGIC 5: PLAY/PAUSE (Có Socket) ---
  const handlePlayPause = useCallback(() => {
    if (!currentSong) return;
    const newStatus = !isPlaying;
    dispatch(setIsPlaying(newStatus));

    // Socket Sync via Hook
    broadcastPlayPause(newStatus, currentSong);

  }, [currentSong, isPlaying, dispatch, broadcastPlayPause]);

  // --- LOGIC 6: PLAYER CONTROLS ---
  const handleNextSong = useCallback(() => {
    let nextSongToPlay = null;

    // 1. Kiểm tra Queue trước
    if (queue.length > 0 && currentQueueIndex + 1 < queue.length) {
      nextSongToPlay = queue[currentQueueIndex + 1];
      dispatch(setCurrentQueueIndex(currentQueueIndex + 1));
    }
    // 2. Nếu không có Queue thì lấy trong Playlist hiện tại
    else if (currentPlaylist.length > 0) {
      let nextIndex = isShuffleActive
        ? Math.floor(Math.random() * currentPlaylist.length)
        : (currentIndex + 1) % currentPlaylist.length;

      nextSongToPlay = currentPlaylist[nextIndex];
      dispatch(setCurrentIndex(nextIndex));
    }

    // 3. Thực hiện chuyển bài (Local & Socket)
    if (nextSongToPlay) {
      dispatch(setSong({ song: nextSongToPlay })); // Just update song, keep playlist/index state as updated above
      const targetRoomId = activeRoomId || (location.pathname.includes("/room/") ? location.pathname.split("/room/")[1] : null);

      if (targetRoomId) {
        console.log(`📡 [AUTO-NEXT] Syncing to room ${targetRoomId}: ${nextSongToPlay.title}`);
        socket.emit("change_song", { roomId: targetRoomId, song: nextSongToPlay });
      }
    }
  }, [currentPlaylist, currentIndex, isShuffleActive, queue, currentQueueIndex, activeRoomId, location, dispatch]);

  const handlePrevSong = useCallback(() => {
    let prevSongToPlay = null;

    if (queue.length > 0 && currentQueueIndex - 1 >= 0) {
      prevSongToPlay = queue[currentQueueIndex - 1];
      dispatch(setCurrentQueueIndex(currentQueueIndex - 1));
    }
    else if (currentPlaylist.length > 0) {
      const prevIndex = currentIndex === 0 ? currentPlaylist.length - 1 : currentIndex - 1;
      prevSongToPlay = currentPlaylist[prevIndex];
      dispatch(setCurrentIndex(prevIndex));
    }

    if (prevSongToPlay) {
      dispatch(setSong({ song: prevSongToPlay }));
      const targetRoomId = activeRoomId || (location.pathname.includes("/room/") ? location.pathname.split("/room/")[1] : null);

      if (targetRoomId) {
        console.log(`📡 [PREV] Syncing to room ${targetRoomId}: ${prevSongToPlay.title}`);
        socket.emit("change_song", { roomId: targetRoomId, song: prevSongToPlay });
      }
    }
  }, [currentPlaylist, currentIndex, queue, currentQueueIndex, activeRoomId, location, dispatch]);

  const handleToggleShuffle = useCallback(() => dispatch(toggleShuffle()), [dispatch]);
  const handleToggleRepeat = useCallback(() => dispatch(toggleRepeat()), [dispatch]);

  useEffect(() => {
    const saveHistory = async () => {
      if (user && currentSong) {
        const songId = currentSong.id || currentSong._id;
        if (songId && songId.length === 24) {
          try {
            await fetch(`${BASE_API_URL}/history`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user.id || user._id, songId })
            });
          } catch (e) { /* ignore */ }
        }
      }
    };
    const timer = setTimeout(saveHistory, 2000);
    return () => clearTimeout(timer);
  }, [currentSong, user, BASE_API_URL]);

  useEffect(() => {
    if (currentSong && isPlaying) {
      document.title = `▶ ${currentSong.title} - ${currentSong.artist}`;
    } else {
      document.title = "Music Party";
    }
  }, [currentSong, isPlaying]);

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;

  return (
    <div className="bg-black h-screen flex flex-col">
      <div className={`transition-all duration-500 z-40 ease-in-out ${showMainHeader ? 'max-h-20 opacity-100 translate-y-0 overflow-visible' : 'max-h-0 opacity-0 -translate-y-full overflow-hidden'}`}>
        <Header isLoggedIn={isLoggedIn} />
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {isLoggedIn && <div className="hidden md:block h-full">
          <Sidebar
            isLoggedIn={isLoggedIn}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleSidebarCollapse}
            onOpenRoom={handleOpenStreamParty}
          />
        </div>}

        <main className="flex-1 min-w-0 p-0 md:p-2 md:pr-3 relative">
          <div className="h-full overflow-y-auto bg-black md:bg-neutral-900 md:rounded-lg main-content-scroll pb-32 md:pb-0">
            <Outlet context={{ setShowMainHeader, handleSelectSong, handleLeaveRoom, currentSong, isPlaying }} />
          </div>
        </main>

        {isRightSidebarVisible && <div className="hidden md:block w-[360px] flex-shrink-0 transition-all duration-300 p-2 pl-0 h-full">
          <RightSidebar song={currentSong} onClose={handleCloseRightSidebar} onSongSelect={handleSelectSong} />
        </div>}
      </div>

      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40">
        {currentSong && <PlayerBarActive
          /* With Redux, many props might be redundant if PlayerBarActive connects to Redux itself. 
             But for now, I'll pass props or let it connect. 
             The original code passed many props. 
             I will refactor PlayerBarActive next to use Redux, so I can reduce props later.
             For now, I'm passing the Redux state as props to minimize breakage until I refactor PlayerBarActive.
           */
          song={currentSong} isPlaying={isPlaying} onPlayPause={handlePlayPause}
          onNext={handleNextSong} onPrev={handlePrevSong} isShuffleActive={isShuffleActive}
          onToggleShuffle={handleToggleShuffle} isRepeatActive={isRepeatActive}
          onToggleRepeat={handleToggleRepeat} queue={queue} queueCount={queue.length}
          onPlayFromQueue={(idx) => dispatch(setCurrentQueueIndex(idx))} // TODO: verify playFromQueue logic in slice
        />}
      </div>

      {isNoSongModalOpen && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-[#282828] rounded-2xl p-8 max-w-md border border-neutral-700">
          <h2 className="text-2xl font-bold text-white mb-3">No Song Selected</h2>
          <button onClick={() => setIsNoSongModalOpen(false)} className="w-full bg-green-500 text-black font-bold py-3 rounded-lg">Got it</button>
        </div>
      </div>}

      {isRoomModalOpen && <CreateRoomModal onClose={handleCloseRoomModal} />}

      {isLoggedIn && <MobileNav onOpenRoom={handleOpenStreamParty} />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route element={<div className="w-screen h-screen flex justify-center items-center bg-black"><Outlet /></div>}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
        </Route>

        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/album/:id" element={<AlbumPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/likedSongs" element={<LikedSongs />} />
          <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
          <Route path="/artist/:artistId" element={<ArtistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/song/:songId" element={<SongPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/playlists" element={<MyPlaylistsPage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="songs" element={<SongManager />} />
          <Route path="artists" element={<ArtistManager />} />
          <Route path="albums" element={<AlbumManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;