from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session

SQLALCHEMY_DATABASE_URL = "sqlite:///./blogpost.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# ! talk about how I've heard of connection pooling but don't know how it's
# ! implemented, and this is FastAPI's default reccomendation in the docs

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
        # based on the genius dependency usage of yield in fastAPI
    finally:
        # ensures that db connection closes even in case of error
        db.close()
