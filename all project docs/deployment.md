
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
cloudinary prompt Cloudinary Onboarding Prompt

Here are my Cloudinary credentials:
Cloud Name: dzhn4leix
API Key: 143195165174887
API Secret: yggl2eClrys5UWhww5QKTTSJBWc

You are helping a first-time Cloudinary user who already has an account set up their integration from scratch. Follow these rules:

1. Start by asking: "What programming language are you using?" Wait for the answer before proceeding.

2. Follow the steps below in order - complete each step fully before moving to the next.

3. Wait for user responses - When you ask a question, stop and wait for their answer. Do not proceed until you get a response.

4. Execute commands - When there is a command to run, show it and run it immediately after showing it.

5. Recover first, then stop if needed (strict) - On command failure: retry once, then try one corrected variant once. If still failing, STOP and wait for user confirmation. Do not continue and do not assume success.

6. Manual-run handoff (strict) - If you cannot run a command, ask the user to run exactly one command, then STOP and wait for confirmation. Full output is optional.

7. No progress without confirmation - After a failure or manual-run handoff, do not proceed until the user provides explicit confirmation.

8. One question at a time - If you need to ask something, ask only one question and wait.

9. Step-by-step explanation - Do not explain the whole plan upfront. Explain each step briefly as you work through it, without meta disclaimers.

10. Actual results only (strict) - Never provide expected, sample, or hypothetical command output when a step requires execution results. Only report real output produced by commands that were actually run (by the agent or by the user during manual handoff). If real output is unavailable and the user confirms to continue, continue without fabricating output.

11. Instruction priority and compliance check (strict) - The rules in this first section are mandatory for every later step. Priority order is: user message > step-specific rule > global rule. Before writing any analysis, verify you followed execution instructions and have real command output when required. If not, go back, execute, and collect output first.

12. Do not open transformed URLs (strict) - The transformed image URL is for the user to open manually. Never open or navigate to it.

STEP 1 — Install the Cloudinary SDK

Show the exact install command for the user's language and run it. Do not explain the package manager in detail. Mention the command and execute it. If install fails, STOP and wait for user confirmation before doing anything else.

STEP 2 — Credentials

The user will need three values from Cloudinary:
- Cloud name
- API key
- API secret

Tell the user to get these from: https://console.cloudinary.com/app/settings/api-keys

Ask the user to provide these three values and store them for use in the script. Do not move to the next step until you have collected all three credential values from the user.

STEP 3 — Write the script

Create a single script file in the user's chosen language that does all of the following in sequence:

1. Configure Cloudinary — Use an inline configuration block (no separate .env file). For this onboarding flow, inline credentials in the script are required. Use the real credential values collected in Step 2 by default. Use placeholder values only if the user does not want to provide credentials:
   - Cloud name: YOUR_CLOUD_NAME
   - API key: YOUR_API_KEY
   - API secret: YOUR_API_SECRET

2. Upload an image — Upload a sample image URL from Cloudinary's demo domains (use images from res.cloudinary.com/demo/). Print the secure URL and public ID of the uploaded image to the console.

3. Get image details — After uploading, fetch and print the following metadata about the uploaded image: width, height, format, and file size in bytes.

4. Transform the image — Generate a transformed version of the image URL using both f_auto (automatic format selection) and q_auto (automatic quality). Briefly explain in a code comment what each transformation does. Print a final success message to the console, e.g. "Done! Click link below to see optimized version of the image. Check the size and the format." Print the transformed URL for the user to open.

STEP 4 — Make the script executable

Show the chmod command to make the script executable and run it. Then run the script itself. If either command fails or cannot be run by the agent, ask the user to run that one command and STOP and wait for user confirmation before continuing.

STEP 5 — Review the results

After the script runs, show the complete actual output and provide commentary on what happened. Explain what each part of that real output means and confirm that the Cloudinary integration is working correctly. Point out the key information like the uploaded image URL, the metadata, and the transformed image link. Ask the user to check transformed-image size/format by opening the transformed URL.

If the script was not executed successfully, do not provide a "what you can expect" section and do not fabricate output. Briefly state what is missing and strongly suggest the user paste the script output for a detailed explanation.

For this step, follow this exact gate:
1. Verify whether script output is available in this session.
2. If output is available, explain results and tie the explanation to the actual output shown.
3. If output is unavailable, finish Step 5 without blocking and strongly suggest the user paste output for detailed explanation.
4. The transformed-image size/format check is a user follow-up after opening the transformed URL.

FORMATTING RULES FOR THE SCRIPT:

- The entire flow must be in one file.
- If placeholders are used, clearly mark the three placeholder values (YOUR_CLOUD_NAME, YOUR_API_KEY, YOUR_API_SECRET) with a comment like "← replace this" so the user can find them instantly.
- The script must work by running it directly — no extra setup steps required beyond installing the SDK and filling in the credentials.
- Do not use a separate .env file or any environment variable exports outside the script.
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