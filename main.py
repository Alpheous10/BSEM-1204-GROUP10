from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
import models.user

from routers.auth import router as auth_router

from routers.posts import router as posts_router


# create tables
models.user.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Social Media API",
    version="1.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(auth_router)
app.include_router(posts_router)
#app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Social Media API"
    }