// netlify/functions/auth.js
// Verifies admin password on server side — hash never in browser code

const ADMIN_HASH = process.env.ADMIN_HASH;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { hash } = JSON.parse(event.body || '{}');
    if (!hash) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No hash provided' }) };
    }

    const valid = hash === ADMIN_HASH;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ valid })
    };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
  }
};
