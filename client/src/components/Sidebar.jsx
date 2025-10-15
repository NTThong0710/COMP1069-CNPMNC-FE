import React, { useState, useEffect, useRef } from "react";
import { GoBook } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import { PiArrowLineLeft } from "react-icons/pi";
import { Heart, Music } from "lucide-react";
import LoginTooltip from "./LoginTooltip";

function PlaylistItem({ image, title, subtitle, isCollapsed }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 p-2 rounded-md hover:bg-neutral-800 transition ${isCollapsed ? "justify-center" : ""
        }`}
    >
      <div
        className={`w-12 h-12 flex items-center justify-center flex-shrink-0 rounded ${title === "Liked Songs"
          ? "bg-gradient-to-br from-indigo-500 to-blue-500"
          : "bg-neutral-700"
          }`}
      >
        {image}
      </div>
      {!isCollapsed && (
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{title}</p>
          <p
            className={`text-xs truncate ${title === "Liked Songs" ? "text-white/80" : "text-neutral-400"
              }`}
          >
            {subtitle}
          </p>
        </div>
      )}
    </a>
  );
}

export default function Sidebar({ isLoggedIn, isCollapsed, onToggleCollapse }) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const createPlaylistRef = useRef(null);

  const [userLibrary, setUserLibrary] = useState([
    {
      title: "Liked Songs",
      subtitle: "Playlist • 127 songs",
      image: <Heart className="w-6 h-6 text-white" />,
    },
  ]);

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
      title: `My Playlist #${userLibrary.length}`,
      subtitle: "Playlist",
      image: <Music className="w-6 h-6 text-neutral-300" />,
    };
    setUserLibrary([...userLibrary, newPlaylist]);
  };

  useEffect(() => {
    const handleClickOutside = () => setIsTooltipOpen(false);
    if (isTooltipOpen) window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isTooltipOpen]);

  return (
    <aside
      className={`h-full bg-black flex flex-col transition-all duration-300 ease-in-out border-r border-neutral-800 ${isCollapsed ? "w-[80px]" : "w-[280px]"
        }`}
    >
      <div className="bg-neutral-900 rounded-lg flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <div
          className={`flex items-center p-4 border-b border-neutral-800 transition-all duration-300 ${isCollapsed ? "justify-center" : "justify-between"
            }`}
        >
          <div
            className={`flex items-center text-neutral-400 font-bold hover:text-white cursor-pointer transition ${isCollapsed ? "justify-center" : "gap-3"
              }`}
            onClick={onToggleCollapse} // Cho phép bấm cả vào icon sách để mở rộng
          >
            <GoBook size={26} />
            {!isCollapsed && <span className="text-sm">Your Library</span>}
          </div>

          {!isCollapsed && (
            <div className="flex items-center gap-2">
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
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <PiArrowLineLeft
                  size={22}
                  className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : "rotate-0"
                    }`}
                />
              </button>
            </div>
          )}
        </div>

        {/* Nội dung */}
        {isLoggedIn ? (
          <div
            className={`overflow-y-auto px-2 py-3 space-y-1 ${isCollapsed ? "flex flex-col items-center" : ""
              }`}
          >
            {userLibrary.map((item, index) => (
              <PlaylistItem key={index} {...item} isCollapsed={isCollapsed} />
            ))}
          </div>
        ) : (
          // === ĐÃ SỬA LỖI: Xóa bỏ điều kiện !isCollapsed ở thẻ div cha ===
          <div className="overflow-y-auto p-2 space-y-3">
            {/* Nội dung bên trong sẽ tự ẩn đi khi thu gọn */}
            {!isCollapsed && (
              <>
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
              </>
            )}
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