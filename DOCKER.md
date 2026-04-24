# 🐳 Docker Setup Guide

Hướng dẫn chi tiết để chạy Music Web Platform với Docker.

## 📋 Requirements

- **Docker**: >= 20.10

  ```bash
  docker --version
  ```

- **Docker Compose**: >= 2.0
  ```bash
  docker-compose --version
  ```

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/your-repo/music-web.git
cd music-web
```

### 2. Setup Environment Variables

Copy file `.env` template:

```bash
cp .env .env.local
```

Edit `.env.local` với các thông tin của bạn:

```env
# Server
NODE_ENV=production
PORT=5000
CLIENT_URL=http://localhost

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret

# Redis
REDIS_PASSWORD=redis_password

# AWS S3
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test

# External APIs
GOOGLE_CLIENT_ID=your_google_client_id
SPOTIFY_CLIENT_ID=your_spotify_client_id
```

### 3. Build Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### 4. Start Services

```bash
# Start all services
docker-compose up -d

# View status
docker-compose ps
```

### 5. Access Services

| Service         | URL                       | Credentials |
| --------------- | ------------------------- | ----------- |
| Frontend        | http://localhost:5173     | -           |
| Backend API     | http://localhost:5000/api | -           |
| Nginx           | http://localhost          | -           |
| RabbitMQ        | http://localhost:15672    | guest/guest |
| Redis Commander | http://localhost:8082     | -           |

## 🛠️ Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Execute Commands

```bash
# Run command in backend
docker-compose exec backend npm install

# Access backend shell
docker-compose exec backend sh

# Run command in frontend
docker-compose exec frontend npm run build
```

### Stop & Restart

```bash
# Stop all services
docker-compose stop

# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Remove orphan containers
docker-compose down --remove-orphans

# Full cleanup
docker system prune -a
```

## 📁 File Structure

```
music-web/
├── backend/
│   └── COMP1069-CNPMNC-BE/
│       ├── Dockerfile              # Backend Docker image
│       ├── docker-compose.yml      # Full stack (deprecated)
│       ├── docker-compose.dev.yml  # Dev environment
│       └── nginx.conf              # Nginx configuration
├── frontend/
│   ├── Dockerfile                  # Frontend Docker image
│   ├── .env                        # Frontend environment
│   ├── .env.production             # Production environment
│   └── .env.docker                 # Docker environment
├── docker-compose.yml              # Main compose file
├── .env                            # Root environment
├── .env.example                    # Environment template
├── Makefile                        # Make commands
└── DOCKER.md                       # This file
```

## 🔄 Docker Compose Files

### `docker-compose.yml` (Main)

Full production stack gồm:

- Redis
- RabbitMQ
- LocalStack
- Backend
- Frontend
- Nginx

```bash
docker-compose up -d
```

### `backend/docker-compose.dev.yml` (Dev Only)

Chỉ infrastructure services:

- Redis
- RabbitMQ
- LocalStack
- Redis Commander

```bash
docker-compose -f backend/COMP1069-CNPMNC-BE/docker-compose.dev.yml up -d
```

## 🐳 Docker Images

### Backend Image

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Build & Run:**

```bash
docker build -t music-backend backend/COMP1069-CNPMNC-BE
docker run -p 5000:5000 -e NODE_ENV=development music-backend
```

### Frontend Image

```dockerfile
FROM node:20-alpine AS builder
# Build stage
RUN npm run build

FROM node:20-alpine
# Production stage with serve
CMD ["serve", "-s", "dist", "-l", "5173"]
```

**Build & Run:**

```bash
docker build -t music-frontend frontend
docker run -p 5173:5173 music-frontend
```

## 🌐 Nginx Reverse Proxy

### Routes

- `/api/*` → Backend:5000
- `/socket.io` → Backend:5000 (WebSocket)
- `/admin` → Frontend:5173
- `/` → Frontend:5173 (SPA)

### Static Assets Caching

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    proxy_cache_valid 200 30d;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

## 🔧 Health Checks

### Verify Services

```bash
# Backend
curl http://localhost:5000/api/health

# Frontend
curl http://localhost:5173

# RabbitMQ
curl http://localhost:15672/api/aliveness-test/%

# Redis
docker-compose exec redis redis-cli ping
```

### Using Makefile

```bash
make health
```

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Check container status
docker-compose ps

# Inspect container
docker inspect <container-id>

# Rebuild
docker-compose build --no-cache backend
```

### Port Already in Use

```bash
# Find process
lsof -i :5000
lsof -i :5173
lsof -i :80

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Cannot Connect to MongoDB

```bash
# Check connection string
echo $MONGO_URI

# Test connection
docker-compose exec backend npm run db:test

# Verify network
docker network inspect music_network
```

### Frontend Can't Connect to Backend

```bash
# Check API URL
docker-compose exec frontend cat /app/dist/index.html | grep VITE_API

# Verify network connectivity
docker-compose exec frontend curl http://backend:5000/api/health

# Check Nginx config
docker-compose exec nginx nginx -t
```

### Out of Memory

```bash
# Check Docker resource usage
docker stats

# Increase Docker memory limit in Docker Desktop settings
# Or on Linux, edit /etc/docker/daemon.json

# Clean up unused images and volumes
docker system prune -a --volumes
```

## 📊 Monitoring

### Real-time Stats

```bash
docker stats
```

### Disk Usage

```bash
docker system df
```

### Image Info

```bash
docker images
```

### Container Info

```bash
docker ps -a
docker inspect <container-id>
```

## 🔒 Security

### Environment Variables

- ❌ Never commit `.env` files
- ✅ Use `.env.example` template
- ✅ Use secrets for sensitive data

### Docker Best Practices

- ✅ Use specific image versions (not `latest`)
- ✅ Run as non-root user in images
- ✅ Use health checks
- ✅ Scan images for vulnerabilities

```bash
docker scan music-backend
```

## 📈 Performance Optimization

### Multi-stage Build

Backend uses multi-stage build để giảm image size:

```dockerfile
FROM node:20-alpine AS builder
# Build stage with devDependencies

FROM node:20-alpine
# Final stage copy từ builder
```

### Caching in Docker Compose

```bash
docker-compose build --no-cache  # Build without cache
docker-compose build             # Use cache
```

### Layer Caching

```dockerfile
# Copy package.json first (cached if no changes)
COPY package*.json ./
RUN npm ci

# Copy source code (rebuild if changed)
COPY . .
```

## 🚀 Deployment

### Development

```bash
make dev
```

### Production

```bash
# Set environment
export NODE_ENV=production
export VITE_ENV=production

# Build and start
docker-compose build
docker-compose up -d

# Check health
make health
```

### CI/CD Integration

```bash
# GitHub Actions example
- name: Build Docker images
  run: docker-compose build

- name: Start services
  run: docker-compose up -d

- name: Run tests
  run: docker-compose exec backend npm test
```

## 📚 Useful Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 🆘 Support

For issues, check:

1. Logs: `docker-compose logs`
2. Health: `make health`
3. Documentation: `DOCKER.md`
4. GitHub Issues: Create an issue

---

Made with ❤️ by Music Web Team
