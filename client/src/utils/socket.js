// src/utils/socket.js
import { io } from "socket.io-client";

// Thay đổi URL này thành URL backend của bạn khi deploy
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, // Chúng ta sẽ connect thủ công khi user đăng nhập hoặc vào phòng
});