# 🎵 Music Web Platform - Project Status Report

**Date:** April 23, 2026  
**Status:** ✅ **FULLY OPERATIONAL**

---

## 🚀 Quick Start

```bash
# Start all services
cd /home/quocthoaii/music-web
docker-compose up -d

# Create S3 buckets (run once)
docker-compose exec localstack awslocal s3 mb s3://music-uploads --region ap-southeast-1
docker-compose exec localstack awslocal s3 mb s3://music-avatars --region ap-southeast-1

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 📊 Container Status

| Service             | Status     | Port       | Health  |
| ------------------- | ---------- | ---------- | ------- |
| **Backend**         | ✅ Running | 5000       | Healthy |
| **Frontend**        | ✅ Running | 5173       | Healthy |
| **Nginx**           | ✅ Running | 80/443     | Running |
| **Redis**           | ✅ Running | 6379       | Healthy |
| **RabbitMQ**        | ✅ Running | 5672/15672 | Healthy |
| **LocalStack S3**   | ✅ Running | 4566       | Healthy |
| **Redis Commander** | ✅ Running | 8082       | Healthy |

---

## 🌐 Service URLs

| Service                  | URL                       | Credentials |
| ------------------------ | ------------------------- | ----------- |
| **Frontend**             | http://localhost:5173     | -           |
| **Frontend (via Nginx)** | http://localhost          | -           |
| **Backend API**          | http://localhost:5000/api | -           |
| **RabbitMQ Manager**     | http://localhost:15672    | guest/guest |
| **Redis Commander**      | http://localhost:8082     | -           |
| **LocalStack S3**        | http://localhost:4566     | -           |

---

## 📦 Architecture

### **Frontend Stack**

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **Data Fetching:** React Query (TanStack Query) + Axios
- **Real-time:** Socket.io Client
- **Build:** Multi-stage Docker build with `serve`

### **Backend Stack**

- **Runtime:** Node.js 20 (Alpine)
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Cloud)
- **Cache:** Redis 7
- **Message Queue:** RabbitMQ 3.13
- **File Storage:** LocalStack S3 Simulation
- **Auth:** JWT (Access + Refresh tokens)

### **Infrastructure**

- **Reverse Proxy:** Nginx (Alpine)
- **Container Orchestration:** Docker Compose
- **Networking:** Docker Bridge Network (`music_network`)
- **Monitoring:** Redis Commander, RabbitMQ Management UI

---

## 📁 Project Structure

```
music-web/
├── frontend/                          # React Frontend
│   ├── Dockerfile                     # Multi-stage build
│   ├── .env                          # Dev environment
│   ├── .env.production               # Production config
│   ├── .env.docker                   # Docker-specific config
│   ├── .dockerignore
│   ├── vite.config.js                # Vite config with path aliases
│   ├── package.json
│   └── src/
│       ├── services/
│       │   └── api.js                # Centralized Axios API client (200+ lines)
│       ├── hooks/
│       │   ├── useAuth.js            # Authentication hooks
│       │   ├── useSongs.js           # Song management
│       │   ├── useAlbums.js          # Album management
│       │   ├── useArtists.js         # Artist data
│       │   └── ...
│       ├── config/
│       │   └── index.js              # Centralized config
│       ├── constants/
│       │   └── index.js              # App constants
│       └── utils/
│           └── helpers.js            # 30+ utility functions
│
├── backend/COMP1069-CNPMNC-BE/       # Node.js Backend
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   ├── nginx.conf                    # Reverse proxy config
│   ├── package.json
│   ├── .env                          # Backend environment
│   └── src/
│       ├── server.js
│       ├── app.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── songController.js
│       │   ├── albumController.js
│       │   ├── userController.js
│       │   └── ...
│       ├── models/
│       │   ├── User.js
│       │   ├── Song.js
│       │   ├── Album.js
│       │   └── ...
│       ├── routes/
│       ├── middleware/
│       ├── services/
│       └── utils/
│
├── docker-compose.yml                # Root compose (all services)
├── Makefile                          # Docker commands
├── README.md
└── PROJECT_STATUS.md                 # This file
```

---

## 🔧 Key Features

### **Frontend**

- ✅ Centralized API service with Axios interceptors
- ✅ Automatic JWT token refresh
- ✅ React Query for caching and state management
- ✅ Custom hooks for all resources (songs, albums, artists, playlists)
- ✅ Path aliases (@components, @hooks, @services, etc.)
- ✅ Vite build optimization with code splitting
- ✅ Responsive design with Tailwind CSS
- ✅ Real-time socket connection
- ✅ 30+ utility helper functions
- ✅ Global constants and configuration

### **Backend**

- ✅ JWT Authentication (Access + Refresh tokens)
- ✅ MongoDB integration with proper models
- ✅ Redis caching layer
- ✅ RabbitMQ for message queuing
- ✅ LocalStack S3 for file storage
- ✅ Rate limiting middleware
- ✅ Comprehensive error handling
- ✅ Environment-based configuration
- ✅ API endpoints for all resources
- ✅ Data validation and sanitization

### **Infrastructure**

- ✅ Multi-stage Docker builds (optimized image sizes)
- ✅ Docker Compose orchestration (7 containers)
- ✅ Health checks for all services
- ✅ Nginx reverse proxy with CORS
- ✅ SPA routing fallback to index.html
- ✅ Static asset caching (30-day expiry)
- ✅ Gzip compression
- ✅ Bridge network for service communication
- ✅ Volume management for data persistence

---

## 🐛 Fixed Issues

### ✅ **Container Health Checks**

- **Problem:** Backend and frontend showing "unhealthy" status
- **Root Cause:** `curl` not available in Alpine/serve images
- **Solution:** Replaced curl-based checks with Node.js HTTP requests
- **Result:** All containers now show healthy status

### ✅ **LocalStack Mount Error**

- **Problem:** `/tmp/localstack` device or resource busy error
- **Root Cause:** Volume mount conflict with init script
- **Solution:** Removed volume mount, use Python HTTP healthcheck instead
- **Result:** LocalStack now starts cleanly and remains healthy

### ✅ **S3 Bucket Creation**

- **Problem:** Buckets not auto-created on startup
- **Solution:** Manual creation via `awslocal s3 mb` commands
- **Result:** Buckets created and persisting properly

---

## 📝 Environment Variables

### **Root (.env)**

```env
# MongoDB
MONGO_URI=mongodb+srv://...

