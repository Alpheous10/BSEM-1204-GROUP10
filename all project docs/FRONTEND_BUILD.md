# Frontend Build Spec — HTML / CSS / JS

> **Prerequisite:** Both `MVP_UPGRADE_SPEC.md` and `BACKEND_PATCH_2.md` must be
> fully applied and the server must be running on `http://localhost:8002` before
> building or testing the frontend.

---

## 0. MVP Screens Decision

After reviewing the API, these are the **9 screens** required for a complete MVP:

| # | Screen | Route | Auth Required |
|---|--------|-------|--------------|
| 1 | Explore | `#/explore` | No |
| 2 | Login | `#/login` | No |
| 3 | Register | `#/register` | No |
| 4 | Feed | `#/feed` | Yes → redirects to Explore |
| 5 | Post Detail | `#/post/:id` | No (like/comment requires auth) |
| 6 | Create Post | `#/create` | Yes → redirects to Login |
| 7 | User Profile | `#/profile/:id` | No (follow requires auth) |
| 8 | Edit Profile + Delete Account | `#/settings` | Yes → redirects to Login |
| 9 | Search | `#/search` | No |

**Architecture:** Single-page app (SPA) with hash-based routing. No frameworks,
no build tools. Pure HTML, CSS, and JavaScript using the Fetch API.

---

## 1. File Structure

Create a `frontend/` folder in the project root with this exact structure:

```
frontend/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── api.js
    └── app.js
```

---

## 2. Create `frontend/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SocialApp</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <nav id="navbar"></nav>
  <main id="app"></main>
  <script src="js/api.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

---

## 3. Create `frontend/css/style.css`

