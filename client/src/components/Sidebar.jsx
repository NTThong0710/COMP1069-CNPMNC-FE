import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { GoBook } from "react-icons/go"; // Bỏ GoHome, GoSearch
import { FiPlus } from "react-icons/fi";
import LoginTooltip from "./LoginTooltip";
import { Heart, Music } from "lucide-react";

// Bỏ component NavItem vì không dùng nữa
// function NavItem(...) { ... }

// Component PlaylistItem giữ nguyên
function PlaylistItem({ image, title, subtitle, isCollapsed }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 p-2 rounded-md group transition ${
        title === "Liked Songs"
      }`}
    >
      <div
        className={`w-12 h-12 flex items-center justify-center flex-shrink-0 rounded ${
          title === "Liked Songs"
            ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 shadow-lg"
            : "bg-neutral-700"
        }`}
      >
        {image}
      </div>
      <div
        className={`flex-1 min-w-0 transition-opacity duration-300 ${
          isCollapsed ? "opacity-0 hidden" : "opacity-100 block"
        }`}
      >
        <p
          className={`font-bold text-white text-sm truncate ${
            title === "Liked Songs" ? "drop-shadow" : ""
          }`}
        >
          {title}
        </p>
        <p
          className={`text-xs truncate ${
            title === "Liked Songs"
              ? "text-white/80 font-semibold"
              : "text-neutral-400"
          }`}
        >
          {subtitle}
        </p>
      </div>
    </a>
  );
}

export default function Sidebar({ isLoggedIn }) {
  // Toàn bộ state và useEffect giữ nguyên
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const createPlaylistRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef(null);

  const [userLibrary, setUserLibrary] = useState([
    {
      title: "Liked Songs",
      subtitle: "Playlist • 127 songs",
      image: <Heart className="w-6 h-6 text-white" />,
    },
  ]);

  useEffect(() => {
    const COLLAPSE_THRESHOLD = 200;
    if (!sidebarRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const currentWidth = entries[0].contentRect.width;
      setIsCollapsed(currentWidth < COLLAPSE_THRESHOLD);
    });
    resizeObserver.observe(sidebarRef.current);
    return () => resizeObserver.disconnect();
  }, []);

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
      title: `My Playlist ${userLibrary.length}`,
      subtitle: "Playlist",
      image: <Music className="w-6 h-6 text-neutral-300" />,
    };
    setUserLibrary([...userLibrary, newPlaylist]);
  };

  useEffect(() => {
    const handleClickOutside = () => setIsTooltipOpen(false);
    if (isTooltipOpen) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isTooltipOpen]);

  // --- RETURN JSX ĐÃ ĐƯỢC DỌN DẸP ---
  return (
    // Thay đổi duy nhất là ở đây, Sidebar giờ chỉ còn 1 khối chính
    <div ref={sidebarRef} className="h-full bg-black flex flex-col gap-2">
      {/* KHỐI HOME & SEARCH ĐÃ BỊ XÓA */}

      {/* Chỉ còn lại khối "Your Library" */}
      <div className="bg-neutral-900 rounded-lg flex-1 flex flex-col overflow-hidden">
        <div
          className={`flex items-center p-4 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <span className="flex items-center gap-4 text-white font-bold transition-colors duration-300 hover:text-white">
            <GoBook size={28} />
            <span
              className={`transition-opacity duration-300 ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100"
              }`}
            >
              {!isCollapsed && <span>Your Library</span>}
            </span>
          </span>

          {!isCollapsed && (
            <button
              ref={createPlaylistRef}
              onClick={handleCreatePlaylistClick}
              className="group text-neutral-400 hover:text-white"
            >
              <FiPlus
                size={24}
                className="transition-transform group-hover:scale-110"
              />
            </button>
          )}
        </div>

        {isLoggedIn ? (
          <div className="overflow-y-auto px-2 space-y-2">
            {userLibrary.map((item, index) => (
              <PlaylistItem key={index} {...item} isCollapsed={isCollapsed} />
            ))}
          </div>
        ) : (
          !isCollapsed && (
            <div className="overflow-y-auto px-2 space-y-2">
              <div className="bg-neutral-800 rounded-lg p-4 m-2 text-white">
                <p className="font-bold text-sm mb-1">
                  Create your first playlist
                </p>
                <p className="text-xs mb-4">It's easy, we'll help you</p>
                <button
                  ref={createPlaylistRef}
                  onClick={handleCreatePlaylistClick}
                  className="bg-white text-black text-xs text-[13px] font-bold px-6 py-2 rounded-full hover:scale-105 transition"
                >
                  Create playlist
                </button>
              </div>
              <div className="bg-neutral-800 rounded-lg p-4 m-2 text-white">
                <p className="font-bold text-sm mb-1">
                  Let's find some podcasts
                </p>
                <p className="text-xs mb-4">We'll keep you updated</p>
                <button className="bg-white text-black text-xs text-[13px] font-bold px-6 py-2 rounded-full hover:scale-105 transition">
                  Browse podcasts
                </button>
              </div>
            </div>
          )
        )}
      </div>

      <LoginTooltip
        isOpen={isTooltipOpen}
        onClose={() => setIsTooltipOpen(false)}
        position={tooltipPosition}
      />
    </div>
  );
}
