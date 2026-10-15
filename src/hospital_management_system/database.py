from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "mysql+pymysql://root:Madnessplatform%4010@localhost/hospital_management"

engine = create_engine(DATABASE_URL)

Base = declarative_base()

SessionLocal = sessionmaker(bind=engine)

with engine.connect() as connection:
    print("Database connected successfully!")

def get_db():
    
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