```css
/* ============================================================
   RESET & BASE
   ============================================================ */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

a {
  color: var(--primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
:root {
  --primary:        #4F46E5;
  --primary-hover:  #4338CA;
  --bg:             #F1F5F9;
  --surface:        #FFFFFF;
  --text:           #0F172A;
  --muted:          #64748B;
  --border:         #E2E8F0;
  --danger:         #EF4444;
  --danger-hover:   #DC2626;
  --success:        #10B981;
  --radius:         12px;
  --shadow:         0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:      0 4px 12px rgba(0,0,0,0.08);
  --navbar-height:  64px;
}

/* ============================================================
   NAVBAR
   ============================================================ */
#navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
  z-index: 100;
  box-shadow: var(--shadow);
}

.nav-logo {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--primary);
  text-decoration: none;
  letter-spacing: -0.5px;
  white-space: nowrap;
  cursor: pointer;
}

.nav-search {
  flex: 1;
  max-width: 360px;
}

.nav-search input {
  width: 100%;
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 24px;
  font-size: 0.875rem;
  background: var(--bg);
  color: var(--text);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.nav-search input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

/* ============================================================
   MAIN CONTENT AREA
   ============================================================ */
#app {
  padding-top: calc(var(--navbar-height) + 32px);
  padding-bottom: 64px;
  min-height: 100vh;
}

/* ============================================================
   LAYOUT CONTAINERS
   ============================================================ */
.container {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 16px;
}

.container-wide {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px;
}

/* ============================================================
   BUTTONS
   ============================================================ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  border: none;
  transition: background 0.15s, color 0.15s, border-color 0.15s, transform 0.1s;
  white-space: nowrap;
  line-height: 1;
}

.btn:active { transform: scale(0.97); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.btn-primary  { background: var(--primary); color: white; }
.btn-primary:hover:not(:disabled)  { background: var(--primary-hover); }

.btn-outline {
  background: transparent;
  color: var(--primary);
  border: 1.5px solid var(--primary);
}
.btn-outline:hover:not(:disabled) { background: var(--primary); color: white; }

.btn-ghost   { background: transparent; color: var(--text); }
.btn-ghost:hover:not(:disabled) { background: var(--bg); }

.btn-danger  { background: var(--danger); color: white; }
.btn-danger:hover:not(:disabled) { background: var(--danger-hover); }

.btn-sm   { padding: 5px 12px; font-size: 0.8rem; }
.btn-full { width: 100%; }

/* ============================================================
   FORM ELEMENTS
   ============================================================ */
.form-card {
  max-width: 440px;
  margin: 32px auto;
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border);
  padding: 36px 32px;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text);
}

.form-subtitle {
  font-size: 0.875rem;
  color: var(--muted);
  margin-bottom: 28px;
}

.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 6px;
}

.form-control {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--text);
  background: var(--surface);
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.form-control:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

/* ============================================================
   ALERTS
   ============================================================ */
.alert {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 16px;
}

.alert-error   { background: #FEF2F2; color: var(--danger);  border: 1px solid #FECACA; }
.alert-success { background: #ECFDF5; color: var(--success); border: 1px solid #A7F3D0; }

/* ============================================================
   CARD
   ============================================================ */
.card {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  overflow: hidden;
}

/* ============================================================
   POST CARDS
   ============================================================ */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.post-card {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  padding: 20px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.post-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
}

.post-excerpt {
  font-size: 0.9rem;
  color: var(--muted);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 14px;
}

.post-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 16px;
  font-size: 0.8rem;
  color: var(--muted);
}

.post-stats {
  display: flex;
  gap: 12px;
  margin-left: auto;
}

.stat { display: flex; align-items: center; gap: 4px; }

/* ============================================================
   AVATAR
   ============================================================ */
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.avatar-lg { width: 80px; height: 80px; font-size: 1.75rem; }
.avatar-sm { width: 30px; height: 30px; font-size: 0.8rem; }

/* ============================================================
   PROFILE
   ============================================================ */
.profile-header {
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  padding: 28px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;
}

.profile-info { flex: 1; }

.profile-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.profile-bio {
  color: var(--muted);
  font-size: 0.9rem;
  margin-bottom: 14px;
  max-width: 400px;
}

.profile-stats {
  display: flex;
  gap: 24px;
  font-size: 0.875rem;
}

.stat-num   { font-weight: 700; color: var(--text); }
.stat-label { color: var(--muted); }

/* ============================================================
   TABS
   ============================================================ */
.tab-bar {
  display: flex;
  border-bottom: 2px solid var(--border);
  margin-bottom: 20px;
}

.tab {
  padding: 10px 18px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.15s, border-color 0.15s;
}

.tab.active { color: var(--primary); border-bottom-color: var(--primary); }
.tab:hover:not(.active) { color: var(--text); }

/* ============================================================
   USER CARDS (search results)
   ============================================================ */
.user-card {
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.user-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.user-card-info { flex: 1; }
.user-card-name { font-weight: 600; font-size: 0.95rem; margin-bottom: 2px; }
.user-card-bio  { font-size: 0.82rem; color: var(--muted); }

/* ============================================================
   COMMENTS
   ============================================================ */
.comment-item {
  display: flex;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}

.comment-item:last-child { border-bottom: none; }

.comment-body   { flex: 1; }
.comment-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.comment-author { font-weight: 600; font-size: 0.875rem; }
.comment-time   { font-size: 0.75rem; color: var(--muted); }
.comment-text   { font-size: 0.9rem; color: var(--text); line-height: 1.5; }

/* ============================================================
   LIKE BUTTON
   ============================================================ */
.like-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 24px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--muted);
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.like-btn:hover, .like-btn.liked {
  background: #FEF2F2;
  border-color: var(--danger);
  color: var(--danger);
}

/* ============================================================
   PAGE HEADER
   ============================================================ */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.3px;
}

/* ============================================================
   POST DETAIL
   ============================================================ */
.post-detail-title {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 14px;
  letter-spacing: -0.3px;
}

.post-detail-body {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text);
  margin-bottom: 28px;
  white-space: pre-wrap;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

/* ============================================================
   LOADING & EMPTY STATES
   ============================================================ */
.loading {
  text-align: center;
  padding: 56px 24px;
  color: var(--muted);
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 56px 24px;
  color: var(--muted);
}

.empty-icon  { font-size: 2.5rem; margin-bottom: 14px; }
.empty-title { font-size: 1.05rem; font-weight: 600; color: var(--text); margin-bottom: 8px; }
.empty-desc  { font-size: 0.875rem; margin-bottom: 20px; }

/* ============================================================
   LOAD MORE
   ============================================================ */
.load-more {
  text-align: center;
  margin-top: 24px;
}

/* ============================================================
   DANGER ZONE
   ============================================================ */
.danger-zone {
  border: 1.5px solid #FECACA;
  border-radius: var(--radius);
  padding: 20px 24px;
  margin-top: 36px;
  background: #FEF2F2;
}

.danger-zone-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--danger);
  margin-bottom: 6px;
}

.danger-zone-desc {
  font-size: 0.85rem;
  color: var(--muted);
  margin-bottom: 16px;
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 640px) {
  #navbar { padding: 0 12px; gap: 8px; }
  .nav-search { display: none; }
  .btn-ghost.nav-link { display: none; }
  .form-card { margin: 16px auto; padding: 24px 20px; }
  .profile-header { flex-direction: column; align-items: center; text-align: center; }
  .profile-stats { justify-content: center; }
  .post-detail-title { font-size: 1.35rem; }
}
```

---

## 4. Create `frontend/js/api.js`

