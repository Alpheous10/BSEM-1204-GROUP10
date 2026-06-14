# Study Circle

## Student Academic Collaboration Platform

---

# Project Overview

Study Circle is a web-based academic collaboration platform designed for university and college students.

Unlike traditional social media platforms that focus on entertainment and personal content, Study Circle focuses on solving common academic challenges faced by students during each semester.

The platform combines social interaction, resource sharing, academic discussions, project collaboration, and class communication into a single environment.

The goal is to create a centralized digital space where students can:

* Share lecture notes
* Receive academic updates
* Collaborate on group projects
* Discuss course-related topics
* Track assignments
* Access study resources
* Communicate with classmates

---

# Problem Statement

Students face several recurring problems every semester:

## 1. Missing Study Materials

Students frequently miss classes and struggle to obtain:

* Lecture notes
* Slides
* PDFs
* Handouts
* Past papers

Most materials are shared through scattered WhatsApp groups and private chats.

---

## 2. Assignment Awareness

Students often:

* Forget assignment deadlines
* Miss important coursework updates
* Receive information too late

There is no centralized location for assignment tracking.

---

## 3. Group Project Coordination

Students regularly struggle with:

* Finding project members
* Communicating with teammates
* Sharing project files
* Tracking project discussions

Project communication is often fragmented across multiple platforms.

---

## 4. Academic Discussions

Students need a space where they can:

* Ask academic questions
* Receive answers from peers
* Discuss difficult topics
* Share knowledge

---

## 5. Class Communication

Important information is often distributed through:

* WhatsApp groups
* Personal messages
* Word of mouth

Many students miss critical updates.

---

# Solution

Study Circle provides a centralized platform where academic communities can form around courses, subjects, projects, and study interests.

The platform functions as a hybrid of:

* Community Forum
* Resource Sharing Platform
* Study Group System
* Academic Social Network

---

# Target Users

## Primary Users

### Students

Students use the platform to:

* Join communities
* Access resources
* Share notes
* Participate in discussions
* Collaborate on projects

---

## Secondary Users

### Class Representatives

Class representatives can:

* Post announcements
* Share important information
* Coordinate students

---

### Lecturers (Future Feature)

Lecturers may eventually:

* Upload course materials
* Make announcements
* Engage with discussions

---

# Core Platform Structure

The platform revolves around Communities.

Examples:

* Software Engineering
* Networking
* Database Systems
* Artificial Intelligence
* Final Year Project
* Group Project Team A

Each community acts as a mini academic space.

---

# Functional Requirements

## Authentication

Users must be able to:

* Register
* Login
* Logout
* Recover accounts (future feature)

---

## User Profiles

Users should have:

* Name
* Profile picture
* Department
* Academic year
* Bio

Users can edit their profile information.

---

## Communities

Users can:

* Create communities
* Join communities
* Leave communities
* Browse communities
* View community members

Each community contains:

* Discussions
* Resources
* Announcements

---

## Posts

Users can:

* Create posts
* Edit their own posts
* Delete their own posts
* View posts

Post examples:

* Questions
* Discussions
* Announcements
* Study tips

---

## Comments

Users can:

* Add comments
* Reply to discussions
* Participate in conversations

---

## Reactions

Users can react to posts.

Examples:

* Like
* Helpful
* Thanks

MVP may initially support simple likes only.

---

## Resource Sharing

Users can:

* Upload files
* Download files
* View shared resources

Supported resources:

* PDF
* DOCX
* PPT
* Images

Examples:

* Lecture notes
* Assignment instructions
* Past papers
* Study guides

---

## Assignment Posts

Assignments should include:

* Title
* Description
* Due date
* Attached resources

Assignments should appear prominently within the platform.

---

## Project Groups

Users can:

* Create project groups
* Join project groups
* Discuss project tasks
* Share project files

Project groups act as private communities.

---

## Search

Users should be able to search:

* Communities
* Posts
* Resources
* Members

---

## Notifications

Users should receive notifications for:

* New comments
* New announcements
* Community activity
* Assignment updates

Future versions may support real-time notifications.

---

# Non-Functional Requirements

## Performance

* Fast page loading
* Efficient API communication
* Responsive interface

Target:

* Initial page load under 3 seconds

---

## Security

* Secure authentication
* Protected user information
* Input validation
* Authorization checks

---

## Scalability

System should support:

* Thousands of students
* Multiple communities
* Large resource collections

---

## Reliability

System should:

* Minimize downtime
* Prevent data loss
* Handle concurrent users

---

## Maintainability

Code should be:

* Modular
* Reusable
* Well organized
* Easy to update

---

## Usability

The interface should:

* Be intuitive
* Require minimal training
* Support mobile and desktop devices

---

# Design Philosophy

The platform should NOT look like:

* Facebook
* Instagram
* TikTok

The platform SHOULD look like:

* Modern student dashboard
* Academic workspace
* Community collaboration tool

The design should communicate:

"Productivity, Learning, Collaboration"

instead of

"Entertainment and Social Networking"

---

# Recommended Layout

## Top Navigation

Contains:

* Logo
* Search bar
* Notifications
* User profile

---

## Left Sidebar

Contains:

* Dashboard
* Communities
* Resources
* Assignments
* Project Groups
* Profile

---

## Main Content Area

Displays:

* Discussions
* Posts
* Announcements
* Resources

---

## Right Sidebar

Displays:

* Upcoming assignments
* Deadlines
* Recent activity
* Trending discussions

---

# Dashboard Page

Displays:

## Assignment Overview

Shows:

* Upcoming deadlines
* Due dates

---

## Recent Resources

Shows:

* Newly uploaded notes
* Recent files

---

## Recent Discussions

Shows:

* Latest conversations
* Active posts

---

## Announcements

Shows:

* Important updates
* Community notices

---

# Community Page

Displays:

* Community details
* Members
* Posts
* Shared resources

Users can:

* Create posts
* Comment
* Upload resources

---

# Resource Library

Displays:

* Uploaded notes
* Past papers
* Documents

Supports:

* Search
* Filtering
* Downloading

---

# Project Group Workspace

Displays:

* Team members
* Discussions
* Shared files

Designed to support academic collaboration.

---

# Visual Design Direction

Style:

* Modern
* Clean
* Professional
* Academic

Preferred Colors:

* Blue
* Indigo
* White
* Light Gray

Avoid:

* Excessive animations
* Bright social-media-style colors
* Visual clutter

---

# MVP Scope

Must Have:

* Authentication
* Communities
* Posts
* Comments
* Likes
* Resources
* Search
* Dashboard

Nice To Have:

* Notifications
* Assignment tracking
* Project workspaces

Future:

* Lecturer accounts
* Real-time messaging
* AI academic assistant
* Calendar integration
* Mobile application

---

# Success Criteria

The platform is successful if students can:

1. Find lecture notes quickly.
2. Stay informed about assignments.
3. Collaborate effectively on projects.
4. Participate in academic discussions.
5. Access academic resources from one platform.

