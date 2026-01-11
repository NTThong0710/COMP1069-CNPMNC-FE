// File: src/pages/client/AuthSuccess.jsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Lấy token từ URL xuống
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");

        if (accessToken) {
            // 2. Lưu vào LocalStorage (Kho chứa của trình duyệt)
            // Lưu ý: Tên key ("token") phải khớp với tên mà AuthContext của bạn đang dùng để check login
            localStorage.setItem("accessToken", accessToken);
            if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

            // 3. Quan trọng: Dùng window.location.href để Reload lại trang
            // Việc này giúp AuthContext chạy lại từ đầu -> Đọc được token -> Chuyển trạng thái sang "Đã đăng nhập"
            window.location.href = "/";
        } else {
            // Nếu không có token thì đá về login
            navigate("/login");
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-bold">Processing login...</h2>
        </div>
    );
};

export default AuthSuccess;