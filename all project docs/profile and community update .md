# UniHub — Agent Prompt: Central, Communities & Image Uploads

You are rebuilding and extending the UniHub frontend and backend together.
Read every instruction below fully before writing a single line of code.
Use your own judgment on anything not explicitly specified — improvise like
a senior full-stack engineer who has shipped production software before,
not like someone waiting to be told every pixel. When in doubt, ask yourself
"what would GitHub do?" and do that.

---

## 0. Guiding Aesthetic Reference

> GitHub. Not the logo, not the green contribution graph — the *feeling*:
> a calm, structured workspace where information is dense but never cluttered,
> every section has a clear purpose, actions are obvious, and the whole thing
> feels built for people who take their work seriously.

Keep the existing design tokens (colors, spacing, radius, shadows) from
`UNIHUB_FRONTEND_REDESIGN_BRIEF.md`. Treat GitHub as the interaction and
layout reference, not a pixel-for-pixel clone.

---

## 1. Rename Dashboard → "Central"

### What changes
- Every instance of the word "Dashboard" in the UI, sidebar nav, page titles,
  and document `<title>` tags becomes **"Central"**.
- The route stays the same or becomes `/central` — your call, be consistent.
- The sidebar nav item icon for this section should feel like a "home base" —
  a home icon or a hub/grid icon works. Pick whichever reads as "mission
  control" rather than "generic dashboard".

### What Central *is*

Central is not just a summary widget page. It is the **home feed** — the
first thing a logged-in user sees and the place they return to throughout
the day. Model it after GitHub's home feed (https://github.com) in terms
of layout intent, not visual copy:

**Left column (main feed area):**
- Greeting banner (time-of-day greeting + dynamic subtitle — already
  implemented, keep it, just rename the page around it).
- **Activity feed** — a chronological list of recent events across all
  communities the user has joined. Each feed item is compact: an icon
  representing the event type (new discussion, new resource uploaded, new
  assignment posted, new announcement), the actor's avatar, a one-line
  description, the community name as a clickable chip, and a relative
  timestamp. Pull this from `GET /dashboard/` (`recent_discussions`,
  `recent_resources`, `announcements`) and display them interleaved in
  a single time-ordered list. This replaces the separate "My Communities"
  and "Recent Discussions" sections that currently sit on the dashboard.
- Below the activity feed: a "Browse Communities" call-to-action card for
  users who haven't joined anything yet (same empty state pattern as before).

**Right rail:**
- **Upcoming Assignments** — compact list, due-date badge, community pill.
  Already exists, keep and polish.
- **My Communities** — small list (max 5) of the user's joined communities
  with icon + name + a small "N new" activity dot if there are unseen posts.
  "View all →" link at the bottom.
- **Quick Actions** — a small card with 3 buttons: "Start a Discussion",
  "Upload a Resource", "Create a Project Group". Each opens the relevant
  modal.
- **Announcements** — pinned/recent announcements. Already exists, polish.

**Stat bar** (the 4 icon + count cards above the feed): keep them, but make
the numbers clickable — clicking "Communities (6)" navigates to
`/communities`, "Assignments Due (3)" navigates to `/assignments?upcoming=true`,
etc.

---

## 2. Communities — GitHub Organization Style Redesign

The current Communities pages are functional but feel generic. Redesign them
to feel like GitHub organizations/repositories — structured, informative, and
encouraging participation at a glance.

### 2a. Communities List Page (`/communities`)

**Header row:** Page title "Communities" on the left. Two buttons on the
right: "Browse All" (active by default, calls `GET /communities/`) and
"My Communities" (calls `GET /communities/mine`). These are toggle buttons,
not separate nav links. Add a search input that calls
`GET /search/communities?q=` as the user types (debounced, 300ms).

**Community cards — upgrade them significantly:**

Each card should feel like a GitHub repository card. It must show:
- Community icon/emoji (large, ~48px, in a rounded square) — left-anchored.
- Community name (`--text-lg`, semibold) as a clickable link.
- Description (2-line clamp, `--text-sm`, muted).
- A row of metadata chips below the description: member count (people icon),
  post count if available (chat icon), "Public" label.
- A join/joined button (right-aligned, `outline` if joined with a checkmark,
  `primary` if not).
- If the user is the creator/admin of this community, show a small "Admin"
  badge in amber.
- Hover state: `--shadow-md` + subtle border highlight. The whole card is
  not a click target — only the community name is a link — to avoid
  accidental navigation when clicking Join.

**Layout:** Vertical list (not a grid) for the browse/search state, because
list layout at this density reads better for scanning, same as GitHub
repository lists. Switch to a 2-column grid for "My Communities" only.

**Create Community modal:** already exists — make sure it includes an emoji
picker (a simple popover with 20-30 preset academic-relevant emoji) for the
icon field. Do not use a text input for this; use the picker.

### 2b. Community Detail Page (`/communities/{id}`)

