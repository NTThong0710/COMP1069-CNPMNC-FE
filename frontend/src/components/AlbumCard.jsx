import React from 'react';
import { FaPlay } from "react-icons/fa";
import { Link } from 'react-router-dom';

function AlbumCard({ id, image, title, artist, releasedate }) {
  // Lấy năm phát hành để hiển thị thêm thông tin (nếu có)
  const year = releasedate ? new Date(releasedate).getFullYear() : '';

  return (
    <Link 
      to={`/album/${id}`} 
      aria-label={`Go to album ${title}`}
      className="block w-full" // Đảm bảo thẻ Link chiếm hết chiều rộng ô Grid
    >
      <div className="group relative bg-[#181818] hover:bg-[#282828] p-4 rounded-lg transition-all duration-300 cursor-pointer shadow-lg h-full flex flex-col">
        
        {/* KHUNG ẢNH */}
        <div className="relative mb-4 w-full aspect-square rounded-md overflow-hidden shadow-lg bg-neutral-800">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          
          {/* Nút Play nổi lên khi Hover */}
          <button 
            aria-label={`Play album ${title}`}
            className="
              absolute bottom-2 right-2 
              bg-green-500 w-12 h-12 rounded-full shadow-xl 
              flex items-center justify-center 
              opacity-0 translate-y-4 
              group-hover:opacity-100 group-hover:translate-y-0 
              transition-all duration-300 hover:scale-110 hover:bg-green-400
            "
            onClick={(e) => {
              e.preventDefault(); // Ngăn chặn chuyển trang khi bấm nút Play
              // Thêm logic play album ở đây nếu cần
              console.log("Play album:", title);
            }}
          >
            <FaPlay className="text-black pl-1 text-lg" />
          </button>
        </div>

        {/* THÔNG TIN TEXT */}
        <div className="flex flex-col min-w-0 mt-auto">
          <h3 className="font-bold text-white truncate text-[15px] md:text-base" title={title}>
            {title}
          </h3>
          <p className="text-sm text-neutral-400 mt-1 truncate group-hover:text-white transition-colors">
            {year ? `${year} • ` : ''}{artist}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default AlbumCard;