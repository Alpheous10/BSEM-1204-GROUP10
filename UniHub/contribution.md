# UniHub — GitHub Collaboration & Workflow Standard

> **Project:** UniHub — Social Media Post API  
> **Group:** BSEM-1204-GROUP10 · Limkokwing University of Creative Technology, Sierra Leone  
> **Module:** PROG315 · Object-Oriented Programming 2  
> **Status:** Active Development · Semester 4 (March–July 2026)

---

## Table of Contents

1. [Repository Structure](#1-repository-structure)
2. [Access Control & Onboarding](#2-access-control--onboarding)
3. [Branch Strategy](#3-branch-strategy)
4. [Commit Standards](#4-commit-standards)
5. [Pull Request Protocol](#5-pull-request-protocol)
6. [Code Review Rules](#6-code-review-rules)
7. [Issue & Task Management](#7-issue--task-management)
8. [Environment & Secrets Policy](#8-environment--secrets-policy)
9. [CI Checks & Quality Gates](#9-ci-checks--quality-gates)
10. [Release & Versioning](#10-release--versioning)
11. [Emergency & Hotfix Protocol](#11-emergency--hotfix-protocol)
12. [Contributor Verification Checklist](#12-contributor-verification-checklist)
13. [Offboarding a Member](#13-offboarding-a-member)
14. [Things Most Teams Never Think About](#14-things-most-teams-never-think-about)

---

## 1. Repository Structure

```
unihub/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── task.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── workflows/
│   │   └── ci.yml                  # Automated checks on every PR
│   └── CODEOWNERS                  # Who owns which part of the code
├── app/
├── frontend/
├── migrations/
├── tests/
├── .env.example                    # Template — never commit a real .env
├── .gitignore
├── CONTRIBUTING.md                 # Points contributors here
├── GITHUB_WORKFLOW.md              # This file
├── LICENSE                         # MIT
├── README.md
└── requirements.txt
```

### Repository Settings (Owner must configure once)

Go to **Settings → General** and enable:

- [x] **Require pull request reviews before merging** (minimum 1 approval)
- [x] **Dismiss stale pull request approvals when new commits are pushed**
- [x] **Require status checks to pass before merging**
- [x] **Require branches to be up to date before merging**
- [x] **Do not allow bypassing the above settings** — applies to admins too
- [x] **Automatically delete head branches** after merge

Go to **Settings → Branches** and add a branch protection rule for `main`:

| Setting | Value |
|---|---|
| Require a pull request before merging | ✅ |
| Required approvals | 1 |
| Dismiss stale reviews | ✅ |
| Require status checks (CI) | ✅ |
| Include administrators | ✅ |
| Allow force pushes | ❌ Never |
| Allow deletions | ❌ Never |

---

## 2. Access Control & Onboarding

### Permission Levels

| Role | Who | Permissions |
|---|---|---|
| **Admin** | Repo owner (Group Lead) | Full access — settings, secrets, branch rules |
| **Maintainer** | 1 trusted co-lead | Merge PRs, manage issues, no settings access |
| **Write** | Active group members | Push branches, open PRs, comment |
| **Read** | Examiner / Lecturer | View code and issues only — cannot push |
| **Triage** | Future contributors | Label and comment on issues — cannot push |

### Onboarding a New Member (Step-by-Step)

```
1. New member creates a GitHub account (if they don't have one)
2. They send the Group Lead their GitHub username via a verified channel (WhatsApp group / university email — never a DM from a stranger)
3. Group Lead goes to: Settings → Collaborators → Add people
4. New member accepts the invitation email (expires in 7 days — resend if needed)
5. Group Lead assigns the correct role (Write for active members, Read for examiner)
6. New member completes the Contributor Verification Checklist (Section 12)
7. Group Lead confirms checklist is done before the member pushes any code
```

### Identity Verification Before Granting Write Access

Before anyone gets **Write** access, the Group Lead must confirm:

- [ ] GitHub username matches the person you know (check their profile photo, bio, or pinned repos)
- [ ] They joined via the invitation link sent to **their university email** — not a random Gmail
- [ ] They have set up **2FA (Two-Factor Authentication)** on their GitHub account
  - How: GitHub → Settings → Password and authentication → Enable 2FA
  - No 2FA = No Write access. Non-negotiable.
- [ ] They have confirmed they understand and have read this document
- [ ] They have signed the group's peer-contribution agreement (if your university requires one)

> **Why 2FA matters:** If a team member's GitHub account is hacked without 2FA, the attacker can push malicious code to your project directly. One compromised account can destroy the entire repo history.

### Granting Examiner / Lecturer Access

```
1. Go to Settings → Collaborators
2. Add the lecturer's GitHub username with Read access only
3. Do NOT give them Write or Admin — even if they ask, it is not necessary
4. Notify them via university email that they have been added
5. Include the repo URL in your report/submission
```

---

## 3. Branch Strategy

UniHub uses a simplified **GitHub Flow** adapted for academic group projects.

### Branch Map

```
main                    ← production-ready, protected, never pushed to directly
│
├── develop             ← integration branch, merges go here first
│   │
│   ├── feature/auth-jwt
│   ├── feature/post-crud
│   ├── feature/comments-likes
│   ├── feature/social-graph
│   ├── feature/search
│   ├── feature/frontend-ui
│   └── feature/admin-panel
│
└── hotfix/login-rate-limit   ← emergency fix, branches off main directly
```

### Branch Naming Convention

```
feature/<short-description>       → new functionality
fix/<short-description>           → bug fix (non-urgent)
hotfix/<short-description>        → urgent fix on production
docs/<short-description>          → documentation only
refactor/<short-description>      → code cleanup, no new features
test/<short-description>          → adding or fixing tests
chore/<short-description>         → dependency updates, config changes
```

**Examples:**
```
feature/argon2-password-hashing
fix/duplicate-like-constraint
docs/update-api-endpoint-table
refactor/extract-get-current-user
chore/update-requirements-txt
```

### Rules

- **Never push directly to `main`** — not even the Group Lead
- **Never push directly to `develop`** — always open a PR
- Branch names must be **lowercase with hyphens** — no spaces, no underscores, no capital letters
- Delete your branch after it is merged — the repo setting will do this automatically
- If your branch is older than **5 days** without a PR, ping the team

---

## 4. Commit Standards

UniHub follows the **Conventional Commits** specification.

### Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type | When to Use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting — no logic change (whitespace, semicolons) |
| `refactor` | Code restructure — no new feature, no bug fix |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates, config |
| `perf` | Performance improvement |
| `revert` | Reverting a previous commit |

### Examples

```bash
feat(auth): add JWT token expiry validation

fix(likes): prevent duplicate like on concurrent requests

docs(readme): add PostgreSQL setup instructions for Windows

refactor(posts): extract pagination logic into shared utility

chore(deps): upgrade fastapi to 0.111.0

feat(social): implement follow/unfollow with cascade delete

fix(admin): restrict deleted-users endpoint to is_admin=True only
```

### Rules

- Subject line: **50 characters max**, no period at the end
- Use the **imperative mood** — "add feature" not "added feature" or "adds feature"
- If the commit closes an issue, add `Closes #12` in the footer
- **Never** commit with messages like `fix`, `update`, `wip`, `asdf`, or `changes`
- **Never** commit commented-out code — delete it; git history preserves it anyway
- **Never** commit a `.env` file — ever

---

## 5. Pull Request Protocol

### Before Opening a PR

- [ ] Your branch is up to date with `develop` (`git pull origin develop`)
- [ ] All files are saved and the app runs locally without errors
- [ ] You have removed all `print()` debug statements
- [ ] You have not committed `.env`, `__pycache__`, or any secrets
- [ ] Your commits follow the Conventional Commits format (Section 4)

### Opening the PR

1. Push your branch: `git push origin feature/your-branch-name`
2. Go to the repo on GitHub → **Pull Requests → New Pull Request**
3. Set **base** to `develop` (never `main` for regular features)
4. Fill in the PR template (`.github/PULL_REQUEST_TEMPLATE.md`) — all fields required
5. Assign at least **one reviewer** from the team
6. Add the relevant **label** (`feature`, `bug`, `docs`, etc.)
7. Link the related **issue** using `Closes #<issue-number>` in the description

### PR Template (`.github/PULL_REQUEST_TEMPLATE.md`)

```markdown
## What does this PR do?
<!-- One paragraph summary -->

## Related Issue
Closes #

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactor
- [ ] Other: ___

## How to Test This
<!-- Step-by-step instructions for the reviewer to verify your changes -->
1. 
2. 
3. 

## Screenshots (if UI change)
<!-- Drag and drop an image here -->

## Checklist
- [ ] My code follows the project's style and naming conventions
- [ ] I have tested this locally
- [ ] I have not introduced any hardcoded secrets or credentials
- [ ] I have updated the README or docs if this changes existing behavior
- [ ] My branch is up to date with develop
```

### PR Size Rule

| PR Size | Lines Changed | Action |
|---|---|---|
| Small | < 200 lines | Ideal — review and merge quickly |
| Medium | 200–500 lines | Acceptable — add extra context in description |
| Large | 500–1000 lines | Acceptable only if unavoidable — explain why |
| Too Large | > 1000 lines | **Split it** — reviewers will request this |

---

## 6. Code Review Rules

### For Reviewers

- Review within **24 hours** of being assigned — do not sit on a PR
- Read the entire diff, not just the parts you wrote
- Test the changes locally if they touch auth, database, or security
- Use GitHub's **suggestion** feature for small fixes — don't just say "fix this"
- Be specific: "This will fail if `user_id` is null" is better than "this looks wrong"
- Approve only when you have actually verified it works — not as a courtesy

### Review Verdict Options

| Verdict | When to Use |
|---|---|
| ✅ **Approve** | Ready to merge, no issues |
| 💬 **Comment** | General feedback, no blocking issue |
| 🔄 **Request Changes** | Must be fixed before merge |

### What to Look For (Security Checklist)

- [ ] No hardcoded passwords, API keys, or secrets
- [ ] No SQL built by string concatenation (use ORM queries)
- [ ] All mutation endpoints check ownership before proceeding
- [ ] New endpoints are included in the OpenAPI docs (Pydantic models defined)
- [ ] Sensitive endpoints have authentication required (`Depends(get_current_user)`)
- [ ] No `is_admin` check bypassed

### Merging

- Only the **PR author** or **Group Lead** merges — not the reviewer
- Use **Squash and Merge** for feature branches (keeps `develop` history clean)
- Use **Merge Commit** when merging `develop` into `main` (preserves full history)
- **Never use Rebase and Merge** — it rewrites history and causes team confusion
- Delete the branch after merge

---

## 7. Issue & Task Management

### Issue Labels

| Label | Color | Meaning |
|---|---|---|
| `feature` | `#0075ca` | New functionality |
| `bug` | `#d73a4a` | Something is broken |
| `documentation` | `#0075ca` | Docs only |
| `security` | `#e4e669` | Security concern — treat as urgent |
| `blocked` | `#e11d48` | Waiting on another issue or person |
| `good first issue` | `#7057ff` | Safe for a new contributor |
| `wontfix` | `#ffffff` | Acknowledged but will not be implemented |
| `duplicate` | `#cfd3d7` | Already reported |
| `priority: high` | `#b91c1c` | Must be done this sprint |
| `priority: low` | `#bbf7d0` | Nice to have |

### Issue Assignment Rules

- Every issue must be **assigned to exactly one person** — shared ownership = no ownership
- If you take an issue, move it to **In Progress** on the project board
- If you are blocked, comment on the issue within 24 hours explaining why
- Close issues with a commit or PR — do not close them manually without linking work
- If an issue is stale (no activity for 5 days), the Group Lead reassigns it

### Milestone Structure

```
Milestone 1 — Foundation         (Week 1–2)   Database, models, auth
Milestone 2 — Core API           (Week 3–4)   Posts, comments, likes
Milestone 3 — Social Features    (Week 5–6)   Follow, feed, search
Milestone 4 — Polish & Docs      (Week 7)     Frontend, triggers, README
Milestone 5 — Submission Ready   (Week 8)     Final review, report, demo
```

---

## 8. Environment & Secrets Policy

### The Golden Rule

> **If it is a secret, it never touches Git. Ever. Not even once. Not in any branch.**

### `.env.example` (commit this — it has no real values)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/unihub

# Authentication
SECRET_KEY=your-secret-key-here-generate-with-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Rate Limiting
RATE_LIMIT_LOGIN=5/minute

# Admin
ADMIN_EMAIL=admin@example.com
```

### `.env` (never commit this — real values live here locally)

Each developer creates their own `.env` from the example above:

```bash
cp .env.example .env
# Then fill in real values
```

### `.gitignore` must include

```
.env
*.env
.env.*
!.env.example
__pycache__/
*.pyc
*.pyo
*.pyd
.DS_Store
Thumbs.db
*.log
node_modules/
```

### If a Secret Is Accidentally Committed

Do not panic. Do not just delete the file and commit again — the secret is still in git history.

1. **Immediately revoke and rotate** the exposed secret (generate a new `SECRET_KEY`, reset any passwords)
2. Notify the Group Lead immediately
3. Use `git filter-repo` or **BFG Repo Cleaner** to scrub the secret from history
4. Force-push the cleaned history (Group Lead only, after team is notified)
5. All team members must re-clone the repo after a force-push to history

---

## 9. CI Checks & Quality Gates

Create `.github/workflows/ci.yml` to automatically run checks on every PR:

```yaml
name: UniHub CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: unihub_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Lint with flake8
        run: |
          pip install flake8
          flake8 app/ --max-line-length=100 --exclude=__pycache__

      - name: Check formatting with black
        run: |
          pip install black
          black --check app/

      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:testpassword@localhost:5432/unihub_test
          SECRET_KEY: ci-test-secret-key-not-real
          ALGORITHM: HS256
          ACCESS_TOKEN_EXPIRE_MINUTES: 30
        run: |
          pip install pytest pytest-cov
          pytest tests/ --cov=app --cov-report=term-missing

      - name: Enforce minimum test coverage
        run: pytest tests/ --cov=app --cov-fail-under=60
```

### What Blocks a Merge

| Check | Threshold | Action if Fails |
|---|---|---|
| Linting (flake8) | Zero errors | Fix all flagged lines |
| Formatting (black) | Zero diffs | Run `black app/` locally |
| Tests (pytest) | All pass | Fix failing tests before PR |
| Coverage | ≥ 60% | Write tests for uncovered routes |

---

## 10. Release & Versioning

UniHub uses **Semantic Versioning**: `MAJOR.MINOR.PATCH`

| Part | Increment when |
|---|---|
| `MAJOR` | Breaking change — existing API contracts change |
| `MINOR` | New feature added, backwards compatible |
| `PATCH` | Bug fix, backwards compatible |

**Examples:**
```
v1.0.0  → Initial working release
v1.1.0  → Added social graph (follow/unfollow)
v1.1.1  → Fixed duplicate like bug
v1.2.0  → Added keyword search endpoints
v2.0.0  → Breaking: changed /auth/login response format
```

### Creating a Release

```bash
# Merge develop into main via PR (never directly)
# Then tag the release on main

git checkout main
git pull origin main
git tag -a v1.2.0 -m "feat: add search and admin endpoints"
git push origin v1.2.0
```

Then on GitHub: **Releases → Draft a new release → Choose tag → Generate release notes**

---

## 11. Emergency & Hotfix Protocol

When a critical bug exists on `main` (production) and cannot wait for the normal PR cycle:

```bash
# 1. Branch off main directly — NOT develop
git checkout main
git pull origin main
git checkout -b hotfix/login-bypass-vulnerability

# 2. Make the minimal fix — do not add features
# 3. Push and open a PR targeting main
git push origin hotfix/login-bypass-vulnerability

# 4. Get at least one review (even a quick verbal confirmation counts)
# 5. Merge into main
# 6. Immediately merge main back into develop to keep them in sync
git checkout develop
git merge main
git push origin develop

# 7. Tag a patch release
git checkout main
git tag -a v1.1.1 -m "hotfix: patch login rate-limit bypass"
git push origin v1.1.1

# 8. Delete the hotfix branch
git push origin --delete hotfix/login-bypass-vulnerability
```

> **Security hotfixes** (anything touching auth, passwords, or admin access) must be reviewed by **two** team members minimum, not one.

---

## 12. Contributor Verification Checklist

Every person who joins the repo as a collaborator must complete this before writing or pushing any code.

### Identity & Access

- [ ] GitHub account is at least 30 days old **or** verified with a university email
- [ ] Two-Factor Authentication (2FA) is enabled on GitHub account
- [ ] Invitation was accepted from the official email — not a shared link
- [ ] Role assigned matches their contribution area (Write for developers, Read for examiners)

### Local Setup Verification

- [ ] Repository cloned successfully via HTTPS or SSH
- [ ] `.env` file created from `.env.example` with correct local values
- [ ] App starts locally with `uvicorn main:app --reload` without errors
- [ ] `/docs` (Swagger UI) is accessible and all endpoints are visible
- [ ] Member has confirmed they can read their own Swagger auth flow
- [ ] Member has created a test account via `/auth/register` and logged in locally

### Workflow Agreement

- [ ] Has read this document (`GITHUB_WORKFLOW.md`) in full
- [ ] Understands they may **never push directly to `main` or `develop`**
- [ ] Understands they may **never commit `.env` or secrets**
- [ ] Understands commit message format (Section 4)
- [ ] Has created their first feature branch using the naming convention (Section 3)
- [ ] Group Lead has verbally confirmed the above is complete

**Group Lead signs off:** `_______________________` **Date:** `___________`

---

## 13. Offboarding a Member

If a team member leaves the project (drops the module, withdraws, or is removed):

```
1. Group Lead goes to Settings → Collaborators
2. Remove the member immediately — do not delay
3. Rotate the SECRET_KEY and any shared credentials they had access to
4. Audit the last 10 commits from that member for any unreviewed changes
5. Reassign their open issues to remaining team members
6. Update the CONTRIBUTING.md and team contributions table in the report
7. If they had admin access (they shouldn't), rotate ALL secrets and review ALL settings
```

> **Why rotate secrets even if they leave on good terms?**  
> They still have the `.env` file saved locally. Rotating closes that window without requiring trust.

---

## 14. Things Most Teams Never Think About

These are the gaps that separate professional teams from everyone else.

### 14.1 The CODEOWNERS File

Create `.github/CODEOWNERS` so GitHub automatically assigns reviewers based on which file changed:

```
# Default owners for everything
*                           @group-lead-username

# Auth files — always reviewed by the auth specialist
app/auth.py                 @member2-username
app/routers/auth.py         @member2-username

# Database models — reviewed by the DB lead
app/models/                 @member1-username
migrations/                 @member1-username

# Frontend — reviewed by the frontend developer
frontend/                   @member4-username

# This workflow file — only Group Lead can approve changes
GITHUB_WORKFLOW.md          @group-lead-username
```

### 14.2 Protecting Your Git History From Rewriting

After your first working version is tagged, add this to branch protection:

- **Require linear history** → prevents messy merge commits from appearing in `main`
- **Lock branch** (on `main` only during exam period) → no changes at all until submission

### 14.3 The "Bus Factor" Problem

Ask yourself: if one team member disappeared tomorrow, could the project survive?

- Every critical piece of knowledge must exist in the repo as **documentation**, not in one person's head
- Database setup steps → in `README.md`
- Where secrets come from → in `.env.example` with comments
- How triggers were created → in `migrations/001_add_triggers.sql` with comments
- How to run the app → in `README.md`

Minimum bus factor for a 4-person team: **2** — at least two people understand every major system.

### 14.4 Commit Signing (GPG)

GitHub can display a green **Verified** badge next to commits, proving the commit actually came from you and was not injected by someone who gained access to the repo.

```bash
# Generate a GPG key
gpg --full-generate-key

# Get your key ID
gpg --list-secret-keys --keyid-format=long

# Tell Git to use it
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true

# Add the public key to GitHub: Settings → SSH and GPG keys → New GPG key
```

### 14.5 The `.env` Audit Before Submission

Before submitting your project, run this command to prove no secrets were ever committed:

```bash
git log --all --full-history -- .env
# Output should be empty — if it isn't, you have a problem to fix
```

Also scan for common secret patterns:

```bash
git log -p | grep -i "secret_key\|password\|token\|api_key" | grep "^+"
# Review every line returned — confirm none are real values
```

### 14.6 Tagging Your Submission State

The moment before you submit, create a tag that freezes that exact version of the code:

```bash
git tag -a submission/prog315-final -m "PROG315 Final Submission — Group BSEM-1204-GROUP10"
git push origin submission/prog315-final
```

This means even if the team continues pushing after submission, the examiner can always checkout exactly what was submitted:

```bash
git checkout submission/prog315-final
```

### 14.7 Meaningful Git Blame

Every `git blame` on every file should tell a clear story of who built what and when. This directly supports the team contributions section of your academic report. If you commit all your code in one massive commit the night before submission, `git blame` shows nothing useful.

Commit **small, logical units of work as you go** — not everything at the end.

### 14.8 The README Is Your Front Door

Your README should answer these questions for a complete stranger in under 3 minutes:

```markdown
## What is UniHub?          ← one paragraph
## Features                 ← bullet list
## Tech Stack               ← table
## Prerequisites            ← exact versions (Python 3.11, PostgreSQL 15, etc.)
## Setup (Local)            ← numbered steps — copy-paste should work
## Environment Variables    ← point to .env.example
## Running the App          ← one command
## API Documentation        ← link to /docs and /redoc
## Running Tests            ← one command
## Contributing             ← link to this file
## License                  ← MIT
```

If a team member's cousin can set this up from scratch in 20 minutes following only the README, it is good enough.

---

## Quick Reference Card

```
New feature?        git checkout develop && git pull && git checkout -b feature/name
Commit?             git commit -m "feat(scope): description"
Ready to merge?     Open PR → base: develop → assign reviewer → fill template
Urgent fix?         Branch off main → hotfix/name → PR to main → merge back to develop
Someone joins?      Verify 2FA → invite → checklist → Write access granted
Secret exposed?     Rotate immediately → scrub history → notify team → re-clone
Submission?         git tag -a submission/prog315-final && git push origin --tags
```

---

*Last updated: June 2026 · BSEM-1204-GROUP10 · UniHub*  
*This document is version-controlled. Propose changes via PR — do not edit `main` directly.*