import { FaPlay } from "react-icons/fa"; // Nhớ import icon

function RadioCard({ image, title, artists, bgColor }) {
  const bgStyle = {
    background: `linear-gradient(135deg, ${bgColor[0]} 0%, ${bgColor[1]} 100%)`,
  };

  return (
    // Thêm 'group' vào đây. Thẻ này đã có 'relative' sẵn rồi, quá tuyệt!
    <div style={bgStyle} className="group p-4 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer relative overflow-hidden shadow-lg">
      <div className="absolute top-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded-full text-xs font-bold">RADIO</div>
      <img src={image} alt={title} className="w-24 h-24 rounded-full shadow-lg mx-auto mb-3 border-2 border-white/20" />
      <h3 className="font-bold text-white text-xl text-center truncate">{title}</h3>
      <p className="text-sm text-neutral-300 mt-1 text-center truncate">{artists}</p>

      {/* Nút Play - Đặt ở góc dưới bên phải của cả cái card */}
      <button 
        className="
          absolute 
          bottom-4 
          right-4 
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
  );
}

export default RadioCard;