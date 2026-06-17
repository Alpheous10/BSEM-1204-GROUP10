# Production Deployment Prompt — UniHub Full Stack

You have the full UniHub codebase in front of you. Your job is to make it
completely production-ready and deploy it across the free stack defined in the
attached deployment guide. Work through every part below in order. Do not skip
sections. Use your judgment on anything not explicitly stated — if something
looks wrong or incomplete, fix it without being asked.

The credentials and services are already set up:
- Cloudinary account is live (Cloud Name, API Key, API Secret are in the
  attached document)
- The deployment targets are: Render (backend), Supabase (PostgreSQL),
  Cloudinary (files), Vercel (frontend)

---

## PART 1 — Codebase audit before touching anything

Before making any changes, scan the entire codebase and answer these questions
internally (you do not need to output the answers, just use them to guide your work):

1. Does `requirements.txt` include `cloudinary`? If not, add it.
2. Does `requirements.txt` still include `Pillow`? If yes, remove it —
   Cloudinary handles all image resizing.
3. Is there an `app.mount("/uploads", ...)` line in `app/main.py`? If yes,
   remove it — files are no longer served from local disk.
4. Are there any `open(file_path, "wb")` or `os.makedirs("uploads/...")` calls
   in any router? Mark all of them — they will be replaced in Part 3.
5. Is there a `Procfile` in the project root? If not, create one.
6. Is there a `runtime.txt` in the project root? If not, create one.
7. Does `app/main.py` have hardcoded `allow_origins=["*"]`? Mark it — it will
   be updated in Part 5.
8. Is `BASE_URL` hardcoded as `http://localhost:8001` anywhere in the frontend
   JS? Mark all occurrences — they will be replaced in Part 6.

---

## PART 2 — Backend infrastructure files

### 2a. Create `Procfile` in the project root

```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 2b. Create `runtime.txt` in the project root

```
python-3.11.0
```

### 2c. Create `.env.example` in the project root (if it doesn't already exist or update it to reflect all required variables)

```
DATABASE_URL=postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres
SECRET_KEY=your-secret-key-minimum-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://unihub.vercel.app
```

### 2d. Update `requirements.txt`

Make sure the final `requirements.txt` contains exactly these packages
(adjust versions only if a conflict exists — do not downgrade anything that
is already pinned and working):

```
fastapi
uvicorn[standard]
sqlalchemy
psycopg2-binary
python-jose[cryptography]
passlib[argon2]
argon2-cffi
python-multipart
pydantic[email]
python-dotenv
slowapi
alembic
cloudinary
```

Remove `Pillow` if present. Do not add anything else unless a dependency error
requires it.

---

## PART 3 — Replace all local file storage with Cloudinary

This is the most important change. Every place in the codebase that writes a
file to local disk must be replaced with a Cloudinary upload. Do not leave any
local disk writes in place.

### 3a. Create `app/cloudinary_config.py`

This file configures Cloudinary once and exports a ready-to-use uploader.
Every router that uploads files imports from here — credentials are never
repeated elsewhere.

```python
import cloudinary
import cloudinary.uploader
import cloudinary.api
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)


def upload_file(contents: bytes, folder: str, resource_type: str = "auto",
                public_id: str = None, transformation: list = None) -> str:
    """
    Upload raw bytes to Cloudinary. Returns the secure public URL.
    folder:        e.g. "unihub/resources", "unihub/avatars", "unihub/post-images"
    resource_type: "auto" handles PDFs, docs, images; "image" for image-only
    public_id:     optional filename without extension
    transformation: list of transformation dicts (for avatars etc.)
    """
    kwargs = {
        "folder": folder,
        "resource_type": resource_type,
    }
    if public_id:
        kwargs["public_id"] = public_id
    if transformation:
        kwargs["transformation"] = transformation

    result = cloudinary.uploader.upload(contents, **kwargs)
    return result["secure_url"]


def delete_file(public_id: str, resource_type: str = "image") -> None:
    """Delete a file from Cloudinary by its public_id."""
    try:
        cloudinary.uploader.destroy(public_id, resource_type=resource_type)
    except Exception:
        pass  # Non-critical — log in production but don't crash
```

### 3b. Rewrite `app/routers/resources.py`

Replace the entire file. Remove all local disk operations. Use `upload_file`
from `app/cloudinary_config.py`.

```python
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.resource import Resource
from app.models.community import CommunityMember
from app.models.user import User
from app.schemas.resource import ResourceResponse
from app.auth import get_current_user
from app.cloudinary_config import upload_file

router = APIRouter(prefix="/resources", tags=["Resources"])

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".ppt", ".pptx",
                      ".xls", ".xlsx", ".png", ".jpg", ".jpeg",
                      ".gif", ".webp", ".txt"}
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB


def build_resource_response(resource) -> ResourceResponse:
    return ResourceResponse(
        id=resource.id,
        title=resource.title,
        description=resource.description,
        file_name=resource.file_name,
        file_type=resource.file_type,
        file_size=resource.file_size,
        file_url=resource.file_path,   # file_path now stores the Cloudinary URL
        community_id=resource.community_id,
        uploaded_by=resource.uploaded_by,
        created_at=resource.created_at
    )


