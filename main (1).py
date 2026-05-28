from fastapi import FastAPI
from database import engine
import models.user
import models.post
from routers import posts

# Create all database tables
models.user.Base.metadata.create_all(bind=engine)
models.post.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Social Media Post API",
    description="A FastAPI-based Social Media Post API — PROG315 Group Project, Limkokwing University Sierra Leone.",
    version="1.0.0",
)

# Include routers
app.include_router(posts.router)


@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Social Media Post API"}
