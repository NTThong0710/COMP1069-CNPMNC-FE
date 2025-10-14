import React, { useState } from 'react';
import ArtistCard from '../components/ArtistCard';
import SongCard from '../components/SongCard';
import AlbumCard from '../components/AlbumCard';
import RadioCard from '../components/RadioCard';
import ChartCard from '../components/ChartCard';
import LoginPromptModal from '../components/LoginPromptModal';
import ScrollableSection from '../components/ScrollableSection';

export default function HomePage({ isLoggedIn, onSongSelect }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardImage, setSelectedCardImage] = useState('');

  // --- THAY ĐỔI 1: Đổi tên và tổng quát hóa hàm xử lý click ---
  // Giờ nó có thể nhận bất kỳ item nào (song, artist, album...)
  const handleItemClick = (item) => {
    if (!isLoggedIn) {
      // Nếu chưa đăng nhập, chỉ cần lấy ảnh và mở modal
      setSelectedCardImage(item.image || 'https://i.scdn.co/image/ab67616d00001e02c521a8377995c64375b43b67'); // Dùng ảnh dự phòng nếu item ko có
      setIsModalOpen(true);
    } else {
      // Nếu đã đăng nhập, kiểm tra xem item có 'url' không
      if (item.url && onSongSelect) {
        // Nếu có url, đây là một bài hát -> phát nhạc
        onSongSelect(item);
      } else {
        // Nếu không có url, đây là artist, album... -> giả lập hành động
        console.log('Đã đăng nhập! Điều hướng tới:', item.title || item.name);
        // Sau này bro sẽ thay console.log bằng navigate()
      }
    }
  };

  // --- THAY ĐỔI 2: Cập nhật dữ liệu cho đa dạng và thêm ID ---
  // Việc này giúp key trong React là duy nhất và dữ liệu trông thật hơn
  const trendingSongs = [
    { id: 's1', title: 'The Fate of Ophelia', artist: 'Taylor Swift', image: '/The Fate of Ophelia.jpg', url: '/Nắng Ấm Xa Dần (Remix).mp3' },
    { id: 's3', title: 'Không Buông', artist: 'Hngle, Ari', image: '/Không buông.jpg', url: '/music/khong-buong.mp3' },
    { id: 's4', title: 'Không Buông', artist: 'Hngle, Ari', image: '/Không buông.jpg', url: '/music/khong-buong.mp3' },
    { id: 's5', title: 'Không Buông', artist: 'Hngle, Ari', image: '/Không buông.jpg', url: '/music/khong-buong.mp3' },
    { id: 's6', title: 'Không Buông', artist: 'Hngle, Ari', image: '/Không buông.jpg', url: '/music/khong-buong.mp3' },
    { id: 's7', title: 'The Fate of Ophelia', artist: 'Taylor Swift', image: '/The Fate of Ophelia.jpg', url: '/music/ophelia.mp3' },
  ];
  
  const popularArtists = [
    { id: 'a1', image: '/Sơn Tùng MTP.png', name: 'Sơn Tùng M-TP', type: 'Artist' },
    { id: 'a2', image: '/Sơn Tùng MTP.png', name: 'Sơn Tùng M-TP', type: 'Artist' },
    { id: 'a3', image: '/Sơn Tùng MTP.png', name: 'Sơn Tùng M-TP', type: 'Artist' },
    { id: 'a4', image: '/Sơn Tùng MTP.png', name: 'Sơn Tùng M-TP', type: 'Artist' },
    { id: 'a5', image: '/Sơn Tùng MTP.png', name: 'Sơn Tùng M-TP', type: 'Artist' },
    { id: 'a6', image: '/Sơn Tùng MTP.png', name: 'Sơn Tùng M-TP', type: 'Artist' },
    { id: 'a7', image: '/Sơn Tùng MTP.png', name: 'Sơn Tùng M-TP', type: 'Artist' },
    { id: 'a8', image: '/Sơn Tùng MTP.png', name: 'Sơn Tùng M-TP', type: 'Artist' },
  ];
  
  const popularAlbums = [
    { id: 'ab1', image: '/Album.png', title: 'm-tp M-TP', artist: 'Sơn Tùng M-TP' },
     { id: 'ab2', image: '/Album.png', title: 'm-tp M-TP', artist: 'Sơn Tùng M-TP' },
     { id: 'ab3', image: '/Album.png', title: 'm-tp M-TP', artist: 'Sơn Tùng M-TP' },
      { id: 'ab4', image: '/Album.png', title: 'm-tp M-TP', artist: 'Sơn Tùng M-TP' },
       { id: 'ab5', image: '/Album.png', title: 'm-tp M-TP', artist: 'Sơn Tùng M-TP' },
        { id: 'ab6', image: '/Album.png', title: 'm-tp M-TP', artist: 'Sơn Tùng M-TP' },
         { id: 'ab7', image: '/Album.png', title: 'm-tp M-TP', artist: 'Sơn Tùng M-TP' },
  ];

  const popularRadio = [
    { id: 'r1', image: '/Vũ.png', title: 'Vũ. Radio', artists: 'With Da LAB, Chillies...', bgColor: ['#B43884', '#604894'] },
    { id: 'r2', image: '/Vũ.png', title: 'Hà Anh Tuấn Radio', artists: 'With Phan Mạnh Quỳnh...', bgColor: ['#4E6487', '#2A374A'] },
    { id: 'r3', image: '/Vũ.png', title: 'Sơn Tùng M-TP Radio', artists: 'With Kay Trần, Onionn...', bgColor: ['#8C604D', '#593D31'] },
    { id: 'r4', image: '/Vũ.png', title: 'Vũ. Radio', artists: 'With Da LAB, Chillies...', bgColor: ['#B43884', '#604894'] },
  ];

   const featuredCharts = [
    { 
      id: 'c1', 
      title: 'Top Songs Global', 
      subtitle: 'Weekly Music Charts', 
      description: 'Your weekly update of the most played tracks right now.',
      image: 'https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_global_default.jpg', 
      bgColor: ['#8D4B98', '#4F2A72'] 
    }, 
    { 
      id: 'c2', 
      title: 'Top Songs Vietnam', 
      subtitle: 'Weekly Music Charts', 
      description: 'Your weekly update of the most played tracks in Vietnam.',
      image: 'https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_vn_default.jpg', 
      bgColor: ['#4B8098', '#2A4D72'] 
    },
    { 
      id: 'c3', 
      title: 'Top 50 - GLOBAL', 
      subtitle: 'Daily Music Charts', 
      description: 'Your daily update of the most played tracks right now.',
      image: 'https://charts-images.scdn.co/assets/locale_en/regional/daily/region_global_default.jpg', 
      bgColor: ['#98624B', '#723E2A'] 
    },
    { 
      id: 'c4', 
      title: 'Top 50 - VIETNAM', 
      subtitle: 'Daily Music Charts', 
      description: 'Your daily update of the most played tracks in Vietnam.',
      image: 'https://charts-images.scdn.co/assets/locale_en/regional/daily/region_vn_default.jpg', 
      bgColor: ['#984B4B', '#722A2A'] 
    },
  ];

  const cardWidth = "w-[18.5%]";

  return (
    <main className="p-6">

      {/* --- THAY ĐỔI 3: ÁP DỤNG onClick CHO TẤT CẢ CÁC SECTION --- */}

      <ScrollableSection title="Trending songs">
        {trendingSongs.map((song) => (
          <div key={song.id} className={`flex-shrink-0 ${cardWidth}`}>
            <div onClick={() => handleItemClick(song)} className="cursor-pointer">
              <SongCard {...song} />
            </div>
          </div>
        ))}
      </ScrollableSection>

      <ScrollableSection title="Popular artists">
        {popularArtists.map((artist) => (
          <div key={artist.id} className={`flex-shrink-0 ${cardWidth}`}>
            <div onClick={() => handleItemClick(artist)} className="cursor-pointer">
              <ArtistCard {...artist} />
            </div>
          </div>
        ))}
      </ScrollableSection>
      
      <ScrollableSection title="Popular albums and singles">
        {popularAlbums.map((album) => (
          <div key={album.id} className={`flex-shrink-0 ${cardWidth}`}>
            <div onClick={() => handleItemClick(album)} className="cursor-pointer">
              <AlbumCard {...album} />
            </div>
          </div>
        ))}
      </ScrollableSection>
      
      <ScrollableSection title="Popular radio">
        {popularRadio.map((radio) => (
          <div key={radio.id} className={`flex-shrink-0 ${cardWidth}`}>
            <div onClick={() => handleItemClick(radio)} className="cursor-pointer">
              <RadioCard {...radio} />
            </div>
          </div>
        ))}
      </ScrollableSection>
      
      <ScrollableSection title="Featured Charts">
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
  );
}