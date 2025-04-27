from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
import os
from ..db.session import Base

class Token(Base):
    __tablename__ = "tokens"
    __table_args__ = {"schema": "app_schema"}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("app_schema.users.id", ondelete="CASCADE"), nullable=False)
    refresh_token = Column(String(255), unique=True, nullable=False, index=True)
    access_token = Column(String(255), unique=True, nullable=False, index=True)
    refresh_token_expires_at = Column(DateTime(timezone=True), nullable=False)
    access_token_expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    is_revoked = Column(Boolean, default=False, nullable=False)
    user_agent = Column(String(255))
    ip_address = Column(String(45))  # IPv6 can be up to 45 chars

    # Relationship
    user = relationship("User", backref="tokens")

    @property
    def is_refresh_token_expired(self):
        return datetime.utcnow() > self.refresh_token_expires_at

    @property
    def is_access_token_expired(self):
        return datetime.utcnow() > self.access_token_expires_at

    @classmethod
    def create_tokens(cls, db, user_id, user_agent=None, ip_address=None):
        """Create new access and refresh tokens for a user"""
        from ..core.security import create_access_token, create_refresh_token
        
        # Get token expiry times from environment variables
        access_token_expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
        refresh_token_expire_days = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
        
        # Calculate expiry times
        access_token_expires = datetime.utcnow() + timedelta(minutes=access_token_expire_minutes)
        refresh_token_expires = datetime.utcnow() + timedelta(days=refresh_token_expire_days)
        
        # Create tokens
        access_token = create_access_token(
            data={"sub": str(user_id)},
            expires_delta=timedelta(minutes=access_token_expire_minutes)
        )
        refresh_token = create_refresh_token(
            data={"sub": str(user_id)},
            expires_delta=timedelta(days=refresh_token_expire_days)
        )
        
        # Create token record
        db_token = cls(
            user_id=user_id,
            access_token=access_token,
            refresh_token=refresh_token,
            access_token_expires_at=access_token_expires,
            refresh_token_expires_at=refresh_token_expires,
            user_agent=user_agent,
            ip_address=ip_address
        )
        
        # Add to database
        db.add(db_token)
        db.commit()
        db.refresh(db_token)
        
        return db_token

    @classmethod
    def revoke_all_user_tokens(cls, db, user_id):
        """Revoke all tokens for a user"""
        db.query(cls).filter(cls.user_id == user_id, cls.is_revoked == False).update(
            {"is_revoked": True}
        )
        db.commit()