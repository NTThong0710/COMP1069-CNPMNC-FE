import { FaPlay } from "react-icons/fa"; // Nhớ import icon

export default function ArtistCard({ image, name, type }) {
  return (
    // Thêm 'group' và đổi màu nền cho nhất quán
    <div className="group relative bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 cursor-pointer flex flex-col items-center text-center shadow-lg">
      
      {/* Bọc ảnh trong một div 'relative' để định vị nút Play */}
      <div className="relative mb-4">
        <img 
          src={image} 
          alt={name} 
          className="w-32 h-32 rounded-full object-cover shadow-md" 
        />
        
        {/* Nút Play - Y hệt như của SongCard */}
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

      <p className="font-bold text-white truncate">{name}</p>
      <p className="text-sm text-neutral-400 truncate">{type}</p>
    </div>
  );
}