This is the most important redesign. Model it after a GitHub organization
page. Here is the exact layout:

**Community header (full-width banner area):**
- Background: `--color-surface-2`, left-bordered with a 4px accent bar in
  `--color-primary-500`.
- Community icon (64px), community name (`--text-2xl` bold), description.
- Stats row: "N Members · N Discussions · N Resources".
- Action button (right): "Join" (primary) / "Joined ✓" with a dropdown
  chevron that reveals "Leave Community" in danger color.
- If current user is admin: an "Manage" button (gear icon, outline) that opens
  a community settings drawer (edit name/description/icon).

**Tab navigation (GitHub-style underline tabs):**
- **Overview** (default) — see below.
- **Discussions** — full list of posts in this community.
- **Resources** — files library.
- **Assignments** — assignments list with due-date sorting.
- **Members** — member grid.

**Overview tab** (the GitHub org "home" equivalent):

Split into two columns (70/30):

*Left column (main):*
- **Pinned / Recent Discussions** — the top 3 most recent posts
  (`GET /posts/?community_id={id}&limit=3`), shown as compact discussion
  cards. Each card: author avatar (24px) + name, post title (clickable),
  2-line content preview, like count + comment count, relative timestamp.
  A "View all discussions →" link at the bottom.
- **Recent Resources** — the 3 most recently uploaded files
  (`GET /resources/?community_id={id}&limit=3`), shown as compact resource
  rows (file-type icon, title, uploader, size, Download link). "View all
  resources →" link.
- **Upcoming Assignments** — next 3 assignments
  (`GET /assignments/?community_id={id}&upcoming=true&limit=3`), compact
  with due-date badges. "View all assignments →" link.

*Right column (sidebar):*
- **About** card: description (full text, not truncated), created date,
  creator username.
