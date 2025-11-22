import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { GoHome, GoSearch } from "react-icons/go";
import { X, LogOut, User, Music, Mic2, Disc } from 'lucide-react'; // Thêm icon fallback
import { useAuth } from "../context/AuthContext"; 

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function Header({ isLoggedIn }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  const { user, logout } = useAuth(); 
  const isUserLoggedIn = !!user; 

  // === 1. LOGIC GỌI API SUGGEST (DEBOUNCE) ===
  useEffect(() => {
    if (!isUserLoggedIn || !searchTerm.trim()) {
        setSuggestions(null);
        setShowDropdown(false);
        return;
    }

    const delayDebounceFn = setTimeout(async () => {
        if (!BASE_API_URL) return;
        try {
            // API backend CẦN TRẢ VỀ OBJECT (có ảnh) thay vì chỉ string
            const res = await fetch(`${BASE_API_URL}/search/suggest?q=${encodeURIComponent(searchTerm)}&limit=3`);
            if (res.ok) {
                const data = await res.json();
                setSuggestions(data.suggestions);
                setShowDropdown(true);
            }
        } catch (error) {
            console.error("Suggest Error:", error);
        }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isUserLoggedIn]);

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

  // Khi click vào suggestion, ta lấy cái tên để điền vào ô search
  const handleSuggestionClick = (text) => {
      setSearchTerm(text);
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(text)}`);
  };

  const handleClearSearch = () => {
      setSearchTerm('');
      setSuggestions(null);
      setShowDropdown(false);
  };

  const handleLogout = () => {
      logout();
      setShowUserMenu(false);
      navigate("/login");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-transparent sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1 relative z-50">
        
        <Link to="/">
          <button className="bg-neutral-800/80 text-white p-2 rounded-full hover:bg-neutral-700 transition shadow-md">
            <GoHome size={24} />
          </button>
        </Link>
        
        {/* === KHỐI TÌM KIẾM === */}
        <div ref={dropdownRef} className="relative w-full max-w-md group">
            <form onSubmit={handleSearchSubmit} className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <GoSearch 
                        className={`transition-colors size={20} ${isUserLoggedIn ? "text-neutral-400 group-focus-within:text-white" : "text-neutral-600"}`} 
                    />
                </div>
                
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => isUserLoggedIn && searchTerm && setShowDropdown(true)}
                    disabled={!isUserLoggedIn}
                    placeholder={isUserLoggedIn ? "What do you want to play?" : "Log in to search"}
                    className={`
                        w-full rounded-full py-3 pl-10 pr-12 transition-colors shadow-sm focus:outline-none
                        ${isUserLoggedIn 
                            ? "bg-[#242424] text-white placeholder-neutral-400 hover:bg-[#2a2a2a] focus:ring-2 focus:ring-white/20" 
                            : "bg-[#1a1a1a] text-neutral-500 placeholder-neutral-600 cursor-not-allowed border border-transparent"
                        }
                    `}
                />
                
                {searchTerm && isUserLoggedIn && (
                    <button 
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                    >
                        <X size={20} />
                    </button>
                )}
            </form>

            {/* === DROPDOWN GỢI Ý CÓ ẢNH === */}
            {isUserLoggedIn && showDropdown && suggestions && (
                <div className="absolute top-full mt-2 left-0 w-full bg-[#242424] rounded-lg shadow-2xl overflow-hidden border border-neutral-800 p-2 animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* SONGS */}
                    {suggestions.songs?.length > 0 && (
                        <div className="mb-2">
                            <p className="text-xs font-bold text-neutral-400 px-3 py-2 uppercase">Songs</p>
                            {suggestions.songs.map((song, idx) => (
                                <div key={song._id || idx} onClick={() => handleSuggestionClick(song.title)} className="px-2 py-1.5 hover:bg-neutral-700/50 rounded-md cursor-pointer flex items-center gap-3 transition-colors">
                                    {/* Ảnh bài hát (Vuông bo góc) */}
                                    {song.cover ? (
                                        <img src={song.cover} alt={song.title} className="w-10 h-10 rounded-md object-cover bg-neutral-800" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-md bg-neutral-800 flex items-center justify-center"><Music size={16} className="text-neutral-500"/></div>
                                    )}
                                    <span className="text-white text-sm truncate flex-1">{song.title}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ARTISTS */}
                    {suggestions.artists?.length > 0 && (
                        <div className="mb-2">
                             <p className="text-xs font-bold text-neutral-400 px-3 py-2 uppercase">Artists</p>
                             {suggestions.artists.map((artist, idx) => (
                                <div key={artist._id || idx} onClick={() => handleSuggestionClick(artist.name)} className="px-2 py-1.5 hover:bg-neutral-700/50 rounded-md cursor-pointer flex items-center gap-3 transition-colors">
                                    {/* Ảnh nghệ sĩ (Tròn) */}
                                    {artist.avatar || artist.image ? (
                                        <img src={artist.avatar || artist.image} alt={artist.name} className="w-10 h-10 rounded-full object-cover bg-neutral-800" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center"><Mic2 size={16} className="text-neutral-500"/></div>
                                    )}
                                    <span className="text-white text-sm truncate flex-1">{artist.name}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ALBUMS */}
                     {suggestions.albums?.length > 0 && (
                        <div>
                             <p className="text-xs font-bold text-neutral-400 px-3 py-2 uppercase">Albums</p>
                             {suggestions.albums.map((album, idx) => (
                                <div key={album._id || idx} onClick={() => handleSuggestionClick(album.title)} className="px-2 py-1.5 hover:bg-neutral-700/50 rounded-md cursor-pointer flex items-center gap-3 transition-colors">
                                    {/* Ảnh album (Vuông bo góc) */}
                                     {album.cover ? (
                                        <img src={album.cover} alt={album.title} className="w-10 h-10 rounded-md object-cover bg-neutral-800" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-md bg-neutral-800 flex items-center justify-center"><Disc size={16} className="text-neutral-500"/></div>
                                    )}
                                    <span className="text-white text-sm truncate flex-1">{album.title}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {!suggestions.songs?.length && !suggestions.artists?.length && !suggestions.albums?.length && (
                        <div className="p-4 text-center text-neutral-400 text-sm">No suggestions found.</div>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* === KHU VỰC USER INFO & MENU (Giữ nguyên) === */}
      <div className="flex items-center gap-4">
        {isUserLoggedIn ? (
          <div className="flex items-center gap-3" ref={userMenuRef}>
            <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-white text-sm font-bold">{user?.username || "User"}</span>
                <span className="text-neutral-400 text-xs">{user?.email}</span>
            </div>
            <div className="relative">
                <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="bg-purple-800 text-white w-9 h-9 rounded-full flex items-center justify-center font-bold border-2 border-transparent hover:border-white hover:scale-105 transition cursor-pointer overflow-hidden"
                    title={user?.username}
                >
                    {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        user?.username ? user.username.charAt(0).toUpperCase() : "U"
                    )}
                </button>

                {showUserMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#282828] rounded-md shadow-xl border border-neutral-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1 z-50">
                        <div className="px-3 py-2 border-b border-neutral-700 mb-1 md:hidden">
                            <p className="text-sm font-bold text-white truncate">{user?.username}</p>
                            <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-200 hover:bg-[#3E3E3E] rounded-sm transition">
                            <User size={16} /> Profile
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-200 hover:bg-[#3E3E3E] rounded-sm transition text-left">
                            <LogOut size={16} /> Log out
                        </button>
                    </div>
                )}
            </div>
          </div>
        ) : (
          <>
            <Link to='/register'><button className="text-neutral-400 font-bold hover:text-white hover:scale-105 transition">Sign up</button></Link>
            <Link to='/login'><button className="bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition">Log in</button></Link>
          </>
        )}
      </div>
    </header>
  );
}