// ================================================================
// APP MODULE - UniLink State & Logic
// ================================================================

// ── Global State ──────────────────────────────────────────────────
let currentUser = null;

// ── Initialization ───────────────────────────────────────────────
async function initApp() {
  const token = localStorage.getItem('token');
  const isAuthPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
  
  if (token) {
    try {
      currentUser = await api.users.me();
      if (isAuthPage) {
        window.location.href = 'dashboard.html';
        return;
      }
      // Render dynamic sidebar
      const mount = document.getElementById('sidebar-mount');
      if (mount) {
        const activePage = mount.dataset.active || 'dashboard';
        mount.outerHTML = renderNav(activePage, currentUser);
      }
      
      // Load page specific data
      if (window.location.pathname.includes('dashboard.html')) {
        loadDashboardData();
      } else if (window.location.pathname.includes('communities.html')) {
        loadCommunitiesData();
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      localStorage.removeItem('token');
      if (!isAuthPage) window.location.href = 'index.html';
    }
  } else {
    if (!isAuthPage) window.location.href = 'index.html';
  }
}

// ── Dashboard Data ──────────────────────────────────────────────

async function loadDashboardData() {
  try {
    // Update welcome banner
    const welcomeH2 = document.querySelector('.welcome-banner h2');
    if (welcomeH2 && currentUser) {
      welcomeH2.textContent = `Good morning, ${currentUser.username}`;
    }

    // Update Profile Mini
    const profileUser = document.getElementById('profile-username');
    const profileBio = document.getElementById('profile-bio');
    const profileAvatar = document.getElementById('profile-avatar');
    const topAvatar = document.getElementById('top-avatar');
    
    if (currentUser) {
      if (profileUser) profileUser.textContent = currentUser.username;
      if (profileBio) profileBio.textContent = currentUser.bio || 'UniLink Member';
      const initials = currentUser.username[0].toUpperCase();
      if (profileAvatar) profileAvatar.textContent = initials;
      if (topAvatar) topAvatar.textContent = initials;
    }

    // Fetch User Stats (followers, following, posts)
    if (currentUser) {
      const fullUser = await api.users.getUser(currentUser.id);
      document.getElementById('stat-followers').textContent = fullUser.follower_count || 0;
      document.getElementById('stat-following').textContent = fullUser.following_count || 0;
      
      const userPosts = await api.users.getUserPosts(currentUser.id);
      document.getElementById('stat-posts').textContent = userPosts.length || 0;
    }

    // Fetch actual posts for "Recent Discussions"
    const posts = await api.posts.getAll(0, 5);
    renderRecentDiscussions(posts);
    
  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
}

function renderRecentDiscussions(posts) {
  const container = document.getElementById('discussions-container');
  if (!container) return;
  
  if (!posts || posts.length === 0) {
    container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--gray-500);">No recent discussions found.</p>';
    return;
  }

  container.innerHTML = posts.map(post => {
    const authorName = post.author ? post.author.username : `User ${post.user_id}`;
    const initials = authorName[0].toUpperCase();
    const timeAgo = formatTimeAgo(post.created_at);
    return `
      <div class="discussion-item" onclick="window.location.href='post-detail.html?id=${post.id}'" style="cursor: pointer;">
        <div class="disc-avatar">${initials}</div>
        <div class="disc-body">
          <div class="disc-title">${esc(post.title)}</div>
          <div class="disc-meta">${esc(authorName)} · ${timeAgo}</div>
          <div class="disc-reactions">
            <span class="disc-reaction">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.253m0 0H3.75"/></svg>
              ${post.like_count || 0} Likes
            </span>
            <span class="disc-reaction">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/></svg>
              ${post.comment_count || 0} Replies
            </span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ── Utils ───────────────────────────────────────────────────────

function esc(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

// ── Auth Handlers ────────────────────────────────────────────────

async function handleLogin() {
  const email = document.getElementById('l-email').value;
  const password = document.getElementById('l-password').value;
  const errorEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');

  if (!email || !password) {
    showError(errorEl, 'Please fill in all fields');
    return;
  }

  try {
    setLoading(btn, true);
    const data = await api.auth.login(email, password);
    localStorage.setItem('token', data.access_token);
    window.location.href = 'dashboard.html';
  } catch (err) {
    showError(errorEl, err.message);
  } finally {
    setLoading(btn, false);
  }
}

async function handleRegister() {
  const username = document.getElementById('r-username').value;
  const email = document.getElementById('r-email').value;
  const password = document.getElementById('r-password').value;
  const errorEl = document.getElementById('register-error');
  const btn = document.getElementById('register-btn');

  if (!username || !email || !password) {
    showError(errorEl, 'Please fill in all fields');
    return;
  }

  try {
    setLoading(btn, true);
    await api.auth.register({
      email,
      username,
      password
    });
    
    // Auto login after registration
    const loginData = await api.auth.login(username, password);
    localStorage.setItem('token', loginData.access_token);
    window.location.href = 'dashboard.html';
  } catch (err) {
    showError(errorEl, err.message);
  } finally {
    setLoading(btn, false);
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

// ── UI Helpers ──────────────────────────────────────────────────

function showError(el, msg) {
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => {
    el.style.display = 'none';
  }, 5000);
}

function setLoading(btn, isLoading) {
  if (isLoading) {
    btn.disabled = true;
    btn.dataset.oldText = btn.textContent;
    btn.textContent = 'Processing...';
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.oldText || 'Submit';
  }
}

// ── Shared Page Logic ───────────────────────────────────────────

function updateSidebarUser(user) {
  const avatarEl = document.querySelector('.sidebar-footer .topbar-avatar');
  const nameEl = document.querySelector('.sidebar-footer .name'); // This class might be missing in current nav.js, let's fix it later if needed
  const roleEl = document.querySelector('.sidebar-footer .role');

  if (avatarEl) avatarEl.textContent = user.full_name ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : user.username[0].toUpperCase();
  // We'll need to update nav.js to have better selectors for these
}

// Run init on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
