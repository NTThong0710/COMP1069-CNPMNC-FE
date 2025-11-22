import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Loader2, X, ChevronLeft, ChevronRight, Disc, Calendar } from "lucide-react";

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function AlbumManager() {
  // === STATE ===
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dropdown Data
  const [artistsList, setArtistsList] = useState([]);

  // Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
      title: "",
      artist: "", // ID artist
      cover: "",
      release_date: "",
      genre: "Pop"
  });

  // === 1. FETCH DATA ===
  const fetchAlbums = async (currentPage = 1) => {
    setLoading(true);
    try {
      // API get albums có phân trang
      const res = await fetch(`${BASE_API_URL}/albums?page=${currentPage}&limit=10`);
      const data = await res.json();
      
      // Backend trả về { albums: [...], total, totalPages } hoặc { data: [...] } tùy controller
      // Dựa vào code cũ: res.json({ ... data: albums })
      if (data.data || data.albums) {
          setAlbums(data.data || data.albums || []);
          setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch albums", error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách Artist để bỏ vào dropdown chọn
  const fetchArtists = async () => {
      try {
          const res = await fetch(`${BASE_API_URL}/artists?limit=100`);
          const data = await res.json();
          setArtistsList(data.data || []);
      } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchAlbums(page);
    fetchArtists();
  }, [page]);

  // === 2. HANDLERS ===
  const handleDelete = async (id) => {
      if(!window.confirm("Are you sure you want to delete this album?")) return;
      try {
          const token = localStorage.getItem("accessToken");
          const res = await fetch(`${BASE_API_URL}/albums/${id}`, { 
              method: 'DELETE',
              headers: { "Authorization": `Bearer ${token}` } 
          });
          
          if (res.ok) fetchAlbums(page);
          else alert("Delete failed");
      } catch (e) { console.error(e); }
  };

  const handleCreate = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          const token = localStorage.getItem("accessToken");
          const res = await fetch(`${BASE_API_URL}/albums`, {
              method: "POST",
              headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify(formData)
          });

          if(res.ok) {
              alert("Album created successfully!");
              setIsModalOpen(false);
              fetchAlbums(1);
              // Reset Form
              setFormData({ title: "", artist: "", cover: "", release_date: "", genre: "Pop" });
          } else {
              alert("Failed to create album");
          }
      } catch (e) { 
          console.error(e); 
      } finally {
          setIsSubmitting(false);
      }
  };

  // Filter Client-side
  const filteredAlbums = albums.filter(a => 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof a.artist === 'object' ? a.artist?.name : "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
             <h1 className="text-3xl font-bold text-white">Album Manager</h1>
             <p className="text-zinc-400 text-sm mt-1">Organize music collections.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black hover:bg-zinc-200 font-medium px-4 py-2 rounded-md flex items-center gap-2 transition shadow-lg"
        >
            <Plus size={18} /> Add New Album
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input 
            type="text" 
            placeholder="Search album or artist..."
            className="w-full bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2.5 rounded-md focus:outline-none focus:border-zinc-600 transition text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-zinc-400">
                <thead className="text-xs text-zinc-200 uppercase bg-zinc-900 border-b border-zinc-800">
                    <tr>
                        <th className="px-6 py-3">#</th>
                        <th className="px-6 py-3">Album Info</th>
                        <th className="px-6 py-3">Artist</th>
                        <th className="px-6 py-3">Genre</th>
                        <th className="px-6 py-3">Release Date</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="6" className="px-6 py-8 text-center"><Loader2 className="animate-spin inline mr-2"/> Loading...</td></tr>
                    ) : filteredAlbums.length > 0 ? (
                        filteredAlbums.map((album, index) => (
                            <tr key={album._id || album.id} className="border-b border-zinc-800/50 hover:bg-zinc-900 transition">
                                <td className="px-6 py-4">{index + 1}</td>
                                
                                {/* Cột Album: Ảnh + Tên */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={album.cover || album.image || "https://placehold.co/40"} 
                                            alt="" 
                                            className="w-10 h-10 rounded-md object-cover bg-zinc-800 shadow-sm"
                                        />
                                        <span className="text-white font-medium truncate max-w-[200px]">{album.title || album.name}</span>
                                    </div>
                                </td>
                                
                                <td className="px-6 py-4 text-zinc-300">
                                    {typeof album.artist === 'object' ? album.artist?.name : "Unknown"}
                                </td>

                                <td className="px-6 py-4">
                                    {Array.isArray(album.genre) ? album.genre.join(", ") : (album.genre || "-")}
                                </td>

                                <td className="px-6 py-4">
                                    {album.release_date || album.releaseDate ? new Date(album.release_date || album.releaseDate).toLocaleDateString() : "-"}
                                </td>
                                
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 hover:bg-zinc-800 rounded-md text-blue-400 transition"><Pencil size={16}/></button>
                                        <button onClick={() => handleDelete(album._id || album.id)} className="p-2 hover:bg-zinc-800 rounded-md text-red-400 transition"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6" className="px-6 py-8 text-center text-zinc-600">No albums found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-4">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-md bg-zinc-900 text-white disabled:opacity-50 hover:bg-zinc-800"><ChevronLeft size={20} /></button>
          <span className="text-sm text-zinc-400">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-md bg-zinc-900 text-white disabled:opacity-50 hover:bg-zinc-800"><ChevronRight size={20} /></button>
      </div>

      {/* === MODAL ADD ALBUM === */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-xl p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X/></button>
                  
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Disc size={24} className="text-green-500"/> Add New Album
                  </h2>
                  
                  <form onSubmit={handleCreate} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-zinc-400 mb-1.5">Album Title *</label>
                          <input type="text" required className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none transition" 
                                 value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                      </div>
                      
                      <div>
                          <label className="block text-xs font-bold text-zinc-400 mb-1.5">Artist *</label>
                          <select required className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none transition"
                                  value={formData.artist} onChange={e => setFormData({...formData, artist: e.target.value})}>
                              <option value="">-- Select Artist --</option>
                              {artistsList.map(a => (
                                  <option key={a._id || a.id} value={a._id || a.id}>{a.name}</option>
                              ))}
                          </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1.5">Genre</label>
                            <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none" 
                                   value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-400 mb-1.5">Release Date</label>
                            <input type="date" className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none" 
                                   value={formData.release_date} onChange={e => setFormData({...formData, release_date: e.target.value})} />
                        </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-zinc-400 mb-1.5">Cover Image URL</label>
                          <input type="text" placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none" 
                                 value={formData.cover} onChange={e => setFormData({...formData, cover: e.target.value})} />
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold text-sm">Cancel</button>
                          <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-white text-black font-bold px-6 py-2 rounded-full hover:scale-105 transition disabled:opacity-50"
                          >
                              {isSubmitting ? "Creating..." : "Create Album"}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}