# Redis
REDIS_PASSWORD=redis_password
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379

# RabbitMQ
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672

# AWS/LocalStack
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
S3_BUCKET=music-uploads
AWS_S3_ENDPOINT=http://localstack:4566

# JWT
JWT_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

# Cloudinary, Spotify, Google OAuth, etc.
CLOUDINARY_NAME=...
SPOTIFY_CLIENT_ID=...
# ... more configs
```

### **Frontend (.env.docker)**

```env
VITE_API_URL=http://localhost:80/api
VITE_SOCKET_URL=http://localhost
VITE_APP_NAME=Music Web
```

---

## 🔐 Security Features

- ✅ JWT authentication with token refresh
- ✅ Secure password hashing
- ✅ CORS headers configuration
- ✅ Rate limiting middleware
- ✅ Environment variable protection (no secrets in code)
- ✅ HTTPS support via Nginx (port 443)

---

## 📊 API Endpoints

### **Auth**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Password reset
- `POST /api/auth/verify-email` - Email verification

### **Songs**

- `GET /api/songs` - List songs
- `POST /api/songs` - Upload song
- `GET /api/songs/:id` - Get song details
- `PUT /api/songs/:id` - Update song
- `DELETE /api/songs/:id` - Delete song
- `GET /api/songs/search?q=...` - Search songs

### **Albums**

- `GET /api/albums` - List albums
- `POST /api/albums` - Create album
- `GET /api/albums/:id` - Get album details
- `PUT /api/albums/:id` - Update album
- `DELETE /api/albums/:id` - Delete album

### **Playlists**

- `GET /api/playlists` - List playlists
- `POST /api/playlists` - Create playlist
- `POST /api/playlists/:id/songs` - Add song to playlist
- `DELETE /api/playlists/:id/songs/:songId` - Remove song

### **More** (Likes, Comments, History, Recommendations, User Profile, Search, etc.)

---

## 🧪 Testing Commands

```bash
# Test Backend Health
curl http://localhost:5000/api/health

