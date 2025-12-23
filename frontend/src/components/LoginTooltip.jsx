import React from "react";
import { Link } from "react-router-dom";

export default function LoginTooltip({ isOpen, onClose, position }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed z-[100] w-[300px] bg-[#3d91f4] text-white p-4 rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
      style={{ top: position.top, left: position.left }}
    >
      {/* Mũi tên chỉ sang trái */}
      <div className="absolute top-[18px] -left-[5px] w-[10px] h-[10px] bg-[#3d91f4] rotate-45"></div>

      <p className="font-bold text-[16px] mb-1">Create a playlist</p>
      <p className="text-[14px] mb-4">Log in to create and share playlists.</p>

      <div className="flex justify-end items-center gap-4">
        <button
          onClick={onClose}
          className="bg-none border-none text-white font-bold cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
        >
          Not now
        </button>
        <Link to='/login'>
          <button className="bg-white text-black font-bold px-6 py-2 rounded-full cursor-pointer hover:opacity-90 transition-opacity">
            Log in
          </button>
        </Link>
        
      </div>
    </div>
  );
}
