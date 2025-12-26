import { io } from "socket.io-client";

// Hardcode để đảm bảo không bị lỗi parse .env
const SOCKET_URL = "https://api.bitio.io.vn"; // Cloud Backend

console.log("🔌 Initializing Socket...");
console.log("➡️ Socket URL:", SOCKET_URL);

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket", "polling"],
});