require("dotenv").config();
const passport = require("./utils/passport");
const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
// 1. IMPORT THƯ VIỆN CẦN THIẾT
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const songRoutes = require("./routes/songRoute");
const playlistRoutes = require("./routes/playlistRoutes");
const albumRoutes = require("./routes/albumRoutes");
const artistRoutes = require("./routes/artistRoutes");
const searchRoutes = require("./routes/searchRoutes");
const userRoutes = require("./routes/userRoutes");
const historyRoutes = require("./routes/historyRoutes");
const commentRoutes = require("./routes/commentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// 2. KHỞI TẠO APP VÀ DB
const app = express();

// --- [QUAN TRỌNG] CẤU HÌNH CHO CLOUDFLARE & RENDER ---
// Giúp Express tin tưởng request đi qua Proxy (để cookie hoạt động đúng)
app.set("trust proxy", 1); 

connectDB();

// 3. DANH SÁCH DOMAIN ĐƯỢC PHÉP TRUY CẬP (WHITELIST)
const allowedOrigins = [
  "https://bitio.io.vn",                  // Domain chính
  "https://www.bitio.io.vn",              // Domain www
  "https://musicwebapp-eight.vercel.app", // Domain Vercel cũ
  "http://localhost:5173",                // Localhost Vite
  "http://localhost:3000"                 // Localhost React (phòng hờ)
];

// 4. TẠO HTTP SERVER
const server = http.createServer(app);

// 5. CẤU HÌNH SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Dùng chung danh sách trên cho đồng bộ
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 6. MIDDLEWARE
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Cho phép gửi Cookie/Session
  })
);

// Hỗ trợ pre-flight request cho mọi routes
// app.options("*", cors()); 

app.use(express.json());

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY || "secret_key"], // Nên để trong biến môi trường
    maxAge: 24 * 60 * 60 * 1000, // 24 giờ
    // secure: true, // Bật cái này nếu web chạy HTTPS hoàn toàn (Production)
    // sameSite: 'none' // Cần thiết nếu FE và BE khác domain (Cross-site)
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 7. ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => res.send("Music App API Running on bitio.io.vn"));

// =========================================================
// 8. LOGIC SOCKET.IO (PHÒNG STREAM NHẠC & USER LIST)
// =========================================================

// Biến lưu trữ User trong phòng (Lưu tạm trên RAM)
let roomUsers = {}; 

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // --- SỰ KIỆN: THAM GIA PHÒNG ---
  socket.on("join_room", ({ roomId, userInfo }) => {
    socket.join(roomId);
    
    // Khởi tạo mảng phòng nếu chưa có
    if (!roomUsers[roomId]) {
      roomUsers[roomId] = [];
    }

    // Kiểm tra và thêm user
    if (userInfo && userInfo.userId) {
        const existingUserIndex = roomUsers[roomId].findIndex(u => u.userId === userInfo.userId);
        
        if (existingUserIndex !== -1) {
          // Update socketId mới nếu user reconnect
          roomUsers[roomId][existingUserIndex].socketId = socket.id;
        } else {
          // Thêm user mới
          roomUsers[roomId].push({ ...userInfo, socketId: socket.id });
        }
        console.log(`User ${userInfo.name} joined room: ${roomId}`);
    }

    // Gửi danh sách thành viên mới nhất cho TẤT CẢ mọi người trong phòng
    io.to(roomId).emit("update_room_users", roomUsers[roomId] || []);
    
    // Thông báo có người vào
    if (userInfo) {
        socket.to(roomId).emit("user_joined", userInfo.userId);
    }
  });

  // --- SỰ KIỆN: RỜI PHÒNG ---
  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
    if (roomUsers[roomId]) {
      roomUsers[roomId] = roomUsers[roomId].filter(user => user.socketId !== socket.id);
      io.to(roomId).emit("update_room_users", roomUsers[roomId]);
    }
  });

  // --- SỰ KIỆN: ĐỒNG BỘ PLAY/PAUSE/SEEK ---
  socket.on("sync_action", (data) => {
    socket.to(data.roomId).emit("receive_action", data);
  });

  // --- SỰ KIỆN: CHAT ---
  socket.on("send_message", (data) => {
    socket.to(data.roomId).emit("receive_message", data);
  });

  // --- SỰ KIỆN: ĐỔI BÀI HÁT ---
  socket.on("change_song", (data) => {
    socket.to(data.roomId).emit("receive_song_change", data);
  });

  // --- SỰ KIỆN: NGẮT KẾT NỐI ---
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    for (const roomId in roomUsers) {
      const index = roomUsers[roomId].findIndex(u => u.socketId === socket.id);
      if (index !== -1) {
        roomUsers[roomId].splice(index, 1);
        io.to(roomId).emit("update_room_users", roomUsers[roomId]);
        break;
      }
    }
  });
});

// 9. CHẠY SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});

module.exports = server;
