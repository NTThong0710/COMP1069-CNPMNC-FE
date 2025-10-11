import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GoHome, GoSearch, GoBook } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import LoginTooltip from './LoginTooltip';

function PlaylistItem({ image, title, subtitle }) {
  return (
    <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-neutral-800 transition">
      <img src={image} alt={title} className="w-12 h-12 rounded-md object-cover" />
      <div>
        <p className="font-semibold text-white text-sm truncate">{title}</p>
        <p className="text-xs text-neutral-400">{subtitle}</p>
      </div>
    </a>
  );
}

export default function Sidebar({ isLoggedIn }) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  // TẠO REF ĐỂ THAM CHIẾU ĐẾN KHU VỰC "CREATE PLAYLIST"
  const createPlaylistRef = useRef(null); 

  const userLibrary = [
    { image: 'https://i.scdn.co/image/ab67706f00000002162a0542915598284534714f', title: 'Liked Songs', subtitle: 'Playlist • 1 song' },
    { image: 'https://i.scdn.co/image/ab67616d00004851299227f33963534e12c1a403', title: 'Có em', subtitle: 'Album • Madihu, WOKEUP' },
    { image: 'https://i.scdn.co/image/ab67616d000048510e1e6b528827a4e612984536', title: 'Vũ', subtitle: 'Artist' },
    { image: 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228', title: 'Lana Del Rey Radio', subtitle: 'Playlist' },
  ];

  // Hàm xử lý click, lấy vị trí của nút được bấm
  const handleAuthActionClick = (event) => {
    if (!isLoggedIn) {
      event.preventDefault();
      event.stopPropagation();

      // CHỈ LẤY VỊ TRÍ CỦA REF, BẤT KỂ CLICK VÀO ĐÂU
      if (createPlaylistRef.current) {
        const rect = createPlaylistRef.current.getBoundingClientRect();
        setTooltipPosition({
          top: rect.top,          // Căn trên bằng mép trên của khu vực ref
          left: rect.right + 10,  // Căn trái, cách mép phải của khu vực ref 10px
        });
        setIsTooltipOpen(true);
      }
    }
  };

  // Tự động đóng tooltip khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = () => {
      setIsTooltipOpen(false);
    };

    if (isTooltipOpen) {
      window.addEventListener('click', handleClickOutside);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isTooltipOpen]);

  return (
    <div className="w-96 flex-shrink-0 bg-black p-2 flex flex-col gap-2">
      <div className="bg-neutral-900 rounded-lg p-4 flex flex-col gap-4">
        <Link to="/" className="flex items-center gap-4 text-white font-bold">
          <GoHome size={24} />
          <span>Home</span>
        </Link>
        <Link to="/search" className="flex items-center gap-4 text-neutral-400 hover:text-white transition font-bold">
          <GoSearch size={24} />
          <span>Search</span>
        </Link>
      </div>

      <div className="bg-neutral-900 rounded-lg flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4">
          <span className="flex items-center gap-2 text-white transition font-bold"><GoBook size={24} /><span>Your Library</span></span>
          <button
            onClick={handleAuthActionClick}
            className="group relative flex items-center justify-center w-10 h-10 
                      rounded-full bg-neutral-900 text-white 
                      transition 
                      hover:bg-neutral-800"
          >
            <FiPlus size={20} className=" group-hover:scale-110" />
          </button>

        </div>
        
        {isLoggedIn ? (
          <div className="overflow-y-auto px-2">
            {userLibrary.map((item, index) => (
              <PlaylistItem key={index} image={item.image} title={item.title} subtitle={item.subtitle} />
            ))}
          </div>
        ) : (
          <div ref={createPlaylistRef} className="bg-neutral-800 rounded-lg p-4 m-2 text-white">
            <p className="font-bold text-sm mb-1">Create your first playlist</p>
            <p className="text-xs mb-4">It's easy, we'll help you</p>
            <button onClick={handleAuthActionClick} className="bg-white text-black text-xs text-[13px] font-bold px-6 py-2 rounded-full hover:scale-105 transition">Create playlist</button>
          </div>
        )}
      </div>

      {/* Render tooltip ở đây, truyền các props cần thiết */}
      <LoginTooltip 
        isOpen={isTooltipOpen} 
        onClose={() => setIsTooltipOpen(false)} 
        position={tooltipPosition}
      />
    </div>
  );
}