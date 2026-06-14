// ================================================================
// API MODULE
// All communication with the backend goes through this file.
// Base URL points to the FastAPI server.
// ================================================================

const BASE_URL = 'http://localhost:8002';

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

// ================================================================
// API METHODS
// ================================================================
const api = {

  auth: {
    register : (data)             => request('POST', '/auth/register', data),
    login    : (username, password) => formRequest('/auth/login', { username, password }),
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
    getAll : (skip = 0, limit = 10) => request('GET',    `/posts/?skip=${skip}&limit=${limit}`),
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
  },
};
