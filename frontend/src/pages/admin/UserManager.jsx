import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
// Thêm ChevronRight vào dòng import này
import { Search, Loader2, Trash2, User, Shield, Eye, X, History, Heart, Disc, Music, ChevronLeft, ChevronRight } from "lucide-react";

const BASE_API_URL = import.meta.env.VITE_API_URL;

// === COMPONENT CON: SIDE PANEL CHI TIẾT USER ===
const UserDetailPanel = ({ userId, onClose }) => {
    const [activeTab, setActiveTab] = useState("history"); // 'history', 'likes', 'playlists'
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState({
        user: null,
        history: [],
        likes: []
    });

    const [selectedPlaylist, setSelectedPlaylist] = useState(null); 

    useEffect(() => {
        const fetchDetails = async () => {
            if (!userId) return;
            setLoading(true);
            const token = localStorage.getItem("accessToken");
            const headers = { "Authorization": `Bearer ${token}` };

            try {
                const [resUser, resHistory, resLikes] = await Promise.all([
                    fetch(`${BASE_API_URL}/users/${userId}`, { headers }),
                    fetch(`${BASE_API_URL}/history/${userId}`, { headers }),
                    fetch(`${BASE_API_URL}/users/${userId}/likes`, { headers })
                ]);

                const dataUser = await resUser.json();
                const dataHistory = await resHistory.json();
                const dataLikes = await resLikes.json();

                let userPlaylists = dataUser.user?.playlists || [];
                // Nếu playlist chỉ là array ID (chưa populate), gọi thêm API
                if (userPlaylists.length > 0 && typeof userPlaylists[0] === 'string') {
                     try {
                        const resPl = await fetch(`${BASE_API_URL}/users/${userId}/playlists`, { headers });
                        const dataPl = await resPl.json();
                        userPlaylists = dataPl.playlists || [];
                     } catch(e) { console.error(e); }
                }

                setDetails({
                    user: { ...dataUser.user, playlists: userPlaylists },
                    history: dataHistory.data || [],
                    likes: dataLikes.likeSongs || []
                });

            } catch (error) {
                console.error("Fetch details error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [userId]);

    const handlePlaylistClick = async (playlist) => {
        if (playlist.songs && playlist.songs.length > 0 && typeof playlist.songs[0] === 'object') {
            setSelectedPlaylist(playlist);
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${BASE_API_URL}/playlists/${playlist._id || playlist.id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            const fullPlaylist = data.data || data; 
            setSelectedPlaylist(fullPlaylist);
        } catch (e) {
            console.error("Lỗi lấy playlist", e);
        }
    };

    if (!userId) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-[450px] bg-zinc-900 border-l border-zinc-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col">
            
            {/* Header Panel */}
            <div className="p-6 border-b border-zinc-800 flex justify-between items-start bg-zinc-900 z-10">
                {selectedPlaylist ? (
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSelectedPlaylist(null)} className="p-1 hover:bg-zinc-800 rounded-full transition">
                            <ChevronLeft size={24} className="text-white"/>
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-white truncate max-w-[250px]">{selectedPlaylist.name}</h2>
                            <p className="text-xs text-zinc-400">Playlist • {selectedPlaylist.songs?.length || 0} songs</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                            {details.user?.avatar ? <img src={details.user.avatar} className="w-full h-full object-cover" alt=""/> : details.user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{details.user?.username}</h2>
                            <p className="text-xs text-zinc-400">{details.user?.email}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded mt-1 inline-block ${details.user?.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                {details.user?.role}
                            </span>
                        </div>
                    </div>
                )}
                <button onClick={onClose} aria-label="Close modal" className="text-zinc-400 hover:text-white"><X size={20}/></button>
            </div>

            {/* Content */}
            {selectedPlaylist ? (
                // VIEW: DANH SÁCH BÀI HÁT TRONG PLAYLIST
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {selectedPlaylist.songs && selectedPlaylist.songs.length > 0 ? (
                        selectedPlaylist.songs.map((song, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md transition border-b border-zinc-800/50 last:border-0">
                                <span className="text-zinc-500 w-6 text-center text-sm">{idx + 1}</span>
                                <img src={song.cover || song.image || "https://placehold.co/40"} className="w-10 h-10 rounded object-cover bg-zinc-800" alt=""/>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white truncate">{song.title}</p>
                                    <p className="text-xs text-zinc-500 truncate">{typeof song.artist === 'object' ? song.artist.name : "Unknown"}</p>
                                </div>
                                <div className="text-xs text-zinc-600">
                                    {song.duration ? Math.floor(song.duration / 60) + ':' + (song.duration % 60).toString().padStart(2, '0') : '--:--'}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-zinc-500 text-sm py-10">Playlist is empty.</p>
                    )}
                </div>
            ) : (
                // VIEW: TABS CHÍNH
                <>
                    <div className="flex border-b border-zinc-800">
                        <button onClick={() => setActiveTab("history")} className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${activeTab === "history" ? "border-green-500 text-white" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}>History</button>
                        <button onClick={() => setActiveTab("likes")} className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${activeTab === "likes" ? "border-green-500 text-white" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}>Likes</button>
                        <button onClick={() => setActiveTab("playlists")} className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${activeTab === "playlists" ? "border-green-500 text-white" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}>Playlists</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-zinc-500"/></div>
                        ) : (
                            <div className="space-y-2">
                                {/* HISTORY */}
                                {activeTab === "history" && (
                                    details.history.length > 0 ? details.history.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md transition">
                                            <img src={item.song?.cover || "https://placehold.co/40"} alt="" className="w-10 h-10 rounded object-cover bg-zinc-800"/>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white truncate">{item.song?.title || "Unknown"}</p>
                                                <p className="text-xs text-zinc-500 truncate">{new Date(item.listen_at || item.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )) : <p className="text-center text-zinc-500 text-sm py-4">No history found.</p>
                                )}

                                {/* LIKES */}
                                {activeTab === "likes" && (
                                    details.likes.length > 0 ? details.likes.map((song, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md transition">
                                            <img src={song.cover || "https://placehold.co/40"} className="w-10 h-10 rounded object-cover" alt=""/>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white truncate">{song.title}</p>
                                                <p className="text-xs text-zinc-500 truncate">{typeof song.artist === 'object' ? song.artist.name : "Unknown"}</p>
                                            </div>
                                            <Heart size={14} className="text-green-500 fill-current"/>
                                        </div>
                                    )) : <p className="text-center text-zinc-500 text-sm py-4">No liked songs.</p>
                                )}

                                {/* PLAYLISTS */}
                                {activeTab === "playlists" && (
                                    details.user?.playlists?.length > 0 ? details.user.playlists.map((pl, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => handlePlaylistClick(pl)}
                                            className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md transition cursor-pointer group"
                                        >
                                            <div className="w-10 h-10 bg-zinc-700 rounded flex items-center justify-center text-zinc-400 group-hover:text-white"><Disc size={18}/></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white truncate group-hover:text-green-400 transition-colors">{pl.name}</p>
                                                <p className="text-xs text-zinc-500 truncate">{pl.songs?.length || 0} songs • {pl.isPublic ? "Public" : "Private"}</p>
                                            </div>
                                            <ChevronRight size={16} className="text-zinc-600 group-hover:text-white"/>
                                        </div>
                                    )) : <p className="text-center text-zinc-500 text-sm py-4">No playlists created.</p>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

// === COMPONENT CHÍNH: USER MANAGER (Giữ nguyên logic của bạn) ===
export default function UserManager() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = async (currentPage = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BASE_API_URL}/users?page=${currentPage}&limit=10&search=${searchTerm}`, {
          headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
          setUsers(data.users);
          setTotalPages(data.totalPages);
      }
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
      const timer = setTimeout(() => { fetchUsers(1); }, 500);
      return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => { fetchUsers(page); }, [page]);

  const handleDelete = async (id) => {
      if(!window.confirm("Are you sure you want to delete this user?")) return;
      try {
          const token = localStorage.getItem("accessToken");
          await fetch(`${BASE_API_URL}/users/${id}`, {
              method: "DELETE",
              headers: { "Authorization": `Bearer ${token}` }
          });
          fetchUsers(page);
      } catch (e) { alert("Delete failed"); }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold text-white">Users Manager</h1><p className="text-zinc-400 text-sm mt-1">Manage user accounts.</p></div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input type="text" placeholder="Search user by name or email..." className="w-full bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2 rounded-md focus:outline-none focus:border-zinc-600 transition text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>

      <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
        <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs text-zinc-200 uppercase bg-zinc-900 border-b border-zinc-800">
                <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Playlists</th>
                    <th className="px-6 py-3">Joined</th>
                    <th className="px-6 py-3 text-right">Action</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr><td colSpan="6" className="px-6 py-8 text-center"><Loader2 className="animate-spin inline mr-2"/> Loading users...</td></tr>
                ) : users.length > 0 ? (
                    users.map((u) => (
                        <tr key={u._id} className="border-b border-zinc-800/50 hover:bg-zinc-900 transition">
                            <td className="px-6 py-4 flex items-center gap-3">
                                {u.avatar ? (<img src={u.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />) : (<div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold text-xs">{u.username?.charAt(0).toUpperCase()}</div>)}
                                <span className="text-white font-medium">{u.username}</span>
                            </td>
                            <td className="px-6 py-4">{u.email}</td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1 ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{u.role === 'admin' ? <Shield size={12}/> : <User size={12}/>}{u.role}</span></td>
                            <td className="px-6 py-4">{u.playlistCount}</td>
                            <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                            {/* Cột Action */}
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2 items-center">
                                    
                                    {/* 1. NÚT XEM: Chỉ hiện nếu Role KHÔNG PHẢI là Admin */}
                                    {u.role !== 'admin' ? (
                                        <button 
                                            onClick={() => setSelectedUserId(u._id)} 
                                            aria-label="View user details" 
                                            className="p-2 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-blue-400 transition"
                                        >
                                            <Eye size={16}/>
                                        </button>
                                    ) : (
                                        // Nếu là Admin thì hiện khoảng trắng hoặc icon Shield để lấp chỗ trống cho đẹp (tùy chọn)
                                        <span className="p-2 w-[32px]"></span> 
                                    )}

                                    {/* 2. NÚT XÓA: Chỉ hiện nếu KHÔNG PHẢI là chính mình */}
                                    {currentUser?._id !== u._id ? (
                                        <button 
                                            onClick={() => handleDelete(u._id)} 
                                            aria-label="Delete user" 
                                            className="p-2 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-red-400 transition"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    ) : (
                                        // Nếu là chính mình thì hiện chữ You
                                        <span className="text-xs text-zinc-600 italic px-2 select-none">You</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan="6" className="px-6 py-8 text-center text-zinc-600">No users found.</td></tr>
                )}
            </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 bg-zinc-900 rounded text-zinc-400 hover:text-white disabled:opacity-50">Prev</button>
          <span className="px-3 py-1 text-zinc-500">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-zinc-900 rounded text-zinc-400 hover:text-white disabled:opacity-50">Next</button>
      </div>

      {selectedUserId && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setSelectedUserId(null)}></div>
            <UserDetailPanel userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
          </>
      )}
    </div>
  );
}