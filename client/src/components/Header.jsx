import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom'; // 👈 1. Import cái này để sửa lỗi bị che
import { Link, useNavigate } from "react-router-dom";
import { GoHome, GoSearch } from "react-icons/go";
import { X, LogOut, User, Music, Mic2, Disc, AlertTriangle } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function Header({ isLoggedIn }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // State Modal Logout
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const userMenuRef = useRef(null);

    const { user, logout } = useAuth();
    const { addToast } = useToast();
    const isUserLoggedIn = !!user;

    // ... (Giữ nguyên các useEffect và handlers cũ của bạn) ...
    // === 1. LOGIC SUGGEST (DEBOUNCE) ===
    useEffect(() => {
        if (!isUserLoggedIn || !searchTerm.trim()) {
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
                        <button className="bg-neutral-800/80 text-white p-2 rounded-full hover:bg-neutral-700 transition shadow-md" aria-label="Home">
                            <GoHome size={24} />
                        </button>
                    </Link>

                    {/* SEARCH BAR & DROPDOWN */}
                    <div ref={dropdownRef} className="relative w-full max-w-md group">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <GoSearch className={`transition-colors size={20} ${isUserLoggedIn ? "text-neutral-400 group-focus-within:text-white" : "text-neutral-600"}`} />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => isUserLoggedIn && searchTerm && setShowDropdown(true)}
                                disabled={!isUserLoggedIn}
                                placeholder={isUserLoggedIn ? "What do you want to play?" : "Log in to search"}
                                className={`w-full rounded-full py-3 pl-10 pr-12 transition-colors shadow-sm focus:outline-none ${isUserLoggedIn ? "bg-[#242424] text-white placeholder-neutral-400 hover:bg-[#2a2a2a] focus:ring-2 focus:ring-white/20" : "bg-[#1a1a1a] text-neutral-500 placeholder-neutral-600 cursor-not-allowed border border-transparent"}`}
                            />
                            {searchTerm && isUserLoggedIn && (
                                <button type="button" onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1">
                                    <X size={20} />
                                </button>
                            )}
                        </form>

                        {/* DROPDOWN GỢI Ý */}
                        {isUserLoggedIn && showDropdown && suggestions && (
                            <div className="absolute top-full mt-2 left-0 w-full bg-[#242424] rounded-lg shadow-2xl overflow-hidden border border-neutral-800 p-2 animate-in fade-in zoom-in-95 duration-200">
                                {/* ... (Giữ nguyên logic hiển thị songs/artists/albums cũ) ... */}
                                {suggestions.songs?.length > 0 && (
                                    <div className="mb-2">
                                        <p className="text-xs font-bold text-neutral-400 px-3 py-2 uppercase">Songs</p>
                                        {suggestions.songs.map((song, idx) => (
                                            <div key={song._id || idx} onClick={() => handleSuggestionClick(song.title)} className="px-2 py-1.5 hover:bg-neutral-700/50 rounded-md cursor-pointer flex items-center gap-3 transition-colors">
                                                {song.cover ? <img src={song.cover} alt="" className="w-10 h-10 rounded-md object-cover bg-neutral-800" /> : <div className="w-10 h-10 rounded-md bg-neutral-800 flex items-center justify-center"><Music size={16} className="text-neutral-500" /></div>}
                                                <span className="text-white text-sm truncate flex-1">{song.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* ... (Artists & Albums tương tự code cũ) ... */}
                                {!suggestions.songs?.length && !suggestions.artists?.length && !suggestions.albums?.length && (
                                    <div className="p-4 text-center text-neutral-400 text-sm">No suggestions found.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* USER MENU & AUTH BUTTONS */}
                <div className="flex items-center gap-4 relative z-50">
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
                                >
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="User avatar" className="w-full h-full object-cover" />
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
                                        <button onClick={handleLogoutClick} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-200 hover:bg-[#3E3E3E] rounded-sm transition text-left">
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

            {/* === MODAL LOGOUT (Dùng Portal để thoát khỏi Header) === */}
            {isLogoutModalOpen && createPortal(
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
                        <p className="text-neutral-400 mb-6 text-sm">
                            Bạn có chắc chắn muốn đăng xuất tài khoản không?
                        </p>

                        <div className="flex gap-3 justify-center">
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
                document.body // 👈 Bắn Modal thẳng vào body
            )}
        </>
    );
}