import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { FaPlay, FaRegClock, FaCalendarAlt } from "react-icons/fa";
import { Disc } from "lucide-react";
// Import SongTooltip (đã có sẵn modal AddToPlaylist bên trong nó)
import SongTooltip from "../../components/SongTooltip"; 
import { useOutletContext } from 'react-router-dom';

const BASE_API_URL = import.meta.env.VITE_API_URL;

// Helper format thời gian
const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};

export default function AlbumPage() {
  const { handleSelectSong: onSongSelect } = useOutletContext();
  const { id } = useParams();
  
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- STATE CHO CONTEXT MENU (TOOLTIP) ---
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    song: null,
  });

  useEffect(() => {
    const fetchAlbumDetail = async () => {
      setLoading(true);
      setError(null);

      if (!BASE_API_URL) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${BASE_API_URL}/albums/${id}`);
        if (!res.ok) {
           const errData = await res.json().catch(() => ({}));
           throw new Error(errData.error || "Không thể tải Album");
        }

        const data = await res.json();
        
        if (data.success) {
            setAlbum(data.album);
            const formattedTracks = (data.tracks || []).map(track => ({
                id: track.id,
                title: track.name,
                artist: data.album.artist_name || "Unknown Artist", 
                artistId: data.album.artist_id,
                image: track.image || data.album.image || "", 
                album: data.album.name,
                duration: formatDuration(track.duration),
                url: track.audio, 
            }));
            setTracks(formattedTracks);
        }
      } catch (err) {
        console.error("Lỗi fetch Album:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAlbumDetail();
  }, [id]);

  // --- XỬ LÝ CHUỘT PHẢI (CONTEXT MENU) ---
  const handleContextMenu = (e, song) => {
    e.preventDefault(); // Ngăn menu mặc định của trình duyệt
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

  // --- RENDERING ---
  if (loading) return (
      <main className="p-8 bg-neutral-900 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white animate-pulse">Đang tải Album...</p>
        </div>
      </main>
  );

  if (error || !album) return (
      <main className="p-8 bg-neutral-900 min-h-screen flex items-center justify-center text-center">
        <div>
            <h1 className="text-2xl font-bold text-red-500 mb-2">Lỗi tải Album</h1>
            <p className="text-neutral-400">{error || "Album không tồn tại"}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-white text-black rounded-full font-bold">Thử lại</button>
        </div>
      </main>
  );

  return (
    <main className="min-h-screen bg-neutral-900 pb-24" onClick={closeContextMenu}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 p-8 bg-gradient-to-b from-blue-900 to-neutral-900 shadow-xl">
        <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-lg shadow-2xl flex items-center justify-center bg-neutral-800 overflow-hidden shrink-0 group">
          {album.image ? (
            <img src={album.image} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <Disc size={80} className="text-neutral-600" />
          )}
        </div>
        <div className="text-center sm:text-left flex-1 min-w-0">
          <p className="text-xs font-bold text-white uppercase mb-2">Album</p>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-tight mb-4 truncate">{album.name}</h1>
          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-white font-medium">
             <span className="font-bold hover:underline cursor-pointer">{album.artist_name}</span>
             <span className="hidden sm:inline text-neutral-500">•</span>
             <span className="text-neutral-400 flex items-center gap-1">
                {album.releasedate && <><FaCalendarAlt size={12}/> {album.releasedate.split('-')[0]}</>}
             </span>
             <span className="hidden sm:inline text-neutral-500">•</span>
             <span>{tracks.length} bài hát</span>
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <div className="p-6 md:p-8 bg-black/20 min-h-[50vh]">
        <div className="flex items-center gap-6 mb-8">
          <button
            onClick={() => tracks[0] && onSongSelect(tracks[0], tracks, 0)}
            disabled={tracks.length === 0}
            className="bg-green-500 w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-green-500/20 text-black pl-1"
          >
            <FaPlay size={24} />
          </button>
        </div>

        {tracks.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">Album này chưa có danh sách bài hát.</div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-[16px_4fr_minmax(50px,auto)] md:grid-cols-[16px_4fr_3fr_minmax(50px,auto)] gap-4 px-4 py-2 border-b border-white/10 text-neutral-400 text-sm uppercase font-medium sticky top-0 bg-neutral-900/95 z-10">
              <span className="text-center">#</span>
              <span>Tiêu đề</span>
              <span className="hidden md:block">Nghệ sĩ</span> 
              <span className="flex justify-end"><FaRegClock /></span>
            </div>

            <div className="mt-2 flex flex-col gap-1">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => onSongSelect(track, tracks, index)}
                  // --- KÍCH HOẠT CONTEXT MENU KHI CLICK CHUỘT PHẢI ---
                  onContextMenu={(e) => handleContextMenu(e, track)}
                  className="group grid grid-cols-[16px_4fr_minmax(50px,auto)] md:grid-cols-[16px_4fr_3fr_minmax(50px,auto)] gap-4 px-4 py-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors items-center"
                >
                  <div className="flex items-center justify-center text-neutral-400 w-4">
                    <span className="group-hover:hidden text-sm font-medium">{index + 1}</span>
                    <FaPlay size={12} className="hidden group-hover:block text-white" />
                  </div>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-medium truncate text-base">{track.title}</span>
                      <span className="text-sm text-neutral-400 md:hidden">{track.artist}</span>
                    </div>
                  </div>
                  <div className="hidden md:flex text-sm text-neutral-400 truncate items-center">{track.artist}</div>
                  <div className="flex justify-end text-sm text-neutral-400 font-variant-numeric tabular-nums">{track.duration}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- HIỂN THỊ SONG TOOLTIP KHI CLICK CHUỘT PHẢI --- */}
      {contextMenu.visible && contextMenu.song && (
        <SongTooltip
          song={contextMenu.song}
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={closeContextMenu}
          onPlaySong={() => onSongSelect(contextMenu.song, tracks, tracks.findIndex(t => t.id === contextMenu.song.id))}
        />
      )}
    </main>
  );
}