import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaPlay, FaRegClock, FaPen, FaTimes, FaTrash } from "react-icons/fa";
import { Music } from "lucide-react";
// 1. IMPORT THƯ VIỆN TOAST
import toast, { Toaster } from "react-hot-toast";

const BASE_API_URL = import.meta.env.VITE_API_URL;

// --- UTILS ---
const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
};

const formatDateAdded = (dateString) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    if (diffDays <= 1) return "Today";
    return `${diffDays} days ago`;
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default function PlaylistPage({ onSongSelect }) {
  const { playlistId } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // State Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    cover: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // 2. STATE CHO CUSTOM CONFIRM MODAL (Thay thế window.confirm)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // Lưu ID bài hát đang muốn xóa

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchFullPlaylistData();
  }, [playlistId]);

  const fetchFullPlaylistData = async () => {
    setLoading(true);
    if (!BASE_API_URL) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BASE_API_URL}/playlists/${playlistId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Playlist not found`);

      const data = await res.json();
      const playlistData = data.data || data;
      setPlaylist(playlistData);

      setEditFormData({
        name: playlistData.name,
        description: playlistData.description || "",
        cover:
          playlistData.imageUrl ||
          playlistData.cover ||
          playlistData.image ||
          "",
      });

      if (playlistData.songs && Array.isArray(playlistData.songs)) {
        const formattedTracks = playlistData.songs
          .map((item) => {
            let song = item;
            let addedAt = item.createdAt;
            if (item.song && typeof item.song === "object") {
              song = item.song;
              addedAt = item.addedAt || song.createdAt;
            }
            if (!song || !song._id) return null;

            const albumName =
              song.album && song.album.title ? song.album.title : "Single";
            const artistName =
              typeof song.artist === "object" && song.artist !== null
                ? song.artist.name || song.artist.username
                : "Unknown Artist";

            return {
              id: song._id,
              title: song.title,
              artist: artistName,
              album: albumName,
              image: song.cover || "https://via.placeholder.com/50",
              duration: formatDuration(song.duration),
              url: song.url,
              dateAdded: formatDateAdded(addedAt),
            };
          })
          .filter(Boolean);
        setTracks(formattedTracks);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC XÓA MỚI (ĐẸP HƠN) ---

  // Bước 1: Khi bấm thùng rác -> Chỉ hiện Modal hỏi (chưa xóa ngay)
  const triggerDelete = (e, songId) => {
    e.stopPropagation();
    setConfirmDeleteId(songId); // Mở modal xác nhận
  };

  // Bước 2: Khi bấm "Yes" trong Modal -> Gọi API và dùng Toast
  const confirmDeleteSong = async () => {
    if (!confirmDeleteId) return;
    const songId = confirmDeleteId;
    setConfirmDeleteId(null); // Đóng modal ngay

    const deletePromise = new Promise(async (resolve, reject) => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${BASE_API_URL}/playlists/${playlistId}/songs/${songId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const resData = await res.json();
        if (!res.ok) throw new Error(resData.message || "Failed");

        // Cập nhật UI
        setTracks((prev) => prev.filter((t) => t.id !== songId));
        resolve();
      } catch (err) {
        reject(err);
      }
    });

    // Hiển thị Toast thông báo trạng thái
    toast.promise(
      deletePromise,
      {
        loading: "Deleting song...",
        success: "Removed from playlist",
        error: (err) => `Error: ${err.message}`,
      },
      {
        style: {
          background: "#333",
          color: "#fff",
        },
      }
    );
  };

  // --- LOGIC EDIT (DÙNG TOAST THAY ALERT) ---
  const handleUpdatePlaylist = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Toast Promise cho việc update
    const updatePromise = new Promise(async (resolve, reject) => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${BASE_API_URL}/playlists/${playlistId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editFormData),
        });
        if (!res.ok) throw new Error("Update failed");

        setPlaylist((prev) => ({
          ...prev,
          name: editFormData.name,
          description: editFormData.description,
          imageUrl: editFormData.cover,
        }));
        setIsEditModalOpen(false);
        resolve();
      } catch (e) {
        reject(e);
      }
    });

    toast.promise(
      updatePromise,
      {
        loading: "Updating playlist...",
        success: "Playlist updated!",
        error: "Failed to update",
      },
      {
        style: { background: "#333", color: "#fff" },
      }
    );

    setIsSaving(false);
  };

  const getOwnerName = () => {
    if (
      playlist?.user &&
      typeof playlist.user === "object" &&
      playlist.user.username
    ) {
      return playlist.user.username;
    }
    if (currentUser && currentUser.username) return currentUser.username;
    return "User";
  };

  if (loading)
    return (
      <main className="p-8 bg-[#121212] min-h-screen text-white">
        Loading...
      </main>
    );
  if (error || !playlist)
    return (
      <main className="p-8 bg-[#121212] min-h-screen text-white">
        Error: {error}
      </main>
    );

  const coverImage =
    playlist.imageUrl ||
    playlist.cover ||
    playlist.image ||
    "bg-gradient-to-br from-indigo-500 to-purple-700";

  return (
    <main className="min-h-screen bg-[#121212] pb-24 font-sans text-[#b3b3b3] relative">
      {/* 3. CẤU HÌNH TOASTER GLOBAL */}
      <Toaster position="bottom-center" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 p-8 bg-gradient-to-b from-[#503e6d] to-[#121212]">
        <div
          onClick={() => setIsEditModalOpen(true)}
          className="group w-40 h-40 sm:w-52 sm:h-52 shadow-2xl flex items-center justify-center bg-[#282828] overflow-hidden rounded-md flex-shrink-0 cursor-pointer relative"
        >
          {typeof coverImage === "string" && coverImage.startsWith("http") ? (
            <img
              src={coverImage}
              alt={playlist.name}
              className="w-full h-full object-cover group-hover:opacity-70 transition-opacity"
            />
          ) : (
            <Music size={80} className="text-white/60" />
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
            <div className="text-white text-xs font-bold flex flex-col items-center">
              <FaPen className="mb-1" />
              <span>Choose photo</span>
            </div>
          </div>
        </div>

        <div className="text-center sm:text-left flex flex-col gap-2 w-full">
          <p className="text-xs font-bold text-white uppercase tracking-wider">
            Playlist
          </p>
          <h1
            onClick={() => setIsEditModalOpen(true)}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tighter line-clamp-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            {playlist.name}
          </h1>
          <p
            className="text-sm text-[#b3b3b3] opacity-70 cursor-pointer hover:text-white"
            onClick={() => setIsEditModalOpen(true)}
          >
            {playlist.description || "No description"}
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-1 mt-2 text-sm text-white font-medium">
            <span className="font-bold hover:underline cursor-pointer">
              {getOwnerName()}
            </span>
            <span className="mx-1">•</span>
            <span>{tracks.length} songs</span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-6 bg-[#121212]/50 backdrop-blur-3xl">
        <div className="flex items-center gap-6 mb-6">
          <button
            onClick={() => tracks[0] && onSongSelect(tracks[0], tracks, 0)}
            disabled={tracks.length === 0}
            className="bg-[#1ed760] w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#1fdf64] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-black"
          >
            <FaPlay size={22} className="pl-1" />
          </button>
        </div>

        {tracks.length > 0 && (
          <div>
            <div className="grid grid-cols-[16px_4fr_2fr_2fr_minmax(80px,1fr)] gap-4 text-[#b3b3b3] border-b border-white/10 px-4 py-2 mb-4 uppercase text-[11px] font-normal tracking-widest sticky top-16 bg-[#121212] z-10">
              <span className="text-center">#</span>
              <span>Title</span>
              <span className="hidden md:block">Album</span>
              <span className="hidden lg:block">Date Added</span>
              <span className="flex justify-end pr-2">
                <FaRegClock size={16} />
              </span>
            </div>

            <div className="flex flex-col">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className="group grid grid-cols-[16px_4fr_2fr_2fr_minmax(80px,1fr)] gap-4 items-center hover:bg-white/10 px-4 py-2 rounded-md cursor-pointer transition-colors text-sm"
                  onClick={() => onSongSelect(track, tracks, index)}
                >
                  <div className="w-4 text-center flex items-center justify-center relative min-h-[16px]">
                    <span className="group-hover:hidden text-[#b3b3b3] font-medium">
                      {index + 1}
                    </span>
                    <button className="hidden group-hover:block text-white absolute">
                      <FaPlay size={10} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 overflow-hidden">
                    <img
                      src={track.image}
                      alt={track.title}
                      className="w-10 h-10 object-cover rounded shadow-sm flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <p className="font-medium text-white truncate text-[15px] mb-0.5 group-hover:text-[#1ed760] transition-colors">
                        {track.title}
                      </p>
                      <p className="text-xs text-[#b3b3b3] truncate hover:underline hover:text-white transition-colors">
                        {track.artist}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center min-w-0">
                    <p className="text-[#b3b3b3] truncate hover:text-white hover:underline transition-colors text-xs">
                      {track.album}
                    </p>
                  </div>
                  <div className="hidden lg:flex items-center min-w-0">
                    <p className="text-[#b3b3b3] text-xs">{track.dateAdded}</p>
                  </div>
                  <div className="flex justify-end pr-2 items-center text-xs font-variant-numeric tabular-nums text-[#b3b3b3]">
                    {/* NÚT DELETE GỌI MODAL */}
                    <button
                      className="invisible group-hover:visible mr-3 text-neutral-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                      onClick={(e) => triggerDelete(e, track.id)}
                      title="Remove from playlist"
                    >
                      <FaTrash size={14} />
                    </button>
                    <span>{track.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL EDIT DETAILS (Giữ nguyên) --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#282828] w-full max-w-lg rounded-lg shadow-2xl p-6 relative animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Edit details</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#b3b3b3] hover:text-white"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form
              onSubmit={handleUpdatePlaylist}
              className="flex flex-col md:flex-row gap-6"
            >
              <div className="flex justify-center md:justify-start">
                <div className="w-40 h-40 bg-[#121212] shadow-lg flex flex-col items-center justify-center relative group overflow-hidden rounded text-center">
                  {editFormData.cover ? (
                    <img
                      src={editFormData.cover}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music size={50} className="text-[#b3b3b3]" />
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className="w-full bg-[#3e3e3e] text-white border border-transparent focus:border-[#535353] focus:outline-none rounded p-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-[#3e3e3e] text-white border border-transparent focus:border-[#535353] focus:outline-none rounded p-2 text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={editFormData.cover}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        cover: e.target.value,
                      })
                    }
                    className="w-full bg-[#3e3e3e] text-white border border-transparent focus:border-[#535353] focus:outline-none rounded p-2 text-xs"
                  />
                </div>
              </div>
            </form>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2 text-white font-bold text-sm hover:scale-105 transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePlaylist}
                disabled={isSaving}
                className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL CONFIRM DELETE (MỚI) --- */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#282828] p-6 rounded-lg shadow-2xl max-w-sm w-full text-center animate-fade-in-up border border-white/10">
            <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
            <p className="text-neutral-400 mb-6 text-sm">
              This will remove the song from your playlist.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-6 py-2 rounded-full font-bold text-white hover:scale-105 transition bg-transparent border border-neutral-600 hover:border-white text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSong}
                className="px-6 py-2 rounded-full font-bold text-black bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-105 transition text-sm"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
