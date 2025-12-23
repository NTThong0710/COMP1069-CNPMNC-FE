import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { BadgeCheck, MoreHorizontal } from 'lucide-react';
import AlbumCard from '../../components/AlbumCard';
import { useOutletContext } from 'react-router-dom';

const BASE_API_URL = import.meta.env.VITE_API_URL;

// Helper format thời gian (nếu chưa có global helper)
const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    // Nếu API trả về ms thì chia 1000, nếu giây thì giữ nguyên. Jamendo tracks thường trả về giây.
    const val = seconds > 10000 ? seconds / 1000 : seconds; 
    const min = Math.floor(val / 60);
    const sec = Math.floor(val % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

export default function ArtistPage() {
  const { handleSelectSong: onSongSelect } = useOutletContext();
  const { artistId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      if (!artistId || !BASE_API_URL) return;

      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching data for artist: ${artistId}`);
        
        // --- 1. GỌI API LẤY THÔNG TIN ARTIST ---
        const artistRes = await fetch(`${BASE_API_URL}/artists/${artistId}`);
        const artistData = await artistRes.json();
        
        if (!artistRes.ok) throw new Error("Không tìm thấy nghệ sĩ");
        
        const artistInfo = artistData.data || artistData;

        // --- 2. GỌI API LẤY ALBUMS ---
        const albumsRes = await fetch(`${BASE_API_URL}/artists/${artistId}/albums`); // Hoặc /albums/artist/${artistId} tùy route bạn chốt
        const albumsData = await albumsRes.json();
        const albumsList = (albumsRes.ok && albumsData.success) ? (albumsData.results || []) : [];

        // --- 3. GỌI API LẤY TOP TRACKS (Mới thêm ở Backend) ---
        let tracksList = [];
        try {
            const tracksRes = await fetch(`${BASE_API_URL}/artists/${artistId}/top-tracks`);
            const tracksData = await tracksRes.json();
            if (tracksRes.ok && tracksData.success) {
                tracksList = tracksData.tracks.map(t => ({
                    ...t,
                    duration: formatDuration(t.duration) // Format lại giờ
                }));
            }
        } catch (e) { console.warn("Lỗi fetch top tracks", e); }

        // --- 4. XỬ LÝ ẢNH ĐẠI DIỆN THÔNG MINH ---
        // Ưu tiên: Ảnh Artist -> Ảnh Album đầu tiên -> Placeholder
        let bestImage = artistInfo.image;
        if (!bestImage || bestImage === "") {
            if (albumsList.length > 0 && albumsList[0].image) {
                bestImage = albumsList[0].image;
            } else {
                bestImage = "https://placehold.co/500x500/282828/white?text=Artist";
            }
        }

        // Set State
        setArtist({ ...artistInfo, image: bestImage });
        setAlbums(albumsList);
        setTopSongs(tracksList);

      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [artistId]);

  const handlePlayClick = () => {
    if (topSongs.length > 0 && onSongSelect) {
      onSongSelect(topSongs[0], topSongs, 0);
    }
  };

  const handleSongClick = (track, index) => {
    if(onSongSelect) onSongSelect(track, topSongs, index);
  };
 
  // --- RENDERING ---
  
  if (loading) return (
      <main className="p-8 h-screen bg-neutral-900 flex items-center justify-center">
           <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
  );

  if (error || !artist) return (
      <main className="p-8 h-screen bg-neutral-900 text-white">
          <h1 className="text-4xl font-bold">Artist not found!</h1>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-white text-black rounded">Quay lại</button>
      </main>
  );

  return (
    <main className="bg-neutral-900 overflow-hidden pb-16 min-h-screen animate-fade-in">
      {/* HEADER */}
      <div className="relative h-[400px] flex flex-col justify-end p-8">
        <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${artist.image})` }}
        >
             <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent" />
        </div>
        
        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1DA1F2] shadow-lg">
                  <BadgeCheck className="text-white" size={16} />
                </div>
                <span className="text-sm font-bold text-white drop-shadow-md">Verified Artist</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white shadow-lg drop-shadow-lg mb-4">{artist.name}</h1>
            <p className="text-white mt-4 text-lg font-medium drop-shadow-md">
              Joined: {artist.joindate ? new Date(artist.joindate).toLocaleDateString() : 'Unknown'} • 
              {albums.length} Albums
            </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-8 bg-gradient-to-b from-neutral-900/60 to-neutral-900">
        
        {/* Action Buttons */}
        <div className="flex items-center gap-6 mb-8">
          <button onClick={handlePlayClick} disabled={topSongs.length === 0} className="bg-green-500 w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg pl-1 disabled:opacity-50">
            <FaPlay size={20} className="text-black" />
          </button>
          <button className="border border-white/50 text-white font-bold px-6 py-2 rounded-full hover:border-white transition uppercase text-xs tracking-widest">
            Following
          </button>
          <button className="text-neutral-400 hover:text-white transition"><MoreHorizontal size={32} /></button>
        </div>

        {/* About */}
        <div className="mb-12 max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">About</h2>
            {artist.website && (
                <p className="text-neutral-300 mb-1"><span className="text-neutral-500 mr-2">Website:</span><a href={artist.website} target="_blank" rel="noreferrer" className="text-white hover:underline">{artist.website}</a></p>
            )}
        </div>

        {/* Popular Tracks (Real Data) */}
        {topSongs.length > 0 && (
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">Popular Tracks</h2>
                <div className="flex flex-col gap-1">
                    {topSongs.map((song, index) => (
                        <div key={song.id} onClick={() => handleSongClick(song, index)} className="flex items-center gap-4 p-3 rounded-md hover:bg-white/10 cursor-pointer group transition-colors">
                            <div className="w-6 text-center text-neutral-400">
                                <span className="group-hover:hidden">{index + 1}</span>
                                <FaPlay size={12} className="hidden group-hover:block text-white" />
                            </div>
                            <img src={song.image || artist.image} className="w-10 h-10 object-cover rounded shadow-sm" alt={song.title} />
                            <div className="flex-1">
                                <p className="text-white font-medium text-base hover:underline">{song.title}</p>
                                <p className="text-neutral-400 text-sm">{artist.name}</p>
                            </div>
                            <div className="text-neutral-400 text-sm font-variant-numeric tabular-nums">{song.duration}</div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Discography Section */}
<h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Discography</h2>

{/* GRID SYSTEM: Đã responsive từ mobile (2 cột) đến PC (5 cột) */}
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-12">
  {albums.length > 0 ? (
    albums.map((album) => {
      // Logic fallback ảnh (nếu album không có ảnh thì lấy ảnh artist hoặc ảnh mặc định)
      const albumCover =
        album.image ||
        artist.image ||
        "https://placehold.co/300x300/282828/white?text=Album";

      return (
        <AlbumCard
          key={album.id}
          id={album.id}
          title={album.name}
          artist={artist.name}
          image={albumCover}
          releasedate={album.releasedate}
        />
      );
    })
  ) : (
    <p className="text-neutral-400 col-span-full">Chưa có album nào.</p>
  )}
</div>

        {/* Stats */}
        {/* Thống kê */}
{albums.length > 0 && (
  <div className="p-8 bg-neutral-800/50 rounded-2xl border border-white/5 mt-8">
    <h3 className="text-xl font-bold text-white mb-6">Artist Stats</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {/* 1. ALBUMS */}
      <div className="text-center">
        <p className="text-3xl font-black text-white mb-1">{albums.length}</p>
        <p className="text-neutral-400 text-sm uppercase tracking-wider">Albums</p>
      </div>

      {/* 2. TRACKS */}
      <div className="text-center">
        <p className="text-3xl font-black text-white mb-1">{topSongs.length}</p>
        <p className="text-neutral-400 text-sm uppercase tracking-wider">Top Tracks</p>
      </div>

      {/* 3. YEARS ACTIVE */}
      <div className="text-center">
        <p className="text-3xl font-black text-white mb-1">
          {artist.joindate ? new Date().getFullYear() - new Date(artist.joindate).getFullYear() : 1}
        </p>
        <p className="text-neutral-400 text-sm uppercase tracking-wider">Years Active</p>
      </div>

{/* 4. FOLLOWERS (SỬA LẠI Ô CUỐI CÙNG) */}
<div className="text-center">
  <p className="text-3xl font-black text-white mb-1 truncate px-2 text-green-400">
    {/* Format số: 1,200 */}
    {artist.followers ? artist.followers.toLocaleString() : 0}
  </p>
  <p className="text-neutral-400 text-sm uppercase tracking-wider">Followers</p>
</div>
    </div>
  </div>
)}

      </div>
    </main>
  );
}