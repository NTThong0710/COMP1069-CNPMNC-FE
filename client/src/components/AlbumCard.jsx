import { FaPlay } from "react-icons/fa"; // Import icon

function AlbumCard({ image, title, artist }) {
  return (
    // Đổi màu nền cho nhất quán và thêm shadow
    <div className="group relative bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 cursor-pointer shadow-lg">
      <div className="relative mb-4">
        {/* Thêm aspect-square để ảnh luôn vuông vức */}
        <img 
          src={image} 
          alt={title} 
          className="w-full aspect-square object-cover rounded-md shadow-lg" 
        />
        
        {/* Nút Play - "Linh hồn" của cái card */}
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

      <h3 className="font-bold text-white truncate">{title}</h3>
      <p className="text-sm text-neutral-400 mt-1 truncate">{artist}</p>
    </div>
  );
}

export default AlbumCard;