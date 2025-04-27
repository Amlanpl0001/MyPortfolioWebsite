from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from loguru import logger
from tenacity import retry, stop_after_attempt, wait_fixed

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://app_user:secure_password@db:5432/portfolio")

# Create engine with connection pooling and timeout settings
try:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,  # Check connection before using it
        pool_recycle=300,    # Recycle connections after 5 minutes
        connect_args={"connect_timeout": 10}  # Connection timeout
    )
    logger.info("Database engine created successfully")
except Exception as e:
    logger.error(f"Failed to create database engine: {e}")
    raise

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Dependency to get DB session
@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
def get_db():
    db = SessionLocal()
    try:
        yield db
        logger.debug("Database session closed successfully")
    except Exception as e:
        logger.error(f"Database session error: {e}")
        raise
    finally:
        db.close()