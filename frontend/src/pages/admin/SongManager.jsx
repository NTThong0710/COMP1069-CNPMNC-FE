import React, { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Search, Loader2, X, ChevronLeft, ChevronRight, Music, Play, Pause, Filter, RefreshCw, AlertTriangle, Save, Calendar, BarChart2, Star } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function SongManager() {
  const { addToast } = useToast();

  // === STATE CŨ (Giữ nguyên) ===
  const [activeTab, setActiveTab] = useState("all"); 
  const [loading, setLoading] = useState(false);
  
  // State Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [filterArtist, setFilterArtist] = useState("");

  // Data States
  const [allSongs, setAllSongs] = useState([]);
  const [mostPlayedSongs, setMostPlayedSongs] = useState([]);
  const [newReleaseSongs, setNewReleaseSongs] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dropdown Data
  const [artistsList, setArtistsList] = useState([]);
  const [albumsList, setAlbumsList] = useState([]);

  // Modal Create/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  
  // Modal Delete
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: "" });

  // Form Data
  const [formData, setFormData] = useState({
      title: "", genre: "", cover: "", url: "", duration: 0, lyric: "", artist: "", album: ""
  });

  // State Audio Preview
  const [previewSong, setPreviewSong] = useState(null);
  const audioRef = useRef(null);

  // === 1. FETCHING LOGIC ===
  const fetchAllSongs = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}/songs?page=${currentPage}&limit=10`);
      const data = await res.json();
      setAllSongs(data.songs || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const fetchSpecialLists = async () => {
      try {
          fetch(`${BASE_API_URL}/songs/most-played?limit=10`).then(res => res.json()).then(data => setMostPlayedSongs(data.songs || []));
          fetch(`${BASE_API_URL}/songs/new-release?limit=10`).then(res => res.json()).then(data => setNewReleaseSongs(data.songs || []));
          fetch(`${BASE_API_URL}/songs/top?limit=10`).then(res => res.json()).then(data => setTopSongs(Array.isArray(data) ? data : (data.songs || [])));
      } catch (e) { console.error("Special fetch error", e); }
  };

  const fetchDropdownData = async () => {
    try {
        const [resArt, resAlb] = await Promise.all([
            fetch(`${BASE_API_URL}/artists?limit=100`).then(r => r.json()),
            fetch(`${BASE_API_URL}/albums?limit=100`).then(r => r.json())
        ]);
        setArtistsList(resArt.data || []);
        setAlbumsList(resAlb.data || resAlb.albums || []); 
    } catch (e) {}
  };

  useEffect(() => {
    if (activeTab === "all") fetchAllSongs(page);
    else fetchSpecialLists(); 
    fetchDropdownData();
    
    // Reset player khi chuyển tab
    setPreviewSong(null);
    if(audioRef.current) audioRef.current.pause();
  }, [page, activeTab]);

  // === 2. AUDIO PREVIEW LOGIC (ĐÃ FIX) ===
  const togglePreview = (song) => {
    // Nếu không có URL thì báo lỗi nhẹ hoặc return
    if (!song.url) {
        addToast("Bài hát chưa có file audio", "error");
        return;
    }

    if (previewSong?._id === song._id) {
       // Đang play bài này -> Pause
       audioRef.current.pause();
       setPreviewSong(null);
    } else {
       // Play bài mới
       setPreviewSong(song);
       if(audioRef.current) {
           audioRef.current.src = song.url;
           audioRef.current.load(); // Bắt buộc load lại source
           
           // Xử lý Promise play để tránh lỗi trình duyệt chặn Autoplay
           const playPromise = audioRef.current.play();
           if (playPromise !== undefined) {
               playPromise
                 .then(() => { /* Play thành công */ })
                 .catch(error => {
                    console.error("Lỗi phát nhạc:", error);
                    setPreviewSong(null); // Reset icon nếu lỗi
                 });
           }
       }
    }
  };

  // === 3. HANDLERS (Create/Edit/Delete) ===
  const handleOpenCreate = () => {
      setEditingSong(null);
      setFormData({ title: "", genre: "", cover: "", url: "", duration: 0, lyric: "", artist: "", album: "" });
      setIsModalOpen(true);
  };

  const handleOpenEdit = (song) => {
      setEditingSong(song);
      setFormData({
          title: song.title,
          genre: Array.isArray(song.genre) ? song.genre.join(", ") : song.genre,
          cover: song.cover,
          url: song.url,
          duration: song.duration,
          lyric: song.lyric || "",
          artist: typeof song.artist === 'object' ? song.artist._id : song.artist,
          album: typeof song.album === 'object' ? song.album._id : song.album
      });
      setIsModalOpen(true);
  };

  const handleOpenDelete = (song) => {
      setDeleteModal({ isOpen: true, id: song._id, title: song.title });
  };

  const confirmDelete = async () => {
      const id = deleteModal.id;
      if (!id) return;
      try {
          const token = localStorage.getItem("accessToken");
          const res = await fetch(`${BASE_API_URL}/songs/${id}`, { 
              method: 'DELETE', 
              headers: { "Authorization": `Bearer ${token}` } 
          });
          
          if (res.ok) {
              addToast("Đã xóa bài hát thành công", "success");
              if (activeTab === "all") fetchAllSongs(page);
              else fetchSpecialLists();
          } else {
              addToast("Xóa bài hát thất bại", "error");
          }
      } catch (e) { 
          addToast("Lỗi kết nối server", "error");
      } finally {
          setDeleteModal({ isOpen: false, id: null, title: "" });
      }
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const token = localStorage.getItem("accessToken");
          const payload = { ...formData, duration: Number(formData.duration) };
          
          let url = `${BASE_API_URL}/songs`;
          let method = "POST";

          if (editingSong) {
              url = `${BASE_API_URL}/songs/${editingSong._id}`;
              method = "PUT";
          }
          
          const res = await fetch(url, {
              method: method,
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
              body: JSON.stringify(payload)
          });
          
          if(res.ok) {
              addToast(editingSong ? "Cập nhật thành công!" : "Tạo bài hát thành công!", "success");
              setIsModalOpen(false);
              if (activeTab === "all") fetchAllSongs(page);
              else fetchSpecialLists();
              setFormData({ title: "", genre: "", cover: "", url: "", duration: 0, lyric: "", artist: "", album: "" });
              setEditingSong(null);
          } else {
              addToast("Thao tác thất bại", "error");
          }
      } catch (e) { 
          console.error(e);
          addToast("Lỗi kết nối server", "error");
      }
  };

  // === 4. LOGIC LỌC DỮ LIỆU (ĐÃ FIX: Dùng includes thay vì ===) ===
  const getFilteredSongs = () => {
      let data = allSongs;
      
      // Filter Search
      if (searchTerm) {
          data = data.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      
      // Filter Genre (Fix lỗi so sánh chuỗi)
      if (filterGenre) {
          data = data.filter(s => {
              // Nếu genre là mảng
              if (Array.isArray(s.genre)) {
                  return s.genre.some(g => g.toLowerCase().includes(filterGenre.toLowerCase()));
              }
              // Nếu genre là chuỗi (ví dụ "Pop, Rock") -> Dùng includes để tìm "Pop"
              return s.genre?.toLowerCase().includes(filterGenre.toLowerCase());
          });
      }
      
      // Filter Artist
      if (filterArtist) {
          data = data.filter(s => {
              const aId = typeof s.artist === 'object' ? s.artist._id : s.artist;
              return aId === filterArtist;
          });
      }
      
      return data;
  };

  // === 5. RENDER TABLE ===
  const renderTable = (dataList, showExtraInfo) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs text-zinc-200 uppercase bg-zinc-900 border-b border-zinc-800">
                <tr>
                    <th className="px-6 py-3 w-12">#</th>
                    <th className="px-6 py-3">Track</th>
                    <th className="px-6 py-3">Artist</th>
                    {showExtraInfo === 'views' && <th className="px-6 py-3">Plays</th>}
                    {showExtraInfo === 'date' && <th className="px-6 py-3">Added Date</th>}
                    <th className="px-6 py-3">Album</th>
                    <th className="px-6 py-3 text-center">Preview</th>
                    <th className="px-6 py-3 text-right">Action</th>
                </tr>
            </thead>
            <tbody>
                {loading && activeTab === 'all' ? (
                     <tr><td colSpan="8" className="px-6 py-8 text-center"><Loader2 className="animate-spin inline mr-2"/> Loading...</td></tr>
                ) : dataList.length > 0 ? (
                    dataList.map((song, index) => (
                        <tr key={song._id} className="border-b border-zinc-800/50 hover:bg-zinc-900 transition group">
                            <td className="px-6 py-4">{(page - 1) * 10 + index + 1}</td>
                            
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10">
                                        <img src={song.cover || "https://placehold.co/40"} alt="" className="w-full h-full rounded object-cover bg-zinc-800"/>
                                        <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center rounded cursor-pointer" onClick={() => togglePreview(song)}>
                                            {previewSong?._id === song._id ? <Pause size={16} className="text-white"/> : <Play size={16} className="text-white"/>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-medium truncate max-w-[180px] ${previewSong?._id === song._id ? "text-green-500" : "text-white"}`}>{song.title}</span>
                                        <span className="text-xs text-zinc-500">{Array.isArray(song.genre) ? song.genre.join(", ") : song.genre}</span>
                                    </div>
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    {typeof song.artist === 'object' ? (
                                        <>
                                            <img src={song.artist.image || song.artist.avatar || "https://placehold.co/30"} alt="" className="w-6 h-6 rounded-full object-cover bg-zinc-800 border border-zinc-700"/>
                                            <span className="text-zinc-300 font-medium">{song.artist.name}</span>
                                        </>
                                    ) : <span className="text-zinc-500">Unknown</span>}
                                </div>
                            </td>
                            
                            {showExtraInfo === 'views' && <td className="px-6 py-4 text-green-500 font-bold">{song.playCount || 0}</td>}
                            {showExtraInfo === 'date' && <td className="px-6 py-4">{new Date(song.createdAt).toLocaleDateString()}</td>}

                            <td className="px-6 py-4">
                                {typeof song.album === 'object' ? (
                                    <div className="flex items-center gap-2">
                                        <img src={song.album.cover || "https://placehold.co/30"} alt="" className="w-6 h-6 rounded-md object-cover bg-zinc-800"/>
                                        <span className="truncate max-w-[150px] text-zinc-400">{song.album.title}</span>
                                    </div>
                                ) : <span className="text-zinc-600">-</span>}
                            </td>

                            <td className="px-6 py-4 text-center">
                                <button onClick={() => togglePreview(song)} className={`p-2 rounded-full transition ${previewSong?._id === song._id ? "bg-green-500 text-black shadow-lg shadow-green-500/20" : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"}`}>
                                    {previewSong?._id === song._id ? <Pause size={14} fill="currentColor"/> : <Play size={14} fill="currentColor"/>}
                                </button>
                            </td>
                            
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenEdit(song)} className="p-2 hover:bg-blue-500/10 rounded text-zinc-500 hover:text-blue-500 transition" title="Edit Song"><Pencil size={16}/></button>
                                    <button onClick={() => handleOpenDelete(song)} className="p-2 hover:bg-red-500/10 rounded text-zinc-500 hover:text-red-400 transition" title="Delete Song"><Trash2 size={16}/></button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan="8" className="px-6 py-8 text-center text-zinc-600">No data found matching filters.</td></tr>
                )}
            </tbody>
        </table>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <audio ref={audioRef} onEnded={() => setPreviewSong(null)} onError={() => { addToast("Lỗi tải file nhạc", "error"); setPreviewSong(null); }} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h1 className="text-3xl font-bold text-white">Songs Manager</h1><p className="text-zinc-400 text-sm mt-1">Manage & Preview your music database.</p></div>
        <button onClick={handleOpenCreate} className="bg-white text-black hover:bg-zinc-200 font-medium px-4 py-2 rounded-full flex items-center gap-2 transition shadow-lg"><Plus size={18} /> Add New Song</button>
      </div>

      <div className="flex border-b border-zinc-800 gap-6 overflow-x-auto">
          <button onClick={() => setActiveTab("all")} className={`pb-3 text-sm font-medium transition border-b-2 whitespace-nowrap ${activeTab === "all" ? "border-green-500 text-white" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}>All Songs</button>
          <button onClick={() => setActiveTab("most")} className={`pb-3 text-sm font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === "most" ? "border-green-500 text-white" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}><BarChart2 size={16}/> Most Played</button>
          <button onClick={() => setActiveTab("new")} className={`pb-3 text-sm font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === "new" ? "border-green-500 text-white" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}><Calendar size={16}/> New Releases</button>
          <button onClick={() => setActiveTab("top")} className={`pb-3 text-sm font-medium transition border-b-2 flex items-center gap-2 whitespace-nowrap ${activeTab === "top" ? "border-green-500 text-white" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}><Star size={16}/> Top Songs</button>
      </div>

      <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 shadow-xl">
         {activeTab === "all" && (
             <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input type="text" placeholder="Filter by song title..." className="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-green-500 text-sm transition" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>
                
                <div className="relative min-w-[160px]">
                     <select className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 py-2.5 px-3 rounded-lg appearance-none focus:border-green-500 outline-none text-sm cursor-pointer" value={filterArtist} onChange={(e) => setFilterArtist(e.target.value)}>
                         <option value="">All Artists</option>
                         {artistsList.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                     </select>
                     <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"/>
                </div>

                <div className="relative min-w-[140px]">
                     <select className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 py-2.5 px-3 rounded-lg appearance-none focus:border-green-500 outline-none text-sm cursor-pointer" value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)}>
                         <option value="">All Genres</option>
                         {["Pop", "Rock", "EDM", "Ballad", "Indie", "R&B", "Hip-hop", "Jazz"].map(g => <option key={g} value={g}>{g}</option>)}
                     </select>
                     <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"/>
                </div>

                {(searchTerm || filterGenre || filterArtist) && (
                    <button onClick={() => {setSearchTerm(""); setFilterGenre(""); setFilterArtist("");}} className="p-2.5 bg-zinc-800 rounded-lg hover:bg-zinc-700 text-zinc-400 transition" title="Reset Filters">
                        <RefreshCw size={18}/>
                    </button>
                )}
             </div>
         )}

         {activeTab === "all" && (
             <>
                {renderTable(getFilteredSongs(), null)}
                <div className="flex justify-end items-center gap-4 p-4 border-t border-zinc-800 bg-zinc-900/50">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-md bg-zinc-800 text-white disabled:opacity-50 hover:bg-zinc-700"><ChevronLeft size={18} /></button>
                    <span className="text-sm text-zinc-400">Page {page} of {totalPages}</span>
                    <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-md bg-zinc-800 text-white disabled:opacity-50 hover:bg-zinc-700"><ChevronRight size={18} /></button>
                </div>
             </>
         )}
         {activeTab === "most" && renderTable(mostPlayedSongs, 'views')}
         {activeTab === "new" && renderTable(newReleaseSongs, 'date')}
         {activeTab === "top" && renderTable(topSongs, null)}
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
              <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-2xl p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"><X/></button>
                  
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      {editingSong ? <Pencil className="text-blue-500"/> : <Music className="text-green-500"/>}
                      {editingSong ? "Edit Song" : "Add New Song"}
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div><label className="text-xs font-bold text-zinc-400 mb-2 block">Title *</label><input required className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-green-500 outline-none transition" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                          <div><label className="text-xs font-bold text-zinc-400 mb-2 block">Genre</label><input className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-green-500 outline-none transition" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} /></div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div><label className="text-xs font-bold text-zinc-400 mb-2 block">Artist</label><select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-green-500 outline-none transition" value={formData.artist} onChange={e => setFormData({...formData, artist: e.target.value})}><option value="">Select Artist</option>{artistsList.map(a => <option key={a._id || a.id} value={a._id || a.id}>{a.name}</option>)}</select></div>
                          <div><label className="text-xs font-bold text-zinc-400 mb-2 block">Album</label><select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-green-500 outline-none transition" value={formData.album} onChange={e => setFormData({...formData, album: e.target.value})}><option value="">Select Album</option>{albumsList.map(a => <option key={a._id} value={a._id}>{a.title}</option>)}</select></div>
                      </div>

                      <div><label className="text-xs font-bold text-zinc-400 mb-2 block">Audio URL (MP3) *</label><input required placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-green-500 outline-none transition" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} /></div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div><label className="text-xs font-bold text-zinc-400 mb-2 block">Cover Image URL</label><input placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-green-500 outline-none transition" value={formData.cover} onChange={e => setFormData({...formData, cover: e.target.value})} /></div>
                        <div><label className="text-xs font-bold text-zinc-400 mb-2 block">Duration (s)</label><input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-green-500 outline-none transition" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} /></div>
                      </div>
                      
                      <div><label className="text-xs font-bold text-zinc-400 mb-2 block">Lyrics</label><textarea rows={4} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-green-500 outline-none transition custom-scrollbar" value={formData.lyric} onChange={e => setFormData({...formData, lyric: e.target.value})} /></div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 mt-6">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg text-zinc-400 hover:text-white font-medium hover:bg-zinc-900 transition">Cancel</button>
                          <button type="submit" className={`px-6 py-2.5 rounded-full font-bold text-white shadow-lg transition transform hover:scale-105 flex items-center gap-2 ${editingSong ? "bg-blue-600 hover:bg-blue-500" : "bg-green-600 hover:bg-green-500 text-black"}`}>
                              <Save size={18}/> {editingSong ? "Save Changes" : "Create Song"}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
            <div className="w-full max-w-sm bg-[#18181b] border border-zinc-800 rounded-2xl p-6 text-center shadow-2xl">
                <div className="flex justify-center mb-4"><div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center"><AlertTriangle className="text-red-500 w-6 h-6" /></div></div>
                <h3 className="text-xl font-bold text-white mb-2">Delete Song?</h3>
                <p className="text-zinc-400 mb-6 text-sm">Are you sure you want to delete <br/><span className="text-white font-bold">"{deleteModal.title}"</span>?<br/>This action cannot be undone.</p>
                <div className="flex gap-3 justify-center">
                    <button onClick={() => setDeleteModal({ isOpen: false, id: null, title: "" })} className="px-6 py-2.5 rounded-full font-bold text-white text-sm border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 transition min-w-[100px]">Cancel</button>
                    <button onClick={confirmDelete} className="px-6 py-2.5 rounded-full font-bold text-white text-sm bg-red-600 hover:bg-red-500 transition shadow-lg shadow-red-900/20 min-w-[100px]">Delete</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}