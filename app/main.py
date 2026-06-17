import os
import time
import logging
from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import engine, Base, get_db
import app.models.user
import app.models.post
import app.models.comment
import app.models.like
import app.models.follow
import app.models.archive
import app.models.community
import app.models.resource
import app.models.assignment
import app.models.project_group
import app.models.announcement
import app.models.notification

from app.routers.auth import router as auth_router
from app.routers.posts import router as posts_router
from app.routers.comments import router as comments_router
from app.routers.likes import router as likes_router
from app.routers.users import router as users_router
from app.routers.feed import router as feed_router
from app.routers.search import router as search_router
from app.routers.admin import router as admin_router
from app.routers.communities import router as communities_router
from app.routers.resources import router as resources_router
from app.routers.assignments import router as assignments_router
from app.routers.project_groups import router as project_groups_router
from app.routers.announcements import router as announcements_router
from app.routers.notifications import router as notifications_router
from app.routers.dashboard import router as dashboard_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base.metadata.create_all(bind=engine)

limiter = Limiter(key_func=get_remote_address)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5500")

app = FastAPI(
    title="UniHub API",
    version="2.0",
    description="Academic Collaboration Platform for Students"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."}
    )


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    logger.info(
        f"{request.method} {request.url.path} → {response.status_code} ({duration}ms)"
    )
    return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(posts_router)
app.include_router(comments_router)
app.include_router(likes_router)
app.include_router(users_router)
app.include_router(feed_router)
app.include_router(search_router)
app.include_router(admin_router)
app.include_router(communities_router)
app.include_router(resources_router)
app.include_router(assignments_router)
app.include_router(project_groups_router)
app.include_router(announcements_router)
app.include_router(notifications_router)
app.include_router(dashboard_router)


@app.get("/")
async def root():
    return {
        "message": "UniHub API is running",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health", tags=["Health"])
async def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={"status": "error", "database": str(e)}
        )
