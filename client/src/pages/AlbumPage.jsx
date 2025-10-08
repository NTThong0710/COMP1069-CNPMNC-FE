// src/pages/AlbumPage.jsx

import { FaPlay, FaRegClock } from 'react-icons/fa';

// Component này nhận prop onSongSelect từ App.jsx
export default function AlbumPage({ onSongSelect }) {
  // Dữ liệu giả cho các bài hát, mỗi bài có link nhạc thật
  const tracks = [
    { 
      title: 'Lofi Chill', 
      artist: 'Bo Vandek', 
      duration: '2:13',
      url: 'https://cdn.pixabay.com/audio/2022/10/18/audio_731a5472e3.mp3' 
    },
    { 
      title: 'The Beat of Nature', 
      artist: 'Olexy', 
      duration: '2:44',
      url: 'https://cdn.pixabay.com/audio/2023/10/13/audio_a12b62916f.mp3' 
    },
    { 
      title: 'Cinematic Ambient', 
      artist: 'Lexin Music', 
      duration: '2:50',
      url: 'https://cdn.pixabay.com/audio/2022/11/11/audio_a272ab225c.mp3' 
    },
  ];

  return (
    <main className="p-8">
      {/* Album Header */}
      <div className="flex items-end gap-6 mb-8">
        <img 
          src="https://via.placeholder.com/224x224/1DB954/000000?text=Album" 
          alt="Album" 
          className="w-56 h-56 rounded-lg shadow-2xl"
        />
        <div>
          <p className="text-sm font-bold text-white">Album</p>
          <h1 className="text-5xl lg:text-8xl font-black text-white leading-tight">Chill Vibes</h1>
          <p className="text-sm text-white mt-4">
            Various Artists • 2025 • {tracks.length} songs
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-8">
          <button 
            // Khi bấm nút play lớn, sẽ mặc định phát bài đầu tiên
            onClick={() => onSongSelect(tracks[0])}
            className="bg-green-500 w-14 h-14 rounded-full flex items-center justify-center hover:scale-105"
          >
              <FaPlay size={20} className="text-black ml-1"/>
          </button>
      </div>

      {/* Track List */}
      <div>
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 text-neutral-400 border-b border-neutral-800 p-2 mb-2">
          <span className="text-lg">#</span>
          <span>Title</span>
          <FaRegClock />
        </div>
        {tracks.map((track, index) => (
          <div 
            key={index} 
            className="grid grid-cols-[auto_1fr_auto] gap-4 items-center text-white hover:bg-white/10 p-2 rounded-md group cursor-pointer"
            onClick={() => onSongSelect(track)} // Gọi hàm onSongSelect khi click vào một bài
          >
            <span className="text-neutral-400 group-hover:text-white">{index + 1}</span>
            <div>
              <p className="font-semibold">{track.title}</p>
              <p className="text-sm text-neutral-400">{track.artist}</p>
            </div>
            <span className="text-neutral-400">{track.duration}</span>
          </div>
        ))}
      </div>
    </main>
  );
}