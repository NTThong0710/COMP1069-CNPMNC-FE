// src/components/Header.jsx
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GoSearch } from "react-icons/go";

export default function Header({ isLoggedIn }) {
  return (
    <header className="flex justify-between items-center p-4 bg-transparent sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          <button className="bg-black/70 p-2 rounded-full"><FaChevronLeft className="text-white" /></button>
          <button className="bg-black/70 p-2 rounded-full"><FaChevronRight className="text-white" /></button>
        </div>
        {isLoggedIn && (
          <div className="relative w-full max-w-sm">
            <div className="absolute left-3 top-1/2 -translate-y-1/2"><GoSearch className="text-neutral-400" size={20} /></div>
            <input type="text" placeholder="What do you want to play?" className="bg-neutral-800 text-white placeholder-neutral-400 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-white w-full"/>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <button className="bg-white text-black font-semibold text-sm px-4 py-2 rounded-full hover:scale-105 transition">Explore Premium</button>
            <div className="bg-purple-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">T</div>
          </>
        ) : (
          <>
            <button className="text-neutral-400 font-semibold hover:text-white hover:scale-105 transition">Sign up</button>
            <button className="bg-white text-black font-semibold px-8 py-3 rounded-full hover:scale-105 transition">Log in</button>
          </>
        )}
      </div>
    </header>
  );
}