<<<<<<< HEAD
# Social Media Post API

 
A FastAPI-based Social Media API built for Object-Oriented Programming 2, aligned with **SDG 16: Peace, Justice and Strong Institutions**.
 
This platform enables Sierra Leone youth to express themselves responsibly and engage in constructive digital dialogue through a secure, community-driven API — complete with profiles, following, a personalized feed, search, and a full HTML/CSS/JS frontend.
 
## Team Implementation
 
| Member | Responsibility | Status |
|--------|-----------------|--------|
| **Member 1** | PostgreSQL Database + Post CRUD Operations | ✅ Complete |
| **Member 2** | JWT Authentication + User Management | ✅ Complete |
| **Member 3** | Comments + Likes Features + Documentation | ✅ Complete |
 
### Phase 2 Enhancements (MVP Upgrade)
 
| Area | What Was Added | Status |
|------|-----------------|--------|
| User Profiles | Bio, avatar, edit profile, account deletion | ✅ Complete |
| Social Graph | Follow / unfollow, followers & following lists | ✅ Complete |
| Feed | Personalized feed from followed users | ✅ Complete |
| Search | Search posts and users | ✅ Complete |
| Comments | Edit and delete own comments | ✅ Complete |
| Security | Login rate limiting, ownership checks everywhere | ✅ Complete |
| Data Integrity | PostgreSQL triggers archive deleted accounts/posts/comments | ✅ Complete |
| Admin | Endpoints to inspect archived (deleted) data | ✅ Complete |
| Frontend | Full HTML/CSS/JS single-page app (9 screens) | ✅ Complete |
| Infrastructure | Pagination, health check endpoint | ✅ Complete |
 
## Key Features
 
- **Secure Authentication**: JWT tokens with Argon2 password hashing, rate-limited login (5 attempts/minute per IP)
- **Full CRUD for Posts**: Create, read, update, delete, with pagination and live like/comment counts
- **Comments**: Add, edit, and delete comments with ownership protection
- **Likes**: Like/unlike posts (duplicate likes prevented at the database level)
- **User Profiles**: Bio and avatar, fully editable via `/users/me`
- **Follow System**: Follow/unfollow other users, view followers and following lists
- **Personalized Feed**: See posts only from users you follow
- **Search**: Find posts by keyword or users by username
- **Account Deletion**: Permanently delete your account and content — PostgreSQL triggers automatically archive deleted users, posts, and comments into separate admin-only tables before removal
- **Admin Tools**: Admin-only endpoints to review archived (deleted) data
- **Frontend Included**: A complete HTML/CSS/JS single-page app covering login, registration, explore feed, personalized feed, post detail, post creation, profiles, settings, and search
- **Interactive Documentation**: Swagger UI and ReDoc at `/docs` and `/redoc`
- **CORS Enabled**: Cross-origin requests supported
 
## Prerequisites
 
- **Python 3.8+** (tested with Python 3.14)
- **PostgreSQL 12+** (installed and running on localhost:5432)
- **pip** (Python package manager)
 
=======
# UniHub
 
## Your Academic Hub, All In One Place
 
UniHub (formerly UniLink) is a web-based academic collaboration platform for
university and college students. It evolved from the original **Social Media
Post API** (built for OOP2, aligned with SDG 16) into a focused academic
workspace — combining community discussion, resource sharing, assignment
tracking, and project group collaboration into a single platform.
 
Unlike entertainment-focused social media, UniHub is built around solving the
recurring problems students face every semester: scattered lecture notes,
missed assignment deadlines, fragmented group project communication, and
disconnected class updates.
 
## What UniHub Solves
 
| Problem | UniHub's Answer |
|---|---|
| Lecture notes, slides, and past papers scattered across WhatsApp | **Resources** — a searchable file library per community |
| Forgotten or late assignment updates | **Assignments** — due dates tracked per community, surfaced on the dashboard |
| Group project coordination spread across apps | **Project Groups** — private spaces with their own discussions |
| Nowhere to ask academic questions | **Communities** — discussion posts, comments, and likes per subject/course |
| Missed class announcements | **Announcements** — pinned, notification-backed updates from class reps and admins |
 
## Core Concepts
 
