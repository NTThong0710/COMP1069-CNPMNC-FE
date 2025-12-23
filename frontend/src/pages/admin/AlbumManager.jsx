import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Loader2, X, ChevronLeft, ChevronRight, Disc, Calendar, AlertTriangle } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function AlbumManager() {
    const { addToast } = useToast();

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

    // Modal Create State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Modal Delete State
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: "" });

    const [formData, setFormData] = useState({
        title: "",
        artist: "",
        cover: "",
        release_date: "",
        genre: "Pop" // Vẫn giữ default value để gửi API không bị lỗi
    });

    // === 1. FETCH DATA ===
    const fetchAlbums = async (currentPage = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_API_URL}/albums`);
            const data = await res.json();

            if (data.data || data.albums || data.results) {
                setAlbums(data.data || data.albums || data.results || []);
                setTotalPages(data.totalPages || 1);
            }
        } catch (error) {
            console.error("Failed to fetch albums", error);
            addToast("Lỗi tải danh sách album", "error");
        } finally {
            setLoading(false);
        }
    };

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

    const handleOpenDelete = (album) => {
        setDeleteModal({
            isOpen: true,
            id: album.id || album._id,
            title: album.title || album.name
        });
    };

    const confirmDelete = async () => {
        const id = deleteModal.id;
        if (!id) return;

        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${BASE_API_URL}/albums/${id}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                addToast("Xóa album thành công", "success");
                fetchAlbums(page);
            } else {
                addToast("Xóa album thất bại", "error");
            }
        } catch (e) {
            console.error(e);
            addToast("Lỗi kết nối server", "error");
        } finally {
            setDeleteModal({ isOpen: false, id: null, title: "" });
        }
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

            if (res.ok) {
                addToast("Tạo album thành công!", "success");
                setIsModalOpen(false);
                fetchAlbums(1);
                setFormData({ title: "", artist: "", cover: "", release_date: "", genre: "Pop" });
            } else {
                const err = await res.json();
                addToast(err.message || "Tạo album thất bại", "error");
            }
        } catch (e) {
            console.error(e);
            addToast("Lỗi kết nối server", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredAlbums = albums.filter(a =>
        (a.title || a.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof a.artist === 'object' ? a.artist?.name : (a.artist_name || "")).toLowerCase().includes(searchTerm.toLowerCase())
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
                    aria-label="Add new album"
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
                                {/* Đã xóa cột Genre */}
                                <th className="px-6 py-3">Release Date</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading...</td></tr>
                            ) : filteredAlbums.length > 0 ? (
                                filteredAlbums.map((album, index) => (
                                    <tr key={album._id || album.id} className="border-b border-zinc-800/50 hover:bg-zinc-900 transition">
                                        <td className="px-6 py-4">{index + 1}</td>

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
                                            {typeof album.artist === 'object' ? album.artist?.name : (album.artist_name || "Unknown")}
                                        </td>

                                        {/* Đã xóa cột Genre ở đây */}

                                        <td className="px-6 py-4">
                                            {album.release_date || album.releaseDate || album.releasedate ? new Date(album.release_date || album.releaseDate || album.releasedate).toLocaleDateString() : "-"}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-zinc-800 rounded-md text-blue-400 transition"><Pencil size={16} /></button>
                                                <button
                                                    onClick={() => handleOpenDelete(album)}
                                                    className="p-2 hover:bg-zinc-800 rounded-md text-red-400 transition"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-zinc-600">No albums found.</td></tr>
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
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white"><X /></button>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Disc size={24} className="text-green-500" /> Add New Album</h2>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Album Title *</label>
                                <input type="text" required className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none transition" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Artist *</label>
                                <select required className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none transition" value={formData.artist} onChange={e => setFormData({ ...formData, artist: e.target.value })}>
                                    <option value="">-- Select Artist --</option>
                                    {artistsList.map(a => (<option key={a._id || a.id} value={a._id || a.id}>{a.name}</option>))}
                                </select>
                            </div>

                            {/* Đã xóa ô nhập Genre, nhưng vẫn giữ Release Date */}
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Release Date</label>
                                <input type="date" className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none" value={formData.release_date} onChange={e => setFormData({ ...formData, release_date: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1.5">Cover Image URL</label>
                                <input type="text" placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-2.5 text-white focus:border-green-500 outline-none" value={formData.cover} onChange={e => setFormData({ ...formData, cover: e.target.value })} />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 font-bold text-sm">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="bg-white text-black font-bold px-6 py-2 rounded-full hover:scale-105 transition disabled:opacity-50">
                                    {isSubmitting ? "Creating..." : "Create Album"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* === MODAL DELETE ALBUM === */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm bg-[#18181b] border border-zinc-800 rounded-xl p-6 text-center transform scale-100 transition-all shadow-2xl">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center">
                                <AlertTriangle className="text-red-500 w-6 h-6" />
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">Delete Album?</h3>
                        <p className="text-zinc-400 mb-6 text-sm">
                            Are you sure you want to delete <br />
                            <span className="text-white font-bold">"{deleteModal.title}"</span>?
                            <br />This action cannot be undone.
                        </p>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, id: null, title: "" })}
                                className="px-6 py-2.5 rounded-full font-bold text-white text-sm border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 transition min-w-[100px]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-6 py-2.5 rounded-full font-bold text-white text-sm bg-red-600 hover:bg-red-500 transition shadow-lg shadow-red-900/20 min-w-[100px]"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}