"""
FitBuddy - AI Fitness Plan Generator
Main Application Entry Point (FastAPI)
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from dotenv import load_dotenv

from app.database import init_db
from app.routes import router

# Load environment variables from .env
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager that handles startup and shutdown.
    Initializes SQLite tables automatically on start.
    """
    # Startup: Ensure database tables are created
    init_db()
    print("FitBuddy database initialized successfully.")
    yield
    # Shutdown logic if needed
    print("FitBuddy shutting down.")


# Initialize FastAPI App
app = FastAPI(
    title="FitBuddy - AI Fitness Plan Generator",
    description="AI-driven 7-day personalized workout plan and nutrition generator using Gemini models.",
    version="1.0.0",
    lifespan=lifespan
)

# Ensure static directories exist before mounting
os.makedirs("static/css", exist_ok=True)
os.makedirs("static/js", exist_ok=True)
os.makedirs("static/assets", exist_ok=True)

# Mount static files (CSS, JS, images)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include FitBuddy modular routes
app.include_router(router)

templates = Jinja2Templates(directory="app/templates")


@app.get("/health")
def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "ok", "app": "FitBuddy", "version": "1.0.0"}


@app.exception_handler(404)
async def custom_404_handler(request: Request, exc):
    """Graceful 404 handler returning styled Jinja2 template or JSON."""
    if "application/json" in request.headers.get("accept", ""):
        return {"error": "Resource not found", "path": str(request.url)}
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "error_message": "Page not found. Redirected to FitBuddy home.",
            "form_data": {}
        },
        status_code=404
    )


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    print(f"Starting FitBuddy on http://{host}:{port}")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
