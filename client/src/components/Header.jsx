import { useState } from 'react';
import { Link } from "react-router-dom";
import { GoHome, GoSearch } from "react-icons/go";
import { Camera } from 'lucide-react';

const SpotifyLogo = () => (
  <svg role="img" height="32" width="32" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"></path>
    <path d="M11.562 6.12a.75.75 0 0 1 0 1.06L7.06 11.68a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 0 1 1.06-1.06l1.97 1.97 3.44-3.44a.75.75 0 0 1 1.06 0z"></path>
  </svg>
);

export default function Header({ isLoggedIn }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className="flex justify-between items-center p-4 bg-transparent sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        
        <Link to="/">
          <button className="bg-neutral-800/80 text-white p-2 rounded-full hover:bg-neutral-700 transition">
            <GoHome size={24} />
          </button>
        </Link>
        
        <div className="relative w-full max-w-sm">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <GoSearch className="text-neutral-400" size={20} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="What do you want to play?"
            className="bg-neutral-800 text-white placeholder-neutral-400 rounded-full py-2 pl-10 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-white"
          />
          {/* NÚT NÀY CHỈ ĐỂ DẪN ĐẾN /SEARCH */}
          <Link 
            to="/search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
          >
            <Camera size={20} />
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <button className="bg-white text-black font-semibold text-sm px-4 py-2 rounded-full hover:scale-105 transition">Explore Premium</button>
            <Link to="/profile">
              <button className="bg-purple-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">T</button>
            </Link>
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