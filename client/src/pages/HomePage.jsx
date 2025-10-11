// src/pages/HomePage.jsx

import React, { useState } from 'react';
import ArtistCard from '../components/ArtistCard';
import SongCard from '../components/SongCard';
import AlbumCard from '../components/AlbumCard';
import RadioCard from '../components/RadioCard';
import ChartCard from '../components/ChartCard';
import LoginPromptModal from '../components/LoginPromptModal';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  // THÊM STATE MỚI ĐỂ LƯU HÌNH ẢNH CỦA CARD ĐƯỢC CLICK
  const [selectedCardImage, setSelectedCardImage] = useState('');

  const handleCardClick = (image) => { // Cập nhật để nhận 'image'
    if (!isLoggedIn) {
      setSelectedCardImage(image); // Lưu hình ảnh của card
      setIsModalOpen(true);
    } else {
      console.log('User is logged in. Playing content...');
      // Logic để phát nhạc hoặc chuyển hướng
    }
  };

  // --- DỮ LIỆU (Giữ nguyên) ---
  const trendingSongs = [{ image: 'https://i.scdn.co/image/ab67616d00001e02c521a8377995c64375b43b67', title: 'The Fate of Ophelia', artist: 'Taylor Swift' }, { image: 'https://i.scdn.co/image/ab67616d00001e02927b20398f6a9a811c035614', title: 'NGƯỜI NHƯ ANH', artist: 'Anh Tú "Voi Bản Đôn"' }, { image: 'https://i.scdn.co/image/ab67616d00001e0281c79e2b1b453e0078734208', title: 'Không Buông', artist: 'Hngle, Ari' }];
  const popularArtists = [{ image: 'https://i.scdn.co/image/ab67616100005174026dd7153229a06637b51e51', name: 'Sơn Tùng M-TP', type: 'Artist' }, { image: 'https://i.scdn.co/image/ab67616100005174989ed068a0443d344d564b19', name: 'SOOBIN', type: 'Artist' }, { image: 'https://i.scdn.co/image/ab67616100005174a781a74d478705756a1b6360', name: 'HIEUTHUHAI', type: 'Artist' }];
  const popularAlbums = [{ image: 'https://i.scdn.co/image/ab67616d0000b273a090a282695562728956b6b7', title: 'm-tp M-TP', artist: 'Sơn Tùng M-TP' }, { image: 'https://i.scdn.co/image/ab67616d0000b27344f37430e43d11a689e49a8c', title: 'Ai Cũng Phải Bắt Đầu', artist: 'HIEUTHUHAI' }, { image: 'https://i.scdn.co/image/ab67616d0000b2735f40323381e59273c5240217', title: 'GOLDEN', artist: 'Jung Kook' }, { image: 'https://i.scdn.co/image/ab67616d0000b273a24d52145398246067c2936a', title: 'THE WXRDIE', artist: 'Wxrdie' }, { image: 'https://i.scdn.co/image/ab67616d0000b2738b8c5553e144379a07a1631e', title: 'Đánh Đổi', artist: 'Obito, Shiki' }];
  const popularRadio = [{ image: 'https://i.scdn.co/image/ab67616100005174575035252b4859a9307c875d', title: 'Vũ.', artists: 'With Da LAB, Chillies, SOOBIN...', bgColor: ['#B43884', '#604894'] }, { image: 'https://i.scdn.co/image/ab67616100005174f19b67482be9f4a56a52934f', title: 'Hà Anh Tuấn', artists: 'With Bùi Anh Tuấn, Vũ., SOOBIN...', bgColor: ['#4438b4', '#94488c'] }, { image: 'https://i.scdn.co/image/ab67616100005174989ed068a0443d344d564b19', title: 'SOOBIN', artists: 'With Da LAB, Rhymastic, Vũ Cát Tường...', bgColor: ['#388cb4', '#489464'] }, { image: 'https://i.scdn.co/image/ab67616100005174026dd7153229a06637b51e51', title: 'Sơn Tùng M-TP', artists: 'With Da LAB, HIEUTHUHAI, AMEE...', bgColor: ['#b46c38', '#944848'] }, { image: 'https://i.scdn.co/image/ab6761610000517492c39775f56475d6911f9788', title: 'Dangrangto', artists: 'With Wxrdie, TezTaeYungBoy...', bgColor: ['#b4a038', '#947048'] }];
  const featuredCharts = [{ title: 'Top Songs Global', subtitle: 'Weekly Music Charts', description: 'Your weekly update of the most played...', bgColor: ['#8D4B98', '#4F2A72'] }, { title: 'Top Songs Vietnam', subtitle: 'Weekly Music Charts', description: 'Your weekly update of the most played...', bgColor: ['#4B8098', '#2A4D72'] }, { title: 'Top 50 - GLOBAL', subtitle: '', description: 'Your daily update of the most viral tracks...', bgColor: ['#98624B', '#723E2A'] }, { title: 'Top 50 - VIETNAM', subtitle: '', description: 'Your daily update of the most viral tracks...', bgColor: ['#984B4B', '#722A2A'] }, { title: 'Viral 50 - GLOBAL', subtitle: '', description: 'Your daily update of the most viral tracks...', bgColor: ['#4B985F', '#2A723B'] }];
  
  return (
    <main className="p-6">
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold text-white">Trending songs</h2><a href="#" className="text-sm font-bold text-neutral-400 hover:underline">Show all</a></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {trendingSongs.map((song, index) => (
            // TRUYỀN HÌNH ẢNH VÀO handleCardClick
            <div key={index} onClick={() => handleCardClick(song.image)} className="cursor-pointer">
              <SongCard {...song} />
            </div>
          ))}
        </div>
      </section>

      <section className='mb-8'>
        <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold text-white">Popular artists</h2><a href="#" className="text-sm font-bold text-neutral-400 hover:underline">Show all</a></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {popularArtists.map((artist, index) => (
            // TRUYỀN HÌNH ẢNH VÀO handleCardClick
            <div key={index} onClick={() => handleCardClick(artist.image)} className="cursor-pointer">
              <ArtistCard {...artist} />
            </div>
          ))}
        </div>
      </section>
      
      <section className='mb-8'>
        <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold text-white">Popular albums and singles</h2><a href="#" className="text-sm font-bold text-neutral-400 hover:underline">Show all</a></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {popularAlbums.map((album, index) => (
            // TRUYỀN HÌNH ẢNH VÀO handleCardClick
            <div key={index} onClick={() => handleCardClick(album.image)} className="cursor-pointer">
              <AlbumCard {...album} />
            </div>
          ))}
        </div>
      </section>
      
      <section className='mb-8'>
        <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold text-white">Popular radio</h2><a href="#" className="text-sm font-bold text-neutral-400 hover:underline">Show all</a></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {popularRadio.map((radio, index) => (
            // TRUYỀN HÌNH ẢNH VÀO handleCardClick
            <div key={index} onClick={() => handleCardClick(radio.image)} className="cursor-pointer">
              <RadioCard {...radio} />
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold text-white">Featured Charts</h2><a href="#" className="text-sm font-bold text-neutral-400 hover:underline">Show all</a></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {featuredCharts.map((chart, index) => (
            // TRUYỀN HÌNH ẢNH VÀO handleCardClick (Lưu ý: ChartCard không có thuộc tính `image` trực tiếp, bạn cần xác định ảnh đại diện cho nó nếu muốn)
            // Hiện tại mình sẽ dùng một ảnh placeholder nếu ChartCard không có 'image'
            <div key={index} onClick={() => handleCardClick(chart.image || 'https://i.scdn.co/image/ab67616d00001e02c521a8377995c64375b43b67')} className="cursor-pointer">
              <ChartCard {...chart} />
            </div>
          ))}
        </div>
      </section>

      {/* TRUYỀN `selectedCardImage` VÀO MODAL */}
      <LoginPromptModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        cardImage={selectedCardImage} 
      />
    </main>
  );
}