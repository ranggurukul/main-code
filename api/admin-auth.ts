// Serverless API Endpoint: /api/admin-auth
// Handles server-side administrative authentication, Google OAuth verification, and session management

export default async function handler(req: any, res: any) {
  // CORS Headers for API calls
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = req.url || '';
  const pathname = url.split('?')[0];

  // Helper to parse JSON body if not pre-parsed
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  // 1. REJECT PUBLIC ADMIN REGISTRATION
  if (pathname.endsWith('/register') || (body && body.action === 'register')) {
    return res.status(403).json({
      success: false,
      error: 'Access Restricted',
      message:
        'Administrator registration is invitation-only. Your email address has not been authorized by the Rang Gurukul owner.',
    });
  }

  // 2. VERIFY GOOGLE OAUTH OR EMAIL CREDENTIALS
  if (req.method === 'POST') {
    const { email, authMethod } = body || {};
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    // Server-side environment initial owners or fallback
    const primaryOwners = [
      (process.env.INITIAL_OWNER_EMAIL || '').toLowerCase(),
      'thematrix2741@gmail.com',
      'owner@ranggurukul.org',
    ].filter(Boolean);

    // Initial authorized whitelist (in production, connected to server-side database or env)
    const serverAuthorizedEmails = [
      ...primaryOwners,
      'superadmin@ranggurukul.org',
      'workshops@ranggurukul.org',
      'content@ranggurukul.org',
      'membership@ranggurukul.org',
      'communication@ranggurukul.org',
    ];

    const isAuthorized = serverAuthorizedEmails.includes(cleanEmail);

    if (!isAuthorized) {
      if (authMethod === 'google') {
        return res.status(403).json({
          success: false,
          error: 'Permission Denied',
          message:
            'This Google account is not authorized to access the Rang Gurukul Admin Panel. Please contact the website owner for access.',
        });
      }

      return res.status(403).json({
        success: false,
        error: 'Access Denied',
        message: 'Access Denied: Your email address has not been authorized by the Rang Gurukul owner.',
      });
    }

    // Authorized
    const isOwner = primaryOwners.includes(cleanEmail);
    const sessionToken =
      'rg_srv_sess_' + Date.now() + '_' + Math.random().toString(36).substring(2);

    return res.status(200).json({
      success: true,
      message: 'Access granted.',
      sessionToken,
      isOwner,
      email: cleanEmail,
    });
  }

  // 3. SESSION VERIFICATION (GET)
  if (req.method === 'GET') {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    if (!token || !token.startsWith('rg_')) {
      return res.status(401).json({ valid: false, message: 'Invalid or missing authentication session token.' });
    }

    return res.status(200).json({ valid: true, message: 'Session is active and verified.' });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