```javascript
// ================================================================
// API MODULE
// All communication with the backend goes through this file.
// Base URL points to the FastAPI server.
// ================================================================

const BASE_URL = 'http://localhost:8002';

// ── Token helpers ────────────────────────────────────────────────
function getToken() {
  return localStorage.getItem('token');
}

// ── Generic JSON request ─────────────────────────────────────────
async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body !== null) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (res.status === 204) return null;

  const data = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(data.detail)
      ? data.detail.map(e => e.msg).join(', ')
      : (data.detail || 'Something went wrong');
    throw new Error(msg);
  }
  return data;
}

// ── Form-encoded request (used for OAuth2 login) ─────────────────
async function formRequest(path, fields) {
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const body = new URLSearchParams(fields).toString();
  const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', headers, body });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Login failed');
  return data;
}

// ================================================================
// API METHODS
// ================================================================
const api = {

  auth: {
    register : (data)             => request('POST', '/auth/register', data),
    login    : (username, password) => formRequest('/auth/login', { username, password }),
  },

  users: {
    me         : ()               => request('GET',    '/users/me'),
    updateMe   : (data)           => request('PUT',    '/users/me', data),
    deleteMe   : ()               => request('DELETE', '/users/me'),
    getUser    : (id)             => request('GET',    `/users/${id}`),
    getUserPosts: (id, skip = 0, limit = 10) =>
                                     request('GET',    `/users/${id}/posts?skip=${skip}&limit=${limit}`),
    follow     : (id)             => request('POST',   `/users/${id}/follow`),
    unfollow   : (id)             => request('DELETE', `/users/${id}/follow`),
    getFollowers : (id)           => request('GET',    `/users/${id}/followers`),
    getFollowing : (id)           => request('GET',    `/users/${id}/following`),
  },

  posts: {
    getAll : (skip = 0, limit = 10) => request('GET',    `/posts/?skip=${skip}&limit=${limit}`),
    get    : (id)                   => request('GET',    `/posts/${id}`),
    create : (data)                 => request('POST',   '/posts/', data),
    update : (id, data)             => request('PUT',    `/posts/${id}`, data),
    delete : (id)                   => request('DELETE', `/posts/${id}`),
  },

  comments: {
    getByPost : (postId)           => request('GET',    `/comments/post/${postId}`),
    create    : (content, postId)  => request('POST',   `/comments/?post_id=${postId}`, { content }),
    update    : (id, content)      => request('PUT',    `/comments/${id}`, { content }),
    delete    : (id)               => request('DELETE', `/comments/${id}`),
  },

  likes: {
    like   : (postId) => request('POST',   `/likes/${postId}`),
    unlike : (postId) => request('DELETE', `/likes/${postId}`),
  },

  feed: {
    get : (skip = 0, limit = 10) => request('GET', `/feed/?skip=${skip}&limit=${limit}`),
  },

  search: {
    posts : (q, skip = 0, limit = 10) =>
              request('GET', `/search/posts?q=${encodeURIComponent(q)}&skip=${skip}&limit=${limit}`),
    users : (q, skip = 0, limit = 10) =>
              request('GET', `/search/users?q=${encodeURIComponent(q)}&skip=${skip}&limit=${limit}`),
  },
};
```

---

## 5. Create `frontend/js/app.js`

```javascript
// ================================================================
// STATE
// ================================================================
const state = {
  user      : JSON.parse(localStorage.getItem('user') || 'null'),
  likedPosts: new Set(),   // tracks likes made in this session
};

function getToken()   { return localStorage.getItem('token'); }
function isLoggedIn() { return !!getToken() && !!state.user; }

function setAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  state.user = user;
}

function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  state.user = null;
  state.likedPosts.clear();
}

// ================================================================
// UTILITIES
// ================================================================
function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function esc(str) {
  const d = document.createElement('div');
  d.textContent = String(str || '');
  return d.innerHTML;
}

function navigate(hash) {
  window.location.hash = hash;
}

function showAlert(containerId, message, type = 'error') {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type}">${esc(message)}</div>`;
  if (type === 'success') setTimeout(() => { if (el) el.innerHTML = ''; }, 3500);
}

function setLoading(btnId, isLoading, label) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = isLoading;
  btn.textContent = isLoading ? 'Please wait...' : label;
}

// ── Avatar ───────────────────────────────────────────────────────
function avatarHtml(user, size = '') {
  const cls   = `avatar${size ? ' avatar-' + size : ''}`;
  const color = '#4F46E5';
  const init  = (user && user.username) ? user.username[0].toUpperCase() : '?';
  if (user && user.avatar_url) {
    return `<img class="${cls}" src="${esc(user.avatar_url)}" alt="${esc(user.username)}"
              onerror="this.outerHTML='<div class=\\'${cls}\\' style=\\'background:${color};color:white\\'>${init}</div>'" />`;
  }
  return `<div class="${cls}" style="background:${color};color:white">${init}</div>`;
}

// ── Post card ────────────────────────────────────────────────────
function postCard(post, authorName) {
  const name = authorName ? `@${esc(authorName)}` : `User #${post.user_id}`;
  return `
  <div class="post-card" onclick="navigate('#/post/${post.id}')">
    <div class="post-title">${esc(post.title)}</div>
    <div class="post-excerpt">${esc(post.content)}</div>
    <div class="post-meta">
      <span>by <a href="#/profile/${post.user_id}"
        onclick="event.stopPropagation()">${name}</a></span>
      <span>${timeAgo(post.created_at)}</span>
      <div class="post-stats">
        <span class="stat">❤️ ${post.like_count  || 0}</span>
        <span class="stat">💬 ${post.comment_count || 0}</span>
      </div>
    </div>
  </div>`;
}

// ── User card ────────────────────────────────────────────────────
function userCard(user) {
  const isOwn = state.user && state.user.id === user.id;
  const followBtn = isLoggedIn() && !isOwn
    ? `<button class="btn btn-outline btn-sm"
         onclick="event.stopPropagation(); handleFollowById(${user.id}, this)">Follow</button>`
    : '';
  return `
  <div class="user-card" onclick="navigate('#/profile/${user.id}')">
    ${avatarHtml(user)}
    <div class="user-card-info">
      <div class="user-card-name">@${esc(user.username)}</div>
      <div class="user-card-bio">${esc(user.bio || '')}</div>
    </div>
    ${followBtn}
  </div>`;
}

// ── Comment item ─────────────────────────────────────────────────
function commentItem(c, authorName) {
  const isOwn = state.user && state.user.id === c.user_id;
  const name  = authorName || `User #${c.user_id}`;
  return `
  <div class="comment-item" id="comment-${c.id}">
    ${avatarHtml({ username: name }, 'sm')}
    <div class="comment-body">
      <div class="comment-header">
        <span class="comment-author">@${esc(name)}</span>
        <span class="comment-time">${timeAgo(c.created_at)}</span>
        ${isOwn ? `<button class="btn btn-ghost btn-sm"
          style="color:var(--danger);margin-left:auto;padding:2px 8px"
          onclick="handleDeleteComment(${c.id})">Delete</button>` : ''}
      </div>
      <div class="comment-text">${esc(c.content)}</div>
    </div>
  </div>`;
}

