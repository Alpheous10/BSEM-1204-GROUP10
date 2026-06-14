PROJECT OVERVIEW

Application: Social Media Post API
Framework: FastAPI
Database: PostgreSQL + SQLAlchemy
Auth: OAuth2 + JWT
Features: Posts, Comments, Likes
SDG Alignment: SDG 16 (Peace, Justice and Strong Institutions) or SDG 4 (Quality Education) — promote responsible digital expression / information sharing in Sierra Leone.


OVERALL PROJECT STRUCTURE
textsocial-media-api/
├── main.py
├── database.py
├── models/
│   ├── __init__.py
│   ├── user.py
│   ├── post.py
│   ├── comment.py
│   └── like.py
├── schemas/
│   ├── __init__.py
│   ├── user.py
│   ├── post.py
│   ├── comment.py
│   └── like.py
├── routers/
│   ├── __init__.py
│   ├── auth.py
│   ├── posts.py
│   ├── comments.py
│   └── likes.py
├── auth.py
├── .env
├── .env.example
├── requirements.txt
├── README.md
└── alembic/          (for migrations - bonus)

MEMBER 1: Database + Post CRUD
Your Responsibilities:

Set up database connection
Create models and schemas for User and Post
Implement full CRUD for Posts
Dependency Injection (get_db)

Step-by-Step Tasks:

Clone the repository and create your branch:Bashgit clone <your-repo-url>
cd social-media-api
git checkout -b member1-database
Create these files:
database.py
models/user.py and models/post.py
schemas/user.py and schemas/post.py
routers/posts.py

Key Things to Implement:
PostgreSQL connection using SQLAlchemy
User model (id, username, email, hashed_password)
Post model (id, title, content, user_id, created_at, likes_count)
Pydantic schemas (Base, Create, Response)
CRUD operations: Create Post, Get All Posts, Get Post by ID, Update Post, Delete Post
Use Depends(get_db) for database sessions

After finishing your part:Bashgit add .
git commit -m "feat: add database setup, models, schemas and post CRUD - Member 1"
git push origin member1-databaseThen create a Pull Request to main branch.


MEMBER 2: Authentication + JWT
Your Responsibilities:

User registration & login
JWT token generation and verification
Password hashing
Protect routes with current user dependency

Step-by-Step Tasks:

Create/switch to your branch:Bashgit checkout -b member2-auth
Create these files:
auth.py
routers/auth.py
Update models/user.py and schemas/user.py if needed

Key Things to Implement:
passlib for password hashing (bcrypt)
python-jose for JWT
/register and /login endpoints
get_current_user dependency
OAuth2PasswordBearer
Protect post creation/deletion with authentication

After finishing:Bashgit add .
git commit -m "feat: implement JWT authentication, register and login - Member 2"
git push origin member2-authCreate Pull Request.


MEMBER 3: Comments + Likes + Async + Documentation
Your Responsibilities:

Comments and Likes functionality
One async endpoint
Final integration, README, documentation

Step-by-Step Tasks:

Create your branch:Bashgit checkout -b member3-features
Create these files:
models/comment.py, models/like.py
schemas/comment.py, schemas/like.py
routers/comments.py
routers/likes.py

Key Things to Implement:
Comment model (id, content, post_id, user_id)
Like model (id, post_id, user_id)
Endpoints: Create Comment, Get Post Comments, Like/Unlike Post
Async example: Make one endpoint async (e.g. async def get_trending_posts())
Update main.py to include all routers
Create README.md with setup instructions, screenshots, and SDG explanation
Add .env.example

After finishing:Bashgit add .
git commit -m "feat: add comments, likes, async endpoint and documentation - Member 3"
git push origin member3-featuresCreate Pull Request.


FINAL INTEGRATION (All Members)
After all PRs are merged:

Update main.py to include all routers.
Test all endpoints using Swagger (/docs)
Take screenshots of:
Register/Login
Create Post
Get Posts
Create Comment
Like Post

Write the 2-3 page report (design choices, challenges, SDG alignment).


GITHUB BEST PRACTICES (For A+)

Use meaningful commit messages
Create Pull Requests (never push directly to main)
Add your lecturer as collaborator
Use MIT License
Good README with:
Project description
Setup instructions
API documentation link
SDG alignment explanation
Team members & contributions
