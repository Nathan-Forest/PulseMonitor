from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import asyncio
import httpx
from typing import List, Dict
import json

# Create FastAPI app instance
app = FastAPI(
    title="PulseMonitor API",
    description="DevOps Dashboard for monitoring applications",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, etc.
    allow_headers=["*"],  # Authorization, Content-Type, etc.
)

# In-memory storage
app_status = {}

# Apps to monitor configuration
MONITORED_APPS = [
    {
        "name": "SecureAuth",
        "url": "http://localhost:5000/health",
        "description": "Authentication API"
    },
    {
        "name": "StockTracker", 
        "url": "http://localhost:5001/health",
        "description": "Stock Portfolio Tracker"
    },
    {
        "name": "FinanceHub",
        "url": "http://localhost:5002/health", 
        "description": "Financial Management"
    }
]


# Async function to check app health
async def check_app_health(app: Dict) -> Dict:
    """
    Check if an application is healthy by calling its health endpoint.
    
    Returns:
        dict: Status information (healthy, response time, timestamp)
    """
    start_time = datetime.now()
    
    try:
        # httpx.AsyncClient for async HTTP requests
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(app["url"])
            
            # Calculate response time
            end_time = datetime.now()
            response_time = (end_time - start_time).total_seconds() * 1000  # milliseconds
            
            # Check HTTP status code
            is_healthy = response.status_code < 400
            
            return {
                "name": app["name"],
                "description": app["description"],
                "url": app["url"],
                "status": "healthy" if is_healthy else "unhealthy",
                "response_time": round(response_time, 2),
                "status_code": response.status_code,
                "timestamp": datetime.now().isoformat(),
                "error": None
            }
    
    except Exception as e:
        # Exception handling
        end_time = datetime.now()
        response_time = (end_time - start_time).total_seconds() * 1000
        
        return {
            "name": app["name"],
            "description": app["description"],
            "url": app["url"],
            "status": "down",
            "response_time": round(response_time, 2),
            "status_code": None,
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }


# REST API Endpoint
@app.get("/api/apps")
async def get_apps():
    """Get list of all monitored applications."""
    return {
        "apps": MONITORED_APPS,
        "count": len(MONITORED_APPS)
    }


# Health Check Endpoint
@app.get("/api/health")
async def check_all_health():
    """Check health of all monitored applications."""
    
    # Runs multiple async functions SIMULTANEOUSLY
    health_checks = await asyncio.gather(
        *[check_app_health(app) for app in MONITORED_APPS]
    )
    
    # Store in memory (for WebSocket updates)
    global app_status
    app_status = {check["name"]: check for check in health_checks}
    
    return {
        "timestamp": datetime.now().isoformat(),
        "apps": health_checks
    }


# WebSocket Endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket connection for real-time updates.
    
    Flow:
    1. Client connects
    2. Server accepts connection
    3. Loop forever: check apps → send to client → wait 10s → repeat
    """
    # Accept the connection
    await websocket.accept()
    
    try:
        while True:
            # Check all apps
            health_checks = await asyncio.gather(
                *[check_app_health(app) for app in MONITORED_APPS]
            )
            
            #  Send JSON through WebSocket
            await websocket.send_json({
                "type": "health_update",
                "timestamp": datetime.now().isoformat(),
                "apps": health_checks
            })
            
            # Wait 10 seconds before next check
            await asyncio.sleep(10)
            
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        # Clean up connection
        await websocket.close()


# Root endpoint (health check for THIS API)
@app.get("/")
async def root():
    """API health check."""
    return {
        "service": "PulseMonitor API",
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }


# Main entry point
if __name__ == "__main__":
    import uvicorn
    
    # uvicorn.run starts the server
    uvicorn.run(
        "main:app",  # "filename:app_variable"
        host="0.0.0.0",
        port=8000,
        reload=True  # Auto-reload on code changes
    )