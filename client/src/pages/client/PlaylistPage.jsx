import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaPlay, FaRegClock } from "react-icons/fa";
import { Music } from "lucide-react"; // Icon mặc định cho Playlist

const BASE_API_URL = import.meta.env.VITE_API_URL;

// Giả lập hàm fetch chi tiết từng bài hát
const fetchSongDetails = async (songId) => {
  // Trong dự án thật, bạn sẽ gọi API GET /api/songs/:id ở đây
  // Ví dụ: const songRes = await fetch(`${BASE_API_URL}/songs/${songId}`);
  // Giờ ta sẽ mock dữ liệu với cấu trúc đầy đủ
  return {
    id: songId,
    title: `Song Title ${songId.slice(-4)}`,
    artist: "Unknown Artist",
    album: "Unknown Album",
    duration: "3:45",
    image: "https://via.placeholder.com/50",
    url: "/mock-song.mp3", // URL nhạc để player phát
  };
};

export default function PlaylistPage({ onSongSelect }) {
  const { playlistId } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFullPlaylistData = async () => {
      setLoading(true);
      setError(null);

      if (!BASE_API_URL) {
        setError("VITE_API_URL chưa được cấu hình!");
        setLoading(false);
        return;
      }

      try {
        // 1. GỌI API PLAYLIST CHÍNH: Lấy thông tin cơ bản và list Song IDs
        const playlistRes = await fetch(
          `${BASE_API_URL}/playlists/${playlistId}`
        );
        if (!playlistRes.ok) {
          throw new Error(`Playlist ID ${playlistId} not found.`);
        }
        const rawPlaylist = await playlistRes.json();

        // API MOCK: Trích xuất đối tượng playlist từ wrapper (nếu có)
        const playlistData = rawPlaylist.data || rawPlaylist;

        if (!playlistData || !playlistData.songs) {
          setPlaylist(playlistData);
          setTracks([]);
          setLoading(false);
          return;
        }

        // 2. GỌI API CHO TỪNG BÀI HÁT: Fetch chi tiết từng bài
        const songPromises = playlistData.songs.map((songId) =>
          fetchSongDetails(songId)
        );
        const fullTracks = await Promise.all(songPromises);

        // 3. Cập nhật State
        setPlaylist(playlistData);
        setTracks(fullTracks);
      } catch (err) {
        console.error("Lỗi khi fetch Playlist:", err);
        setError(err.message || "An unknown error occurred.");
        setPlaylist(null);
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchFullPlaylistData();
    }
  }, [playlistId]);

  // Hiển thị trạng thái Loading hoặc Error
  if (loading) {
    return (
      <main className="p-8">
        <h1 className="text-4xl font-bold text-white">Đang tải Playlist...</h1>
      </main>
    );
  }

  if (error || !playlist) {
    return (
      <main className="p-8">
        <h1 className="text-4xl font-bold text-white">Playlist not found!</h1>
        {error && <p className="text-red-500 mt-4">Lỗi kết nối: {error}</p>}
      </main>
    );
  }

  // Lấy dữ liệu cần thiết từ state
  const owner = JSON.parse(localStorage.getItem("user"));
  const ownerName = owner.username || "Robin"; // Giả sử user (owner) được cung cấp

  const coverImage =
    playlist.coverImage ||
    playlist.image ||
    "bg-gradient-to-br from-indigo-500 to-purple-700";
  const tracksList = tracks || [];

  return (
    <main>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 p-8 bg-gradient-to-b from-purple-800 to-neutral-900">
        <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-lg shadow-2xl flex items-center justify-center bg-neutral-700">
          {/* Nếu có URL ảnh, sử dụng thẻ img, nếu không, dùng icon mặc định */}
          {typeof coverImage === "string" && coverImage.startsWith("http") ? (
            <img
              src={coverImage}
              alt={playlist.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Music size={96} className="text-white/60" />
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-white uppercase">Playlist</p>
          <h1 className="text-5xl lg:text-8xl font-black text-white leading-tight">
            {playlist.name}
          </h1>
          <p className="text-sm text-white mt-4">
            {ownerName} • {tracksList.length} songs
          </p>
        </div>
      </div>

      <div className="p-8 bg-neutral-900">
        <div className="flex items-center gap-6 mb-8">
          <button
            onClick={() =>
              tracksList[0] && onSongSelect(tracksList[0], tracksList, 0)
            }
            className="bg-green-500 w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            <FaPlay size={20} className="text-black ml-1" />
          </button>
        </div>

        {/* Danh sách bài hát */}
        {tracksList.length === 0 ? (
          <p className="text-neutral-400">
            This playlist is empty. Add some songs!
          </p>
        ) : (
          <div>
            <div className="grid grid-cols-[auto_2fr_1fr_auto] gap-4 text-neutral-400 border-b border-neutral-800 p-2 mb-2">
              <span className="text-lg mx-4">#</span>
              <span>Title</span>
              <span>Album</span>
              <FaRegClock />
            </div>
            {tracksList.map((track, index) => (
              <div
                key={track.id}
                className="grid grid-cols-[auto_2fr_1fr_auto] gap-4 items-center text-white hover:bg-white/10 p-2 rounded-md group cursor-pointer"
                onClick={() => onSongSelect(track, tracksList, index)}
              >
                <div className="text-neutral-400 w-8 text-center flex items-center justify-center">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <button className="hidden group-hover:block text-white">
                    <FaPlay size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{track.title}</p>
                    <p className="text-sm text-neutral-400">{track.artist}</p>
                  </div>
                </div>
                <p className="text-neutral-400 truncate">{track.album}</p>
                <p className="text-neutral-400">{track.duration}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
