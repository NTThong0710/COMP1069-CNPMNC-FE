import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaRegClock, FaPlus, FaEllipsisH } from 'react-icons/fa';
import { ArrowLeft } from 'lucide-react';
import SongActionsMenu from '../components/SongActionMenu';

const BASE_API_URL = import.meta.env.VITE_API_URL;

// Hàm format giây -> mm:ss
const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

export default function AlbumPage({ onSongSelect }) {
  const { albumId } = useParams();
  const navigate = useNavigate();
  
  // State dữ liệu
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  // Close menu khi click ra ngoài
  useEffect(() => {
    const closeMenu = () => setOpenMenuIndex(null);
    if (openMenuIndex !== null) {
      window.addEventListener('click', closeMenu);
    }
    return () => {
      window.removeEventListener('click', closeMenu);
    };
  }, [openMenuIndex]);

  // === FETCH DATA ===
  useEffect(() => {
    const fetchAlbumData = async () => {
        setLoading(true);
        setError(null);

        if (!BASE_API_URL) {
            setError("VITE_API_URL chưa cấu hình!");
            setLoading(false);
            return;
        }

        try {
            console.log(`Fetching album: ${BASE_API_URL}/albums/${albumId}`);
            const res = await fetch(`${BASE_API_URL}/albums/${albumId}`);
            
            if (!res.ok) {
                throw new Error(`Lỗi ${res.status}: Không tìm thấy Album.`);
            }

            const json = await res.json();
            // Backend: { success: true, data: { ... } }
            const data = json.data || json;

            if (!data) throw new Error("Dữ liệu Album trống.");

            // Map dữ liệu Album
            setAlbum({
                id: data.id,
                title: data.title || data.name, // Backend trả 'title' hoặc 'name'
                artist: data.artist_name || "Unknown Artist",
                image: data.cover || data.image || "https://placehold.co/300x300/282828/white?text=Album",
                releaseDate: data.release_date ? new Date(data.release_date).getFullYear() : '2025',
                totalTracks: data.track_count || (data.tracks ? data.tracks.length : 0),
            });

            // Map dữ liệu Tracks
            const rawTracks = data.tracks || [];
            const mappedTracks = rawTracks.map(t => ({
                id: t.id,
                title: t.name || t.title,
                artist: data.artist_name || "Unknown Artist", // Album track thường cùng artist
                album: data.title || data.name,
                image: data.cover || data.image, // Track dùng ảnh bìa album
                duration: formatDuration(t.duration),
                url: t.audio || t.url // Link nhạc
            }));
            
            setTracks(mappedTracks);

        } catch (err) {
            console.error("Fetch Album Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (albumId) {
        fetchAlbumData();
    }
  }, [albumId]);


  // === HANDLERS ===
  const handleMenuToggle = (e, index) => {
    e.stopPropagation();
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handlePlayAlbum = () => {
      if (tracks.length > 0) {
          onSongSelect(tracks[0], tracks, 0);
      }
  };

  // === RENDER ===
  if (loading) return <div className="p-8 text-white animate-pulse">Đang tải Album...</div>;

  if (error || !album) {
    return (
      <div className="p-8 text-white flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-4xl font-bold mb-4">💿 Album không tồn tại</h1>
        <p className="text-neutral-400 mb-6">{error}</p>
        <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-full hover:scale-105 transition"
        >
            <ArrowLeft size={20} /> Quay lại
        </button>
      </div>
    );
  }

  return (
    <main className="p-8 pb-24 bg-gradient-to-b from-neutral-800 to-neutral-900 min-h-screen">
      {/* Album Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8">
        <img 
            src={album.image} 
            alt={album.title} 
            className="w-40 h-40 sm:w-56 sm:h-56 rounded-lg shadow-2xl object-cover" 
        />
        <div className="text-center sm:text-left">
          <p className="text-sm font-bold text-white uppercase">Album</p>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white leading-tight mb-4 mt-2">
            {album.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-white font-medium justify-center sm:justify-start">
             {/* Avatar nhỏ xíu nếu có, tạm thời dùng icon hoặc tên thôi */}
             <span>{album.artist}</span>
             <span>•</span>
             <span>{album.releaseDate}</span>
             <span>•</span>
             <span>{album.totalTracks} songs</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-8">
        <button
          onClick={handlePlayAlbum}
          className="bg-green-500 w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
        >
          <FaPlay size={22} className="text-black ml-1" />
        </button>
        <button className="text-neutral-400 hover:text-white p-2">
            <FaPlus size={24} />
        </button>
        <button className="text-neutral-400 hover:text-white p-2">
            <FaEllipsisH size={24} />
        </button>
      </div>

      {/* Track List */}
      <div>
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 text-neutral-400 border-b border-neutral-700 p-2 mb-2 text-sm uppercase">
          <span className="text-center w-8">#</span>
          <span>Title</span>
          <FaRegClock className="justify-self-end mr-4"/>
        </div>
        
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="grid grid-cols-[auto_1fr_auto] gap-4 items-center text-white hover:bg-white/10 p-2 rounded-md group cursor-pointer relative transition-colors"
            onClick={() => onSongSelect(track, tracks, index)}
          >
            {/* Cột 1: Số thứ tự / Play Icon */}
            <div className="text-neutral-400 w-8 text-center flex justify-center">
              <span className="group-hover:hidden font-medium">{index + 1}</span>
              <FaPlay size={12} className="hidden group-hover:block text-white mt-1" />
            </div>

            {/* Cột 2: Tên bài hát và nghệ sĩ */}
            <div>
              <p className={`font-medium text-base ${false ? 'text-green-500' : 'text-white'}`}>
                  {track.title}
              </p>
              <p className="text-sm text-neutral-400 group-hover:text-white transition-colors">
                  {track.artist}
              </p>
            </div>

            {/* Cột 3: Thời lượng & Menu */}
            <div className="flex items-center gap-4 text-neutral-400 justify-end min-w-[100px]">
              <button className="hidden group-hover:block text-white hover:text-green-500 mr-2">
                <FaPlus size={16} />
              </button>

              <span className="text-sm font-variant-numeric tabular-nums">
                  {track.duration}
              </span>

              <div className="relative w-8 flex justify-end">
                <button
                  onClick={(e) => handleMenuToggle(e, index)}
                  className="invisible group-hover:visible text-white p-1 hover:scale-110 transition"
                >
                  <FaEllipsisH size={16} />
                </button>
                
                {/* Menu dropdown */}
                <div className="absolute top-8 right-0 z-20">
                    <SongActionsMenu
                        isOpen={openMenuIndex === index}
                        onClose={() => setOpenMenuIndex(null)}
                    />
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {tracks.length === 0 && (
             <div className="py-10 text-center text-neutral-400">
                 Album này chưa có bài hát nào.
             </div>
        )}
      </div>
    </main>
  );
}