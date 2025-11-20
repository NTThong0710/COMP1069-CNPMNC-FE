import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Edit2, LogOut, MoreHorizontal, Disc } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../components/EditProfileModal';

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function ProfilePage() {
    // Lấy hàm updateUser từ Context
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // === 1. FETCH PROFILE DATA ===
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
                
                // ✅ FIX LỖI HEADER KHÔNG HIỆN AVATAR:
                // Cập nhật data mới nhất (có avatar) vào Context để Header hiển thị theo
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
        // Gọi API mỗi khi vào trang Profile để đảm bảo data tươi mới
        if (user) fetchProfile();
    }, []); // Chạy 1 lần khi mount (hoặc khi user đổi nếu cần: [user._id])

    // === 2. XỬ LÝ UPDATE PROFILE ===
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
                // Refresh lại dữ liệu
                await fetchProfile(); 
                alert("Cập nhật hồ sơ thành công!");
            } else {
                alert("Lỗi cập nhật hồ sơ");
            }
        } catch (error) {
            console.error("Save profile error", error);
        }
    };

    // === 3. XỬ LÝ LOGOUT ===
    const handleLogout = () => {
        const confirm = window.confirm("Bạn có chắc muốn đăng xuất?");
        if (confirm) {
            logout();
            navigate('/login');
        }
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

    // Dữ liệu hiển thị
    const displayUser = profileData || user;
    const username = displayUser.username || displayUser.name || "User";
    const publicPlaylists = displayUser.playlists || []; 
    const playlistCount = publicPlaylists.length;

    return (
        <main className="pb-24 min-h-screen bg-neutral-900">
            
            {/* === HEADER PROFILE === */}
            <div className="bg-gradient-to-b from-[#535353] to-[#121212] p-8 pb-6 flex flex-col md:flex-row items-center md:items-end gap-6">
                {/* Avatar */}
                <div 
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-48 h-48 shadow-2xl rounded-full overflow-hidden bg-[#282828] flex items-center justify-center group relative cursor-pointer"
                >
                    {/* Ưu tiên hiển thị ảnh từ displayUser */}
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

            {/* === ACTION BAR === */}
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
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-neutral-400 hover:text-red-500 font-bold text-sm transition px-4 py-2 rounded-md hover:bg-neutral-800"
                 >
                    <LogOut size={18} /> Log out
                 </button>
            </div>

            {/* === PLAYLISTS === */}
            <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Public Playlists</h2>
                {publicPlaylists.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {publicPlaylists.map((pl, index) => (
                             <div key={index} className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group">
                                <div className="relative mb-4 shadow-lg">
                                    <div className="w-full aspect-square bg-neutral-800 rounded-md flex items-center justify-center overflow-hidden">
                                        <img 
                                            src={pl.cover || `https://placehold.co/300x300/282828/white?text=${pl.name?.charAt(0) || 'P'}`} 
                                            alt={pl.name} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                </div>
                                <h3 className="font-bold text-white truncate">{pl.name || `Playlist #${index + 1}`}</h3>
                                <p className="text-sm text-neutral-400 mt-1">By {username}</p>
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

            {/* === MODAL === */}
            <EditProfileModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentUser={displayUser}
                onSave={handleSaveProfile}
            />
        </main>
    );
}