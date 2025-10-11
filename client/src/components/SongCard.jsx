import { FaPlay } from "react-icons/fa"; // Import icon Play

function SongCard({ image, title, artist }) {
  return (
    // Dùng 'group' để kích hoạt hiệu ứng cho phần tử con khi hover vào cha
    <div className="group relative bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 cursor-pointer shadow-lg">
      
      {/* Container cho ảnh và nút play */}
      <div className="relative w-full mb-4">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-auto aspect-square object-cover rounded-md" 
        />
        
        {/* Nút Play - Chỉ hiện khi hover vào 'group' (thẻ cha) */}
        <button 
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
  );
}

export default SongCard;