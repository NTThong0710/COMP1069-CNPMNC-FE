import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Đã sửa: Giữ đường dẫn ngắn gọn và giả định các file .jsx được đặt đúng trong thư mục pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";

// Component chính của ứng dụng, thiết lập Router
function App() {
  return (
    // Sử dụng BrowserRouter để quản lý các tuyến đường (routes)
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Tuyến đường gốc (/) - Thường là trang chủ/dashboard sau khi đăng nhập */}
          <Route path="/" element={<Homepage />} />

          {/* Tuyến đường Đăng nhập */}
          <Route path="/login" element={<Login />} />

          {/* Tuyến đường Đăng ký */}
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;