The platform should become a centralized academic hub for students throughout each semester.
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>UniLink — Sign In</title>
<link rel="stylesheet" href="styles.css" />
<style>
  body { background: #F0F2FF; display: flex; min-height: 100vh; font-family: var(--font-body); }

  .auth-shell {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    min-height: 100vh;
  }

  /* === LEFT PANEL === */
  .auth-left {
    background: var(--sidebar-bg);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 48px;
    position: relative;
    overflow: hidden;
  }

  .auth-left::before {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(59,91,219,0.35) 0%, transparent 70%);
    top: -100px; right: -100px;
    pointer-events: none;
  }

  .auth-left::after {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(121,80,242,0.2) 0%, transparent 70%);
    bottom: 40px; left: 0px;
    pointer-events: none;
  }

  .auth-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
  }

  .auth-brand .logo-mark {
    width: 40px; height: 40px;
    background: var(--primary);
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 18px;
    color: #fff;
    box-shadow: var(--shadow-primary);
  }

  .auth-brand .brand-name {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 22px;
    color: #fff;
    letter-spacing: -0.5px;
  }

  .auth-hero {
    position: relative;
    z-index: 1;
  }

  .auth-hero h2 {
    font-family: var(--font-display);
    font-size: 36px;
    font-weight: 800;
    color: #fff;
    line-height: 1.2;
    letter-spacing: -0.8px;
    margin-bottom: 18px;
  }

  .auth-hero h2 span {
    background: linear-gradient(135deg, #748FFC, #A5B4FC);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .auth-hero p {
    font-size: 14.5px;
    color: rgba(255,255,255,0.65);
    line-height: 1.7;
    max-width: 340px;
    margin-bottom: 32px;
  }

  .feature-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .feature-list li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 13.5px;
    color: rgba(255,255,255,0.75);
  }

  .feature-list .feat-icon {
    width: 28px; height: 28px;
    background: rgba(59,91,219,0.4);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .auth-tagline {
    font-size: 12.5px;
    color: rgba(255,255,255,0.35);
    position: relative;
  }

  /* === RIGHT PANEL === */
  .auth-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 60px;
    background: #F5F6FA;
  }

  .auth-form-box {
    width: 100%;
    max-width: 400px;
  }

  .auth-tabs {
    display: flex;
    gap: 0;
    background: var(--gray-200);
    border-radius: var(--radius-lg);
    padding: 5px;
    margin-bottom: 32px;
  }

  .auth-tab {
    flex: 1;
    text-align: center;
    padding: 9px;
    border-radius: var(--radius);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    background: none;
    color: var(--gray-600);
  }

  .auth-tab.active {
    background: #fff;
    color: var(--primary);
    box-shadow: var(--shadow-sm);
  }

  .auth-form-box h3 {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 800;
    color: var(--gray-900);
    letter-spacing: -0.4px;
    margin-bottom: 6px;
  }

  .auth-form-box .sub {
    font-size: 13.5px;
    color: var(--gray-500);
    margin-bottom: 26px;
  }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .input-wrap {
    position: relative;
  }

  .input-wrap .input-icon {
    position: absolute;
    left: 12px;
    top: 50%; transform: translateY(-50%);
    width: 16px; height: 16px;
    color: var(--gray-400);
    pointer-events: none;
  }

  .input-wrap .form-input { padding-left: 38px; }

  .form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
  }

  .checkbox-row {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    color: var(--gray-600);
    cursor: pointer;
  }

  .forgot-link {
    font-size: 13px;
    color: var(--primary);
    text-decoration: none;
    font-weight: 500;
  }

  .forgot-link:hover { text-decoration: underline; }

  .btn-auth {
    width: 100%;
    justify-content: center;
    padding: 11px;
    font-size: 14.5px;
    border-radius: var(--radius-lg);
    margin-bottom: 20px;
  }

  .divider-text {
    text-align: center;
    position: relative;
    margin: 18px 0;
    font-size: 12.5px;
    color: var(--gray-400);
  }

  .divider-text::before, .divider-text::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 42%;
    height: 1px;
    background: var(--gray-300);
  }
  .divider-text::before { left: 0; }
  .divider-text::after { right: 0; }

  .dept-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 16px;
    margin-bottom: 6px;
  }

  .dept-option {
    border: 1.5px solid var(--gray-300);
    border-radius: var(--radius);
    padding: 10px 12px;
    cursor: pointer;
    transition: all 0.15s;
    font-size: 12.5px;
    font-weight: 500;
    color: var(--gray-700);
    text-align: center;
    display: flex;
    align-items: center;
    gap: 7px;
    justify-content: center;
  }

  .dept-option:hover, .dept-option.selected {
    border-color: var(--primary);
    background: var(--primary-muted);
    color: var(--primary);
  }

  .auth-switch {
    text-align: center;
    font-size: 13px;
    color: var(--gray-500);
    margin-top: 16px;
  }

  .auth-switch a {
    color: var(--primary);
    font-weight: 600;
    text-decoration: none;
  }

  /* Panel toggle */
  .panel { display: none; }
  .panel.active { display: block; }
</style>
</head>
<body>
<div class="auth-shell">

  <!-- LEFT -->
  <div class="auth-left">
    <div class="auth-brand">
      <div class="logo-mark">U</div>
      <span class="brand-name">UniLink</span>
    </div>

    <div class="auth-hero">
      <h2>Your <span>Academic Hub</span>, all in one place.</h2>
      <p>Connect with classmates, access study materials, collaborate on projects, and never miss a deadline again.</p>

      <ul class="feature-list">
        <li>
          <div class="feat-icon">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#748FFC" stroke-width="2.5"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
          </div>
          Share notes, past papers and lecture slides
        </li>
        <li>
          <div class="feat-icon">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#748FFC" stroke-width="2.5"><path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
          </div>
          Join academic communities per course or subject
        </li>
        <li>
          <div class="feat-icon">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#748FFC" stroke-width="2.5"><path d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375"/></svg>
          </div>
          Track assignments and upcoming deadlines
        </li>
        <li>
          <div class="feat-icon">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#748FFC" stroke-width="2.5"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/></svg>
          </div>
          Discuss difficult topics with your peers
        </li>
      </ul>
    </div>

    <div class="auth-tagline">© 2025 UniLink · Built for students, by students.</div>
  </div>

  <!-- RIGHT -->
  <div class="auth-right">
    <div class="auth-form-box">

      <!-- Tabs -->
      <div class="auth-tabs">
        <button class="auth-tab active" onclick="switchTab('login', this)">Sign In</button>
        <button class="auth-tab" onclick="switchTab('register', this)">Create Account</button>
      </div>

      <!-- LOGIN -->
      <div id="panel-login" class="panel active">
        <h3>Welcome back 👋</h3>
        <p class="sub">Sign in to continue to UniLink</p>

        <div class="form-group">
          <label class="form-label">University Email</label>
          <div class="input-wrap">
            <svg class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
            <input type="email" class="form-input" placeholder="you@university.edu" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="input-wrap">
            <svg class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
            <input type="password" class="form-input" placeholder="••••••••" />
          </div>
        </div>

        <div class="form-footer">
          <label class="checkbox-row">
            <input type="checkbox" /> Remember me
          </label>
          <a href="#" class="forgot-link">Forgot password?</a>
        </div>

        <a href="dashboard.html" class="btn btn-primary btn-auth">Sign In</a>

        <p class="auth-switch">Don't have an account? <a href="#" onclick="switchTabByName('register')">Create one free</a></p>
      </div>

      <!-- REGISTER -->
      <div id="panel-register" class="panel">
        <h3>Join UniLink</h3>
        <p class="sub">Create your academic profile to get started</p>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">First Name</label>
            <input type="text" class="form-input" placeholder="Ibrahim" />
          </div>
          <div class="form-group">
            <label class="form-label">Last Name</label>
            <input type="text" class="form-input" placeholder="Kamara" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">University Email</label>
          <div class="input-wrap">
            <svg class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
            <input type="email" class="form-input" placeholder="you@university.edu" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Academic Year</label>
            <select class="form-input select">
              <option>Year 1</option>
              <option>Year 2</option>
              <option selected>Year 3</option>
              <option>Year 4</option>
              <option>Postgraduate</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Department</label>
            <select class="form-input select">
              <option>Computer Science</option>
              <option>Engineering</option>
              <option>Business</option>
              <option>Medicine</option>
              <option>Law</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="input-wrap">
            <svg class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
            <input type="password" class="form-input" placeholder="Create a secure password" />
          </div>
        </div>

        <a href="dashboard.html" class="btn btn-primary btn-auth" style="margin-top:8px;">Create Account</a>

        <p class="auth-switch">Already have an account? <a href="#" onclick="switchTabByName('login')">Sign in</a></p>
      </div>

    </div>
  </div>
