import React, { useState } from "react";
import { FaRegClock, FaPlay, FaTrash } from "react-icons/fa";
import { History } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOutletContext } from 'react-router-dom';
import { useHistory } from "../../hooks/useHistory";

const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

export default function HistoryPage() {
    const { handleSelectSong: onSongSelect } = useOutletContext();
    const { user } = useAuth();

    // Use TanStack Query Hook
    const { data: rawHistory = [], isLoading: loading, clearHistory } = useHistory();

    // Process History Data
    const historyList = React.useMemo(() => {
        const uniqueMap = new Map();

        rawHistory.forEach(item => {
            if (!item.song) return;
            const songId = item.song._id;

            if (!uniqueMap.has(songId)) {
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
                uniqueMap.set(songId, mappedItem);
            }
        });
        return Array.from(uniqueMap.values());
    }, [rawHistory]);

    const handleClearHistory = async () => {
        if (!confirm("Bạn có chắc muốn xóa toàn bộ lịch sử nghe nhạc?")) return;
        try {
            await clearHistory();
        } catch (error) {
            console.error("Lỗi xóa lịch sử:", error);
        }
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center text-white text-lg">Vui lòng đăng nhập để xem lịch sử.</div>;

    return (
        <div className="min-h-screen text-white animate-fade-in pb-4">
            {/* Header Section: Responsive Flex */}
            <section className="bg-gradient-to-b from-emerald-800 via-emerald-900 to-[#121212] p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                <div className="w-40 h-40 md:w-52 md:h-52 bg-emerald-600 flex items-center justify-center rounded shadow-lg flex-shrink-0">
                    <History size={60} className="text-white md:w-20 md:h-20" />
                </div>

                <div className="flex-1 w-full">
                    <p className="text-xs md:text-sm font-bold uppercase">Collection</p>
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-black mt-2 mb-4 md:mb-6 leading-tight">Recently Played</h1>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
            <section className="p-4 md:p-8 pt-4 bg-[#121212]">
                {/* Table Header: Ẩn cột Album và Date trên mobile */}
                <div className="grid grid-cols-[30px_1fr_auto] md:grid-cols-[40px_4fr_3fr_3fr_auto] px-4 py-2 border-b border-neutral-800 text-sm text-gray-400 uppercase tracking-wider mb-4">
                    <div className="text-center">#</div>
                    <div>Title</div>
                    <div className="hidden md:block">Album</div>
                    <div className="hidden md:block">Date Played</div>
                    <div className="flex justify-end"><FaRegClock /></div>
                </div>

                {/* Items List */}
                <div className="flex flex-col">
                    {historyList.map((item, index) => (
                        <div
                            key={item._id}
                            onClick={() => onSongSelect(item, historyList, index)}
                            className="grid grid-cols-[30px_1fr_auto] md:grid-cols-[40px_4fr_3fr_3fr_auto] items-center px-2 md:px-4 py-2 hover:bg-white/10 rounded-md group cursor-pointer transition-colors"
                        >
                            <div className="text-neutral-400 text-center flex justify-center">
                                <span className="group-hover:hidden text-sm">{index + 1}</span>
                                <FaPlay size={10} className="hidden group-hover:block text-white mt-1" />
                            </div>

                            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded flex-shrink-0" />
                                <div className="flex flex-col overflow-hidden min-w-0">
                                    <span className="font-medium text-white truncate text-sm md:text-base">{item.title}</span>
                                    <span className="text-xs md:text-sm text-neutral-400 truncate group-hover:text-white transition-colors">
                                        {item.artist}
                                    </span>
                                </div>
                            </div>

                            <div className="hidden md:block text-neutral-400 truncate pr-4 text-sm">{item.album}</div>

                            <div className="hidden md:block text-neutral-400 text-sm truncate">{formatDate(item.playedAt)}</div>

                            <div className="text-neutral-400 text-xs md:text-sm text-right font-variant-numeric tabular-nums">{item.duration}</div>
                        </div>
                    ))}

                    {historyList.length === 0 && (
                        <div className="text-center text-neutral-500 py-16">
                            <History size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Bạn chưa nghe bài hát nào gần đây.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
