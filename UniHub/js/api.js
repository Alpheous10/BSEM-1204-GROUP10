

// ================================================================
// API MODULE
// All communication with the backend goes through this file.
// Base URL points to the FastAPI server.
// ================================================================

const BASE_URL = CONFIG.BASE_URL;

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

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, options);
  } catch (err) {
    throw new Error('Could not connect to the server. Please ensure the backend is running on port 8002.');
  }

  if (res.status === 204) return null;

  let data;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    if (!res.ok) throw new Error(text || `Error ${res.status}: ${res.statusText}`);
    return text;
  }

  if (!res.ok) {
    let msg = 'Something went wrong';
    if (data && data.detail) {
      if (Array.isArray(data.detail)) {
        msg = data.detail.map(e => typeof e === 'object' ? (e.msg || JSON.stringify(e)) : e).join(', ');
      } else if (typeof data.detail === 'object') {
        msg = data.detail.msg || JSON.stringify(data.detail);
      } else {
        msg = data.detail;
      }
    } else {
      msg = `Error ${res.status}: ${res.statusText}`;
    }
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
  
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, { method: 'POST', headers, body });
  } catch (err) {
    throw new Error('Could not connect to the server. Please ensure the backend is running on port 8002.');
  }

  let data;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    if (!res.ok) throw new Error(text || `Login failed: ${res.status} ${res.statusText}`);
    return text;
  }

  if (!res.ok) {
    let msg = 'Login failed';
    if (data && data.detail) {
      if (Array.isArray(data.detail)) {
        msg = data.detail.map(e => typeof e === 'object' ? (e.msg || JSON.stringify(e)) : e).join(', ');
      } else if (typeof data.detail === 'object') {
        msg = data.detail.msg || JSON.stringify(data.detail);
      } else {
        msg = data.detail;
      }
    } else {
      msg = `Error ${res.status}: ${res.statusText}`;
    }
    throw new Error(msg);
  }
  return data;
}

// ── File upload request ──────────────────────────────────────────
async function uploadFile(path, file) {
  const token = getToken();
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Upload failed');
  return data;
}

// ================================================================
// API METHODS
// ================================================================
const api = {

  auth: {
    register : (data)             => request('POST', '/auth/register', data),
    login    : (username, password) => formRequest('/auth/login', { username, password }),
    logout   : ()                 => localStorage.removeItem('token'),
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
    getAll : (skip = 0, limit = 10, communityId = null, projectGroupId = null) => {
      let url = `/posts/?skip=${skip}&limit=${limit}`;
      if (communityId !== null) url += `&community_id=${communityId}`;
      if (projectGroupId !== null) url += `&project_group_id=${projectGroupId}`;
      return request('GET', url);
    },
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
    communities : (q, skip = 0, limit = 10) =>
              request('GET', `/search/communities?q=${encodeURIComponent(q)}&skip=${skip}&limit=${limit}`),
  },

  communities: {
    getAll: (skip = 0, limit = 10) => request('GET', `/communities/?skip=${skip}&limit=${limit}`),
    getMy: () => request('GET', `/communities/mine`),
    get: (id) => request('GET', `/communities/${id}`),
    create: (data) => request('POST', '/communities/', data),
    join: (id) => request('POST', `/communities/${id}/join`),
    leave: (id) => request('DELETE', `/communities/${id}/leave`),
    getMembers: (id) => request('GET', `/communities/${id}/members`),
  },

  resources: {
    getAll: (skip = 0, limit = 10, communityId = null) => {
      let url = `/resources/?skip=${skip}&limit=${limit}`;
      if (communityId !== null) url += `&community_id=${communityId}`;
      return request('GET', url);
    },
    get: (id) => request('GET', `/resources/${id}`),
    download: (id) => `${BASE_URL}/resources/${id}/download`,
    create: async (formData) => {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${BASE_URL}/resources/`, {
        method: 'POST',
        headers,
        body: formData,
      });
      if (!res.ok) {
        let text = await res.text();
        throw new Error(text);
      }
      return res.json();
    },
    delete: (id) => request('DELETE', `/resources/${id}`),
  },

  assignments: {
    getAll: (skip = 0, limit = 10, communityId = null, upcoming = false) => {
      let url = `/assignments/?skip=${skip}&limit=${limit}`;
      if (communityId !== null) url += `&community_id=${communityId}`;
      if (upcoming) url += `&upcoming=true`;
      return request('GET', url);
    },
    get: (id) => request('GET', `/assignments/${id}`),
    create: (data) => request('POST', '/assignments/', data),
    update: (id, data) => request('PUT', `/assignments/${id}`, data),
    delete: (id) => request('DELETE', `/assignments/${id}`),
  },

  projectGroups: {
    getAll: (skip = 0, limit = 10) => request('GET', `/project-groups/?skip=${skip}&limit=${limit}`),
    getMy: () => request('GET', `/project-groups/mine`),
    get: (id) => request('GET', `/project-groups/${id}`),
    create: (data) => request('POST', '/project-groups/', data),
    join: (id) => request('POST', `/project-groups/${id}/join`),
    leave: (id) => request('DELETE', `/project-groups/${id}/leave`),
    getMembers: (id) => request('GET', `/project-groups/${id}/members`),
  },

  announcements: {
    getAll: (skip = 0, limit = 10, communityId = null) => {
      let url = `/announcements/?skip=${skip}&limit=${limit}`;
      if (communityId !== null) url += `&community_id=${communityId}`;
      return request('GET', url);
    },
    create: (data) => request('POST', '/announcements/', data),
    delete: (id) => request('DELETE', `/announcements/${id}`),
  },

  notifications: {
    getAll: (skip = 0, limit = 20) => request('GET', `/notifications/?skip=${skip}&limit=${limit}`),
    getUnreadCount: () => request('GET', `/notifications/unread-count`),
    markRead: (id) => request('PUT', `/notifications/${id}/read`),
    markAllRead: () => request('PUT', `/notifications/read-all`),
  },

  dashboard: {
    get: () => request('GET', '/dashboard/'),
  },

  uploads: {
    avatar: (file) => uploadFile('/users/me/avatar', file),
    postImage: (file) => uploadFile('/posts/upload-image', file),
  },
};
