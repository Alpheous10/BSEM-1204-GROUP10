// ================================================================
// APP MODULE - UniHub State & Logic
// ================================================================

// Ping the backend on app load to wake Render from sleep.
// This runs silently in the background - no UI impact.
(function pingBackend() {
  fetch(`${CONFIG.BASE_URL}/health`, { method: 'GET' })
    .then(() => console.log('Backend is awake'))
    .catch(() => console.log('Backend waking up...'));
})();

let currentUser = null;
let currentPostImageUrl = null; // Store the uploaded image URL

// ── Initialization ───────────────────────────────────────────────
async function initApp() {
  const token = localStorage.getItem('token');
  const isAuthPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
  
  if (token) {
    try {
      currentUser = await api.users.me();
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      if (isAuthPage) {
        window.location.href = 'central.html';
        return;
      }
      initSearch();
      updateNotifBadge();
    } catch (err) {
      console.error('Failed to fetch user:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      if (!isAuthPage) window.location.href = 'index.html';
    }
  } else {
    if (!isAuthPage) window.location.href = 'index.html';
  }
}

// ── Dashboard Logic ──────────────────────────────────────────────
async function initDashboard() {
  try {
    const dashboard = await api.dashboard.get();
    const user = dashboard.user || currentUser;
    
    // Greeting
    const greetingText = document.getElementById('greeting-text');
    const greetingSub = document.getElementById('greeting-sub');
    if (greetingText) {
      const hour = new Date().getHours();
      let timeOfDay = 'morning';
      if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
      else if (hour >= 17 && hour < 22) timeOfDay = 'evening';
      else if (hour >= 22 || hour < 5) timeOfDay = 'night';
      
      const name = user.full_name || user.username;
      const greetMap = {
        morning: `Good morning, ${name}`,
        afternoon: `Good afternoon, ${name}`,
        evening: `Good evening, ${name}`,
        night: `Working late, ${name}?`
      };
      greetingText.textContent = greetMap[timeOfDay];
      
      const dueCount = dashboard.upcoming_assignments.length;
      const notifCount = dashboard.unread_notifications;
      greetingSub.textContent = `You have ${dueCount} assignments due this week and ${notifCount} new notifications.`;
    }

    // Stats
    document.getElementById('stat-communities').textContent = dashboard.my_communities.length;
    document.getElementById('stat-resources').textContent = dashboard.recent_resources.length;
    document.getElementById('stat-assignments').textContent = dashboard.upcoming_assignments.length;
    document.getElementById('stat-notifs').textContent = dashboard.unread_notifications;

    // My Communities Scroll
    const commScroll = document.getElementById('my-communities-scroll');
    const commNavSection = document.getElementById('my-communities-section');
    const commNavList = document.getElementById('my-communities-nav-list');

    if (commScroll) {
      if (dashboard.my_communities.length === 0) {
        commScroll.innerHTML = `
          <div class="empty-state" style="padding: var(--space-8);">
            <i data-lucide="users"></i>
            <h3>No communities joined</h3>
            <p>Join a community to start collaborating with your peers.</p>
            <button class="btn btn-primary btn-sm" onclick="window.location.href='communities.html'">Browse Communities</button>
          </div>`;
        if (commNavSection) commNavSection.style.display = 'none';
      } else {
        commScroll.innerHTML = dashboard.my_communities.map(c => `
          <div class="community-chip" onclick="window.location.href='community-detail.html?id=${c.id}'">
            <span style="font-size: 1.2em;">${c.icon || '🎓'}</span>
            <span>${esc(c.name)}</span>
          </div>
        `).join('');
        
        if (commNavSection && commNavList) {
          commNavSection.style.display = 'block';
          commNavList.innerHTML = dashboard.my_communities.slice(0, 5).map(c => `
            <a href="community-detail.html?id=${c.id}" class="sidebar-link" style="padding-left: var(--space-6);">
              <span style="font-size: 1.1em; margin-right: var(--space-2);">${c.icon || '🎓'}</span>
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${esc(c.name)}</span>
            </a>
          `).join('');
        }
      }
    }

    // Recent Discussions Feed
    const feedContainer = document.getElementById('dashboard-feed');
    if (feedContainer) {
      if (dashboard.recent_discussions.length === 0) {
        feedContainer.innerHTML = `
          <div class="card empty-state">
            <i data-lucide="message-square"></i>
            <h3>No discussions yet</h3>
            <p>Be the first to start a conversation in your communities or join a new one.</p>
            <div class="flex-center gap-4 mt-4">
              <button class="btn btn-primary" onclick="window.location.href='communities.html'">Browse Communities</button>
              <button class="btn btn-outline" onclick="openCreatePostModal()">Create Post</button>
            </div>
          </div>`;
      } else {
        feedContainer.innerHTML = dashboard.recent_discussions.map(post => renderDiscussionCard(post)).join('');
      }
      initIcons();
    }

    // Right Rail: Upcoming Assignments
    const assignList = document.getElementById('upcoming-assignments-list');
    if (assignList) {
      if (dashboard.upcoming_assignments.length === 0) {
        assignList.innerHTML = '<p class="empty-state">No upcoming assignments.</p>';
      } else {
        assignList.innerHTML = dashboard.upcoming_assignments.map(a => renderAssignmentItem(a)).join('');
      }
    }

    // Right Rail: Recent Resources
    const resList = document.getElementById('recent-resources-list');
    if (resList) {
      if (dashboard.recent_resources.length === 0) {
        resList.innerHTML = '<p class="empty-state">No recent resources.</p>';
      } else {
        resList.innerHTML = dashboard.recent_resources.map(r => renderResourceItem(r)).join('');
      }
    }

    // Right Rail: Announcements
    const annList = document.getElementById('announcements-list');
    if (annList) {
      if (dashboard.announcements.length === 0) {
        annList.innerHTML = '<p class="empty-state">No announcements.</p>';
      } else {
        annList.innerHTML = dashboard.announcements.map(a => `
          <div class="card mb-2" style="padding: var(--space-3);">
            <div class="flex-between mb-1">
              <span class="tag ${a.pinned ? 'tag-orange' : 'tag-gray'}" style="font-size:10px;">${a.pinned ? 'PINNED' : 'PLATFORM'}</span>
              <span style="font-size:10px; color:var(--color-text-subtle);">${formatTimeAgo(a.created_at)}</span>
            </div>
            <div style="font-size:13px; font-weight:var(--font-semibold);">${esc(a.title)}</div>
          </div>
        `).join('');
      }
    }

  } catch (err) {
    console.error('Dashboard init failed:', err);
  }
}

// ── Search Logic ────────────────────────────────────────────────
function initSearch() {
  const searchInput = document.getElementById('global-search');
  if (!searchInput) return;

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      window.location.href = `search.html?q=${encodeURIComponent(searchInput.value)}`;
    }
  });
}

