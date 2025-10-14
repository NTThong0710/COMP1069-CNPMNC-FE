import React from 'react';

// --- COMPONENT CON CHO CÁC PHẦN ---
// Giúp code chính gọn gàng hơn
const SectionHeader = ({ title, actionText }) => (
  <div className="flex justify-between items-center">
    <h2 className="font-bold text-lg">{title}</h2>
    {actionText && (
      <button className="text-sm font-semibold text-neutral-400 hover:text-white transition">
        {actionText}
      </button>
    )}
  </div>
);

const NextSongItem = ({ image, title, artist }) => (
  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-neutral-800/50 transition">
    <img src={image} alt={title} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
    <div>
      <p className="font-semibold text-white text-sm truncate">{title}</p>
      <p className="text-xs text-neutral-400">{artist}</p>
    </div>
  </div>
);

// --- COMPONENT CHÍNH ---
export default function RightSidebar({ song, onClose }) {
  if (!song) return null;

  // Dữ liệu giả lập cho "About the artist", sau này có thể lấy từ API
  const artistInfo = {
    name: "Vũ.",
    monthlyListeners: "1,724,264",
    bio: "I'm Vu.<br>", // Dùng <br> như trong hình
    bannerImage: "/Sơn Tùng MTP.png"
  };

  return (
    <div className="bg-neutral-900 rounded-lg h-full flex flex-col text-white overflow-hidden">
      {/* --- Header --- */}
      <div className="flex justify-between items-center p-4 flex-shrink-0">
        <h2 className="font-bold text-lg">{song.title}</h2>
        <button onClick={onClose} className="text-neutral-400 hover:text-white transition-transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* --- Khu vực cuộn --- */}
      <div className="overflow-y-auto px-4 space-y-6">
        {/* --- Now Playing --- */}
        <div className="flex-1">
          <img 
            src={song.image}
            alt={song.title}
            className="w-full rounded-md object-cover aspect-square shadow-lg"
          />
          <div className="mt-4">
            <h3 className="font-bold text-xl">{song.title}</h3>
            <p className="text-neutral-400">{song.artist}</p>
          </div>
        </div>
        
        {/* --- Next in Queue --- */}
        <div>
          <SectionHeader title="Next in queue" actionText="Open queue" />
          <div className="mt-2">
            <NextSongItem image="/buoc-qua-nhau.jpg" title="Bước Qua Nhau" artist="Vũ." />
          </div>
        </div>

        {/* --- About the Artist --- */}
        <div>
           <SectionHeader title="About the artist" />
           <div className="mt-2 relative rounded-lg overflow-hidden group">
              <img src={artistInfo.bannerImage} alt={artistInfo.name} className="w-full h-40 object-cover transition-transform group-hover:scale-105 duration-300" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute top-4 left-4">
                  <h3 className="text-white font-bold">{artistInfo.name}</h3>
                  <p className="text-sm text-neutral-300">{artistInfo.monthlyListeners} monthly listeners</p>
                  <p className="text-xs mt-2 text-neutral-300" dangerouslySetInnerHTML={{ __html: artistInfo.bio }} />
              </div>
              <button className="absolute bottom-4 right-4 bg-transparent border border-white/50 text-white text-sm font-bold px-4 py-1 rounded-full hover:bg-white/10 hover:border-white transition">
                Follow
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
