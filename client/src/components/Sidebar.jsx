import React, { useState, useEffect, useRef } from "react";
import { GoBook, GoHistory } from "react-icons/go";
// Import đầy đủ các icon cần dùng
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import { PiArrowLineLeft } from "react-icons/pi";
import { Heart, Music } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import LoginTooltip from "./LoginTooltip";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const BASE_API_URL = import.meta.env.VITE_API_URL;

// --- COMPONENT CON: TỪNG DÒNG PLAYLIST ---
function PlaylistItem({ id, icon, title, subtitle, isCollapsed, onContextMenu, isActive, imageUrl }) {
  const location = useLocation();
  // Tự động xác định trạng thái active nếu không được truyền vào
  const active = isActive !== undefined ? isActive : (id === "liked" ? location.pathname === "/likedSongs" : location.pathname === `/playlist/${id}`);

  const iconElement = icon === "heart" ? <Heart className="w-5 h-5 text-white fill-current" /> : <Music className="w-5 h-5 text-neutral-400" />;

  return (
    <div
      // KÍCH HOẠT MENU CHUỘT PHẢI
      onContextMenu={(e) => {
        if (onContextMenu) {
          e.preventDefault(); // Chặn menu mặc định của trình duyệt
          onContextMenu(e, id, title);
        }
      }}
      className={`group mt-2 flex items-center justify-between rounded-md transition-colors cursor-pointer ${active && !isCollapsed ? "bg-neutral-800 text-white" : "hover:bg-[#1A1A1A] text-neutral-400 hover:text-white"} ${isCollapsed ? "justify-center px-0" : "px-2"}`}
    >
      <Link to={id === "liked" ? "/likedSongs" : `/playlist/${id}`} className={`flex items-center p-2 gap-3 flex-1 min-w-0 ${isCollapsed ? "justify-center" : ""}`}>
        {/* KHUNG ẢNH BÌA */}
        <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 rounded overflow-hidden shadow-sm ${id === "liked" ? "bg-gradient-to-br from-[#450af5] to-[#8e8ee5]" : "bg-[#282828]"}`}>
          {/* Logic hiển thị ảnh: Nếu có imageUrl và không phải Liked Songs thì hiện ảnh */}
          {imageUrl && id !== "liked" ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            iconElement
          )}
        </div>

        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${active ? "text-green-500" : "text-inherit"}`}>{title}</p>
            <p className="text-xs mt-1 opacity-70 truncate flex items-center gap-1">{subtitle}</p>
          </div>
        )}
      </Link>
    </div>
  );
}

