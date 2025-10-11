  // src/components/PlayerBarActive.jsx
  import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRandom, FaRedo, FaVolumeUp } from 'react-icons/fa';
  import { FiPlus } from 'react-icons/fi';

  // Hàm helper để format giây thành dạng M:SS (ví dụ: 135 giây -> "2:15")
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const floorSeconds = Math.floor(seconds);
    const minutes = Math.floor(floorSeconds / 60);
    const remainingSeconds = floorSeconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  export default function PlayerBarActive({ song, isPlaying, onPlayPause, progress, duration }) {
    if (!song) {
      return <div className="bg-black h-[72px] border-t border-neutral-800"></div>;
    }

    const progressPercent = duration ? (progress / duration) * 100 : 0;

    return (
      <div className="bg-black text-white px-4 py-2 flex items-center justify-between border-t border-neutral-800">
        <div className="flex items-center gap-3 w-1/4">
          <img src="https://via.placeholder.com/56x56/1DB954/000000?text=Music" alt={song.title} className="w-14 h-14 rounded-md"/>
          <div>
            <a href="#" className="font-semibold text-sm hover:underline">{song.title}</a>
            <a href="#" className="text-xs text-neutral-400 hover:underline">{song.artist}</a>
          </div>
          <button className="text-neutral-400 hover:text-white"><FiPlus size={20}/></button>
        </div>
        <div className="flex flex-col items-center gap-1 w-2/5">
          <div className="flex items-center gap-4 text-neutral-300">
            <button className="hover:text-white"><FaRandom /></button>
            <button className="hover:text-white"><FaStepBackward size={20} /></button>
            <button onClick={onPlayPause} className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center hover:scale-105">
              {isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
            </button>
            <button className="hover:text-white"><FaStepForward size={20} /></button>
            <button className="hover:text-white"><FaRedo /></button>
          </div>
          <div className="flex items-center gap-2 w-full mt-1">
            <span className="text-xs text-neutral-400">{formatTime(progress)}</span>
            <div className="w-full bg-neutral-600 rounded-full h-1 group">
              <div 
                className="bg-white h-1 rounded-full group-hover:bg-green-500"
                style={{ width: `${progressPercent}%` }} // Style động
              ></div>
            </div>
            <span className="text-xs text-neutral-400">{formatTime(duration)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 w-1/4 justify-end text-neutral-300">
            <button className="hover:text-white"><FaVolumeUp /></button>
            <div className="w-24 bg-neutral-600 rounded-full h-1"><div className="bg-white w-3/4 h-1 rounded-full"></div></div>
        </div>
      </div>
    );
  }