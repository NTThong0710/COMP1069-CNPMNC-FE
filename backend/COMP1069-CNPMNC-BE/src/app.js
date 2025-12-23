require("dotenv").config();
const passport = require("./utils/passport");
const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
// 1. IMPORT THƯ VIỆN CẦN THIẾT CHO SOCKET
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

const app = express();
connectDB();

// 2. TẠO HTTP SERVER TỪ EXPRESS APP
const server = http.createServer(app);

// 3. CẤU HÌNH SOCKET.IO
const io = new Server(server, {
  cors: {
    // Cho phép Frontend truy cập Socket
    origin: ["https://musicwebapp-eight.vercel.app", "http://localhost:5173"], 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: ["https://musicwebapp-eight.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
  express.json()
);

app.use(
  cookieSession({
    name: "session",
    keys: ["secret_key"],
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
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

app.get("/", (req, res) => res.send("Music App API Running"));

// 4. LOGIC SOCKET.IO (PHÒNG STREAM NHẠC)
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Sự kiện: Tham gia phòng
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
    // Thông báo cho những người khác trong phòng
    socket.to(roomId).emit("user_joined", socket.id);
  });

  // Sự kiện: Đồng bộ hành động Play/Pause/Seek
  // data bao gồm: { roomId, action: 'play'|'pause'|'seek', time: number, songUrl: string }
  socket.on("sync_action", (data) => {
    // Gửi hành động này cho tất cả mọi người trong phòng TRỪ người gửi
    socket.to(data.roomId).emit("receive_action", data);
  });

  // Sự kiện: Gửi tin nhắn chat
  socket.on("send_message", (data) => {
    // data: { roomId, user, message, time }
    socket.to(data.roomId).emit("receive_message", data);
  });

  // Sự kiện: Đổi bài hát
  socket.on("change_song", (data) => {
    // data: { roomId, song: object }
    socket.to(data.roomId).emit("receive_song_change", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Export server thay vì app để đảm bảo socket hoạt động nếu dùng test
module.exports = server;
