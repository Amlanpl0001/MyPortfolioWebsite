from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import sys
from loguru import logger
import time
from datetime import datetime

from .db.session import engine, Base
from .api import auth
from .middleware.rate_limiter import rate_limit_middleware
from .middleware.csrf import csrf_protect_middleware
from .core.security import get_current_user, sanitize_html

# Configure logging
logger.remove()
logger.add(
    sys.stdout,
    colorize=True,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level=os.getenv("LOG_LEVEL", "INFO")
)
logger.add(
    "logs/app.log",
    rotation="10 MB",
    retention="30 days",
    compression="zip",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
    level=os.getenv("LOG_LEVEL", "INFO")
)

# Create tables only if they don't exist
from sqlalchemy import inspect
inspector = inspect(engine)
if not inspector.has_table("users", schema="app_schema"):
    logger.info("Creating database tables")
    Base.metadata.create_all(bind=engine)
else:
    logger.info("Database tables already exist")

# Create FastAPI app
app = FastAPI(
    title="Portfolio API",
    description="API for Portfolio Website with enhanced security",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
origins = os.getenv("CORS_ORIGINS", "https://localhost").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-CSRF-Token"],
)

# Add rate limiting middleware
@app.middleware("http")
async def rate_limiting(request: Request, call_next):
    return await rate_limit_middleware(request, call_next)

# Add CSRF protection middleware
@app.middleware("http")
async def csrf_protection(request: Request, call_next):
    return await csrf_protect_middleware(request, call_next)

# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    # Get client info
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("User-Agent", "unknown")

    # Log request
    logger.info(f"Request: {request.method} {request.url.path} from {client_ip} ({user_agent})")

    # Process request
    response = await call_next(request)

    # Calculate processing time
    process_time = time.time() - start_time

    # Log response
    logger.info(f"Response: {request.method} {request.url.path} - Status: {response.status_code} - Time: {process_time:.4f}s")

    # Add processing time header
    response.headers["X-Process-Time"] = str(process_time)

    return response

# Add security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)

    # Add security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"

    # Add Content-Security-Policy header
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; form-action 'self';"

    return response

# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."}
    )

# Include routers
app.include_router(auth.router, prefix="/api")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Portfolio API",
        "docs": "/docs",
        "redoc": "/redoc",
        "timestamp": datetime.utcnow().isoformat()
    }

# Health check endpoint
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat()
    }

# Protected endpoint example
@app.get("/api/protected")
async def protected_route(current_user = Depends(get_current_user)):
    return {
        "message": "This is a protected endpoint",
        "user": current_user.username,
        "timestamp": datetime.utcnow().isoformat()
    }

# Content sanitization example
@app.post("/api/sanitize")
async def sanitize_content(content: dict, current_user = Depends(get_current_user)):
    if "html" not in content:
        return {"error": "No HTML content provided"}

    sanitized = sanitize_html(content["html"])
    return {"sanitized": sanitized}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
