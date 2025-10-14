// src/components/SongActionsMenu.jsx
import { 
  FaPlus, FaRegHeart, FaList, FaBan, FaShare, FaDesktop 
} from 'react-icons/fa';

// Các mục trong menu
const menuItems = [
  { icon: <FaPlus />, label: 'Add to playlist' },
  { icon: <FaRegHeart />, label: 'Save to your Liked Songs' },
  { icon: <FaList />, label: 'Add to queue' },
  { icon: <FaBan />, label: 'Exclude from your taste profile' },
  // Divider
  { isDivider: true },
  { icon: <FaShare />, label: 'Share' },
  { icon: <FaDesktop />, label: 'Open in Desktop app' },
];

export default function SongActionsMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Ngăn sự kiện click lan ra ngoài, tránh việc menu tự đóng ngay khi mở
  const handleMenuClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      onClick={handleMenuClick}
      className="
        absolute top-full right-0 mt-2 w-56 
        bg-[#282828] text-white rounded-md shadow-lg 
        z-10 overflow-hidden
      "
    >
      <ul>
        {menuItems.map((item, index) => {
          if (item.isDivider) {
            return <li key={index} className="h-[1px] bg-neutral-700 my-1"></li>;
          }
          return (
            <li key={index}>
              <button 
                // Khi click vào một mục, ta sẽ đóng menu lại
                onClick={() => {
                  console.log(`Clicked: ${item.label}`);
                  onClose();
                }}
                className="
                  w-full text-left px-3 py-2 text-sm flex items-center gap-3
                  hover:bg-[#3e3e3e] transition-colors duration-200
                "
              >
                <div className="text-neutral-400">{item.icon}</div>
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}