// ================================================================
// NAVBAR
// ================================================================
function renderNavbar() {
  const nav = document.getElementById('navbar');
  if (isLoggedIn()) {
    nav.innerHTML = `
    <span class="nav-logo" onclick="navigate('#/explore')">SocialApp</span>
    <div class="nav-search">
      <input id="nav-q" type="text" placeholder="Search posts, people…"
        onkeydown="if(event.key==='Enter')navigate('#/search?q='+encodeURIComponent(this.value))" />
    </div>
    <div class="nav-actions">
      <button class="btn btn-ghost nav-link" onclick="navigate('#/feed')">Feed</button>
      <button class="btn btn-ghost nav-link" onclick="navigate('#/explore')">Explore</button>
      <button class="btn btn-primary btn-sm" onclick="navigate('#/create')">+ Post</button>
      <button class="btn btn-ghost btn-sm"
        onclick="navigate('#/profile/${state.user.id}')">@${esc(state.user.username)}</button>
      <button class="btn btn-ghost btn-sm" onclick="handleLogout()">Logout</button>
    </div>`;
  } else {
    nav.innerHTML = `
    <span class="nav-logo" onclick="navigate('#/explore')">SocialApp</span>
    <div class="nav-search">
      <input id="nav-q" type="text" placeholder="Search posts, people…"
        onkeydown="if(event.key==='Enter')navigate('#/search?q='+encodeURIComponent(this.value))" />
    </div>
    <div class="nav-actions">
      <button class="btn btn-ghost nav-link" onclick="navigate('#/explore')">Explore</button>
      <button class="btn btn-outline btn-sm" onclick="navigate('#/login')">Login</button>
      <button class="btn btn-primary btn-sm" onclick="navigate('#/register')">Register</button>
    </div>`;
  }
}

// ================================================================
// SCREEN 1 — LOGIN
// ================================================================
function renderLogin() {
  document.getElementById('app').innerHTML = `
  <div class="container">
    <div class="form-card">
      <div class="form-title">Welcome back 👋</div>
      <div class="form-subtitle">Log in to your account</div>
      <div id="login-alert"></div>
      <div class="form-group">
        <label class="form-label">Username</label>
        <input class="form-control" id="l-user" type="text" placeholder="your_username"
          onkeydown="if(event.key==='Enter')handleLogin()" />
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input class="form-control" id="l-pass" type="password" placeholder="••••••••"
          onkeydown="if(event.key==='Enter')handleLogin()" />
      </div>
      <button class="btn btn-primary btn-full" id="login-btn" onclick="handleLogin()">Login</button>
      <p style="text-align:center;margin-top:18px;font-size:0.875rem;color:var(--muted)">
        No account? <a href="#/register">Register here</a>
      </p>
    </div>
  </div>`;
  document.getElementById('l-user').focus();
}

async function handleLogin() {
  const username = document.getElementById('l-user').value.trim();
  const password = document.getElementById('l-pass').value;
  if (!username || !password) { showAlert('login-alert', 'Please fill in both fields'); return; }

  setLoading('login-btn', true, 'Login');
  try {
    const data = await api.auth.login(username, password);
    const user = await api.users.me();
    setAuth(data.access_token, user);
    navigate('#/feed');
  } catch (err) {
    showAlert('login-alert', err.message);
    setLoading('login-btn', false, 'Login');
  }
}

// ================================================================
// SCREEN 2 — REGISTER
// ================================================================
function renderRegister() {
  document.getElementById('app').innerHTML = `
  <div class="container">
    <div class="form-card">
      <div class="form-title">Create account</div>
      <div class="form-subtitle">Join the community</div>
      <div id="reg-alert"></div>
      <div class="form-group">
        <label class="form-label">Username</label>
        <input class="form-control" id="r-user" type="text" placeholder="choose_a_username" />
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input class="form-control" id="r-email" type="email" placeholder="you@example.com" />
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input class="form-control" id="r-pass" type="password" placeholder="••••••••"
          onkeydown="if(event.key==='Enter')handleRegister()" />
      </div>
      <button class="btn btn-primary btn-full" id="reg-btn" onclick="handleRegister()">Create Account</button>
      <p style="text-align:center;margin-top:18px;font-size:0.875rem;color:var(--muted)">
        Already have an account? <a href="#/login">Login</a>
      </p>
    </div>
  </div>`;
  document.getElementById('r-user').focus();
}

async function handleRegister() {
  const username = document.getElementById('r-user').value.trim();
  const email    = document.getElementById('r-email').value.trim();
  const password = document.getElementById('r-pass').value;
  if (!username || !email || !password) { showAlert('reg-alert', 'Please fill in all fields'); return; }

  setLoading('reg-btn', true, 'Create Account');
  try {
    await api.auth.register({ username, email, password });
    const loginData = await api.auth.login(username, password);
    const user      = await api.users.me();
    setAuth(loginData.access_token, user);
    navigate('#/feed');
  } catch (err) {
    showAlert('reg-alert', err.message);
    setLoading('reg-btn', false, 'Create Account');
  }
}

