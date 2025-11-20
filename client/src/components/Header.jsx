import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom"; 
import { GoHome, GoSearch } from "react-icons/go";
import { X, LogOut, User } from 'lucide-react'; 
import { useAuth } from "../context/AuthContext"; // ✅ Import Auth Context

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function Header({ isLoggedIn }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // === STATE CHO SEARCH SUGGEST ===
  const [suggestions, setSuggestions] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // === STATE CHO USER MENU ===
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  const { user, logout } = useAuth(); 
  const isUserLoggedIn = isLoggedIn || !!user;

  // === LOGIC SEARCH SUGGEST ===
  useEffect(() => {
    if (!searchTerm.trim()) {
        setSuggestions(null);
        setShowDropdown(false);
        return;
    }

    const delayDebounceFn = setTimeout(async () => {
        if (!BASE_API_URL) return;
        try {
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
  }, [searchTerm]);

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

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

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

  // === LOGIC LOGOUT ===
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
                    <GoSearch className="text-neutral-400 group-focus-within:text-white transition-colors" size={20} />
                </div>
                
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm && setShowDropdown(true)}
                    placeholder="What do you want to play?"
                    className="bg-[#242424] text-white placeholder-neutral-400 rounded-full py-3 pl-10 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-white/20 hover:bg-[#2a2a2a] transition-colors shadow-sm"
                />
                
                {searchTerm && (
                    <button 
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                    >
                        <X size={20} />
                    </button>
                )}
            </form>

            {/* === DROPDOWN GỢI Ý === */}
            {showDropdown && suggestions && (
                <div className="absolute top-full mt-2 left-0 w-full bg-[#242424] rounded-lg shadow-2xl overflow-hidden border border-neutral-800 p-2 animate-in fade-in zoom-in-95 duration-200">
                    
                    {suggestions.songs?.length > 0 && (
                        <div className="mb-2">
                            <p className="text-xs font-bold text-neutral-400 px-3 py-2 uppercase">Songs</p>
                            {suggestions.songs.map((songName, idx) => (
                                <div key={`s-${idx}`} onClick={() => handleSuggestionClick(songName)} className="px-3 py-2 hover:bg-neutral-700/50 rounded-md cursor-pointer flex items-center gap-3 transition-colors">
                                    <GoSearch size={14} className="text-neutral-400" />
                                    <span className="text-white text-sm truncate">{songName}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {suggestions.artists?.length > 0 && (
                        <div className="mb-2">
                             <p className="text-xs font-bold text-neutral-400 px-3 py-2 uppercase">Artists</p>
                             {suggestions.artists.map((artistName, idx) => (
                                <div key={`a-${idx}`} onClick={() => handleSuggestionClick(artistName)} className="px-3 py-2 hover:bg-neutral-700/50 rounded-md cursor-pointer flex items-center gap-3 transition-colors">
                                    <GoSearch size={14} className="text-neutral-400" />
                                    <span className="text-white text-sm truncate">{artistName}</span>
                                </div>
                            ))}
                        </div>
                    )}

                     {suggestions.albums?.length > 0 && (
                        <div>
                             <p className="text-xs font-bold text-neutral-400 px-3 py-2 uppercase">Albums</p>
                             {suggestions.albums.map((albumName, idx) => (
                                <div key={`al-${idx}`} onClick={() => handleSuggestionClick(albumName)} className="px-3 py-2 hover:bg-neutral-700/50 rounded-md cursor-pointer flex items-center gap-3 transition-colors">
                                    <GoSearch size={14} className="text-neutral-400" />
                                    <span className="text-white text-sm truncate">{albumName}</span>
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

      {/* === KHU VỰC USER INFO & MENU === */}
      <div className="flex items-center gap-4">
        {isUserLoggedIn ? (
          <div className="flex items-center gap-3" ref={userMenuRef}>
            
            {/* 🛑 Thay nút "Explore Premium" bằng Info User */}
            <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-white text-sm font-bold">{user?.username || "User"}</span>
                <span className="text-neutral-400 text-xs">{user?.email}</span>
            </div>

            {/* Avatar Button */}
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

                {/* Dropdown Menu */}
                {showUserMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#282828] rounded-md shadow-xl border border-neutral-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1 z-50">
                        {/* Info hiển thị thêm trong menu cho màn hình nhỏ */}
                        <div className="px-3 py-2 border-b border-neutral-700 mb-1 md:hidden">
                            <p className="text-sm font-bold text-white truncate">{user?.username}</p>
                            <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
                        </div>
                        
                        <Link 
                            to="/profile" 
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-200 hover:bg-[#3E3E3E] rounded-sm transition"
                        >
                            <User size={16} /> Profile
                        </Link>
                        
                        <button 
                            onClick={handleLogout}
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
            <Link to='/register'><button className="text-neutral-400 font-bold hover:text-white hover:scale-105 transition">Sign up</button></Link>
            <Link to='/login'><button className="bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition">Log in</button></Link>
          </>
        )}
      </div>
    </header>
  );
}