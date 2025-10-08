// server/src/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8800;

// Middlewares
app.use(cors()); // Cho phép client gọi API
app.use(express.json()); // Đọc được body dạng JSON

// Route thử nghiệm
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from backend! 👋" });
});

app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});