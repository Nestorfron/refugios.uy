import os
from dotenv import load_dotenv  # type: ignore
from datetime import timedelta

load_dotenv()


class Config:
    # =========================
    # 🧱 BASE
    # =========================
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///app.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-key")

    ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = ENV == "development"


    # =========================
    # 🛢️ SQLALCHEMY (POOL)
    # =========================
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_size": int(os.getenv("DB_POOL_SIZE", 5)),
        "max_overflow": int(os.getenv("DB_MAX_OVERFLOW", 5)),
        "pool_recycle": int(os.getenv("DB_POOL_RECYCLE", 280)),
        "pool_timeout": int(os.getenv("DB_POOL_TIMEOUT", 30)),
        "pool_pre_ping": True
    }


    # =========================
    # 🔐 JWT (MEJORADO)
    # =========================
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=int(os.getenv("JWT_EXPIRES_HOURS", 8))
    )

    JWT_ERROR_MESSAGE_KEY = "error"

    # opcional (para producción)
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"


    # =========================
    # 📧 MAIL
    # =========================
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "true").lower() in ["true", "1", "yes"]

    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

    MAIL_DEFAULT_SENDER = (
        os.getenv("MAIL_DEFAULT_SENDER_NAME", "RefugiosUY"),
        os.getenv("MAIL_DEFAULT_SENDER_EMAIL", "no-reply@refugiosuy.com")
    )


    # =========================
    # 🛡️ SEGURIDAD BÁSICA
    # =========================
    # limitar tamaño de requests (anti abuso)
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", 2 * 1024 * 1024))  # 2MB

    # rate limit config (para usar después con Flask-Limiter)
    RATELIMIT_DEFAULT = os.getenv("RATELIMIT_DEFAULT", "100 per hour")
    RATELIMIT_REPORTES = os.getenv("RATELIMIT_REPORTES", "1 per 3 minutes")


    # =========================
    # 🌍 CORS (opcional mejorar después)
    # =========================
    FRONTEND_URL = os.getenv("FRONTEND_URL", "*")