UniHub revolves around **Communities** — one per course, subject, or interest
(e.g. Software Engineering, Database Systems, Networking, Final Year Project).
Each community is a mini academic space with its own members, discussions,
resources, and assignments. **Project Groups** work the same way but are
oriented around a specific deliverable (e.g. a group project team) rather than
a whole course.
 
## Key Features
 
### Identity & Profiles
- JWT authentication with Argon2 password hashing and rate-limited login
- Academic profile fields: full name, bio, avatar, department, academic year
- Follow other students, personalized feed, full-text search across posts, users, and communities
### Communities
- Create, browse, join, and leave communities
- Member lists and roles (`member` / `admin`)
- Posts, resources, and assignments are scoped to a community
### Discussions (Posts)
- Create posts inside a community, inside a project group, or on your own profile
- Like / unlike with per-viewer `is_liked` state
- Comment, edit, and delete comments — full ownership checks throughout
### Resources
- Upload lecture notes, slides, past papers, and documents (PDF, DOCX, PPT, XLSX, images)
- 20MB file size limit, served back via direct download links
- Browse and filter by community
### Assignments
- Title, description, and due date, scoped to a community
- "Upcoming" filter for dashboard widgets
- Posting an assignment notifies every community member
### Project Groups
- Create or join private collaboration spaces
- Member lists with roles
- Posts scoped to the group act as the group's discussion thread
### Announcements
- Community-scoped (posted by community admins) or platform-wide (posted by platform admins)
- Pinned announcements surface first
- Automatically notifies all relevant members
### Notifications
- Triggered by: likes, comments, new followers, new assignments, new announcements
- Unread count endpoint, mark-as-read (single or all)
### Dashboard
- Single aggregate endpoint returning: greeting info, your communities, upcoming
  assignments, recent resources, recent discussions, announcements, and unread
  notification count — everything the home screen needs in one request
### Account & Data Integrity
- Delete your account at any time — cascades through your posts, comments,
  likes, and follows
- PostgreSQL triggers archive deleted users, posts, and comments into
  admin-only tables before removal, preserving an audit trail
- Admin-only endpoints to review archived data
## Tech Stack
 
| Layer | Technology |
|---|---|
| API | FastAPI |
| Database | PostgreSQL + SQLAlchemy ORM |
| Auth | JWT (python-jose) + Argon2 (passlib) |
| Rate Limiting | slowapi |
| File Storage | Local disk (`uploads/`), served via FastAPI static mount |
| Frontend | HTML, CSS, vanilla JavaScript (no build step) |
 
## Prerequisites
 
- **Python 3.8+**
- **PostgreSQL 12+** running on `localhost:5432`
- **pip**
>>>>>>> d36110094e2bc6b1e67c06ee4b45efb5054df1eb
## Quick Start
 
### 1. Database Setup
```bash
psql -U postgres
CREATE DATABASE social_media_db;
\q
```
 
### 2. Environment Configuration
```bash
cp .env.example .env
```
<<<<<<< HEAD
 
Edit `.env` with your PostgreSQL credentials:
=======
>>>>>>> d36110094e2bc6b1e67c06ee4b45efb5054df1eb
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/social_media_db
SECRET_KEY=your-secret-key-min-32-chars-recommended
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```
 
### 3. Install Dependencies
```bash
pip install -r requirements.txt
```
 
### 4. Run the Server
```bash
python main.py
```
<<<<<<< HEAD
 
The API will be available at `http://localhost:8001`
 
### 5. Apply Database Triggers (one-time setup)
 
After the server has started once (so all tables, including the archive tables,
have been created), apply the archiving triggers:
 
```bash
psql -U <your_db_user> -d social_media_db -f migrations/001_add_triggers.sql
```
 
These triggers automatically copy a user/post/comment into a `deleted_*` archive
table the moment it is deleted, before it's gone for good.
 
### 6. Run the Frontend
 
The frontend is plain HTML/CSS/JS — no build step required:
 
```bash
open frontend/index.html
```
 
The backend must be running on `http://localhost:8001` for the frontend to work.
 
### 7. Access API Documentation
- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc
 
## API Endpoints
 
### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register a new user (username, email, password) |
| POST | `/auth/login` | No | Login (form-encoded `username` & `password`), returns JWT. Rate-limited to 5 requests/minute per IP |
 
### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/me` | Yes | Get your own profile |
| PUT | `/users/me` | Yes | Update username, email, bio, and/or avatar URL |
| DELETE | `/users/me` | Yes | Permanently delete your account, posts, comments, likes, and follows |
| GET | `/users/{user_id}` | No | Public profile with follower/following counts |
| GET | `/users/{user_id}/posts` | No | Paginated list of a user's posts |
| POST | `/users/{user_id}/follow` | Yes | Follow a user |
| DELETE | `/users/{user_id}/follow` | Yes | Unfollow a user |
| GET | `/users/{user_id}/followers` | No | List of a user's followers |
| GET | `/users/{user_id}/following` | No | List of users this user follows |
 
### Posts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/posts/` | Yes | Create a new post |
| GET | `/posts/?skip=&limit=` | No | Paginated list of all posts, newest first, with `like_count` and `comment_count` |
| GET | `/posts/{post_id}` | No | Get a specific post |
| PUT | `/posts/{post_id}` | Yes (owner) | Update a post |
| DELETE | `/posts/{post_id}` | Yes (owner) | Delete a post |
 
### Comments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/comments/?post_id={id}` | Yes | Add a comment to a post |
| GET | `/comments/post/{post_id}` | No | Get all comments for a post |
| PUT | `/comments/{comment_id}` | Yes (owner) | Edit your own comment |
| DELETE | `/comments/{comment_id}` | Yes (owner) | Delete your own comment |
 
### Likes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/likes/{post_id}` | Yes | Like a post (prevents duplicate likes) |
| DELETE | `/likes/{post_id}` | Yes | Remove your like from a post |
 
### Feed & Search
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/feed/?skip=&limit=` | Yes | Paginated posts from users you follow, newest first |
| GET | `/search/posts?q=` | No | Search posts by title/content |
| GET | `/search/users?q=` | No | Search users by username |
 
### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/deleted-users` | Yes (admin) | View archived/deleted user accounts |
| GET | `/admin/deleted-posts` | Yes (admin) | View archived/deleted posts |
| GET | `/admin/deleted-comments` | Yes (admin) | View archived/deleted comments |
 
### Health
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Welcome message |
| GET | `/health` | No | Health check, returns `{"status": "ok"}` |
 
## Project Structure
 
```
BSEM-1204-GROUP10/
├── app/                        # FastAPI application package
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization and router setup
│   ├── auth.py                 # JWT authentication and password hashing
│   ├── database.py             # Database connection and session management
│   ├── notifications_util.py   # (reserved for future notification features)
│   ├── models/                 # SQLAlchemy database models
│   │   ├── __init__.py
│   │   ├── user.py             # User model (profile, is_admin)
│   │   ├── post.py              # Post model
│   │   ├── comment.py          # Comment model
│   │   ├── like.py              # Like model
│   │   ├── follow.py            # Follow relationship model
│   │   └── archive.py          # Archive tables for deleted data
│   ├── schemas/                # Pydantic schemas for request/response validation
│   │   ├── __init__.py
│   │   ├── user.py              # User Pydantic schemas
│   │   ├── post.py              # Post Pydantic schemas
│   │   ├── comment.py           # Comment Pydantic schemas
│   │   └── like.py              # Like Pydantic schemas
│   └── routers/                 # API route handlers
│       ├── __init__.py
│       ├── auth.py              # Authentication endpoints (/auth)
│       ├── posts.py             # Post endpoints (/posts)
│       ├── comments.py          # Comment endpoints (/comments)
│       ├── likes.py             # Like endpoints (/likes)
│       ├── users.py             # User profile & follow endpoints (/users)
│       ├── feed.py              # Personalized feed (/feed)
│       ├── search.py            # Search endpoints (/search)
│       └── admin.py             # Admin-only archive endpoints (/admin)
├── frontend/                    # Plain HTML/CSS/JS single-page app
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── api.js               # Centralized API client
│       └── app.js               # Routing, screens, and UI logic
├── migrations/
│   └── 001_add_triggers.sql     # PostgreSQL triggers for archiving deleted data
├── main.py                      # Application entry point (imports from app.main)
├── requirements.txt             # Python dependencies
├── .env                          # Environment variables (not in version control)
├── .env.example                  # Environment variables template
├── schema.sql                    # Database schema SQL
├── README.md                     # This file
├── AUTHENTICATION_GUIDE.md        # JWT authentication guide
├── POSTGRESQL_SETUP.md            # PostgreSQL setup instructions
└── PROJECTBRIEF.md                # Project brief and requirements
```
 