@router.post("/", response_model=ResourceResponse, status_code=status.HTTP_201_CREATED)
async def upload_resource(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    community_id: Optional[int] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    import os
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type '{ext}' is not allowed")

    if community_id is not None:
        member = db.query(CommunityMember).filter(
            CommunityMember.community_id == community_id,
            CommunityMember.user_id == current_user.id
        ).first()
        if not member:
            raise HTTPException(status_code=403,
                detail="You must join this community to upload resources to it")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 20MB)")

    public_id = f"{uuid.uuid4().hex}"
    cloudinary_url = upload_file(
        contents=contents,
        folder="unihub/resources",
        resource_type="auto",
        public_id=public_id
    )

    resource = Resource(
        title=title,
        description=description,
        file_name=file.filename,
        file_path=cloudinary_url,     # store Cloudinary URL, not a local path
        file_type=ext.lstrip("."),
        file_size=len(contents),
        community_id=community_id,
        uploaded_by=current_user.id
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)

    return build_resource_response(resource)


@router.get("/", response_model=List[ResourceResponse])
def get_resources(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    community_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Resource)
    if community_id is not None:
        query = query.filter(Resource.community_id == community_id)
    resources = query.order_by(Resource.created_at.desc()).offset(skip).limit(limit).all()
    return [build_resource_response(r) for r in resources]


@router.get("/{resource_id}", response_model=ResourceResponse)
def get_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return build_resource_response(resource)


@router.get("/{resource_id}/download")
def download_resource(resource_id: int, db: Session = Depends(get_db)):
    """
    For Cloudinary-hosted files, redirect the client directly to the
    Cloudinary URL rather than proxying the file through the backend.
    """
    from fastapi.responses import RedirectResponse
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return RedirectResponse(url=resource.file_path)


@router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    if resource.uploaded_by != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this resource")

    db.delete(resource)
    db.commit()
```

### 3c. Rewrite the avatar upload endpoint in `app/routers/users.py`

Find the `POST /users/me/avatar` endpoint (or add it if missing). Replace the
entire function with this Cloudinary version. Import `upload_file` at the top
of the file.

```python
@router.post("/me/avatar", response_model=UserResponse)
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    import os
    ALLOWED = {".jpg", ".jpeg", ".png", ".webp"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, and WebP images are allowed")

    contents = await file.read()
    if len(contents) > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large (max 2MB)")

    cloudinary_url = upload_file(
        contents=contents,
        folder="unihub/avatars",
        resource_type="image",
        public_id=f"user_{current_user.id}_{uuid.uuid4().hex[:8]}",
        transformation=[
            {"width": 400, "height": 400, "crop": "fill", "gravity": "face"}
        ]
    )

    current_user.avatar_url = cloudinary_url
    db.commit()
    db.refresh(current_user)
    return current_user
```

Add `import uuid` at the top of `users.py` if not already present.

### 3d. Rewrite the post image upload endpoint

Find `POST /posts/upload-image` (or add it to `app/routers/posts.py` if
missing). Replace with:

```python
@router.post("/upload-image")
async def upload_post_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    import os, uuid
    ALLOWED = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED:
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large (max 5MB)")

    cloudinary_url = upload_file(
        contents=contents,
        folder="unihub/post-images",
        resource_type="image",
        public_id=f"post_{current_user.id}_{uuid.uuid4().hex[:8]}"
    )

    return {"image_url": cloudinary_url}
```

Add the import at the top of `posts.py`:
```python
from fastapi import UploadFile, File
from app.cloudinary_config import upload_file
```

### 3e. Remove all local disk artifact code from `app/main.py`

Remove these lines entirely:
```python
os.makedirs("uploads/resources", exist_ok=True)
os.makedirs("uploads/avatars", exist_ok=True)
os.makedirs("uploads/post-images", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
```

Also remove `from fastapi.staticfiles import StaticFiles` if it's only used
for the uploads mount. Remove `import os` from main.py if it's no longer used
after these removals.

---

## PART 4 — Database hardening for production (Supabase)

### 4a. Add connection pool settings for Supabase

Supabase uses a connection pooler (PgBouncer). Replace `app/database.py` with:

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Supabase connection pool settings
# pool_pre_ping keeps connections alive through Supabase's idle-timeout resets
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=300,
    connect_args={
        "sslmode": "require",
        "connect_timeout": 10,
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 4b. Add a health check that tests the database

In `app/main.py`, replace the basic `/health` endpoint with:

```python
@app.get("/health", tags=["Health"])
async def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail=f"Database unavailable: {str(e)}")
```

Add at the top of `main.py`:
```python
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import get_db
```

---

## PART 5 — CORS and security hardening

### 5a. Update CORS in `app/main.py`

Replace the `allow_origins=["*"]` configuration with environment-driven origins:

```python
import os

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5500")

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
```

### 5b. Add global exception handler for unhandled errors

Add this to `app/main.py` after the limiter setup so production errors
return JSON instead of HTML stack traces:

```python
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."}
    )
