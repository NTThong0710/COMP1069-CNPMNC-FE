import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Edit2, LogOut, MoreHorizontal, Disc } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import EditProfileModal from '../../components/EditProfileModal';

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function ProfilePage() {
    const { user, logout, updateUser } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    // State Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // === 1. FETCH PROFILE ===
    const fetchProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) return;

            const res = await fetch(`${BASE_API_URL}/auth/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setProfileData(data);
                updateUser(data);
            } else {
                setProfileData(user);
            }
        } catch (error) {
            console.error("Profile fetch error", error);
            setProfileData(user);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchProfile();
    }, []);

    // === 2. UPDATE PROFILE ===
    const handleSaveProfile = async (newName, newAvatarUrl) => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${BASE_API_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: newName,
                    avatar: newAvatarUrl
                })
            });

            if (res.ok) {
                await fetchProfile();
                addToast("Cập nhật hồ sơ thành công!", "success");
            } else {
                addToast("Cập nhật hồ sơ thất bại", "error");
            }
        } catch (error) {
            console.error("Save profile error", error);
            addToast("Lỗi kết nối server", "error");
        }
    };

    // === 3. LOGOUT ===
    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        logout();
        setIsLogoutModalOpen(false);
        navigate('/login');
        setTimeout(() => addToast("Đăng xuất thành công", "success"), 100);
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-white">
                <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập để xem hồ sơ</h2>
                <Link to="/login">
                    <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition">
                        Đăng nhập
                    </button>
                </Link>
            </div>
        );
    }

    const displayUser = profileData || user;
    const username = displayUser.username || displayUser.name || "User";
    const publicPlaylists = displayUser.playlists || [];
    const playlistCount = publicPlaylists.length;

    return (
        <main className="pb-24 min-h-screen bg-neutral-900 relative">

            {/* Header Profile */}
            <div className="bg-gradient-to-b from-[#535353] to-[#121212] p-8 pb-6 flex flex-col md:flex-row items-center md:items-end gap-6">
                <div
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-48 h-48 shadow-2xl rounded-full overflow-hidden bg-[#282828] flex items-center justify-center group relative cursor-pointer"
                >
                    {displayUser.avatar ? (
                        <img src={displayUser.avatar} alt={username} className="w-full h-full object-cover" />
                    ) : (
                        <User size={64} className="text-neutral-400" />
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-white flex flex-col items-center gap-1">
                            <Edit2 size={32} />
                            <span className="text-sm font-bold">Choose photo</span>
                        </div>
                    </div>
                </div>

                <div className="text-center md:text-left flex-1">
                    <p className="text-sm font-bold text-white uppercase mb-1">Profile</p>
                    <h1
                        onClick={() => setIsEditModalOpen(true)}
                        className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tight cursor-pointer hover:scale-[1.01] transition origin-left"
                    >
                        {username}
                    </h1>
                    <div className="text-white text-sm font-medium flex items-center justify-center md:justify-start gap-1">
                        <span>{playlistCount} Public Playlists</span>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="px-8 py-4 bg-[#121212]/50 flex items-center gap-4 border-b border-neutral-800">
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-white hover:text-white border border-neutral-500 hover:border-white text-xs font-bold px-4 py-1.5 rounded-full transition uppercase tracking-wider"
                >
                    Edit Profile
                </button>
                <button className="text-neutral-400 hover:text-white">
                    <MoreHorizontal size={32} />
                </button>
                <div className="flex-1"></div>
                <button
                    onClick={handleLogoutClick}
                    className="flex items-center gap-2 text-neutral-400 hover:text-red-500 font-bold text-sm transition px-4 py-2 rounded-md hover:bg-neutral-800"
                >
                    <LogOut size={18} /> Log out
                </button>
            </div>

            {/* Playlists */}
            <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Public Playlists</h2>
                {publicPlaylists.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {publicPlaylists.map((pl, index) => (
                            <div
                                key={pl._id || index}
                                onClick={() => navigate(`/playlist/${pl._id}`)}
                                className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group"
                            >
                                <div className="relative mb-4 shadow-lg">
                                    <div className="w-full aspect-square bg-neutral-800 rounded-md flex items-center justify-center overflow-hidden">

                                        {/* --- ĐOẠN ĐÃ SỬA --- */}
                                        <img
                                            src={
                                                pl.imageUrl ||
                                                pl.image ||
                                                (pl.songs && pl.songs.length > 0 ? pl.songs[0].cover : null) ||
                                                `https://placehold.co/300x300/282828/white?text=${(pl.name || 'P').charAt(0)}`
                                            }
                                            alt={pl.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {/* ------------------ */}

                                    </div>
                                    <div className="absolute right-2 bottom-2 bg-green-500 rounded-full p-3 shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-black">
                                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="font-bold text-white truncate">{pl.name || `Playlist #${index + 1}`}</h3>
                                <p className="text-sm text-neutral-400 mt-1 truncate">By {username}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 bg-neutral-800/30 rounded-lg border border-dashed border-neutral-700">
                        <Disc size={48} className="text-neutral-600 mb-4" />
                        <p className="text-white font-bold text-lg">You haven't created any playlists yet.</p>
                    </div>
                )}
            </div>

            {/* Modal Edit */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentUser={displayUser}
                onSave={handleSaveProfile}
            />

            {/* Modal Logout */}
            {isLogoutModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setIsLogoutModalOpen(false)}
                >
                    <div
                        className="w-full max-w-sm bg-[#282828] rounded-xl shadow-2xl border border-white/5 p-6 text-center transform scale-100 transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-white mb-2">Đăng xuất?</h3>
                        <p className="text-neutral-400 mb-8 text-sm">
                            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản <span className="text-white font-bold">{username}</span> không?
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setIsLogoutModalOpen(false)}
                                className="px-6 py-2.5 rounded-full font-bold text-white text-sm border border-neutral-600 hover:border-white hover:scale-105 transition"
                            >
                                Huỷ
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-6 py-2.5 rounded-full font-bold text-black text-sm bg-green-500 hover:bg-green-400 hover:scale-105 transition shadow-lg shadow-green-500/20"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}