## Database Schema
 
### Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY, auto-increment |
| `username` | STRING | UNIQUE, NOT NULL |
| `email` | STRING | UNIQUE, NOT NULL |
| `hashed_password` | STRING | NOT NULL (Argon2-hashed) |
| `bio` | TEXT | nullable |
| `avatar_url` | STRING | nullable |
| `is_admin` | BOOLEAN | NOT NULL, default `false` |
 
### Posts Table
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY, auto-increment |
| `title` | STRING | NOT NULL |
| `content` | TEXT | NOT NULL |
| `user_id` | INTEGER | FOREIGN KEY → users.id |
| `created_at` | DATETIME | NOT NULL, auto-set |
| `updated_at` | DATETIME | NOT NULL, auto-update |
 
### Comments Table
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY, auto-increment |
| `content` | TEXT | NOT NULL |
| `post_id` | INTEGER | FOREIGN KEY → posts.id |
| `user_id` | INTEGER | FOREIGN KEY → users.id |
| `created_at` | DATETIME | NOT NULL, auto-set |
 
### Likes Table
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY, auto-increment |
| `post_id` | INTEGER | FOREIGN KEY → posts.id |
| `user_id` | INTEGER | FOREIGN KEY → users.id |
| `created_at` | DATETIME | NOT NULL, auto-set |
| | | UNIQUE(post_id, user_id) - Prevents duplicate likes |
 
### Follows Table
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY, auto-increment |
| `follower_id` | INTEGER | FOREIGN KEY → users.id (ON DELETE CASCADE) |
| `following_id` | INTEGER | FOREIGN KEY → users.id (ON DELETE CASCADE) |
| `created_at` | DATETIME | NOT NULL, auto-set |
| | | UNIQUE(follower_id, following_id) - Prevents duplicate follows |
 
### Archive Tables (`deleted_users`, `deleted_posts`, `deleted_comments`)
 
Populated automatically by PostgreSQL triggers whenever a row is deleted from
`users`, `posts`, or `comments`. Each archive row stores a copy of the original
data, the `original_id` it came from, and a `deleted_at` timestamp. These tables
are only readable via the `/admin/*` endpoints by users with `is_admin = true`.
 
## Authentication
 
### How JWT Works in This API
 
1. **Register** → Receive your new profile back as confirmation
2. **Login** → Send `username` & `password` (form-encoded) → Receive `access_token`. Limited to 5 attempts per minute per IP address.
3. **Access Protected Routes** → Include token in Authorization header: `Bearer <token>`
4. **Token Expiration** → 30 minutes (set in `ACCESS_TOKEN_EXPIRE_MINUTES`)
 
### Security Implementation
 
- **Password Hashing**: Argon2 (via passlib) - resistant to GPU/ASIC attacks
- **Token Encoding**: HS256 with `SECRET_KEY`
- **Login Rate Limiting**: 5 requests/minute per IP via `slowapi`
- **CORS**: Enabled for all origins (`*`)
- **Ownership Validation**: Only the owner can update/delete their own posts and comments; only you can edit/delete your own account
- **Granting Admin**: Run directly in PostgreSQL:
```sql
  UPDATE users SET is_admin = TRUE WHERE username = '<username>';
```
 
## Frontend
 
A complete single-page app lives in `frontend/`, built with plain HTML, CSS, and
JavaScript (no frameworks or build tools). It covers:
 
| Screen | Description |
|--------|-------------|
| Login / Register | Account creation and authentication |
| Explore | Public, paginated feed of all posts |
| Feed | Personalized feed from followed users |
| Post Detail | View a post, like/unlike, comment, edit/delete own posts |
| Create Post | Compose a new post |
| User Profile | View any user's profile, posts, and follow/unfollow them |
| Settings | Edit your own profile and permanently delete your account |
| Search | Search posts and people |
 
All requests go through `frontend/js/api.js`, which attaches the JWT to every
authenticated request automatically.
 
## Testing
 
### Using Swagger UI (Recommended)
Navigate to: **http://localhost:8001/docs**
 
1. Click **"Authorize"** button
2. Enter username and password
3. Click **"Authorize"** to get a token
4. Try out endpoints directly in the interface
 
### Using cURL
 
