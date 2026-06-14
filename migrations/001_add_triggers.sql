-- ============================================================
-- TRIGGER FUNCTIONS
-- Each function copies the deleted row into the matching
-- archive table before the deletion is committed.
-- ============================================================

CREATE OR REPLACE FUNCTION archive_user_before_delete()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO deleted_users (
        original_id, username, email, hashed_password,
        bio, avatar_url, deleted_at
    )
    VALUES (
        OLD.id, OLD.username, OLD.email, OLD.hashed_password,
        OLD.bio, OLD.avatar_url, NOW()
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION archive_post_before_delete()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO deleted_posts (
        original_id, title, content, user_id, created_at, deleted_at
    )
    VALUES (
        OLD.id, OLD.title, OLD.content, OLD.user_id, OLD.created_at, NOW()
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION archive_comment_before_delete()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO deleted_comments (
        original_id, content, post_id, user_id, created_at, deleted_at
    )
    VALUES (
        OLD.id, OLD.content, OLD.post_id, OLD.user_id, OLD.created_at, NOW()
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- TRIGGERS
-- Attached to the live tables. Fire BEFORE DELETE so the
-- archive write happens inside the same transaction.
-- ============================================================

DROP TRIGGER IF EXISTS trg_archive_user ON users;
CREATE TRIGGER trg_archive_user
    BEFORE DELETE ON users
    FOR EACH ROW
    EXECUTE FUNCTION archive_user_before_delete();


DROP TRIGGER IF EXISTS trg_archive_post ON posts;
CREATE TRIGGER trg_archive_post
    BEFORE DELETE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION archive_post_before_delete();


DROP TRIGGER IF EXISTS trg_archive_comment ON comments;
CREATE TRIGGER trg_archive_comment
    BEFORE DELETE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION archive_comment_before_delete();
