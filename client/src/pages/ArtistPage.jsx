import { useParams } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { CheckCircle, MoreHorizontal } from 'lucide-react'; // Import icon mới
import { artistsData } from '../data/artists';
import AlbumCard from '../components/AlbumCard';

export default function ArtistPage({ onSongSelect }) {
  const { artistId } = useParams();
  const artist = artistsData[artistId];

  if (!artist) {
    return (
      <main className="p-8">
        <h1 className="text-4xl font-bold text-white">Artist not found!</h1>
      </main>
    );
  }

  const topSongs = artist.topSongs || [];
  const albums = artist.albums || [];

  return (
    <main className="bg-neutral-900 overflow-hidden">
      {/* PHẦN HEADER ĐÃ ĐƯỢC LÀM LẠI HOÀN TOÀN */}
      <div className="relative h-[400px] flex flex-col justify-end p-8">
        {/* Lớp ảnh nền */}
        <img 
          src={artist.avatar} 
          alt={artist.name} 
          className="absolute inset-0 w-full h-full object-cover object-center" 
        />
        {/* Lớp phủ gradient để làm tối ảnh */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Nội dung text nằm trên cùng */}
        <div className="relative">
            <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-blue-400" size={28} fill="currentColor" />
                <span className="text-sm font-bold text-white">Verified Artist</span>
            </div>
            <h1 className="text-9xl font-black text-white">{artist.name}</h1>
            <p className="text-white mt-4 text-lg font-medium">{artist.monthlyListeners} monthly listeners</p>
        </div>
      </div>

      {/* PHẦN NỘI DUNG VÀ CÁC NÚT BẤM */}
      <div className="p-8">
        {/* Dải nút điều khiển */}
        <div className="flex items-center gap-6 mb-8">
          <button
            onClick={() => onSongSelect(topSongs[0], topSongs, 0)}
            className="bg-green-500 w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            <FaPlay size={20} className="text-black ml-1" />
          </button>
          <button className="border border-white/50 text-white font-bold px-6 py-2 rounded-md hover:border-white transition">
            Following
          </button>
          <button className="text-neutral-400 hover:text-white">
            <MoreHorizontal size={28} />
          </button>
        </div>

        {/* Tiểu sử (Bio) */}
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">About</h2>
            <p className="text-neutral-300 leading-relaxed">{artist.bio}</p>
        </div>

        {/* Các bài hát nổi bật */}
        <h2 className="text-2xl font-bold text-white mb-4">Popular</h2>
        <div className="space-y-2 mb-12">
          {topSongs.slice(0, 5).map((track, index) => (
            <div
              key={track.id}
              className="grid grid-cols-[auto_1fr_auto] gap-4 items-center text-white hover:bg-white/10 p-2 rounded-md group cursor-pointer"
              onClick={() => onSongSelect(track, topSongs, index)}
            >
              <div className="text-neutral-400 w-8 text-center flex items-center justify-center text-lg">
                {index + 1}
              </div>
              <div className="flex items-center gap-4">
                <img src={track.image} alt={track.title} className="w-10 h-10 object-cover rounded" />
                <p className="font-semibold">{track.title}</p>
              </div>
              <p className="text-neutral-400">{track.duration}</p>
            </div>
          ))}
        </div>

        {/* Discography - Album */}
        <h2 className="text-2xl font-bold text-white mb-4">Discography</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {albums.map(album => (
              <AlbumCard key={album.id} {...album} />
            ))}
        </div>
      </div>
    </main>
  );
}