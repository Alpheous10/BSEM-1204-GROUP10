# UniHub Deployment Guide
This guide will walk you through deploying UniHub to Vercel (frontend), Render (backend), Supabase (database), and Cloudinary (file storage).

---

## Prerequisites
- GitHub account
- Supabase account
- Cloudinary account
- Render account
- Vercel account

---

## Step 1: Set Up Supabase (Database)

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com), sign up or log in, and click "New Project".
   - Give your project a name, set a strong database password, and choose a region close to you.
   - Wait ~2 minutes for the project to initialize.

2. **Get your database connection string**
   - Go to your Supabase project → **Settings** → **Database** → **Connection String** → **URI**.
   - Copy the URI (it looks like `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres`).
   - Replace `[YOUR-PASSWORD]` with the password you set for your project.
   - Save this somewhere safe—we'll need it for Render.

3. **Run the database triggers**
   - Go to your Supabase project → **SQL Editor** → **New Query**.
   - Open `migrations/001_add_triggers.sql` in your codebase.
   - Copy the entire contents of that file and paste it into the SQL Editor.
   - Click "Run" to execute the query.

---

## Step 2: Set Up Cloudinary (File Storage)

1. **Get your Cloudinary credentials**
   - Go to [cloudinary.com](https://cloudinary.com), sign up or log in.
   - From your dashboard, copy:
     - **Cloud Name**
     - **API Key**
     - **API Secret**
   - Save these somewhere safe—we'll need them for Render.

---

## Step 3: Deploy Backend to Render

1. **Connect your GitHub repo to Render**
   - Go to [render.com](https://render.com), sign up or log in with GitHub.
   - Click "New +" → "Web Service".
   - Connect your GitHub account and select your UniHub repository.

2. **Configure the web service**
   - **Name**: Choose a name (e.g., `unihub-api`).
   - **Environment**: Select `Python 3`.
   - **Build Command**: Enter `pip install -r requirements.txt`.
   - **Start Command**: Enter `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
   - **Plan**: Choose the **Free** plan.
   - Click "Create Web Service".

3. **Add environment variables**
   - Wait for Render to create your service, then go to **Environment** → **Add Environment Variable**.
   - Add the following variables (use the values you saved earlier):
     - `DATABASE_URL`: Your Supabase database URI
     - `SECRET_KEY`: Generate a long, random string (use at least 32 characters—you can use [random.org](https://www.random.org/strings/) to generate one)
     - `ALGORITHM`: `HS256`
     - `ACCESS_TOKEN_EXPIRE_MINUTES`: `30`
     - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
     - `CLOUDINARY_API_KEY`: Your Cloudinary API key
     - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
     - `FRONTEND_URL`: We'll update this later—for now, use `http://localhost:5500`
   - Click "Save Changes" to restart your service with the new variables.

4. **Get your backend URL**
   - Once your service is deployed (check the logs for "Starting server process"), copy the URL (it looks like `https://unihub-api.onrender.com`).
   - Save this URL—we'll need it for the frontend.

---

## Step 4: Deploy Frontend to Vercel

1. **Update frontend API URL**
   - Open `UniHub/js/config.js` in your codebase.
   - Replace `https://unihub-api.onrender.com` with your actual Render backend URL (if it's different).

2. **Connect your GitHub repo to Vercel**
   - Go to [vercel.com](https://vercel.com), sign up or log in with GitHub.
   - Click "Add New…" → "Project".
   - Select your UniHub repository.

3. **Configure the project**
   - **Root Directory**: Click "Edit" and select `UniHub` (this is where your frontend files are).
   - **Framework Preset**: Select "Other".
   - Leave all other settings as default.
   - Click "Deploy".

4. **Get your frontend URL**
   - Once Vercel finishes deploying, you'll see a URL like `https://unihub-abc123.vercel.app`.
   - Save this URL—we need to update the backend with it.

---

## Step 5: Final Configuration

1. **Update backend FRONTEND_URL**
   - Go back to your Render backend service → **Environment** → **Environment Variables**.
   - Update `FRONTEND_URL` to your Vercel frontend URL (e.g., `https://unihub-abc123.vercel.app`).
   - Click "Save Changes" to restart the backend.

2. **Test the deployment**
   - Open your Vercel frontend URL in a browser.
   - Try signing up, logging in, creating a post, uploading a resource, etc.—everything should work!

---

## Step 6: Seed Communities (Optional)

Once your deployment is fully tested, you can seed the platform with default communities:

1. **Promote your first user to admin**
   - Sign up for an account on your Vercel frontend.
   - Go to your Supabase project → **SQL Editor** → **New Query**.
   - Run this query (replace `your_username` with your actual username):
     ```sql
     UPDATE users SET is_admin = TRUE WHERE username = 'your_username';
     ```

2. **Create communities**
   - Go to your Render backend URL + `/docs` (e.g., `https://unihub-api.onrender.com/docs`).
   - Log in using the "Authorize" button at the top right (use your username and password).
   - Scroll to the `POST /communities/` endpoint.
   - Click "Try it out" and create communities one by one using these examples:
     ```json
     {"name": "Software Engineering", "description": "SE discussions, notes and resources", "icon": "💻"}
     ```
     ```json
     {"name": "Database Systems", "description": "DB concepts, SQL, and coursework", "icon": "🗄️"}
     ```
     ```json
     {"name": "Networking", "description": "Protocols, labs and past papers", "icon": "🌐"}
     ```
     ```json
     {"name": "Artificial Intelligence", "description": "AI, ML and research papers", "icon": "🤖"}
     ```
     ```json
     {"name": "Final Year Project", "description": "FYP support, proposals and advice", "icon": "🎓"}
     ```

---

## Notes

- **Render free tier**: Your backend will sleep after 15 minutes of inactivity. The frontend has a ping to wake it up, so the first request might take a few seconds—this is normal.
- **Supabase free tier**: Gives you 500MB of storage and 2 projects for free.
- **Cloudinary free tier**: Gives you 25GB of storage for free.
- **Vercel free tier**: Perfect for static frontend hosting.

Congratulations! You've successfully deployed UniHub! 🎉
