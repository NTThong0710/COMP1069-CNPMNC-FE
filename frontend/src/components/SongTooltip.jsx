import { useState, useEffect, useRef } from "react";
import { FaPlay, FaPlus, FaHeart, FaRegHeart } from "react-icons/fa";
import { Plus } from "lucide-react";
import { useQueue } from "../context/QueueContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AddToPlaylistModal from "./AddToPlaylistModal";

function SongTooltip({ song, position, onClose, onPlaySong }) {
  const { addToQueue } = useQueue();
  const { user, updateUser, triggerRefreshLikedSongs } = useAuth();
  const { addToast } = useToast();
  
  const tooltipRef = useRef(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState([]);

  // Check Like status
  useEffect(() => {
    if (user && song) {
        const currentId = song.id || song._id;
        
        const isSongLiked = user.likedSongs?.some((item) => {
            if (typeof item === "string") return item === currentId;
            return (
                item._id?.toString() === currentId.toString() || 
                item.spotifyId?.toString() === currentId.toString()
            );
        });
        
        setIsLiked(!!isSongLiked);
    } else {
        setIsLiked(false);
    }
  }, [song, user]);

  // ✅ LOGIC CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showPlaylistModal) return;
      if (tooltipRef.current && tooltipRef.current.contains(e.target)) return;
      if (e.target.closest('.add-playlist-modal-content') || e.target.closest('.modal-content')) return;
      
      onClose();
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, showPlaylistModal]); 

  // ✅ THÊM QUEUE -> ĐÓNG TOOLTIP
  const handleAddToQueue = (e) => {
    e.stopPropagation();
    const result = addToQueue(song);
    if (result.success) {
      addToast(`Added "${song.title}" to queue`, "success", 2000);
    } else {
      addToast(`"${song.title}" is already in queue`, "warning", 2000);
    }
    onClose(); // 👈 Thêm dòng này để đóng tooltip
  };

  // THÊM PLAYLIST -> KHÔNG ĐÓNG (Vì phải mở Modal)
  const handleAddToPlaylist = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      alert("Vui lòng đăng nhập để thêm vào playlist!");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/playlists/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUserPlaylists(data.playlists || []); 
        setShowPlaylistModal(true);
      } else {
        if (res.status === 401) {
            addToast("Phiên đăng nhập hết hạn", "error", 2000);
        } else {
            addToast("Không thể tải danh sách playlist", "error", 2000);
        }
      }
    } catch (error) {
      console.error("Lỗi fetch playlist:", error);
      addToast("Lỗi kết nối server", "error", 2000);
    }
    // Không gọi onClose() ở đây để giữ Tooltip hiện cho đến khi Modal đóng
  };

  // ✅ LIKE/UNLIKE -> KHÔNG ĐÓNG (Để người dùng thấy tim đổi màu)
  // (Hoặc nếu bạn muốn đóng thì thêm onClose() vào cuối)
  const handleToggleLike = async (e) => {
    e.stopPropagation();
    if (!user) return alert("Vui lòng đăng nhập để thích bài hát!");
    
    const newStatus = !isLiked;
    setIsLiked(newStatus); // Update UI ngay lập tức
    
    try {
      const token = localStorage.getItem("accessToken");
      const songId = song.id || song._id;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/songs/${songId}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        const updatedUser = { ...user, likedSongs: data.likedSongs };
        updateUser(updatedUser);
        triggerRefreshLikedSongs();
      } else {
        setIsLiked(!newStatus); // Revert nếu lỗi
      }
    } catch (error) {
      console.error("Like toggle failed:", error);
      setIsLiked(!newStatus);
    }
    // onClose(); // 👈 Uncomment dòng này nếu muốn đóng luôn sau khi Like
  };

  const handlePlaySong = (e) => {
    e.stopPropagation();
    if (onPlaySong) {
      onPlaySong();
      onClose(); // Đã có sẵn
    }
  };

  const getTooltipPosition = () => {
    const tooltipWidth = 320; 
    const tooltipHeight = 350; 
    let x = position.x;
    let y = position.y;
    const viewportWidth = window.innerWidth + window.scrollX;
    const viewportHeight = window.innerHeight + window.scrollY;

    if (x + tooltipWidth > viewportWidth) x = x - tooltipWidth - 10;
    if (y + tooltipHeight > viewportHeight) y = y - tooltipHeight - 10;

    return { left: `${x}px`, top: `${y}px` };
  };

  const tooltipPosition = getTooltipPosition();

  return (
    <>
      <div
        ref={tooltipRef}
        className="absolute bg-[#282828] rounded-2xl shadow-2xl z-[9999] overflow-hidden border border-neutral-700 w-80 animate-in fade-in zoom-in-95 duration-200"
        style={tooltipPosition}
      >
        <div className="relative group">
          <img
            src={song.image || song.albumImage || "/placeholder.jpg"}
            alt={song.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <button
              onClick={handlePlaySong}
              title="Play song"
              className="bg-green-500 hover:bg-green-400 text-black p-4 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-200"
            >
              <FaPlay size={24} className="ml-1" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-white text-lg truncate">{song.title}</h3>
          <p className="text-sm text-neutral-400 truncate mb-4">
            {song.artist}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToQueue}
              title="Add to Queue"
              className="flex-1 flex items-center justify-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white py-2 rounded-lg transition"
            >
              <Plus size={16} />
              <span className="text-sm font-medium">Queue</span>
            </button>

            <button
              onClick={handleAddToPlaylist}
              title="Add to Playlist"
              className="flex-1 flex items-center justify-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white py-2 rounded-lg transition"
            >
              <FaPlus size={14} />
              <span className="text-sm font-medium">Playlist</span>
            </button>

            <button
              onClick={handleToggleLike}
              title={isLiked ? "Unlike" : "Like"}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition ${
                isLiked
                  ? "bg-green-500 text-black hover:bg-green-400"
                  : "bg-neutral-700 text-white hover:bg-neutral-600"
              }`}
            >
              {isLiked ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
            </button>
          </div>
        </div>
      </div>

      {showPlaylistModal && (
        <AddToPlaylistModal
          isOpen={showPlaylistModal}
          song={song}
          userPlaylists={userPlaylists}
          onClose={() => {
            setShowPlaylistModal(false);
            onClose(); // ✅ Đóng tooltip sau khi xong việc với Modal
          }}
        />
      )}
    </>
  );
}

export default SongTooltip;