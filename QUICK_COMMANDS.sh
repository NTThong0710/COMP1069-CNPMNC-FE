#!/bin/bash
# Quick Commands Reference for Music Web Platform
# Save as: /home/quocthoaii/music-web/QUICK_COMMANDS.sh

# ============================================
# BASIC OPERATIONS
# ============================================

# Start all services
start() {
  cd /home/quocthoaii/music-web
  docker-compose up -d
  echo "✅ All services started"
}

# Stop all services
stop() {
  cd /home/quocthoaii/music-web
  docker-compose down
  echo "✅ All services stopped"
}

# Check status
status() {
  cd /home/quocthoaii/music-web
  docker-compose ps
}

# View logs
logs() {
  cd /home/quocthoaii/music-web
  docker-compose logs -f "$1"
}

# ============================================
# SETUP & INITIALIZATION
# ============================================

# Initialize LocalStack S3 buckets
init_s3() {
  cd /home/quocthoaii/music-web
  echo "Creating music-uploads bucket..."
  docker-compose exec localstack awslocal s3 mb s3://music-uploads --region ap-southeast-1
  
  echo "Creating music-avatars bucket..."
  docker-compose exec localstack awslocal s3 mb s3://music-avatars --region ap-southeast-1
  
  echo "✅ S3 buckets created"
  list_s3
}

# List S3 buckets
list_s3() {
  cd /home/quocthoaii/music-web
  docker-compose exec localstack awslocal s3 ls
}

# ============================================
# BACKEND COMMANDS
# ============================================

# Start backend shell
backend_shell() {
  cd /home/quocthoaii/music-web
  docker-compose exec backend /bin/sh
}

# Backend logs
backend_logs() {
  cd /home/quocthoaii/music-web
  docker-compose logs -f backend --tail 50
}

# Run backend tests
backend_test() {
  cd /home/quocthoaii/music-web
  docker-compose exec backend npm test
}

# Seed admin user
backend_seed() {
  cd /home/quocthoaii/music-web
  docker-compose exec backend node seedAdmin.js
}

# ============================================
# FRONTEND COMMANDS
# ============================================

# Start frontend shell
frontend_shell() {
  cd /home/quocthoaii/music-web
  docker-compose exec frontend /bin/sh
}

# Frontend logs
frontend_logs() {
  cd /home/quocthoaii/music-web
  docker-compose logs -f frontend --tail 50
}

# ============================================
# DATABASE & CACHE
# ============================================

# Redis CLI
redis_cli() {
  cd /home/quocthoaii/music-web
  docker-compose exec redis redis-cli -a redis_password
}

# Check Redis status
redis_ping() {
  cd /home/quocthoaii/music-web
  docker-compose exec redis redis-cli -a redis_password PING
}

# ============================================
# TESTING & HEALTH CHECKS
# ============================================

# Test backend health
health_backend() {
  echo "Testing Backend..."
  curl -s http://localhost:5000/api/health || echo "❌ Backend not responding"
}

# Test frontend health
health_frontend() {
  echo "Testing Frontend..."
  curl -s http://localhost:5173 > /dev/null && echo "✅ Frontend healthy" || echo "❌ Frontend not responding"
}

# Test via Nginx
health_nginx() {
  echo "Testing Nginx..."
  curl -s http://localhost | head -20
}

# Test RabbitMQ Manager
health_rabbitmq() {
  echo "RabbitMQ Manager: http://localhost:15672"
  echo "Credentials: guest/guest"
}

# Test Redis Commander
health_redis() {
  echo "Redis Commander: http://localhost:8082"
}

# Full health check
health_all() {
  echo "========================================="
  echo "🏥 FULL HEALTH CHECK"
  echo "========================================="
  
  echo ""
  echo "📊 Container Status:"
  status
  
  echo ""
  echo "🔌 Service Health:"
  health_backend
  health_frontend
  health_nginx
  
  echo ""
  echo "📋 Management UIs:"
  echo "   RabbitMQ: http://localhost:15672 (guest/guest)"
  echo "   Redis Commander: http://localhost:8082"
  echo "   LocalStack S3: http://localhost:4566"
  
  echo ""
  echo "========================================="
}

# ============================================
# CLEANUP & MAINTENANCE
# ============================================

# Clean up everything (careful!)
clean_all() {
  echo "⚠️  This will delete all containers and volumes!"
  read -p "Continue? (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd /home/quocthoaii/music-web
    docker-compose down -v
    docker volume prune -f
    echo "✅ Cleaned up"
  fi
}

# Restart all services
restart_all() {
  cd /home/quocthoaii/music-web
  docker-compose restart
  echo "✅ All services restarted"
}

# Rebuild images
rebuild() {
  cd /home/quocthoaii/music-web
  docker-compose build --no-cache
  echo "✅ Images rebuilt"
}

# ============================================
# USEFUL ALIASES
# ============================================

# Add to ~/.bashrc or ~/.zshrc:
# alias music-start='source QUICK_COMMANDS.sh && start'
# alias music-stop='source QUICK_COMMANDS.sh && stop'
# alias music-status='source QUICK_COMMANDS.sh && status'
# alias music-logs='source QUICK_COMMANDS.sh && logs'
# alias music-health='source QUICK_COMMANDS.sh && health_all'

# ============================================
# USAGE EXAMPLES
# ============================================

# Start services
# ./QUICK_COMMANDS.sh start

# Check status
# ./QUICK_COMMANDS.sh status

# View backend logs
# ./QUICK_COMMANDS.sh backend_logs

# Initialize S3
# ./QUICK_COMMANDS.sh init_s3

# Full health check
# ./QUICK_COMMANDS.sh health_all

echo "✅ Quick Commands loaded"
echo ""
echo "Available commands:"
echo "  start              - Start all services"
echo "  stop               - Stop all services"
echo "  status             - Check status"
echo "  logs <service>     - View logs"
echo "  health_all         - Full health check"
echo "  init_s3            - Create S3 buckets"
echo "  backend_logs       - Backend logs"
echo "  frontend_logs      - Frontend logs"
echo "  redis_cli          - Redis CLI"
echo "  rebuild            - Rebuild images"
echo "  clean_all          - Delete everything"
echo ""
