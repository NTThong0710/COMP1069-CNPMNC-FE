# 🎵 Music Web Platform

Một nền tảng streaming nhạc hiện đại với React Frontend và Node.js Backend, được containerize bằng Docker.

## 🌟 Features

### 🎵 Music Management

- Upload & stream bài hát
- Quản lý album & playlist
- Thẻ bài hát & gợi ý
- Lịch sử nghe nhạc
- Bài hát yêu thích

### 👤 User Management

- Authentication & authorization
- User profiles & following system
- Tải lên avatar & ảnh bìa
- Cài đặt tài khoản

### 💬 Social Features

- Bình luận trên bài hát
- Đánh giá bài hát
- Chia sẻ playlist
- Real-time notifications

### � Technical Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Storage**: AWS S3 (LocalStack)
- **Reverse Proxy**: Nginx
- **Containerization**: Docker

## 📋 Prerequisites

- Docker >= 20.10
- Docker Compose >= 2.0
- Node.js >= 18 (for local development)
- npm >= 9 (for local development)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd music-web
```

### 2. Setup Environment

```bash
cp .env .env.local
# Edit .env.local with your configuration
```

### 3. Start Services

```bash
# Option 1: Using Docker Compose
docker-compose up -d

# Option 2: Using Make
make up

# Option 3: Development only (no frontend)
make dev
```

### 4. Access Services

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **RabbitMQ UI**: http://localhost:15672 (guest/guest)
- **Redis Commander**: http://localhost:8082
- **Nginx**: http://localhost

<div align="center">
  <video src="https://github.com/user-attachments/assets/eee5bfb9-4bb4-4071-9717-fe8c69a71fcf" controls="controls" width="800" style="max-width: 100%; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
  </video>
</div>

<br>

## ✨ Features

- **Seamless Music Streaming:** High-quality audio playback with a custom player.
- **Playlist Management:** Create, edit, and manage personal playlists.
- **Shared Listening Room:** Real-time synchronization allowing groups to listen to music together (WebSocket).
- **Fintech Integration:** Automated transaction processing via **SePay Payment Gateway**.
- **Smart Search:** Quickly find songs, artists, and albums.
- **User Authentication:** Secure login and registration system (JWT).
- **Responsive Design:** Fully optimized for desktop, tablet, and mobile devices.
- **Real-time Interaction:** Live updates using **Socket.io**.

<br>

## 🛤️ The Process

Building Music8 was a journey of solving real-world full-stack challenges. Here is how I approached it:

1. **Planning & Design:**
   - Designed the database schema (Users, Songs, Albums, Playlists) in MongoDB.
   - Created UI wireframes focusing on a "Mobile-First" experience.

2. **Backend Development:**
   - Set up the Express server and connected to MongoDB.
   - Implemented JWT Authentication for secure user sessions.
   - Built RESTful APIs for song management and user data.

3. **Frontend Development:**
   - Initialized the project with Vite & React 19.
   - Styled the components using Tailwind CSS for a pixel-perfect look.
   - Integrated the Audio API to handle music playback logic (play, pause, seek).

4. **Real-time Integration:**
   - Added Socket.io to sync playback states or notify users (optional feature).

5. **Deployment:**
   - Deployed Client to **Vercel** and Server to **Render**.

<br>

## 🧠 What I Learned

This project helped me improve my skills significantly:

- **State Management:** Mastered handling complex states for the music player (current time, duration, volume) across different components.
- **Audio Handling:** Learned how to work with the HTML5 Audio API and handle browser autoplay policies.
- **Real-time Communication:** Gained hands-on experience with `Socket.io` for bi-directional communication.
- **Tailwind CSS v4:** Explored the latest features of Tailwind for rapid UI development.
- **Full-stack Deployment:** Learned how to configure CORS and environment variables for production.

<br>

## 🏃 How to Run (Installation)

Follow the steps below to run the project locally.

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas URL)
- Redis (Required for caching)

### Phase 1: Start Frontend (Run this first)

```bash
cd frontend
npm install
npm run dev
# Client will run on: http://localhost:5173
```

### Phase 2: Start Backend

```bash
cd backend/COMP1069-CNPMNC-BE
docker-compose up --build
# Server running on port 5000
```