</div>

<script>
function switchTab(name, btn) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel-' + name).classList.add('active');
}
function switchTabByName(name) {
  const tabs = document.querySelectorAll('.auth-tab');
  const idx = name === 'login' ? 0 : 1;
  switchTab(name, tabs[idx]);
  return false;
}
</script>
</body>
</html>
// Shared sidebar renderer
function renderNav(activePage) {
  const pages = [
    { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: `<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>` },
    { id: 'communities', label: 'Communities', href: 'communities.html', icon: `<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>` },
    { id: 'resources', label: 'Resources', href: 'resources.html', icon: `<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"/></svg>` },
    { id: 'assignments', label: 'Assignments', href: 'assignments.html', icon: `<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375"/></svg>`, badge: '3' },
    { id: 'projects', label: 'Project Groups', href: 'projects.html', icon: `<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>` },
    { id: 'profile', label: 'My Profile', href: 'profile.html', icon: `<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>` },
  ];

  return `
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-mark">U</div>
      <span class="logo-text">UniLink</span>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-section-label">Navigation</div>
      <ul class="sidebar-nav">
        ${pages.map(p => `
          <li>
            <a href="${p.href}" class="${p.id === activePage ? 'active' : ''}">
              <span class="nav-icon">${p.icon}</span>
              ${p.label}
              ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
            </a>
          </li>
        `).join('')}
      </ul>
    </div>

    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="avatar">IK</div>
        <div class="user-info">
          <div class="name">Ibrahim Kamara</div>
          <div class="role">Year 3 · CS</div>
        </div>
      </div>
    </div>
  </aside>`;
}
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>UniLink — Dashboard</title>
<link rel="stylesheet" href="styles.css" />
<style>
/* Dashboard specific */
.welcome-banner {
  background: linear-gradient(135deg, var(--primary) 0%, #5C7CFA 50%, var(--accent) 100%);
  border-radius: var(--radius-xl);
  padding: 28px 32px;
  color: #fff;
  position: relative;
  overflow: hidden;
  margin-bottom: 24px;
}

.welcome-banner::before {
  content: '';
  position: absolute;
  right: -30px; top: -40px;
  width: 220px; height: 220px;
  background: rgba(255,255,255,0.07);
  border-radius: 50%;
}

.welcome-banner::after {
  content: '';
  position: absolute;
  right: 60px; bottom: -60px;
  width: 160px; height: 160px;
  background: rgba(255,255,255,0.05);
  border-radius: 50%;
}

.welcome-banner h2 {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.4px;
  margin-bottom: 6px;
  position: relative;
}

.welcome-banner p {
  font-size: 13.5px;
  opacity: 0.82;
  position: relative;
  max-width: 480px;
}

.welcome-banner .btn-light {
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff;
  padding: 8px 16px;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  text-decoration: none;
  position: relative;
}

.welcome-banner .btn-light:hover { background: rgba(255,255,255,0.26); }

/* Stats row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card .stat-icon {
  margin-bottom: 12px;
}

/* Assignment item */
.assignment-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 0;
  border-bottom: 1px solid var(--gray-100);
}

.assignment-item:last-child { border-bottom: none; }

.assignment-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.assignment-item .info { flex: 1; min-width: 0; }
.assignment-item .title { font-size: 13.5px; font-weight: 600; color: var(--gray-800); }
.assignment-item .meta { font-size: 12px; color: var(--gray-500); margin-top: 2px; }

.deadline-chip {
  font-size: 11.5px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 20px;
  white-space: nowrap;
}

.deadline-urgent { background: var(--danger-light); color: var(--danger); }
.deadline-soon { background: var(--warning-light); color: var(--warning); }
.deadline-ok { background: var(--success-light); color: var(--success); }

/* Discussion item */
.discussion-item {
  display: flex;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid var(--gray-100);
}
.discussion-item:last-child { border-bottom: none; }

.disc-avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-light), var(--accent));
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #fff;
  flex-shrink: 0;
}

.disc-body { flex: 1; min-width: 0; }
.disc-title { font-size: 13.5px; font-weight: 600; color: var(--gray-800); margin-bottom: 2px; }
.disc-meta { font-size: 12px; color: var(--gray-500); }

.disc-reactions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}
.disc-reaction {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--gray-500);
}

/* Resource item */
.resource-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid var(--gray-100);
}
.resource-item:last-child { border-bottom: none; }

