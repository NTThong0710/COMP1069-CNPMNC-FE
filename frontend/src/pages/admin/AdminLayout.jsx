import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Music, Mic2, Disc, Users, LogOut, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext"; // ✅ 1. Import Toast

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { addToast } = useToast(); // ✅ 2. Sử dụng hook Toast
  const navigate = useNavigate();

  // ✅ 3. State quản lý Menu & Modal (Giống bên Client)
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const userMenuRef = useRef(null);

  // ✅ 4. Logic xử lý Logout
  const handleLogoutClick = () => {
    setShowUserMenu(false); // Đóng menu
    setIsLogoutModalOpen(true); // Mở modal
  };

  const confirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate("/login");
    setTimeout(() => addToast("Đăng xuất thành công", "success"), 100);
  };

  // ✅ 5. Logic Click Outside (Bấm ra ngoài thì đóng menu)
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuRef]);

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
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${isActive
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

        {/* ❌ ĐÃ XÓA NÚT LOGOUT Ở SIDEBAR (Để chuyển lên Header) */}
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-black">

        {/* HEADER */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md flex-shrink-0 z-10">
          <h2 className="font-semibold text-lg text-white capitalize">
            {menuItems.find(i => i.path === location.pathname)?.label || "Overview"}
          </h2>

          {/* ✅ KHU VỰC ADMIN INFO + DROPDOWN */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-4 hover:bg-zinc-800/50 p-2 rounded-lg transition-colors focus:outline-none group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white leading-none mb-1 group-hover:text-green-400 transition">
                  {user?.username || "Admin"}
                </p>
                <p className="text-xs text-zinc-500 font-medium">
                  {user?.email || "admin@system.com"}
                </p>
              </div>

              <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center relative">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Admin Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-zinc-400 text-lg">
                    {user?.username?.charAt(0).toUpperCase() || "A"}
                  </span>
                )}
              </div>

              {/* Mũi tên chỉ xuống */}
              <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* ✅ MENU DROPDOWN */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                {/* Thông tin mobile (nếu màn hình nhỏ) */}
                <div className="px-4 py-3 border-b border-zinc-800 sm:hidden">
                  <p className="text-sm font-bold text-white">{user?.username}</p>
                  <p className="text-xs text-zinc-500">{user?.email}</p>
                </div>

                <div className="p-1">
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 rounded-md transition-colors"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CONTENT SCROLL */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>

      {/* ✅ MODAL LOGOUT (Copy từ logic Client) */}
      {isLogoutModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsLogoutModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-[#282828] rounded-xl shadow-2xl border border-white/5 p-6 text-center transform scale-100 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center">
                <LogOut className="text-white w-6 h-6 ml-1" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Đăng xuất?</h3>
            <p className="text-neutral-400 mb-6 text-sm">
              Bạn có chắc chắn muốn đăng xuất khỏi Admin Panel không?
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-6 py-2.5 rounded-full font-bold text-white text-sm border border-neutral-600 hover:border-white hover:bg-neutral-800 transition min-w-[100px]"
              >
                Huỷ
              </button>
              <button
                onClick={confirmLogout}
                className="px-6 py-2.5 rounded-full font-bold text-black text-sm bg-green-500 hover:bg-green-400 hover:scale-105 transition shadow-lg shadow-green-900/20 min-w-[100px]"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}