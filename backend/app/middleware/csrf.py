from fastapi import Request, HTTPException, status, Depends
from fastapi.security import APIKeyCookie
from fastapi_csrf_protect import CsrfProtect
from fastapi_csrf_protect.exceptions import CsrfProtectError
from pydantic import BaseModel
import os
from loguru import logger
from ..core.security import generate_secure_random_string

# CSRF settings
CSRF_SECRET = os.getenv("CSRF_SECRET", generate_secure_random_string(32))
CSRF_COOKIE_NAME = "csrf_token"
CSRF_HEADER_NAME = "X-CSRF-Token"

# CSRF token model
class CsrfSettings(BaseModel):
    secret_key: str = CSRF_SECRET
    cookie_name: str = CSRF_COOKIE_NAME
    header_name: str = CSRF_HEADER_NAME
    cookie_secure: bool = True
    cookie_httponly: bool = True
    cookie_samesite: str = "strict"
    cookie_path: str = "/"
    cookie_domain: str = None
    cookie_max_age: int = 3600  # 1 hour

# Create CSRF protect instance
@CsrfProtect.load_config
def get_csrf_config():
    return CsrfSettings()

# CSRF cookie dependency
csrf_cookie = APIKeyCookie(name=CSRF_COOKIE_NAME, auto_error=False)

# CSRF protection middleware for non-GET requests
async def csrf_protect_middleware(request: Request, call_next):
    """CSRF protection middleware for non-GET, non-HEAD, non-OPTIONS requests"""
    # Skip CSRF check for GET, HEAD, OPTIONS requests
    if request.method in ["GET", "HEAD", "OPTIONS"]:
        response = await call_next(request)
        return response
    
    # Skip CSRF check for API endpoints that use JWT authentication
    if request.url.path.startswith("/api/") and not request.url.path.startswith("/api/auth/"):
        response = await call_next(request)
        return response
    
    # Check CSRF token
    csrf_protect = CsrfProtect()
    try:
        # Get CSRF token from cookie and header
        csrf_cookie_token = request.cookies.get(CSRF_COOKIE_NAME)
        csrf_header_token = request.headers.get(CSRF_HEADER_NAME)
        
        # Validate CSRF token
        if not csrf_cookie_token or not csrf_header_token:
            logger.warning(f"Missing CSRF token for {request.url.path}")
            raise CsrfProtectError("Missing CSRF token")
        
        await csrf_protect.validate_csrf(csrf_header_token, csrf_cookie_token)
        
        # Continue with the request
        response = await call_next(request)
        return response
    except CsrfProtectError as e:
        logger.warning(f"CSRF validation failed for {request.url.path}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CSRF validation failed"
        )

# Generate new CSRF token
async def generate_csrf_token(request: Request):
    """Generate a new CSRF token and set it in a cookie"""
    csrf_protect = CsrfProtect()
    response = {}
    
    # Generate new token
    csrf_token = await csrf_protect.generate_csrf()
    response["csrf_token"] = csrf_token
    
    return response