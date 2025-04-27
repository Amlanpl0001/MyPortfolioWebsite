from sqlalchemy import Column, Integer, String, DateTime, Boolean, func
from sqlalchemy.sql import expression
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime, timedelta
import uuid
from passlib.hash import argon2
from ..db.session import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "app_schema"}

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    _hashed_password = Column("hashed_password", String(100), nullable=False)
    full_name = Column(String(100))
    role = Column(String(20), nullable=False)
    is_active = Column(Boolean, server_default=expression.true(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    last_login = Column(DateTime(timezone=True))
    failed_login_attempts = Column(Integer, default=0, nullable=False)
    locked_until = Column(DateTime(timezone=True))

    # Password handling with Argon2
    @hybrid_property
    def password(self):
        raise AttributeError("Password is write-only")

    @password.setter
    def password(self, password):
        # Use Argon2 for password hashing (more secure than bcrypt)
        self._hashed_password = argon2.using(
            time_cost=4,      # Increase time cost for better security
            memory_cost=65536, # 64MB
            parallelism=8,    # Use 8 threads
            salt_len=16,      # 16 bytes salt
            hash_len=32       # 32 bytes hash
        ).hash(password)

    def verify_password(self, password):
        return argon2.verify(password, self._hashed_password)

    def record_login_attempt(self, success):
        if success:
            self.failed_login_attempts = 0
            self.locked_until = None
            self.last_login = datetime.utcnow()
        else:
            self.failed_login_attempts += 1
            # Lock account after 5 failed attempts
            if self.failed_login_attempts >= 5:
                # Lock for 15 minutes
                self.locked_until = datetime.utcnow() + timedelta(minutes=15)

    def is_locked(self):
        if self.locked_until and self.locked_until > datetime.utcnow():
            return True
        return False

    def generate_password_reset_token(self):
        return str(uuid.uuid4())