import { FaPlay } from "react-icons/fa";
import { Link } from 'react-router-dom'; // Import Link

// Component nhận thêm prop 'id'
function AlbumCard({ id, image, title, artist }) {
  return (
    // Bọc toàn bộ card trong component Link
    <Link to={`/album/${id}`}>
      <div className="group relative bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 cursor-pointer shadow-lg">
        <div className="relative mb-4">
          <img 
            src={image} 
            alt={title} 
            className="w-full aspect-square object-cover rounded-md shadow-lg" 
          />
          
          <button 
            className="
              absolute bottom-2 right-2 bg-green-500 p-4 rounded-full shadow-xl flex 
              items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 
              group-hover:translate-y-0 transition-all duration-300 hover:scale-110
            "
          >
            <FaPlay className="text-black" />
          </button>
        </div>

        <h3 className="font-bold text-white truncate">{title}</h3>
        <p className="text-sm text-neutral-400 mt-1 truncate">{artist}</p>
      </div>
    </Link>
  );
}

export default AlbumCard;