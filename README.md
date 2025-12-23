# 🎵 Music8 - Online Music Streaming Platform

Music8 is a modern, responsive, and feature-rich music streaming application designed to provide users with a seamless listening experience. Built with the **MERN stack** and real-time capabilities.

## 📦 Technologies

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

### DevOps & Infrastructure
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![SePay](https://img.shields.io/badge/SePay-Payment-blue?style=for-the-badge)

<br>

## 🎥 Video Demo

Watch a quick tour of the application features:

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
   * Designed the database schema (Users, Songs, Albums, Playlists) in MongoDB.
   * Created UI wireframes focusing on a "Mobile-First" experience.

2. **Backend Development:**
   * Set up the Express server and connected to MongoDB.
   * Implemented JWT Authentication for secure user sessions.
   * Built RESTful APIs for song management and user data.

3. **Frontend Development:**
   * Initialized the project with Vite & React 19.
   * Styled the components using Tailwind CSS for a pixel-perfect look.
   * Integrated the Audio API to handle music playback logic (play, pause, seek).

4. **Real-time Integration:**
   * Added Socket.io to sync playback states or notify users (optional feature).

5. **Deployment:**
   * Deployed Client to **Vercel** and Server to **Render**.

<br>

## 🧠 What I Learned

This project helped me improve my skills significantly:

* **State Management:** Mastered handling complex states for the music player (current time, duration, volume) across different components.
* **Audio Handling:** Learned how to work with the HTML5 Audio API and handle browser autoplay policies.
* **Real-time Communication:** Gained hands-on experience with `Socket.io` for bi-directional communication.
* **Tailwind CSS v4:** Explored the latest features of Tailwind for rapid UI development.
* **Full-stack Deployment:** Learned how to configure CORS and environment variables for production.

<br>

## 🏃 How to Run (Installation)

Follow the steps below to run the project locally.

### Prerequisites
* Node.js (v18+)
* MongoDB (Local or Atlas URL)
* Redis (Required for caching)

### Phase 1: Start Frontend (Run this first)

```bash
cd frontend
npm install
npm run dev
# Client will run on: http://localhost:5173
```
### Phase 2: Start Backend
```bash
cd backend
docker-compose up --build
# Server running on port 5000
```
