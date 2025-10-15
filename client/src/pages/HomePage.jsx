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
    { id: 's4', title: 'Another Love', artist: 'Tom Odell', image: '/another-love.jpg', url: '/music/another-love.mp3' },
    { id: 's5', title: 'Night Dancer', artist: 'imase', image: '/night-dancer.jpg', url: '/music/night-dancer.mp3' },
    { id: 's6', title: 'Summertime', artist: 'Cinnamons', image: '/summertime.jpg', url: '/music/summertime.mp3' },
    { id: 's7', title: 'The Fate of Ophelia', artist: 'Taylor Swift', image: '/The Fate of Ophelia.jpg', url: '/music/ophelia.mp3' },
  ];

  const popularArtists = [
    { id: 'a1', image: '/Sơn Tùng MTP.png', name: 'Sơn Tùng M-TP', type: 'Artist' },
    { id: 'a2', image: '/artist2.jpg', name: 'Taylor Swift', type: 'Artist' },
    { id: 'a3', image: '/artist3.jpg', name: 'The Weeknd', type: 'Artist' },
    { id: 'a4', image: '/artist4.jpg', name: 'Billie Eilish', type: 'Artist' },
    { id: 'a5', image: '/Sơn Tùng MTP.png', name: 'Sơn Tùng M-TP', type: 'Artist' },
  ];

  const popularAlbums = [
    { id: 'ab1', image: '/Album.png', title: 'm-tp M-TP', artist: 'Sơn Tùng M-TP' },
    { id: 'ab2', image: '/album2.jpg', title: 'Midnights', artist: 'Taylor Swift' },
    { id: 'ab3', image: '/album3.jpg', title: 'Starboy', artist: 'The Weeknd' },
    { id: 'ab4', image: '/album4.jpg', title: 'Happier Than Ever', artist: 'Billie Eilish' },
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
    <main className="p-6">
      <ScrollableSection title="Bài hát thịnh hành">
        {trendingSongs.map((song, index) => ( // Lấy `index` từ hàm map
          <div key={song.id} className={`flex-shrink-0 ${cardWidth}`}>
            {/* --- THAY ĐỔI 2: Cập nhật lời gọi hàm ở đây --- */}
            <div onClick={() => handleItemClick(song, trendingSongs, index)} className="cursor-pointer">
              <SongCard {...song} />
            </div>
          </div>
        ))}
      </ScrollableSection>

      <ScrollableSection title="Nghệ sĩ nổi bật">
        {popularArtists.map((artist) => (
          <div key={artist.id} className={`flex-shrink-0 ${cardWidth}`}>
            <div onClick={() => handleItemClick(artist)} className="cursor-pointer">
              <ArtistCard {...artist} />
            </div>
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
  );
}