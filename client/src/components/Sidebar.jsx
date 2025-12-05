import React, { useState, useEffect, useRef } from "react";
import { GoBook, GoHistory } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import { PiArrowLineLeft } from "react-icons/pi";
import { Heart, Music, AlertTriangle } from "lucide-react"; // Thêm icon AlertTriangle cho modal
import { Link, useLocation } from "react-router-dom";
import LoginTooltip from "./LoginTooltip";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const BASE_API_URL = import.meta.env.VITE_API_URL;

// Component con: Từng dòng Playlist
function PlaylistItem({ id, icon, title, subtitle, isCollapsed, onDelete, isUserPlaylist }) {
  const location = useLocation();
  const targetLink = id === "liked" ? "/likedSongs" : `/playlist/${id}`;
  const isActive = location.pathname === targetLink;

  const iconElement = icon === "heart" ? <Heart className="w-5 h-5 text-white fill-current" /> : <Music className="w-5 h-5 text-neutral-400" />;

  return (
    <div className={`group mt-2 flex items-center justify-between rounded-md transition-colors cursor-pointer ${isActive && !isCollapsed ? "bg-neutral-800" : "hover:bg-[#1A1A1A]"} ${isCollapsed ? "justify-center px-0" : "px-2"}`}>
      <Link to={targetLink} className={`flex items-center p-2 gap-3 flex-1 min-w-0 ${isCollapsed ? "justify-center" : ""}`}>
        <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 rounded overflow-hidden ${id === "liked" ? "bg-gradient-to-br from-[#450af5] to-[#8e8ee5]" : "bg-[#282828]"}`}>
          {iconElement}
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold truncate ${isActive ? "text-green-500" : id === "liked" ? "text-white" : "text-neutral-200 group-hover:text-white"}`}>{title}</p>
            <p className="text-xs mt-1 text-neutral-400 truncate flex items-center gap-1">{subtitle}</p>
          </div>
        )}
      </Link>
      
      {/* Nút Xóa (Chỉ hiện khi hover) */}
      {!isCollapsed && isUserPlaylist && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); // Ngăn click lan ra Link
            onDelete(id); // Gọi hàm mở modal
          }}
          className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 p-2 transition-all"
          title="Delete playlist"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default function Sidebar({ isLoggedIn, isCollapsed, onToggleCollapse }) {
  const { user, likedSongsTrigger } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();

  const [stats, setStats] = useState({ likedCount: 0, playlists: [] });
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  // --- STATE MODAL XÓA ---
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    playlistId: null,
    playlistName: ""
  });

  const createPlaylistRef = useRef(null);

  // Fetch Data
  useEffect(() => {
    const fetchLatestUserData = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${BASE_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setStats({
            likedCount: data.likedSongs?.length || 0,
            playlists: data.playlists || [],
          });
        }
      } catch (error) {
        console.error("Sidebar fetch error:", error);
      }
    };
    fetchLatestUserData();
  }, [user, likedSongsTrigger]);

  // Tooltip & Handlers
  useEffect(() => {
    const handleClickOutside = () => setIsTooltipOpen(false);
    if (isTooltipOpen) window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isTooltipOpen]);

  const handleCreatePlaylistClick = async (event) => {
    if (!isLoggedIn) {
      event.preventDefault();
      event.stopPropagation();
      if (createPlaylistRef.current) {
        const rect = createPlaylistRef.current.getBoundingClientRect();
        setTooltipPosition({ top: rect.top, left: rect.right + 10 });
        setIsTooltipOpen(true);
      }
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BASE_API_URL}/playlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `My Playlist #${stats.playlists.length + 1}`,
          descripsion: "",
          songs: [],
        }),
      });
      const json = await res.json();
      
      if (!res.ok) {
        addToast(json.message || "Tạo playlist thất bại", "error");
        return;
      }

      setStats((prev) => ({
        ...prev,
        playlists: [...prev.playlists, json.data],
      }));
      addToast("Đã tạo Playlist mới", "success");
    } catch (err) {
      console.error("Cannot create playlist:", err);
      addToast("Lỗi kết nối server", "error");
    }
  };

  // --- 1. HÀM MỞ MODAL ---
  const handleOpenDeleteModal = (id) => {
    if (!isLoggedIn) return;
    // Tìm tên playlist để hiển thị trong modal cho chuyên nghiệp
    const playlist = stats.playlists.find(p => p._id === id);
    const name = playlist ? playlist.name : "Playlist này";

    setDeleteModal({
        isOpen: true,
        playlistId: id,
        playlistName: name
    });
  };

  // --- 2. HÀM XÁC NHẬN XÓA (GỌI API) ---
  const confirmDeletePlaylist = async () => {
    const id = deleteModal.playlistId;
    if (!id) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BASE_API_URL}/playlists/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok) {
        addToast(json.msg || "Xóa playlist thất bại", "error");
        return;
      }

      // Update UI
      setStats((prev) => ({
        ...prev,
        playlists: prev.playlists.filter((pl) => pl._id !== id),
      }));

      addToast("Đã xóa playlist", "success");
    } catch (err) {
      console.error("Cannot delete playlist:", err);
      addToast("Lỗi khi xóa playlist", "error");
    } finally {
      // Đóng modal dù thành công hay thất bại
      setDeleteModal({ isOpen: false, playlistId: null, playlistName: "" });
    }
  };

  const isHistoryActive = location.pathname === "/history";

  return (
    <aside className={`h-full bg-black flex flex-col transition-all duration-500 ease-in-out p-2 ${isCollapsed ? "w-[72px]" : "w-[280px] lg:w-[350px]"}`}>
      <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden relative">
        {/* Header Library */}
        <div className={`flex items-center p-4 shadow-lg z-10 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <div className={`flex items-center text-neutral-400 font-bold hover:text-white cursor-pointer transition gap-3`} onClick={onToggleCollapse}>
            <GoBook size={24} />
            {!isCollapsed && <span>Your Library</span>}
          </div>

          {!isCollapsed && (
            <div className="flex items-center gap-1">
              <button
                ref={createPlaylistRef}
                onClick={handleCreatePlaylistClick}
                className="p-2 text-neutral-400 hover:text-white hover:bg-[#2A2A2A] rounded-full transition duration-200"
              >
                <FiPlus size={20} />
              </button>
              <button onClick={onToggleCollapse} className="p-2 text-neutral-400 hover:text-white hover:bg-[#2A2A2A] rounded-full transition">
                <PiArrowLineLeft size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Danh sách Item */}
        {isLoggedIn ? (
          <div className="overflow-y-auto flex-1 px-2 scrollbar-thin scrollbar-thumb-neutral-700 hover:scrollbar-thumb-neutral-600">
            {/* Recent History */}
            <div className={`group mt-2 flex items-center justify-between rounded-md transition-colors cursor-pointer ${isHistoryActive && !isCollapsed ? "bg-neutral-800" : "hover:bg-[#1A1A1A]"} ${isCollapsed ? "justify-center px-0" : "px-2"}`}>
              <Link to="/history" className={`flex items-center p-2 gap-3 flex-1 min-w-0 ${isCollapsed ? "justify-center" : ""}`}>
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded overflow-hidden bg-emerald-600 text-white transition-colors">
                  <GoHistory size={24} />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isHistoryActive ? "text-green-500" : "text-neutral-200 group-hover:text-white"}`}>Recent History</p>
                  </div>
                )}
              </Link>
            </div>

            {/* Liked Songs */}
            <PlaylistItem id="liked" icon="heart" title="Liked Songs" subtitle={`Playlist • ${stats.likedCount} songs`} isCollapsed={isCollapsed} />

            {/* User Playlists */}
            {stats.playlists.map((pl, index) => (
              <PlaylistItem
                key={pl._id || index}
                id={pl._id}
                icon="music"
                title={pl.name || `My Playlist #${index + 1}`}
                subtitle={`Playlist • ${user.username}`}
                isCollapsed={isCollapsed}
                isUserPlaylist={true}
                onDelete={handleOpenDeleteModal} // Gọi hàm mở modal thay vì xóa luôn
              />
            ))}
          </div>
        ) : (
          <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? "opacity-0 max-h-0" : "opacity-100"}`}>
            <div className="p-2 space-y-4 mt-2">
              <div className="bg-[#242424] rounded-lg p-4 text-white flex flex-col items-start gap-4">
                <div>
                  <p className="font-bold text-sm">Create your first playlist</p>
                  <p className="text-xs text-neutral-400 mt-1">It's easy, we'll help you</p>
                </div>
                <button onClick={handleCreatePlaylistClick} className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:scale-105 transition">
                  Create playlist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <LoginTooltip isOpen={isTooltipOpen} onClose={() => setIsTooltipOpen(false)} position={tooltipPosition} />

      {/* === 3. MODAL XÓA PLAYLIST (Giao diện đẹp) === */}
      {deleteModal.isOpen && (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setDeleteModal({ isOpen: false, playlistId: null, playlistName: "" })}
        >
            <div 
                className="w-full max-w-sm bg-[#282828] rounded-xl shadow-2xl border border-white/5 p-6 text-center transform scale-100 transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                        <AlertTriangle className="text-red-500 w-6 h-6" />
                    </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Xóa Playlist?</h3>
                <p className="text-neutral-400 mb-6 text-sm leading-relaxed">
                    Bạn có chắc chắn muốn xóa playlist <br/>
                    <span className="text-white font-bold">"{deleteModal.playlistName}"</span> không?
                    <br/>Hành động này không thể hoàn tác.
                </p>
                
                <div className="flex gap-3 justify-center">
                    <button 
                        onClick={() => setDeleteModal({ isOpen: false, playlistId: null, playlistName: "" })}
                        className="px-6 py-2.5 rounded-full font-bold text-white text-sm border border-neutral-600 hover:border-white hover:bg-neutral-800 transition min-w-[100px]"
                    >
                        Huỷ
                    </button>
                    <button 
                        onClick={confirmDeletePlaylist}
                        className="px-6 py-2.5 rounded-full font-bold text-white text-sm bg-red-600 hover:bg-red-500 hover:scale-105 transition shadow-lg shadow-red-900/20 min-w-[100px]"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
      )}
    </aside>
  );
}