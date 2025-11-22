import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMusic, FaPodcast } from 'react-icons/fa';
import { BsMusicNoteList } from 'react-icons/bs';

import ArtistCard from '../../components/ArtistCard';
import SongCard from '../../components/SongCard';
import AlbumCard from '../../components/AlbumCard';
import LoginPromptModal from '../../components/LoginPromptModal';
import ScrollableSection from '../../components/ScrollableSection';
import { useAuth } from '../../context/AuthContext';

const BASE_API_URL = import.meta.env.VITE_API_URL;

// --- Component Landing Page (Responsive Updated) ---
const LandingPage = () => {
  return (
    <div className="text-white min-h-full">
      {/* Hero Section: Tinh chỉnh text size cho mượt hơn ở các màn hình */}
      <section className="flex flex-col items-center justify-center text-center py-12 px-4 md:py-16 lg:py-20 bg-gradient-to-r from-purple-800 to-blue-500 min-h-[60vh] md:h-[80vh]">
        {/* md:text-6xl thay vì 7xl để đỡ bị tràn trên tablet */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight">Listening is everything</h1>
        <p className="text-base md:text-lg lg:text-xl mb-8 max-w-lg mx-auto">Millions of songs and podcasts. No credit card needed.</p>
        <Link to="/register">
          <button className="bg-green-500 text-black font-bold text-sm md:text-base lg:text-lg px-6 py-3 md:px-8 rounded-full hover:scale-105 transition-transform">
            CREATE ACCOUNT FREE
          </button>
        </Link>
      </section>
      
      {/* Feature Section */}
      <section className="py-12 px-4 md:px-8 mb-2">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">Why Our Website?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 lg:gap-12 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center">
                <FaMusic className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mb-4 text-green-500" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2">Play your favorites.</h3>
            <p className="text-sm md:text-base text-neutral-400">Listen to the songs you love, and discover new music and podcasts.</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
                <BsMusicNoteList className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mb-4 text-green-500" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2">Playlists made easy.</h3>
            <p className="text-sm md:text-base text-neutral-400">We'll help you make playlists. Or enjoy playlists made by music experts.</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
                <FaPodcast className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mb-4 text-green-500" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2">Make it yours.</h3>
            <p className="text-sm md:text-base text-neutral-400">Tell us what you like, and we'll recommend music for you.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

export default function HomePage({ onSongSelect }) {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardImage, setSelectedCardImage] = useState('');
  
  const [recommendedSongs, setRecommendedSongs] = useState([]); 
  const [mostPlayedSongs, setMostPlayedSongs] = useState([]); 
  const [newReleases, setNewReleases] = useState([]);       
  const [topSongs, setTopSongs] = useState([]);             
  const [popularArtists, setPopularArtists] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        if (!BASE_API_URL) {
            setLoading(false);
            return;
        }

        try {
            const mapSongData = (song) => {
                const artistObj = typeof song.artist === 'object' ? song.artist : null;
                return {
                    id: song._id,
                    title: song.title,
                    artist: artistObj ? artistObj.name : 'Unknown Artist',
                    artistId: artistObj ? (artistObj.artist_id || artistObj._id) : null,
                    artistImage: artistObj ? (artistObj.avatar || artistObj.image) : null,
                    image: song.cover || 'https://placehold.co/150x150/282828/white?text=Song',
                    url: song.url,
                    duration: formatDuration(song.duration),
                };
            };

            const mapArtistData = (artist) => ({
                id: artist.artist_id || artist._id || artist.id, 
                name: artist.name,
                image: artist.avatar || artist.image || 'https://placehold.co/150x150/282828/white?text=Artist',
                type: 'Artist'
            });

            // 0. Recommendations
            if (user && (user._id || user.id)) {
                const userId = user._id || user.id;
                try {
                     const recRes = await fetch(`${BASE_API_URL}/users/${userId}/recommendations?limit=10&ml=1`);
                     if (recRes.ok) {
                         const recData = await recRes.json();
                         const recArray = recData.recommendations || [];
                         setRecommendedSongs(recArray.map(mapSongData));
                     }
                } catch (e) { console.warn("Recommendation fetch failed"); }
            } else {
                setRecommendedSongs([]);
            }

            // 1. Most Played
            const mostPlayedRes = await fetch(`${BASE_API_URL}/songs/most-played?limit=10`);
            const mostPlayedData = await mostPlayedRes.json();
            const mostPlayedArray = mostPlayedData.songs || [];

            // 2. New Releases
            const newReleaseRes = await fetch(`${BASE_API_URL}/songs/new-release?limit=10`);
            const newReleaseData = await newReleaseRes.json();
            const newReleaseArray = newReleaseData.songs || [];

            // 3. Top Songs
            const topSongsRes = await fetch(`${BASE_API_URL}/songs/top?limit=10`);
            const topSongsData = await topSongsRes.json();
            const topSongsArray = Array.isArray(topSongsData) ? topSongsData : (topSongsData.songs || []);

            // 4. Artists
            let artistsArray = [];
            try {
                const artistRes = await fetch(`${BASE_API_URL}/artists`);
                if(artistRes.ok) {
                    const artistData = await artistRes.json();
                    artistsArray = artistData.data || artistData || [];
                }
            } catch (e) { console.warn("Artist fetch failed"); }

            setMostPlayedSongs(mostPlayedArray.map(mapSongData));
            setNewReleases(newReleaseArray.map(mapSongData));
            setTopSongs(topSongsArray.map(mapSongData));
            setPopularArtists(artistsArray.map(mapArtistData));

        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Không thể tải dữ liệu.");
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [user]); 

  const handleItemClick = (item, playlist = [], index = 0) => {
    if (!isLoggedIn) {
      setSelectedCardImage(item.image || '');
      setIsModalOpen(true);
    } else {
      if (item.url && onSongSelect) {
        onSongSelect(item, playlist, index);
      }
    }
  };

  // ✅ FIX RESPONSIVE CARD WIDTH:
  // Chia nhỏ kích thước hơn để phù hợp khi có Sidebar
  // - w-32: Mobile nhỏ
  // - sm:w-36: Mobile lớn
  // - md:w-40: Tablet/Laptop nhỏ (Khi có sidebar 280px, không gian còn lại hẹp -> giảm size thẻ)
  // - lg:w-48: Laptop thường
  // - xl:w-56: Màn hình lớn
  const cardWidth = "w-32 sm:w-36 md:w-40 lg:w-48 xl:w-56 flex-shrink-0";
  
  const popularAlbums = [
    { id: 'ab1', image: '/Album.png', title: 'm-tp M-TP', artist: 'Sơn Tùng M-TP' },
    { id: 'ab2', image: '/Album.png', title: 'Midnights', artist: 'Taylor Swift' },
  ];

  if (!isLoggedIn) return <LandingPage/>;
  
  return (
    // Giảm padding trên md để tiết kiệm diện tích
    <main className='p-4 md:p-4 lg:p-6 pb-24'>

      {/* 0. DÀNH RIÊNG CHO BẠN */}
      {recommendedSongs.length > 0 && (
           <ScrollableSection title={`Dành riêng cho ${user?.username || 'bạn'}`}>
               {recommendedSongs.map((song, index) => (
                  <div key={song.id} className={cardWidth}>
                    <div onClick={() => handleItemClick(song, recommendedSongs, index)} className="cursor-pointer">
                      <SongCard {...song}/>
                    </div>
                  </div>
                ))}
           </ScrollableSection>
      )}

      {/* 1. BẢNG XẾP HẠNG */}
      <ScrollableSection title="Bảng xếp hạng thịnh hành">
        {topSongs.length > 0 ? (
            topSongs.map((song, index) => (
              <div key={song.id} className={cardWidth}>
                <div onClick={() => handleItemClick(song, topSongs, index)} className="cursor-pointer">
                  <SongCard {...song}/>
                </div>
              </div>
            ))
        ) : !loading && <p className="text-neutral-400">Chưa có bảng xếp hạng.</p>}
      </ScrollableSection>

      {/* 2. NGHE NHIỀU NHẤT */}
      <ScrollableSection title="Nghe nhiều nhất">
        {loading ? <p className="text-white animate-pulse"></p> 
        : mostPlayedSongs.length > 0 ? (
            mostPlayedSongs.map((song, index) => (
              <div key={song.id} className={cardWidth}>
                <div onClick={() => handleItemClick(song, mostPlayedSongs, index)} className="cursor-pointer">
                  <SongCard {...song}/>
                </div>
              </div>
            ))
        ) : <p className="text-neutral-400">Chưa có dữ liệu.</p>}
      </ScrollableSection>

      {/* 3. MỚI PHÁT HÀNH */}
      <ScrollableSection title="Mới phát hành">
        {newReleases.length > 0 ? (
            newReleases.map((song, index) => (
              <div key={song.id} className={cardWidth}>
                <div onClick={() => handleItemClick(song, newReleases, index)} className="cursor-pointer">
                  <SongCard {...song}/>
                </div>
              </div>
            ))
        ) : !loading && <p className="text-neutral-400">Chưa có bài hát mới.</p>}
      </ScrollableSection>

      {/* 4. NGHỆ SĨ */}
      <ScrollableSection title="Nghệ sĩ nổi bật">
        {popularArtists.length > 0 && (
            popularArtists.map((artist) => (
                <div key={artist.id} className={cardWidth}>
                    <ArtistCard {...artist} />
                </div>
            ))
        )}
      </ScrollableSection>

      {/* 5. ALBUM (Mock) */}
      <ScrollableSection title="Album phổ biến">
        {popularAlbums.map((album) => (
          <div key={album.id} className={cardWidth}>
            <div onClick={() => handleItemClick(album)} className="cursor-pointer">
              <AlbumCard {...album} />
            </div>
          </div>
        ))}
      </ScrollableSection>

      <LoginPromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cardImage={selectedCardImage}
      />
    </main>
  );
}