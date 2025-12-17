import React, { useState, useEffect } from "react";
import { Play, Shuffle, Download } from "lucide-react";
import { FaRegClock, FaPlay } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import SongTooltip from "../../components/SongTooltip"; 
import { useOutletContext } from 'react-router-dom';

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

export default function LikedSongs() {
  const { handleSelectSong: onSongSelect } = useOutletContext();
  const { user, likedSongsTrigger } = useAuth();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    song: null,
  });

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

                const mappedSongs = rawSongs.map(song => {
                    const artistObj = typeof song.artist === 'object' ? song.artist : null;
                    const artistName = artistObj ? artistObj.name : "Unknown Artist";
                    const artistId = artistObj ? (artistObj.artist_id || artistObj._id) : null;
                    
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

  const handleContextMenu = (e, song) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      song: song,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen text-white animate-fade-in pb-24" onClick={closeContextMenu}>
      {/* Header: Responsive Layout */}
      <section className="bg-gradient-to-b from-[#4c1d95] via-[#4c1d95] to-[#2e1065] p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
          <div className="w-40 h-40 md:w-52 md:h-52 bg-gradient-to-br from-indigo-500 via-purple-600 to-green-200 flex items-center justify-center rounded shadow-lg flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 md:w-24 md:h-24 text-white">
              <path d="M12 22s-8-5.33-10-10.34C.4 7.14 2.72 3 6.5 3 8.74 3 10.5 4.5 12 6c1.5-1.5 3.26-3 5.5-3 3.78 0 6.1 4.14 4.5 8.66C20 16.67 12 22 12 22z" />
            </svg>
          </div>

          <div className="flex-1 w-full">
            <p className="text-xs md:text-sm font-bold uppercase">Playlist</p>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mt-2 mb-4 md:mb-6 leading-none">Liked Songs</h1>
            <p className="text-sm text-gray-300">
              <span className="font-bold text-white">{user.username || user.name}</span> • {songs.length} songs
            </p>
          </div>
      </section>

      <section className="bg-gradient-to-b from-[#1c1433] via-[#121212] to-[#121212] p-4 md:p-8">
        {/* Controls */}
        <div className="flex items-center justify-center md:justify-start gap-6 mb-8">
          {songs.length > 0 && (
              <button
                onClick={() => onSongSelect(songs[0], songs, 0)}
                className="bg-green-500 hover:bg-green-400 text-black rounded-full p-3 md:p-4 hover:scale-105 transition shadow-lg"
              >
                <Play size={24} className="md:w-7 md:h-7" fill="black" />
              </button>
          )}
          <button className="text-gray-400 hover:text-white transition"><Shuffle size={24} className="md:w-7 md:h-7" /></button>
          <button className="text-gray-400 hover:text-white transition"><Download size={24} className="md:w-7 md:h-7" /></button>
        </div>

        {/* Table Header: Responsive Columns */}
        <div className="grid grid-cols-[30px_1fr_auto] md:grid-cols-[40px_6fr_4fr_3fr_80px] px-4 py-2 border-b border-neutral-800 text-sm text-gray-400 uppercase tracking-wider mb-4">
          <div className="text-center">#</div>
          <div>Title</div>
          <div className="hidden md:block">Album / Genre</div>
          <div className="hidden md:block">Date added</div>
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
                  onContextMenu={(e) => handleContextMenu(e, song)}
                  className="grid grid-cols-[30px_1fr_auto] md:grid-cols-[40px_6fr_4fr_3fr_80px] items-center px-2 md:px-4 py-2 hover:bg-white/10 rounded-md group cursor-pointer transition-colors"
                >
                  <div className="text-neutral-400 text-center flex justify-center w-8 md:w-10">
                      <span className="group-hover:hidden font-medium text-sm md:text-base">{index + 1}</span>
                      <FaPlay size={10} className="hidden group-hover:block text-white mt-1" />
                  </div>

                  <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <img src={song.image} alt={song.title} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                    <div className="flex flex-col overflow-hidden min-w-0">
                      <span className="font-medium text-white truncate pr-2 text-sm md:text-base">{song.title}</span>
                      <span className="text-xs md:text-sm text-neutral-400 truncate group-hover:text-white transition-colors">{song.artist}</span>
                    </div>
                  </div>

                  <div className="hidden md:block text-neutral-400 truncate pr-4 text-sm">{song.album}</div>
                  <div className="hidden md:block text-neutral-400 text-sm truncate">{song.date}</div>
                  <div className="text-neutral-400 text-xs md:text-sm text-right font-variant-numeric tabular-nums">{song.duration}</div>
                </div>
              ))
          ) : (
              <div className="text-center py-12 text-neutral-400">
                  You haven't liked any songs yet. Go find some music! 🎶
              </div>
          )}
        </div>
      </section>

      {contextMenu.visible && contextMenu.song && (
        <SongTooltip
          song={contextMenu.song}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={closeContextMenu}
          onPlaySong={() => onSongSelect(contextMenu.song, songs, songs.findIndex(t => t.id === contextMenu.song.id))}
        />
      )}
    </div>
  );
}