# 📊 PulseMonitor

**Real-time Application Health Monitoring Dashboard**

A production-grade DevOps monitoring tool built with Python FastAPI and TypeScript React. PulseMonitor provides real-time health checks, WebSocket-based live updates, and visual status tracking for microservices and web applications.

![PulseMonitor Dashboard](docs/screenshots/dashboard.png)

---

## 🎯 Overview

PulseMonitor is a lightweight monitoring solution designed to track the health and performance of multiple applications from a single dashboard. Built as part of a modern DevOps infrastructure, it demonstrates real-time communication, microservices monitoring, and production-ready architecture patterns.

**Live Features:**
- ✅ Real-time health monitoring via WebSocket
- ✅ Response time tracking
- ✅ HTTP status code reporting
- ✅ Error logging and display
- ✅ Auto-updating dashboard (10-second intervals)
- ✅ Beautiful, responsive UI with Tailwind CSS

---

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **Real-time:** WebSockets
- **HTTP Client:** httpx (async)
- **Server:** Uvicorn (ASGI)

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **Build Tool:** Vite
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** Nginx
- **Network:** Bridge networking

---

## 🚀 Quick Start

### Prerequisites
```bash
Docker & Docker Compose
OR
Python 3.11+, Node.js 18+
```

### Option 1: Docker (Recommended)
```bash
# Clone repository
git clone https://github.com/Nathan-Forest/PulseMonitor.git
cd PulseMonitor

# Start services
docker-compose up -d

# Access dashboard
# http://localhost:5173
```

### Option 2: Local Development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\Activate
pip install -r requirements.txt
python main.py
# Runs on http://localhost:8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 📡 API Endpoints

### REST API
```
GET  /              Health check for PulseMonitor itself
GET  /api/apps      List all monitored applications
GET  /api/health    Check health of all monitored apps
```

### WebSocket
```
WS   /ws            Real-time health updates (10s interval)
```

### Response Format
```json
{
  "timestamp": "2026-03-29T10:00:00",
  "apps": [
    {
      "name": "SecureAuth",
      "status": "healthy",
      "response_time": 45.23,
      "status_code": 200,
      "url": "http://localhost:5000/health",
      "error": null
    }
  ]
}
```

---

## 🔧 Configuration

### Add Applications to Monitor

Edit `backend/main.py`:
```python
MONITORED_APPS = [
    {
        "name": "YourApp",
        "url": "http://localhost:PORT/health",
        "description": "Your app description"
    }
]
```

### Environment Variables
```bash
# Optional - customize behavior
ENVIRONMENT=production
CHECK_INTERVAL=10  # Seconds between health checks
```

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────┐
│              Browser (Client)                    │
│         http://localhost:5173                    │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         Nginx Reverse Proxy (Port 80)           │
│  Routes: / → Frontend, /api → Backend, /ws → WS │
└────────────────┬────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────┐  ┌──────────────────────────────┐
│   Frontend   │  │      Backend API             │
│  (Port 5173) │  │    (Port 8000)               │
│              │  │                              │
│ React + TS   │  │  FastAPI + WebSocket         │
│ Tailwind     │  │  Async Health Checks         │
└──────────────┘  └──────────┬───────────────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │  Monitored Apps       │
                  │  - SecureAuth:5000    │
                  │  - StockTracker:5001  │
                  │  - FinanceHub:5002    │
                  └───────────────────────┘
```

---

## 📊 Features Deep Dive

### Real-time Monitoring
- WebSocket connection for live updates
- No polling required - server pushes updates
- 10-second health check interval
- Automatic reconnection on disconnect

### Health Check Logic
```python
async def check_app_health(app):
    - Makes HTTP GET request to /health endpoint
    - Tracks response time (milliseconds)
    - Captures HTTP status code
    - Handles errors gracefully
    - Returns structured status object
```

### Status Indicators
- 🟢 **Healthy:** Status code 200-299, fast response
- 🟡 **Unhealthy:** Status code 400-499, degraded performance
- 🔴 **Down:** Connection failed, timeout, or 500+ status

---

## 🐳 Docker Deployment

### Production Setup
```yaml
# docker-compose.yml
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    restart: unless-stopped
    
  frontend:
    image: nginx:alpine
    volumes: ["./frontend/dist:/usr/share/nginx/html"]
    ports: ["5173:80"]
    restart: unless-stopped
```

### Build & Deploy
```bash
# Build frontend for production
cd frontend
npm run build

# Start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🔒 Security Considerations

- ✅ CORS configured for specific origins
- ✅ No sensitive data in responses
- ✅ Error handling prevents info leaks
- ✅ WebSocket connections validated
- ✅ Health checks don't expose internal details

**Note:** In production, add:
- SSL/TLS encryption
- Authentication for dashboard access
- Rate limiting on endpoints
- Network segmentation

---

## 📸 Screenshots

### Main Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Healthy Services
![Healthy](docs/screenshots/healthy.png)

### Error State
![Errors](docs/screenshots/errors.png)

---

## 🗺️ Roadmap

**Phase 2 Features:**
- [ ] Historical data storage (PostgreSQL)
- [ ] Response time graphs
- [ ] Alert system (email/Slack notifications)
- [ ] Custom health check intervals per app
- [ ] Authentication & user management
- [ ] Multi-user support
- [ ] Uptime percentage tracking
- [ ] SLA monitoring

**Phase 3 Features:**
- [ ] Kubernetes integration
- [ ] Cloud provider monitoring (AWS, Azure)
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Custom metrics support

---

## 🧪 Testing
```bash
# Backend tests (coming soon)
cd backend
pytest

# Frontend tests (coming soon)
cd frontend
npm test
```

---

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Nathan Forest**

Transitioning from IT Support to Software Engineering, building production-grade applications with modern technologies.

- GitHub: [@Nathan-Forest](https://github.com/Nathan-Forest)
- LinkedIn: [Nathan Forest](https://linkedin.com/in/nathan-forest-australia)

---

## 🙏 Acknowledgments

Built as part of a comprehensive portfolio demonstrating:
- Full-stack development (Python + TypeScript)
- Real-time communication (WebSockets)
- DevOps practices (Docker, monitoring)
- Modern UI development (React + Tailwind)
- Production architecture patterns

**Part of the CloudControl Platform ecosystem** - a personal cloud infrastructure for deploying and managing portfolio applications.

---

## 📚 Related Projects

- [SecureAuth](https://github.com/Nathan-Forest/SecureAuth) - Production authentication API
- [StockTracker](https://github.com/Nathan-Forest/StockTracker) - Python Flask stock portfolio
- [FinanceHub](https://github.com/Nathan-Forest/FinanceHub) - C# financial management

---

**Built with ❤️ and modern DevOps practices**