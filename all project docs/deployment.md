
The Free Stack
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Vercel      │────▶│    Render.com   │────▶│    Supabase     │
│  (frontend)     │     │ (FastAPI backend)│     │  (PostgreSQL)   │
│   Free forever  │     │   Free forever  │     │   Free forever  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                  │
                                  ▼
                        ┌─────────────────┐
                        │   Cloudinary    │
                        │ (file uploads)  │
                        │   Free forever  │
                        └─────────────────┘
ServiceWhat it doesFree limitRenderHosts your FastAPI backendFree, sleeps after 15min inactivitySupabasePostgreSQL database500MB storage, 2 projects freeCloudinaryFile/image storage25GB freeVercelHosts your HTML/CSS/JS frontendFree forever

Step 1 — Supabase (PostgreSQL)

Go to supabase.com → sign up → New Project
Give it a name, set a database password, choose a region closest to you
Wait ~2 minutes for it to spin up
Go to Settings → Database → Connection String → URI
Copy it — looks like:

   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres

This is your DATABASE_URL. Save it.

Run your triggers on Supabase:

Go to Supabase → SQL Editor → New Query
Paste the entire contents of migrations/001_add_triggers.sql
Click Run


Step 2 — Render (FastAPI backend)

Go to render.com → sign up with GitHub
New → Web Service → connect your GitHub repo
Fill in these settings:

FieldValueNameunihub-apiEnvironmentPython 3Build Commandpip install -r requirements.txtStart Commanduvicorn app.main:app --host 0.0.0.0 --port $PORTPlanFree

Add environment variables (Environment tab):

   DATABASE_URL=postgresql://postgres:[password]@db.xxxx.supabase.co:5432/postgres
   SECRET_KEY=your-secret-key-min-32-chars
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

Click Create Web Service
Render builds and deploys — you get a URL like:

   https://unihub-api.onrender.com

Important: Render's free tier spins down after 15 minutes of inactivity. The first request after sleeping takes about 30–60 seconds to wake up. This is normal on the free plan.


Step 3 — Cloudinary (file uploads)

Go to cloudinary.com → sign up free
Dashboard → copy your Cloud Name, API Key, API Secret
Add those 3 values to your Render environment variables (already shown above)
Install the package — add cloudinary to requirements.txt

In your file upload routers replace every local disk write with:
pythonimport cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

# For any file (resources, post images)
result = cloudinary.uploader.upload(
    contents,
    folder="unihub/resources",
    resource_type="auto"
)
public_url = result["secure_url"]

# For avatars (auto crop + face detection)
result = cloudinary.uploader.upload(
    contents,
    folder="unihub/avatars",
    resource_type="image",
    transformation=[
        {"width": 400, "height": 400, "crop": "fill", "gravity": "face"}
    ]
)
public_url = result["secure_url"]
Store public_url in the database. Remove the app.mount("/uploads", ...) line from main.py and remove Pillow from requirements.txt — Cloudinary handles resizing.

Step 4 — Vercel (frontend)

Go to vercel.com → sign up with GitHub
New Project → import your repo
Set Root Directory to unihub (or wherever your index.html is)
Framework Preset: Other
Deploy → you get https://unihub.vercel.app

Create unihub/js/config.js:
javascriptconst CONFIG = {
  BASE_URL: 'https://unihub-api.onrender.com'
};
Add to index.html before api.js:
html<script src="js/config.js"></script>
<script src="js/api.js"></script>
In api.js replace the hardcoded URL:
javascriptconst BASE_URL = CONFIG.BASE_URL;

Step 5 — Lock down CORS
In app/main.py:
pythonapp.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://unihub.vercel.app",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Deployment order
Do it in this exact order or things will break:
1. Supabase first    → get DATABASE_URL
2. Cloudinary        → get cloud name, API key, API secret
3. Render            → deploy backend with all env vars set, tables auto-create on first boot
4. Supabase SQL Editor → run 001_add_triggers.sql
5. Vercel last       → deploy frontend pointing at Render URL