from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
import app.models.user
import app.models.post
import app.models.comment
import app.models.like

from app.routers.auth import router as auth_router
from app.routers.posts import router as posts_router
from app.routers.comments import router as comments_router
from app.routers.likes import router as likes_router


# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Social Media Post API",
    version="1.0",
    description="SDG 16 - Promoting Peaceful Digital Expression"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(posts_router)
app.include_router(comments_router)
app.include_router(likes_router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to Social Media API",
        "sdg": "SDG 16 - Peace, Justice and Strong Institutions",
        "description": "Building responsible digital spaces for Sierra Leone youth"
    }
