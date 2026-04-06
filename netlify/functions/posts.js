// netlify/functions/posts.js
// All sensitive keys stay here on server — never exposed to browser

const BIN_ID  = process.env.JSONBIN_BIN_ID;
const API_KEY = process.env.JSONBIN_API_KEY;
const ADMIN_HASH = process.env.ADMIN_HASH;

const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Hash',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const method = event.httpMethod;

  // ── GET — fetch all posts (public, no auth needed) ──
  if (method === 'GET') {
    try {
      const res = await fetch(`${JSONBIN_URL}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
      });
      const data = await res.json();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ posts: data.record?.posts || [] })
      };
    } catch (e) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to load posts' }) };
    }
  }

  // ── POST / PUT / DELETE — admin only, verify hash ──
  const clientHash = event.headers['x-admin-hash'];
  if (!clientHash || clientHash !== ADMIN_HASH) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const body = JSON.parse(event.body || '{}');

  // PUT — save updated posts array
  if (method === 'PUT') {
    try {
      const res = await fetch(JSONBIN_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
        body: JSON.stringify({ posts: body.posts })
      });
      const data = await res.json();
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } catch (e) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to save' }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
};