function handleLogout() {
  clearAuth();
  renderNavbar();
  navigate('#/explore');
}

// ================================================================
// SCREEN 3 — EXPLORE
// ================================================================
let _exploreSkip = 0, _explorePosts = [];

async function renderExplore() {
  _exploreSkip = 0; _explorePosts = [];
  document.getElementById('app').innerHTML = `
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">Explore</h1>
    </div>
    <div id="explore-list" class="posts-list">
      <div class="loading">Loading posts…</div>
    </div>
    <div class="load-more" id="explore-more" style="display:none">
      <button class="btn btn-outline" onclick="loadMoreExplore()">Load more</button>
    </div>
  </div>`;
  await loadMoreExplore();
}

async function loadMoreExplore() {
  try {
    const posts = await api.posts.getAll(_exploreSkip, 10);
    _explorePosts = [..._explorePosts, ...posts];
    _exploreSkip += posts.length;
    const list = document.getElementById('explore-list');
    if (!list) return;
    if (_explorePosts.length === 0) {
      list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <div class="empty-title">No posts yet</div>
        <div class="empty-desc">Be the first to post something!</div>
        ${isLoggedIn() ? `<button class="btn btn-primary" onclick="navigate('#/create')">Create Post</button>` : ''}
      </div>`;
    } else {
      list.innerHTML = _explorePosts.map(p => postCard(p)).join('');
    }
    const moreBtn = document.getElementById('explore-more');
    if (moreBtn) moreBtn.style.display = posts.length === 10 ? 'block' : 'none';
  } catch (err) {
    const list = document.getElementById('explore-list');
    if (list) list.innerHTML = `<div class="alert alert-error">${esc(err.message)}</div>`;
  }
}

// ================================================================
// SCREEN 4 — FEED
// ================================================================
let _feedSkip = 0, _feedPosts = [];

async function renderFeed() {
  _feedSkip = 0; _feedPosts = [];
  document.getElementById('app').innerHTML = `
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">Your Feed</h1>
    </div>
    <div id="feed-list" class="posts-list">
      <div class="loading">Loading your feed…</div>
    </div>
    <div class="load-more" id="feed-more" style="display:none">
      <button class="btn btn-outline" onclick="loadMoreFeed()">Load more</button>
    </div>
  </div>`;
  await loadMoreFeed();
}

async function loadMoreFeed() {
  try {
    const posts = await api.feed.get(_feedSkip, 10);
    _feedPosts = [..._feedPosts, ...posts];
    _feedSkip += posts.length;
    const list = document.getElementById('feed-list');
    if (!list) return;
    if (_feedPosts.length === 0) {
      list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🤝</div>
        <div class="empty-title">Your feed is empty</div>
        <div class="empty-desc">Follow people to see their posts here.</div>
        <button class="btn btn-primary" onclick="navigate('#/explore')">Explore Posts</button>
      </div>`;
    } else {
      list.innerHTML = _feedPosts.map(p => postCard(p)).join('');
    }
    const moreBtn = document.getElementById('feed-more');
    if (moreBtn) moreBtn.style.display = posts.length === 10 ? 'block' : 'none';
  } catch (err) {
    const list = document.getElementById('feed-list');
    if (list) list.innerHTML = `<div class="alert alert-error">${esc(err.message)}</div>`;
  }
}

// ================================================================
// SCREEN 5 — CREATE POST
// ================================================================
function renderCreate() {
  document.getElementById('app').innerHTML = `
  <div class="container">
    <div class="form-card" style="max-width:600px">
      <div class="form-title">Create Post</div>
      <div id="create-alert"></div>
      <div class="form-group">
        <label class="form-label">Title</label>
        <input class="form-control" id="c-title" type="text" placeholder="Post title…" />
      </div>
      <div class="form-group">
        <label class="form-label">Content</label>
        <textarea class="form-control" id="c-body" rows="7" placeholder="What's on your mind?"></textarea>
      </div>
      <div style="display:flex;gap:12px">
        <button class="btn btn-primary" id="create-btn" onclick="handleCreate()">Publish</button>
        <button class="btn btn-ghost" onclick="history.back()">Cancel</button>
      </div>
    </div>
  </div>`;
  document.getElementById('c-title').focus();
}

async function handleCreate() {
  const title   = document.getElementById('c-title').value.trim();
  const content = document.getElementById('c-body').value.trim();
  if (!title || !content) { showAlert('create-alert', 'Title and content are required'); return; }

  setLoading('create-btn', true, 'Publish');
  try {
    const post = await api.posts.create({ title, content });
    navigate(`#/post/${post.id}`);
  } catch (err) {
    showAlert('create-alert', err.message);
    setLoading('create-btn', false, 'Publish');
  }
}

