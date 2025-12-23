import React, { useState, useEffect } from "react";
import { X, MessageSquare, Heart, Send, Trash2, CornerDownRight, Disc } from "lucide-react";
import { Link } from "react-router-dom";
import CommentSection from "./CommentSection";

const BASE_API_URL = import.meta.env.VITE_API_URL;

// Helper lấy tên Artist an toàn
const getArtistName = (artist) => {
    if (!artist) return "Unknown Artist";
    if (typeof artist === 'string') return artist;
    return artist.name || "Unknown Artist";
};

// === 1. COMPONENT BÀI HÁT TƯƠNG TỰ ===
export const SimilarSongsSection = ({ songId, onSongSelect }) => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSimilar = async () => {
            if (!songId) return;
            setLoading(true);
            try {
                const res = await fetch(`${BASE_API_URL}/songs/${songId}/recommendations?limit=5`);
                if (res.ok) {
                    const data = await res.json();
                    setSongs(data.recommendations || []);
                }
            } catch (error) { } finally { setLoading(false); }
        };
        fetchSimilar();
    }, [songId]);

    const handlePlayRecommended = (song, index) => {
        // Map dữ liệu đầy đủ (bao gồm cả ảnh Artist từ backend)
        const mappedSong = {
            id: song._id,
            title: song.title,
            artist: getArtistName(song.artist),
            
            // ID
            artistId: song.artist?.artist_id || song.artist?._id,
            
            // ✅ FIX QUAN TRỌNG: Lấy ảnh Artist từ object artist populate
            artistImage: song.artist?.avatar || song.artist?.image,

            image: song.cover || song.album?.cover || "https://placehold.co/150",
            url: song.url,
            duration: "0:00"
        };

        const mappedPlaylist = songs.map(s => ({
            id: s._id,
            title: s.title,
            artist: getArtistName(s.artist),
            artistImage: s.artist?.avatar || s.artist?.image, // Map cho cả list
            image: s.cover || s.album?.cover,
            url: s.url
        }));

        if (onSongSelect) onSongSelect(mappedSong, mappedPlaylist, index);
    };

    if (loading || songs.length === 0) return null;

    return (
        <div className="mt-6 bg-black/20 rounded-lg p-4 mb-10">
            <div className="flex items-center gap-2 mb-3 text-white font-bold border-b border-neutral-700 pb-2">
                <Disc size={18} /> <span>Recommended for you</span>
            </div>
            <div className="space-y-2">
                {songs.map((song, index) => (
                    <div key={song._id} onClick={() => handlePlayRecommended(song, index)} className="flex items-center gap-3 group cursor-pointer hover:bg-white/10 p-2 rounded transition">
                        <img src={song.cover || song.album?.cover || "https://placehold.co/40"} alt={song.title} className="w-10 h-10 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate group-hover:text-green-500 transition">{song.title}</p>
                            <p className="text-xs text-neutral-400 truncate">{getArtistName(song.artist)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// === 2. COMPONENT THÔNG TIN NGHỆ SĨ ===
export const ArtistInfoSection = ({ song }) => {
    const [artistInfo, setArtistInfo] = useState(null);

    useEffect(() => {
        const fetchArtistInfo = async () => {
            setArtistInfo(null);
            const aId = song?.artistId || (typeof song?.artist === 'object' ? (song.artist.artist_id || song.artist._id) : null);
            
            if (!aId) return;
            
            try {
                const res = await fetch(`${BASE_API_URL}/artists/${aId}`);
                if (res.ok) {
                    const json = await res.json();
                    setArtistInfo(json.data || json);
                }
            } catch (error) {}
        };
        fetchArtistInfo();
    }, [song]);

    if (!song) return null;

    const displayArtistName = artistInfo?.name || getArtistName(song.artist);

    // Thứ tự ưu tiên: Info mới fetch > Info có sẵn trong song > Ảnh bài hát
    const displayArtistImage = artistInfo?.image || artistInfo?.avatar || 
                              song.artistImage || // Lấy từ lúc click bài hát
                              (typeof song.artist === 'object' ? (song.artist.avatar || song.artist.image) : null) || 
                              song.image || song.cover;

    const displayBio = artistInfo?.bio || "Chưa có giới thiệu về nghệ sĩ này.";
    const fakeFollowers = new Intl.NumberFormat('en-US').format(Math.floor(Math.random() * 5000000) + 100000);

    return (
        <div className="bg-neutral-800 rounded-lg overflow-hidden relative group cursor-pointer mb-4 mt-6">
            <div className="p-4 pb-0 z-10 relative"><p className="font-bold text-base mb-2">About the artist</p></div>
            <div className="h-64 lg:h-40 w-full bg-neutral-700 relative">
                <img 
                    src={displayArtistImage || "https://placehold.co/300"} 
                    alt={displayArtistName} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 font-bold text-lg shadow-black drop-shadow-md">{displayArtistName}</div>
            </div>
            <div className="p-4 text-neutral-400 text-sm">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-bold">{fakeFollowers} followers</span>
                    <span className="text-xs border border-neutral-500 px-2 py-1 rounded hover:border-white hover:text-white transition">Follow</span>
                </div>
                <p className="line-clamp-3 text-neutral-300">{displayBio}</p>
            </div>
        </div>
    );
}

// === 3. COMPONENT NEXT IN QUEUE ===
export const QueueSection = () => (
    <div className="bg-neutral-800 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-neutral-700 transition mb-4">
        <div><p className="text-sm font-bold">Next in queue</p><p className="text-xs text-neutral-400">Open queue</p></div>
        <div className="text-neutral-400">🎵</div>
    </div>
);

// === COMPONENT CHÍNH RIGHT SIDEBAR ===
export default function RightSidebar({ song, onClose, onSongSelect }) {
  if (!song) return null;

  const displayArtistName = getArtistName(song.artist);
  
  // Link Artist
  const artistLink = (song.artistId || (typeof song.artist === 'object' ? (song.artist.artist_id || song.artist._id) : null)) 
                     ? `/artist/${song.artistId || (typeof song.artist === 'object' ? (song.artist.artist_id || song.artist._id) : '')}` 
                     : '#';

  return (
    <aside className="h-full bg-neutral-900 rounded-lg flex flex-col overflow-hidden text-white ml-2 pb-10">
      <div className="flex items-center justify-between p-4 flex-shrink-0 bg-neutral-900 z-10">
        <span className="font-bold text-base hover:underline cursor-pointer truncate pr-2">
          {song.title || "Now Playing"}
        </span>
        <button onClick={onClose} aria-label="Close sidebar" className="text-neutral-400 hover:text-white hover:bg-neutral-800 p-1 rounded-full transition">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pt-0 scrollbar-hide">
        <div className="w-full aspect-square rounded-lg overflow-hidden mb-4 shadow-xl">
          <img src={song.image || song.cover} alt={song.title} className="w-full h-full object-cover" />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold leading-tight mb-1 hover:underline cursor-pointer">{song.title}</h2>
          <Link to={artistLink} className="text-base text-neutral-400 hover:text-white hover:underline font-medium">
            {displayArtistName}
          </Link>
        </div>

        <ArtistInfoSection song={song} />
        <QueueSection />
        <SimilarSongsSection songId={song.id || song._id} onSongSelect={onSongSelect} />
        <CommentSection songId={song.id || song._id} />

      </div>
    </aside>
  );
}