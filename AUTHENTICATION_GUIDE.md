# API Authentication Guide

Complete guide on how to authenticate and authorize with the Social Media Post API using JWT tokens.

## Table of Contents
1. [Authentication Flow](#authentication-flow)
2. [Register a User](#register-a-user)
3. [Login to Get Token](#login-to-get-token)
4. [Using Token in Swagger UI](#using-token-in-swagger-ui)
5. [Using Token with cURL](#using-token-with-curl)
6. [Protected Endpoints](#protected-endpoints)
7. [Troubleshooting](#troubleshooting)

---

## Authentication Flow

```
1. Register User (no auth needed)
   ↓
2. Login with credentials (username & password)
   ↓
3. Receive JWT Token
   ↓
4. Use token to access protected endpoints (Create Post, Like, Comment, etc)
   ↓
5. Token expires in 30 minutes (configured in .env)
```

---

## Register a User

### Using Swagger UI:

1. Open http://localhost:8001/docs
2. Click **POST /auth/register**
3. Click **Try it out**
4. Enter this JSON:
```json
{
  "username": "khalil",
  "email": "khalil@example.com",
  "password": "mypassword123"
}
```
5. Click **Execute**

### Expected Response (201 Created):
```json
{
  "id": 1,
  "username": "khalil",
  "email": "khalil@example.com"
}
```

### Using cURL:
```bash
curl -X POST "http://localhost:8001/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "khalil",
    "email": "khalil@example.com",
    "password": "mypassword123"
  }'
```

---

## Login to Get Token

### Using Swagger UI:

1. Click **POST /auth/login**
2. Click **Try it out**
3. Enter the SAME credentials you just registered:
```json
{
  "username": "khalil",
  "email": "khalil@example.com",
  "password": "mypassword123"
}
```
4. Click **Execute**

### Expected Response (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJraGFsaWwiLCJleHAiOjE3MTcwODY3NzV9.abc123...",
  "token_type": "bearer"
}
```

**Copy the entire `access_token` value** - you'll need it!

### Using cURL:
```bash
curl -X POST "http://localhost:8001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "khalil",
    "email": "khalil@example.com",
    "password": "mypassword123"
  }'
```

---

## Using Token in Swagger UI

### Method 1: Using Authorize Button (Easiest)

1. **Get your token first** (follow steps above)
2. At the top of Swagger page, click the **🔓 Authorize** button
3. Paste your token in the text box:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJraGFsaWwiLCJleXAiOjE3MTcwODY3NzV9.abc123...
```
4. Click **Authorize**
5. Click **Close**

Now you can use any **protected endpoint** (those with a lock icon 🔒):
- POST /posts/ (create post)
- PUT /posts/{post_id} (update post)
- DELETE /posts/{post_id} (delete post)
- POST /comments/ (create comment)
- POST /likes/{post_id} (like post)
- DELETE /likes/{post_id} (unlike post)

### Method 2: Manual Authorization (Alternative)

If the Authorize button doesn't work:

1. Click a protected endpoint (e.g., **POST /posts/**)
2. Click **Try it out**
3. Look for an **Authorization** header field
4. Enter: `Bearer YOUR_TOKEN_HERE`

Example:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJraGFsaWwiLCJleHAiOjE3MTcwODY3NzV9.abc123...
```

---

## Using Token with cURL

### Create a Post (Protected Endpoint):

```bash
curl -X POST "http://localhost:8001/posts/" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWthcnIiLCJleHAiOjE3ODAwMDc0MjJ9.oZBdOdaCBa1DF75HVDm5vDvMgQY_BDzK8MXjQHoVgqA" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "Hello Sierra Leone!"
  }'
```

Replace `YOUR_TOKEN_HERE` with your actual token from login.

### Like a Post:

```bash
curl -X POST "http://localhost:8001/likes/1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create a Comment:

```bash
curl -X POST "http://localhost:8001/comments/?post_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great post!"
  }'
```

---

## Protected Endpoints

These endpoints **require authentication** (JWT token):

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/posts/` | Create a post |
| PUT | `/posts/{post_id}` | Update your post |
| DELETE | `/posts/{post_id}` | Delete your post |
| POST | `/comments/` | Create a comment |
| POST | `/likes/{post_id}` | Like a post |
| DELETE | `/likes/{post_id}` | Unlike a post |

---

## Public Endpoints

These endpoints **do NOT require authentication**:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and get token |
| GET | `/posts/` | Get all posts |
| GET | `/posts/{post_id}` | Get single post |
| GET | `/comments/post/{post_id}` | Get post comments |
| GET | `/` | Root endpoint |

---

## Troubleshooting

### Error: "Could not validate credentials"

**Problem:** Invalid or expired token

**Solution:**
1. Login again to get a new token
2. Use the new token
3. Make sure you copied the entire token (it's very long!)

### Error: "Incorrect username or password"

**Problem:** Wrong username or password during login

**Solution:**
1. Double-check your username and password
2. Make sure they match what you registered with
3. Usernames are **case-sensitive**

### Error: "Username already registered"

**Problem:** Trying to register with a username that already exists

**Solution:**
- Use a different username
- Or login with that username instead

### Error: "Email already registered"

**Problem:** Trying to register with an email that's already registered

**Solution:**
- Use a different email
- Or login with that email's account

### Token Not Working After 30 Minutes

**Problem:** JWT token expires after 30 minutes (configured in `.env`)

**Solution:**
- Login again to get a fresh token
- All tokens last 30 minutes from creation

### Authorization Button Not Showing

**Problem:** The 🔓 Authorize button is not visible in Swagger

**Solution:**
1. Refresh the page: `http://localhost:8001/docs`
2. Or use manual headers method (see above)

### "Bearer not working"

**Problem:** Using just the token instead of "Bearer TOKEN_HERE"

**Solution:**
Always include `Bearer` prefix:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJraGFsaWwiLCJleHAiOjE3MTcwODY3NzV9.abc123...
```

NOT just:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJraGFsaWwiLCJleHAiOjE3MTcwODY3NzV9.abc123...
```

---

## Complete Example Workflow

### Step 1: Register
```bash
curl -X POST "http://localhost:8001/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "khalil",
    "email": "khalil@example.com",
    "password": "mypassword123"
  }'
```

Response:
```json
{
  "id": 1,
  "username": "khalil",
  "email": "khalil@example.com"
}
```

### Step 2: Login
```bash
curl -X POST "http://localhost:8001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "khalil",
    "email": "khalil@example.com",
    "password": "mypassword123"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Step 3: Create Post (Using Token)
```bash
curl -X POST "http://localhost:8001/posts/" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "Hello Sierra Leone!"
  }'
```

Response:
```json
{
  "id": 1,
  "title": "My First Post",
  "content": "Hello Sierra Leone!",
  "user_id": 1,
  "created_at": "2026-05-28T21:32:50",
  "updated_at": "2026-05-28T21:32:50"
}
```

### Step 4: Like the Post
```bash
curl -X POST "http://localhost:8001/likes/1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Response:
```json
{
  "message": "Post liked successfully"
}
```

### Step 5: Create Comment
```bash
curl -X POST "http://localhost:8001/comments/?post_id=1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great post!"
  }'
```

Response:
```json
{
  "id": 1,
  "content": "Great post!",
  "post_id": 1,
  "user_id": 1,
  "created_at": "2026-05-28T21:35:10"
}
```

---

## JWT Token Explained

A JWT token looks like: `eyJhbGc...eyJzdWI...abc123...`

It has 3 parts separated by dots:
1. **Header**: Encryption algorithm (HS256)
2. **Payload**: User data (username, expiration)
3. **Signature**: Security hash to verify it's valid

**Important:**
- Tokens are **not encrypted**, just encoded
- Tokens **cannot be modified** (signature prevents tampering)
- Tokens **automatically expire** after 30 minutes (check `.env`)
- Keep your token **private** - treat it like a password!

---

## Token Expiration

Tokens expire after **30 minutes** (default, configured in `.env`):

```
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

To change:
1. Edit `.env`
2. Change `ACCESS_TOKEN_EXPIRE_MINUTES=60` (for 1 hour)
3. Restart app

---

## Summary

| Task | Steps |
|------|-------|
| **Register** | POST `/auth/register` with username, email, password |
| **Login** | POST `/auth/login` with username, password → Get token |
| **Authorize** | Click Authorize button or use `Bearer TOKEN` header |
| **Use Protected Endpoints** | Include token in Authorization header |
| **Token Expires** | Login again after 30 minutes |

---

**Last Updated:** May 28, 2026