.resource-icon {
  width: 36px; height: 36px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.res-pdf { background: #FFE8E8; color: var(--danger); }
.res-ppt { background: #FFF0E6; color: #D6450A; }
.res-doc { background: #E8F0FF; color: var(--primary); }

.resource-info { flex: 1; min-width: 0; }
.resource-name { font-size: 13px; font-weight: 600; color: var(--gray-800); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.resource-sub { font-size: 11.5px; color: var(--gray-500); margin-top: 2px; }

/* Community chips */
.community-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.comm-chip {
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-700);
  text-decoration: none;
  transition: all 0.15s;
  cursor: pointer;
}
.comm-chip:hover { border-color: var(--primary); background: var(--primary-muted); color: var(--primary); }

.comm-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Announcement */
.announcement-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--indigo-soft);
  border-left: 3px solid var(--primary);
  border-radius: 0 var(--radius) var(--radius) 0;
  margin-bottom: 10px;
}
.announcement-item:last-child { margin-bottom: 0; }
.ann-icon { flex-shrink: 0; margin-top: 1px; }
.ann-body .ann-title { font-size: 13.5px; font-weight: 600; color: var(--gray-800); }
.ann-body .ann-meta { font-size: 12px; color: var(--gray-500); margin-top: 2px; }

/* Right sidebar */
.right-panel { display: flex; flex-direction: column; gap: 16px; }

/* Mini calendar */
.mini-cal { font-size: 12.5px; }
.cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.cal-month { font-weight: 700; font-size: 13.5px; color: var(--gray-800); }
.cal-nav { background: none; border: none; color: var(--gray-400); cursor: pointer; padding: 2px 6px; border-radius: 4px; }
.cal-nav:hover { background: var(--gray-100); }
.cal-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 2px; text-align: center; }
.cal-day-label { color: var(--gray-400); font-size: 11px; font-weight: 600; padding: 4px 0; }
.cal-day { padding: 5px; border-radius: 6px; cursor: pointer; color: var(--gray-700); }
.cal-day:hover { background: var(--gray-100); }
.cal-day.today { background: var(--primary); color: #fff; font-weight: 700; }
.cal-day.has-event { position: relative; }
.cal-day.has-event::after { content: ''; position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background: var(--accent); border-radius: 50%; }
.cal-day.empty { color: transparent; cursor: default; }
</style>
</head>
<body>
<div class="app-shell">
  <div id="sidebar-mount"></div>

  <main class="main">
    <!-- Topbar -->
    <header class="topbar">
      <span class="topbar-title">Dashboard</span>
      <div class="topbar-search">
        <svg class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z"/></svg>
        <input type="text" placeholder="Search communities, resources, posts…" />
      </div>
      <div class="topbar-actions">
        <button class="icon-btn" title="Notifications">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
          <span class="dot"></span>
        </button>
        <div class="topbar-avatar">IK</div>
      </div>
    </header>

    <div class="page-content">
      <!-- Welcome Banner -->
      <div class="welcome-banner">
        <h2>Good morning, Ibrahim 👋</h2>
        <p>You have 3 upcoming assignment deadlines this week and 2 unread community announcements.</p>
        <a href="assignments.html" class="btn-light">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375"/></svg>
          View Assignments
        </a>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="flex-between">
            <div>
              <div class="stat-label">Communities</div>
              <div class="stat-value">6</div>
              <div class="stat-sub">Joined this semester</div>
            </div>
            <div class="stat-icon" style="background:var(--indigo-soft)">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#4263EB" stroke-width="2"><path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="flex-between">
            <div>
              <div class="stat-label">Resources</div>
              <div class="stat-value">34</div>
              <div class="stat-sub">Files available to you</div>
            </div>
            <div class="stat-icon" style="background:#FFF0E6">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#D6450A" stroke-width="2"><path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"/></svg>
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="flex-between">
            <div>
              <div class="stat-label">Assignments</div>
              <div class="stat-value">3</div>
              <div class="stat-sub">Due this week</div>
            </div>
            <div class="stat-icon" style="background:var(--danger-light)">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#C92A2A" stroke-width="2"><path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="flex-between">
            <div>
              <div class="stat-label">Discussions</div>
              <div class="stat-value">12</div>
              <div class="stat-sub">Active this week</div>
            </div>
            <div class="stat-icon" style="background:var(--accent-light)">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#7950F2" stroke-width="2"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="grid-dash">
        <!-- LEFT COLUMN -->
        <div style="display:flex;flex-direction:column;gap:20px;">

          <!-- My Communities -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">My Communities</span>
              <a href="communities.html" class="view-all">View All →</a>
            </div>
            <div class="card-body">
              <div class="community-chips">
                <a href="communities.html" class="comm-chip"><span class="comm-dot" style="background:#4263EB"></span>Software Engineering</a>
                <a href="communities.html" class="comm-chip"><span class="comm-dot" style="background:#7950F2"></span>Database Systems</a>
                <a href="communities.html" class="comm-chip"><span class="comm-dot" style="background:#2F9E44"></span>Networking</a>
                <a href="communities.html" class="comm-chip"><span class="comm-dot" style="background:#E67700"></span>Artificial Intelligence</a>
                <a href="communities.html" class="comm-chip"><span class="comm-dot" style="background:#C92A2A"></span>Final Year Project</a>
                <a href="communities.html" class="comm-chip"><span class="comm-dot" style="background:#1971C2"></span>Web Development</a>
              </div>
            </div>
          </div>

          <!-- Announcements -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">Announcements</span>
              <span class="tag tag-red">2 New</span>
            </div>
            <div class="card-body">
              <div class="announcement-item">
                <div class="ann-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#3B5BDB" stroke-width="2"><path d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"/></svg>
                </div>
                <div class="ann-body">
                  <div class="ann-title">Database Systems — Mid-term test moved to Friday</div>
                  <div class="ann-meta">Posted by Class Rep · Software Engineering · 2 hours ago</div>
                </div>
              </div>
              <div class="announcement-item">
                <div class="ann-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#3B5BDB" stroke-width="2"><path d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"/></svg>
                </div>
                <div class="ann-body">
                  <div class="ann-title">AI Lab session rescheduled — New time: Thursday 2PM</div>
                  <div class="ann-meta">Posted by Class Rep · Artificial Intelligence · Yesterday</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Discussions -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">Recent Discussions</span>
              <a href="communities.html" class="view-all">View All →</a>
            </div>
            <div class="card-body" style="padding-top:4px;">
              <div class="discussion-item">
                <div class="disc-avatar" style="background:linear-gradient(135deg,#4263EB,#7950F2)">AM</div>
                <div class="disc-body">
                  <div class="disc-title">Can someone explain the difference between 2NF and 3NF in database normalization?</div>
                  <div class="disc-meta">Amara M. · Database Systems · 1h ago</div>
                  <div class="disc-reactions">
                    <span class="disc-reaction">
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.253m0 0H3.75"/></svg>
                      8 Helpful
                    </span>
                    <span class="disc-reaction">
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/></svg>
                      5 Replies
                    </span>
                  </div>
                </div>
              </div>
              <div class="discussion-item">
                <div class="disc-avatar" style="background:linear-gradient(135deg,#2F9E44,#1971C2)">KS</div>
                <div class="disc-body">
                  <div class="disc-title">Notes for Week 7 lecture on TCP/IP protocols — sharing here</div>
                  <div class="disc-meta">Kofi S. · Networking · 3h ago</div>
                  <div class="disc-reactions">
                    <span class="disc-reaction">
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.253m0 0H3.75"/></svg>
                      14 Thanks
                    </span>
                    <span class="disc-reaction">
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/></svg>
                      2 Replies
                    </span>
                  </div>
                </div>
              </div>
              <div class="discussion-item">
                <div class="disc-avatar" style="background:linear-gradient(135deg,#E67700,#C92A2A)">FJ</div>
                <div class="disc-body">
                  <div class="disc-title">Looking for teammates for the Software Engineering group project — need 2 more</div>
                  <div class="disc-meta">Fatou J. · Software Engineering · Yesterday</div>
                  <div class="disc-reactions">
                    <span class="disc-reaction">
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/></svg>
                      7 Replies
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Resources -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">Recent Resources</span>
              <a href="resources.html" class="view-all">View All →</a>
            </div>
            <div class="card-body" style="padding-top:4px;">
              <div class="resource-item">
                <div class="resource-icon res-pdf">PDF</div>
                <div class="resource-info">
                  <div class="resource-name">Database Normalization — Week 6 Notes.pdf</div>
                  <div class="resource-sub">Database Systems · Uploaded by Amara M. · 2.4 MB</div>
                </div>
                <button class="btn btn-outline btn-sm">Download</button>
              </div>
              <div class="resource-item">
                <div class="resource-icon res-ppt">PPT</div>
                <div class="resource-info">
                  <div class="resource-name">AI Introduction — Lecture Slides.pptx</div>
                  <div class="resource-sub">Artificial Intelligence · Uploaded by Class Rep · 5.1 MB</div>
                </div>
                <button class="btn btn-outline btn-sm">Download</button>
              </div>
              <div class="resource-item">
                <div class="resource-icon res-pdf">PDF</div>
                <div class="resource-info">
                  <div class="resource-name">2023 Past Paper — Software Engineering.pdf</div>
                  <div class="resource-sub">Software Engineering · Uploaded by Kofi S. · 1.2 MB</div>
                </div>
                <button class="btn btn-outline btn-sm">Download</button>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="right-panel">

          <!-- Calendar -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">Calendar</span>
            </div>
            <div class="card-body mini-cal">
              <div class="cal-header">
                <span class="cal-month">June 2025</span>
                <div style="display:flex;gap:2px">
                  <button class="cal-nav">‹</button>
                  <button class="cal-nav">›</button>
                </div>
              </div>
              <div class="cal-grid">
                <div class="cal-day-label">M</div><div class="cal-day-label">T</div><div class="cal-day-label">W</div><div class="cal-day-label">T</div><div class="cal-day-label">F</div><div class="cal-day-label">S</div><div class="cal-day-label">S</div>
                <div class="cal-day empty"></div><div class="cal-day empty"></div><div class="cal-day empty"></div><div class="cal-day empty"></div><div class="cal-day empty"></div><div class="cal-day">1</div><div class="cal-day">2</div>
                <div class="cal-day">3</div><div class="cal-day has-event">4</div><div class="cal-day">5</div><div class="cal-day has-event">6</div><div class="cal-day">7</div><div class="cal-day">8</div><div class="cal-day">9</div>
                <div class="cal-day">10</div><div class="cal-day">11</div><div class="cal-day has-event">12</div><div class="cal-day today">13</div><div class="cal-day">14</div><div class="cal-day">15</div><div class="cal-day">16</div>
                <div class="cal-day">17</div><div class="cal-day has-event">18</div><div class="cal-day">19</div><div class="cal-day">20</div><div class="cal-day has-event">21</div><div class="cal-day">22</div><div class="cal-day">23</div>
                <div class="cal-day">24</div><div class="cal-day">25</div><div class="cal-day">26</div><div class="cal-day">27</div><div class="cal-day">28</div><div class="cal-day">29</div><div class="cal-day">30</div>
              </div>
            </div>
          </div>

          <!-- Upcoming Assignments -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">Upcoming Deadlines</span>
              <a href="assignments.html" class="view-all">All →</a>
            </div>
            <div class="card-body" style="padding-top:4px;">
              <div class="assignment-item">
                <div class="assignment-dot" style="background:var(--danger)"></div>
                <div class="info">
                  <div class="title">Database ER Diagram Submission</div>
                  <div class="meta">Database Systems</div>
                </div>
                <span class="deadline-chip deadline-urgent">Tomorrow</span>
              </div>
              <div class="assignment-item">
                <div class="assignment-dot" style="background:var(--warning)"></div>
                <div class="info">
                  <div class="title">Networking Lab Report #3</div>
                  <div class="meta">Networking</div>
                </div>
                <span class="deadline-chip deadline-soon">3 days</span>
              </div>
              <div class="assignment-item">
                <div class="assignment-dot" style="background:var(--primary)"></div>
                <div class="info">
                  <div class="title">AI Literature Review</div>
                  <div class="meta">Artificial Intelligence</div>
                </div>
                <span class="deadline-chip deadline-ok">1 week</span>
              </div>
              <div class="assignment-item">
                <div class="assignment-dot" style="background:var(--success)"></div>
                <div class="info">
                  <div class="title">SE Group Project Phase 1</div>
                  <div class="meta">Software Engineering</div>
                </div>
                <span class="deadline-chip deadline-ok">2 weeks</span>
              </div>
            </div>
          </div>

          <!-- Active Projects -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">Project Groups</span>
              <a href="projects.html" class="view-all">All →</a>
            </div>
            <div class="card-body" style="padding-top:8px;">
              <div style="display:flex;flex-direction:column;gap:14px;">
                <div>
                  <div class="flex-between mb-4">
                    <span style="font-size:13px;font-weight:600;color:var(--gray-800)">Library Management System</span>
                    <span class="tag tag-blue">Active</span>
                  </div>
                  <div class="flex-between mb-8" style="font-size:12px;color:var(--gray-500)">
                    <span>3 of 5 tasks done</span>
                    <span>60%</span>
                  </div>
                  <div class="progress-bar"><div class="progress-fill" style="width:60%"></div></div>
                </div>
                <div>
                  <div class="flex-between mb-4">
                    <span style="font-size:13px;font-weight:600;color:var(--gray-800)">Network Topology Design</span>
                    <span class="tag tag-orange">In Progress</span>
                  </div>
                  <div class="flex-between mb-8" style="font-size:12px;color:var(--gray-500)">
                    <span>1 of 4 tasks done</span>
                    <span>25%</span>
                  </div>
                  <div class="progress-bar"><div class="progress-fill" style="width:25%"></div></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </main>
</div>

<script src="nav.js"></script>
<script>
  document.getElementById('sidebar-mount').outerHTML = renderNav('dashboard');
</script>
</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>UniLink — Communities</title>
<link rel="stylesheet" href="styles.css" />
<style>
.comm-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
  text-decoration: none;
  display: block;
  color: inherit;
}
.comm-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }

