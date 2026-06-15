# Social Media Post API — Presentation Guide

> **For:** BSEM-1204-GROUP10 — Class Presentation
> **Project:** Social Media Post API (FastAPI + PostgreSQL), SDG 16: Peace,
> Justice and Strong Institutions
> **Format:** Each section below belongs to one presenter. Read your section,
> rehearse your demo steps, and know your Q&A answers cold. The closing
> section is shared.

---

## Presentation Flow & Timing (suggested: 12–15 minutes total)

| Order | Presenter | Segment | Time |
|---|---|---|---|
| 1 | Member 1 | Project Overview + Database Architecture + Post CRUD | 3 min |
| 2 | Member 2 | Authentication & Security | 3 min |
| 3 | Member 3 | Social Interactions — Comments & Likes | 2.5 min |
| 4 | You (Member 4) | Advanced Features — Social Graph, Search, Data Integrity, Frontend | 4 min |
| 5 | Whole team | End-to-End Live Demo | 2-3 min |
| 6 | Whole team | SDG 16 Alignment + Q&A | remainder |

**Hand-off rule:** end your segment with the transition line provided so the
next presenter has a clean entry point — no awkward "okay, um, next is...".

**Before you start:** have the server running (`python main.py`), Swagger UI
open at `http://localhost:8001/docs`, and the frontend open in another tab.
Pre-register 2-3 test accounts and have one already logged in so demos don't
stall on typing.

---

## Member 1 — Project Overview & Database Architecture / Post CRUD

### Your Opening (also covers project intro for the whole team)

> "Good [morning/afternoon], we're presenting our Social Media Post API — a
> backend system built with FastAPI and PostgreSQL, designed around SDG 16:
> Peace, Justice and Strong Institutions. The core idea is simple: give Sierra
> Leonean youth a platform to express themselves and engage in dialogue, but
> build it on a foundation of accountability, data integrity, and security —
> the same principles SDG 16 asks of institutions, applied to software.
>
> My focus was the database layer and the core Posts feature — the
> foundation everything else in this project is built on."

### Talking Points

- **Why PostgreSQL, not SQLite:** production-grade, supports concurrent
  writes, enforces relational integrity at the database level, and — as
  you'll hear later — supports database triggers, which became important for
  our data-integrity features.
- **ORM choice:** SQLAlchemy. Models are defined as Python classes
  (`User`, `Post`, `Comment`, `Like`), and SQLAlchemy handles the SQL
  generation, relationships, and foreign key constraints.
- **Schema design for Posts:**
  - `id`, `title`, `content`, `user_id` (foreign key to `users`)
  - `created_at` and `updated_at`, both auto-managed by SQLAlchemy
    (`default=datetime.utcnow`, `onupdate=datetime.utcnow`)
  - A `relationship()` to `User` so we can access `post.user` directly
- **CRUD implementation:**
  - `POST /posts/` — requires authentication, post is automatically tied to
    `current_user.id` (no spoofing another user's identity)
  - `GET /posts/` — public, paginated with `skip`/`limit`, ordered newest
    first, returns `like_count` and `comment_count` computed at query time
  - `GET /posts/{id}` — public, single post lookup
  - `PUT /posts/{id}` / `DELETE /posts/{id}` — **ownership-checked**: the API
    verifies `post.user_id == current_user.id` before allowing the change,
    returning `403 Forbidden` otherwise
- **Pagination matters:** with `skip`/`limit` query params, the API doesn't
  return the entire posts table at once — this is how real platforms handle
  scale.

### Live Demo Steps

1. In Swagger, expand `GET /posts/` — show the `skip`/`limit` params, execute
   with `limit=5`, point out `like_count` / `comment_count` in the response.
2. Expand `POST /posts/` — show that it requires the lock icon (auth), execute
   it to create a post.
3. Expand `PUT /posts/{post_id}` — briefly mention you'd get a 403 if you tried
   this on someone else's post (don't need to prove it live, just state it).

### Anticipated Questions

