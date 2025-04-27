from fastapi import APIRouter, Depends, HTTPException, status, Request, Response, Cookie
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
from loguru import logger

from ..db.session import get_db
from ..models.user import User
from ..models.token import Token as TokenModel
from ..schemas.token import Token, RefreshToken
from ..schemas.user import UserCreate, User as UserSchema, UserLogin
from ..core.security import verify_token, create_access_token, create_refresh_token
from ..middleware.rate_limiter import check_login_rate_limit
from ..middleware.csrf import generate_csrf_token, CSRF_COOKIE_NAME

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=Token)
async def login(
    request: Request,
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    # Check rate limiting for login attempts
    check_login_rate_limit(form_data.username)
    
    # Get user from database
    user = db.query(User).filter(User.username == form_data.username).first()
    
    # Check if user exists and password is correct
    if not user or not user.verify_password(form_data.password):
        # Record failed login attempt
        if user:
            user.record_login_attempt(success=False)
            db.commit()
            
            # Check if account is now locked
            if user.is_locked():
                logger.warning(f"Account locked for user {user.username} due to too many failed login attempts")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Account locked due to too many failed login attempts. Try again later.",
                    headers={"WWW-Authenticate": "Bearer"},
                )
        
        logger.warning(f"Failed login attempt for username: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if account is locked
    if user.is_locked():
        logger.warning(f"Login attempt on locked account: {user.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account locked due to too many failed login attempts. Try again later.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        logger.warning(f"Login attempt on inactive account: {user.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user account",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Record successful login
    user.record_login_attempt(success=True)
    db.commit()
    
    # Get client info for token
    user_agent = request.headers.get("User-Agent")
    client_ip = request.client.host if request.client else "unknown"
    
    # Create tokens
    db_token = TokenModel.create_tokens(
        db=db,
        user_id=user.id,
        user_agent=user_agent,
        ip_address=client_ip
    )
    
    # Generate CSRF token
    csrf_response = await generate_csrf_token(request)
    csrf_token = csrf_response.get("csrf_token")
    
    # Set CSRF cookie
    response.set_cookie(
        key=CSRF_COOKIE_NAME,
        value=csrf_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=3600  # 1 hour
    )
    
    # Return tokens
    return {
        "access_token": db_token.access_token,
        "refresh_token": db_token.refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
async def refresh_token(
    request: Request,
    refresh_token_data: RefreshToken,
    db: Session = Depends(get_db)
):
    """
    Refresh access token
    """
    # Verify refresh token
    try:
        payload = verify_token(refresh_token_data.refresh_token, "refresh")
        user_id = payload.get("sub")
        
        if not user_id:
            logger.warning("Refresh token missing user ID")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get token from database
        db_token = db.query(TokenModel).filter(
            TokenModel.refresh_token == refresh_token_data.refresh_token,
            TokenModel.is_revoked == False
        ).first()
        
        if not db_token:
            logger.warning(f"Refresh token not found in database or revoked: {refresh_token_data.refresh_token[:10]}...")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or revoked refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Check if refresh token is expired
        if db_token.is_refresh_token_expired:
            logger.warning(f"Expired refresh token used: {refresh_token_data.refresh_token[:10]}...")
            # Revoke the token
            db_token.is_revoked = True
            db.commit()
            
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get user
        user = db.query(User).filter(User.id == int(user_id)).first()
        
        if not user or not user.is_active:
            logger.warning(f"User not found or inactive: {user_id}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get client info for token
        user_agent = request.headers.get("User-Agent")
        client_ip = request.client.host if request.client else "unknown"
        
        # Revoke old token
        db_token.is_revoked = True
        db.commit()
        
        # Create new tokens
        new_db_token = TokenModel.create_tokens(
            db=db,
            user_id=user.id,
            user_agent=user_agent,
            ip_address=client_ip
        )
        
        # Return new tokens
        return {
            "access_token": new_db_token.access_token,
            "refresh_token": new_db_token.refresh_token,
            "token_type": "bearer"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error refreshing token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.post("/logout")
async def logout(
    request: Request,
    db: Session = Depends(get_db),
    token: str = Cookie(None, alias="access_token")
):
    """
    Logout user by revoking tokens
    """
    if not token:
        return {"message": "Successfully logged out"}
    
    try:
        # Verify token
        payload = verify_token(token, "access")
        user_id = payload.get("sub")
        
        if user_id:
            # Revoke all user tokens
            TokenModel.revoke_all_user_tokens(db, int(user_id))
            logger.info(f"User {user_id} logged out, all tokens revoked")
        
        return {"message": "Successfully logged out"}
    except Exception as e:
        logger.error(f"Error during logout: {e}")
        # Still return success to client
        return {"message": "Successfully logged out"}

@router.post("/register", response_model=UserSchema)
async def register(
    user_create: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user
    """
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user_create.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    existing_email = db.query(User).filter(User.email == user_create.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = User(
        username=user_create.username,
        email=user_create.email,
        full_name=user_create.full_name,
        role=user_create.role
    )
    user.password = user_create.password  # This will hash the password
    
    # Add to database
    db.add(user)
    db.commit()
    db.refresh(user)
    
    logger.info(f"New user registered: {user.username}")
    
    return user

@router.get("/csrf-token")
async def get_csrf_token(request: Request, response: Response):
    """
    Get a new CSRF token
    """
    csrf_response = await generate_csrf_token(request)
    csrf_token = csrf_response.get("csrf_token")
    
    # Set CSRF cookie
    response.set_cookie(
        key=CSRF_COOKIE_NAME,
        value=csrf_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=3600  # 1 hour
    )
    
    return {"csrf_token": csrf_token}