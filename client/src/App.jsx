import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation, Link, Navigate, useNavigate } from "react-router-dom";
import { GoHome, GoBook } from "react-icons/go"; // Bỏ GoSearch
import { FaHistory, FaListUl } from "react-icons/fa";
import { Radio } from 'lucide-react'; 

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

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import SongManager from "./pages/admin/SongManager";
import ArtistManager from "./pages/admin/ArtistManager";
import UserManager from "./pages/admin/UserManager";
import AdminSettings from "./pages/admin/AdminSettings";
import AlbumManager from "./pages/admin/AlbumManager";

import { useAuth } from "./context/AuthContext";
import { useQueue } from "./context/QueueContext";
import { useToast } from "./context/ToastContext";
import { socket } from "./utils/socket"; 

// =========================================================
// 1. MOBILE NAV (5 Nút: Home - History - Party - Liked - Library)
// =========================================================
const MobileNav = ({ onOpenRoom }) => { 
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const isRoomActive = location.pathname.includes('/room/');

  // Chia đều 5 nút (w-1/5 = 20%)
  const navItemClass = (active) => 
    `flex flex-col items-center justify-center gap-1 w-1/5 h-full cursor-pointer transition-colors ${active ? 'text-green-500' : 'text-neutral-400 hover:text-white'}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-neutral-800 flex justify-between items-center h-16 z-50 pb-safe px-1">
      
      {/* 1. Home */}
      <Link to="/" className={navItemClass(isActive('/'))}>
        <GoHome size={24} />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      
      {/* 2. History (Đã khôi phục) */}
      <Link to="/history" className={navItemClass(isActive('/history'))}>
        <FaHistory size={22} />
        <span className="text-[10px] font-medium">History</span>
      </Link>

      {/* 3. Party (Nằm giữa) */}
      <div onClick={onOpenRoom} className={navItemClass(isRoomActive)}>
        <div className={`p-1 rounded-full ${isRoomActive ? 'bg-green-500/20' : ''}`}>
            <Radio size={24} className={isRoomActive ? "animate-pulse text-green-500" : ""} />
        </div>
        <span className="text-[10px] font-medium">Party</span>
      </div>

      {/* 4. Liked */}
      <Link to="/likedSongs" className={navItemClass(isActive('/likedSongs'))}>
        <GoBook size={24} />
        <span className="text-[10px] font-medium">Liked</span>
      </Link>
      
      {/* 5. Library */}
      <Link to="/playlists" className={navItemClass(isActive('/playlists'))}>
        <FaListUl size={22} />
        <span className="text-[10px] font-medium">Library</span>
      </Link>

    </div>
  );
};

// =========================================================
// 2. MY PLAYLISTS PAGE
// =========================================================
const MyPlaylistsPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const BASE_API_URL = import.meta.env.VITE_API_URL;
  const [playlists, setPlaylists] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${BASE_API_URL}/playlists/me`, {
           headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPlaylists(data.playlists || []);
        }
      } catch (err) { console.error(err); }
    };
    fetchPlaylists();
  }, [user, BASE_API_URL]);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return addToast("Name required", "error");
    setIsCreating(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BASE_API_URL}/playlists`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newPlaylistName, description: "", songs: [] }),
      });
      if (res.ok) {
        const data = await res.json();
        setPlaylists((prev) => [data.data || data, ...prev]);
        addToast("Created!", "success");
        setNewPlaylistName(""); setIsCreateModalOpen(false);
      } else {
        addToast("Failed to create", "error");
      }
    } catch (error) { addToast("Error", "error"); } 
    finally { setIsCreating(false); }
  };

  return (
    <div className="p-4 pt-8 text-white min-h-screen pb-24">
      <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
      <div className="grid grid-cols-2 gap-4">
        <div onClick={() => setIsCreateModalOpen(true)} className="aspect-square bg-neutral-800 rounded-lg flex flex-col items-center justify-center border border-dashed border-neutral-600 opacity-70 cursor-pointer hover:opacity-100 transition">
           <span className="text-4xl text-neutral-400">+</span><span className="text-xs mt-2 text-neutral-400">Create New</span>
        </div>
        {playlists.map(pl => {
            let cover = pl.imageUrl || pl.cover || pl.image;
            if (!cover && pl.songs?.length > 0) cover = pl.songs[0].song?.cover || pl.songs[0].song?.image;
            return (
              <Link to={`/playlist/${pl._id}`} key={pl._id} className="block group">
                <div className="aspect-square bg-neutral-800 rounded-lg overflow-hidden mb-2 relative shadow-lg">
                    {cover ? <img src={cover} alt={pl.name} className="w-full h-full object-cover group-hover:opacity-80 transition"/> 
                           : <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-800 flex items-center justify-center"><span className="font-bold text-2xl">{pl.name?.[0]}</span></div>}
                </div>
                <p className="font-bold truncate text-sm">{pl.name}</p>
                <p className="text-xs text-neutral-400">{pl.songs?.length || 0} songs</p>
              </Link>
            );
        })}
      </div>
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#282828] w-full max-w-sm rounded-xl p-6 border border-neutral-700">
            <h3 className="text-xl font-bold text-white mb-4">New Playlist</h3>
            <input type="text" autoFocus value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} placeholder="My Playlist" className="w-full bg-[#3e3e3e] text-white p-3 rounded-lg mb-6 outline-none"/>
            <div className="flex gap-3">
              <button onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-3 rounded-full text-white border border-neutral-600">Cancel</button>
              <button onClick={handleCreatePlaylist} disabled={isCreating} className="flex-1 py-3 rounded-full bg-green-500 text-black font-bold">Create</button>
            </div>
          </div>
        </div>
      )}
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
  const { queue, getQueueCount } = useQueue();

  const [showMainHeader, setShowMainHeader] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  
  // State Active Room (Persistent)
  const [activeRoomId, setActiveRoomId] = useState(() => localStorage.getItem("activeRoomId"));

  // Player State
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [isShuffleActive, setShuffleActive] = useState(false);
  const [isRepeatActive, setRepeatActive] = useState(false);
  const [isNoSongModalOpen, setIsNoSongModalOpen] = useState(false);

  const handleToggleSidebarCollapse = () => setIsSidebarCollapsed((prev) => !prev);
  const handleCloseRightSidebar = () => setIsRightSidebarVisible(false);

  // --- LOGIC 0: ACTIVE ROOM ---
  useEffect(() => {
    if (location.pathname.includes("/room/")) {
      const roomId = location.pathname.split("/room/")[1];
      setActiveRoomId(roomId);
      localStorage.setItem("activeRoomId", roomId);
      if (!socket.connected) socket.connect();
    }
  }, [location]);

  // --- LOGIC 1: MỞ STREAM PARTY ---
  const handleOpenStreamParty = () => {
    if (activeRoomId) {
      navigate(`/room/${activeRoomId}`);
    } else {
      setIsRoomModalOpen(true);
    }
  };

  // --- LOGIC 2: RỜI PHÒNG ---
  const handleLeaveRoom = () => {
    if (activeRoomId) {
        socket.emit("leave_room", activeRoomId);
        setActiveRoomId(null);
        localStorage.removeItem("activeRoomId");
        addToast("Đã rời phòng Stream", "info");
        navigate("/");
    }
  };

  // --- LOGIC 3: CHỌN BÀI HÁT (Có Socket) ---
  const handleSelectSong = useCallback((song, playlist = [], index = 0) => {
    if (!song) return setIsNoSongModalOpen(true);
    
    console.log("▶ Playing:", song.title); 
    setCurrentSong(song);
    setCurrentPlaylist(playlist.length > 0 ? playlist : [song]);
    setCurrentIndex(index);
    setIsPlaying(true);
    if (window.innerWidth >= 768) setIsRightSidebarVisible(true);

    const targetRoomId = activeRoomId || (location.pathname.includes("/room/") ? location.pathname.split("/room/")[1] : null);

    if (targetRoomId) {
        console.log(`📡 [CLIENT] Change song -> Room ${targetRoomId}`);
        socket.emit("change_song", { roomId: targetRoomId, song });
    }
  }, [activeRoomId, location]);

  // --- LOGIC 4: LẮNG NGHE SOCKET ---
  useEffect(() => {
    if (!user) return;

    const handleReceiveAction = (data) => {
      if (data.action === 'play') {
        if (currentSong?.id !== data.song.id && currentSong?._id !== data.song._id) {
          setCurrentSong(data.song);
        }
        setIsPlaying(true);
        addToast(`Host playing: ${data.song.title}`, 'info');
      } else if (data.action === 'pause') {
        setIsPlaying(false);
      }
    };

    const handleSongChange = (data) => {
        setCurrentSong(data.song);
        setIsPlaying(true);
        addToast(`Changed to: ${data.song.title}`, 'info');
    };

    socket.on("receive_action", handleReceiveAction);
    socket.on("receive_song_change", handleSongChange);

    return () => {
      socket.off("receive_action", handleReceiveAction);
      socket.off("receive_song_change", handleSongChange);
    };
  }, [currentSong, user, addToast]);

  // --- LOGIC 5: PLAY/PAUSE (Có Socket) ---
  const handlePlayPause = useCallback(() => {
    if (!currentSong) return;
    const newStatus = !isPlaying;
    setIsPlaying(newStatus); 

    const targetRoomId = activeRoomId || (location.pathname.includes("/room/") ? location.pathname.split("/room/")[1] : null);

    if (targetRoomId) {
        socket.emit("sync_action", {
            roomId: targetRoomId,
            action: newStatus ? 'play' : 'pause',
            song: currentSong
        });
    }
  }, [currentSong, isPlaying, location, activeRoomId]);

  // --- LOGIC 6: PLAYER CONTROLS ---
  const handleNextSong = useCallback(() => {
    if (queue.length > 0 && currentQueueIndex + 1 < queue.length) {
        const nextSong = queue[currentQueueIndex + 1];
        setCurrentSong(nextSong); setCurrentQueueIndex(prev => prev + 1); setIsPlaying(true); return;
    }
    if (currentPlaylist.length === 0) return;
    let nextIndex = isShuffleActive ? Math.floor(Math.random() * currentPlaylist.length) : (currentIndex + 1) % currentPlaylist.length;
    setCurrentIndex(nextIndex); setCurrentSong(currentPlaylist[nextIndex]); setIsPlaying(true);
  }, [currentPlaylist, currentIndex, isShuffleActive, queue, currentQueueIndex]);

  const handlePrevSong = useCallback(() => {
    if (queue.length > 0 && currentQueueIndex - 1 >= 0) {
        const prevSong = queue[currentQueueIndex - 1];
        setCurrentSong(prevSong); setCurrentQueueIndex(prev => prev - 1); setIsPlaying(true); return;
    }
    if (currentPlaylist.length === 0) return;
    const prevIndex = currentIndex === 0 ? currentPlaylist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex); setCurrentSong(currentPlaylist[prevIndex]); setIsPlaying(true);
  }, [currentPlaylist, currentIndex, queue, currentQueueIndex]);

  const handleToggleShuffle = useCallback(() => setShuffleActive(prev => !prev), []);
  const handleToggleRepeat = useCallback(() => setRepeatActive(prev => !prev), []);
  const handlePlayFromQueue = useCallback((qIndex) => {
    if (qIndex >= 0 && qIndex < queue.length) { setCurrentSong(queue[qIndex]); setCurrentQueueIndex(qIndex); setIsPlaying(true); }
  }, [queue]);

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
            <Outlet context={{ setShowMainHeader, handleSelectSong, handleLeaveRoom }} />
          </div>
        </main>

        {isRightSidebarVisible && <div className="hidden md:block w-[360px] flex-shrink-0 transition-all duration-300 p-2 pl-0 h-full">
            <RightSidebar song={currentSong} onClose={handleCloseRightSidebar} onSongSelect={handleSelectSong} />
        </div>}
      </div>

      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40">
        {currentSong && <PlayerBarActive 
            song={currentSong} isPlaying={isPlaying} onPlayPause={handlePlayPause} 
            onNext={handleNextSong} onPrev={handlePrevSong} isShuffleActive={isShuffleActive} 
            onToggleShuffle={handleToggleShuffle} isRepeatActive={isRepeatActive} 
            onToggleRepeat={handleToggleRepeat} queue={queue} queueCount={getQueueCount()} 
            onPlayFromQueue={handlePlayFromQueue} 
        />}
      </div>

      {isNoSongModalOpen && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#282828] rounded-2xl p-8 max-w-md border border-neutral-700">
            <h2 className="text-2xl font-bold text-white mb-3">No Song Selected</h2>
            <button onClick={() => setIsNoSongModalOpen(false)} className="w-full bg-green-500 text-black font-bold py-3 rounded-lg">Got it</button>
          </div>
      </div>}

      {isRoomModalOpen && <CreateRoomModal onClose={() => setIsRoomModalOpen(false)} />}
      
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