import { Link } from 'react-router-dom';

export default function ProfilePage() {
    // Dữ liệu người dùng giả lập
    const user = {
        username: "Nguyễn Vănnn An",
        avatar: "/son-tung-mtp.png", // Thay bằng avatar thật sau
        playlists: [
            { id: "liked-songs", name: "Liked Songs", coverImage: "/Album.png" },
            // Thêm các playlist khác của user ở đây
        ]
    };

    return (
        <main className="p-8">
            <div className="flex items-center gap-8 mb-12">
                <img src={user.avatar} alt={user.username} className="w-48 h-48 rounded-full object-cover shadow-2xl" />
                <div>
                    <p className="text-sm font-bold uppercase text-neutral-400">Profile</p>
                    <h1 className="text-8xl font-black text-white">{user.username}</h1>
                </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Public Playlists</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {user.playlists.map(playlist => (
                    <Link to={`/playlist/${playlist.id}`} key={playlist.id}>
                        <div className="group bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 cursor-pointer">
                            <img src={playlist.coverImage} alt={playlist.name} className="w-full aspect-square object-cover rounded-md mb-4" />
                            <h3 className="font-bold text-white truncate">{playlist.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}