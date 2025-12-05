import React, { useState, useEffect } from "react";
import { Save, User, Lock, Mail, Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function AdminSettings() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar: "",
  });

  // Load data từ context khi vào trang
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "", // Email thường là read-only
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BASE_API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formData.username,
          avatar: formData.avatar
        })
      });

      if (res.ok) {
        // Cập nhật lại Context để Header và Sidebar đổi theo ngay lập tức
        const updatedUser = { ...user, username: formData.username, avatar: formData.avatar };
        updateUser(updatedUser);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage your account settings and preferences.</p>
      </div>

      {/* CARD 1: PROFILE INFO */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <User size={20}/> Public Profile
            </h2>
            <p className="text-sm text-zinc-500 mt-1">This is how others will see you on the site.</p>
        </div>
        
        <div className="p-6 space-y-6">
            {/* Avatar Preview & Input */}
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {formData.avatar ? (
                        <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <User size={32} className="text-zinc-500" />
                    )}
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Avatar URL</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Camera className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16}/>
                            <input 
                                type="text" 
                                value={formData.avatar}
                                onChange={e => setFormData({...formData, avatar: e.target.value})}
                                className="w-full bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2 rounded-md focus:outline-none focus:border-white transition text-sm"
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Display Name</label>
                    <input 
                        type="text" 
                        value={formData.username}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white px-4 py-2 rounded-md focus:outline-none focus:border-white transition text-sm font-medium"
                    />
                </div>
                
                {/* Email Read-only */}
                <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16}/>
                        <input 
                            type="text" 
                            value={formData.email}
                            disabled
                            className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-500 pl-10 pr-4 py-2 rounded-md cursor-not-allowed text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="p-4 bg-zinc-900/30 border-t border-zinc-800 flex justify-end">
            <button 
                onClick={handleSave}
                disabled={loading}
                aria-label="Save changes"
                className="bg-white text-black hover:bg-zinc-200 font-bold px-6 py-2 rounded-md flex items-center gap-2 transition disabled:opacity-50"
            >
                {loading ? "Saving..." : <><Save size={18}/> Save Changes</>}
            </button>
        </div>
      </div>

      {/* CARD 2: CHANGE PASSWORD (UI Only) */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden opacity-70">
        <div className="p-6 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Lock size={20}/> Password
            </h2>
            <p className="text-sm text-zinc-500 mt-1">Change your password here. (Feature coming soon)</p>
        </div>
        <div className="p-6 space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="password" placeholder="Current Password" disabled className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-md cursor-not-allowed"/>
                <input type="password" placeholder="New Password" disabled className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-md cursor-not-allowed"/>
             </div>
        </div>
      </div>

    </div>
  );
}