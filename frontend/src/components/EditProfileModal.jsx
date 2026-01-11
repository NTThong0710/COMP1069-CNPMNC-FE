import React, { useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose, currentUser, onSave }) {
    const [name, setName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [loading, setLoading] = useState(false);

    // Load dữ liệu cũ khi mở modal
    useEffect(() => {
        if (currentUser) {
            setName(currentUser.username || currentUser.name || "");
            setAvatarUrl(currentUser.avatar || "");
        }
    }, [currentUser, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Gọi hàm save từ cha
        await onSave(name, avatarUrl);
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#282828] w-full max-w-lg rounded-lg shadow-2xl border border-neutral-700 flex flex-col p-6 relative">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Profile details</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar Input Section */}
                        <div className="relative group w-40 h-40 flex-shrink-0 mx-auto md:mx-0">
                            <div className="w-full h-full rounded-full overflow-hidden bg-[#121212] shadow-lg flex items-center justify-center">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera size={48} className="text-neutral-500" />
                                )}
                            </div>
                            {/* Overlay hướng dẫn */}
                            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera size={32} className="text-white mb-2" />
                                <span className="text-xs text-white font-bold">Paste URL below</span>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="flex-1 flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[#3e3e3e] text-white p-3 rounded border border-transparent focus:border-white/50 outline-none transition font-bold"
                                    required
                                />
                            </div>
                            
                            {/* Tạm thời nhập Link ảnh vì chưa làm upload file */}
                            <div>
                                <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Avatar Image URL</label>
                                <input 
                                    type="text" 
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    placeholder="https://example.com/my-photo.jpg"
                                    className="w-full bg-[#3e3e3e] text-white p-3 rounded border border-transparent focus:border-white/50 outline-none transition text-sm"
                                />
                                <p className="text-[10px] text-neutral-400 mt-1">
                                    *Paste a direct image link here (e.g., from Google Images, Imgur...)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Button */}
                    <div className="flex justify-end mt-8">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 hover:bg-gray-100 transition disabled:opacity-70"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}