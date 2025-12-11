import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const BASE_API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedSongsTrigger, setLikedSongsTrigger] = useState(0);
  // 1. STATE TRIGGER (Để báo hiệu cập nhật Playlist)
  const [playlistUpdateTrigger, setPlaylistUpdateTrigger] = useState(0);

  // Trong AuthContext.jsx
  const triggerPlaylistRefresh = () => {
    setPlaylistUpdateTrigger((prev) => prev + 1);
  };
  // === HÀM HELPER: GỌI API LẤY INFO MỚI NHẤT ===
  // Hàm này giúp đồng bộ dữ liệu từ Server về Client bất cứ lúc nào
  const fetchUserProfile = async (accessToken) => {
    try {
      const res = await fetch(`${BASE_API_URL}/auth/profile`, {
        headers: { "Authorization": `Bearer ${accessToken}` }
      });

      if (res.ok) {
        const userData = await res.json();
        // Lưu vào state và localStorage
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      }
    } catch (error) {
      console.error("Auto fetch profile failed:", error);
    }
    return null;
  };

  // === 1. KHỞI TẠO (CHECK KHI F5 TRANG) ===
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        // Cách 1: Dùng tạm dữ liệu cũ trong localStorage để hiển thị ngay cho nhanh
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Cách 2 (Quan trọng): Gọi API ngầm để lấy dữ liệu mới nhất (Avatar, Playlist...)
        // Nếu server có thay đổi, nó sẽ tự update lại state user
        await fetchUserProfile(accessToken);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // === 2. ĐĂNG NHẬP ===
  const login = async (email, password) => {
    try {
      const res = await fetch(`${BASE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");

      // Lưu Token
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // 🔥 FIX: Thay vì dùng data.user do Login trả về (có thể thiếu field), 
      // ta gọi fetchUserProfile để lấy đầy đủ (bao gồm cả playlists, history, avatar...)
      const fullUserData = await fetchUserProfile(data.accessToken);

      // Fallback: Nếu fetch lỗi thì dùng tạm data trả về từ login
      if (!fullUserData) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return { success: true, role: data.user.role };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // === 3. ĐĂNG KÝ ===
  const register = async (payload) => {
    try {
      const res = await fetch(`${BASE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");

      // Lưu token và user
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // Với đăng ký mới thì user data thường rỗng, dùng luôn data trả về cũng được
      // Nhưng gọi fetchProfile cho chắc cú cũng không sao
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // === 4. ĐĂNG XUẤT ===
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  // === 5. CẬP NHẬT USER THỦ CÔNG ===
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const triggerRefreshLikedSongs = () => {
    setLikedSongsTrigger(prev => prev + 1);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading,
      likedSongsTrigger,
      triggerRefreshLikedSongs,
      updateUser,
      playlistUpdateTrigger,
      triggerPlaylistRefresh,
      fetchUserProfile // Xuất thêm hàm này nếu component con muốn tự gọi reload
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);