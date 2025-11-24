import React, { useState, useEffect, useRef } from "react";
import { GoBook, GoHistory } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import { PiArrowLineLeft } from "react-icons/pi";
import { Heart, Music } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import LoginTooltip from "./LoginTooltip";
import { useAuth } from "../context/AuthContext";

const BASE_API_URL = import.meta.env.VITE_API_URL;

// Component con: Từng dòng Playlist
function PlaylistItem({
  id,
  icon,
  title,
  subtitle,
  isCollapsed,
  onDelete,
  isUserPlaylist,
}) {
  const location = useLocation();
  const targetLink = id === "liked" ? "/likedSongs" : `/playlist/${id}`;
  const isActive = location.pathname === targetLink;

  const iconElement =
    icon === "heart" ? (
      <Heart className="w-5 h-5 text-white fill-current" />
    ) : (
      <Music className="w-5 h-5 text-neutral-400" />
    );

  return (
    <div
      className={`group mt-2 flex items-center justify-between rounded-md transition-colors cursor-pointer ${
        isActive && !isCollapsed ? "bg-neutral-800" : "hover:bg-[#1A1A1A]"
      } ${isCollapsed ? "justify-center px-0" : "px-2"}`}
    >
      <Link
        to={targetLink}
        className={`flex items-center p-2 gap-3 flex-1 min-w-0 ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        <div
          className={`w-12 h-12 flex items-center justify-center flex-shrink-0 rounded overflow-hidden ${
            id === "liked"
              ? "bg-gradient-to-br from-[#450af5] to-[#8e8ee5]"
              : "bg-[#282828]"
          }`}
        >
          {iconElement}
        </div>

        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-semibold truncate ${
                isActive
                  ? "text-green-500"
                  : id === "liked"
                  ? "text-white"
                  : "text-neutral-200 group-hover:text-white"
              }`}
            >
              {title}
            </p>
            <p className="text-xs mt-1 text-neutral-400 truncate flex items-center gap-1">
              {subtitle}
            </p>
          </div>
        )}
      </Link>

      {!isCollapsed && isUserPlaylist && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(id);
          }}
          className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-white p-2"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default function Sidebar({ isLoggedIn, isCollapsed, onToggleCollapse }) {
  const { user, likedSongsTrigger } = useAuth();
  const location = useLocation();

  const [stats, setStats] = useState({ likedCount: 0, playlists: [] });
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

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
    // xử lý tạo playlist
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
        console.error(json);
        return;
      }

      // Thêm playlist mới vào state, lưu nguyên dữ liệu backend
      setStats((prev) => ({
        ...prev,
        playlists: [...prev.playlists, json.data],
      }));
    } catch (err) {
      console.error("Cannot create playlist:", err);
    }
  };

  const handleDeletePlaylist = async (id) => {
    if (!isLoggedIn) {
      alert("Bạn cần đăng nhập để xóa playlist!");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn xóa playlist này?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BASE_API_URL}/playlists/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!res.ok) {
        console.error("Cannot delete playlist:", json);
        alert(json.msg || "Xóa playlist thất bại!");
        return;
      }

      // Nếu xóa thành công, cập nhật state
      setStats((prev) => ({
        ...prev,
        playlists: prev.playlists.filter((pl) => pl._id !== id),
      }));

      alert("Xóa playlist thành công!");
    } catch (err) {
      console.error("Cannot delete playlist:", err);
      alert("Xóa playlist thất bại!");
    }
  };

  const isHistoryActive = location.pathname === "/history";

  return (
    <aside
      className={`h-full bg-black flex flex-col transition-all duration-500 ease-in-out p-2 ${
        isCollapsed ? "w-[72px]" : "w-[280px] lg:w-[350px]"
      }`}
    >
      <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden">
        {/* Header Library */}
        <div
          className={`flex items-center p-4 shadow-lg z-10 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div
            className={`flex items-center text-neutral-400 font-bold hover:text-white cursor-pointer transition gap-3`}
            onClick={onToggleCollapse}
          >
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
              <button
                onClick={onToggleCollapse}
                className="p-2 text-neutral-400 hover:text-white hover:bg-[#2A2A2A] rounded-full transition"
              >
                <PiArrowLineLeft size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Danh sách Item */}
        {isLoggedIn ? (
          <div className="overflow-y-auto flex-1 px-2 scrollbar-thin scrollbar-thumb-neutral-700 hover:scrollbar-thumb-neutral-600">
            {/* 1. Recent History (Đã Fix cấu trúc giống hệt PlaylistItem) */}
            <div
              className={`group mt-2 flex items-center justify-between rounded-md transition-colors cursor-pointer ${
                isHistoryActive && !isCollapsed
                  ? "bg-neutral-800"
                  : "hover:bg-[#1A1A1A]"
              } ${isCollapsed ? "justify-center px-0" : "px-2"}`}
            >
              <Link
                to="/history"
                className={`flex items-center p-2 gap-3 flex-1 min-w-0 ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded overflow-hidden bg-emerald-600 text-white transition-colors">
                  {/* Đổi size 28 -> 24 cho bằng icon tim */}
                  <GoHistory size={24} />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${
                        isHistoryActive
                          ? "text-green-500"
                          : "text-neutral-200 group-hover:text-white"
                      }`}
                    >
                      Recent History
                    </p>
                  </div>
                )}
              </Link>
            </div>

            {/* 2. Liked Songs */}
            <PlaylistItem
              id="liked"
              icon="heart"
              title="Liked Songs"
              subtitle={`Playlist • ${stats.likedCount} songs`}
              isCollapsed={isCollapsed}
            />

            {/* 3. User Playlists */}
            {stats.playlists.map((pl, index) => (
              <PlaylistItem
                key={pl._id || index}
                id={pl._id}
                icon="music"
                title={pl.name || `My Playlist #${index + 1}`}
                subtitle={`Playlist • ${user.username}`}
                isCollapsed={isCollapsed}
                isUserPlaylist={true}
                onDelete={handleDeletePlaylist}
              />
            ))}
          </div>
        ) : (
          // Giao diện chưa Login
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isCollapsed ? "opacity-0 max-h-0" : "opacity-100"
            }`}
          >
            <div className="p-2 space-y-4 mt-2">
              <div className="bg-[#242424] rounded-lg p-4 text-white flex flex-col items-start gap-4">
                <div>
                  <p className="font-bold text-sm">
                    Create your first playlist
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    It's easy, we'll help you
                  </p>
                </div>
                <button
                  onClick={handleCreatePlaylistClick}
                  className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:scale-105 transition"
                >
                  Create playlist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <LoginTooltip
        isOpen={isTooltipOpen}
        onClose={() => setIsTooltipOpen(false)}
        position={tooltipPosition}
      />
    </aside>
  );
}
