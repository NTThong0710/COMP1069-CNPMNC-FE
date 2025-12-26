import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { usePlaylists, useCreatePlaylist } from "../../hooks/usePlaylists";

const MyPlaylistsPage = () => {
    const { addToast } = useToast();
    // Thay thế fetch thủ công bằng hook usePlaylists
    const { data: playlists, isLoading, error } = usePlaylists();

    // Hook nặc danh cho create playlist
    const createPlaylistMutation = useCreatePlaylist();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return addToast("Name required", "error");

        createPlaylistMutation.mutate(newPlaylistName, {
            onSuccess: () => {
                addToast("Created!", "success");
                setNewPlaylistName("");
                setIsCreateModalOpen(false);
            },
            onError: () => {
                addToast("Failed to create", "error");
            }
        });
    };

    if (isLoading) return <div className="text-white p-8">Loading playlists...</div>;
    if (error) return <div className="text-red-500 p-8">Error loading playlists</div>;

    return (
        <div className="p-4 pt-8 text-white min-h-screen pb-24">
            <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
            <div className="grid grid-cols-2 gap-4">
                <div onClick={() => setIsCreateModalOpen(true)} className="aspect-square bg-neutral-800 rounded-lg flex flex-col items-center justify-center border border-dashed border-neutral-600 opacity-70 cursor-pointer hover:opacity-100 transition">
                    <span className="text-4xl text-neutral-400">+</span><span className="text-xs mt-2 text-neutral-400">Create New</span>
                </div>
                {playlists?.map(pl => {
                    let cover = pl.imageUrl || pl.cover || pl.image;
                    if (!cover && pl.songs?.length > 0) cover = pl.songs[0].song?.cover || pl.songs[0].song?.image;
                    return (
                        <Link to={`/playlist/${pl._id}`} key={pl._id} className="block group">
                            <div className="aspect-square bg-neutral-800 rounded-lg overflow-hidden mb-2 relative shadow-lg">
                                {cover ? <img src={cover} alt={pl.name} className="w-full h-full object-cover group-hover:opacity-80 transition" />
                                    : <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-800 flex items-center justify-center"><span className="font-bold text-2xl">{pl.name?.[0]}</span></div>}
                            </div>
                            <p className="font-bold truncate text-sm">{pl.name}</p>
                            <p className="text-xs text-neutral-400">{pl.songs?.length || 0} songs</p>
                        </Link>
                    );
                })}
            </div>
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-[#282828] w-full max-w-sm rounded-xl p-6 border border-neutral-700">
                        <h3 className="text-xl font-bold text-white mb-4">New Playlist</h3>
                        <input type="text" autoFocus value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} placeholder="My Playlist" className="w-full bg-[#3e3e3e] text-white p-3 rounded-lg mb-6 outline-none" />
                        <div className="flex gap-3">
                            <button onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-3 rounded-full text-white border border-neutral-600">Cancel</button>
                            <button onClick={handleCreatePlaylist} disabled={createPlaylistMutation.isPending} className="flex-1 py-3 rounded-full bg-green-500 text-black font-bold">
                                {createPlaylistMutation.isPending ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPlaylistsPage;