// ── Notifications Logic ──────────────────────────────────────────
async function updateNotifBadge() {
  try {
    const data = await api.notifications.getUnreadCount();
    const badge = document.getElementById('notif-badge');
    if (badge) {
      if (data.count > 0) {
        badge.style.display = 'block';
        badge.title = `${data.count} new notifications`;
      } else {
        badge.style.display = 'none';
      }
    }
  } catch (err) {
    console.error('Failed to update notif badge:', err);
  }
}

// ── Shared Renderers ─────────────────────────────────────────────

function renderDiscussionCard(post) {
  const authorName = post.author ? (post.author.full_name || post.author.username) : 'Anonymous';
  const initials = authorName[0].toUpperCase();
  const communityLabel = post.community_name ? `<span class="tag tag-blue">${esc(post.community_name)}</span>` : '';
  
  return `
    <article class="card discussion-card card-clickable" onclick="window.location.href='post-detail.html?id=${post.id}'">
      <div class="meta" style="display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-xs); color: var(--color-text-muted); margin-bottom: var(--space-3);">
        <div class="topbar-avatar" style="width:24px; height:24px; font-size:10px; border-radius:50%; overflow:hidden;">
          ${post.author?.avatar_url ? `<img src="${post.author.avatar_url}" style="width:100%; height:100%; object-fit:cover;">` : initials}
        </div>
        <span style="font-weight: var(--font-medium); color: var(--color-text);">${esc(authorName)}</span>
        <span>•</span>
        <span>${formatTimeAgo(post.created_at)}</span>
        <span style="margin-left: auto;">${communityLabel}</span>
      </div>
      <h2 style="font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--color-text); margin-bottom: var(--space-2); line-height: var(--leading-tight);">${esc(post.title)}</h2>
      <div style="display:flex; gap:var(--space-4); align-items:flex-start;">
        <p class="preview" style="flex:1; font-size: var(--text-sm); color: var(--color-text-muted); line-height: var(--leading-normal); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${esc(post.content)}</p>
        ${post.image_url ? `<img src="${post.image_url}" style="width:120px; height:120px; object-fit:cover; border-radius:var(--radius-md); cursor:pointer;" onclick="event.stopPropagation(); window.open('${post.image_url}','_blank');">` : ''}
      </div>
      <div class="flex-between" style="margin-top: var(--space-4); padding-top: var(--space-3); border-top: 1px solid var(--color-border);">
        <div style="display:flex; gap:var(--space-6);">
          <span style="display:flex; align-items:center; gap:var(--space-1); font-size:var(--text-xs); color:var(--color-text-muted); cursor: pointer;" onclick="event.stopPropagation(); handleLike(${post.id})">
            <i data-lucide="heart" style="width:16px; height:16px;"></i> <span>${post.like_count || 0}</span>
          </span>
          <span style="display:flex; align-items:center; gap:var(--space-1); font-size:var(--text-xs); color:var(--color-text-muted);">
            <i data-lucide="message-square" style="width:16px; height:16px;"></i> <span>${post.comment_count || 0}</span>
          </span>
        </div>
        <button class="btn btn-ghost btn-sm" style="padding: 0; color: var(--color-primary-600);">Read More</button>
      </div>
    </article>
  `;
}

