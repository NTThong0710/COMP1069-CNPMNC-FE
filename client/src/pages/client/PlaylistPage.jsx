import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaPlay, FaRegClock } from "react-icons/fa";
import { Music } from "lucide-react";

const BASE_API_URL = import.meta.env.VITE_API_URL;

// Hàm tiện ích để đổi mili-giây sang phút:giây (vì Backend lưu ms)
const formatDuration = (ms) => {
  if (!ms) return "0:00";
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
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
        const token = localStorage.getItem("accessToken");

        // 1. GỌI API LẤY PLAYLIST
        // Backend đã .populate('songs') nên API này trả về luôn danh sách bài hát chi tiết
        const res = await fetch(`${BASE_API_URL}/playlists/${playlistId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token nếu playlist private
          },
        });

        if (!res.ok) {
          throw new Error(`Không tìm thấy Playlist (ID: ${playlistId})`);
        }

        // 2. Xử lý dữ liệu trả về
        const data = await res.json();

        // Tùy vào BE trả về { data: ... } hay trực tiếp object
        // Dựa vào code BE cũ của bạn thì nó có thể nằm trong data.data hoặc trực tiếp
        const playlistData = data.data || data;

        setPlaylist(playlistData);

        // 3. Map dữ liệu songs từ Backend sang format Frontend cần
        if (playlistData.songs && Array.isArray(playlistData.songs)) {
          const formattedTracks = playlistData.songs.map((song) => ({
            id: song._id, // Mongo ID
            title: song.title,
            // Kiểm tra nếu artist là object (đã populate) hay string ID
            artist:
              typeof song.artist === "object"
                ? song.artist.name
                : "Unknown Artist",
            album: song.album ? song.album.name : "Single", // Nếu có album
            image: song.cover || "https://via.placeholder.com/50",
            duration: formatDuration(song.duration), // Convert ms -> mm:ss
            url: song.url, // Link nhạc để play
          }));

          setTracks(formattedTracks);
        } else {
          setTracks([]);
        }
      } catch (err) {
        console.error("Lỗi khi fetch Playlist:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchFullPlaylistData();
    }
  }, [playlistId]);

  // --- PHẦN GIAO DIỆN (GIỮ NGUYÊN) ---

  if (loading) {
    return (
      <main className="p-8 bg-neutral-900 min-h-screen">
        <h1 className="text-4xl font-bold text-white animate-pulse">
          Đang tải Playlist...
        </h1>
      </main>
    );
  }

  if (error || !playlist) {
    return (
      <main className="p-8 bg-neutral-900 min-h-screen">
        <h1 className="text-4xl font-bold text-white">Lỗi tải Playlist</h1>
        <p className="text-red-500 mt-4">{error}</p>
      </main>
    );
  }

  // Lấy thông tin user (Owner)
  // Nếu playlist có trường user đã populate thì lấy playlist.user.name, không thì lấy user hiện tại
  const ownerName =
    typeof playlist.user === "object" ? playlist.user.username : "User";

  const coverImage =
    playlist.cover || // Backend của bạn có thể dùng key là 'cover' thay vì 'coverImage'
    playlist.image ||
    "bg-gradient-to-br from-indigo-500 to-purple-700";

  return (
    <main className="min-h-screen bg-neutral-900 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 p-8 bg-gradient-to-b from-purple-800 to-neutral-900">
        <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-lg shadow-2xl flex items-center justify-center bg-neutral-700 overflow-hidden">
          {typeof coverImage === "string" && coverImage.startsWith("http") ? (
            <img
              src={coverImage}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center ${coverImage}`}
            >
              <Music size={96} className="text-white/60" />
            </div>
          )}
        </div>
        <div className="text-center sm:text-left">
          <p className="text-sm font-bold text-white uppercase">Playlist</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mt-2 mb-4">
            {playlist.name}
          </h1>
          <p className="text-sm text-gray-300">
            {playlist.description || "Không có mô tả"}
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-sm text-white font-medium">
            <span>{ownerName}</span>
            <span>•</span>
            <span>{tracks.length} bài hát</span>
          </div>
        </div>
      </div>

      <div className="p-8 bg-neutral-900/50 backdrop-blur-3xl">
        {/* Nút Play to */}
        <div className="flex items-center gap-6 mb-8">
          <button
            onClick={() => tracks[0] && onSongSelect(tracks[0], tracks, 0)}
            disabled={tracks.length === 0}
            className="bg-green-500 w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
          >
            <FaPlay size={20} className="text-black ml-1" />
          </button>
        </div>

        {/* Danh sách bài hát */}
        {tracks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-neutral-400 text-lg">
              Playlist này chưa có bài hát nào.
            </p>
            <p className="text-neutral-500 text-sm mt-2">
              Hãy tìm nhạc và thêm vào nhé!
            </p>
          </div>
        ) : (
          <div>
            {/* Table Header */}
            <div className="grid grid-cols-[auto_4fr_3fr_auto] gap-4 text-neutral-400 border-b border-neutral-800 p-3 mb-2 uppercase text-xs font-semibold tracking-wider">
              <span className="text-center w-8">#</span>
              <span>Tiêu đề</span>
              <span className="hidden md:block">Album</span>
              <span className="flex justify-end pr-4">
                <FaRegClock />
              </span>
            </div>

            {/* List Songs */}
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className="grid grid-cols-[auto_4fr_3fr_auto] gap-4 items-center text-white hover:bg-white/10 p-2 rounded-md group cursor-pointer transition-colors"
                onClick={() => onSongSelect(track, tracks, index)}
              >
                {/* Index / Play Icon */}
                <div className="text-neutral-400 w-8 text-center flex items-center justify-center">
                  <span className="group-hover:hidden text-sm">
                    {index + 1}
                  </span>
                  <button className="hidden group-hover:block text-white animate-fade-in">
                    <FaPlay size={12} />
                  </button>
                </div>

                {/* Title & Artist */}
                <div className="flex items-center gap-4 overflow-hidden">
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-10 h-10 object-cover rounded shadow-sm flex-shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <p className="font-medium text-white truncate">
                      {track.title}
                    </p>
                    <p className="text-sm text-neutral-400 truncate hover:underline hover:text-white transition-colors">
                      {track.artist}
                    </p>
                  </div>
                </div>

                {/* Album */}
                <div className="hidden md:flex items-center min-w-0">
                  <p className="text-sm text-neutral-400 truncate">
                    {track.album}
                  </p>
                </div>

                {/* Duration */}
                <div className="flex justify-end pr-4 text-sm text-neutral-400 font-variant-numeric tabular-nums">
                  {track.duration}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
