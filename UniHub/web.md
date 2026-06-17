# UniHub Frontend Redesign Brief

> **Audience:** Frontend developer/agent redesigning the UniHub client.
> **Backend:** Already built and stable — see `UNIHUB_README.md` and
> `BACKEND_PATCH_3.md` for the full API reference. This brief is about the
> **frontend only**: visual design, layout, components, and screen behavior.
> Every screen listed must map to a real endpoint already documented — do not
> design UI for data the API doesn't provide.

---

## 1. Project Context

UniHub is an academic collaboration platform for university and college
students. It replaces fragmented WhatsApp groups and scattered files with one
place for: course communities, lecture note sharing, assignment tracking,
project group collaboration, announcements, and academic discussion.

The current frontend is functional but visually unrefined — built quickly to
prove the backend works. This brief defines a **complete visual and
interaction redesign** to industry-standard quality: the kind of polish users
would expect from Notion, Linear, or a well-built SaaS dashboard — not a
student project.

---

## 2. Design Philosophy

| Do | Don't |
|---|---|
| Clean, calm, professional — "academic workspace" | Loud colors, gradients-for-the-sake-of-it, meme-y tone |
| Generous whitespace, clear hierarchy | Dense, cluttered dashboards |
| Subtle motion that communicates state | Decorative animation with no purpose |
| Consistent, predictable patterns across screens | One-off custom styling per page |
| Productivity and clarity first | Entertainment / infinite-scroll-bait patterns |

The product should feel like a tool people use to **get academic work done**,
with social features (likes, comments, follows) supporting that goal rather
than being the focus.

---

## 3. Brand Identity

- **Name:** UniHub
- **Tagline:** "Your Academic Hub, all in one place."
- **Logo:** Wordmark + simple mark (e.g. a rounded square monogram "U" or an
  abstract node/network glyph suggesting connection). Should work at 24px
  (navbar) and as a favicon.
- **Voice:** Direct, encouraging, never patronizing. Empty states and errors
  should sound like a helpful TA, not a corporate bot.

---

## 4. Design System

### 4.1 Color Palette

Use CSS custom properties. Support both light and dark mode from day one —
toggle stored in memory (no localStorage in artifacts, but a real deployed
frontend can use `localStorage` or `prefers-color-scheme`).

```css
:root {
  /* Brand */
  --color-primary-50:  #EEF2FF;
  --color-primary-100: #E0E7FF;
  --color-primary-300: #A5B4FC;
  --color-primary-500: #6366F1;
  --color-primary-600: #4F46E5;
  --color-primary-700: #4338CA;

  /* Accent (used sparingly: due-soon highlights, badges) */
  --color-accent-500: #F59E0B;   /* amber — deadlines */
  --color-accent-600: #D97706;

  /* Semantic */
  --color-success-500: #10B981;
  --color-success-100: #D1FAE5;
  --color-danger-500:  #EF4444;
  --color-danger-100:  #FEE2E2;
  --color-info-500:    #3B82F6;
  --color-info-100:    #DBEAFE;

  /* Neutrals — light mode */
  --color-bg:          #F8FAFC;
  --color-surface:     #FFFFFF;
  --color-surface-2:   #F1F5F9;
  --color-border:      #E2E8F0;
  --color-text:        #0F172A;
  --color-text-muted:  #64748B;
  --color-text-subtle: #94A3B8;

  /* Elevation */
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 2px 8px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-lg: 0 8px 24px rgba(15, 23, 42, 0.08);
  --shadow-focus: 0 0 0 3px rgba(99, 102, 241, 0.18);

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 999px;

  /* Spacing scale (4px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Layout */
  --topbar-height: 64px;
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 72px;
  --right-rail-width: 320px;
  --content-max-width: 1280px;
}

[data-theme="dark"] {
  --color-bg:          #0B1220;
  --color-surface:     #131B2E;
  --color-surface-2:   #1B253B;
  --color-border:      #283449;
  --color-text:        #F1F5F9;
  --color-text-muted:  #94A3B8;
  --color-text-subtle: #64748B;

  --color-primary-50:  #1E1B4B;
  --color-primary-100: #312E81;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
}
```

