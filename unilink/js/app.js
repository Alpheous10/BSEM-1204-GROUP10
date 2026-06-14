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
    const dashboard = await api.dashboard.get();
    const { user, my_communities, upcoming_assignments, recent_resources, recent_discussions, announcements, unread_notifications } = dashboard;

    // Update welcome banner
    const welcomeH2 = document.querySelector('.welcome-banner h2');
    if (welcomeH2 && user) {
      const displayName = user.full_name || user.username;
      welcomeH2.textContent = `Good morning, ${displayName}`;
    }

    // Update Profile Mini
    const profileUser = document.getElementById('profile-username');
    const profileBio = document.getElementById('profile-bio');
    const profileAvatar = document.getElementById('profile-avatar');
    const topAvatar = document.getElementById('top-avatar');
    
    if (currentUser) {
      const displayName = user.full_name || currentUser.username;
      if (profileUser) profileUser.textContent = displayName;
      if (profileBio) profileBio.textContent = currentUser.bio || 'UniLink Member';
      const initials = (user.full_name || currentUser.username)[0].toUpperCase();
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

    // Render dashboard content
    renderRecentDiscussions(recent_discussions);
    renderMyCommunities(my_communities);
    renderUpcomingAssignments(upcoming_assignments);
    renderRecentResources(recent_resources);
    renderAnnouncements(announcements);
    renderUnreadNotifications(unread_notifications);
    
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

function renderMyCommunities(communities) {
  const container = document.getElementById('my-communities-container');
  if (!container) return;

  if (!communities || communities.length === 0) {
    container.innerHTML = '<p class="empty-state">No communities joined yet.</p>';
    return;
  }

  container.innerHTML = communities.map(c => `
    <div class="community-mini-card" onclick="window.location.href='community-detail.html?id=${c.id}'">
      <div class="comm-icon-small">${c.icon || '🎓'}</div>
      <div class="comm-info-small">
        <div class="comm-name-small">${esc(c.name)}</div>
        <div class="comm-meta-small">${c.member_count} members</div>
      </div>
    </div>
  `).join('');
}

function renderUpcomingAssignments(assignments) {
  const container = document.getElementById('assignments-container');
  if (!container) return;

  if (!assignments || assignments.length === 0) {
    container.innerHTML = '<p class="empty-state">No upcoming assignments.</p>';
    return;
  }

  container.innerHTML = assignments.map(a => `
    <div class="assignment-item">
      <div class="assign-date">
        <span class="day">${new Date(a.due_date).getDate()}</span>
        <span class="month">${new Date(a.due_date).toLocaleString('default', { month: 'short' })}</span>
      </div>
      <div class="assign-details">
        <div class="assign-title">${esc(a.title)}</div>
        <div class="assign-meta">Due ${new Date(a.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    </div>
  `).join('');
}

function renderRecentResources(resources) {
  const container = document.getElementById('resources-container');
  if (!container) return;

  if (!resources || resources.length === 0) {
    container.innerHTML = '<p class="empty-state">No recent resources.</p>';
    return;
  }

  container.innerHTML = resources.map(r => `
    <div class="resource-item" onclick="window.open('${api.resources.download(r.id)}', '_blank')">
      <div class="res-icon">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
      </div>
      <div class="res-info">
        <div class="res-name">${esc(r.title)}</div>
        <div class="res-meta">${r.file_type.toUpperCase()} · ${(r.file_size / 1024).toFixed(1)} KB</div>
      </div>
    </div>
  `).join('');
}

function renderAnnouncements(announcements) {
  const container = document.getElementById('announcements-container');
  if (!container) return;

  if (!announcements || announcements.length === 0) {
    container.innerHTML = '<p class="empty-state">No announcements.</p>';
    return;
  }

  container.innerHTML = announcements.map(a => `
    <div class="announcement-card ${a.pinned ? 'pinned' : ''}">
      <div class="ann-header">
        ${a.pinned ? '<span class="pin-badge"><svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M16 5h.01M7 21l3-3h8V5H6v13l1 3z"/></svg> Pinned</span>' : ''}
        <span class="ann-date">${formatTimeAgo(a.created_at)}</span>
      </div>
      <div class="ann-title">${esc(a.title)}</div>
      <div class="ann-content">${esc(a.content)}</div>
    </div>
  `).join('');
}

function renderUnreadNotifications(count) {
  const badge = document.getElementById('notif-badge');
  if (!badge) return;
  
  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : count;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

// Community helpers
function getRandomGradient() {
  const gradients = [
    'linear-gradient(135deg,#3B5BDB,#748FFC)',
    'linear-gradient(135deg,#7950F2,#9B7FFF)',
    'linear-gradient(135deg,#2F9E44,#51CF66)',
    'linear-gradient(135deg,#E67700,#FFA94D)',
    'linear-gradient(135deg,#C92A2A,#FF6B6B)',
    'linear-gradient(135deg,#1971C2,#4DABF7)',
    'linear-gradient(135deg,#495057,#868E96)',
    'linear-gradient(135deg,#862E9C,#CC5DE8)',
    'linear-gradient(135deg,#087F5B,#20C997)',
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}

function getRandomIcon() {
  const icons = ['📚', '💻', '🎓', '🔬', '🌐', '📊', '🤖', '🎯', '✨'];
  return icons[Math.floor(Math.random() * icons.length)];
}

function renderCommunityCard(community, isJoined = false) {
  const gradient = getRandomGradient();
  const icon = community.icon || getRandomIcon();
  const bgColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}15`;
  
  return `
    <div class="comm-card" onclick="window.location.href='community-detail.html?id=${community.id}'" style="cursor:pointer;">
      <div class="comm-card-banner" style="background:${gradient}"></div>
      <div class="comm-card-body">
        <div class="comm-icon" style="background:${bgColor}">${icon}</div>
        <div class="comm-name">${esc(community.name)}</div>
        <div class="comm-desc">${esc(community.description || 'No description available')}</div>
        <div class="comm-meta">
          <div class="comm-stats">
            <span class="comm-stat"><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72"/></svg>${community.member_count || 0}</span>
          </div>
          ${isJoined ? '<span class="tag tag-blue">Joined</span>' : `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); joinCommunity(${community.id}, this)">Join</button>`}
        </div>
      </div>
    </div>
  `;
}

function renderCommunities(containerId, communities, isJoined = false) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  if (!communities || communities.length === 0) {
    container.innerHTML = '<p class="empty-state">No communities found</p>';
    return;
  }
  
  container.innerHTML = communities.map(c => renderCommunityCard(c, isJoined)).join('');
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
