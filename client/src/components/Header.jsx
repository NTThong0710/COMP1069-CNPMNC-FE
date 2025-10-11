import { useState, useRef, useEffect } from 'react'; // Thêm hook
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GoHome, GoSearch } from "react-icons/go";
import { IoMdClose } from "react-icons/io"; // Icon để đóng thanh search
import { Link } from "react-router-dom"; 

// Bỏ component HeaderNavItem vì không còn dùng nữa

export default function Header({ isLoggedIn }) {
  // --- STATE MỚI ĐỂ QUẢN LÝ VIỆC HIỂN THỊ THANH TÌM KIẾM ---
  const [showSearchBar, setShowSearchBar] = useState(false);
  const searchInputRef = useRef(null);

  // Tự động focus vào ô input khi nó xuất hiện
  useEffect(() => {
    if (showSearchBar && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchBar]);

  return (
    <header className="flex justify-between items-center p-1 bg-transparent sticky top-0 z-10">
      {/* --- PHẦN BÊN TRÁI HEADER --- */}
      <div className="flex items-center pt-4 gap-4 flex-1"> {/* Thêm flex-1 để chiếm không gian */}
        {/* Nút Back/Forward */}
        <div className="hidden md:flex items-center gap-2">
          <button className="bg-black/70 p-2 rounded-full"><FaChevronLeft className="text-white" /></button>
          <button className="bg-black/70 p-2 rounded-full"><FaChevronRight className="text-white" /></button>
        </div>

        {/* --- HIỂN THỊ ĐỘNG: ICON HOẶC THANH TÌM KIẾM --- */}
        {/* Logic này giờ hiển thị cho tất cả user, không phụ thuộc isLoggedIn */}
        {showSearchBar ? (
          // 1. Nếu showSearchBar là true, hiển thị thanh tìm kiếm
          <div className="relative w-full max-w-sm">
            <div className="absolute left-3 top-1/2 -translate-y-1/2"><GoSearch className="text-neutral-400" size={20} /></div>
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="What do you want to play?" 
              className="bg-neutral-800 text-white placeholder-neutral-400 rounded-full py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-white w-full"
            />
            <button 
              onClick={() => setShowSearchBar(false)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <IoMdClose size={22} />
            </button>
          </div>
        ) : (
          // 2. Nếu là false, hiển thị icon Home và Search
          <div className="flex items-center gap-2">
            <Link to="/">
              <button className="bg-neutral-800/80 text-white p-2 rounded-full hover:bg-neutral-700 transition">
                <GoHome size={24} />
              </button>
            </Link>
            <button 
              onClick={() => setShowSearchBar(true)} 
              className="bg-neutral-800/80 text-white p-2 rounded-full hover:bg-neutral-700 transition"
            >
              <GoSearch size={24} />
            </button>
          </div>
        )}
      </div>

      {/* --- PHẦN BÊN PHẢI HEADER (Không đổi) --- */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <button className="bg-white text-black font-semibold text-sm px-4 py-2 rounded-full hover:scale-105 transition">Explore Premium</button>
            <button className="bg-purple-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">T</button>
          </>
        ) : (
          <>
            <Link to='/register'><button className="text-neutral-400 font-semibold hover:text-white hover:scale-105 transition">Sign up</button></Link>
            <Link to='/login'><button className="bg-white text-black font-semibold px-8 py-3 rounded-full hover:scale-105 transition">Log in</button></Link>
          </>
        )}
      </div>
    </header>
  );
}