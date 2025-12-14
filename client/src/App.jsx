import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation, Link, Navigate } from "react-router-dom";
import { GoHome, GoSearch, GoBook } from "react-icons/go";
import { FaHistory, FaListUl } from "react-icons/fa"; // ✅ IMPORT ICON MỚI

// Components & Pages
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PlayerBar from "./components/PlayerBar"; // Giữ lại nếu cần dùng fallback
import PlayerBarActive from "./components/PlayerBarActive";
import RightSidebar from "./components/RightSidebar";
import ToastContainer from "./components/ToastContainer";
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

const SCROLL_SELECTOR = ".main-content-scroll";

// === COMPONENT MOBILE NAVIGATION (ĐÃ CẬP NHẬT) ===
const MobileNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Class chung cho các item
  const navItemClass = (path) => 
    `flex flex-col items-center gap-1 w-1/4 ${isActive(path) ? 'text-green-500' : 'text-neutral-400 hover:text-white'}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-neutral-800 flex justify-between items-center h-16 z-50 pb-safe px-2">
      
      {/* 1. Home */}
      <Link to="/" aria-label="Home" className={navItemClass('/')}>
        <GoHome size={24} />
        <span className="text-[10px] font-medium">Home</span>
      </Link>

      {/* 2. History (Thay cho Search) */}
      <Link to="/history" aria-label="History" className={navItemClass('/history')}>
        <FaHistory size={22} />
        <span className="text-[10px] font-medium">History</span>
      </Link>

      {/* 3. Library (Liked Songs) */}
      <Link to="/likedSongs" aria-label="Liked" className={navItemClass('/likedSongs')}>
        <GoBook size={24} />
        <span className="text-[10px] font-medium">Liked</span>
      </Link>

      {/* 4. Playlists (MỚI THÊM) */}
      <Link to="/playlists" aria-label="Playlists" className={navItemClass('/playlists')}>
        <FaListUl size={22} />
        <span className="text-[10px] font-medium">Playlists</span>
      </Link>

    </div>
  );
};

// === COMPONENT MY PLAYLISTS PAGE (DÀNH CHO MOBILE) ===
// Nhớ import thêm hook useToast ở trên đầu file App.jsx nếu chưa có:
// import { useToast } from "./context/ToastContext"; 

// === COMPONENT MY PLAYLISTS PAGE (ĐÃ CÓ CHỨC NĂNG TẠO MỚI) ===
const MyPlaylistsPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast(); // Dùng toast để thông báo
  const BASE_API_URL = import.meta.env.VITE_API_URL;

  const [playlists, setPlaylists] = useState([]);
  
  // State cho Modal tạo mới
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Fetch danh sách playlist ban đầu
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
  }, [user]);

  // Xử lý tạo Playlist
  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      addToast("Playlist name cannot be empty", "error");
      return;
    }

    setIsCreating(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BASE_API_URL}/playlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newPlaylistName,
          description: "",
          songs: [],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newPlaylist = data.data || data; // Tùy cấu trúc trả về của BE
        
        // Cập nhật UI ngay lập tức
        setPlaylists((prev) => [newPlaylist, ...prev]);
        
        addToast("Playlist created successfully!", "success");
        setNewPlaylistName(""); // Reset tên
        setIsCreateModalOpen(false); // Đóng modal
      } else {
        const errData = await res.json();
        addToast(errData.message || "Failed to create playlist", "error");
      }
    } catch (error) {
      console.error(error);
      addToast("Something went wrong", "error");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-4 pt-8 text-white min-h-screen pb-24">
      <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
      <div className="grid grid-cols-2 gap-4">
        
        {/* 1. Nút tạo Playlist mới (Có onClick mở Modal) */}
        <div 
          onClick={() => setIsCreateModalOpen(true)}
          className="aspect-square bg-neutral-800 rounded-lg flex flex-col items-center justify-center border border-dashed border-neutral-600 opacity-70 cursor-pointer hover:opacity-100 hover:bg-neutral-700 transition"
        >
           <span className="text-4xl text-neutral-400">+</span>
           <span className="text-xs mt-2 text-neutral-400">Create New</span>
        </div>

        {/* 2. Danh sách Playlist */}
        {playlists.map(pl => {
            // Logic lấy ảnh (như đã làm trước đó)
            let coverImage = pl.imageUrl || pl.cover || pl.image;
            if (!coverImage && pl.songs && pl.songs.length > 0) {
                const firstItem = pl.songs[0];
                const songData = firstItem.song || firstItem; 
                coverImage = songData.cover || songData.image || songData.imageUrl;
            }

            return (
              <Link to={`/playlist/${pl._id}`} key={pl._id} className="block group">
                <div className="aspect-square bg-neutral-800 rounded-lg overflow-hidden mb-2 relative shadow-lg">
                    {coverImage && !coverImage.includes("bg-gradient") ? (
                        <img 
                            src={coverImage} 
                            alt={pl.name} 
                            className="w-full h-full object-cover group-hover:opacity-80 transition"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-800 group-hover:opacity-80 transition flex items-center justify-center">
                            <span className="font-bold text-2xl uppercase">{pl.name?.[0]}</span>
                        </div>
                    )}
                </div>
                <p className="font-bold truncate text-sm">{pl.name}</p>
                <p className="text-xs text-neutral-400">{pl.songs?.length || 0} songs</p>
              </Link>
            );
        })}
      </div>

      {/* --- MODAL TẠO PLAYLIST --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#282828] w-full max-w-sm rounded-xl p-6 shadow-2xl border border-neutral-700">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Give your playlist a name</h3>
            
            <input
              type="text"
              autoFocus
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="My Awesome Playlist"
              className="w-full bg-[#3e3e3e] text-white p-3 rounded-lg border border-transparent focus:border-white outline-none mb-6 text-center placeholder-neutral-500"
              onKeyDown={(e) => e.key === "Enter" && handleCreatePlaylist()}
            />

            <div className="flex gap-3">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 py-3 rounded-full font-bold text-white bg-transparent border border-neutral-600 hover:border-white transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreatePlaylist}
                disabled={isCreating || !newPlaylistName.trim()}
                className="flex-1 py-3 rounded-full font-bold text-black bg-green-500 hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function AppLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const { addToast } = useToast();
  const isLoggedIn = !!user;
  const BASE_API_URL = import.meta.env.VITE_API_URL;

  // ✅ STATE QUẢN LÝ HEADER (TRUE = HIỆN, FALSE = ẨN)
  const [showMainHeader, setShowMainHeader] = useState(true);

  const { queue, getQueueCount } = useQueue();

  // State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(false);
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

  // --- LOGIC PHÁT NHẠC ---
  const handleSelectSong = (song, playlist = [], index = 0) => {
    if (!song) {
      setIsNoSongModalOpen(true);
      return;
    }
    setCurrentSong(song);
    setCurrentPlaylist(playlist.length > 0 ? playlist : [song]);
    setCurrentIndex(index);
    setIsPlaying(true);

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
    if (queue.length > 0) {
      const nextQueueIndex = currentQueueIndex + 1;
      if (nextQueueIndex < queue.length) {
        const nextSong = queue[nextQueueIndex];
        setCurrentSong(nextSong);
        setCurrentQueueIndex(nextQueueIndex);
        setIsPlaying(true);
        addToast(`Now playing: ${nextSong.title}`, "success", 2000);
        return;
      } else {
        addToast("End of queue reached", "warning", 2000);
        return;
      }
    }

    if (currentPlaylist.length === 0) {
      addToast("No songs to play", "warning", 2000);
      return;
    }

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
  }, [currentPlaylist, currentIndex, isShuffleActive, queue, currentQueueIndex, addToast]);

  const handlePrevSong = useCallback(() => {
    if (queue.length > 0) {
      const prevQueueIndex = currentQueueIndex - 1;
      if (prevQueueIndex >= 0) {
        const prevSong = queue[prevQueueIndex];
        setCurrentSong(prevSong);
        setCurrentQueueIndex(prevQueueIndex);
        setIsPlaying(true);
        addToast(`Playing previous from queue: ${prevSong.title}`, "success", 2000);
        return;
      } else {
        addToast("Already at the beginning of queue", "warning", 2000);
        return;
      }
    }

    if (currentPlaylist.length === 0) {
      addToast("No songs to play", "warning", 2000);
      return;
    }

    const prevIndex = currentIndex === 0 ? currentPlaylist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentSong(currentPlaylist[prevIndex]);
    setIsPlaying(true);
  }, [currentPlaylist, currentIndex, queue, currentQueueIndex, addToast]);

  const handleToggleShuffle = useCallback(() => {
    if (queue.length === 0) {
      addToast("Queue is empty, cannot shuffle", "warning", 2000);
      return;
    }
    const randomIndex = Math.floor(Math.random() * queue.length);
    const randomSong = queue[randomIndex];
    setCurrentSong(randomSong);
    setCurrentQueueIndex(randomIndex);
    setIsPlaying(true);
    setShuffleActive(prev => !prev);
    addToast(`Hiện tại đang phát: ${randomSong.title}`, "success", 2000);
  }, [queue, addToast]);

  const handleToggleRepeat = () => setRepeatActive(prev => !prev);

  const handlePlayFromQueue = useCallback((queueIndex) => {
    if (queueIndex >= 0 && queueIndex < queue.length) {
      const song = queue[queueIndex];
      setCurrentSong(song);
      setCurrentQueueIndex(queueIndex);
      setIsPlaying(true);
      addToast(`Now playing: ${song.title}`, "success", 2000);
    }
  }, [queue, addToast]);

  // --- LAYOUT CHÍNH ---
  const mainLayoutContent = (user?.role === 'admin') ? (
    <Navigate to="/admin" replace />
  ) : (
    <div className="bg-black h-screen flex flex-col">

      {/* ✅ BỌC HEADER ĐỂ LÀM HIỆU ỨNG TRƯỢT ẨN/HIỆN */}
      <div
        className={`transition-all duration-500 ease-in-out z-40 overflow-hidden ${showMainHeader
          ? 'max-h-20 opacity-100 translate-y-0 overflow-visible'
          : 'max-h-0 opacity-0 -translate-y-full overflow-hidden'
          }`}
      >
        <div className="hidden md:block">
          <Header isLoggedIn={isLoggedIn} />
        </div>
        <div className="md:hidden">
          <Header isLoggedIn={isLoggedIn} />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">

        {isLoggedIn && (
          <div className="hidden md:block h-full">
            <Sidebar
              isLoggedIn={isLoggedIn}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={handleToggleSidebarCollapse}
            />
          </div>
        )}

        <main className="flex-1 min-w-0 p-0 md:p-2 md:pr-3 relative">
          <div className="h-full overflow-y-auto bg-black md:bg-neutral-900 md:rounded-lg main-content-scroll pb-32 md:pb-0">

            {/* ✅ TRUYỀN HÀM ĐIỀU KHIỂN HEADER XUỐNG CÁC TRANG CON */}
            <Outlet context={{ setShowMainHeader }} />

          </div>
        </main>

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

      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40">
        {currentSong && (
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
            queue={queue}
            queueCount={getQueueCount()}
            onPlayFromQueue={handlePlayFromQueue}
          />
        )}
      </div>

      {isNoSongModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#282828] rounded-2xl p-8 max-w-md w-full mx-4 border border-neutral-700 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-3">No Song Selected</h2>
            <p className="text-neutral-300 mb-6">Please select a song to play.</p>
            <button
              onClick={() => setIsNoSongModalOpen(false)}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {isLoggedIn && <MobileNav />}

    </div>
  );

  return (
    <Routes>
      <Route element={<div className="w-screen h-screen flex justify-center items-center bg-black"><Outlet /></div>}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
      </Route>

      <Route path="/" element={mainLayoutContent}>
        <Route index element={<HomePage isLoggedIn={isLoggedIn} onSongSelect={handleSelectSong} />} />
        <Route path="/album/:id" element={<AlbumPage onSongSelect={handleSelectSong} />} />
        <Route path="/search" element={<SearchPage onSongSelect={handleSelectSong} />} />
        <Route path="/likedSongs" element={<LikedSongs onSongSelect={handleSelectSong} />} />
        <Route path="/playlist/:playlistId" element={<PlaylistPage onSongSelect={handleSelectSong} />} />
        <Route path="/artist/:artistId" element={<ArtistPage onSongSelect={handleSelectSong} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/history" element={<HistoryPage onSongSelect={handleSelectSong} />} />
        <Route path="/song/:songId" element={<SongPage onSongSelect={handleSelectSong} />} />
        <Route path="/donate" element={<DonatePage />} />
        
        {/* ✅ ROUTE MỚI CHO PLAYLIST */}
        <Route path="/playlists" element={<MyPlaylistsPage />} />
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
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <AppLayout />
    </BrowserRouter>
  );
}
export default App;