function renderAssignmentItem(a) {
  const dueDate = new Date(a.due_date);
  const diffDays = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
  let urgentClass = '';
  if (diffDays <= 3) urgentClass = 'soon';
  if (diffDays <= 0) urgentClass = 'urgent';

  return `
    <div class="assignment-item">
      <div class="due-date-badge ${urgentClass}">
        <span class="due-day">${dueDate.getDate()}</span>
        <span class="due-month">${dueDate.toLocaleString('default', { month: 'short' })}</span>
      </div>
      <div style="flex:1; min-width:0;">
        <div style="font-size:13px; font-weight:var(--font-semibold); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(a.title)}</div>
        <div style="font-size:11px; color:var(--color-text-subtle);">${esc(a.community_name || 'Assignment')}</div>
      </div>
    </div>
  `;
}

function renderResourceItem(r) {
  const typeIcons = {
    pdf: 'file-text',
    docx: 'file-text',
    pptx: 'presentation',
    xlsx: 'table',
    png: 'image',
    jpg: 'image'
  };
  const icon = typeIcons[r.file_type.toLowerCase()] || 'file';
  
  return `
    <div class="card card-clickable mb-2" style="padding: var(--space-2) var(--space-3);" onclick="window.open('${api.resources.download(r.id)}', '_blank')">
      <div style="display:flex; align-items:center; gap:var(--space-3);">
        <i data-lucide="${icon}" style="width:18px; height:18px; color:var(--color-primary-500);"></i>
        <div style="flex:1; min-width:0;">
          <div style="font-size:13px; font-weight:var(--font-medium); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(r.title)}</div>
          <div style="font-size:10px; color:var(--color-text-subtle);">${r.file_type.toUpperCase()} • ${(r.file_size / 1024).toFixed(1)} KB</div>
        </div>
        <i data-lucide="download" style="width:14px; height:14px; color:var(--color-text-subtle);"></i>
      </div>
    </div>
  `;
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

  try {
    setLoading(btn, true);
    const data = await api.auth.login(email, password);
    localStorage.setItem('token', data.access_token);
    const user = await api.users.me();
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'central.html';
  } catch (err) {
    showError(errorEl, err.message);
  } finally {
    setLoading(btn, false);
  }
}

