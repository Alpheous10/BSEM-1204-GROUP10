-- ============================================================
--  Social Media Post API — PostgreSQL Database Schema
--  PROG315 | Object-Oriented Programming 2
--  Limkokwing University of Creative Technology, Sierra Leone
--  Member 1 — Full Database Setup
-- ============================================================

-- Step 1: Create the database (run this separately if needed)
-- CREATE DATABASE social_media_db;

-- Connect to the database before running the rest:
-- \c social_media_db


-- ============================================================
-- TABLE: users
-- Stores registered user accounts (Authentication & Authorization)
-- CRUD: Register (INSERT), Login (SELECT), Update profile (UPDATE), Delete account (DELETE)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id                SERIAL PRIMARY KEY,
    username          VARCHAR(100)  NOT NULL UNIQUE,
    email             VARCHAR(255)  NOT NULL UNIQUE,
    hashed_password   VARCHAR(255)  NOT NULL,
    created_at        TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Indexes for fast username and email lookups (used during login/auth)
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_users_email    ON users (email);


-- ============================================================
-- TABLE: posts
-- Stores social media posts created by users
-- CRUD: Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE)
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255)                NOT NULL,
    content     TEXT                        NOT NULL,
    user_id     INTEGER                     NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at  TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Index for fast lookup of posts by user
CREATE INDEX IF NOT EXISTS idx_posts_user_id   ON posts (user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);


-- ============================================================
-- TABLE: likes
-- Tracks which users liked which posts (one like per user per post)
-- CRUD: Like (INSERT), Unlike (DELETE), Check liked (SELECT), Count likes (SELECT COUNT)
-- ============================================================
CREATE TABLE IF NOT EXISTS likes (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    post_id     INTEGER NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
    created_at  TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),

    -- Prevents a user from liking the same post more than once
    CONSTRAINT unique_user_post_like UNIQUE (user_id, post_id)
);

-- Indexes for fast like lookups
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes (post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes (user_id);


-- ============================================================
-- TABLE: comments
-- Stores comments made by users on posts
-- CRUD: Add comment (INSERT), Read comments (SELECT), Update comment (UPDATE), Delete comment (DELETE)
-- ============================================================
CREATE TABLE IF NOT EXISTS comments (
    id          SERIAL PRIMARY KEY,
    content     TEXT    NOT NULL,
    user_id     INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    post_id     INTEGER NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
    created_at  TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Indexes for fast comment lookups by post and user
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments (user_id);


-- ============================================================
-- TRIGGER FUNCTION: auto-update updated_at on row change
-- Applied to: posts, comments
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on posts
DROP TRIGGER IF EXISTS set_posts_updated_at ON posts;
CREATE TRIGGER set_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger on comments
DROP TRIGGER IF EXISTS set_comments_updated_at ON comments;
CREATE TRIGGER set_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- SAMPLE DATA (optional — comment out if not needed)
-- ============================================================

-- Test user (hashed password = "password123" via bcrypt)
-- INSERT INTO users (username, email, hashed_password)
-- VALUES ('john_doe', 'john@example.com', '$2b$12$examplehashedpassword');

-- Test post
-- INSERT INTO posts (title, content, user_id)
-- VALUES ('Hello Sierra Leone', 'This is my first post!', 1);

-- Test like
-- INSERT INTO likes (user_id, post_id)
-- VALUES (1, 1);

-- Test comment
-- INSERT INTO comments (content, user_id, post_id)
-- VALUES ('Great post!', 1, 1);


-- ============================================================
-- VERIFY: Show all created tables
-- ============================================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