- *"Why compute like_count/comment_count on every request instead of storing
  a counter column?"* — Storing a counter risks it going out of sync if a
  like/comment is deleted outside normal flow. Computing it live guarantees
  correctness; at our current scale the extra query cost is negligible, and
  it's a classic normalization-vs-denormalization tradeoff.
- *"What happens to a post's comments/likes if the post is deleted?"* — That's
  actually part of Member 4's segment (account/content deletion cascade) —
  hand off if asked early.

### Transition Line

> "Of course, none of this works without knowing *who* is creating these
> posts — that's where authentication comes in. I'll hand it over to
> [Member 2's name]."

---

## Member 2 — Authentication & Security

### Talking Points

- **JWT-based authentication** using `python-jose`. On login, the API issues
  a signed token (`HS256`, `SECRET_KEY` from environment config) containing
  the username and an expiry claim.
- **Why JWT over session cookies:** stateless — the server doesn't need to
  store session data, which scales better and fits a REST API cleanly. The
  frontend stores the token and sends it as `Authorization: Bearer <token>`
  on every protected request.
- **Password hashing — Argon2, not bcrypt or plain SHA:** Argon2 won the
  Password Hashing Competition and is specifically designed to resist
  GPU/ASIC cracking attacks, which makes it the current best-practice choice
  for credential storage. Implemented via `passlib`.
- **The `OAuth2PasswordBearer` flow:** standard FastAPI pattern. `/auth/login`
  accepts form-encoded `username`/`password` (OAuth2 spec compliance — this
  is also why Swagger's "Authorize" button works out of the box), validates
  the password against the stored Argon2 hash, and returns
  `{"access_token": ..., "token_type": "bearer"}`.
- **`get_current_user` dependency:** every protected route depends on this
  function, which decodes the JWT, looks up the user in the database, and
  raises `401 Unauthorized` if the token is missing, expired, or invalid.
  This is dependency injection doing security's heavy lifting — no repeated
  auth code in every route.
- **Rate limiting:** `/auth/login` is limited to **5 attempts per minute per
  IP** using `slowapi` — a direct defense against brute-force password
  guessing.
- **User profiles:** users have `username`, `email`, `bio`, `avatar_url`.
  `GET /users/me` and `PUT /users/me` let users view and update their own
  profile — again ownership-scoped, you can only ever edit *yourself*.

### Live Demo Steps

1. In Swagger, execute `POST /auth/register` with a new test account.
2. Execute `POST /auth/login` — show the returned `access_token`.
3. Click **Authorize**, paste the token, show the lock icons changing to
   "authorized" across the protected endpoints.
4. Execute `GET /users/me` — show it returns the profile tied to the token,
   with no `hashed_password` field ever exposed in any response.

### Anticipated Questions

- *"What if someone steals a token?"* — Tokens expire after 30 minutes
  (`ACCESS_TOKEN_EXPIRE_MINUTES`), limiting the exposure window. A production
  system would add refresh tokens and token revocation, which we've scoped as
  future work.
- *"Why not just hash with SHA-256?"* — SHA-256 is fast, which is exactly the
  *wrong* property for password hashing — fast hashes are what make brute
  force feasible. Argon2 is deliberately slow and memory-hard.
- *"Is the SECRET_KEY hardcoded?"* — No, it's loaded from `.env` via
  `python-dotenv` and excluded from version control.

### Transition Line

> "So now we know who's logged in and that their identity is verified — but a
> social platform isn't just posts, it's *interaction*. Over to
> [Member 3's name] for comments and likes."

---

## Member 3 — Social Interactions: Comments & Likes

### Talking Points

- **Comments:**
  - `POST /comments/?post_id={id}` — adds a comment to a post, tied to
    `current_user.id` automatically, same pattern as posts.
  - `GET /comments/post/{post_id}` — public, returns all comments on a post.
  - `PUT /comments/{id}` and `DELETE /comments/{id}` — ownership-checked, same
    403 pattern as posts. Users can only edit or delete *their own* comments.
- **Likes:**
  - `POST /likes/{post_id}` — likes a post.
  - **Database-level duplicate prevention:** the `likes` table has a
    `UNIQUE(post_id, user_id)` constraint. Even if our application logic had a
    bug, the database itself would reject a duplicate like — this is
    defense-in-depth, not relying on application code alone.
  - `DELETE /likes/{post_id}` — unlikes a post.
- **Why this matters for SDG 16:** comments and likes are how "constructive
  digital dialogue" actually happens on the platform — but every single
  interaction is tied to an authenticated, accountable user. There's no
  anonymous posting, which directly supports the "Strong Institutions" pillar
  of the goal — actions have identifiable owners.
- **Documentation:** in addition to building these features, I maintained our
  project documentation — the README, `AUTHENTICATION_GUIDE.md`, and
  `POSTGRESQL_SETUP.md` — and we rely on FastAPI's auto-generated Swagger
  (`/docs`) and ReDoc (`/redoc`) for live, always-accurate API documentation
  that's generated directly from our code, so it can never drift out of sync
  with what the API actually does.

### Live Demo Steps

1. Execute `POST /comments/?post_id={id}` on the post created earlier — show
   the response.
2. Execute `GET /comments/post/{id}` — show the comment appears.
3. Execute `POST /likes/{id}` — then execute it again to show the `400 Already
   liked this post` error (demonstrates the unique constraint in action).
4. Briefly switch to `/docs` and `/redoc` tabs — "this documentation is
   generated automatically from our FastAPI code, it's never out of date."

### Anticipated Questions

- *"What stops someone from editing another user's comment?"* — Same
  ownership check pattern as posts: `comment.user_id != current_user.id` →
  `403 Forbidden`.
- *"Why a separate likes table instead of a 'likes count' column on posts?"*
  — We need to know *who* liked a post (to show "liked by you" state, prevent
  duplicates, and potentially show a likers list later) — a count column alone
  loses that information.

### Transition Line

> "Comments and likes make the platform interactive — but a *social* network
> needs a social graph: who follows whom, a personalized feed, and the ability
> to find people and content. That — plus how we handle account deletion
> responsibly — is what I built, so I'll take it from here."

---

## You (Member 4) — Advanced Features: Social Graph, Search, Data Integrity & Frontend

### Talking Points — Social Graph & Feed

- **Follow system:** `POST/DELETE /users/{id}/follow`, backed by a `follows`
  table with `follower_id`, `following_id`, and a `UNIQUE(follower_id,
  following_id)` constraint — same defense-in-depth principle as the likes
  table, preventing duplicate follows at the database level.
- **Personalized feed:** `GET /feed/` returns posts only from users the
  current user follows, paginated and ordered newest-first — this is the
  difference between a public firehose (`/posts/`) and a curated, relevant
  feed.
- **Public profiles:** `GET /users/{id}` returns follower/following counts
  and `GET /users/{id}/posts` returns that user's posts — enabling a full
  profile page experience.

### Talking Points — Search

- `GET /search/posts?q=` and `GET /search/users?q=` — case-insensitive search
  using SQL `ILIKE` across post titles/content and usernames. Simple, but it's
  the difference between a platform where content is *discoverable* versus
  content that disappears the moment it scrolls off a feed.

### Talking Points — Account Deletion & Data Integrity (the SDG 16 highlight)

- **`DELETE /users/me`** doesn't just delete a row — it performs a full,
  ordered cascade: the user's likes on others' posts, comments on others'
  posts, their own posts' likes and comments, their follow relationships, and
  finally their posts and account — all deleted in an order that respects
  foreign key constraints.
- **The PostgreSQL trigger system — this is the centerpiece:** before a user,
  post, or comment is deleted, a `BEFORE DELETE` trigger automatically copies
  that row into a parallel `deleted_users` / `deleted_posts` /
  `deleted_comments` table, stamped with `deleted_at`.
  - This happens at the **database level**, not in application code — so it's
    guaranteed to fire no matter how the deletion happens.
  - **Why this matters for SDG 16:** "Strong Institutions" means
    accountability and auditability. A user can exercise their right to
    delete their data (data ownership), but the platform retains an auditable
    record for moderation/dispute purposes — this is the same principle
    behind how real platforms handle "right to erasure" while still
    maintaining trust and safety records.
- **Admin endpoints:** `GET /admin/deleted-users`, `/deleted-posts`,
  `/deleted-comments` — accessible only to users with `is_admin = true`,
  demonstrating role-based access control beyond simple ownership checks.

### Talking Points — Frontend

- I built a complete frontend — plain HTML, CSS, and JavaScript, no
  frameworks — covering 9 screens: Login, Register, Explore, Feed, Post
  Detail, Create Post, Profile, Settings, and Search.
- The frontend's `api.js` is a centralized API client — every request
  automatically attaches the JWT, so the rest of the app never has to think
  about authentication headers.
- This proves the API isn't just theoretical — it's a fully working product
  end-to-end.

### Live Demo Steps (this is the showcase moment — take your time)

1. Open the frontend. Show the **Explore** feed (public posts, paginated).
2. **Register** a second test account, get redirected straight into the app.
3. **Follow** the first account from its profile page.
4. Go to **Feed** — show it's now populated (empty before the follow).
5. **Search** for a post or user — show results.
6. Go to **Settings** → demonstrate **Delete Account** (use a throwaway test
   account created just for this).
7. Switch to Swagger, log in as an admin account, execute
   `GET /admin/deleted-users` — show the just-deleted account sitting in the
   archive table with a `deleted_at` timestamp.

> This last step is the "wow" moment — it visibly proves the trigger fired
> automatically and ties directly back to the SDG 16 framing from the start.

### Anticipated Questions

- *"Could a user just delete the archive record themselves?"* — No — the
  archive tables are only readable via `/admin/*` endpoints, gated by
  `is_admin`, and there's no delete endpoint for archive records at all in
  this version.
- *"What if the feed is empty for a new user?"* — That's expected and
  correct — `/feed/` only shows followed users' posts. We handle this in the
  frontend with an empty state prompting the user to explore and follow
  people.
- *"Why build a frontend if this is a backend project?"* — To prove the API
  design is actually usable end-to-end, and to give a tangible demo instead of
  only raw JSON in Swagger.

---

## Closing — SDG 16 Alignment (Whole Team)

Whoever closes (suggest: Member 4, since the deletion/archive demo leads
naturally here) can use this:

> "To bring it back to where we started — SDG 16 is about peace, justice, and
> strong institutions, and we mapped that directly onto technical decisions:
> every action on this platform is tied to an authenticated, accountable user
> via JWT and Argon2; ownership checks ensure users control only their own
> content; database constraints prevent data integrity issues even if
> application code has bugs; and our deletion-and-archiving system balances a
> user's right to remove their data with the platform's need for
> accountability and auditability. This isn't just a CRUD app with a login
> screen — every layer was a deliberate choice in service of building a
> *responsible* digital space."

---

## Q&A Prep — Likely Cross-Cutting Questions

| Question | Suggested Answer |
|---|---|
| "What would you do differently with more time?" | Refresh tokens / token revocation, real-time notifications, image uploads for posts and avatars, automated tests (pytest) |
| "How is this tested?" | Manually via Swagger UI during development; mention automated testing (pytest + TestClient) as a known gap / future work — don't claim tests exist if they don't |
| "Why FastAPI over Flask/Django?" | Built-in request validation via Pydantic, automatic OpenAPI docs, native async support, and dependency injection made security (auth) and validation far less error-prone |
| "How would this scale to thousands of users?" | Pagination is already in place; next steps would be database indexing review, caching for hot endpoints (e.g. feed), and connection pooling tuning |
| "Is the database schema normalized?" | Yes — separate tables for posts/comments/likes/follows with foreign keys rather than embedding arrays/JSON blobs, which keeps data consistent and queryable |

---

## Final Tips for an A+ Delivery

- **Don't read verbatim** — know your section well enough to speak naturally;
  the script is a safety net, not a teleprompter.
- **Make eye contact with the class, not the screen**, except during the demo.
- **If a demo step fails live**, don't panic — say what *should* happen and
  move on; have a backup screenshot/recording as insurance.
- **Speak in terms of decisions, not just features** — "we chose X because Y"
  is what separates an A+ presentation from a feature list.
- **Support each other** — if a teammate gets a tough question, it's fine for
  another member to jump in with "I can add to that—".
