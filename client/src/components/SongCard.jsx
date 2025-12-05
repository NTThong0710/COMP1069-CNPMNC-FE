import { FaPlay } from "react-icons/fa";
import { useState } from "react";
import SongTooltip from "./SongTooltip";

function SongCard(props) {
  const { image, title, artist, song, onClick: _onClick, onPlayClick, ...rest } = props;
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Nếu parent không truyền nguyên object `song`, fallback dùng props hiện có
  const songData = song || { image, title, artist, ...rest };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTooltipPos({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  };

  const handlePlayClick = () => {
    if (onPlayClick) onPlayClick();
    else if (_onClick) _onClick();
  };

  return (
    <>
      <div 
        className="group relative bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 shadow-lg"
        onContextMenu={handleContextMenu}
      >
        {/* Container cho ảnh và nút play */}
        <div className="relative w-full mb-4">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-auto aspect-square object-cover rounded-md" 
          />
          
          {/* Nút Play - CHỈ trigger khi bấm */}
          <button 
            aria-label={`Play ${title}`}
            onClick={handlePlayClick}
            className="
              absolute 
              bottom-2 
              right-2 
              bg-green-500 
              p-4 
              rounded-full 
              shadow-xl 
              flex 
              items-center 
              justify-center
              opacity-0 
              translate-y-2
              group-hover:opacity-100 
              group-hover:translate-y-0
              transition-all 
              duration-300
              hover:scale-110
              cursor-pointer
            "
          >
            <FaPlay className="text-black" />
          </button>
        </div>

        {/* Phần text bên dưới */}
        <div>
          <p className="font-bold text-white truncate">{title}</p>
          <p className="text-sm text-neutral-400 truncate">{artist}</p>
        </div>
      </div>

      {/* Tooltip (Right-click) */}
      {showTooltip && songData && (
        <SongTooltip
          song={songData}
          position={tooltipPos}
          onClose={() => setShowTooltip(false)}
          onPlaySong={handlePlayClick}
        />
      )}
    </>
  );
}

export default SongCard;