// --- COMPONENT CHÍNH: SIDEBAR ---
export default function Sidebar({ isLoggedIn, isCollapsed, onToggleCollapse }) {
  const { user, likedSongsTrigger, playlistUpdateTrigger, triggerPlaylistRefresh } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();

  const [stats, setStats] = useState({ likedCount: 0, playlists: [] });
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  // State Context Menu (Menu Chuột Phải)
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    playlistId: null,
    playlistName: ""
  });

  // State Modal Xóa
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    playlistId: null,
    playlistName: ""
  });

  const createPlaylistRef = useRef(null);

  // 1. FETCH DATA (Lắng nghe cả playlistUpdateTrigger để cập nhật realtime)
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
          const userPlaylists = data.playlists || [];
          setStats({
            likedCount: data.likedSongs?.length || 0,
            playlists: userPlaylists,
          });
        }
      } catch (error) {
        console.error("Sidebar fetch error:", error);
      }
    };
    fetchLatestUserData();
  }, [user, likedSongsTrigger, playlistUpdateTrigger]);

  // 2. ĐÓNG CONTEXT MENU KHI CLICK RA NGOÀI
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) setContextMenu({ ...contextMenu, visible: false });
      setIsTooltipOpen(false);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [contextMenu]);

  // --- LOGIC HELPER: LẤY ẢNH BÌA (ROBUST VERSION) ---
  const getPlaylistCover = (playlist) => {
    // Ưu tiên ảnh user tự set
    if (playlist.imageUrl) return playlist.imageUrl;
    if (playlist.cover) return playlist.cover;

    // Nếu không có, tìm ảnh bài đầu tiên
    if (playlist.songs && playlist.songs.length > 0) {
      const firstItem = playlist.songs[0];

      // An toàn: Nếu item null hoặc chỉ là string ID -> null
      if (!firstItem || typeof firstItem === 'string') return null;

      // Cấu trúc mới: { song: { cover: ... } }
      if (firstItem.song && typeof firstItem.song === 'object' && firstItem.song.cover) {
        return firstItem.song.cover;
      }
      // Cấu trúc cũ: { cover: ... }
      if (firstItem.cover) {
        return firstItem.cover;
      }
    }
    return null;
  };

  // --- HANDLERS ---
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
          description: "",
          songs: [],
        }),
      });

      // --- SỬA ĐỔI: Kiểm tra lỗi TRƯỚC khi parse JSON ---
      if (!res.ok) {
        // Nếu server báo lỗi, thử đọc text lỗi
        const errorText = await res.text();
        throw new Error(errorText || "Server responded with error");
      }

      // Nếu OK mới đọc JSON
      const json = await res.json();

      setStats((prev) => ({
        ...prev,
        playlists: [...prev.playlists, json.data],
      }));
      triggerPlaylistRefresh();
      addToast("Created Library", "success");
    } catch (err) {
      console.error("Create Playlist Error:", err);
      // Nếu vẫn tạo được (do lỗi cú pháp backend sau khi save), ta tạm thời không hiện lỗi
      // Nhưng tốt nhất là bạn check terminal backend để fix triệt để.
      addToast("Lỗi: " + err.message, "error");
    }
  };

  const handleContextMenu = (e, id, name) => {
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      playlistId: id,
      playlistName: name
    });
  };

  const handleDeleteClickFromMenu = () => {
    setDeleteModal({
      isOpen: true,
      playlistId: contextMenu.playlistId,
      playlistName: contextMenu.playlistName
    });
    setContextMenu({ ...contextMenu, visible: false });
  };

  const confirmDeletePlaylist = async () => {
    const id = deleteModal.playlistId;
    if (!id) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BASE_API_URL}/playlists/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // --- SỬA ĐỔI: Kiểm tra lỗi TRƯỚC khi parse JSON ---
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Delete failed");
      }

      // Xóa thành công (dù có trả về json hay không thì status 200/204 đều là ok)

      // Update UI
      setStats((prev) => ({
        ...prev,
        playlists: prev.playlists.filter((pl) => pl._id !== id),
      }));
      triggerPlaylistRefresh();
      addToast("Removed from Library", "success");
    } catch (err) {
      console.error("Delete Playlist Error:", err);
      addToast("Lỗi khi xóa playlist", "error");
    } finally {
      setDeleteModal({ isOpen: false, playlistId: null, playlistName: "" });
    }
  };

  const isHistoryActive = location.pathname === "/history";

  return (
    <aside className={`h-full bg-black flex flex-col transition-all duration-500 ease-in-out p-2 ${isCollapsed ? "w-[72px]" : "w-[280px] lg:w-[350px]"}`}>
      <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden relative">

        {/* HEADER */}
        <div className={`flex items-center p-4 shadow-md z-10 ${isCollapsed ? "justify-center" : "justify-between"}`}>
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

        {/* DANH SÁCH PLAYLIST */}
        {isLoggedIn ? (
          <div className="overflow-y-auto flex-1 px-2 scrollbar-thin scrollbar-thumb-neutral-700 hover:scrollbar-thumb-neutral-600 pb-4">
            {/* History Link */}
            <div className={`group mt-2 flex items-center justify-between rounded-md transition-colors cursor-pointer ${isHistoryActive && !isCollapsed ? "bg-neutral-800 text-white" : "hover:bg-[#1A1A1A] text-neutral-400 hover:text-white"} ${isCollapsed ? "justify-center px-0" : "px-2"}`}>
              <Link to="/history" className={`flex items-center p-2 gap-3 flex-1 min-w-0 ${isCollapsed ? "justify-center" : ""}`}>
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded overflow-hidden bg-emerald-600 text-white shadow-sm">
                  <GoHistory size={24} />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isHistoryActive ? "text-green-500" : "text-inherit"}`}>Recent History</p>
                  </div>
                )}
              </Link>
            </div>

            {/* Liked Songs */}
            <PlaylistItem
              id="liked"
              icon="heart"
              title="Liked Songs"
              subtitle={`Playlist • ${stats.likedCount} songs`}
              isCollapsed={isCollapsed}
              isActive={location.pathname === "/likedSongs"}
            />

            {/* User Playlists */}
            {stats.playlists.map((pl, index) => (
              <PlaylistItem
                key={pl._id || index}
                id={pl._id}
                icon="music"
                title={pl.name || `My Playlist #${index + 1}`}
                subtitle={`Playlist • ${user.username}`}
                isCollapsed={isCollapsed}
                imageUrl={getPlaylistCover(pl)} // Truyền ảnh bìa vào
                onContextMenu={handleContextMenu} // Gắn sự kiện chuột phải
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

      {/* === CONTEXT MENU (MENU CHUỘT PHẢI) === */}
      {contextMenu.visible && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-[9999] bg-[#282828] min-w-[160px] rounded-md shadow-xl border border-[#3E3E3E] py-1 animate-fade-in origin-top-left"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleDeleteClickFromMenu}
            className="w-full text-left px-4 py-2.5 text-sm text-neutral-200 hover:bg-[#3E3E3E] hover:text-white flex items-center gap-2 transition-colors"
          >
            <FiTrash2 size={16} />
            <span>Delete</span>
          </button>
          {/* <button className="w-full text-left px-4 py-2.5 text-sm ..."><FiEdit2 /> Edit details</button> */}
        </div>
      )}

      {/* === MODAL CONFIRM DELETE === */}
      {deleteModal.isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setDeleteModal({ isOpen: false, playlistId: null, playlistName: "" })}
        >
          <div
            className="w-full max-w-[320px] bg-[#282828] rounded-lg shadow-2xl p-6 text-center transform scale-100 transition-all border border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-2">Delete from Library?</h3>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              This will delete <span className="text-white font-bold">{deleteModal.playlistName}</span> from <br /> Your Library.
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setDeleteModal({ isOpen: false, playlistId: null, playlistName: "" })}
                className="px-6 py-2 rounded-full font-bold text-white text-sm hover:scale-105 transition bg-transparent border border-neutral-500 hover:border-white min-w-[100px]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePlaylist}
                className="px-6 py-2 rounded-full font-bold text-black text-sm bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 transition shadow-lg min-w-[100px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}