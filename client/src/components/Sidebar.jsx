import React, { useState, useEffect, useRef } from "react";
import { GoBook } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import { PiArrowLineLeft } from "react-icons/pi";
import { Heart, Music } from "lucide-react";
import LoginTooltip from "./LoginTooltip";
import { Link } from "react-router-dom";

function PlaylistItem({ id, icon, title, subtitle, isCollapsed, onDelete }) {
  const iconElement =
    icon === "heart" ? (
      <Heart className="w-6 h-6 text-white justify-center" />
    ) : (
      <Music className="w-6 h-6 text-neutral-300" />
    );

  return (
    <div
      className={`group flex items-center justify-between p-2 rounded-md hover:bg-neutral-800 transition-colors duration-200 ${
        isCollapsed ? "justify-center" : "gap-4"
      }`}
    >
      <Link
        to={id === "liked" ? "/likedSongs" : `/playlist/${id}`}
        className="flex items-center gap-4 flex-1"
      >
        <div
          className={`w-12 h-12 flex items-center justify-center flex-shrink-0 rounded transition-all duration-300 ${
            id === "liked"
              ? "bg-gradient-to-br from-[#450af5] to-[#8e8ee5]"
              : "bg-neutral-700 hover:bg-neutral-600"
          }`}
        >
          {iconElement}
        </div>

        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{title}</p>
            <p
              className={`text-xs truncate ${
                id === "liked" ? "text-white/80" : "text-neutral-400"
              }`}
            >
              {subtitle}
            </p>
          </div>
        )}
      </Link>

      {/* 🔹 Nút xóa — chỉ hiện khi hover và không phải playlist "Liked Songs" */}
      {id !== "liked" && !isCollapsed && (
        <button
          onClick={() => onDelete(id)}
          className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition"
          title="Delete playlist"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default function Sidebar({ isLoggedIn, isCollapsed, onToggleCollapse }) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const createPlaylistRef = useRef(null);

  // 🔹 Lấy dữ liệu từ localStorage
  const [userLibrary, setUserLibrary] = useState(() => {
    const saved = localStorage.getItem("userLibrary");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "liked",
            title: "Liked Songs",
            subtitle: "Playlist • 127 songs",
            icon: "heart",
          },
        ];
  });

  // 🔹 Lưu lại mỗi khi userLibrary thay đổi
  useEffect(() => {
    localStorage.setItem("userLibrary", JSON.stringify(userLibrary));
  }, [userLibrary]);

  // Thêm hàm xóa playlist
  const handleDeletePlaylist = (id) => {
    const updated = userLibrary.filter((playlist) => playlist.id !== id);
    setUserLibrary(updated);
  };

  // 🔹 Đóng tooltip khi click ngoài
  useEffect(() => {
    const handleClickOutside = () => setIsTooltipOpen(false);
    if (isTooltipOpen) window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isTooltipOpen]);

  // 🔹 Xử lý tạo playlist
  const handleCreatePlaylistClick = (event) => {
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

    const newPlaylist = {
      id: `playlist-${Date.now()}`, // 🔹 ID duy nhất
      title: `My Playlist #${userLibrary.length}`,
      subtitle: "Playlist",
      icon: "music",
    };

    setUserLibrary([...userLibrary, newPlaylist]);
  };

  return (
    <aside
      className={`h-full bg-black flex flex-col transition-all duration-1000 ease-in-out p-2 ${
        isCollapsed ? "w-[80px]" : "w-[300px]"
      }`}
    >
      <div className="bg-neutral-900 rounded-lg flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className={`flex items-center p-4 border-b border-neutral-800 transition-all duration-300 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {/* GoBook + "Your Library" */}
          <div
            className={`flex items-center text-neutral-400 font-bold hover:text-white cursor-pointer transition ${
              isCollapsed ? "justify-center" : "gap-4"
            }`}
            onClick={onToggleCollapse}
          >
            <GoBook size={26} className="flex-shrink-0" />
            {!isCollapsed && (
              <span className="transition-all duration-200 ease-in-out origin-left opacity-100 scale-100">
                Your Library
              </span>
            )}
          </div>

          {/* Nút tạo playlist và collapse */}
          {!isCollapsed && (
            <div className="flex items-center gap-2 transition-all duration-200">
              <button
                ref={createPlaylistRef}
                onClick={handleCreatePlaylistClick}
                className="p-1 text-neutral-400 hover:text-white transition"
                title="Create playlist"
              >
                <FiPlus size={22} />
              </button>
              <button
                onClick={onToggleCollapse}
                className="p-1 text-neutral-400 hover:text-white transition"
                title="Collapse sidebar"
              >
                <PiArrowLineLeft size={22} />
              </button>
            </div>
          )}
        </div>

        {/* Danh sách playlist */}
        {isLoggedIn ? (
          <div className="overflow-y-auto py-2 space-y-1 transition-all duration-300 px-2">
            {userLibrary.map((item, index) => (
              <PlaylistItem
                key={index}
                {...item}
                isCollapsed={isCollapsed}
                onDelete={handleDeletePlaylist}
              />
            ))}
          </div>
        ) : (
          // Khi chưa login
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isCollapsed ? "opacity-0 max-h-0" : "opacity-100 max-h-full"
            }`}
          >
            <div className="p-2 space-y-3">
              <div className="bg-neutral-800 rounded-lg p-4 text-white">
                <p className="font-bold text-sm mb-1">
                  Create your first playlist
                </p>
                <p className="text-xs text-neutral-300 mb-4">
                  It's easy, we'll help you
                </p>
                <button
                  ref={createPlaylistRef}
                  onClick={handleCreatePlaylistClick}
                  className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:scale-105 transition"
                >
                  Create playlist
                </button>
              </div>

              <div className="bg-neutral-800 rounded-lg p-4 text-white">
                <p className="font-bold text-sm mb-1">
                  Let's find some podcasts
                </p>
                <p className="text-xs text-neutral-300 mb-4">
                  We'll keep you updated
                </p>
                <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:scale-105 transition">
                  Browse podcasts
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tooltip */}
      <LoginTooltip
        isOpen={isTooltipOpen}
        onClose={() => setIsTooltipOpen(false)}
        position={tooltipPosition}
      />
    </aside>
  );
}
