# Social Media Post API

A FastAPI-based Social Media API built for Object-Oriented Programming 2.

**SDG Alignment**: SDG 16 (Peace, Justice and Strong Institutions) - Promoting constructive digital dialogue in Sierra Leone.

## Team Members
- **Member 1**: Database + Post CRUD
- **Member 2**: Authentication + JWT
- **Member 3**: Comments, Likes & Documentation

## Features
- User Registration & Login (JWT)
- CRUD Posts
- Comments on Posts
- Like/Unlike Posts
- Protected Routes
- Swagger Documentation (`/docs`)

## Setup Instructions

### Prerequisites
- Python 3.8+
- PostgreSQL installed and running

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd social-media-api
   ```

2. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE social_media_db;
   ```

3. **Create virtual environment (optional but recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. **Copy environment file**
   ```bash
   cp env.example .env
   ```

5. **Update `.env` with your PostgreSQL credentials**
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/social_media_db
   SECRET_KEY=your-super-secret-key-here-change-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

6. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

7. **Run the application**
   ```bash
   uvicorn main:app --reload --port 8001
   ```

8. **Access the API**
   - API: http://localhost:8001
   - Swagger Docs: http://localhost:8001/docs
   - ReDoc: http://localhost:8001/redoc

## API Endpoints

### Authentication
- **POST** `/auth/register` - Register a new user
- **POST** `/auth/login` - Login and get JWT token

### Posts
- **POST** `/posts/` - Create a new post (protected)
- **GET** `/posts/` - Get all posts
- **GET** `/posts/{post_id}` - Get a specific post
- **PUT** `/posts/{post_id}` - Update a post (owner only)
- **DELETE** `/posts/{post_id}` - Delete a post (owner only)

### Comments
- **POST** `/comments/?post_id={post_id}` - Create a comment on a post (protected)
- **GET** `/comments/post/{post_id}` - Get all comments for a post

### Likes
- **POST** `/likes/{post_id}` - Like a post (protected)
- **DELETE** `/likes/{post_id}` - Unlike a post (protected)

## Project Structure

```
BSEM-1204-GROUP10/
├── app/                    # FastAPI application package
│   ├── __init__.py
│   ├── main.py             # FastAPI app initialization and router setup
│   ├── auth.py             # JWT authentication and password hashing
│   ├── database.py         # Database connection and session management
│   ├── models/             # SQLAlchemy database models
│   │   ├── __init__.py
│   │   ├── user.py         # User model
│   │   ├── post.py         # Post model
│   │   ├── comment.py      # Comment model
│   │   └── like.py         # Like model
│   ├── schemas/            # Pydantic schemas for request/response validation
│   │   ├── __init__.py
│   │   ├── user.py         # User Pydantic schemas
│   │   ├── post.py         # Post Pydantic schemas
│   │   ├── comment.py      # Comment Pydantic schemas
│   │   └── like.py         # Like Pydantic schemas
│   └── routers/            # API route handlers
│       ├── __init__.py
│       ├── auth.py         # Authentication endpoints (/auth)
│       ├── posts.py        # Post endpoints (/posts)
│       ├── comments.py     # Comment endpoints (/comments)
│       └── likes.py        # Like endpoints (/likes)
├── main.py                 # Application entry point (imports from app.main)
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (not in version control)
├── .env.example            # Environment variables template
├── schema.sql              # Database schema SQL
├── README.md               # This file
├── AUTHENTICATION_GUIDE.md # JWT authentication guide
├── POSTGRESQL_SETUP.md     # PostgreSQL setup instructions
└── PROJECTBRIEF.md         # Project brief and requirements
```

## Database Schema

### Users Table
- `id` (PK): Primary key
- `username` (UNIQUE): User's username
- `email` (UNIQUE): User's email
- `hashed_password`: Hashed password

### Posts Table
- `id` (PK): Primary key
- `title`: Post title
- `content`: Post content
- `user_id` (FK): User who created the post
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

### Comments Table
- `id` (PK): Primary key
- `content`: Comment text
- `post_id` (FK): Post being commented on
- `user_id` (FK): User who commented
- `created_at`: Timestamp of creation

### Likes Table
- `id` (PK): Primary key
- `post_id` (FK): Post being liked
- `user_id` (FK): User who liked
- `created_at`: Timestamp of creation
- **Constraint**: Unique combination of post_id and user_id (one like per user per post)

## SDG 16 Alignment

This project aligns with **SDG 16: Peace, Justice and Strong Institutions**.

### Key Principles:
- **Responsible Digital Expression**: The API provides a platform for users to express themselves responsibly through posts and comments
- **Community Engagement**: Features like comments and likes foster constructive dialogue and community building
- **User Authentication**: JWT-based authentication ensures secure access and accountability
- **Data Integrity**: Relationships between users, posts, comments, and likes maintain data integrity and transparency

This API serves as a tool for Sierra Leone youth to build responsible digital spaces, promoting peaceful expression and constructive engagement in digital communities.

## Testing

You can test the API using the built-in Swagger UI at:
```
http://localhost:8000/docs
```

Or use cURL:

```bash
# Register a user
curl -X POST "http://localhost:8001/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST "http://localhost:8001/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'username=testuser&password=password123'

# Create a post (replace TOKEN with JWT token from login)
curl -X POST "http://localhost:8001/posts/" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Post","content":"This is my first post on the platform"}'
```

## Dependencies

- **fastapi**: Web framework
- **uvicorn**: ASGI server
- **sqlalchemy**: ORM for database
- **psycopg2-binary**: PostgreSQL adapter
- **python-jose**: JWT token handling
- **passlib**: Password hashing
- **pydantic**: Data validation
- **python-dotenv**: Environment variables management

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Create a feature branch: `git checkout -b feature-name`
2. Make your changes
3. Commit: `git commit -m "feat: describe your changes"`
4. Push: `git push origin feature-name`
5. Create a Pull Request

## Support

For issues or questions, please create an issue in the GitHub repository.
