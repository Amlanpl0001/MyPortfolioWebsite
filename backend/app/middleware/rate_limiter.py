from fastapi import Request, HTTPException, status
import time
from typing import Dict, Tuple, Optional, Callable
import os
from loguru import logger

# Simple in-memory rate limiter
class RateLimiter:
    def __init__(self):
        self.requests: Dict[str, Tuple[int, float]] = {}  # IP -> (count, start_time)
        self.login_attempts: Dict[str, Tuple[int, float]] = {}  # username -> (count, start_time)
        
        # Rate limits from environment variables or defaults
        self.general_rate_limit = int(os.getenv("GENERAL_RATE_LIMIT", "100"))  # requests per minute
        self.login_rate_limit = int(os.getenv("LOGIN_RATE_LIMIT", "5"))  # login attempts per minute
        self.api_rate_limit = int(os.getenv("API_RATE_LIMIT", "60"))  # API requests per minute
        
        # Window size in seconds
        self.window_size = 60
        
        logger.info(f"Rate limiter initialized with limits: general={self.general_rate_limit}, login={self.login_rate_limit}, api={self.api_rate_limit}")

    def _is_rate_limited(self, key: str, limit: int, storage: Dict[str, Tuple[int, float]]) -> bool:
        """Check if a key is rate limited"""
        current_time = time.time()
        
        if key in storage:
            count, start_time = storage[key]
            
            # Reset if window has passed
            if current_time - start_time > self.window_size:
                storage[key] = (1, current_time)
                return False
            
            # Increment count
            storage[key] = (count + 1, start_time)
            
            # Check if limit exceeded
            return count >= limit
        else:
            # First request
            storage[key] = (1, current_time)
            return False

    def is_ip_rate_limited(self, ip: str, path: str) -> bool:
        """Check if an IP is rate limited based on the path"""
        # Different rate limits for different paths
        if path.startswith("/api/auth/login"):
            return self._is_rate_limited(f"{ip}:login", self.login_rate_limit, self.requests)
        elif path.startswith("/api/"):
            return self._is_rate_limited(f"{ip}:api", self.api_rate_limit, self.requests)
        else:
            return self._is_rate_limited(ip, self.general_rate_limit, self.requests)

    def is_login_rate_limited(self, username: str) -> bool:
        """Check if login attempts for a username are rate limited"""
        return self._is_rate_limited(username, self.login_rate_limit, self.login_attempts)

# Create a global rate limiter instance
rate_limiter = RateLimiter()

# Middleware dependency
async def rate_limit_middleware(request: Request, call_next: Callable):
    """Rate limiting middleware"""
    # Get client IP
    client_ip = request.client.host if request.client else "unknown"
    path = request.url.path
    
    # Check if rate limited
    if rate_limiter.is_ip_rate_limited(client_ip, path):
        logger.warning(f"Rate limit exceeded for IP {client_ip} on path {path}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please try again later."
        )
    
    # Continue with the request
    response = await call_next(request)
    return response

# Login rate limit dependency
def check_login_rate_limit(username: str):
    """Check if login attempts for a username are rate limited"""
    if rate_limiter.is_login_rate_limited(username):
        logger.warning(f"Login rate limit exceeded for username {username}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Please try again later."
        )