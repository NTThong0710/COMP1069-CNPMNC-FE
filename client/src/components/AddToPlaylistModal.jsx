import React, { useState } from "react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { createPortal } from "react-dom"; // ✅ Import createPortal

const BASE_API_URL = import.meta.env.VITE_API_URL;

const AddToPlaylistModal = ({ isOpen, onClose, song, userPlaylists }) => {
  // 1. Lấy trigger từ Context
  const { triggerPlaylistRefresh } = useAuth();
  const { addToast } = useToast();
  const [loadingPlaylistId, setLoadingPlaylistId] = useState(null);

  if (!isOpen || !song) return null;

  const handleAddToPlaylist = async (playlistId) => {
    if (loadingPlaylistId) return;
    setLoadingPlaylistId(playlistId);

    try {
      const token = localStorage.getItem("accessToken");
      const url = `${BASE_API_URL}/playlists/${playlistId}/songs`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          songId: song.id || song._id,
          jamendoId: song.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Lỗi khi thêm bài hát`);
      }

      // Toast success
      const playlistName = userPlaylists.find(pl => pl._id === playlistId)?.name || "Playlist";
      addToast(
        `✓ Đã thêm "${song.title || song.name}" vào "${playlistName}"`,
        "success",
        3000
      );

      // 2. TRIGGER REFRESH SIDEBAR (Để cập nhật ảnh bìa)
      triggerPlaylistRefresh();

      // Dispatch event cũ (Giữ lại nếu logic khác cần)
      window.dispatchEvent(
        new CustomEvent("songAddedToPlaylist", {
          detail: { playlistId, song }
        })
      );

      onClose(); // Đóng modal sau khi thêm thành công
    } catch (error) {
      console.error("Lỗi thêm song:", error);
      addToast(`❌ ${error.message}`, "error", 3000);
    } finally {
      setLoadingPlaylistId(null);
    }
  };

  // ✅ DÙNG CREATE PORTAL ĐỂ RENDER RA NGOÀI DOM (Tránh lỗi z-index)
  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* 👇 THÊM CLASS 'add-playlist-modal-content' ĐỂ FIX LỖI CLICK OUTSIDE */}
      <div 
        className="w-full max-w-md bg-neutral-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden add-playlist-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex justify-between items-center p-4 border-b border-white/10 bg-neutral-800/50">
          <h3 className="text-lg font-bold text-white">Thêm vào Playlist</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* Danh sách Playlist */}
        <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {userPlaylists && userPlaylists.length > 0 ? (
            userPlaylists.map((playlist) => (
              <div key={playlist._id} className="group flex items-center gap-3 p-3 rounded-md hover:bg-white/10 transition-all duration-200 cursor-pointer" onClick={() => handleAddToPlaylist(playlist._id)}>
                <div className="w-12 h-12 flex items-center justify-center bg-neutral-800 rounded shadow-sm group-hover:bg-neutral-700 transition-colors overflow-hidden">
                   {/* Nếu playlist có ảnh thì hiện ảnh, không thì hiện nốt nhạc */}
                   {playlist.imageUrl || playlist.cover ? (
                      <img src={playlist.imageUrl || playlist.cover} alt="" className="w-full h-full object-cover" />
                   ) : (
                      "🎵"
                   )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-green-400 transition-colors">{playlist.name}</p>
                  <p className="text-xs text-gray-400">{playlist.songs?.length || 0} bài hát</p>
                </div>
                <div>
                  {loadingPlaylistId === playlist._id ? (
                    <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <button
                      className="px-3 py-1 text-xs font-semibold text-white border border-gray-600 rounded-full hover:border-white group-hover:scale-105 transition-all"
                    >
                      Thêm
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400"><p>Bạn chưa tạo playlist nào.</p></div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddToPlaylistModal;