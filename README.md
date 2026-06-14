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
 
## Dependencies
 
| Package | Purpose |
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
 
## License
 
This project is licensed under the MIT License - see the LICENSE file for details.
 
## Contributing
 
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request
 