async function handleRegister() {
  const form = document.getElementById('register-form');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const errorEl = document.getElementById('register-error');
  const btn = document.getElementById('register-btn');

  try {
    setLoading(btn, true);
    await api.auth.register(data);
    const loginData = await api.auth.login(data.username, data.password);
    localStorage.setItem('token', loginData.access_token);
    const user = await api.users.me();
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'central.html';
  } catch (err) {
    showError(errorEl, err.message);
  } finally {
    setLoading(btn, false);
  }
}

function showError(el, msg) {
  if (!el) return alert(msg);
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 5000);
}

// ── Actions ─────────────────────────────────────────────────────
async function handleLike(postId) {
  try {
    await api.likes.like(postId);
    // Refresh current view if possible
    if (typeof loadPostDetail === 'function') loadPostDetail();
    else if (typeof initDashboard === 'function') initDashboard();
  } catch (err) { console.error('Like failed:', err); }
}

async function openCreatePostModal() {
  const communities = await api.communities.getMy();
  currentPostImageUrl = null; // Reset image URL when opening modal
  
  const modalHtml = `
    <div class="modal-overlay open" id="create-post-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Create New Discussion</h2>
          <i data-lucide="x" class="modal-close" onclick="closeModal('create-post-modal')"></i>
        </div>
        <form id="create-post-form" onsubmit="event.preventDefault(); handleCreatePost();">
          <div class="form-group">
            <label class="form-label">Community</label>
            <select name="community_id" class="form-control" required>
              <option value="">Select a community...</option>
              ${communities.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Title</label>
            <input type="text" name="title" class="form-control" placeholder="What's on your mind?" required>
          </div>
          <div class="form-group">
            <label class="form-label">Content</label>
            <textarea name="content" class="form-control" rows="5" placeholder="Share your thoughts..." required></textarea>
          </div>
          <div class="form-group" id="image-upload-section">
            <label class="form-label">Attach Image (optional)</label>
            <div id="image-drop-zone" style="border:2px dashed var(--color-border); border-radius:var(--radius-md); padding:var(--space-6); text-align:center; cursor:pointer;">
              <i data-lucide="upload-cloud" style="width:32px; height:32px; color:var(--color-text-muted); margin-bottom:var(--space-2);"></i>
              <p style="color:var(--color-text-muted); font-size:var(--text-sm);">Click to select or drag and drop an image</p>
              <input type="file" id="post-image-input" accept="image/*" style="display:none;">
            </div>
            <div id="image-preview-container" style="display:none; margin-top:var(--space-4); position:relative;">
              <img id="post-image-preview" style="width:100%; max-height:200px; object-fit:cover; border-radius:var(--radius-md);">
              <button type="button" id="remove-image-btn" style="position:absolute; top:8px; right:8px; background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-full); width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                <i data-lucide="x" style="width:16px; height:16px;"></i>
              </button>
            </div>
          </div>
          <div class="flex-center mt-4">
            <button type="submit" class="btn btn-primary btn-full" id="create-post-btn">Post Discussion</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  // Add event listeners for image upload
  const dropZone = document.getElementById('image-drop-zone');
  const fileInput = document.getElementById('post-image-input');
  const previewContainer = document.getElementById('image-preview-container');
  const previewImg = document.getElementById('post-image-preview');
  const removeBtn = document.getElementById('remove-image-btn');
  
  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--color-primary-500)'; });
  dropZone.addEventListener('dragleave', () => dropZone.style.borderColor = 'var(--color-border)');
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--color-border)';
    if (e.dataTransfer.files.length) handleImageSelect(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', (e) => { if (e.target.files.length) handleImageSelect(e.target.files[0]); });
  removeBtn.addEventListener('click', handleRemoveImage);
  
  initIcons();
}

async function handleImageSelect(file) {
  const previewContainer = document.getElementById('image-preview-container');
  const previewImg = document.getElementById('post-image-preview');
  const dropZone = document.getElementById('image-drop-zone');
  const createBtn = document.getElementById('create-post-btn');
  
  try {
    setLoading(createBtn, true);
    const result = await api.uploads.postImage(file);
    currentPostImageUrl = result.image_url;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewContainer.style.display = 'block';
      dropZone.style.display = 'none';
    };
    reader.readAsDataURL(file);
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(createBtn, false);
  }
}

function handleRemoveImage() {
  const previewContainer = document.getElementById('image-preview-container');
  const dropZone = document.getElementById('image-drop-zone');
  const fileInput = document.getElementById('post-image-input');
  
  currentPostImageUrl = null;
  previewContainer.style.display = 'none';
  dropZone.style.display = 'block';
  fileInput.value = '';
}

async function handleCreatePost() {
  const form = document.getElementById('create-post-form');
  const btn = document.getElementById('create-post-btn');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  if (currentPostImageUrl) {
    data.image_url = currentPostImageUrl;
  }
  
  try {
    setLoading(btn, true);
    await api.posts.create(data);
    closeModal('create-post-modal');
    if (typeof initDashboard === 'function') initDashboard();
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(btn, false);
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.remove();
}

async function openUploadResourceModal() {
  const communities = await api.communities.getMy();
  
  const modalHtml = `
    <div class="modal-overlay open" id="upload-resource-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Upload Resource</h2>
          <i data-lucide="x" class="modal-close" onclick="closeModal('upload-resource-modal')"></i>
        </div>
        <form id="upload-resource-form" onsubmit="event.preventDefault(); handleUploadResource();">
          <div class="form-group">
            <label class="form-label">Community</label>
            <select name="community_id" class="form-control" required>
              <option value="">Select a community...</option>
              ${communities.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Title</label>
            <input type="text" name="title" class="form-control" placeholder="e.g. Lecture 1 Notes" required>
          </div>
          <div class="form-group">
            <label class="form-label">File</label>
            <input type="file" name="file" class="form-control" required>
          </div>
          <div class="flex-center mt-4">
            <button type="submit" class="btn btn-primary btn-full" id="upload-resource-btn">Upload File</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  initIcons();
}

async function handleUploadResource() {
  const form = document.getElementById('upload-resource-form');
  const btn = document.getElementById('upload-resource-btn');
  const formData = new FormData(form);
  
  try {
    setLoading(btn, true);
    await api.resources.create(formData);
    closeModal('upload-resource-modal');
    if (window.location.pathname.endsWith('resources.html')) {
        if (typeof loadResources === 'function') loadResources();
    } else if (typeof initDashboard === 'function') {
        initDashboard();
    }
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(btn, false);
  }
}

async function openCreateCommunityModal() {
  const modalHtml = `
    <div class="modal-overlay open" id="create-community-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Create New Community</h2>
          <i data-lucide="x" class="modal-close" onclick="closeModal('create-community-modal')"></i>
        </div>
        <form id="create-community-form" onsubmit="event.preventDefault(); handleCreateCommunity();">
          <div class="form-group">
            <label class="form-label">Name</label>
            <input type="text" name="name" class="form-control" placeholder="e.g. Computer Science 101" required>
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea name="description" class="form-control" rows="3" placeholder="What is this community about?"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Icon (Emoji)</label>
            <input type="text" name="icon" class="form-control" placeholder="🎓">
          </div>
          <div class="flex-center mt-4">
            <button type="submit" class="btn btn-primary btn-full" id="create-community-btn">Create Community</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  initIcons();
}

async function handleCreateCommunity() {
  const form = document.getElementById('create-community-form');
  const btn = document.getElementById('create-community-btn');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  try {
    setLoading(btn, true);
    await api.communities.create(data);
    closeModal('create-community-modal');
    if (window.location.pathname.endsWith('communities.html')) {
        if (typeof loadCommunities === 'function') loadCommunities();
    } else if (typeof initDashboard === 'function') {
        initDashboard();
    }
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(btn, false);
  }
}

async function openCreateGroupModal() {
  const communities = await api.communities.getMy();
  
  const modalHtml = `
    <div class="modal-overlay open" id="create-group-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Create Project Group</h2>
          <i data-lucide="x" class="modal-close" onclick="closeModal('create-group-modal')"></i>
        </div>
        <form id="create-group-form" onsubmit="event.preventDefault(); handleCreateGroup();">
          <div class="form-group">
            <label class="form-label">Parent Community</label>
            <select name="community_id" class="form-control" required>
              <option value="">Select a community...</option>
              ${communities.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Group Name</label>
            <input type="text" name="name" class="form-control" placeholder="e.g. Final Year Project Team A" required>
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea name="description" class="form-control" rows="3" placeholder="What is this group working on?"></textarea>
          </div>
          <div class="flex-center mt-4">
            <button type="submit" class="btn btn-primary btn-full" id="create-group-btn">Create Group</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  initIcons();
}

async function handleCreateGroup() {
  const form = document.getElementById('create-group-form');
  const btn = document.getElementById('create-group-btn');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  try {
    setLoading(btn, true);
    await api.projectGroups.create(data);
    closeModal('create-group-modal');
    if (window.location.pathname.endsWith('project-groups.html')) {
        if (typeof loadGroups === 'function') loadGroups();
    } else if (typeof initDashboard === 'function') {
        initDashboard();
    }
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(btn, false);
  }
}

async function openAssignmentDetail(id) {
  try {
    const a = await api.assignments.get(id);
    const dueDate = new Date(a.due_date);
    
    const modalHtml = `
      <div class="modal-overlay open" id="assignment-detail-modal">
        <div class="modal-container">
          <div class="modal-header">
            <h2>Assignment Detail</h2>
            <i data-lucide="x" class="modal-close" onclick="closeModal('assignment-detail-modal')"></i>
          </div>
          <div style="margin-bottom: var(--space-6);">
            <h3 style="font-size: var(--text-lg); margin-bottom: var(--space-2);">${esc(a.title)}</h3>
            <div class="tag tag-blue mb-4">${esc(a.community_name || 'General')}</div>
            <p style="color: var(--color-text-muted); line-height: var(--leading-normal); margin-bottom: var(--space-4);">
              ${esc(a.description || 'No description provided.')}
            </p>
            <div class="flex-between" style="background: var(--color-surface-2); padding: var(--space-4); border-radius: var(--radius-md);">
              <div>
                <div style="font-size: var(--text-xs); color: var(--color-text-muted); text-transform: uppercase;">Due Date</div>
                <div style="font-weight: var(--font-bold);">${dueDate.toLocaleDateString()} ${dueDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              </div>
              <div>
                <div style="font-size: var(--text-xs); color: var(--color-text-muted); text-transform: uppercase;">Status</div>
                <div style="font-weight: var(--font-bold); color: ${a.completed ? 'var(--color-success-500)' : 'var(--color-danger-500)'};">
                  ${a.completed ? 'Completed' : 'Pending'}
                </div>
              </div>
            </div>
          </div>
          <div class="flex-center gap-4">
            ${!a.completed ? `<button class="btn btn-primary btn-full" onclick="handleMarkDone(${a.id}); closeModal('assignment-detail-modal');">Mark as Done</button>` : ''}
            <button class="btn btn-outline btn-full" onclick="closeModal('assignment-detail-modal')">Close</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    initIcons();
  } catch (err) {
    alert(err.message);
  }
}

async function handleMarkDone(id) {
  try {
    await api.assignments.update(id, { completed: true });
    if (typeof loadAssignments === 'function') loadAssignments();
  } catch (err) { alert(err.message); }
}

function setLoading(btn, isLoading) {
  if (isLoading) {
    btn.disabled = true;
    btn.dataset.oldText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner" style="display:inline-block; width:12px; height:12px; border:2px solid white; border-top-color:transparent; border-radius:50%; animation: spin 1s linear infinite; margin-right:8px;"></span>...';
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.oldText || 'Submit';
  }
}

// Add spin animation to styles
const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(style);

// ── Global Initializer ────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