- **Members** card: avatar stack (show up to 8 avatars overlapping like
  GitHub's contributor avatars), member count, "View all members" link.
- **Announcements** card: most recent 2 announcements. If admin, show
  "Post Announcement +" button here.

**Discussions tab:**
- Toolbar: "New Discussion" button (members only, opens the Create Post modal
  pre-scoped to this community) on the right. A sort selector on the left:
  "Newest" / "Most Liked" / "Most Commented" (client-side sort on the
  already-fetched data, or add `?order_by=` if backend supports it).
- Discussion list: full `DiscussionCard` components, same design as the rest
  of the app, but with `community_id` badge omitted (we're already in the
  community context).
- Posts in this community now support images — if `image_url` is set on a
  post, show a thumbnail (80px × 80px, `object-fit: cover`, rounded) on the
  right side of the card. Clicking it opens the image full-screen or
  navigates to the post detail.

**Resources tab:**
- Toolbar: "Upload Resource" button (members only). File type filter chips:
  All / PDF / Docs / Slides / Images.
- Resource list: same `ResourceCard` design, filter applied client-side.
- Upload modal: drag-and-drop zone, shows filename + size preview once
  selected. Community is pre-filled and locked (not a selector in this context).

**Assignments tab:**
- Toolbar: "New Assignment" button (members only). Toggle: "Upcoming only" /
  "All".
- Assignment cards with escalating urgency colors.

**Members tab:**
- A responsive grid of `UserCard` components (avatar, name, @username,
  department, role pill). Admins appear first.

---

## 3. Image Uploads — Posts and Profile Pictures

This section requires both backend and frontend changes. Implement them both.

### 3a. Backend: Avatar Upload Endpoint

Add `POST /uploads/avatar` to the backend. This is a separate, simpler
endpoint from `/resources/` because it only handles image files and
automatically updates the requesting user's `avatar_url`.

Create `app/routers/uploads.py`:

```python
import os, uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.auth import get_current_user

router = APIRouter(prefix="/uploads", tags=["Uploads"])

AVATAR_DIR = "uploads/avatars"
os.makedirs(AVATAR_DIR, exist_ok=True)

ALLOWED_IMAGE_TYPES = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_AVATAR_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only image files are allowed (jpg, png, gif, webp)")

    contents = await file.read()
    if len(contents) > MAX_AVATAR_SIZE:
        raise HTTPException(status_code=400, detail="Image too large (max 5MB)")

    stored_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(AVATAR_DIR, stored_name)
    with open(file_path, "wb") as f:
        f.write(contents)

    # Delete old avatar file from disk if it was a local upload
    if current_user.avatar_url and current_user.avatar_url.startswith("/uploads/avatars/"):
        old_path = current_user.avatar_url.lstrip("/")
        if os.path.exists(old_path):
            os.remove(old_path)

    current_user.avatar_url = f"/uploads/avatars/{stored_name}"
    db.commit()
    db.refresh(current_user)

    return {"avatar_url": current_user.avatar_url}
```

Register this router in `app/main.py` and ensure `uploads/avatars` is
covered by the existing `StaticFiles` mount (if the mount is at `/uploads`
and the directory is `uploads/`, it already covers subdirectories — confirm
and fix if not).

### 3b. Backend: Post Image Support

Add an optional `image_url` column to the `Post` model and `PostCreate` /
`PostResponse` schemas.

In `app/models/post.py`, add:
```python
image_url = Column(String, nullable=True)
```

In `app/schemas/post.py`, add `image_url: Optional[str] = None` to both
`PostCreate` and `PostResponse`.

Add `POST /uploads/post-image` to `app/routers/uploads.py`:

```python
POST_IMAGE_DIR = "uploads/post-images"
os.makedirs(POST_IMAGE_DIR, exist_ok=True)

@router.post("/post-image")
async def upload_post_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large (max 10MB)")

    stored_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(POST_IMAGE_DIR, stored_name)
    with open(file_path, "wb") as f:
        f.write(contents)

    return {"image_url": f"/uploads/post-images/{stored_name}"}
```

The flow for a post with an image is:
1. User selects an image in the Create Post modal.
2. Frontend immediately calls `POST /uploads/post-image` and gets back
   `image_url`.
3. The returned `image_url` is stored in a variable.
4. When the user submits the post, `POST /posts/` is called with the
   `image_url` field included in the body.

This two-step flow (upload image first, then create post referencing the
URL) avoids multipart complexity on the posts endpoint itself.

### 3c. Frontend: Profile Picture Upload (Settings Screen)

Replace the current "Avatar URL" text input in the Settings screen with
a proper avatar upload widget:

- Show a circular avatar preview (96px) of the current avatar.
- Below it: a "Change Photo" button (outline, small).
- Clicking opens a native file picker (`<input type="file" accept="image/*">`).
- On file selection: show an inline preview of the chosen image (using
  `URL.createObjectURL()`), show file name and size, and a "Upload" button.
- Clicking "Upload" calls `POST /uploads/avatar` with the file as
  `multipart/form-data`.
- On success: update the avatar preview and update the in-memory user state
  so the navbar avatar reflects the change immediately — no page reload.
- Show a success toast "Profile picture updated".
- Keep the "Avatar URL" text input as a secondary option below (collapsed
  under a "Or use a URL instead" disclosure link) for users who want to
  paste an external image URL directly into `PUT /users/me`.

### 3d. Frontend: Post Image Upload (Create Post Modal)

In the Create Post modal, add an optional image attachment:

- Below the content textarea: a dashed upload zone with the text
  "Attach an image (optional)" and a small image icon.
- The zone accepts click (opens file picker) or drag-and-drop.
- Accepted types: JPG, PNG, GIF, WebP. Max 10MB.
- Once a file is selected: replace the zone with a preview of the image
  (full-width, max 200px tall, `object-fit: cover`, rounded corners),
  and a small "Remove" (×) button in the top-right of the preview.
- Upload the image immediately on selection (`POST /uploads/post-image`),
  show a loading indicator inside the preview area while uploading.
- On success: store the `image_url` silently. On form submit, include it.
- If the user removes the image preview, forget the `image_url`.

In Post Detail and Discussion card views: if `image_url` is set, display
the image below the content text (full-width in Post Detail, thumbnail on
the right in cards as described in Section 2b).

---

## 4. Additional API Calls to Add to `api.js`

```javascript
// Uploads
uploads: {
  avatar    : (file)  => uploadFile('/uploads/avatar', file),
  postImage : (file)  => uploadFile('/uploads/post-image', file),
},
```

Add a generic `uploadFile` helper:
```javascript
async function uploadFile(path, file) {
  const token = getToken();
  const form  = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE_URL}${path}`, {
    method : 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body   : form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Upload failed');
  return data;
}
```

---

## 5. Polish Checklist (apply to every screen touched in this pass)

- [ ] "Dashboard" renamed to "Central" everywhere.
- [ ] Central has a proper activity feed, not just static widget cards.
- [ ] Stat bar numbers are clickable and navigate to the correct page.
- [ ] Community list cards feel like GitHub repository cards.
- [ ] Community detail has all 5 tabs, Overview tab has the 70/30 split.
- [ ] Members tab shows avatar stack in the right-rail Overview card.
- [ ] Create Discussion modal in community context has an image upload zone.
- [ ] Post cards show image thumbnails when `image_url` is present.
- [ ] Post detail page shows the full image below the content.
- [ ] Settings screen has the avatar upload widget (not a text input only).
- [ ] `POST /uploads/avatar` and `POST /uploads/post-image` work end-to-end.
- [ ] `Post` model, schemas, and create/response flows include `image_url`.
- [ ] `app/main.py` registers the new `uploads` router.
- [ ] `uploads/avatars/` and `uploads/post-images/` are served by the static mount.
- [ ] All new screens handle Loading / Empty / Error states correctly.
- [ ] No horizontal overflow anywhere. Layout is responsive per the brief's Section 9 breakpoints.