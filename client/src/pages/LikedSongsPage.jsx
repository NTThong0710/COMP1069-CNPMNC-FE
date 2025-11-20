import React, { useState, useEffect } from "react";
import { Play, Shuffle, Download } from "lucide-react";
import { FaRegClock, FaPlay } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; 

const BASE_API_URL = import.meta.env.VITE_API_URL;

const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB");
};

export default function LikedSongs({ onSongSelect }) {
  const { user, likedSongsTrigger } = useAuth();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedSongs = async () => {
        setLoading(true);
        if (!user || (!user._id && !user.id)) {
            setLoading(false);
            return;
        }
        
        const userId = user._id || user.id;
        const token = localStorage.getItem("accessToken");

        try {
            const res = await fetch(`${BASE_API_URL}/users/${userId}/likes`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            
            if (res.ok) {
                const data = await res.json();
                const rawSongs = data.likeSongs || [];

                // === MAP DỮ LIỆU (FIX LỖI ARTIST IMAGE) ===
                const mappedSongs = rawSongs.map(song => {
                    const artistObj = typeof song.artist === 'object' ? song.artist : null;
                    
                    // 1. Lấy tên Artist
                    const artistName = artistObj ? artistObj.name : "Unknown Artist";
                    
                    // 2. ✅ QUAN TRỌNG: Ưu tiên lấy 'artist_id' (Jamendo ID)
                    // Backend đã populate: { name, artist_id, avatar }
                    // Nếu không có artist_id thì mới lấy _id
                    const artistId = artistObj ? (artistObj.artist_id || artistObj._id) : null;
                    
                    // Xử lý Album
                    let albumDisplay = "Single";
                    if (typeof song.album === 'object' && song.album?.title) {
                        albumDisplay = song.album.title;
                    } else if (song.genre && song.genre.length > 0) {
                        albumDisplay = song.genre[0].charAt(0).toUpperCase() + song.genre[0].slice(1);
                    }

                    return {
                        id: song._id,
                        title: song.title,
                        artist: artistName,
                        artistId: artistId,
                        
                        image: song.cover || "https://placehold.co/50x50/282828/white?text=Music",
                        date: formatDate(song.createdAt),
                        duration: formatDuration(song.duration),
                        album: albumDisplay,
                        url: song.url
                    };
                });

                setSongs(mappedSongs);
            }
        } catch (error) {
            console.error("Error fetching liked songs:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchLikedSongs();
  }, [user, likedSongsTrigger]);

  if (!user) return null;

  return (
    <div className="min-h-screen text-white pb-24">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#4c1d95] via-[#4c1d95] to-[#2e1065] p-8 flex items-end gap-6">
          <div className="w-52 h-52 bg-gradient-to-br from-indigo-500 via-purple-600 to-green-200 flex items-center justify-center rounded shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 text-white">
              <path d="M12 22s-8-5.33-10-10.34C.4 7.14 2.72 3 6.5 3 8.74 3 10.5 4.5 12 6c1.5-1.5 3.26-3 5.5-3 3.78 0 6.1 4.14 4.5 8.66C20 16.67 12 22 12 22z" />
            </svg>
          </div>

          <div className="flex-1">
            <p className="text-sm font-bold uppercase">Playlist</p>
            <h1 className="text-5xl md:text-8xl font-black mt-2 mb-6">Liked Songs</h1>
            <p className="text-sm text-gray-300">
              <span className="font-bold text-white">{user.username || user.name}</span> • {songs.length} songs
            </p>
          </div>
      </section>

      <section className="bg-gradient-to-b from-[#1c1433] via-[#121212] to-[#121212] p-8">
        {/* Controls */}
        <div className="flex items-center gap-6 mb-8">
          {songs.length > 0 && (
              <button
                onClick={() => onSongSelect(songs[0], songs, 0)}
                className="bg-green-500 hover:bg-green-400 text-black rounded-full p-4 hover:scale-105 transition shadow-lg"
              >
                <Play size={28} fill="black" />
              </button>
          )}
          <button className="text-gray-400 hover:text-white transition"><Shuffle size={28} /></button>
          <button className="text-gray-400 hover:text-white transition"><Download size={28} /></button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[40px_6fr_4fr_3fr_80px] px-4 py-2 border-b border-neutral-800 text-sm text-gray-400 uppercase tracking-wider mb-4">
          <div className="text-center">#</div>
          <div>Title</div>
          <div>Album / Genre</div>
          <div>Date added</div>
          <div className="flex justify-end"><FaRegClock /></div>
        </div>

        {/* Song list */}
        <div className="flex flex-col">
          {loading ? (
              <div className="text-center py-8 text-neutral-400">Loading...</div>
          ) : songs.length > 0 ? (
              songs.map((song, index) => (
                <div
                  key={song.id}
                  onClick={() => onSongSelect(song, songs, index)}
                  className="grid grid-cols-[40px_6fr_4fr_3fr_80px] items-center px-4 py-2 hover:bg-white/10 rounded-md group cursor-pointer transition-colors"
                >
                  <div className="text-neutral-400 text-center flex justify-center">
                     <span className="group-hover:hidden font-medium text-base">{index + 1}</span>
                     <FaPlay size={12} className="hidden group-hover:block text-white mt-1" />
                  </div>

                  <div className="flex items-center gap-4 overflow-hidden">
                    <img src={song.image} alt={song.title} className="w-10 h-10 rounded object-cover" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-medium text-white truncate pr-2">{song.title}</span>
                      <span className="text-sm text-neutral-400 truncate group-hover:text-white transition-colors">{song.artist}</span>
                    </div>
                  </div>

                  <div className="text-neutral-400 truncate pr-4">{song.album}</div>
                  <div className="text-neutral-400 text-sm truncate">{song.date}</div>
                  <div className="text-neutral-400 text-sm text-right">{song.duration}</div>
                </div>
              ))
          ) : (
              <div className="text-center py-12 text-neutral-400">
                  You haven't liked any songs yet. Go find some music! 🎶
              </div>
          )}
        </div>
      </section>
    </div>
  );
}