// ================================================================
// SCREEN 6 — POST DETAIL
// ================================================================
async function renderPostDetail(id) {
  if (!id) { navigate('#/explore'); return; }
  document.getElementById('app').innerHTML =
    `<div class="container"><div class="loading">Loading post…</div></div>`;

  try {
    const [post, comments] = await Promise.all([
      api.posts.get(id),
      api.comments.getByPost(id),
    ]);

    const isLiked = state.likedPosts.has(post.id);
    const isOwn   = state.user && state.user.id === post.user_id;

    document.getElementById('app').innerHTML = `
    <div class="container">
      <div class="card" style="padding:28px 32px;margin-bottom:20px">
        ${isOwn ? `
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-bottom:18px">
          <button class="btn btn-outline btn-sm"
            onclick="renderEditPost(${post.id})">Edit</button>
          <button class="btn btn-danger btn-sm"
            onclick="handleDeletePost(${post.id})">Delete</button>
        </div>` : ''}

        <div class="post-detail-title">${esc(post.title)}</div>

        <div class="post-meta" style="margin-bottom:20px">
          <span>by
            <a href="#/profile/${post.user_id}">User #${post.user_id}</a>
          </span>
          <span>${timeAgo(post.created_at)}</span>
        </div>

        <div class="post-detail-body">${esc(post.content)}</div>

        <div style="display:flex;align-items:center;gap:14px">
          <button class="like-btn ${isLiked ? 'liked' : ''}"
            id="like-btn" onclick="handleLike(${post.id})">
            ❤️ <span id="like-count">${post.like_count}</span>
          </button>
          <span style="font-size:0.875rem;color:var(--muted)">
            💬 ${comments.length} comment${comments.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div class="card" style="padding:24px 28px">
        <div class="section-title">Comments</div>
        <div id="comments-list">
          ${comments.length === 0
            ? `<div class="empty-state" style="padding:20px 0">
                 <div class="empty-desc">No comments yet — be the first!</div>
               </div>`
            : comments.map(c => commentItem(c)).join('')}
        </div>

        ${isLoggedIn() ? `
        <div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border)">
          <div id="comment-alert"></div>
          <textarea class="form-control" id="comment-input" rows="3"
            placeholder="Write a comment…"></textarea>
          <button class="btn btn-primary" id="comment-btn"
            style="margin-top:10px" onclick="handleComment(${post.id})">Post Comment</button>
        </div>` : `
        <div style="text-align:center;padding-top:20px;border-top:1px solid var(--border);
                    font-size:0.875rem;color:var(--muted)">
          <a href="#/login">Log in</a> to leave a comment
        </div>`}
      </div>
    </div>`;

  } catch (err) {
    document.getElementById('app').innerHTML =
      `<div class="container"><div class="alert alert-error">${esc(err.message)}</div></div>`;
  }
}

async function handleLike(postId) {
  if (!isLoggedIn()) { navigate('#/login'); return; }
  const btn      = document.getElementById('like-btn');
  const countEl  = document.getElementById('like-count');
  const isLiked  = state.likedPosts.has(postId);
  try {
    if (isLiked) {
      await api.likes.unlike(postId);
      state.likedPosts.delete(postId);
      btn.classList.remove('liked');
      countEl.textContent = Math.max(0, parseInt(countEl.textContent) - 1);
    } else {
      await api.likes.like(postId);
      state.likedPosts.add(postId);
      btn.classList.add('liked');
      countEl.textContent = parseInt(countEl.textContent) + 1;
    }
  } catch (_) {}   // ignore — already liked/unliked
}

async function handleComment(postId) {
  const input   = document.getElementById('comment-input');
  const content = input.value.trim();
  if (!content) { showAlert('comment-alert', 'Comment cannot be empty'); return; }

  setLoading('comment-btn', true, 'Post Comment');
  try {
    const c    = await api.comments.create(content, postId);
    const list = document.getElementById('comments-list');
    const empty = list.querySelector('.empty-state');
    if (empty) empty.remove();
    list.insertAdjacentHTML('beforeend', commentItem(c));
    input.value = '';
  } catch (err) {
    showAlert('comment-alert', err.message);
  }
  setLoading('comment-btn', false, 'Post Comment');
}

async function handleDeleteComment(id) {
  if (!confirm('Delete this comment?')) return;
  try {
    await api.comments.delete(id);
    const el = document.getElementById(`comment-${id}`);
    if (el) el.remove();
  } catch (err) { alert(err.message); }
}

async function handleDeletePost(postId) {
  if (!confirm('Delete this post? This cannot be undone.')) return;
  try {
    await api.posts.delete(postId);
    navigate('#/explore');
  } catch (err) { alert(err.message); }
}

async function renderEditPost(postId) {
  let post;
  try { post = await api.posts.get(postId); }
  catch (err) { alert(err.message); return; }

  document.getElementById('app').innerHTML = `
  <div class="container">
    <div class="form-card" style="max-width:600px">
      <div class="form-title">Edit Post</div>
      <div id="edit-alert"></div>
      <div class="form-group">
        <label class="form-label">Title</label>
        <input class="form-control" id="e-title" type="text" value="${esc(post.title)}" />
      </div>
      <div class="form-group">
        <label class="form-label">Content</label>
        <textarea class="form-control" id="e-body" rows="7">${esc(post.content)}</textarea>
      </div>
      <div style="display:flex;gap:12px">
        <button class="btn btn-primary" id="edit-btn"
          onclick="handleEditPost(${postId})">Save Changes</button>
        <button class="btn btn-ghost"
          onclick="navigate('#/post/${postId}')">Cancel</button>
      </div>
    </div>
  </div>`;
}

async function handleEditPost(postId) {
  const title   = document.getElementById('e-title').value.trim();
  const content = document.getElementById('e-body').value.trim();
  if (!title || !content) { showAlert('edit-alert', 'Title and content are required'); return; }

  setLoading('edit-btn', true, 'Save Changes');
  try {
    await api.posts.update(postId, { title, content });
    navigate(`#/post/${postId}`);
  } catch (err) {
    showAlert('edit-alert', err.message);
    setLoading('edit-btn', false, 'Save Changes');
  }
}

