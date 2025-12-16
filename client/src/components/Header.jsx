import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { GoHome, GoSearch } from "react-icons/go";
import { X, LogOut, User, Music, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const BASE_API_URL =
  import.meta.env.VITE_API_URL || "https://comp1069-cnpmnc-be.onrender.com/api";

export default function Header({ isLoggedIn }) {
  // === STATE ===
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // State bật/tắt AI
  const [useAI, setUseAI] = useState(true);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const isUserLoggedIn = !!user;

  // === 1. LOGIC SUGGEST (Hybrid: Toggle + Re-ranking) ===
  useEffect(() => {
    if (!isUserLoggedIn || !searchTerm.trim()) {
      setSuggestions(null);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      if (!BASE_API_URL) return;

      try {
        // CASE 1: Nếu tắt AI -> Dùng API Search thường
        if (!useAI) {
          const res = await fetch(
            `${BASE_API_URL}/search/suggest?q=${encodeURIComponent(
              searchTerm
            )}&limit=5`
          );
          if (res.ok) {
            const data = await res.json();
            setSuggestions(data.suggestions);
            setShowDropdown(true);
          }
          return;
        }

        // CASE 2: Nếu bật AI -> Gọi Semantic Search (Songs) + API thường (Artist/Album)
        const [semanticRes, oldSuggestRes] = await Promise.allSettled([
          fetch(`${BASE_API_URL}/songs/semantic-search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: searchTerm }),
          }),
          fetch(
            `${BASE_API_URL}/search/suggest?q=${encodeURIComponent(
              searchTerm
            )}&limit=3`
          ),
        ]);

        let newSuggestions = { songs: [], artists: [], albums: [] };

        // Xử lý Semantic Search (Songs)
        if (semanticRes.status === "fulfilled" && semanticRes.value.ok) {
          const semanticData = await semanticRes.value.json();
          if (semanticData.success && semanticData.results) {
            let rawSongs = semanticData.results.slice(0, 10);

            // --- LOGIC RE-RANKING (Ưu tiên khớp chữ trước, AI sau) ---
            const exactMatches = rawSongs.filter((s) =>
              s.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            const semanticMatches = rawSongs.filter(
              (s) => !s.title.toLowerCase().includes(searchTerm.toLowerCase())
            );

            newSuggestions.songs = [...exactMatches, ...semanticMatches].slice(
              0,
              5
            );
          }
        }

        // Xử lý API thường (Artists & Albums)
        if (oldSuggestRes.status === "fulfilled" && oldSuggestRes.value.ok) {
          const oldData = await oldSuggestRes.value.json();
          newSuggestions.artists = oldData.suggestions?.artists || [];
          newSuggestions.albums = oldData.suggestions?.albums || [];

          // Fallback: Nếu AI không ra kết quả, lấy song cũ đắp vào
          if (newSuggestions.songs.length === 0 && oldData.suggestions?.songs) {
            newSuggestions.songs = oldData.suggestions.songs;
          }
        }

        setSuggestions(newSuggestions);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search Error:", error);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isUserLoggedIn, useAI]);

  // === 2. CLICK OUTSIDE ===
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // === 3. HANDLERS ===
  const handleSearchSubmit = (event) => {
    event?.preventDefault();
    if (!isUserLoggedIn || !searchTerm.trim()) return;
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleSuggestionClick = (song) => {
    setSearchTerm(song.title || song);
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(song.title || song)}`);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSuggestions(null);
    setShowDropdown(false);
  };

  const handleLogoutClick = () => {
    setShowUserMenu(false);
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate("/login");
    setTimeout(() => addToast("Đăng xuất thành công", "success"), 100);
  };

  return (
    <>
      <header className="flex justify-between items-center p-4 bg-transparent sticky top-0 z-50">
        <div className="flex items-center gap-4 flex-1 relative z-50">
          {/* Logo Home */}
          <Link to="/" aria-label="Go to home page">
            <button
              className="bg-neutral-800/80 text-white p-2 rounded-full hover:bg-neutral-700 transition shadow-md"
              aria-label="Home"
            >
              <GoHome size={24} />
            </button>
          </Link>

          {/* SEARCH BAR & DROPDOWN */}
          <div ref={dropdownRef} className="relative w-full max-w-md group">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center"
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <GoSearch
                  className={`transition-colors size={20} ${
                    isUserLoggedIn
                      ? "text-neutral-400 group-focus-within:text-white"
                      : "text-neutral-600"
                  }`}
                />
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() =>
                  isUserLoggedIn && searchTerm && setShowDropdown(true)
                }
                disabled={!isUserLoggedIn}
                placeholder={
                  isUserLoggedIn
                    ? useAI
                      ? "Ask AI about music..."
                      : "Search song, artist..."
                    : "Log in to search"
                }
                className={`w-full rounded-full py-3 pl-10 pr-24 transition-colors shadow-sm focus:outline-none ${
                  isUserLoggedIn
                    ? "bg-[#242424] text-white placeholder-neutral-400 hover:bg-[#2a2a2a] focus:ring-2 focus:ring-white/20"
                    : "bg-[#1a1a1a] text-neutral-500 placeholder-neutral-600 cursor-not-allowed border border-transparent"
                }`}
              />

              {/* GROUP NÚT BÊN PHẢI (CLEAR + AI) */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchTerm && isUserLoggedIn && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-700 transition"
                  >
                    <X size={18} />
                  </button>
                )}

                {isUserLoggedIn && (
                  <button
                    type="button"
                    onClick={() => setUseAI(!useAI)}
                    className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
                      useAI
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105"
                        : "bg-neutral-700 text-neutral-400 hover:text-white"
                    }`}
                    title={useAI ? "Tắt AI" : "Bật AI"}
                  >
                    <Sparkles size={16} />
                  </button>
                )}
              </div>
            </form>

            {/* DROPDOWN GỢI Ý */}
            {isUserLoggedIn && showDropdown && suggestions && (
              <div className="absolute top-full mt-2 left-0 w-full bg-[#242424] rounded-lg shadow-2xl overflow-hidden border border-neutral-800 p-2 animate-in fade-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto">
                {/* 1. ƯU TIÊN ARTISTS LÊN ĐẦU (Để tránh bị songs che mất khi tìm đích danh ca sĩ) */}
                {suggestions.artists?.length > 0 && (
                  <div className="mb-2 pb-2 border-b border-neutral-700">
                    <p className="text-xs font-bold text-neutral-400 px-3 py-2 uppercase">
                      Artists
                    </p>
                    {suggestions.artists.map((artist, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSuggestionClick(artist.name)}
                        className="px-2 py-2 hover:bg-neutral-700/50 rounded-md cursor-pointer flex items-center gap-3 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden border border-neutral-700">
                          {artist.avatar ? (
                            <img
                              src={artist.avatar}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={16} className="text-neutral-500" />
                          )}
                        </div>
                        <span className="text-white text-sm truncate font-bold">
                          {artist.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. SONGS SECTION (Best Match / AI Search) */}
                {suggestions.songs?.length > 0 && (
                  <div className="mb-2">
                    <div className="flex justify-between items-center px-3 py-2">
                      <p className="text-xs font-bold text-neutral-400 uppercase">
                        {suggestions.artists?.length > 0
                          ? "Songs"
                          : "Best Match"}
                      </p>
                      {/* Chỉ hiện badge AI khi đang bật chế độ AI */}
                      {useAI && (
                        <span className="text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Sparkles size={8} /> AI Search
                        </span>
                      )}
                    </div>
                    {suggestions.songs.map((song, idx) => (
                      <div
                        key={song._id || idx}
                        onClick={() => handleSuggestionClick(song)}
                        className="px-2 py-2 hover:bg-neutral-700/50 rounded-md cursor-pointer flex items-center gap-3 transition-colors group"
                      >
                        {song.cover ? (
                          <img
                            src={song.cover}
                            alt=""
                            className="w-10 h-10 rounded-md object-cover bg-neutral-800 shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-neutral-800 flex items-center justify-center">
                            <Music size={16} className="text-neutral-500" />
                          </div>
                        )}

                        <div className="flex flex-col overflow-hidden">
                          {/* Đã xóa group-hover:text-purple-300 theo yêu cầu */}
                          <span className="text-white text-sm truncate font-medium transition-colors">
                            {song.title}
                          </span>
                          {song.genre && (
                            <span className="text-xs text-neutral-500 truncate">
                              {Array.isArray(song.genre)
                                ? song.genre.join(", ")
                                : song.genre}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. ALBUMS SECTION */}
                {suggestions.albums?.length > 0 && (
                  <div className="mb-2 border-t border-neutral-700 pt-2">
                    <p className="text-xs font-bold text-neutral-400 px-3 py-2 uppercase">
                      Albums
                    </p>
                    {suggestions.albums.map((album, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSuggestionClick(album.title)}
                        className="px-2 py-2 hover:bg-neutral-700/50 rounded-md cursor-pointer flex items-center gap-3 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-md bg-neutral-800 flex items-center justify-center">
                          <Music size={16} className="text-neutral-500" />
                        </div>
                        <span className="text-white text-sm truncate">
                          {album.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {!suggestions.songs?.length &&
                  !suggestions.artists?.length &&
                  !suggestions.albums?.length && (
                    <div className="p-4 text-center text-neutral-400 text-sm">
                      No suggestions found.
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* USER MENU */}
        <div className="flex items-center gap-4 relative z-50">
          {isUserLoggedIn ? (
            <div className="flex items-center gap-3" ref={userMenuRef}>
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-white text-sm font-bold">
                  {user?.username || "User"}
                </span>
                <span className="text-neutral-400 text-xs">{user?.email}</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="bg-purple-800 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold border-2 border-transparent hover:border-white hover:scale-105 transition cursor-pointer overflow-hidden"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.username ? (
                    user.username.charAt(0).toUpperCase()
                  ) : (
                    "U"
                  )}
                </button>
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#282828] rounded-md shadow-xl border border-neutral-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-200 hover:bg-[#3E3E3E] rounded-sm transition"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-200 hover:bg-[#3E3E3E] rounded-sm transition text-left"
                    >
                      <LogOut size={16} /> Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link to="/register">
                <button className="text-neutral-400 font-bold hover:text-white hover:scale-105 transition">
                  Sign up
                </button>
              </Link>
              <Link to="/login">
                <button className="bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition">
                  Log in
                </button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* MODAL LOGOUT */}
      {isLogoutModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setIsLogoutModalOpen(false)}
          >
            <div
              className="w-full max-w-sm bg-[#282828] rounded-xl shadow-2xl border border-white/5 p-6 text-center transform scale-100 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center">
                  <LogOut className="text-white w-6 h-6 ml-1" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Đăng xuất?</h3>
              <div className="flex gap-3 justify-center mt-6">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="px-6 py-2.5 rounded-full font-bold text-white text-sm border border-neutral-600 hover:border-white hover:bg-neutral-800 transition min-w-[100px]"
                >
                  Huỷ
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-6 py-2.5 rounded-full font-bold text-black text-sm bg-green-500 hover:bg-green-400 hover:scale-105 transition shadow-lg shadow-green-900/20 min-w-[100px]"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