**1. Register a user**
```bash
curl -X POST "http://localhost:8001/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "khalil",
    "email": "khalil@example.com",
    "password": "mypassword123"
  }'
```
 
**2. Login (OAuth2 form-encoded)**
```bash
curl -X POST "http://localhost:8001/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=khalil&password=mypassword123"
```
 
Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```
 
**3. Create a post**
```bash
curl -X POST "http://localhost:8001/posts/" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "SDG 16 in Action",
    "content": "Building peaceful digital spaces for youth"
  }'
```
 
**4. Get all posts (paginated)**
```bash
curl -X GET "http://localhost:8001/posts/?skip=0&limit=10"
```
 
**5. Create a comment**
```bash
curl -X POST "http://localhost:8001/comments/?post_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"content": "Great post!"}'
```
 
**6. Like a post**
```bash
curl -X POST "http://localhost:8001/likes/1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
 
**7. Follow a user**
```bash
curl -X POST "http://localhost:8001/users/2/follow" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
 
**8. View your personalized feed**
```bash
curl -X GET "http://localhost:8001/feed/?skip=0&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
 
**9. Search for posts**
```bash
curl -X GET "http://localhost:8001/search/posts?q=SDG"
```
 
**10. Delete your account**
```bash
curl -X DELETE "http://localhost:8001/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
=======
The API will be available at `http://localhost:8001`. On first run, all tables —
including communities, resources, assignments, project groups, announcements,
and notifications — are created automatically.
 
### 5. Apply Database Triggers (one-time)
```bash
psql -U <your_db_user> -d social_media_db -f migrations/001_add_triggers.sql
```
Archives deleted users/posts/comments into `deleted_users`, `deleted_posts`,
and `deleted_comments` for admin review.
 
### 6. Seed Starter Communities
 
UniHub ships empty — create a few communities so the platform isn't a blank
slate on first login:
```bash
curl -X POST "http://localhost:8001/communities/" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name": "Software Engineering", "icon": "💻", "description": "All things SE"}'
```
Repeat for Database Systems, Networking, Artificial Intelligence, etc.
 
### 7. Run the Frontend
```bash
cd unihub
python -m http.server 5500
```
Open `http://127.0.0.1:5500/index.html`. The backend must be running on
`http://localhost:8001`.
 
### 8. API Documentation
- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc
## API Reference
 
### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register with username, email, password, and optional full name / department / academic year |
| POST | `/auth/login` | No | Form-encoded login, returns JWT. Rate-limited to 5/min per IP |
 
### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users/me` | Yes | Your full profile |
| PUT | `/users/me` | Yes | Update username, email, full name, bio, avatar, department, academic year |
| DELETE | `/users/me` | Yes | Permanently delete your account and all your content |
| GET | `/users/{id}` | No | Public profile with follower/following counts |
| GET | `/users/{id}/posts` | Optional | A user's posts, paginated |
| POST / DELETE | `/users/{id}/follow` | Yes | Follow / unfollow |
| GET | `/users/{id}/followers` | No | Followers list |
| GET | `/users/{id}/following` | No | Following list |
 
### Posts (Discussions)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/posts/` | Yes | Create a post. Optional `community_id` or `project_group_id` (must be a member) |
| GET | `/posts/?skip&limit&community_id&project_group_id` | Optional | Paginated, newest first, filterable by community/group |
| GET | `/posts/{id}` | Optional | Single post with `like_count`, `comment_count`, `is_liked` |
| PUT / DELETE | `/posts/{id}` | Yes (owner) | Edit / delete |
 
### Comments & Likes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/comments/?post_id={id}` | Yes | Add a comment (notifies post owner) |
| GET | `/comments/post/{id}` | No | All comments on a post |
| PUT / DELETE | `/comments/{id}` | Yes (owner) | Edit / delete |
| POST / DELETE | `/likes/{post_id}` | Yes | Like / unlike (notifies post owner) |
 
