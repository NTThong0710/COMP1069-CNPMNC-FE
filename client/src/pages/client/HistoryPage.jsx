import React, { useState, useEffect } from "react";
import { FaRegClock, FaPlay, FaTrash } from "react-icons/fa";
import { History } from "lucide-react"; 
import { useAuth } from "../../context/AuthContext"; 

const BASE_API_URL = import.meta.env.VITE_API_URL;

// Hàm format thời gian (giây -> mm:ss)
const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

// Hàm format ngày giờ
const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

export default function HistoryPage({ onSongSelect }) {
  const { user } = useAuth(); 
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
      setLoading(true);
      
      // Nếu chưa login hoặc không có user ID thì dừng
      if (!user || (!user._id && !user.id)) {
          setLoading(false);
          return;
      }
      
      const userId = user._id || user.id;
      const token = localStorage.getItem("accessToken");

      try {
          const res = await fetch(`${BASE_API_URL}/history/${userId}`, {
              headers: { "Authorization": `Bearer ${token}` }
          });
          const json = await res.json();
          
          if (json.success) {
              // ✅ LOGIC MỚI: LỌC TRÙNG LẶP (DEDUPLICATE)
              const uniqueMap = new Map(); // Dùng Map để lưu bài hát độc nhất

              json.data.forEach(item => {
                  // 1. Bỏ qua nếu bài hát gốc đã bị xóa
                  if (!item.song) return;

                  const songId = item.song._id;

                  // 2. Kiểm tra xem bài này đã có trong danh sách chưa?
                  // Vì API trả về sắp xếp Mới -> Cũ, nên lần gặp đầu tiên chính là lần nghe gần nhất.
                  if (!uniqueMap.has(songId)) {
                      
                      // Logic Map dữ liệu (Giữ nguyên như cũ)
                      const artistObj = typeof item.song.artist === 'object' ? item.song.artist : null;
                      const artistName = artistObj ? artistObj.name : "Unknown Artist";
                      const artistId = artistObj ? (artistObj.artist_id || artistObj._id) : null;
                      const albumTitle = typeof item.song.album === 'object' ? item.song.album?.title : (item.song.album || "Single");

                      const mappedItem = {
                          _id: item._id, 
                          playedAt: item.listen_at || item.createdAt,
                          
                          id: item.song._id,
                          title: item.song.title,
                          artist: artistName,
                          artistId: artistId,
                          
                          image: item.song.cover || "https://placehold.co/50x50/282828/white?text=Song",
                          url: item.song.url,
                          duration: formatDuration(item.song.duration),
                          album: albumTitle
                      };

                      // Lưu vào Map
                      uniqueMap.set(songId, mappedItem);
                  }
              });

              // 3. Chuyển Map thành Mảng để render
              setHistoryList(Array.from(uniqueMap.values()));
          }
      } catch (error) {
          console.error("Lỗi tải lịch sử:", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchHistory();
  }, [user]); // Chạy lại khi user thay đổi

  // === XÓA LỊCH SỬ ===
  const handleClearHistory = async () => {
      if (!confirm("Bạn có chắc muốn xóa toàn bộ lịch sử nghe nhạc?")) return;
      
      const userId = user._id || user.id;
      const token = localStorage.getItem("accessToken");

      try {
          await fetch(`${BASE_API_URL}/history/${userId}`, { 
              method: 'DELETE',
              headers: { "Authorization": `Bearer ${token}` }
          });
          setHistoryList([]); // Cập nhật UI ngay lập tức
      } catch (error) {
          console.error("Lỗi xóa lịch sử:", error);
      }
  };

  // === GIAO DIỆN ===
  if (!user) return <div className="min-h-screen flex items-center justify-center text-white text-lg">Vui lòng đăng nhập để xem lịch sử.</div>;
  if (loading) return <div className="min-h-screen p-8 text-white text-lg animate-pulse">Đang tải lịch sử...</div>;

  return (
    <div className="min-h-screen text-white">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-emerald-800 via-emerald-900 to-[#121212] p-8 flex items-end gap-6">
        <div className="w-52 h-52 bg-emerald-600 flex items-center justify-center rounded shadow-lg">
           <History size={80} className="text-white" />
        </div>

        <div className="flex-1">
          <p className="text-sm font-bold uppercase">Collection</p>
          <h1 className="text-5xl md:text-7xl font-black mt-2 mb-6">Recently Played</h1>
          <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">
                <span className="font-bold">{user.username || user.name}</span> • {historyList.length} songs
              </p>
              
              {historyList.length > 0 && (
                  <button 
                    onClick={handleClearHistory}
                    aria-label="Clear history"
                    className="text-sm font-bold text-neutral-400 hover:text-red-500 flex items-center gap-2 border border-neutral-600 px-4 py-2 rounded-full hover:border-red-500 transition"
                  >
                      <FaTrash size={14} /> Clear History
                  </button>
              )}
          </div>
        </div>
      </section>

      {/* List Section */}
      <section className="p-8 pt-4 bg-[#121212]">
        {/* Table Header */}
        <div className="grid grid-cols-[40px_4fr_3fr_3fr_auto] px-4 py-2 border-b border-neutral-800 text-sm text-gray-400 uppercase tracking-wider mb-4">
          <div className="text-center">#</div>
          <div>Title</div>
          <div>Album</div>
          <div>Date Played</div>
          <div className="flex justify-end"><FaRegClock /></div>
        </div>

        {/* Items List */}
        <div className="flex flex-col">
            {historyList.map((item, index) => (
                <div
                    key={item._id} 
                    onClick={() => onSongSelect(item, historyList, index)} // Bấm để phát nhạc
                    className="grid grid-cols-[40px_4fr_3fr_3fr_auto] items-center px-4 py-2 hover:bg-white/10 rounded-md group cursor-pointer transition-colors"
                >
                    <div className="text-neutral-400 text-center flex justify-center">
                        <span className="group-hover:hidden">{index + 1}</span>
                        <FaPlay size={12} className="hidden group-hover:block text-white mt-1" />
                    </div>

                    <div className="flex items-center gap-4 overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded" />
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-medium text-white truncate">{item.title}</span>
                            <span className="text-sm text-neutral-400 truncate group-hover:text-white transition-colors">
                                {item.artist}
                            </span>
                        </div>
                    </div>

                    <div className="text-neutral-400 truncate pr-4">{item.album}</div>
                    
                    <div className="text-neutral-400 text-sm truncate">{formatDate(item.playedAt)}</div>

                    <div className="text-neutral-400 text-sm text-right">{item.duration}</div>
                </div>
            ))}

            {historyList.length === 0 && (
                <div className="text-center text-neutral-500 py-16">
                    <History size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Bạn chưa nghe bài hát nào gần đây.</p>
                    <p className="text-sm mt-2">Hãy bắt đầu nghe nhạc để lưu lại lịch sử nhé!</p>
                </div>
            )}
        </div>
      </section>
    </div>
  );
}