.comm-card-banner {
  height: 72px;
  position: relative;
}

.comm-card-body { padding: 16px 18px 18px; }

.comm-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-top: -22px;
  margin-bottom: 10px;
  border: 3px solid #fff;
  font-size: 18px;
}

.comm-name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: var(--gray-900);
  letter-spacing: -0.2px;
  margin-bottom: 4px;
}

.comm-desc {
  font-size: 12.5px;
  color: var(--gray-500);
  line-height: 1.5;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.comm-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--gray-100);
}

.comm-stats {
  display: flex;
  gap: 14px;
}

.comm-stat {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--gray-500);
  font-weight: 500;
}

/* Community detail panel */
.comm-detail-header {
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  height: 140px;
  position: relative;
}

.comm-detail-icon {
  width: 56px; height: 56px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  position: absolute;
  bottom: -28px;
  left: 28px;
  border: 3px solid #fff;
  font-size: 24px;
}

.comm-detail-body { padding: 40px 28px 28px; }

.post-composer {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 16px;
}

.composer-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.composer-input {
  flex: 1;
  background: var(--gray-50);
  border: 1.5px solid var(--gray-200);
  border-radius: 50px;
  padding: 9px 16px;
  font-size: 13.5px;
  font-family: var(--font-body);
  color: var(--gray-700);
  outline: none;
  cursor: pointer;
  transition: all 0.15s;
}

.composer-input:focus { border-color: var(--primary); background: #fff; }

.composer-actions { display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--gray-100); }

.post-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  margin-bottom: 12px;
  box-shadow: var(--shadow-sm);
}

.post-header { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 12px; }

.post-author-info { flex: 1; }
.post-author { font-size: 14px; font-weight: 700; color: var(--gray-900); }
.post-meta { font-size: 12px; color: var(--gray-500); margin-top: 1px; }

.post-content { font-size: 14px; line-height: 1.65; color: var(--gray-700); margin-bottom: 14px; }

.post-footer { display: flex; gap: 16px; padding-top: 12px; border-top: 1px solid var(--gray-100); }

.post-action {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--gray-500);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: all 0.15s;
  border: none;
  background: none;
  font-family: var(--font-body);
}

.post-action:hover { background: var(--gray-100); color: var(--primary); }
.post-action.liked { color: var(--primary); }

/* Sidebar panel */
.comm-sidebar { display: flex; flex-direction: column; gap: 16px; }

.member-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--gray-100);
}
.member-row:last-child { border-bottom: none; }
.member-name { font-size: 13px; font-weight: 600; color: var(--gray-800); }
.member-role { font-size: 11.5px; color: var(--gray-500); }

.filter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.view-toggle {
  display: flex;
  background: var(--gray-100);
  border-radius: var(--radius);
  padding: 3px;
  gap: 2px;
}

.view-btn {
  padding: 5px 8px;
  border: none;
  background: none;
  border-radius: var(--radius-sm);
  color: var(--gray-500);
  cursor: pointer;
  transition: all 0.15s;
}

