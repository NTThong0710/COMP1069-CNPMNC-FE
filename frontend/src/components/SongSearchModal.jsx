import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Play, Music, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Đảm bảo URL API chuẩn
const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function SongSearchModal({ onClose, onSelectSong }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(true); // ✅ State mặc định bật AI
  const inputRef = useRef(null);

  // Auto focus
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // --- LOGIC TÌM KIẾM (AI + THƯỜNG) ---
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        let songs = [];

        if (useAI) {
          // 🧠 CASE 1: Dùng AI (Semantic Search)
          const res = await fetch(`${BASE_API_URL}/songs/semantic-search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: query, limit: 10 }),
          });
          
          if (res.ok) {
            const data = await res.json();
            // Semantic API thường trả về mảng kết quả trong `results`
            songs = data.results || [];
          }
        } else {
          // 🔎 CASE 2: Tìm kiếm thường (Keyword)
          const res = await fetch(
            `${BASE_API_URL}/search?q=${encodeURIComponent(query)}&type=song&limit=10`
          );
          
          if (res.ok) {
            const data = await res.json();
            // API Search thường trả về cấu trúc lồng nhau
            songs = data.results?.songs?.data || [];
          }
        }

        // Map dữ liệu cho đồng nhất giữa 2 API
        const mappedSongs = songs.map((song) => ({
          id: song._id,
          title: song.title,
          artist: song.artist?.name || "Unknown",
          image: song.cover || null, // Backend trả về cover
          url: song.url,
          duration: song.duration,
          score: song.score // AI sẽ có điểm score
        }));

        setResults(mappedSongs);

      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 500); // Debounce 0.5s

    return () => clearTimeout(timer);
  }, [query, useAI]); // Chạy lại khi query hoặc chế độ AI thay đổi

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" 
      onClick={onClose}
    >
      <div 
        className="bg-[#1e1e1e] w-full max-w-xl rounded-xl shadow-2xl border border-neutral-700 overflow-hidden flex flex-col max-h-[70vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* Header Search */}
        <div className="p-4 border-b border-neutral-700 flex items-center gap-3 bg-[#252525]">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-white transition-colors" size={20} />
            
            <input 
              ref={inputRef}
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={useAI ? "Ask AI about music... " : "Nhập tên bài hát, nghệ sĩ..."} 
              className="w-full bg-[#121212] text-white pl-10 pr-20 py-3 rounded-full outline-none focus:ring-2 focus:ring-green-500 placeholder-neutral-500 transition-all border border-transparent focus:border-green-500/50"
            />

            {/* Cụm nút bên phải input */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {/* Nút Xóa */}
              {query && (
                <button onClick={() => setQuery("")} className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition">
                  <X size={16} />
                </button>
              )}

              {/* ✅ Nút Toggle AI */}
              <button
                type="button"
                onClick={() => setUseAI(!useAI)}
                className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
                  useAI
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105"
                    : "bg-neutral-700 text-neutral-400 hover:text-white"
                }`}
                title={useAI ? "Tắt AI Search" : "Bật AI Search"}
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-full transition font-medium"
          >
            Đóng
          </button>
        </div>

        {/* Danh sách kết quả */}
        <div className="flex-1 overflow-y-auto p-2 bg-[#121212] min-h-[300px]">
          {/* Header kết quả */}
          {results.length > 0 && (
             <div className="px-2 py-2 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                   {useAI ? "Gợi ý bởi AI" : "Kết quả tìm kiếm"}
                </span>
                {useAI && (
                   <span className="text-[10px] bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 flex items-center gap-1">
                      <Sparkles size={10} /> Semantic Search
                   </span>
                )}
             </div>
          )}

          {loading ? (
             <div className="flex flex-col items-center justify-center h-40 text-neutral-500 gap-3 animate-pulse">
                <Sparkles className={`w-8 h-8 ${useAI ? 'text-purple-500' : 'text-neutral-600'}`} />
                <span className="text-sm">Đang tìm kiếm...</span>
             </div>
          ) : results.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-60 text-neutral-500 gap-3">
                {query ? (
                  <>
                    <Music size={40} className="opacity-20" />
                    <p>Không tìm thấy bài hát nào.</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-2">
                       <Sparkles size={32} className="text-purple-500" />
                    </div>
                    <p className="text-white font-medium">Bắt đầu tìm kiếm</p>
                    <p className="text-xs max-w-xs text-center leading-relaxed">
                       {useAI 
                         ? "Gõ cảm xúc, lời bài hát hoặc mô tả giai điệu. AI sẽ tìm bài phù hợp nhất cho bạn." 
                         : "Nhập chính xác tên bài hát hoặc nghệ sĩ bạn muốn tìm."}
                    </p>
                  </>
                )}
             </div>
          ) : (
             <div className="space-y-1">
                {results.map((song) => (
                   <div 
                     key={song.id} 
                     onClick={() => onSelectSong(song)}
                     className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer group transition-colors border border-transparent hover:border-white/5"
                   >
                      {/* Ảnh */}
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-neutral-800 shadow-sm">
                         {song.image ? (
                           <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center"><Music size={20} className="text-neutral-500"/></div>
                         )}
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play size={20} className="text-white fill-current" />
                         </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                         <h4 className="text-white font-medium truncate text-sm group-hover:text-green-400 transition-colors">
                           {song.title}
                         </h4>
                         <p className="text-neutral-400 text-xs truncate flex items-center gap-1">
                           {song.artist}
                           {/* Nếu là AI search thì hiện thêm độ khớp nếu muốn */}
                           {useAI && song.score && (
                              <span className="text-[9px] bg-neutral-700 px-1 rounded text-neutral-300">
                                {Math.round(song.score * 100)}% match
                              </span>
                           )}
                         </p>
                      </div>

                      {/* Add Button */}
                      <button className="opacity-0 group-hover:opacity-100 px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-full transition-all shadow-lg transform translate-x-2 group-hover:translate-x-0">
                         Phát
                      </button>
                   </div>
                ))}
             </div>
          )}
        </div>

      </div>
    </div>
  );
}