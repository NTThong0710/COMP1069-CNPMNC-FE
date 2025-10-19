import { useParams } from "react-router-dom";
import { FaPlay, FaRegClock } from "react-icons/fa";

export default function PlaylistPage({ onSongSelect }) {
  const { playlistId } = useParams();

  // 🔹 Lấy danh sách playlist từ localStorage
  const storedPlaylists = JSON.parse(localStorage.getItem("userLibrary")) || [];

  // 🔹 Tìm playlist có id trùng với URL
  const playlist = storedPlaylists.find((p) => p.id === playlistId);

  if (!playlist) {
    return (
      <main className="p-8">
        <h1 className="text-4xl font-bold text-white">Playlist not found!</h1>
      </main>
    );
  }

  const tracks = playlist.tracks || []; // nếu có thêm trường này trong tương lai

  return (
    <main>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 p-8 bg-gradient-to-b from-purple-800 to-neutral-900">
        <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-lg shadow-2xl flex items-center justify-center bg-neutral-700">
          {playlist.image}
        </div>
        <div>
          <p className="text-sm font-bold text-white uppercase">Playlist</p>
          <h1 className="text-5xl lg:text-8xl font-black text-white leading-tight">
            {playlist.title}
          </h1>
          <p className="text-sm text-white mt-4">
            Robin • {tracks.length} songs
          </p>
        </div>
      </div>

      <div className="p-8 bg-neutral-900">
        <div className="flex items-center gap-6 mb-8">
          <button
            onClick={() => tracks[0] && onSongSelect(tracks[0], tracks, 0)}
            className="bg-green-500 w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            <FaPlay size={20} className="text-black ml-1" />
          </button>
        </div>

        {/* Danh sách bài hát (tạm thời trống nếu bạn chưa thêm) */}
        {tracks.length === 0 ? (
          <p className="text-neutral-400">
            This playlist is empty. Add some songs!
          </p>
        ) : (
          <div>
            <div className="grid grid-cols-[auto_2fr_1fr_auto] gap-4 text-neutral-400 border-b border-neutral-800 p-2 mb-2">
              <span className="text-lg mx-4">#</span>
              <span>Title</span>
              <span>Album</span>
              <FaRegClock />
            </div>
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className="grid grid-cols-[auto_2fr_1fr_auto] gap-4 items-center text-white hover:bg-white/10 p-2 rounded-md group cursor-pointer"
                onClick={() => onSongSelect(track, tracks, index)}
              >
                <div className="text-neutral-400 w-8 text-center flex items-center justify-center">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <button className="hidden group-hover:block text-white">
                    <FaPlay size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{track.title}</p>
                    <p className="text-sm text-neutral-400">{track.artist}</p>
                  </div>
                </div>
                <p className="text-neutral-400 truncate">{track.album}</p>
                <p className="text-neutral-400">{track.duration}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
