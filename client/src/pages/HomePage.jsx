import React, { useState } from 'react';
import ArtistCard from '../components/ArtistCard';
import SongCard from '../components/SongCard';
import AlbumCard from '../components/AlbumCard';
import RadioCard from '../components/RadioCard';
import ChartCard from '../components/ChartCard';
import LoginPromptModal from '../components/LoginPromptModal';
import ScrollableSection from '../components/ScrollableSection';
import { Link } from 'react-router-dom';
import { FaMusic, FaPodcast, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import { BsMusicNoteList } from 'react-icons/bs';

const LandingPage = () => {
  return (
    <div className=" text-white min-h-full">
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-r from-purple-800 to-blue-500 h-[80vh]">
        <h1 className="text-5xl md:text-7xl font-black mb-4">
          Listening is everything
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Millions of songs and podcasts. No credit card needed.
        </p>
        <Link to="/register">
          <button className="bg-green-500 text-white font-bold text-lg px-8 py-3 rounded-full hover:scale-105 transition-transform">
            CREATE ACCOUNT FREE
          </button>
        </Link>
      </section>


      <section className="py-16 px-8 mb-2">
        <h2 className="text-4xl font-bold text-center mb-12">Why Our Website?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="text-center">
            {/* ✅ 2. SỬA LẠI TÊN COMPONENT ICON */}
            <FaMusic className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-2xl font-bold mb-2">Play your favorites.</h3>
            <p className="text-neutral-400">Listen to the songs you love, and discover new music and podcasts.</p>
          </div>
          <div className="text-center">
            {/* ✅ 2. SỬA LẠI TÊN COMPONENT ICON */}
            <BsMusicNoteList className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-2xl font-bold mb-2">Playlists made easy.</h3>
            <p className="text-neutral-400">We'll help you make playlists. Or enjoy playlists made by music experts.</p>
          </div>
          <div className="text-center">
            {/* ✅ 2. SỬA LẠI TÊN COMPONENT ICON */}
            <FaPodcast className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-2xl font-bold mb-2">Make it yours.</h3>
            <p className="text-neutral-400">Tell us what you like, and we'll recommend music for you.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default function HomePage({ isLoggedIn, onSongSelect }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardImage, setSelectedCardImage] = useState('');
 

  // --- THAY ĐỔI 1: Cập nhật hàm xử lý click ---
  // Giờ đây hàm có thể nhận thêm playlist và index cho các bài hát
  const handleItemClick = (item, playlist = [], index = 0) => {
    if (!isLoggedIn) {
      // Nếu chưa đăng nhập, chỉ cần lấy ảnh và mở modal
      setSelectedCardImage(item.image || 'https://i.scdn.co/image/ab67616d00001e02c521a8377995c64375b43b67');
      setIsModalOpen(true);
    } else {
      // Nếu đã đăng nhập, kiểm tra xem item có 'url' không (có phải bài hát không)
      if (item.url && onSongSelect) {
        // === ĐÂY LÀ THAY ĐỔI QUAN TRỌNG NHẤT ===
        // Nếu là bài hát, gọi onSongSelect với đủ 3 tham số
        onSongSelect(item, playlist, index);
      } else {
        // Nếu không phải bài hát (artist, album...), giả lập hành động điều hướng
        console.log('Đã đăng nhập! Điều hướng tới:', item.title || item.name);
        // Trong tương lai, bạn sẽ thay console.log bằng navigate() của React Router
      }
    }
  };

  // Dữ liệu mẫu cho trang chủ
  const trendingSongs = [
    { id: 's1', title: 'The Fate of Ophelia', artist: 'Taylor Swift', image: '/The Fate of Ophelia.jpg', url: '/Nắng Ấm Xa Dần (Remix).mp3' },
    { id: 's3', title: 'Không Buông', artist: 'Hngle, Ari', image: '/Không buông.jpg', url: '/music/khong-buong.mp3' },
    { id: 's4', title: 'Another Love', artist: 'Tom Odell', image: '/Không buông.jpg', url: '/music/another-love.mp3' },
    { id: 's5', title: 'Night Dancer', artist: 'imase', image: '/Không buông.jpg', url: '/music/night-dancer.mp3' },
    { id: 's6', title: 'Summertime', artist: 'Cinnamons', image: '/Không buông.jpg', url: '/music/summertime.mp3' },
    { id: 's7', title: 'The Fate of Ophelia', artist: '/Không buông.jpg', image: '/The Fate of Ophelia.jpg', url: '/music/ophelia.mp3' },
  ];

  const popularArtists = [
    { id: 'son-tung-mtp', image: '/son-tung-mtp.png', name: 'Sơn Tùng M-TP', type: 'Artist' },
    { id: 'a2', image: '/son-tung-mtp.png', name: 'Taylor Swift', type: 'Artist' },
    { id: 'a3', image: '/son-tung-mtp.png', name: 'The Weeknd', type: 'Artist' },
    { id: 'a4', image: '/son-tung-mtp.png', name: 'Billie Eilish', type: 'Artist' },
    { id: 'a5', image: '/son-tung-mtp.png', name: 'Sơn Tùng M-TP', type: 'Artist' },
  ];

  const popularAlbums = [
    { id: 'ab1', image: '/Album.png', title: 'm-tp M-TP', artist: 'Sơn Tùng M-TP' },
    { id: 'ab2', image: '/Album.png', title: 'Midnights', artist: 'Taylor Swift' },
    { id: 'ab3', image: '/Album.png', title: 'Starboy', artist: 'The Weeknd' },
    { id: 'ab4', image: '/Album.png', title: 'Happier Than Ever', artist: 'Billie Eilish' },
  ];

  const popularRadio = [
    { id: 'r1', image: '/Vũ.png', title: 'Vũ. Radio', artists: 'With Da LAB, Chillies...', bgColor: ['#B43884', '#604894'] },
    { id: 'r2', image: '/Vũ.png', title: 'Hà Anh Tuấn Radio', artists: 'With Phan Mạnh Quỳnh...', bgColor: ['#4E6487', '#2A374A'] },
  ];

  const featuredCharts = [
    { id: 'c1', title: 'Top Songs Global', description: 'Your weekly update of the most played tracks.', image: 'https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_global_default.jpg', bgColor: ['#8D4B98', '#4F2A72'] },
    { id: 'c2', title: 'Top Songs Vietnam', description: 'Your weekly update of the most played tracks in Vietnam.', image: 'https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_vn_default.jpg', bgColor: ['#4B8098', '#2A4D72'] },
  ];

  const cardWidth = "w-[18.5%]";

  return (
    <>
    {!isLoggedIn && <LandingPage/>}
    <main className='p-6'>
      
      <ScrollableSection title="Bài hát thịnh hành">
        {trendingSongs.map((song, index) => ( // Lấy `index` từ hàm map
          <div key={song.id} className={`flex-shrink-0 ${cardWidth}`}>
            {/* --- THAY ĐỔI 2: Cập nhật lời gọi hàm ở đây --- */}
            <div onClick={() => handleItemClick(song, trendingSongs, index)} className="cursor-pointer">
              <SongCard {...song}/>
            </div>
          </div>
        ))}
      </ScrollableSection>

      <ScrollableSection title="Nghệ sĩ nổi bật">
        {popularArtists.map((artist) => (
            <div key={artist.id} className={`flex-shrink-0 ${cardWidth}`}>
                {/* ✅ Code này sẽ tự động truyền id, name, image, type vào ArtistCard */}
                <ArtistCard {...artist} />
            </div>
        ))}
    </ScrollableSection>

      <ScrollableSection title="Album và đĩa đơn phổ biến">
        {popularAlbums.map((album) => (
          <div key={album.id} className={`flex-shrink-0 ${cardWidth}`}>
            <div onClick={() => handleItemClick(album)} className="cursor-pointer">
              <AlbumCard {...album} />
            </div>
          </div>
        ))}
      </ScrollableSection>

      <ScrollableSection title="Radio phổ biến">
        {popularRadio.map((radio) => (
          <div key={radio.id} className={`flex-shrink-0 ${cardWidth}`}>
            <div onClick={() => handleItemClick(radio)} className="cursor-pointer">
              <RadioCard {...radio} />
            </div>
          </div>
        ))}
      </ScrollableSection>

      <ScrollableSection title="Bảng xếp hạng nổi bật">
        {featuredCharts.map((chart) => (
          <div key={chart.id} className={`flex-shrink-0 ${cardWidth}`}>
            <div onClick={() => handleItemClick(chart)} className="cursor-pointer h-[200px]">
              <ChartCard {...chart} />
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
    </>
  );
}