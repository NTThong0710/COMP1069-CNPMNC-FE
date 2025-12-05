import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Music, Mic2, Disc, Users, LogOut, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth(); // ✅ Lấy user từ context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin" },
    { icon: <Music size={20} />, label: "Songs", path: "/admin/songs" },
    { icon: <Mic2 size={20} />, label: "Artists", path: "/admin/artists" },
    { icon: <Disc size={20} />, label: "Albums", path: "/admin/albums" },
    { icon: <Users size={20} />, label: "Users", path: "/admin/users" },
    { icon: <Settings size={20} />, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="h-screen bg-black text-white flex font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col flex-shrink-0 h-full">
        <div className="p-6 flex items-center gap-2 border-b border-zinc-800 flex-shrink-0">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-black">
            A
          </div>
          <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black font-medium shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800 flex-shrink-0">
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-md transition"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-black">
        
        {/* HEADER */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md flex-shrink-0 z-10">
            {/* Tiêu đề trang */}
            <h2 className="font-semibold text-lg text-white capitalize">
                {menuItems.find(i => i.path === location.pathname)?.label || "Overview"}
            </h2>

            {/* ✅ KHU VỰC ADMIN INFO (GÓC PHẢI) */}
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-white leading-none mb-1">
                        {user?.username || "Admin"}
                    </p>
                    <p className="text-xs text-zinc-500 font-medium">
                        {user?.email || "admin@system.com"}
                    </p>
                </div>
                
                <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center">
                    {user?.avatar ? (
                        <img 
                            src={user.avatar} 
                            alt="Admin Avatar" 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                         <span className="font-bold text-zinc-400 text-lg">
                            {user?.username?.charAt(0).toUpperCase() || "A"}
                         </span>
                    )}
                </div>
            </div>
        </div>
        
        {/* CONTENT SCROLL */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <Outlet />
        </div>
      </main>
    </div>
  );
}