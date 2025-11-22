import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { BadgeCheck, MoreHorizontal } from 'lucide-react';
import AlbumCard from '../../components/AlbumCard';

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function ArtistPage({ onSongSelect }) {
  const { artistId } = useParams();
  const navigate = useNavigate();
 
  // State quản lý dữ liệu và trạng thái loading
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kiểm tra artistId ngay khi component mount
  useEffect(() => {
    if (!artistId) {
      setError("Artist ID không hợp lệ!");
      setLoading(false);
      return;
    }
  }, [artistId]);

  useEffect(() => {
    const fetchArtistData = async () => {
      // Kiểm tra lại artistId trước khi fetch
      if (!artistId) {
        setError("Artist ID không hợp lệ!");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
     
      if (!BASE_API_URL) {
        setError("VITE_API_URL chưa được cấu hình trong file .env!");
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching artist data from: ${BASE_API_URL}/artists/${artistId}`);
        
        // 1. LỜI GỌI API CHÍNH: Lấy thông tin nghệ sĩ
        const artistRes = await fetch(`${BASE_API_URL}/artists/${artistId}`);
        
        // Kiểm tra content type trước khi parse JSON
        const contentType = artistRes.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const textResponse = await artistRes.text();
          console.error('Server trả về non-JSON response:', textResponse.substring(0, 200));
          throw new Error(`Server trả về định dạng không phải JSON. Có thể endpoint không tồn tại.`);
        }
        
        const artistData = await artistRes.json();
       
        if (!artistRes.ok) {
          throw new Error(artistData.message || `HTTP ${artistRes.status}: Không thể tìm thấy nghệ sĩ này.`);
        }
       
        // Cập nhật để phù hợp với cấu trúc API trả về
        if (artistData.success && artistData.data) {
          setArtist(artistData.data);
        } else {
          throw new Error('Dữ liệu nghệ sĩ không hợp lệ');
        }
       
        // 2. LỜI GỌI API ALBUM: Lấy danh sách Album theo artist
        try {
          const albumsRes = await fetch(`${BASE_API_URL}/artists/${artistId}/albums`);
          
          if (albumsRes.ok) {
            const albumsData = await albumsRes.json();
            // Cập nhật để phù hợp với cấu trúc API albums mới
            if (albumsData.success && albumsData.data) {
              setAlbums(albumsData.data);
            } else {
              setAlbums(albumsData || []);
            }
          } else {
            console.warn("Không thể tải Album, sử dụng mảng rỗng.");
            setAlbums([]);
          }
        } catch (albumError) {
          console.warn("Lỗi khi tải album:", albumError);
          setAlbums([]);
        }

        // 3. MOCK TOP SONGS (tạm thời - có thể thay bằng API thật sau)
        setTopSongs([
            { 
              id: 'm1', 
              title: 'Top Song 1 (MOCK)', 
              artist: artistData.data.name, 
              image: artistData.data.image, 
              url: '/mock-1.mp3', 
              duration: '3:00' 
            },
            { 
              id: 'm2', 
              title: 'Top Song 2 (MOCK)', 
              artist: artistData.data.name, 
              image: artistData.data.image, 
              url: '/mock-2.mp3', 
              duration: '4:00' 
            },
            { 
              id: 'm3', 
              title: 'Popular Track (MOCK)', 
              artist: artistData.data.name, 
              image: artistData.data.image, 
              url: '/mock-3.mp3', 
              duration: '3:30' 
            },
        ]);

      } catch (err) {
        console.error("API Fetch Error:", err);
        setError(err.message);
        setArtist(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [artistId]);

  // Sửa hàm xử lý click để tránh re-render
  const handlePlayClick = () => {
    if (topSongs.length > 0) {
      onSongSelect(topSongs[0], topSongs, 0);
    }
  };

  const handleSongClick = (track, index) => {
    onSongSelect(track, topSongs, index);
  };
 
  // Conditional Rendering cho trạng thái
  if (loading) {
    return (
        <main className="p-8">
            
        </main>
    );
  }

  if (error || !artist) {
    return (
        <main className="p-8">
            <h1 className="text-4xl font-bold text-white">Artist not found!</h1>
            {error && (
              <div className="text-red-500 mt-4">
                <p className="font-bold">Lỗi kết nối:</p>
                <p>{error}</p>
                <p className="mt-2 text-sm">Vui lòng kiểm tra:</p>
                <ul className="list-disc list-inside text-sm mt-1">
                  <li>Artist ID: {artistId || 'Không có'}</li>
                  <li>Endpoint API có đúng không</li>
                  <li>Server có đang chạy không</li>
                </ul>
                <button 
                  onClick={() => navigate(-1)}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Quay lại
                </button>
              </div>
            )}
        </main>
    );
  }

  // ✅ SỬ DỤNG DỮ LIỆU TỪ API
  return (
    <main className="bg-neutral-900 overflow-hidden pb-16">
      {/* PHẦN HEADER */}
      <div className="relative h-[400px] flex flex-col justify-end p-8">
        <img
          src={artist.image}
          alt={artist.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative">
            <div className="flex items-center gap-2 mb-2">
<div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1DA1F2]">
  <BadgeCheck className="text-white" size={16} />
</div>

                <span className="text-sm font-bold text-white">Verified Artist</span>
            </div>
            <h1 className="text-9xl font-black text-white">{artist.name}</h1>
            <p className="text-white mt-4 text-lg font-medium">
              Joined: {new Date(artist.joindate).toLocaleDateString()} • 
              {albums.length > 0 && ` ${albums.length} Album${albums.length > 1 ? 's' : ''}`}
            </p>
        </div>
      </div>

      {/* PHẦN NỘI DUNG */}
      <div className="p-8">
        <div className="flex items-center gap-6 mb-8">
          <button
            onClick={handlePlayClick}
            className="bg-green-500 w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            <FaPlay size={20} className="text-black ml-1" />
          </button>
          <button 
            className="border border-white/50 text-white font-bold px-6 py-2 rounded-md hover:border-white transition"
            onClick={(e) => e.preventDefault()} // Ngăn chặn hành vi mặc định
          >
            Following
          </button>
          <button 
            className="text-neutral-400 hover:text-white"
            onClick={(e) => e.preventDefault()} // Ngăn chặn hành vi mặc định
          >
            <MoreHorizontal size={28} />
          </button>
        </div>

        {/* Tiểu sử (Bio) */}
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">About</h2>
            <p className="text-neutral-300 leading-relaxed">
              Website: <a href={artist.website} target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-green-400 transition">{artist.website}</a>
            </p>
            <p className="text-neutral-300 leading-relaxed mt-2">
              Profile: <a href={artist.shorturl} target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-green-400 transition">{artist.shorturl}</a>
            </p>
        </div>

        {/* Discography - Album */}
        <h2 className="text-2xl font-bold text-white mb-4">Discography</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {albums.length > 0 ? albums.map(album => (
                <AlbumCard 
                  key={album.id}
                  id={album.id}
                  name={album.name}
                  artist_name={album.artist_name}
                  releasedate={album.releasedate}
                  image={album.image}
                  genre={album.genre}
                  shareurl={album.shareurl}
                />
            )) : (
              <div className="col-span-full text-center py-8">
                <p className="text-neutral-400 text-lg">Không có Album nào được tìm thấy.</p>
              </div>
            )}
        </div>

        {/* Thống kê */}
        {albums.length > 0 && (
          <div className="mt-8 p-6 bg-neutral-800 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Artist Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{albums.length}</p>
                <p className="text-neutral-400">Albums</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{topSongs.length}</p>
                <p className="text-neutral-400">Popular Tracks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {new Date().getFullYear() - new Date(artist.joindate).getFullYear()}
                </p>
                <p className="text-neutral-400">Years Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {artist.genre || 'Various'}
                </p>
                <p className="text-neutral-400">Genre</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}