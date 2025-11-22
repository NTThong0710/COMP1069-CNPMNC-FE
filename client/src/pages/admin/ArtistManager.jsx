import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Loader2, X, Mic2, Link as LinkIcon, Calendar } from "lucide-react";

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function ArtistManager() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [formData, setFormData] = useState({
      artist_id: "", // Jamendo ID
      name: "",
      bio: "",
      avatar: "",
      image: "", // Có thể dùng chung hoặc tách riêng
      website: "",
      joindate: ""
  });

  // === 1. FETCH DATA ===
  const fetchArtists = async () => {
    setLoading(true);
    try {
      // Gọi API lấy danh sách (Hiện tại API getAllArtists của bro trả về mix cả Jamendo)
      // Để quản lý admin, tốt nhất nên có param ?source=local để chỉ lấy DB
      // Nhưng tạm thời cứ gọi chung, ta sẽ filter ở client hoặc hiển thị hết
      const res = await fetch(`${BASE_API_URL}/artists?limit=50`);
      const data = await res.json();
      
      // API trả về: { success: true, data: [...] }
      setArtists(data.data || []);
    } catch (error) {
      console.error("Failed to fetch artists", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  // === 2. HANDLERS ===
  const handleDelete = async (id) => {
      if(!window.confirm("Are you sure you want to delete this artist?")) return;
      try {
          const token = localStorage.getItem("accessToken");
          await fetch(`${BASE_API_URL}/artists/${id}`, { 
              method: 'DELETE', headers: { "Authorization": `Bearer ${token}` } 
          });
          fetchArtists();
      } catch (e) { alert("Error deleting"); }
  };

  const handleEdit = (artist) => {
      setIsEditing(true);
      setCurrentId(artist.id || artist._id); // Lưu ý ID
      setFormData({
          artist_id: artist.artist_id || "",
          name: artist.name || "",
          bio: artist.bio || "",
          avatar: artist.avatar || artist.image || "",
          image: artist.image || "",
          website: artist.website || "",
          joindate: artist.joindate || ""
      });
      setIsModalOpen(true);
  };

  const handleCreateOrUpdate = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("accessToken");
      const url = isEditing 
          ? `${BASE_API_URL}/artists/${currentId}`
          : `${BASE_API_URL}/artists`;
      
      const method = isEditing ? "PUT" : "POST";

      try {
          const res = await fetch(url, {
              method,
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
              body: JSON.stringify(formData)
          });

          if(res.ok) {
              alert(isEditing ? "Artist updated!" : "Artist created!");
              setIsModalOpen(false);
              fetchArtists();
              // Reset form
              setFormData({ artist_id: "", name: "", bio: "", avatar: "", image: "", website: "", joindate: "" });
              setIsEditing(false);
          } else {
              const err = await res.json();
              alert("Failed: " + (err.message || "Unknown error"));
          }
      } catch (e) { console.error(e); }
  };

  // Client-side filter
  const filteredArtists = artists.filter(a => 
      a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
             <h1 className="text-3xl font-bold text-white">Artists Manager</h1>
             <p className="text-zinc-400 text-sm mt-1">Manage singers, bands, and creators.</p>
        </div>
        <button 
            onClick={() => { setIsEditing(false); setFormData({ artist_id: "", name: "", bio: "", avatar: "", image: "", website: "", joindate: "" }); setIsModalOpen(true); }}
            className="bg-white text-black hover:bg-zinc-200 font-medium px-4 py-2 rounded-md flex items-center gap-2 transition shadow-lg"
        >
            <Plus size={18} /> Add New Artist
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input 
            type="text" 
            placeholder="Search artist name..."
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
                        <th className="px-6 py-3">Artist</th>
                        <th className="px-6 py-3">Jamendo ID</th>
                        <th className="px-6 py-3">Join Date</th>
                        <th className="px-6 py-3">Source</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="6" className="px-6 py-8 text-center"><Loader2 className="animate-spin inline mr-2"/> Loading data...</td></tr>
                    ) : filteredArtists.length > 0 ? (
                        filteredArtists.map((artist, index) => (
                            <tr key={artist.id || artist._id} className="border-b border-zinc-800/50 hover:bg-zinc-900 transition">
                                <td className="px-6 py-4">{index + 1}</td>
                                
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={artist.avatar || artist.image || "https://placehold.co/40"} 
                                            alt="" 
                                            className="w-10 h-10 rounded-full object-cover bg-zinc-800"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium truncate max-w-[180px]">{artist.name}</span>
                                            {artist.website && <a href={artist.website} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1"><LinkIcon size={10}/> Website</a>}
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{artist.artist_id || "-"}</td>
                                
                                <td className="px-6 py-4">
                                    {artist.joindate ? new Date(artist.joindate).toLocaleDateString() : "-"}
                                </td>

                                <td className="px-6 py-4">
                                    {/* Hiển thị nguồn: Local hay Jamendo */}
                                    <span className={`text-xs px-2 py-1 rounded-full ${artist.source === 'local' ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                        {artist.source || 'local'}
                                    </span>
                                </td>
                                
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleEdit(artist)} className="p-2 hover:bg-zinc-800 rounded-md text-blue-400 transition"><Pencil size={16}/></button>
                                        <button onClick={() => handleDelete(artist.id || artist._id)} className="p-2 hover:bg-zinc-800 rounded-md text-red-400 transition"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6" className="px-6 py-8 text-center text-zinc-600">No artists found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Modal Add/Edit Artist */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-xl p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X/></button>
                  
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Mic2 size={24} className="text-green-500"/> {isEditing ? "Edit Artist" : "Add New Artist"}
                  </h2>
                  
                  <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-zinc-400 mb-1.5">Artist Name *</label>
                          <input type="text" required className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none transition" 
                                 value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      
                      <div>
                          <label className="block text-xs font-bold text-zinc-400 mb-1.5">Jamendo ID (Optional)</label>
                          <input type="text" placeholder="123456" className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none transition" 
                                 value={formData.artist_id} onChange={e => setFormData({...formData, artist_id: e.target.value})} />
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-zinc-400 mb-1.5">Avatar URL</label>
                          <input type="text" placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none transition" 
                                 value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} />
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-zinc-400 mb-1.5">Bio</label>
                          <textarea rows={3} className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none transition" 
                                 value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Website</label>
                              <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none transition" 
                                     value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-zinc-400 mb-1.5">Join Date</label>
                              <input type="date" className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none transition" 
                                     value={formData.joindate ? new Date(formData.joindate).toISOString().split('T')[0] : ""} 
                                     onChange={e => setFormData({...formData, joindate: e.target.value})} />
                          </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold text-sm">Cancel</button>
                          <button type="submit" className="bg-white text-black font-bold px-6 py-2 rounded-full hover:scale-105 transition">
                              {isEditing ? "Update Artist" : "Create Artist"}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}