.view-btn.active { background: #fff; color: var(--primary); box-shadow: var(--shadow-sm); }
</style>
</head>
<body>
<div class="app-shell">
  <div id="sidebar-mount"></div>

  <main class="main">
    <header class="topbar">
      <span class="topbar-title">Communities</span>
      <div class="topbar-search">
        <svg class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z"/></svg>
        <input type="text" placeholder="Search communities…" />
      </div>
      <div class="topbar-actions">
        <button class="icon-btn"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg><span class="dot"></span></button>
        <div class="topbar-avatar">IK</div>
      </div>
    </header>

    <div class="page-content">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header-left">
          <h1>Communities</h1>
          <p>Discover and join academic communities for your courses and subjects</p>
        </div>
        <button class="btn btn-primary" onclick="document.getElementById('create-modal').style.display='flex'">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 4.5v15m7.5-7.5h-15"/></svg>
          Create Community
        </button>
      </div>

      <!-- Tabs + Filter -->
      <div class="filter-row">
        <div class="tabs">
          <button class="tab-btn active" onclick="setTab(this,'all')">All Communities</button>
          <button class="tab-btn" onclick="setTab(this,'mine')">My Communities</button>
          <button class="tab-btn" onclick="setTab(this,'discover')">Discover</button>
        </div>
        <select class="select" style="font-size:13px;">
          <option>All Departments</option>
          <option>Computer Science</option>
          <option>Engineering</option>
          <option>Business</option>
        </select>
        <div class="view-toggle">
          <button class="view-btn active">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </button>
          <button class="view-btn">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
          </button>
        </div>
      </div>

      <!-- Section: My Communities -->
      <div style="margin-bottom:8px;" class="flex-between">
        <h3 style="font-family:var(--font-display);font-size:14px;font-weight:700;color:var(--gray-700);letter-spacing:-0.2px;">MY COMMUNITIES</h3>
      </div>

      <div class="grid-3 mb-16" style="margin-bottom:28px;">
        <!-- card 1 -->
        <a href="community-detail.html" class="comm-card">
          <div class="comm-card-banner" style="background:linear-gradient(135deg,#3B5BDB,#748FFC)"></div>
          <div class="comm-card-body">
            <div class="comm-icon" style="background:#EEF1FF">💻</div>
            <div class="comm-name">Software Engineering</div>
            <div class="comm-desc">Discussions, resources, and project collaboration for SE students in Year 3.</div>
            <div class="comm-meta">
              <div class="comm-stats">
                <span class="comm-stat"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72"/></svg>87</span>
                <span class="comm-stat"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286"/></svg>124</span>
              </div>
              <span class="tag tag-blue">Joined</span>
            </div>
          </div>
        </a>
        <!-- card 2 -->
        <a href="community-detail.html" class="comm-card">
          <div class="comm-card-banner" style="background:linear-gradient(135deg,#7950F2,#9B7FFF)"></div>
          <div class="comm-card-body">
            <div class="comm-icon" style="background:#F3F0FF">🗄️</div>
            <div class="comm-name">Database Systems</div>
            <div class="comm-desc">SQL, normalization, transactions, and everything DB. Notes and past papers inside.</div>
            <div class="comm-meta">
              <div class="comm-stats">
                <span class="comm-stat"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72"/></svg>64</span>
                <span class="comm-stat"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286"/></svg>89</span>
              </div>
              <span class="tag tag-blue">Joined</span>
            </div>
          </div>
        </a>
        <!-- card 3 -->
        <a href="community-detail.html" class="comm-card">
          <div class="comm-card-banner" style="background:linear-gradient(135deg,#2F9E44,#51CF66)"></div>
          <div class="comm-card-body">
            <div class="comm-icon" style="background:#EBFBEE">🌐</div>
            <div class="comm-name">Networking</div>
            <div class="comm-desc">TCP/IP, routing protocols, subnetting, and lab session notes for Computer Networks.</div>
            <div class="comm-meta">
              <div class="comm-stats">
                <span class="comm-stat"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72"/></svg>72</span>
                <span class="comm-stat"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286"/></svg>56</span>
              </div>
              <span class="tag tag-blue">Joined</span>
            </div>
          </div>
        </a>
        <!-- card 4 -->
        <a href="community-detail.html" class="comm-card">
          <div class="comm-card-banner" style="background:linear-gradient(135deg,#E67700,#FFA94D)"></div>
          <div class="comm-card-body">
            <div class="comm-icon" style="background:#FFF3BF">🤖</div>
            <div class="comm-name">Artificial Intelligence</div>
            <div class="comm-desc">Machine learning, neural networks, and AI ethics. Resources and weekly discussions.</div>
            <div class="comm-meta">
              <div class="comm-stats">
                <span class="comm-stat"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72"/></svg>93</span>
                <span class="comm-stat"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286"/></svg>201</span>
              </div>
              <span class="tag tag-blue">Joined</span>
            </div>
          </div>
        </a>
        <!-- card 5 -->
        <a href="community-detail.html" class="comm-card">
          <div class="comm-card-banner" style="background:linear-gradient(135deg,#C92A2A,#FF6B6B)"></div>
          <div class="comm-card-body">
            <div class="comm-icon" style="background:#FFF5F5">🎓</div>
            <div class="comm-name">Final Year Project</div>
            <div class="comm-desc">FYP resources, supervisor meeting notes, and peer support for all final year students.</div>
            <div class="comm-meta">
              <div class="comm-stats">
                <span class="comm-stat"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72"/></svg>145</span>
                <span class="comm-stat"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286"/></svg>380</span>
              </div>
              <span class="tag tag-blue">Joined</span>
            </div>
          </div>
        </a>
        <!-- card 6 -->
        <a href="community-detail.html" class="comm-card">
          <div class="comm-card-banner" style="background:linear-gradient(135deg,#1971C2,#4DABF7)"></div>
          <div class="comm-card-body">
            <div class="comm-icon" style="background:#E7F5FF">🌍</div>
            <div class="comm-name">Web Development</div>
            <div class="comm-desc">HTML, CSS, JavaScript, frameworks and deployment. Projects and code reviews welcome.</div>
            <div class="comm-meta">
              <div class="comm-stats">
                <span class="comm-stat"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72"/></svg>58</span>
                <span class="comm-stat"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286"/></svg>67</span>
              </div>
              <span class="tag tag-blue">Joined</span>
            </div>
          </div>
        </a>
      </div>

      <!-- Discover More -->
      <div style="margin-bottom:14px;" class="flex-between">
        <h3 style="font-family:var(--font-display);font-size:14px;font-weight:700;color:var(--gray-700);letter-spacing:-0.2px;">DISCOVER MORE</h3>
      </div>

      <div class="grid-3">
        <div class="comm-card">
          <div class="comm-card-banner" style="background:linear-gradient(135deg,#495057,#868E96)"></div>
          <div class="comm-card-body">
            <div class="comm-icon" style="background:#F1F3F5">📊</div>
            <div class="comm-name">Data Structures & Algorithms</div>
            <div class="comm-desc">Practice problems, solutions, and study tips for DSA exams.</div>
            <div class="comm-meta">
              <div class="comm-stats"><span class="comm-stat"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72"/></svg>110</span></div>
              <button class="btn btn-primary btn-sm">Join</button>
            </div>
          </div>
        </div>
        <div class="comm-card">
          <div class="comm-card-banner" style="background:linear-gradient(135deg,#862E9C,#CC5DE8)"></div>
          <div class="comm-card-body">
            <div class="comm-icon" style="background:#F8F0FC">🔐</div>
            <div class="comm-name">Cybersecurity</div>
            <div class="comm-desc">Ethical hacking, cryptography, and information security resources.</div>
            <div class="comm-meta">
              <div class="comm-stats"><span class="comm-stat"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72"/></svg>43</span></div>
              <button class="btn btn-primary btn-sm">Join</button>
            </div>
          </div>
        </div>
        <div class="comm-card">
          <div class="comm-card-banner" style="background:linear-gradient(135deg,#087F5B,#20C997)"></div>
          <div class="comm-card-body">
            <div class="comm-icon" style="background:#E6FCF5">📱</div>
            <div class="comm-name">Mobile Development</div>
            <div class="comm-desc">Android, iOS and cross-platform development resources and projects.</div>
            <div class="comm-meta">
              <div class="comm-stats"><span class="comm-stat"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72"/></svg>77</span></div>
              <button class="btn btn-primary btn-sm">Join</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<!-- Create Community Modal -->
<div id="create-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:999;align-items:center;justify-content:center;">
  <div style="background:#fff;border-radius:var(--radius-xl);padding:32px;width:480px;max-width:95vw;box-shadow:var(--shadow-lg);">
    <div class="flex-between mb-16">
      <h3 style="font-family:var(--font-display);font-size:18px;font-weight:800;color:var(--gray-900);">Create a Community</h3>
      <button onclick="document.getElementById('create-modal').style.display='none'" style="background:none;border:none;cursor:pointer;color:var(--gray-500);">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="form-group"><label class="form-label">Community Name</label><input type="text" class="form-input" placeholder="e.g. Operating Systems Year 2" /></div>
    <div class="form-group"><label class="form-label">Description</label><textarea class="form-input" placeholder="What is this community about?"></textarea></div>
    <div class="form-group">
      <label class="form-label">Category</label>
      <select class="form-input select"><option>Course Community</option><option>Subject Discussion</option><option>Study Group</option><option>General</option></select>
    </div>
    <div class="flex-between" style="margin-top:8px;">
      <button onclick="document.getElementById('create-modal').style.display='none'" class="btn btn-ghost">Cancel</button>
      <button class="btn btn-primary">Create Community</button>
    </div>
  </div>
</div>

<script src="nav.js"></script>
<script>
  document.getElementById('sidebar-mount').outerHTML = renderNav('communities');
  function setTab(btn, name) {
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
  }
</script>
</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>UniLink — Software Engineering Community</title>
<link rel="stylesheet" href="styles.css" />
<style>
.comm-hero {
  background: linear-gradient(135deg, #3B5BDB 0%, #5C7CFA 60%, #7950F2 100%);
  border-radius: var(--radius-xl);
  padding: 28px 32px 24px;
  color: #fff;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}
.comm-hero::before {
  content: '';
  position: absolute;
  right: -20px; bottom: -30px;
  width: 200px; height: 200px;
  background: rgba(255,255,255,0.07);
  border-radius: 50%;
}
.comm-hero-top { display: flex; align-items: center; gap: 16px; margin-bottom: 14px; }
.comm-hero-icon { width: 52px; height: 52px; background: rgba(255,255,255,0.18); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.comm-hero h2 { font-family: var(--font-display); font-size: 22px; font-weight: 800; letter-spacing: -0.4px; }
.comm-hero p { font-size: 13.5px; opacity: 0.82; }
.comm-hero-stats { display: flex; gap: 24px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.15); margin-top: 14px; }
.comm-hero-stat { font-size: 13px; opacity: 0.85; }
.comm-hero-stat strong { font-weight: 700; }
.comm-hero-actions { display: flex; gap: 8px; margin-left: auto; }
.btn-hero { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); color: #fff; padding: 7px 14px; border-radius: var(--radius); font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.btn-hero:hover { background: rgba(255,255,255,0.26); }
.btn-hero-solid { background: #fff; color: var(--primary); border: none; }
.btn-hero-solid:hover { background: #f0f2ff; }

/* Post composer */
.post-composer {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
}
.composer-row { display: flex; gap: 12px; align-items: center; }
.composer-input {
  flex: 1;
  background: var(--gray-50);
  border: 1.5px solid var(--gray-200);
  border-radius: 50px;
  padding: 9px 18px;
  font-size: 13.5px;
  font-family: var(--font-body);
  color: var(--gray-600);
  outline: none;
  transition: all 0.15s;
}
.composer-input:focus { border-color: var(--primary); background: #fff; }
.composer-actions { display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--gray-100); }
.composer-action-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; color: var(--gray-500); font-size: 12.5px; font-weight: 500; cursor: pointer; padding: 5px 8px; border-radius: var(--radius-sm); transition: all 0.15s; font-family: var(--font-body); }
.composer-action-btn:hover { background: var(--gray-100); color: var(--gray-700); }

/* Post card */
.post-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.15s;
}
.post-card:hover { box-shadow: var(--shadow); }
.post-header { display: flex; gap: 12px; margin-bottom: 12px; }
.post-avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
.post-info { flex: 1; }
.post-author { font-size: 14px; font-weight: 700; color: var(--gray-900); }
.post-meta-line { font-size: 12px; color: var(--gray-500); margin-top: 1px; display: flex; align-items: center; gap: 6px; }

.post-content { font-size: 13.5px; line-height: 1.7; color: var(--gray-700); margin-bottom: 14px; }

.post-attachment {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.att-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; }
.att-name { font-size: 13px; font-weight: 600; color: var(--gray-800); }
.att-size { font-size: 11.5px; color: var(--gray-500); }

.post-footer { display: flex; gap: 4px; padding-top: 12px; border-top: 1px solid var(--gray-100); }
.post-action-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; color: var(--gray-500); font-size: 13px; padding: 5px 10px; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.15s; font-family: var(--font-body); font-weight: 500; }
.post-action-btn:hover { background: var(--gray-100); color: var(--primary); }
.post-action-btn.active { color: var(--primary); }

/* Right sidebar */
.comm-right { display: flex; flex-direction: column; gap: 16px; }

.member-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--gray-100); }
.member-item:last-child { border-bottom: none; }
.member-name { font-size: 13px; font-weight: 600; color: var(--gray-800); }
.member-year { font-size: 11.5px; color: var(--gray-500); }

