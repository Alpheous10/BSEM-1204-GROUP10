# Social Media Post API

A FastAPI-based Social Media API built for Object-Oriented Programming 2, aligned with **SDG 16: Peace, Justice and Strong Institutions**.

This platform enables Sierra Leone youth to express themselves responsibly and engage in constructive digital dialogue through a secure, community-driven API.

## Team Implementation

| Member | Responsibility | Status |
|--------|-----------------|--------|
| **Member 1** | PostgreSQL Database + Post CRUD Operations | ✅ Complete |
| **Member 2** | JWT Authentication + User Management | ✅ Complete |
| **Member 3** | Comments + Likes Features + Documentation | ✅ Complete |

## Key Features

- **Secure Authentication**: JWT tokens with Argon2 password hashing
- **CRUD Operations**: Full create, read, update, delete for posts
- **Community Interaction**: Comment on posts and like/unlike functionality
- **Authorization**: Protected endpoints with ownership validation
- **Interactive Documentation**: Swagger UI and ReDoc at `/docs` and `/redoc`
- **CORS Enabled**: Cross-origin requests supported

## Prerequisites

- **Python 3.8+** (tested with Python 3.14)
- **PostgreSQL 12+** (installed and running on localhost:5432)
- **pip** (Python package manager)

## Quick Start

### 1. Database Setup
Ensure PostgreSQL is running and create the database:
```bash
psql -U postgres
CREATE DATABASE social_media_db;
\q
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:
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
uvicorn main:app --reload --port 8002
```

The API will be available at `http://localhost:8002`

### 5. Access Documentation
- **Swagger UI**: http://localhost:8002/docs
- **ReDoc**: http://localhost:8002/redoc

## API Endpoints

### Authentication (No Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user (username, email, password) |
| POST | `/auth/login` | Login with username & password, returns JWT token |

### Posts (Protected Endpoints - Require JWT Token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/posts/` | Create a new post (auth required) |
| GET | `/posts/` | Retrieve all posts (public) |
| GET | `/posts/{post_id}` | Get a specific post by ID (public) |
| PUT | `/posts/{post_id}` | Update a post (owner only, auth required) |
| DELETE | `/posts/{post_id}` | Delete a post (owner only, auth required) |

### Comments (Protected Endpoints - Require JWT Token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/comments/?post_id={id}` | Add comment to post (auth required) |
| GET | `/comments/post/{post_id}` | Get all comments for a post (public) |

### Likes (Protected Endpoints - Require JWT Token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/likes/{post_id}` | Like a post (prevents duplicate likes) |
| DELETE | `/likes/{post_id}` | Remove like from post |

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
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | INTEGER | PRIMARY KEY, auto-increment |
| `username` | STRING | UNIQUE, NOT NULL |
| `email` | STRING | UNIQUE, NOT NULL |
| `hashed_password` | STRING | NOT NULL (Argon2-hashed) |

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

## Authentication

### How JWT Works in This API

1. **Register** → Receive username confirmation
2. **Login** → Send `username` & `password` (form-encoded) → Receive `access_token`
3. **Access Protected Routes** → Include token in Authorization header: `Bearer <token>`
4. **Token Expiration** → 30 minutes (set in ACCESS_TOKEN_EXPIRE_MINUTES)

### Security Implementation

- **Password Hashing**: Argon2 (via passlib) - resistant to GPU/ASIC attacks
- **Token Encoding**: HS256 with SECRET_KEY
- **CORS**: Enabled for all origins (`*`)
- **Ownership Validation**: Only post owners can update/delete their own posts

## Testing

### Using Swagger UI (Recommended)
Navigate to: **http://localhost:8002/docs**

1. Click **"Authorize"** button
2. Enter username and password
3. Click **"Authorize"** to get a token
4. Try out endpoints directly in the interface

### Using cURL

**1. Register a user**
```bash
curl -X POST "http://localhost:8002/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "khalil",
    "email": "khalil@example.com",
    "password": "mypassword123"
  }'
```

**2. Login (OAuth2 form-encoded)**
```bash
curl -X POST "http://localhost:8002/auth/login" \
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

**3. Create a post (with JWT token)**
```bash
curl -X POST "http://localhost:8002/posts/" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "SDG 16 in Action",
    "content": "Building peaceful digital spaces for youth"
  }'
```

**4. Get all posts**
```bash
curl -X GET "http://localhost:8002/posts/"
```

**5. Create a comment**
```bash
curl -X POST "http://localhost:8002/comments/?post_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"content": "Great post!"}'
```

**6. Like a post**
```bash
curl -X POST "http://localhost:8002/likes/1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Dependencies

| Package | Purpose |
|---------|---------|
| **fastapi** (0.135.3) | Modern async web framework |
| **uvicorn** (0.44.0) | ASGI server for running FastAPI |
| **sqlalchemy** (2.0.50) | ORM for database operations |
| **psycopg2-binary** | PostgreSQL database adapter |
| **pydantic** | Request/response data validation |
| **python-jose** | JWT token creation and verification |
| **passlib** (1.7.4) | Password hashing abstraction |
| **argon2-cffi** | Argon2 password hashing algorithm |
| **python-dotenv** | Environment variable management |
| **email-validator** | Email format validation in Pydantic |

See `requirements.txt` for exact versions.

## SDG 16: Peace, Justice and Strong Institutions

**Why this matters**: Digital spaces are where youth build communities and ideas. This API ensures that platform is built on principles of security, accountability, and responsible engagement.

### Implementation in This API:
- ✅ **User Authentication & Accountability**: JWT tokens tie all actions to verified users
- ✅ **Data Ownership & Control**: Only post owners can modify/delete their content
- ✅ **Secure By Default**: Argon2 password hashing protects user accounts against attacks
- ✅ **Data Integrity**: Clear foreign key relationships ensure referential integrity
- ✅ **Community Building**: Comments and likes features enable constructive dialogue

This API is a foundation for Sierra Leone youth to build responsible digital communities aligned with SDG 16.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## Issues & Support

- **API Issues**: Check Swagger docs for endpoint details at `/docs`
- **Database Issues**: Verify PostgreSQL is running on localhost:5432
- **Auth Issues**: Ensure token is in `Authorization: Bearer <token>` format
- **Questions**: See AUTHENTICATION_GUIDE.md and POSTGRESQL_SETUP.md for detailed guides