// ================================================================
// SCREEN 7 — USER PROFILE
// ================================================================
async function renderProfile(id) {
  if (!id) { navigate('#/explore'); return; }
  document.getElementById('app').innerHTML =
    `<div class="container"><div class="loading">Loading profile…</div></div>`;

  try {
    const [user, posts] = await Promise.all([
      api.users.getUser(id),
      api.users.getUserPosts(id),
    ]);
    const isOwn = state.user && state.user.id === parseInt(id);

    document.getElementById('app').innerHTML = `
    <div class="container">
      <div class="profile-header">
        ${avatarHtml(user, 'lg')}
        <div class="profile-info">
          <div class="profile-name">@${esc(user.username)}</div>
          <div class="profile-bio">${esc(user.bio || 'No bio yet.')}</div>
          <div class="profile-stats">
            <span><span class="stat-num">${user.follower_count}</span>
                  <span class="stat-label"> followers</span></span>
            <span><span class="stat-num">${user.following_count}</span>
                  <span class="stat-label"> following</span></span>
            <span><span class="stat-num">${posts.length}</span>
                  <span class="stat-label"> posts</span></span>
          </div>
        </div>
        <div>
          ${isOwn
            ? `<button class="btn btn-outline btn-sm"
                 onclick="navigate('#/settings')">Edit Profile</button>`
            : isLoggedIn()
              ? `<button class="btn btn-outline btn-sm" id="follow-btn"
                   onclick="handleFollowById(${id})">Follow</button>`
              : ''}
        </div>
      </div>

      <div class="page-header">
        <h2 class="page-title" style="font-size:1.1rem">Posts</h2>
      </div>
      <div class="posts-list">
        ${posts.length === 0
          ? `<div class="empty-state">
               <div class="empty-desc">No posts yet.</div>
             </div>`
          : posts.map(p => postCard(p, user.username)).join('')}
      </div>
    </div>`;

  } catch (err) {
    document.getElementById('app').innerHTML =
      `<div class="container"><div class="alert alert-error">${esc(err.message)}</div></div>`;
  }
}

async function handleFollowById(userId) {
  if (!isLoggedIn()) { navigate('#/login'); return; }
  const btn = document.getElementById('follow-btn');
  try {
    if (btn && btn.textContent.trim() === 'Unfollow') {
      await api.users.unfollow(userId);
      if (btn) btn.textContent = 'Follow';
    } else {
      await api.users.follow(userId);
      if (btn) btn.textContent = 'Unfollow';
    }
  } catch (err) { alert(err.message); }
}

// ================================================================
// SCREEN 8 — SETTINGS (Edit Profile + Delete Account)
// ================================================================
async function renderSettings() {
  document.getElementById('app').innerHTML =
    `<div class="container"><div class="loading">Loading settings…</div></div>`;

  let user;
  try {
    user = await api.users.me();
    localStorage.setItem('user', JSON.stringify(user));
    state.user = user;
  } catch (err) {
    document.getElementById('app').innerHTML =
      `<div class="container"><div class="alert alert-error">${esc(err.message)}</div></div>`;
    return;
  }

  document.getElementById('app').innerHTML = `
  <div class="container">
    <div class="form-card" style="max-width:540px">
      <div class="form-title">Edit Profile</div>
      <div id="settings-alert"></div>

      <div class="form-group">
        <label class="form-label">Username</label>
        <input class="form-control" id="s-user" type="text" value="${esc(user.username)}" />
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input class="form-control" id="s-email" type="email" value="${esc(user.email)}" />
      </div>
      <div class="form-group">
        <label class="form-label">Bio</label>
        <textarea class="form-control" id="s-bio" rows="3"
          placeholder="Tell people about yourself…">${esc(user.bio || '')}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Avatar URL</label>
        <input class="form-control" id="s-avatar" type="url"
          placeholder="https://example.com/photo.jpg"
          value="${esc(user.avatar_url || '')}" />
      </div>
      <button class="btn btn-primary" id="save-btn"
        onclick="handleUpdateProfile()">Save Changes</button>

      <div class="danger-zone">
        <div class="danger-zone-title"> Danger Zone</div>
        <div class="danger-zone-desc">
          Permanently deletes your account, all your posts, and all your comments.
          This cannot be undone.
        </div>
        <button class="btn btn-danger btn-sm"
          onclick="handleDeleteAccount()">Delete My Account</button>
      </div>
    </div>
  </div>`;
}

async function handleUpdateProfile() {
  const username   = document.getElementById('s-user').value.trim();
  const email      = document.getElementById('s-email').value.trim();
  const bio        = document.getElementById('s-bio').value.trim();
  const avatar_url = document.getElementById('s-avatar').value.trim();

  setLoading('save-btn', true, 'Save Changes');
  try {
    const updated = await api.users.updateMe({ username, email, bio, avatar_url });
    setAuth(getToken(), updated);
    renderNavbar();
    showAlert('settings-alert', 'Profile updated!', 'success');
  } catch (err) {
    showAlert('settings-alert', err.message);
  }
  setLoading('save-btn', false, 'Save Changes');
}

