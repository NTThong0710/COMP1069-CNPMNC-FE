import { Play, Shuffle, Download } from "lucide-react";
import { FaRegClock } from "react-icons/fa";

export default function LikedSongs({ onSongSelect }) {
  const songs = [
    {
      id: 1,
      title: "Mê Cung Tình Yêu (prod. RIO)",
      artist: "52Hz",
      album: "Mê Cung Tình Yêu (prod. RIO)",
      date: "Jun 12, 2025",
      duration: "3:39",
      image: "https://i.scdn.co/image/ab67616d0000b273d44a55c6ef93c5e9b1f5e8a1",
    },
    {
      id: 2,
      title: "Người Hãy Quên Em Đi",
      artist: "Mỹ Tâm",
      album: "Tâm 9",
      date: "Jun 8, 2025",
      duration: "3:52",
      image: "https://i.scdn.co/image/ab67616d0000b273eb5f5df54bdb8269d2938a54",
    },
    {
      id: 3,
      title: "Heavy",
      artist: "The Marías",
      album: "CINEMA",
      date: "Jun 2, 2025",
      duration: "4:13",
      image: "https://i.scdn.co/image/ab67616d0000b2737138f5c31e55d1b3b963bfa1",
    },
    {
      id: 4,
      title: "1950",
      artist: "King Princess",
      album: "1950",
      date: "Apr 16, 2024",
      duration: "3:45",
      image: "https://i.scdn.co/image/ab67616d0000b273c5ed3e13c76fcb2cbcb4c322",
    },
    {
      id: 5,
      title: "Mystery of Love",
      artist: "Sufjan Stevens",
      album: "Mystery of Love",
      date: "Apr 16, 2024",
      duration: "4:09",
      image: "https://i.scdn.co/image/ab67616d0000b2731b8cc9d5a5ef67bcb69b2a69",
    },
    {
      id: 6,
      title: "Sweater Weather",
      artist: "The Neighbourhood",
      album: "I Love You.",
      date: "Apr 16, 2024",
      duration: "4:00",
      image: "https://i.scdn.co/image/ab67616d0000b273ee61b197a9a20a6c9f62a3fa",
    },
    {
      id: 7,
      title: "Be My Mistake",
      artist: "The 1975",
      album: "A Brief Inquiry Into Online Relationships",
      date: "Apr 16, 2024",
      duration: "4:17",
      image: "https://i.scdn.co/image/ab67616d0000b2732578fdddf6dcfac3f5f1504a",
    },
    {
      id: 8,
      title: "Save Your Tears",
      artist: "The Weeknd",
      album: "After Hours",
      date: "Apr 16, 2024",
      duration: "3:36",
      image: "https://i.scdn.co/image/ab67616d0000b273d5abbe8b1d8f4d1e3a7d4b1f",
    },
  ];

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#4c1d95] via-[#4c1d95] to-[#2e1065] p-8 flex items-end gap-6">
        <div className="flex items-end gap-6 p-8">
          <div className="w-56 h-56 bg-gradient-to-br from-indigo-500 via-purple-600 to-green-200 flex items-center justify-center rounded shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-24 h-24 text-white"
            >
              <path d="M12 22s-8-5.33-10-10.34C.4 7.14 2.72 3 6.5 3 8.74 3 10.5 4.5 12 6c1.5-1.5 3.26-3 5.5-3 3.78 0 6.1 4.14 4.5 8.66C20 16.67 12 22 12 22z" />
            </svg>
          </div>

          <div>
            <p className="text-sm font-semibold">Playlist</p>
            <h1 className="text-7xl font-bold mt-2">Liked Songs</h1>
            <p className="text-sm mt-4 text-gray-300">
              <span className="font-semibold">Tấn Tú Nguyễn</span> •{" "}
              {songs.length} songs
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#1c1433] via-[#121212] to-[#121212] p-8">
        {/* Controls */}
        <div className="flex items-center gap-6 p-8 pt-4">
          <button
            onClick={() => onSongSelect(songs[0], songs, 0)}
            className="bg-green-500 hover:bg-green-400 text-black rounded-full p-4"
          >
            <Play size={28} fill="black" />
          </button>
          <button className="text-gray-300 hover:text-white">
            <Shuffle size={24} />
          </button>
          <button className="text-gray-300 hover:text-white">
            <Download size={24} />
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[40px_6fr_4fr_3fr_80px] px-8 py-3 border-b border-neutral-800 text-sm text-gray-400 uppercase tracking-wider">
          <div>#</div>
          <div>Title</div>
          <div>Album</div>
          <div>Date added</div>
          <div className="flex justify-end">
            <FaRegClock />
          </div>
        </div>

        {/* Song list */}
        <div>
          {songs.map((song, index) => (
            <div
              onClick={() => onSongSelect(song, songs, index)}
              key={song.id}
              className="grid grid-cols-[40px_6fr_4fr_3fr_80px] items-center px-8 py-3 hover:bg-neutral-800/60 transition-all duration-200 cursor-pointer"
            >
              <div className="text-gray-400">{index + 1}</div>
              <div className="flex items-center gap-4">
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <p className="font-medium text-white">{song.title}</p>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
              </div>
              <div className="text-gray-400">{song.album}</div>
              <div className="text-gray-400">{song.date}</div>
              <div className="text-gray-400 text-right">{song.duration}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
