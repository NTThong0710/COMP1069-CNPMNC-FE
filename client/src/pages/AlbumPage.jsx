import { useState, useEffect } from 'react'; // Thêm useState và useEffect
import { useParams } from 'react-router-dom';
import { FaPlay, FaRegClock, FaPlus, FaEllipsisH } from 'react-icons/fa'; // Thêm icons
import { albumsData } from '../data/album';
import SongActionsMenu from '../components/SongActionMenu'; // Import component menu

export default function AlbumPage({ onSongSelect }) {
  const { albumId } = useParams();
  const album = albumsData.find(a => a.id === albumId);

  // State để quản lý menu nào đang mở, `null` là không có menu nào mở
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  // Hiệu ứng để đóng menu khi click ra ngoài
  useEffect(() => {
    const closeMenu = () => setOpenMenuIndex(null);
    // Nếu có menu đang mở, thêm event listener
    if (openMenuIndex !== null) {
      window.addEventListener('click', closeMenu);
    }
    // Dọn dẹp event listener khi component unmount hoặc khi menu đóng
    return () => {
      window.removeEventListener('click', closeMenu);
    };
  }, [openMenuIndex]);


  if (!album) {
    return (
      <main className="p-8">
        <h1 className="text-4xl font-bold">Album not found!</h1>
      </main>
    );
  }

  const tracks = album.tracks;

  const handleMenuToggle = (e, index) => {
    e.stopPropagation(); // Ngăn sự kiện click vào bài hát
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  return (
    <main className="p-8">
      {/* Album Header - Không thay đổi */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8">
        <img src={album.image} alt={album.title} className="w-40 h-40 sm:w-56 sm:h-56 rounded-lg shadow-2xl"/>
        <div>
          <p className="text-sm font-bold text-white uppercase">Album</p>
          <h1 className="text-5xl lg:text-8xl font-black text-white leading-tight">{album.title}</h1>
          <p className="text-sm text-white mt-4">{album.artist} • 2025 • {tracks.length} songs</p>
        </div>
      </div>

      {/* Controls - Không thay đổi */}
      <div className="flex items-center gap-6 mb-8">
        <button onClick={() => onSongSelect(tracks[0])} className="bg-green-500 w-14 h-14 rounded-full flex items-center justify-center hover:scale-105">
          <FaPlay size={20} className="text-black ml-1"/>
        </button>
      </div>

      {/* Track List - THAY ĐỔI LỚN Ở ĐÂY */}
      <div>
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 text-neutral-400 border-b border-neutral-800 p-2 mb-2">
          <span className="text-lg mx-4">#</span>
          <span>Title</span>
          <FaRegClock />
        </div>
        {tracks.map((track, index) => (
          <div 
            key={index} 
            // Thêm "relative" để định vị menu con
            className="grid grid-cols-[auto_1fr_auto] gap-4 items-center text-white hover:bg-white/10 p-2 rounded-md group cursor-pointer relative"
            onClick={() => onSongSelect(track)}
          >
            {/* Cột 1: Số thứ tự hoặc nút Play khi hover */}
            <div className="text-neutral-400 w-8 text-center">
              <span className="group-hover:hidden">{index + 1}</span>
              <button className="hidden group-hover:block text-white">
                <FaPlay size={14}/>
              </button>
            </div>
            
            {/* Cột 2: Tên bài hát và nghệ sĩ */}
            <div>
              <p className="font-semibold">{track.title}</p>
              <p className="text-sm text-neutral-400">{track.artist}</p>
            </div>

            {/* Cột 3: Dấu +, icon ... và thời lượng */}
            <div className="flex items-center gap-4 text-neutral-400">
              {/* Nút cộng chỉ hiện khi hover */}
              <button className="hidden group-hover:block text-white">
                <FaPlus size={16} />
              </button>
              
              {/* Thời lượng hiện mặc định */}
              <span className="group-hover:hidden">{track.duration}</span>

              {/* Nút ... chỉ hiện khi hover */}
              <div className="relative">
                <button 
                  onClick={(e) => handleMenuToggle(e, index)}
                  className="hidden group-hover:block text-white p-1"
                >
                  <FaEllipsisH size={16} />
                </button>
                {/* Menu sẽ hiện ở đây */}
                <SongActionsMenu 
                  isOpen={openMenuIndex === index}
                  onClose={() => setOpenMenuIndex(null)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}