async function handleDeleteAccount() {
  if (!confirm(
    'Are you absolutely sure? This will permanently delete your account, all your posts, ' +
    'and all your comments. This action cannot be undone.'
  )) return;
  if (!confirm('Final confirmation — delete your account forever?')) return;

  try {
    await api.users.deleteMe();
    clearAuth();
    renderNavbar();
    navigate('#/explore');
    alert('Your account has been deleted.');
  } catch (err) {
    alert(err.message);
  }
}

// ================================================================
// SCREEN 9 — SEARCH
// ================================================================
let _searchTab = 'posts';

async function renderSearch() {
  const raw = window.location.hash.split('?q=')[1] || '';
  const q   = decodeURIComponent(raw);

  document.getElementById('app').innerHTML = `
  <div class="container-wide">
    <div class="page-header" style="margin-bottom:16px">
      <h1 class="page-title">Search</h1>
    </div>
    <div class="card" style="padding:16px 20px;margin-bottom:20px">
      <div style="display:flex;gap:10px">
        <input class="form-control" id="search-q" type="text"
          placeholder="Search posts or people…" value="${esc(q)}"
          onkeydown="if(event.key==='Enter')runSearch()" />
        <button class="btn btn-primary" onclick="runSearch()">Search</button>
      </div>
    </div>
    <div class="tab-bar">
      <div class="tab active" id="tab-posts" onclick="switchTab('posts')">Posts</div>
      <div class="tab"        id="tab-users" onclick="switchTab('users')">People</div>
    </div>
    <div id="search-results">
      ${q ? '<div class="loading">Searching…</div>' : `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-desc">Type something and press Enter or click Search</div>
      </div>`}
    </div>
  </div>`;

  _searchTab = 'posts';
  const navQ = document.getElementById('nav-q');
  if (navQ) navQ.value = q;

  if (q) await runSearch(q);
}

function switchTab(tab) {
  _searchTab = tab;
  document.getElementById('tab-posts').classList.toggle('active', tab === 'posts');
  document.getElementById('tab-users').classList.toggle('active', tab === 'users');
  runSearch();
}

async function runSearch(initialQ) {
  const input = document.getElementById('search-q');
  const q     = initialQ || (input ? input.value.trim() : '');
  if (!q) return;

  window.location.hash = `#/search?q=${encodeURIComponent(q)}`;
  const resultsEl = document.getElementById('search-results');
  if (resultsEl) resultsEl.innerHTML = '<div class="loading">Searching…</div>';

  try {
    if (_searchTab === 'posts') {
      const posts = await api.search.posts(q);
      if (!resultsEl) return;
      resultsEl.innerHTML = posts.length === 0
        ? `<div class="empty-state"><div class="empty-desc">No posts found for "${esc(q)}"</div></div>`
        : `<div class="posts-list">${posts.map(p => postCard(p)).join('')}</div>`;
    } else {
      const users = await api.search.users(q);
      if (!resultsEl) return;
      resultsEl.innerHTML = users.length === 0
        ? `<div class="empty-state"><div class="empty-desc">No people found for "${esc(q)}"</div></div>`
        : `<div class="posts-list">${users.map(u => userCard(u)).join('')}</div>`;
    }
  } catch (err) {
    if (resultsEl) resultsEl.innerHTML =
      `<div class="alert alert-error">${esc(err.message)}</div>`;
  }
}

// ================================================================
// ROUTER
// ================================================================
async function router() {
  const hash   = window.location.hash.slice(1) || '/explore';
  const path   = hash.split('?')[0];
  const parts  = path.split('/').filter(Boolean);
  const screen = parts[0] || 'explore';
  const param  = parts[1];

  renderNavbar();

  switch (screen) {
    case 'login':    return renderLogin();
    case 'register': return renderRegister();
    case 'explore':  return renderExplore();
    case 'feed':     return isLoggedIn() ? renderFeed()   : renderExplore();
    case 'create':   return isLoggedIn() ? renderCreate() : navigate('#/login');
    case 'post':     return renderPostDetail(param);
    case 'profile':  return renderProfile(param);
    case 'settings': return isLoggedIn() ? renderSettings() : navigate('#/login');
    case 'search':   return renderSearch();
    default:         return renderExplore();
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
```

---

## 6. How to Open the Frontend

The frontend is plain HTML/JS — no build step is required.
Open `frontend/index.html` directly in a browser:

```bash
open frontend/index.html
# or on Linux:
xdg-open frontend/index.html
```

The API server must be running on `http://localhost:8002` for the frontend to work.

---

## 7. Screen Summary

| Screen | Key API calls | Notes |
|--------|--------------|-------|
| Login | `POST /auth/login`, `GET /users/me` | Auto-logs in after register |
| Register | `POST /auth/register`, login | Logs in immediately after registering |
| Explore | `GET /posts/?skip&limit` | Paginated, public, newest first |
| Feed | `GET /feed/?skip&limit` | Auth required, shows followed users' posts |
| Post Detail | `GET /posts/:id`, `GET /comments/post/:id` | Like toggles, comment form if logged in, edit/delete if own post |
| Create Post | `POST /posts/` | Auth required |
| User Profile | `GET /users/:id`, `GET /users/:id/posts` | Follow/unfollow button for other users, Edit Profile for own |
| Settings | `GET /users/me`, `PUT /users/me`, `DELETE /users/me` | Delete Account has double confirmation |
| Search | `GET /search/posts?q=`, `GET /search/users?q=` | Tab-based, hash preserves query |
