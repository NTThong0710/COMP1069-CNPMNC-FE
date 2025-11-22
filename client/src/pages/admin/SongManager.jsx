import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Loader2, X, ChevronLeft, ChevronRight, Music, PlayCircle, Star, Calendar, BarChart2 } from "lucide-react";

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function SongManager() {
  // === STATE ===
  const [activeTab, setActiveTab] = useState("all"); 
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Data States
  const [allSongs, setAllSongs] = useState([]);
  const [mostPlayedSongs, setMostPlayedSongs] = useState([]);
  const [newReleaseSongs, setNewReleaseSongs] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artistsList, setArtistsList] = useState([]);
  const [albumsList, setAlbumsList] = useState([]);
  const [formData, setFormData] = useState({
      title: "", genre: "", cover: "", url: "", duration: 0, lyric: "", artist: "", album: ""
  });

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
        const resArtist = await fetch(`${BASE_API_URL}/artists?limit=100`);
        const dataArtist = await resArtist.json();
        setArtistsList(dataArtist.data || []);

        const resAlbum = await fetch(`${BASE_API_URL}/albums?limit=100`);
        const dataAlbum = await resAlbum.json();
        setAlbumsList(dataAlbum.data || dataAlbum.albums || []); 
    } catch (e) {}
  };

  useEffect(() => {
    if (activeTab === "all") fetchAllSongs(page);
    else fetchSpecialLists(); 
    fetchDropdownData();
  }, [page, activeTab]);

  // === 2. HANDLERS ===
  const handleDelete = async (id) => {
      if(!window.confirm("Are you sure?")) return;
      try {
          const token = localStorage.getItem("accessToken");
          await fetch(`${BASE_API_URL}/songs/${id}`, { 
              method: 'DELETE', headers: { "Authorization": `Bearer ${token}` } 
          });
          fetchAllSongs(page);
          fetchSpecialLists();
      } catch (e) { alert("Error deleting"); }
  };

  const handleCreate = async (e) => {
      e.preventDefault();
      try {
          const token = localStorage.getItem("accessToken");
          const payload = { ...formData, duration: Number(formData.duration) };
          const res = await fetch(`${BASE_API_URL}/songs`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
              body: JSON.stringify(payload)
          });
          if(res.ok) {
              alert("Song created!");
              setIsModalOpen(false);
              fetchAllSongs(1);
              fetchSpecialLists();
              setFormData({ title: "", genre: "", cover: "", url: "", duration: 0, lyric: "", artist: "", album: "" });
          } else {
              alert("Failed to create song");
          }
      } catch (e) { console.error(e); }
  };

  // === 3. RENDER TABLE ===
  const renderTable = (dataList, showExtraInfo) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs text-zinc-200 uppercase bg-zinc-900 border-b border-zinc-800">
                <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Track</th>
                    <th className="px-6 py-3">Artist</th>
                    {showExtraInfo === 'views' && <th className="px-6 py-3">Plays</th>}
                    {showExtraInfo === 'date' && <th className="px-6 py-3">Added Date</th>}
                    <th className="px-6 py-3">Album</th>
                    <th className="px-6 py-3 text-right">Action</th>
                </tr>
            </thead>
            <tbody>
                {loading && activeTab === 'all' ? (
                     <tr><td colSpan="6" className="px-6 py-8 text-center"><Loader2 className="animate-spin inline mr-2"/> Loading...</td></tr>
                ) : dataList.length > 0 ? (
                    dataList.map((song, index) => (
                        <tr key={song._id} className="border-b border-zinc-800/50 hover:bg-zinc-900 transition">
                            <td className="px-6 py-4">{index + 1}</td>
                            
                            {/* CỘT 1: SONG (Ảnh vuông + Tên) */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={song.cover || "https://placehold.co/40"} alt="" className="w-10 h-10 rounded object-cover bg-zinc-800"/>
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium truncate max-w-[180px]">{song.title}</span>
                                        <span className="text-xs text-zinc-500">{Array.isArray(song.genre) ? song.genre.join(", ") : song.genre}</span>
                                    </div>
                                </div>
                            </td>

                            {/* CỘT 2: ARTIST (Ảnh tròn + Tên) */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    {/* Check xem có object artist không */}
                                    {typeof song.artist === 'object' ? (
                                        <>
                                            <img 
                                                src={song.artist.image || song.artist.avatar || "https://placehold.co/30"} 
                                                alt="" 
                                                className="w-8 h-8 rounded-full object-cover bg-zinc-800 border border-zinc-700"
                                            />
                                            <span className="text-zinc-300 font-medium">{song.artist.name}</span>
                                        </>
                                    ) : (
                                        <span className="text-zinc-500">Unknown</span>
                                    )}
                                </div>
                            </td>
                            
                            {/* Cột phụ */}
                            {showExtraInfo === 'views' && <td className="px-6 py-4 text-green-500 font-bold">{song.playCount || 0}</td>}
                            {showExtraInfo === 'date' && <td className="px-6 py-4">{new Date(song.createdAt).toLocaleDateString()}</td>}

                            {/* CỘT 3: ALBUM (Ảnh vuông nhỏ + Tên) */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    {typeof song.album === 'object' ? (
                                        <>
                                            <img 
                                                src={song.album.cover || "https://placehold.co/30"} 
                                                alt="" 
                                                className="w-8 h-8 rounded-md object-cover bg-zinc-800"
                                            />
                                            <span className="truncate max-w-[150px] text-zinc-400">{song.album.title}</span>
                                        </>
                                    ) : (
                                        <span className="text-zinc-600">-</span>
                                    )}
                                </div>
                            </td>
                            
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => handleDelete(song._id)} className="p-2 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-red-400 transition"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan="6" className="px-6 py-8 text-center text-zinc-600">No data found.</td></tr>
                )}
            </tbody>
        </table>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Search & Tabs & Modal giữ nguyên như cũ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h1 className="text-3xl font-bold text-white">Songs Manager</h1><p className="text-zinc-400 text-sm mt-1">Manage your music database.</p></div>
        <button onClick={() => setIsModalOpen(true)} className="bg-white text-black hover:bg-zinc-200 font-medium px-4 py-2 rounded-md flex items-center gap-2 transition shadow-lg"><Plus size={18} /> Add New Song</button>
      </div>

      <div className="flex border-b border-zinc-800 gap-6">
          <button onClick={() => setActiveTab("all")} className={`pb-3 text-sm font-medium transition border-b-2 ${activeTab === "all" ? "border-green-500 text-white" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}>All Songs</button>
          <button onClick={() => setActiveTab("most")} className={`pb-3 text-sm font-medium transition border-b-2 flex items-center gap-2 ${activeTab === "most" ? "border-green-500 text-white" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}><BarChart2 size={16}/> Most Played</button>
          <button onClick={() => setActiveTab("new")} className={`pb-3 text-sm font-medium transition border-b-2 flex items-center gap-2 ${activeTab === "new" ? "border-green-500 text-white" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}><Calendar size={16}/> New Releases</button>
          <button onClick={() => setActiveTab("top")} className={`pb-3 text-sm font-medium transition border-b-2 flex items-center gap-2 ${activeTab === "top" ? "border-green-500 text-white" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}><Star size={16}/> Top Songs</button>
      </div>

      <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
         {activeTab === "all" && (
             <>
                <div className="p-4 border-b border-zinc-800">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input type="text" placeholder="Filter loaded songs..." className="w-full bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2 rounded-md focus:outline-none focus:border-zinc-600 text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    </div>
                </div>
                {renderTable(allSongs.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase())), null)}
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

      {/* Modal giữ nguyên */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-xl p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X/></button>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Music size={24} className="text-green-500"/> Add New Song</h2>
                  <form onSubmit={handleCreate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><label className="block text-xs font-bold text-zinc-400 mb-1.5">Title *</label><input type="text" required className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                          <div><label className="block text-xs font-bold text-zinc-400 mb-1.5">Genre</label><input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><label className="block text-xs font-bold text-zinc-400 mb-1.5">Artist</label><select className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none" value={formData.artist} onChange={e => setFormData({...formData, artist: e.target.value})}><option value="">-- Select Artist --</option>{artistsList.map(a => (<option key={a._id || a.id} value={a._id || a.id}>{a.name}</option>))}</select></div>
                          <div><label className="block text-xs font-bold text-zinc-400 mb-1.5">Album</label><select className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none" value={formData.album} onChange={e => setFormData({...formData, album: e.target.value})}><option value="">-- Select Album --</option>{albumsList.map(a => (<option key={a._id} value={a._id}>{a.title}</option>))}</select></div>
                      </div>
                      <div><label className="block text-xs font-bold text-zinc-400 mb-1.5">Audio URL (MP3) *</label><input type="text" required placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} /></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-zinc-400 mb-1.5">Cover Image URL</label><input type="text" placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none" value={formData.cover} onChange={e => setFormData({...formData, cover: e.target.value})} /></div>
                        <div><label className="block text-xs font-bold text-zinc-400 mb-1.5">Duration (s)</label><input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} /></div>
                      </div>
                      <div><label className="block text-xs font-bold text-zinc-400 mb-1.5">Lyrics</label><textarea rows={4} className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none" value={formData.lyric} onChange={e => setFormData({...formData, lyric: e.target.value})} /></div>
                      <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold text-sm">Cancel</button><button type="submit" className="bg-white text-black font-bold px-6 py-2 rounded-full hover:scale-105 transition">Create Song</button></div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}