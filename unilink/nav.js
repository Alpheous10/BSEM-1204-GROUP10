
function renderNav(activePage, user = null) {
  const pages = [
    { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: `<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>` },
    { id: 'profile', label: 'My Profile', href: 'profile.html', icon: `<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>` },
  ];

  const displayName = user ? user.username : 'Guest User';
  const displayRole = user ? (user.bio || 'UniLink Member') : 'Sign in to join';
  const initials = user ? user.username[0].toUpperCase() : '?';

  return `
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="logo-mark">U</div>
      <span class="logo-text">UniLink</span>
    </div>

    <div class="sidebar-nav">
      ${pages.map(p => `
        <a href="${p.href}" class="sidebar-link ${p.id === activePage ? 'active' : ''}">
          <span>${p.icon}</span>
          ${p.label}
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
        </a>
      `).join('')}
    </div>

    <div class="sidebar-footer">
      <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;">
        <div class="topbar-avatar" style="width:36px;height:36px;font-size:13px;">${initials}</div>
        <div style="flex:1;min-width:0;">
          <div class="name" style="font-size:14px;font-weight:600;color:#fff;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${displayName}</div>
          <div class="role" style="font-size:12px;color:rgba(255,255,255,0.6);">${displayRole}</div>
        </div>
        <button onclick="handleLogout()" style="background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;" title="Logout">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/></svg>
        </button>
      </div>
    </div>
  </aside>`;
}
