import datetime
import os
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Database URL for local SQLite instance
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fitbuddy.db")

# Create SQLite engine (check_same_thread=False is required for SQLite in multithreaded FastAPI)
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models
Base = declarative_base()


class UserWorkout(Base):
    """
    SQLAlchemy model storing user information, original workout plan,
    revised plan (updated upon user feedback), and nutrition tips.
    The original plan is preserved when an updated plan is saved.
    """
    __tablename__ = "user_workouts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String(64), index=True, nullable=False)
    username = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    weight = Column(Float, nullable=False)
    goal = Column(String(100), nullable=False)
    intensity = Column(String(50), nullable=False)
    
    # Workout plans stored as formatted text or JSON string
    original_plan = Column(Text, nullable=False)
    updated_plan = Column(Text, nullable=True)  # Nullable: filled upon feedback
    nutrition_tip = Column(Text, nullable=False)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def __repr__(self):
        return f"<UserWorkout(id={self.id}, user_id='{self.user_id}', username='{self.username}', goal='{self.goal}')>"


def init_db():
    """
    Initializes database tables if they do not exist already.
    Called on application startup.
    """
    Base.metadata.create_all(bind=engine)


def get_db():
    """
    FastAPI dependency yielding a database session per request
    and ensuring the session is closed after completion.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
