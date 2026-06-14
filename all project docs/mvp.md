# Professional Social Media API MVP - Missing Items

This document lists the features and improvements needed to transition the current implementation into a professional-grade Social Media API MVP, based on the [PROJECTBRIEF.md](file:///Users/tecxkhalil/BSEM-1204-GROUP10/BSEM-1204-GROUP10/PROJECTBRIEF.md) and industry standards.

## 1. Core Requirements (From Project Brief)
The following items were specified in the project brief but are currently missing or incomplete in the implementation:

- **Missing Model Fields**: 
  - `likes_count` in the [Post model](file:///Users/tecxkhalil/BSEM-1204-GROUP10/BSEM-1204-GROUP10/app/models/post.py).
- **Async Functionality**: 
  - Implementation of async endpoints beyond the root route (e.g., `get_trending_posts()` as suggested in the brief).
- **Database Migrations**: 
  - Setup of **Alembic** for handling database schema changes (currently using `Base.metadata.create_all`).
- **Final Documentation & Assets**:
  - Screenshots of functional endpoints (Register, Login, Post CRUD, Comments, Likes).
  - A more detailed 2-3 page report on design choices and SDG alignment.

## 2. Professional Security Enhancements
To make the API production-ready and secure:

- **Password Policy**: Implement validation for password strength (length, special characters).
- **Token Management**:
  - **Refresh Tokens**: Allow users to stay logged in without sending credentials frequently.
  - **Token Blacklisting**: Implement a logout mechanism that invalidates JWTs.
- **Rate Limiting**: Protect endpoints from brute-force and DoS attacks.
- **CORS Hardening**: Restrict `allow_origins` from `*` to specific trusted domains.
- **Input Sanitization**: Ensure all user-generated content is sanitized to prevent XSS or injection.

## 3. Essential User Features
Features expected in a modern social media platform:

- **User Profiles**: Endpoints to manage bios, profile pictures, and public profile views.
- **Social Graph**: Follow/Unfollow functionality to build a feed.
- **User Search**: Ability to find other users by username or name.
- **Account Management**: Password reset flow and account deletion (soft delete).

## 4. Advanced Content Management
- **Pagination**: Implement `limit` and `offset` for [posts](file:///Users/tecxkhalil/BSEM-1204-GROUP10/BSEM-1204-GROUP10/app/routers/posts.py) and [comments](file:///Users/tecxkhalil/BSEM-1204-GROUP10/BSEM-1204-GROUP10/app/routers/comments.py) to handle large data volumes.
- **Media Support**: Support for image/video uploads and storage (e.g., integration with AWS S3).
- **Search & Filtering**: Search posts by keywords or filter by hashtags and dates.
- **Nested Comments**: Support for replies to comments.
- **Privacy Settings**: Allow users to set posts as public or private.

## 5. Reliability & DevOps
- **Structured Logging**: Use a logging library to track errors and events instead of basic print statements.
- **Error Tracking**: Integration with tools like Sentry for real-time error monitoring.
- **Health Checks**: A `/health` endpoint for monitoring system status.
- **Containerization**: [Dockerfile](file:///Users/tecxkhalil/BSEM-1204-GROUP10/BSEM-1204-GROUP10/Dockerfile) and [docker-compose.yml](file:///Users/tecxkhalil/BSEM-1204-GROUP10/BSEM-1204-GROUP10/docker-compose.yml) for consistent deployment environments.
- **CI/CD**: Automated testing and deployment pipelines.

## 6. Performance
- **Caching**: Use Redis to cache frequently accessed data like trending posts or user sessions.
- **Database Indexing**: Add indexes to frequently queried columns (e.g., `created_at`, `user_id`).
- **Background Tasks**: Use Celery for non-blocking operations like sending emails or processing media.

## 7. Real-time Features
- **Notifications**: WebSockets or Push Notifications for likes, comments, and new followers.