### Feed & Search
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/feed/?skip&limit` | Yes | Posts from people you follow |
| GET | `/search/posts?q=` | Optional | Search posts |
| GET | `/search/users?q=` | No | Search users |
| GET | `/search/communities?q=` | Optional | Search communities |
 
### Communities
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/communities/` | Yes | Create (creator becomes admin) |
| GET | `/communities/?skip&limit` | Optional | List all, with `is_member` if logged in |
| GET | `/communities/mine` | Yes | Communities you've joined |
| GET | `/communities/{id}` | Optional | Detail |
| POST / DELETE | `/communities/{id}/join` / `/leave` | Yes | Join / leave (sole admin can't leave) |
| GET | `/communities/{id}/members` | No | Member list with roles |
 
### Resources
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/resources/` | Yes | Upload (`multipart/form-data`: `title`, `description?`, `community_id?`, `file`) |
| GET | `/resources/?community_id&skip&limit` | No | List |
| GET | `/resources/{id}` | No | Metadata |
| GET | `/resources/{id}/download` | No | Download the file |
| DELETE | `/resources/{id}` | Yes (owner/admin) | Delete |
 
### Assignments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/assignments/` | Yes (community member) | Create (notifies all community members) |
| GET | `/assignments/?community_id&upcoming&skip&limit` | No | List, filterable to upcoming only |
| GET | `/assignments/{id}` | No | Detail |
| PUT / DELETE | `/assignments/{id}` | Yes (creator) | Edit / delete |
 
### Project Groups
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/project-groups/` | Yes | Create (creator becomes admin) |
| GET | `/project-groups/?skip&limit` | Optional | List all |
| GET | `/project-groups/mine` | Yes | Groups you've joined |
| GET | `/project-groups/{id}` | Optional | Detail |
| POST / DELETE | `/project-groups/{id}/join` / `/leave` | Yes | Join / leave |
| GET | `/project-groups/{id}/members` | No | Member list |
 
### Announcements
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/announcements/` | Yes | Community admin (scoped) or platform admin (platform-wide, `community_id` omitted) |
| GET | `/announcements/?community_id&skip&limit` | No | List, pinned first. Omit `community_id` for platform-wide |
| DELETE | `/announcements/{id}` | Yes (creator/admin) | Delete |
 
### Notifications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/notifications/?skip&limit` | Yes | Your notifications, newest first |
| GET | `/notifications/unread-count` | Yes | Unread count |
| PUT | `/notifications/{id}/read` | Yes | Mark one as read |
| PUT | `/notifications/read-all` | Yes | Mark all as read |
 
### Dashboard & Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/dashboard/` | Yes | Aggregate home-screen payload |
| GET | `/admin/deleted-users` `/deleted-posts` `/deleted-comments` | Yes (admin) | Review archived data |
| GET | `/health` | No | Health check |
 
## Roles & Permissions
 
UniHub has two independent levels of "admin":
 
- **Platform admin** (`users.is_admin = true`) — can post platform-wide
  announcements and view the deleted-data archive. Granted manually via SQL:
```sql
  UPDATE users SET is_admin = TRUE WHERE username = '<username>';
```
- **Community admin** (`community_members.role = 'admin'`) — automatically
  granted to whoever creates a community. Can post announcements and
  assignments scoped to that community. A community must always retain at
  least one admin.
## Project Structure
 
```
UniHub/
├── app/
│   ├── main.py
│   ├── auth.py
│   ├── database.py
│   ├── notifications_util.py
│   ├── models/
│   │   ├── user.py            # + full_name, department, academic_year, is_admin
│   │   ├── post.py             # + community_id, project_group_id
│   │   ├── comment.py
│   │   ├── like.py
│   │   ├── follow.py
│   │   ├── archive.py          # deleted_* archive tables
│   │   ├── community.py        # Community, CommunityMember
│   │   ├── resource.py
│   │   ├── assignment.py
│   │   ├── project_group.py    # ProjectGroup, ProjectGroupMember
│   │   ├── announcement.py
│   │   └── notification.py
│   ├── schemas/
│   │   ├── user.py / post.py / comment.py / like.py
│   │   ├── community.py / resource.py / assignment.py
│   │   ├── project_group.py / announcement.py / notification.py
│   │   └── dashboard.py
│   └── routers/
│       ├── auth.py / posts.py / comments.py / likes.py
│       ├── users.py / feed.py / search.py / admin.py
│       └── communities.py / resources.py / assignments.py
│           project_groups.py / announcements.py / notifications.py / dashboard.py
├── unihub/                     # frontend (formerly unilink/)
│   ├── index.html
│   ├── dashboard.html
│   ├── communities.html
│   ├── community-detail.html
│   ├── js/
│   │   ├── api.js
│   │   ├── app.js
│   │   └── nav.js
│   └── styles.css
├── uploads/
│   └── resources/              # uploaded files, served at /uploads/resources/*
├── migrations/
│   └── 001_add_triggers.sql
├── main.py
├── requirements.txt
├── .env / .env.example
└── README.md
```
 
## Database Schema (Highlights)
 
| Table | Purpose |
|---|---|
| `users` | Profile incl. `full_name`, `department`, `academic_year`, `bio`, `avatar_url`, `is_admin` |
| `posts` | Discussions; optional `community_id`, `project_group_id` |
| `comments`, `likes`, `follows` | Standard interaction tables |
| `communities`, `community_members` | Communities and membership/roles |
| `resources` | Uploaded files: name, path, type, size, optional `community_id` |
| `assignments` | Title, description, `due_date`, `community_id` |
| `project_groups`, `project_group_members` | Project spaces and membership/roles |
| `announcements` | Title, content, optional `community_id`, `pinned` |
| `notifications` | `type`, `message`, `related_id`, `is_read` |
| `deleted_users`, `deleted_posts`, `deleted_comments` | Trigger-populated audit archive |
>>>>>>> d36110094e2bc6b1e67c06ee4b45efb5054df1eb
 
## Dependencies
 
| Package | Purpose |
<<<<<<< HEAD
|---------|---------|
| **fastapi** | Modern async web framework |
| **uvicorn[standard]** | ASGI server for running FastAPI |
| **sqlalchemy** | ORM for database operations |
| **psycopg2-binary** | PostgreSQL database adapter |
| **pydantic[email]** | Request/response data validation, including email format |
| **python-jose[cryptography]** | JWT token creation and verification |
| **passlib[argon2]** | Password hashing abstraction |
| **argon2-cffi** | Argon2 password hashing backend |
| **python-multipart** | Form data parsing (OAuth2 login form) |
| **python-dotenv** | Environment variable management |
| **slowapi** | Rate limiting for the login endpoint |
| **alembic** | Database migration tooling |
 
See `requirements.txt` for exact versions.
 
## SDG 16: Peace, Justice and Strong Institutions
 
**Why this matters**: Digital spaces are where youth build communities and ideas. This API ensures that platform is built on principles of security, accountability, and responsible engagement.
 
### Implementation in This API:
- ✅ **User Authentication & Accountability**: JWT tokens tie all actions to verified users
- ✅ **Data Ownership & Control**: Only post/comment owners can modify or delete their content, and users fully control their own account, including permanent deletion
- ✅ **Secure By Default**: Argon2 password hashing and rate-limited login protect user accounts against attacks
- ✅ **Data Integrity & Accountability**: PostgreSQL triggers preserve an auditable archive of deleted accounts, posts, and comments for admin review, rather than letting data silently vanish
- ✅ **Community Building**: Comments, likes, following, and a personalized feed enable constructive, ongoing dialogue between users
- ✅ **Discoverability**: Search helps users find relevant discussions and people, supporting open and informed participation
 
This API is a foundation for Sierra Leone youth to build responsible digital communities aligned with SDG 16.
=======
|---|---|
| fastapi | Web framework |
| uvicorn[standard] | ASGI server |
| sqlalchemy | ORM |
| psycopg2-binary | PostgreSQL driver |
| pydantic[email] | Validation |
| python-jose[cryptography] | JWT |
| passlib[argon2] + argon2-cffi | Password hashing |
| python-multipart | Form & file upload parsing |
| python-dotenv | Env config |
| slowapi | Login rate limiting |
| alembic | Migrations |
>>>>>>> d36110094e2bc6b1e67c06ee4b45efb5054df1eb
 
## License
 
This project is licensed under the MIT License - see the LICENSE file for details.
 
## Contributing
 
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request
 
<<<<<<< HEAD
## Issues & Support
 
- **API Issues**: Check Swagger docs for endpoint details at `/docs`
- **Database Issues**: Verify PostgreSQL is running on localhost:5432 and that `migrations/001_add_triggers.sql` has been applied
- **Auth Issues**: Ensure token is in `Authorization: Bearer <token>` format and hasn't expired (30 minutes)
- **Questions**: See AUTHENTICATION_GUIDE.md and POSTGRESQL_SETUP.md for detailed guides
 
=======
>>>>>>> d36110094e2bc6b1e67c06ee4b45efb5054df1eb
