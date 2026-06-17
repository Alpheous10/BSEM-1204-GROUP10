function renderNav(activePage, user = null) {
  const primaryPages = [
    { id: 'dashboard', label: 'Central', href: 'central.html', icon: 'home' },
    { id: 'communities', label: 'Communities', href: 'communities.html', icon: 'users' },
    { id: 'resources', label: 'Resources', href: 'resources.html', icon: 'folder' },
    { id: 'assignments', label: 'Assignments', href: 'assignments.html', icon: 'clipboard' },
    { id: 'project-groups', label: 'Project Groups', href: 'project-groups.html', icon: 'layers' },
  ];

  const displayName = user ? (user.full_name || user.username) : 'Guest User';
  const initials = user ? (user.full_name || user.username)[0].toUpperCase() : '?';

  return `
  <nav class="topbar">
    <div class="topbar-left">
      <a href="central.html" class="topbar-logo">
        <img src="logo/unihub.png" alt="U" class="logo-mark" style="object-fit: cover;">
        <span class="logo-text">UniHub</span>
      </a>
    </div>
    
    <div class="topbar-search">
      <i data-lucide="search" class="search-icon" style="width:18px; height:18px;"></i>
      <input type="text" placeholder="Search communities, posts, people..." id="global-search">
    </div>

    <div class="topbar-actions">
      <button class="icon-btn" id="theme-toggle" title="Toggle Theme">
        <i data-lucide="sun" style="width:20px; height:20px;"></i>
      </button>
      <button class="icon-btn" id="notif-btn" title="Notifications">
        <i data-lucide="bell" style="width:20px; height:20px;"></i>
        <span class="badge" id="notif-badge" style="display:none; position:absolute; top:8px; right:8px; width:8px; height:8px; background:var(--color-danger-500); border-radius:50%; border:2px solid var(--color-surface);"></span>
      </button>
      <div class="topbar-avatar" onclick="window.location.href='profile.html'" title="View Profile">
        ${user?.avatar_url ? `<img src="${user.avatar_url}" alt="" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">` : initials}
      </div>
    </div>
  </nav>

  <aside class="sidebar">
    <div class="sidebar-nav">
      ${primaryPages.map(p => `
        <a href="${p.href}" class="sidebar-link ${p.id === activePage ? 'active' : ''}">
          <i data-lucide="${p.icon}" style="width:18px; height:18px;"></i>
          <span>${p.label}</span>
        </a>
      `).join('')}
      
      <div id="my-communities-section" style="display:none;">
        <div class="sidebar-section-label">My Communities</div>
        <div id="my-communities-nav-list"></div>
      </div>
    </div>

    <div class="sidebar-footer">
      <a href="profile.html" class="sidebar-link ${activePage === 'profile' ? 'active' : ''}">
        <i data-lucide="user" style="width:18px; height:18px;"></i>
        <span>My Profile</span>
      </a>
      <a href="settings.html" class="sidebar-link ${activePage === 'settings' ? 'active' : ''}">
        <i data-lucide="settings" style="width:18px; height:18px;"></i>
        <span>Settings</span>
      </a>
      <button onclick="handleLogout()" class="sidebar-link" style="width:100%; border:none; background:none; cursor:pointer; font-family:inherit;">
        <i data-lucide="log-out" style="width:18px; height:18px;"></i>
        <span>Logout</span>
      </button>
    </div>
  </aside>`;
}

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// Initialize Lucide icons after navigation is rendered
function initIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}
