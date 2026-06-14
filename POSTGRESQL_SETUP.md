# PostgreSQL Setup Guide

Complete step-by-step guide to set up PostgreSQL and connect it to the Social Media Post API.

## Table of Contents
1. [Install PostgreSQL](#install-postgresql)
2. [Start PostgreSQL Server](#start-postgresql-server)
3. [Create Database](#create-database)
4. [Verify Connection](#verify-connection)
5. [Configure Application](#configure-application)
6. [Run Application](#run-application)
7. [Troubleshooting](#troubleshooting)

---

## Install PostgreSQL

### Option 1: Using Homebrew (Recommended for macOS)

If you have Homebrew installed:

```bash
brew install postgresql@15
```

If you don't have Homebrew, install it first:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Option 2: Download Installer

Visit [PostgreSQL Downloads](https://www.postgresql.org/download/) and download the installer for your operating system.

### Option 3: Using Docker (Alternative)

If you prefer Docker:

```bash
docker run --name postgres-social-media \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=social_media_db \
  -p 5432:5432 \
  -d postgres:15
```

Then skip to [Verify Connection](#verify-connection).

---

## Start PostgreSQL Server

### On macOS (Homebrew):

**Start PostgreSQL:**
```bash
brew services start postgresql@15
```

**Check if running:**
```bash
brew services list
```

You should see `postgresql@15` with a ✓ mark.

**Stop PostgreSQL (when done):**
```bash
brew services stop postgresql@15
```

### On macOS (from installer):

**Start PostgreSQL:**
- Open Applications → PostgreSQL
- Or use the menu bar icon

### On Windows:

PostgreSQL should start automatically after installation. Check Services in Control Panel.

### On Linux:

```bash
sudo systemctl start postgresql
sudo systemctl status postgresql
```

---

## Create Database

### Using psql Terminal

1. **Open PostgreSQL terminal:**

```bash
psql -U postgres
```

You should see a prompt like:
```
postgres=#
```

2. **Create the database:**

```sql
CREATE DATABASE social_media_db;
```

You should see:
```
CREATE DATABASE
```

3. **Verify database was created:**

```sql
\l
```

You should see `social_media_db` in the list.

4. **Exit psql:**

```sql
\q
```

---

### Alternative: One Command

Create database without entering psql:

```bash
createdb -U postgres social_media_db
```

---

## Verify Connection

### Test Connection from Terminal

```bash
psql -U postgres -d social_media_db -c "SELECT version();"
```

You should see PostgreSQL version information.

### Expected Output:

```
                                                    version
---------------------------------------------------------------------------------------------------------------
 PostgreSQL 15.X on aarch64-apple-darwin23.X.X, compiled by Apple clang version 15.X.X, 64-bit
(1 row)
```

---

## Configure Application

### Step 1: Check .env File

Navigate to your project folder:

```bash
cd /Users/tecxkhalil/BSEM-1204-GROUP10/BSEM-1204-GROUP10
```

Check if `.env` file exists:

```bash
ls -la .env
```

### Step 2: Verify .env Content

Open `.env` and verify it contains:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/social_media_db
SECRET_KEY=your-super-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Step 3: Update if PostgreSQL Password is Different

If you used a different password during installation, update it:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/social_media_db
```

### Finding Your PostgreSQL Password:

If you forgot your password, reset it:

```bash
# On macOS
psql -U postgres -c "ALTER USER postgres PASSWORD 'password';"
```

---

## Install Dependencies

### Step 1: Install Python Packages

```bash
pip install -r requirements.txt
```

Expected packages to install:
- fastapi
- uvicorn
- sqlalchemy
- psycopg2-binary
- python-jose
- passlib
- pydantic
- python-dotenv

### Step 2: Verify Installation

```bash
python -c "import sqlalchemy; print(sqlalchemy.__version__)"
```

You should see a version number like `2.X.X`.

---

## Run Application

### Step 1: Navigate to Project

```bash
cd /Users/tecxkhalil/BSEM-1204-GROUP10/BSEM-1204-GROUP10
```

### Step 2: Start the Server

```bash
uvicorn main:app --reload
```

### Expected Output:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Step 3: Test the API

Open your browser and go to:

```
http://localhost:8000/docs
```

You should see the Swagger UI with all API endpoints.

---

## First Test: Register a User

### Using Swagger UI:

1. Click on **POST /auth/register**
2. Click **Try it out**
3. Fill in the JSON:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```
4. Click **Execute**

### Expected Response (Status 201):

```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com"
}
```

If you see this, **PostgreSQL is connected successfully!** ✅

---

## Verify Database

Check if data was actually saved to PostgreSQL:

```bash
psql -U postgres -d social_media_db -c "SELECT * FROM users;"
```

You should see your test user.

---

## Troubleshooting

### Error: "Connection refused"

**Solution:**
- Make sure PostgreSQL is running: `brew services list`
- Start it: `brew services start postgresql@15`

### Error: "FATAL: database 'social_media_db' does not exist"

**Solution:**
- Create the database:
```bash
createdb -U postgres social_media_db
```

### Error: "FATAL: password authentication failed"

**Solution:**
- Check the password in `.env` matches your PostgreSQL password
- Reset password:
```bash
psql -U postgres -c "ALTER USER postgres PASSWORD 'password';"
```
- Update `.env` with the correct password

### Error: "psycopg2 not found"

**Solution:**
- Install dependencies:
```bash
pip install -r requirements.txt
```

### Error: "ModuleNotFoundError: No module named 'fastapi'"

**Solution:**
- Install all dependencies:
```bash
pip install -r requirements.txt
```

### Error: "Port 8000 already in use"

**Solution:**
- Use a different port:
```bash
uvicorn main:app --reload --port 8001
```

### Port 8000 is already in use (something else using it):

**Solution on macOS:**
```bash
# Find what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Then restart the app
uvicorn main:app --reload
```

### Error: "KeyError: 'DATABASE_URL'" or environment variables not loading

**Solution:**
1. Verify `.env` exists: `ls -la .env`
2. Verify content: `cat .env`
3. If missing, create it:
```bash
cp env.example .env
```

---

## Complete Workflow Checklist

- [ ] PostgreSQL installed
- [ ] PostgreSQL running (`brew services list` shows ✓)
- [ ] Database created (`createdb -U postgres social_media_db`)
- [ ] `.env` file exists with correct `DATABASE_URL`
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] App starts without errors (`uvicorn main:app --reload`)
- [ ] Swagger UI accessible (`http://localhost:8000/docs`)
- [ ] Can register a user successfully
- [ ] User data appears in PostgreSQL

---

## Quick Reference Commands

```bash
# Check PostgreSQL running
brew services list

# Start PostgreSQL
brew services start postgresql@15

# Stop PostgreSQL
brew services stop postgresql@15

# Create database
createdb -U postgres social_media_db

# Connect to database
psql -U postgres -d social_media_db

# Check users table
psql -U postgres -d social_media_db -c "SELECT * FROM users;"

# Check posts table
psql -U postgres -d social_media_db -c "SELECT * FROM posts;"

# Check comments table
psql -U postgres -d social_media_db -c "SELECT * FROM comments;"

# Check likes table
psql -U postgres -d social_media_db -c "SELECT * FROM likes;"

# Install Python dependencies
pip install -r requirements.txt

# Run the application
uvicorn main:app --reload

# Test API
curl http://localhost:8000/

# Reset PostgreSQL password
psql -U postgres -c "ALTER USER postgres PASSWORD 'password';"
```

---

## Need Help?

If you encounter issues:

1. **Check PostgreSQL is running:** `brew services list`
2. **Check `.env` file:** `cat .env`
3. **Check database exists:** `psql -U postgres -l | grep social_media_db`
4. **Check logs:** Look at terminal output when running `uvicorn main:app --reload`
5. **Ask your instructor or group members**

---

## Next Steps

Once PostgreSQL is set up:

1. Install dependencies: `pip install -r requirements.txt`
2. Start PostgreSQL: `brew services start postgresql@15`
3. Run the app: `uvicorn main:app --reload`
4. Test endpoints in Swagger: `http://localhost:8000/docs`
5. Create a user, post, comment, and like to test all features

---

**Last Updated:** May 28, 2026