### 4.2 Typography

- **Font:** `Inter` (or system font fallback stack) for UI text. Optional
  serif (e.g. `Source Serif Pro`) only for long-form post/resource titles if a
  more "editorial" feel is wanted — otherwise Inter throughout.

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  --text-xs:   0.75rem;   /* 12px - timestamps, badges */
  --text-sm:   0.875rem;  /* 14px - body small, meta */
  --text-base: 1rem;      /* 16px - body */
  --text-lg:   1.125rem;  /* 18px - card titles */
  --text-xl:   1.375rem;  /* 22px - section headers */
  --text-2xl:  1.75rem;   /* 28px - page titles */
  --text-3xl:  2.25rem;   /* 36px - dashboard greeting */

  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

Heading scale usage:
- `--text-3xl` / `--font-bold` — dashboard greeting only
- `--text-2xl` / `--font-bold` — page titles ("Communities", "Resources")
- `--text-xl` / `--font-semibold` — section headers within a page
- `--text-lg` / `--font-semibold` — card titles, post titles
- `--text-base` — body copy
- `--text-sm` — secondary text, metadata, captions
- `--text-xs` — timestamps, badge labels

### 4.3 Iconography

Use a single consistent icon set — **Lucide** (open source, matches the
"clean SaaS" aesthetic, available as `lucide-react` or plain SVG sprites).
Icon sizes: 16px (inline with text), 20px (buttons/nav), 24px (empty states).
Never mix icon sets or use emoji as functional icons (emoji are fine as
**community icons** chosen by users, e.g. 💻 for Software Engineering — that's
content, not UI chrome).

### 4.4 Motion

- Transitions: `150ms ease` for hover/focus states, `200ms ease-out` for
  panel/modal open, `100ms ease-in` for close.
- Page transitions: simple fade/slide-up of content area (8px translate),
  never full-page flashes.
- Loading: skeleton screens (see 7.9), not spinners, for content areas.
  Spinners only for button-level actions (e.g. "Posting...").
- Respect `prefers-reduced-motion`: disable non-essential transitions.

---

## 5. App Shell & Navigation

