// src/components/AddToPlaylistModal.jsx
import React, { useState } from "react";

// ... (Giữ nguyên phần Icons và Imports icon) ...
// Icon MusicNoteIcon, CloseIcon giữ nguyên như cũ

const AddToPlaylistModal = ({ isOpen, onClose, song, userPlaylists }) => {
  const [loadingPlaylistId, setLoadingPlaylistId] = useState(null);

  if (!isOpen) return null;

  const handleAddToPlaylist = async (playlistId) => {
    if (loadingPlaylistId) return;
    setLoadingPlaylistId(playlistId);

    try {
      // Lấy token từ localStorage (theo tên bạn cung cấp: 'accessToken')
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:5000/api/playlists/${playlistId}/songs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // THÊM DÒNG NÀY: Xác thực người dùng
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            // Backend mong đợi "jamendoId".
            // Đảm bảo object 'song' truyền vào có thuộc tính 'id' là ID của Jamendo
            jamendoId: song.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi thêm bài hát");
      }

      alert(`Đã thêm "${song.title || song.name}" vào playlist!`);
      onClose();
    } catch (error) {
      console.error("Lỗi:", error);
      alert(error.message || "Không thể kết nối Server");
    } finally {
      setLoadingPlaylistId(null);
    }
  };

  return (
    // ... (Giữ nguyên phần giao diện JSX TailwindCSS như phiên bản trước) ...
    // Copy lại phần return của câu trả lời trước, không cần sửa gì ở giao diện
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* ... Nội dung Modal giữ nguyên ... */}
      <div
        className="w-full max-w-md bg-neutral-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/10 bg-neutral-800/50">
          <h3 className="text-lg font-bold text-white">Thêm vào Playlist</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* Body List */}
        <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {userPlaylists && userPlaylists.length > 0 ? (
            userPlaylists.map((playlist) => (
              <div
                key={playlist._id}
                onClick={() => handleAddToPlaylist(playlist._id)}
                className="group flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-white/10 transition-all duration-200"
              >
                {/* Icon Playlist */}
                <div className="w-12 h-12 flex items-center justify-center bg-neutral-800 rounded shadow-sm group-hover:bg-neutral-700 transition-colors">
                  🎵
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-green-400 transition-colors">
                    {playlist.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {/* Hiển thị số lượng bài hát */}
                    {playlist.songs?.length || 0} bài hát
                  </p>
                </div>

                <div>
                  {loadingPlaylistId === playlist._id ? (
                    <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <button className="px-3 py-1 text-xs font-semibold text-white border border-gray-600 rounded-full hover:border-white group-hover:scale-105 transition-all">
                      Thêm
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Bạn chưa tạo playlist nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