.resource-quick { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--gray-100); }
.resource-quick:last-child { border-bottom: none; }
.res-icon-sm { width: 30px; height: 30px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; flex-shrink: 0; }
.res-name { font-size: 12.5px; font-weight: 600; color: var(--gray-800); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.res-type { font-size: 11px; color: var(--gray-500); }
</style>
</head>
<body>
<div class="app-shell">
  <div id="sidebar-mount"></div>

  <main class="main">
    <header class="topbar">
      <a href="communities.html" style="display:flex;align-items:center;gap:6px;text-decoration:none;color:var(--gray-500);font-size:13px;font-weight:500;margin-right:6px;">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
        Communities
      </a>
      <span style="color:var(--gray-300)">/</span>
      <span class="topbar-title" style="margin-left:6px;">Software Engineering</span>
      <div class="topbar-search" style="margin-left:auto;max-width:320px;">
        <svg class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z"/></svg>
        <input type="text" placeholder="Search this community…" />
      </div>
      <div class="topbar-actions" style="margin-left:12px;">
        <button class="icon-btn"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg><span class="dot"></span></button>
        <div class="topbar-avatar">IK</div>
      </div>
    </header>

    <div class="page-content">
      <!-- Community Hero -->
      <div class="comm-hero">
        <div class="comm-hero-top">
          <div class="comm-hero-icon">💻</div>
          <div style="flex:1">
            <h2>Software Engineering</h2>
            <p>Discussions, resources, and collaboration for SE students in Year 3</p>
          </div>
          <div class="comm-hero-actions">
            <button class="btn-hero btn-hero-solid">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Joined
            </button>
            <button class="btn-hero">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31"/></svg>
              Notifications
            </button>
          </div>
        </div>
        <div class="comm-hero-stats">
          <span class="comm-hero-stat"><strong>87</strong> members</span>
          <span class="comm-hero-stat"><strong>124</strong> discussions</span>
          <span class="comm-hero-stat"><strong>43</strong> resources</span>
          <span class="comm-hero-stat"><strong>Active</strong> today</span>
        </div>
      </div>

      <!-- Tabs + Content -->
      <div class="grid-2-1" style="grid-template-columns:1fr 300px;">
        <!-- Main -->
        <div>
          <!-- Sub-tabs -->
          <div class="tabs" style="margin-bottom:18px;">
            <button class="tab-btn active">Discussions</button>
            <button class="tab-btn">Resources</button>
            <button class="tab-btn">Announcements</button>
            <button class="tab-btn">Members</button>
          </div>

          <!-- Composer -->
          <div class="post-composer">
            <div class="composer-row">
              <div class="post-avatar" style="background:linear-gradient(135deg,var(--primary),var(--accent));font-size:12px;">IK</div>
              <input class="composer-input" type="text" placeholder="Ask a question, share notes, or start a discussion…" />
            </div>
            <div class="composer-actions">
              <button class="composer-action-btn">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"/></svg>
                Attach File
              </button>
              <button class="composer-action-btn">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09"/></svg>
                Announcement
              </button>
              <div style="margin-left:auto;">
                <button class="btn btn-primary btn-sm">Post</button>
              </div>
            </div>
          </div>

          <!-- Posts -->
          <div class="post-card">
            <div class="post-header">
              <div class="post-avatar" style="background:linear-gradient(135deg,#C92A2A,#FF6B6B)">FJ</div>
              <div class="post-info">
                <div class="post-author">Fatou Jalloh</div>
                <div class="post-meta-line">
                  <span>Class Representative</span>
                  <span>·</span>
                  <span>2 hours ago</span>
                </div>
              </div>
              <span class="tag tag-red" style="height:fit-content;">Announcement</span>
            </div>
            <div class="post-content">
              📢 <strong>Important:</strong> The Software Engineering group project submission deadline has been extended to <strong>Friday 27th June</strong>. Please make sure all teams have their Phase 1 documentation ready by then. The final presentation schedule will be shared this week.
            </div>
            <div class="post-footer">
              <button class="post-action-btn active">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.253m0 0H3.75"/></svg>
                24 Thanks
              </button>
              <button class="post-action-btn">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/></svg>
                3 Replies
              </button>
            </div>
          </div>

          <div class="post-card">
            <div class="post-header">
              <div class="post-avatar" style="background:linear-gradient(135deg,#4263EB,#7950F2)">AM</div>
              <div class="post-info">
                <div class="post-author">Amara Mansaray</div>
                <div class="post-meta-line"><span>Year 3 · CS</span><span>·</span><span>4 hours ago</span></div>
              </div>
              <span class="tag tag-purple" style="height:fit-content;">Question</span>
            </div>
            <div class="post-content">
              Hey everyone, can someone help me understand the difference between use-case diagrams and sequence diagrams in UML? I keep confusing when to use which one. I've been reading the textbook but it's still not clicking properly. Any simple explanation or examples would be really helpful! 🙏
            </div>
            <div class="post-footer">
              <button class="post-action-btn">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08"/></svg>
                8 Helpful
              </button>
              <button class="post-action-btn">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3"/></svg>
                5 Replies
              </button>
              <button class="post-action-btn" style="margin-left:auto;">Reply</button>
            </div>
          </div>

          <div class="post-card">
            <div class="post-header">
              <div class="post-avatar" style="background:linear-gradient(135deg,#2F9E44,#51CF66)">KS</div>
              <div class="post-info">
                <div class="post-author">Kofi Sesay</div>
                <div class="post-meta-line"><span>Year 3 · CS</span><span>·</span><span>Yesterday</span></div>
              </div>
              <span class="tag tag-blue" style="height:fit-content;">Resource</span>
            </div>
            <div class="post-content">
              Sharing my Week 8 lecture notes — covers Agile methodology, Scrum framework, and sprint planning. Really well organized notes with diagrams. Hope it helps everyone for the upcoming test! 📚
            </div>
            <div class="post-attachment">
              <div class="att-icon res-pdf">PDF</div>
              <div style="flex:1;min-width:0;">
                <div class="att-name">SE Week 8 — Agile & Scrum Notes.pdf</div>
                <div class="att-size">3.2 MB · PDF Document</div>
              </div>
              <button class="btn btn-outline btn-sm">Download</button>
            </div>
            <div class="post-footer">
              <button class="post-action-btn">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08"/></svg>
                31 Thanks
              </button>
              <button class="post-action-btn">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3"/></svg>
                2 Replies
              </button>
            </div>
          </div>

          <div class="post-card">
            <div class="post-header">
              <div class="post-avatar" style="background:linear-gradient(135deg,#E67700,#FFA94D)">MK</div>
              <div class="post-info">
                <div class="post-author">Mohamed Kamara</div>
                <div class="post-meta-line"><span>Year 3 · CS</span><span>·</span><span>2 days ago</span></div>
              </div>
              <span class="tag tag-gray" style="height:fit-content;">Discussion</span>
            </div>
            <div class="post-content">
              Does anyone else feel like the SDLC topic is really confusing? I'm specifically struggling with the difference between Waterfall and Spiral models. Would anyone be interested in forming a small study group this weekend to go through it together?
            </div>
            <div class="post-footer">
              <button class="post-action-btn">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08"/></svg>
                6 Helpful
              </button>
              <button class="post-action-btn">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3"/></svg>
                9 Replies
              </button>
              <button class="post-action-btn" style="margin-left:auto;">Reply</button>
            </div>
          </div>
        </div>

        <!-- Right sidebar -->
        <div class="comm-right">
          <!-- Members -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">Members (87)</span>
              <a href="#" class="view-all">All →</a>
            </div>
            <div class="card-body" style="padding-top:4px;">
              <div class="member-item">
                <div class="avatar-sm" style="background:linear-gradient(135deg,#C92A2A,#FF6B6B)">FJ</div>
                <div style="flex:1">
                  <div class="member-name">Fatou Jalloh</div>
                  <div class="member-year">Class Rep</div>
                </div>
                <span class="tag tag-blue" style="font-size:10px;padding:1px 7px;">Rep</span>
              </div>
              <div class="member-item">
                <div class="avatar-sm" style="background:linear-gradient(135deg,#4263EB,#7950F2)">AM</div>
                <div style="flex:1"><div class="member-name">Amara Mansaray</div><div class="member-year">Year 3 · CS</div></div>
              </div>
              <div class="member-item">
                <div class="avatar-sm" style="background:linear-gradient(135deg,#2F9E44,#51CF66)">KS</div>
                <div style="flex:1"><div class="member-name">Kofi Sesay</div><div class="member-year">Year 3 · CS</div></div>
              </div>
              <div class="member-item">
                <div class="avatar-sm" style="background:linear-gradient(135deg,var(--primary),var(--accent))">IK</div>
                <div style="flex:1"><div class="member-name">Ibrahim Kamara</div><div class="member-year">Year 3 · CS</div></div>
              </div>
              <div class="member-item">
                <div class="avatar-sm" style="background:linear-gradient(135deg,#E67700,#FFA94D)">MK</div>
                <div style="flex:1"><div class="member-name">Mohamed Kamara</div><div class="member-year">Year 3 · CS</div></div>
              </div>
            </div>
          </div>

          <!-- Resources -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">Resources</span>
              <a href="resources.html" class="view-all">All →</a>
            </div>
            <div class="card-body" style="padding-top:4px;">
              <div class="resource-quick">
                <div class="res-icon-sm res-pdf">PDF</div>
                <div style="flex:1;min-width:0;"><div class="res-name">SE Week 8 — Agile Notes.pdf</div><div class="res-type">PDF · 3.2 MB</div></div>
              </div>
              <div class="resource-quick">
                <div class="res-icon-sm res-ppt">PPT</div>
                <div style="flex:1;min-width:0;"><div class="res-name">UML Diagrams Slides.pptx</div><div class="res-type">PPT · 8.5 MB</div></div>
              </div>
              <div class="resource-quick">
                <div class="res-icon-sm res-pdf">PDF</div>
                <div style="flex:1;min-width:0;"><div class="res-name">2023 Past Paper.pdf</div><div class="res-type">PDF · 0.9 MB</div></div>
              </div>
              <div class="resource-quick">
                <div class="res-icon-sm res-doc">DOC</div>
                <div style="flex:1;min-width:0;"><div class="res-name">Project Proposal Template.docx</div><div class="res-type">DOC · 0.3 MB</div></div>
              </div>
            </div>
          </div>

          <!-- About -->
          <div class="card">
            <div class="card-header"><span class="card-title">About</span></div>
            <div class="card-body" style="font-size:13px;color:var(--gray-600);line-height:1.6;">
              <p style="margin-bottom:10px;">A community for Software Engineering students to share resources, ask questions, and collaborate on projects.</p>
              <div style="display:flex;flex-direction:column;gap:7px;">
                <div class="flex-center gap-8"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25"/></svg> Created Jan 2025</div>
                <div class="flex-center gap-8"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/></svg> Computer Science Dept</div>
                <div class="flex-center gap-8"><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg> Open Community</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<script src="nav.js"></script>
<script>document.getElementById('sidebar-mount').outerHTML = renderNav('communities');</script>
</body>
</html>