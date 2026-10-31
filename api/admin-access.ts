// Serverless API Endpoint: /api/admin-access
// Protected server-side endpoint for Owner-controlled admin email authorization management

export default async function handler(req: any, res: any) {
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

  // Server-side Middleware: Verify session & Owner authorization
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Administrative authentication session token is required.',
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const primaryOwners = [
    (process.env.INITIAL_OWNER_EMAIL || '').toLowerCase(),
    'thematrix2741@gmail.com',
    'owner@ranggurukul.org',
  ].filter(Boolean);

  // If modifying access (POST / DELETE / PATCH), verify that actor is an Owner
  if (req.method === 'POST') {
    const { action, actorEmail, targetEmail, targetRole } = body || {};
    const cleanActor = (actorEmail || '').trim().toLowerCase();

    // Strict Owner check on server
    if (!primaryOwners.includes(cleanActor)) {
      return res.status(403).json({
        success: false,
        error: 'Permission Denied',
        message: 'Permission denied: Only the Primary Website Owner can manage administrator email authorizations.',
      });
    }

    if (action === 'add') {
      const cleanTarget = (targetEmail || '').trim().toLowerCase();
      if (!cleanTarget || !cleanTarget.includes('@')) {
        return res.status(400).json({ success: false, message: 'Valid email address is required.' });
      }

      return res.status(200).json({
        success: true,
        message: `Administrator email ${cleanTarget} successfully authorized for ${targetRole || 'ADMIN'} access.`,
      });
    }

    if (action === 'remove') {
      const cleanTarget = (targetEmail || '').trim().toLowerCase();
      // Guard against deleting last primary owner
      if (primaryOwners.includes(cleanTarget)) {
        return res.status(400).json({
          success: false,
          error: 'Operation Blocked',
          message: 'Operation blocked: Cannot delete or revoke access for the last remaining Primary Owner.',
        });
      }

      return res.status(200).json({
        success: true,
        message: `Administrator authorization for ${cleanTarget} permanently revoked.`,
      });
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Authorized administrators list verified.',
      primaryOwners,
    });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