# Test Frontend
curl http://localhost:5173

# Test via Nginx
curl http://localhost

# Test RabbitMQ
docker-compose exec localstack awslocal s3 ls

# Test Redis
docker-compose exec redis redis-cli -a redis_password PING

# Check Backend Logs
docker-compose logs backend -f

# Check Frontend Logs
docker-compose logs frontend -f

# Check LocalStack Logs
docker-compose logs localstack -f
```

---

## 🛠️ Useful Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View all logs
docker-compose logs -f

# Rebuild images
docker-compose build

# Restart specific service
docker-compose restart backend

# Execute command in container
docker-compose exec backend npm run seed

# Clean up volumes and networks
docker-compose down -v

# Check service status
docker-compose ps

# View specific service logs
docker-compose logs frontend -f --tail 50
```

---

## 📈 Performance Optimizations

- ✅ Multi-stage Docker builds (reduced image size)
- ✅ Alpine Linux images (lightweight)
- ✅ Redis caching layer
- ✅ React Query for efficient data fetching
- ✅ Vite code splitting and lazy loading
- ✅ Nginx gzip compression
- ✅ HTTP cache headers (30-day for static assets)
- ✅ Connection pooling for database
- ✅ Request debouncing and throttling utilities

---

## 🚨 Known Issues & Notes

### **LocalStack**

- S3 buckets must be created manually after first start
- Buckets persist across restarts (data in memory)
- For production, use real AWS S3

### **Database**

- MongoDB uses Atlas (cloud), not local instance
- Ensure MongoDB connection string is valid in `.env`

### **JWT Tokens**

- Access token: Short-lived (15 min recommended)
- Refresh token: Long-lived (7 days recommended)
- Tokens stored in localStorage (frontend)

### **WebSocket**

- Socket.io configured for real-time connections
- Default namespace: `/socket.io`
- Ensure backend listening on correct port

---

## 📞 Support & Troubleshooting

### **Container won't start?**

```bash
# Check logs
docker-compose logs <service_name>

# Rebuild
docker-compose down -v
docker-compose build
docker-compose up -d
```

### **API not responding?**

```bash
# Check backend health
curl http://localhost:5000/api/health

# Check backend logs
docker-compose logs backend -f

# Verify Nginx
curl -v http://localhost:80
```

### **Database connection error?**

```bash
# Check MONGO_URI in .env
# Verify IP whitelist on MongoDB Atlas
# Test connection string
docker-compose exec backend npm run test:db
```

### **Redis issues?**

```bash
# Check Redis
docker-compose exec redis redis-cli PING

# View Redis data
docker-compose exec redis redis-cli
```

---

## ✅ Deployment Checklist

- [x] Frontend builds successfully
- [x] Backend compiles without errors
- [x] All containers run healthy
- [x] Services communicate properly
- [x] Database connections work
- [x] Cache layer functional
- [x] Message queue operational
- [x] S3 buckets created
- [x] JWT authentication working
- [x] API endpoints tested
- [x] Health checks configured
- [x] Environment variables set
- [x] Docker images optimized
- [x] Reverse proxy configured
- [x] CORS headers enabled

---

## 📚 Documentation

- See `README.md` for project overview
- See `DOCKER.md` for Docker setup guide
- See `frontend/README.md` for frontend documentation
- See `backend/COMP1069-CNPMNC-BE/README.md` for backend documentation

---

**Last Updated:** April 23, 2026, 08:15 AM UTC  
**Project Manager:** GitHub Copilot  
**Repository:** COMP1069-CNPMNC-FE  
**Branch:** Upload-Service