### 5.1 Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ Top Navbar (fixed, height: var(--topbar-height))         │
├──────────────┬──────────────────────────┬────────────────┤
│              │                            │                │
│ Left Sidebar │   Main Content             │  Right Rail    │
│ (fixed,      │   (max-width: 1280px,      │  (contextual,  │
│  240px)      │    centered, scrollable)   │   320px,       │
│              │                            │   hidden <1280)│
│              │                            │                │
└──────────────┴──────────────────────────┴────────────────┘
```

- Left sidebar is **always visible** on desktop (≥1024px), collapsible to icon-only (72px) via a toggle.
- Right rail only appears on screens where it adds value (Dashboard, Discussion detail, Community detail) and is hidden below 1280px viewport width.
- On mobile (<768px), left sidebar becomes a slide-over drawer triggered by a hamburger icon in the top navbar; right rail content moves below the main content or is dropped.

### 5.2 Top Navbar

Left to right:
1. **Hamburger** (mobile only) — opens sidebar drawer
2. **Logo + wordmark** "UniHub" — links to Dashboard
3. **Global search bar** (center, max-width 480px) — placeholder "Search communities, posts, people..."
   - On focus, shows a dropdown with live results grouped by type (Communities / Discussions / People), each group max 3 results, with a "See all results for '...'" link to the full Search page
4. **Right cluster:**
   - Theme toggle (light/dark) — sun/moon icon
   - Notification bell with unread-count badge → opens dropdown panel (see 8.12)
   - User avatar → opens dropdown menu: "My Profile", "Settings", "Logout"

Navbar is `var(--color-surface)` with a 1px bottom border, `box-shadow: var(--shadow-sm)` on scroll only (sticky shadow appears after 4px scroll, not at rest).

### 5.3 Left Sidebar

Sections, in order:

1. **Primary nav** (icon + label):
   - Dashboard (home icon)
   - Communities (users/group icon)
   - Resources (folder icon)
   - Assignments (clipboard icon) — show a small badge with count of assignments due within 3 days
   - Project Groups (briefcase/layers icon)
   - Notifications (bell icon) — only shown here on mobile where the navbar bell is hidden; on desktop notifications live in the navbar dropdown only

2. **Divider**

3. **My Communities** (collapsible section, max 5 shown + "View all"):
   - Each item: community icon/emoji, name, small unread/activity dot if there's a new discussion since last visit

4. **Bottom-pinned:**
   - "My Profile" (user's avatar + name)
   - "Settings" (gear icon)
   - Collapse toggle (chevron, collapses sidebar to icon rail)

Active route gets: `background: var(--color-primary-50)`, `color: var(--color-primary-600)`, left border accent (3px, `var(--color-primary-600)`), `font-weight: var(--font-semibold)`.

### 5.4 Right Rail (contextual)

Not a fixed global element — each screen defines its own right rail content
(see screen specs). When empty for a screen, the main content area expands to
fill the space (no empty rail box shown).

---

## 6. Dynamic Greeting System

The dashboard greeting must reflect the actual local time of the viewer's
device, not the server.

```javascript
function getGreeting(name) {
  const hour = new Date().getHours();
  let timeOfDay;

  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning';
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon';
  } else if (hour >= 17 && hour < 22) {
    timeOfDay = 'evening';
  } else {
    timeOfDay = 'night';
  }

  const greetings = {
    morning:   `Good morning, ${name}`,
    afternoon: `Good afternoon, ${name}`,
    evening:   `Good evening, ${name}`,
    night:     `Working late, ${name}?`,
  };

  return greetings[timeOfDay];
}
```

- `name` = `full_name` if set on the user's profile, otherwise `username`.
- Recompute on page load only (no need for a live-updating clock).
- Pair with a one-line dynamic subtitle summarizing dashboard data, e.g.
  *"You have 2 assignments due this week and 3 new notifications."* — built
  from the `/dashboard/` response (`upcoming_assignments.length`,
  `unread_notifications`), not hardcoded.

---

## 7. Core Component Library

Every screen is built from this shared set. Build these first, in isolation,
before assembling screens.

### 7.1 Buttons

| Variant | Use | Style |
|---|---|---|
| `primary` | Main action per screen (Create Post, Join, Save) | `var(--color-primary-600)` bg, white text |
| `secondary` | Secondary actions | `var(--color-surface-2)` bg, `var(--color-text)` |
| `outline` | Tertiary / cancel | transparent bg, 1.5px border `var(--color-border)` |
| `ghost` | Icon-only or low-emphasis (nav items, "..." menus) | transparent, hover bg `var(--color-surface-2)` |
| `danger` | Destructive (Delete, Leave) | `var(--color-danger-500)` bg, white text |

Sizes: `sm` (32px height), `md` (40px height, default), `lg` (48px height —
primary CTAs on auth screens only). All buttons: `border-radius: var(--radius-md)`,
`font-weight: var(--font-medium)`, disabled state at 50% opacity +
`cursor: not-allowed`, loading state replaces label with a small spinner +
"Saving..." style text (button stays same width — set `min-width`).

### 7.2 Inputs & Forms

- Text inputs, textareas, selects: `var(--color-surface)` bg, 1.5px border
  `var(--color-border)`, `border-radius: var(--radius-md)`, padding
  `var(--space-3) var(--space-4)`. Focus: border → `var(--color-primary-500)`,
  `box-shadow: var(--shadow-focus)`.
- Labels: `var(--text-sm)`, `var(--font-medium)`, `var(--space-2)` below.
- Helper/error text below input: `var(--text-xs)`, `var(--color-text-muted)`
  normally, `var(--color-danger-500)` on error, with the input border also
  turning danger-colored on error.
- File upload input (Resources): drag-and-drop zone, dashed border, shows
  file icon + name + size once selected, with a remove (x) button.

### 7.3 Cards

Base card: `var(--color-surface)` bg, `var(--radius-lg)`, `var(--shadow-sm)`,
1px border `var(--color-border)`, padding `var(--space-5)`. On hover (if
clickable): `var(--shadow-md)` + `translateY(-2px)`, transition 150ms.

Specific card types:

- **DiscussionCard** (post): author avatar (32px) + name + community badge
  (pill, shows community name + icon if `community_id` set) + relative
  timestamp, title (`--text-lg` semibold), 2-3 line content preview, footer
  row with like button (heart icon + count, filled when `is_liked`), comment
  count (speech bubble icon), and — if the viewer owns the post — a "..."
  menu (Edit / Delete).
- **CommunityCard**: icon/emoji in a rounded square (48px), name, description
  (1 line truncated), member count, Join/Joined button (outline if joined,
  primary if not).
- **ResourceCard**: file-type icon (color-coded: PDF=red, DOCX=blue,
  PPT=orange, XLSX=green, image=purple), title, description, file size +
  uploader + relative time, Download button (icon-only ghost on the right).
- **AssignmentCard**: due-date badge (color escalates: neutral if >7 days,
  amber if ≤3 days, red if overdue or due today), title, community name,
  description preview.
- **ProjectGroupCard**: similar to CommunityCard but with a "Private" lock
  icon badge.
- **UserCard** (search results / member lists): avatar, name, `@username`,
  department · academic year as subtitle, Follow/Following button.

### 7.4 Avatars

- Circular, sizes: 24px (inline/comments), 32px (cards/lists), 40px (navbar),
  96px (profile header).
- If `avatar_url` present → image. Else → initials (first letter of
  `full_name` or `username`) on a deterministic background color generated
  from a hash of the user's id (consistent palette of 8 muted colors from the
  primary/accent families).
- Online/active indicator not required (no presence system in backend).

### 7.5 Badges & Pills

- **Notification badge**: small red circle with count (max display "9+"),
  positioned top-right of bell icon.
- **Community/Project tag pill**: `var(--color-primary-50)` bg,
  `var(--color-primary-700)` text, `var(--radius-full)`, `--text-xs`,
  icon/emoji + name.
- **Due-date pill** (Assignments): color per urgency (see 7.3).
- **Role pill** (community/project members): "Admin" in
  `var(--color-accent-500)`-tinted pill, "Member" in neutral.
- **Pinned pill** (Announcements): small pin icon + "Pinned", amber tint.

### 7.6 Modals

Used for: Create Post, Create Community, Create Project Group, Create
Assignment, Upload Resource, Edit Post, Confirm Delete/Leave.

- Centered overlay, `max-width: 560px` (640px for forms with more fields like
  Create Assignment), backdrop `rgba(15,23,42,0.4)` with blur.
- Header: title + close (X) button. Footer: right-aligned Cancel (outline) +
  primary action button.
- Destructive confirmations (Delete Account, Delete Post, Leave Community as
  sole admin) use a **danger modal** variant: icon (alert-triangle) in a red
  circle at top, bold warning copy, primary button is `danger` variant and
  requires the action word typed for account deletion specifically (e.g. type
  "DELETE" to confirm) — everything else just needs a confirm click.

### 7.7 Toasts

Replace all `alert()`/`confirm()` browser dialogs (except the typed-confirmation
delete-account modal above) with a toast system:
- Bottom-right stack, `var(--color-surface)` bg, `var(--shadow-lg)`,
  left border accent (4px) colored by type (success/danger/info).
- Auto-dismiss after 4s (success/info) or persist until dismissed (errors with
  actionable detail).
- Used for: "Post created", "Joined Software Engineering", "Resource
  uploaded", API error messages, "Marked all as read".

### 7.8 Tabs

Underline-style tabs for: Community detail (Discussions / Resources /
Assignments / Members), Profile (Posts / Communities / Project Groups),
Search results (Posts / People / Communities). Active tab:
`var(--color-primary-600)` text + 2px bottom border, inactive:
`var(--color-text-muted)`.

### 7.9 Skeleton Loaders

Every list/feed shows 3-5 skeleton cards (shimmering gray blocks matching the
real card's layout) while loading — never a blank screen or spinner-only
state for content areas.

### 7.10 Empty States

Consistent pattern: centered icon (48px, `var(--color-text-subtle)`), bold
short title, one-line description, optional primary action button. Tone per
section:
- No communities joined: "You haven't joined any communities yet" → "Browse Communities" button
- No posts in a community: "No discussions yet — start one"
- No resources: "No resources shared yet"
- No assignments: "Nothing due — enjoy the break"
- No notifications: "You're all caught up"
- No search results: "No results for '{query}'"

### 7.11 Pagination / Load More

All paginated lists (`skip`/`limit`) use a "Load more" button at the bottom of
the list (appends results), not numbered pagination or infinite scroll —
predictable and accessible.

---

## 8. Screen-by-Screen Specifications

### 8.1 Authentication — Login & Register

**Layout:** Split screen (desktop), stacked (mobile). Left panel: brand
gradient background (`--color-primary-600` to `--color-primary-700`), logo,
tagline, 3-4 feature bullets with icons (Share notes, Join communities, Track
assignments, Discuss topics). Right panel: form card, centered.

**Tabs:** "Sign In" / "Create Account" toggle at top of the form panel.

**Sign In fields:** Username, Password, "Remember me" checkbox (cosmetic —
no backend support, so either omit or implement via longer-lived local token
storage), submit button "Sign In".

**Create Account fields:** Username, Email, Password, Full Name, Department
(text input or select from a predefined list), Academic Year (select: Year 1
- Year 5 / Graduate), Bio (optional, textarea, collapsible "Add bio"
disclosure). Submit → register then auto-login (per existing app.js pattern).

**Validation:** Inline, on blur — required fields, email format, password
min length (mention "at least 6 characters" — not enforced server-side but
good practice client-side).

**API:** `POST /auth/register`, `POST /auth/login`, `GET /users/me`.

---

### 8.2 Dashboard

**Route:** `/dashboard` (default landing page after login)

**Layout:** Main content + right rail.

**Main content, top to bottom:**

1. **Greeting banner** — full-width card, gradient background
   (`--color-primary-600` → `--color-primary-500`), white text. Large
   greeting (`--text-3xl`) from Section 6, subtitle summarizing assignments +
   notifications, and a primary button "Start a Discussion" (opens Create
   Post modal).

2. **Stat row** — 4 small stat cards: My Communities (count), Resources
   (count across my communities), Assignments Due (upcoming count), Unread
   Notifications. Each is icon + number + label, clickable → navigates to the
   relevant section.

3. **My Communities** — horizontal scroll row of community chips (icon +
   name), "Browse all →" link to Communities page.

4. **Recent Discussions** — list of `DiscussionCard`s from
   `recent_discussions` (max 5), "View all" → Communities or a unified feed.

**Right rail:**
1. **Upcoming Assignments** — list of `AssignmentCard`s (compact variant: due
   pill + title + community name only), from `upcoming_assignments`.
2. **Recent Resources** — compact `ResourceCard`s (icon + title + community),
   from `recent_resources`.
3. **Announcements** — list of announcement items (pin icon if pinned, title,
   community name or "Platform" if global, relative time), from
   `announcements`.

**API:** `GET /dashboard/` (single call powers all of the above).

**Empty dashboard** (new user, no communities joined): replace
"My Communities" + "Recent Discussions" with a single prominent empty state:
"Join your first community to see discussions here" → "Browse Communities"
button. Right rail sections individually show their own empty states.

---

### 8.3 Communities — List

**Route:** `/communities`

**Layout:** Page header ("Communities" title + "Create Community" primary
button, right-aligned) + search/filter bar (text search, calls
`/search/communities?q=`) + segmented control ("All" / "My Communities" —
toggles between `GET /communities/` and `GET /communities/mine`) + responsive
grid of `CommunityCard`s (3 columns desktop, 2 tablet, 1 mobile).

**Create Community modal:** Name, Description (textarea), Icon (emoji picker
or simple text input for an emoji — keep simple, e.g. a small preset palette
of 12 emoji to choose from).

**API:** `GET /communities/`, `GET /communities/mine`,
`GET /search/communities?q=`, `POST /communities/`, `POST /communities/{id}/join`.

---

### 8.4 Community Detail

**Route:** `/communities/{id}`

**Header:** Large icon, community name, description, member count, Join/Leave
button (primary if not joined, outline "Joined ✓" with a leave option in a
"..." menu if joined).

**Tabs:** Discussions (default) / Resources / Assignments / Members

- **Discussions tab:** "Start a Discussion" button (only if member) → Create
  Post modal pre-scoped to this community (`community_id` set, no community
  selector shown). Feed of `DiscussionCard`s via `GET /posts/?community_id=`.
- **Resources tab:** "Upload Resource" button (members only) → Upload modal
  pre-scoped to this community. Grid/list of `ResourceCard`s via
  `GET /resources/?community_id=`.
- **Assignments tab:** "New Assignment" button (members only) → Create
  Assignment modal pre-scoped to this community. List of `AssignmentCard`s via
  `GET /assignments/?community_id=`, sorted by due date.
- **Members tab:** Grid/list of `UserCard`s via `GET /communities/{id}/members`,
  with role pills. If current user is admin, this tab additionally shows
  "Post Announcement" button → opens Create Announcement modal scoped to this
  community.

**Right rail:** Pinned/recent Announcements for this community
(`GET /announcements/?community_id={id}`).

**Non-members:** Can view Discussions/Resources/Assignments/Members read-only
but action buttons (Start Discussion, Upload, New Assignment, Post
Announcement) are replaced by a banner: "Join this community to participate".

---

### 8.5 Resources

**Route:** `/resources`

**Layout:** Page header + filter bar (community filter dropdown — populated
from `GET /communities/mine`, defaults to "All my communities"; file-type
filter chips: All/PDF/Docs/Slides/Images/Other — client-side filter on
`file_type`). List view (not grid) of `ResourceCard`s, denser than community
tab version, via `GET /resources/?community_id=`.

**Upload Resource modal:** Title, Description (optional), Community selector
(dropdown of joined communities — required, since `community_id` is needed for
the membership check), file drop zone. Show upload progress as a determinate
progress bar (use `XMLHttpRequest` or `fetch` with a `ReadableStream` if
progress is needed — otherwise indeterminate is acceptable).

**API:** `GET /resources/`, `POST /resources/` (multipart), `GET /resources/{id}/download`.

---

### 8.6 Assignments

**Route:** `/assignments`

**Layout:** Page header + toggle ("Upcoming only" switch, default ON — calls
`?upcoming=true`) + community filter dropdown. Two display modes via a
view-switcher (list icon / calendar icon):

- **List view (default):** `AssignmentCard`s grouped under date-relative
  headers ("Overdue", "Due Today", "This Week", "Later"), sorted by `due_date`.
- **Calendar view:** Simple month grid, assignments shown as dots/labels on
  their due date, click a day to see that day's assignments in a side panel.
  (If calendar view is too costly to build well, it's acceptable to ship list
  view only for v1 and mark calendar as a follow-up — note this explicitly to
  the dev rather than shipping a broken calendar.)

**API:** `GET /assignments/?upcoming=&community_id=`, `POST /assignments/`
(from a "New Assignment" button, community required), `PUT/DELETE
/assignments/{id}` for the creator (edit/delete via "..." menu on the card).

---

### 8.7 Project Groups — List & Detail

**List** (`/project-groups`): Same pattern as Communities List but using
`ProjectGroupCard` and `GET /project-groups/` / `/mine`. "Create Project
Group" modal: Name, Description.

**Detail** (`/project-groups/{id}`): Same shell as Community Detail but
**without** Resources/Assignments tabs (those are community-only per the
backend) — just **Discussions** and **Members** tabs, using
`GET /posts/?project_group_id=` and `GET /project-groups/{id}/members`.
Join/Leave button same pattern as communities.

---

### 8.8 Discussion (Post) Detail

**Route:** `/posts/{id}`

**Layout:** Single-column, max-width 720px, centered.

- Author row: avatar (40px), name, `@username`, community/project badge if
  applicable, relative timestamp, "..." menu (Edit/Delete) if owner.
- Title (`--text-2xl`), content (full text, preserve line breaks).
- Action row: Like button (heart, fills + count increments optimistically on
  click, `is_liked` drives initial state), comment count (scrolls to comments
  section, non-interactive otherwise).
- **Comments section:** Comment composer (textarea + Post button) if logged
  in, else "Log in to comment" prompt. List of comments: avatar (24px), name,
  relative time, content, "..." menu (Edit/Delete) if owner of comment.

**API:** `GET /posts/{id}`, `POST/DELETE /likes/{id}`,
`GET /comments/post/{id}`, `POST/PUT/DELETE /comments/`.

---

### 8.9 Create Post (Discussion) — Modal

Triggered from: Dashboard greeting CTA, Community Discussions tab, Project
Group Discussions tab, or a global "+" button in the navbar (opens with a
"Post to" selector).

**Fields:**
- "Post to" selector — only shown when opened from a global entry point: a
  dropdown listing the user's joined communities and project groups (grouped
  under "Communities" / "Project Groups" headers), plus an option "My Profile"
  for an unscoped post (`community_id`/`project_group_id` both null). When
  opened from within a specific community/group, this selector is hidden and
  the scope is fixed (shown as static text: "Posting to: Software
  Engineering").
- Title (required)
- Content (required, textarea, min-height ~120px, auto-grow)

**API:** `POST /posts/`.

---

### 8.10 Profile (Own & Others)

**Route:** `/profile/{id}`

**Header card:** Avatar (96px), Full Name (or `@username` if no full name set,
in which case username becomes primary), `@username` as secondary,
Department · Academic Year as a subtitle line, Bio (if set). Follower /
Following counts (clickable → simple modal listing users, via
`GET /users/{id}/followers` / `/following`). Action button: "Edit Profile"
(own profile, → Settings) or "Follow"/"Following" toggle (other users, via
`POST/DELETE /users/{id}/follow`).

**Tabs:** Posts (default) — `GET /users/{id}/posts`, list of `DiscussionCard`s.
(Communities/Project Groups tabs are optional nice-to-haves — there's no
direct "communities a user belongs to" public endpoint, so only show these
tabs on the **own** profile via `/communities/mine` and `/project-groups/mine`.)

---

### 8.11 Settings

**Route:** `/settings`

**Sections (single scrollable page, or left-side mini-nav if it grows):**

1. **Profile** — form: Full Name, Username, Email, Department, Academic Year,
   Bio (textarea), Avatar URL (or file upload — backend currently expects a
   URL string for `avatar_url`, so either a URL input or a future enhancement
   to upload-and-get-a-URL via the resources endpoint; for v1, URL input is
   fine). Save button → `PUT /users/me`.

2. **Appearance** — theme toggle (light/dark/system).

3. **Danger Zone** — visually separated (red-tinted border/background per
   7.3 card conventions), "Delete Account" button → danger modal with typed
   confirmation → `DELETE /users/me`, then logout and redirect to login.

---

### 8.12 Notifications

**Navbar dropdown (desktop):** Bell icon → panel (360px wide, max-height
480px, scrollable), header "Notifications" + "Mark all as read" link
(`PUT /notifications/read-all`). List of notification items:
- Icon by type (heart=like, message=comment, user-plus=follow,
  clipboard=assignment, megaphone=announcement)
- Message text (from `notification.message` — already human-readable from the
  backend)
- Relative timestamp
- Unread items have a subtle highlight (`var(--color-primary-50)` bg) and a
  small dot indicator
- Clicking an item marks it read (`PUT /notifications/{id}/read`) and, where
  sensible, navigates to the related content using `related_id` + `type`
  (e.g. `type: "like"` or `"comment"` → `related_id` is a post id →
  `/posts/{related_id}`; `type: "follow"` → `related_id` is the follower's
  user id → `/profile/{related_id}`; `type: "assignment"` /
  `"announcement"` → no direct deep link needed, just mark read)

**Full page (`/notifications`, mobile entry point + "View all" from
dropdown):** Same list, paginated via `GET /notifications/?skip=&limit=`,
"Load more" pattern.

**API:** `GET /notifications/`, `GET /notifications/unread-count` (poll on
navbar mount + after relevant actions, or refresh on a reasonable interval
e.g. every 60s), `PUT /notifications/{id}/read`, `PUT /notifications/read-all`.

---

### 8.13 Search

**Route:** `/search?q=`

**Layout:** Search input at top (syncs with navbar search), tabs: Discussions
/ People / Communities. Each tab shows the relevant card type in a list, with
"Load more" pagination.

**API:** `GET /search/posts?q=`, `GET /search/users?q=`,
`GET /search/communities?q=`.

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Behavior |
|---|---|---|
| Mobile | <768px | Sidebar → drawer, right rail → hidden or moved below content, stat row → 2x2 grid, community/resource grids → 1 column |
| Tablet | 768–1023px | Sidebar visible (240px), right rail hidden, grids → 2 columns |
| Desktop | 1024–1279px | Sidebar + main, right rail hidden, grids → 3 columns |
| Wide | ≥1280px | Full 3-zone layout (sidebar + main + right rail) |

---

## 10. Accessibility

- All interactive elements reachable via keyboard (tab order follows visual
  order); modals trap focus and close on `Esc`.
- Color contrast: body text ≥ 4.5:1 against its background in both themes —
  verify `--color-text-muted` against `--color-surface` in dark mode
  specifically.
- All icon-only buttons get `aria-label`.
- Form inputs have associated `<label>` elements (not just placeholders).
- Toasts use `role="status"` (success/info) or `role="alert"` (errors) for
  screen reader announcement.
- Skeleton loaders include `aria-busy="true"` on their container.

---

## 11. Loading / Empty / Error Pattern (apply everywhere)

Every data-driven view must explicitly handle four states:

1. **Loading** — skeleton matching the real layout (Section 7.9)
2. **Empty** — Section 7.10 pattern, contextual copy + action
3. **Error** — inline message with a "Retry" button (don't just show a toast
   and leave a blank page)
4. **Loaded** — the real content

---

## 12. API Quick Map (for wiring screens)

| Screen | Primary Endpoints |
|---|---|
| Login/Register | `/auth/login`, `/auth/register`, `/users/me` |
| Dashboard | `/dashboard/` |
| Communities List | `/communities/`, `/communities/mine`, `/search/communities` |
| Community Detail | `/communities/{id}`, `/posts/?community_id=`, `/resources/?community_id=`, `/assignments/?community_id=`, `/communities/{id}/members`, `/announcements/?community_id=` |
| Resources | `/resources/`, `/resources/{id}/download` |
| Assignments | `/assignments/` |
| Project Groups | `/project-groups/`, `/project-groups/mine`, `/posts/?project_group_id=`, `/project-groups/{id}/members` |
| Post Detail | `/posts/{id}`, `/likes/{id}`, `/comments/post/{id}`, `/comments/` |
| Profile | `/users/{id}`, `/users/{id}/posts`, `/users/{id}/followers`, `/users/{id}/following`, `/users/{id}/follow` |
| Settings | `/users/me` (GET/PUT/DELETE) |
| Notifications | `/notifications/`, `/notifications/unread-count`, `/notifications/{id}/read`, `/notifications/read-all` |
| Search | `/search/posts`, `/search/users`, `/search/communities` |

---

## 13. Deliverables Checklist

- [ ] Design tokens implemented as CSS custom properties (Section 4), light + dark
- [ ] Core component library (Section 7) — built and visually reviewed before screen assembly
- [ ] App shell: navbar, sidebar (expand/collapse + mobile drawer), right rail container
- [ ] All 11 screens from Section 8 implemented with real API wiring
- [ ] Dynamic greeting (Section 6) using device local time
- [ ] Loading/empty/error states on every data view (Section 11)
- [ ] Toast system replacing all `alert()`/`confirm()` (except typed delete-account confirmation)
- [ ] Responsive at all breakpoints in Section 9
- [ ] Accessibility pass per Section 10
