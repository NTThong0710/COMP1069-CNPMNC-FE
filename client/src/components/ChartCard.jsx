import { FaPlay } from "react-icons/fa"; // Import icon

function ChartCard({ title, subtitle, description, bgColor }) {
  const bgStyle = {
    background: `linear-gradient(135deg, ${bgColor[0]} 0%, ${bgColor[1]} 100%)`,
  };

  return (
    // Thêm 'group' và 'relative' để làm "công tắc" và "khung" cho nút Play
    <div style={bgStyle} className="group relative p-4 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer h-full flex flex-col justify-between shadow-lg">
      <div>
        <h3 className="font-bold text-white text-2xl">{title}</h3>
        {subtitle && <p className="text-sm font-semibold text-neutral-200 mt-1 truncate">{subtitle}</p>}
      </div>
      <p className="text-xs text-neutral-300 mt-4">{description}</p>

      {/* Nút Play - Xuất hiện khi hover vào cả cái card */}
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

export default ChartCard;