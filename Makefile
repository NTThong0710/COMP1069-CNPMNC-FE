.PHONY: help build up down logs restart clean stop ps health

# ============================================
# DEVELOPMENT COMMANDS
# ============================================

help:
	@echo "Music Web Docker Commands"
	@echo "=========================="
	@echo ""
	@echo "Development:"
	@echo "  make dev              - Start development environment (no frontend)"
	@echo "  make up               - Start all services with Docker Compose"
	@echo "  make down             - Stop all services"
	@echo ""
	@echo "Build & Manage:"
	@echo "  make build            - Build all containers"
	@echo "  make rebuild          - Rebuild all containers (no cache)"
	@echo "  make pull             - Pull latest images"
	@echo ""
	@echo "Logs & Status:"
	@echo "  make logs             - Show logs from all services"
	@echo "  make logs-backend     - Show backend logs"
	@echo "  make logs-frontend    - Show frontend logs"
	@echo "  make ps               - List running containers"
	@echo "  make health           - Check health of all services"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean            - Remove all containers and volumes"
	@echo "  make stop             - Stop all services"
	@echo "  make reset            - Full reset (delete everything)"
	@echo ""
	@echo "Database:"
	@echo "  make redis-cli        - Access Redis CLI"
	@echo "  make mysql-cli        - Access MySQL CLI"

# ============================================
# DEVELOPMENT
# ============================================

dev:
	@echo "🚀 Starting development environment..."
	docker-compose -f backend/COMP1069-CNPMNC-BE/docker-compose.dev.yml up -d
	@echo "✅ Development services started!"
	@echo "Redis: http://localhost:6379"
	@echo "RabbitMQ: http://localhost:15672"
	@echo "LocalStack: http://localhost:4566"

# ============================================
# FULL STACK
# ============================================

up:
	@echo "🚀 Starting all services..."
	docker-compose up -d
	@echo "✅ All services started!"
	@echo ""
	@echo "🌐 Services:"
	@echo "  Frontend: http://localhost:5173"
	@echo "  Backend API: http://localhost:5000"
	@echo "  API Docs: http://localhost:5000/api-docs"
	@echo "  Nginx: http://localhost"
	@echo "  RabbitMQ: http://localhost:15672"
	@echo "  Redis Commander: http://localhost:8082"
	@echo ""
	@make health

up-prod:
	@echo "🚀 Starting production environment..."
	docker-compose -f docker-compose.yml up -d
	@echo "✅ Production services started!"
	@echo "Access: http://localhost"

down:
	@echo "⛔ Stopping all services..."
	docker-compose down
	@echo "✅ All services stopped!"

stop:
	@echo "⛔ Stopping all services..."
	docker-compose stop
	@echo "✅ All services stopped!"

# ============================================
# BUILD
# ============================================

build:
	@echo "🔨 Building all containers..."
	docker-compose build
	@echo "✅ Build complete!"

rebuild:
	@echo "🔨 Rebuilding all containers (no cache)..."
	docker-compose build --no-cache
	@echo "✅ Build complete!"

pull:
	@echo "📥 Pulling latest images..."
	docker-compose pull
	@echo "✅ Images pulled!"

# ============================================
# LOGS & STATUS
# ============================================

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-nginx:
	docker-compose logs -f nginx

logs-redis:
	docker-compose logs -f redis

logs-rabbitmq:
	docker-compose logs -f rabbitmq

ps:
	@echo "📋 Running containers:"
	docker-compose ps

health:
	@echo "🏥 Checking service health..."
	@echo ""
	@echo "Backend:"
	@curl -s http://localhost:5000/api/health || echo "❌ Backend is down"
	@echo ""
	@echo "Frontend:"
	@curl -s http://localhost:5173 > /dev/null && echo "✅ Frontend is running" || echo "❌ Frontend is down"
	@echo ""
	@echo "Redis:"
	@docker-compose exec -T redis redis-cli ping || echo "❌ Redis is down"
	@echo ""
	@echo "RabbitMQ:"
	@curl -s http://localhost:15672/api/aliveness-test/% || echo "❌ RabbitMQ is down"

# ============================================
# CLEANUP
# ============================================

clean:
	@echo "🗑️  Cleaning up..."
	docker-compose down -v --remove-orphans
	@echo "✅ Cleanup complete!"

reset:
	@echo "⚠️  Full reset - removing all data!"
	docker-compose down -v --remove-orphans
	docker system prune -f --volumes
	@echo "✅ Full reset complete!"

remove-images:
	@echo "🗑️  Removing all project images..."
	docker rmi -f music_backend music_frontend music_nginx 2>/dev/null || true
	@echo "✅ Images removed!"

# ============================================
# DATABASE & TOOLS
# ============================================

redis-cli:
	docker-compose exec redis redis-cli -a redis_password

mysql-cli:
	docker-compose exec mongodb mongosh -u admin -p password

rabbitmq-shell:
	docker-compose exec rabbitmq rabbitmqctl

# ============================================
# EXEC COMMANDS
# ============================================

exec-backend:
	docker-compose exec backend sh

exec-frontend:
	docker-compose exec frontend sh

# ============================================
# PRODUCTION
# ============================================

prod-logs:
	docker-compose logs -f

prod-ps:
	docker-compose ps

prod-down:
	@echo "⛔ Stopping production..."
	docker-compose down
	@echo "✅ Production stopped!"

# ============================================
# DOCKER INFO
# ============================================

df:
	@echo "📊 Docker Disk Usage:"
	docker system df

prune:
	@echo "🧹 Pruning Docker system..."
	docker system prune -f
	@echo "✅ Pruned!"

version:
	@echo "📦 Docker versions:"
	docker --version
	docker-compose --version
