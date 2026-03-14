"""Application configuration from environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Load settings from environment."""

    supabase_url: str = ""
    supabase_service_key: str = ""
    tembo_base_url: str = "https://sandbox.temboplus.com"
    tembo_account_id: str = ""
    tembo_secret_key: str = ""
    api_base_url: str = "http://localhost:8000"  # Public URL for webhook callback (use ngrok in dev)

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
