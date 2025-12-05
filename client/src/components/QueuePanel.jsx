import React, { useState, useMemo } from "react";
import { Trash2, Play, Search, ChevronRight, Minus } from "lucide-react";

/**
 * QueuePanel - Component hiển thị danh sách queue với hình ảnh + nút play + search
 */
function QueuePanel({ queue, onRemoveFromQueue, onClearQueue, onPlayFromQueue, currentSong, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Filter queue dựa vào search query
  const filteredQueue = useMemo(() => {
    if (!searchQuery.trim()) return queue;
    const query = searchQuery.toLowerCase();
    return queue.filter(song => 
      song.title?.toLowerCase().includes(query) || 
      song.artist?.toLowerCase().includes(query)
    );
  }, [queue, searchQuery]);

  // Header when queue is empty
  if (queue.length === 0) {
    return (
      <div className="absolute bottom-full right-0 mb-2 w-96 bg-[#1a1a1a] rounded-xl shadow-2xl z-50 border border-neutral-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="bg-[#282828] p-4 border-b border-neutral-700 rounded-t-xl flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-lg">Queue</h3>
            <p className="text-xs text-neutral-400">No songs in queue</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClearQueue} title="Clear queue" className="text-neutral-400 hover:text-red-500 transition p-2 rounded-lg hover:bg-red-500/10">
              <Trash2 size={16} />
            </button>
            <button onClick={() => onClose && onClose()} title="Close" className="text-neutral-400 hover:text-white p-2 rounded-lg">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="p-6 text-center">
          <p className="text-neutral-400 text-sm">
            Add songs to queue by right-clicking on a song card or using the add to queue button.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-full right-0 mb-2 w-96 bg-[#1a1a1a] rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden border border-neutral-700 animate-in fade-in slide-in-from-bottom-2 duration-200 flex flex-col">
      {/* Header */}
      <div className="bg-[#282828] p-3 border-b border-neutral-700 rounded-t-xl flex items-center justify-between backdrop-blur-md bg-opacity-95">
        <div>
          <h3 className="font-bold text-white text-sm">Next in Queue</h3>
          <p className="text-xs text-neutral-400">{queue.length} song{queue.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(prev => !prev)} title="Minimize" className="text-neutral-400 hover:text-white p-2 rounded-lg">
            <Minus size={16} />
          </button>
          <button onClick={() => onClose && onClose()} title="Close" className="text-neutral-400 hover:text-white p-2 rounded-lg">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Minimized view (show small search + count) */}
      {isMinimized ? (
        <div className="p-3 bg-[#171717]">
          <div className="flex items-center gap-3">
            <Search size={14} className="text-neutral-400" />
            <input type="text" placeholder="Search songs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-white text-sm outline-none flex-1 placeholder-neutral-500" />
            <div className="text-sm text-neutral-400">{filteredQueue.length}</div>
          </div>
        </div>
      ) : (
        <>
          {/* Search Bar */}
          <div className="bg-[#282828] px-4 py-3 border-b border-neutral-700 backdrop-blur-md bg-opacity-95">
            <div className="flex items-center gap-2 bg-[#3e3e3e] px-3 py-2 rounded-lg">
              <Search size={14} className="text-neutral-400" />
              <input 
                type="text"
                placeholder="Search songs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white text-sm outline-none flex-1 placeholder-neutral-500"
              />
            </div>
          </div>

          {/* Queue List */}
          <ul className="overflow-y-auto p-2 space-y-2">
            {filteredQueue.length > 0 ? (
              filteredQueue.map((queueSong, idx) => (
                <li 
                  key={`${queueSong.id || queueSong._id}-${idx}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex items-center gap-3 p-2 rounded-lg transition ${hoveredIndex === idx ? 'bg-[#3e3e3e]/50' : ''}`}
                  title={`${queueSong.title} - ${queueSong.artist}`}
                >
                  {/* Album Thumbnail */}
                  <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-neutral-700">
                    <img 
                      src={queueSong.image || queueSong.albumImage || "https://via.placeholder.com/48x48?text=No+Image"} 
                      alt={queueSong.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Play Button Overlay */}
                    <button
                      onClick={() => onPlayFromQueue(idx)}
                      className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity ${hoveredIndex === idx ? 'opacity-100' : 'opacity-0'}`}
                      title={`Play ${queueSong.title}`}
                    >
                      <Play size={16} className="text-white fill-white" />
                    </button>
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate font-medium transition ${
                      currentSong?.id === queueSong.id || currentSong?._id === queueSong._id
                        ? 'text-green-400'
                        : 'text-white'
                    }`}>
                      {queueSong.title}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">
                      {queueSong.artist}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromQueue(idx);
                    }}
                    title="Remove from queue"
                    className={`flex-shrink-0 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition ${hoveredIndex === idx ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))
            ) : (
              <li className="text-center text-neutral-400 py-4">
                No songs found
              </li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}

export default QueuePanel;
