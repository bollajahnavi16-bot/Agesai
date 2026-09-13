import os

class Settings:
    PROJECT_NAME: str = "AEGISAI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./aegisai.db")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]
    
    PROJECT_STORAGE_DIR: str = os.getenv("PROJECT_STORAGE_DIR", "./uploads")
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "50"))

settings = Settings()