```

### 5c. Add request logging middleware

Add this middleware to `app/main.py` — it logs every request with its method,
path, and response time, which is essential for debugging production issues:

```python
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    logger.info(f"{request.method} {request.url.path} → {response.status_code} ({duration}ms)")
    return response
```

---

## PART 6 — Frontend production config

### 6a. Create `unihub/js/config.js`

```javascript
const CONFIG = {
  // In production this points to your Render backend URL.
  // For local development, change this to http://localhost:8001
  BASE_URL: 'https://unihub-api.onrender.com',
};
```

### 6b. Update every HTML file in `unihub/`

For every `.html` file in the `unihub/` folder, find where `api.js` is loaded
and add `config.js` immediately before it:

```html
<script src="js/config.js"></script>
<script src="js/api.js"></script>
```

If the HTML files use a relative path like `../js/api.js`, match that pattern
for `config.js` as well.

### 6c. Update `unihub/js/api.js`

Find the line that sets `BASE_URL` (it will be something like
`const BASE_URL = 'http://localhost:8001'` or `http://127.0.0.1:8001`).
Replace it with:

```javascript
const BASE_URL = CONFIG.BASE_URL;
```

Do not change anything else in `api.js`.

### 6d. Create `unihub/vercel.json`

This tells Vercel to serve `index.html` for all routes so the SPA router
works correctly without 404s on direct URL access:

```json
{
  "rewrites": [
    { "source": "/((?!js|css|images|fonts|favicon).*)", "destination": "/index.html" }
  ]
}
```

---

## PART 7 — Keep Render awake (cold start fix)

Render's free tier spins down after 15 minutes of inactivity. Add a self-ping
mechanism to the frontend that wakes the backend up before the user hits it.

In `unihub/js/app.js`, at the very top of the file, before any router code,
add:

```javascript
// Ping the backend on app load to wake Render from sleep.
// This runs silently in the background — no UI impact.
(function pingBackend() {
  fetch(`${CONFIG.BASE_URL}/health`, { method: 'GET' })
    .then(() => console.log('Backend is awake'))
    .catch(() => console.log('Backend waking up...'));
})();
```

---

## PART 8 — Final `app/main.py`

After all the changes above, `app/main.py` should look exactly like this.
Rewrite it completely to make sure nothing is missing or duplicated:

```python
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
```

---

## PART 9 — Git commit and push

After all code changes are complete:

```bash
git add .
git commit -m "feat: production deployment - Cloudinary storage, Supabase DB, CORS hardening, request logging"
git push origin main
```

If there are merge conflicts, resolve them by keeping the new production-ready
versions of each file.

---

## PART 10 — Deployment checklist (verify manually after pushing)

Go through this yourself after the push. Do not mark something done unless you
have actually verified it:

**Supabase:**
- [ ] Project is created and DATABASE_URL is copied
- [ ] SQL Editor → `migrations/001_add_triggers.sql` has been run and returned no errors

**Render:**
- [ ] Web service is connected to the GitHub repo
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] All 7 environment variables are set: `DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `FRONTEND_URL`
- [ ] First deploy completes with no errors (check the Render build logs)
- [ ] `GET https://unihub-api.onrender.com/health` returns `{"status": "ok", "database": "connected"}`
- [ ] `GET https://unihub-api.onrender.com/docs` loads the Swagger UI

**Cloudinary:**
- [ ] Cloud Name, API Key, API Secret match what is in Render's environment variables
- [ ] Test a file upload via Swagger UI's `POST /resources/` endpoint
- [ ] Confirm the returned `file_url` starts with `https://res.cloudinary.com/`

**Vercel:**
- [ ] Project imported from GitHub, root directory set to `unihub/`
- [ ] Framework preset set to "Other"
- [ ] `FRONTEND_URL` on Render is updated to the actual Vercel URL after first deploy
- [ ] `unihub/js/config.js` `BASE_URL` matches the actual Render URL
- [ ] Login works end-to-end from the Vercel frontend to the Render backend
- [ ] Profile picture upload works and the saved URL starts with `https://res.cloudinary.com/`

---

## PART 11 — After deployment: seed communities

The platform starts empty. Once the deployment is verified, register the first
admin account via the Swagger UI on Render, then run this in Supabase's SQL
Editor to promote it to admin and seed the starter communities:

```sql
-- Promote first user to admin (replace 'your_username' with actual username)
UPDATE users SET is_admin = TRUE WHERE username = 'your_username';
```

Then via Swagger UI (authorized as admin), call `POST /communities/` for each:
```json
{ "name": "Software Engineering", "description": "SE discussions, notes and resources", "icon": "💻" }
{ "name": "Database Systems", "description": "DB concepts, SQL, and coursework", "icon": "🗄️" }
{ "name": "Networking", "description": "Protocols, labs and past papers", "icon": "🌐" }
{ "name": "Artificial Intelligence", "description": "AI, ML and research papers", "icon": "🤖" }
{ "name": "Final Year Project", "description": "FYP support, proposals and advice", "icon": "🎓" }
```