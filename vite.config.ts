import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const apiDevMiddlewarePlugin = () => ({
  name: 'api-dev-middleware',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      const url = req.url || '';
      if (!url.startsWith('/api/')) {
        return next();
      }

      // 1. /api/admin-auth
      if (url.startsWith('/api/admin-auth')) {
        let rawBody = '';
        req.on('data', (chunk: any) => {
          rawBody += chunk;
        });
        req.on('end', () => {
          let body: any = {};
          try {
            body = JSON.parse(rawBody);
          } catch {}

          res.setHeader('Content-Type', 'application/json');

          if (url.includes('/register') || body.action === 'register') {
            res.statusCode = 403;
            res.end(
              JSON.stringify({
                success: false,
                error: 'Access Restricted',
                message:
                  'Administrator registration is invitation-only. Your email address has not been authorized by the Rang Gurukul owner.',
              })
            );
            return;
          }

          if (req.method === 'POST') {
            const { email, authMethod } = body || {};
            const cleanEmail = (email || '').trim().toLowerCase();
            const authorized = [
              'thematrix2741@gmail.com',
              'owner@ranggurukul.org',
              'superadmin@ranggurukul.org',
              'workshops@ranggurukul.org',
              'content@ranggurukul.org',
              'membership@ranggurukul.org',
              'communication@ranggurukul.org',
            ];

            if (!authorized.includes(cleanEmail)) {
              res.statusCode = 403;
              if (authMethod === 'google') {
                res.end(
                  JSON.stringify({
                    success: false,
                    error: 'Permission Denied',
                    message:
                      'This Google account is not authorized to access the Rang Gurukul Admin Panel. Please contact the website owner for access.',
                  })
                );
                return;
              }
              res.end(
                JSON.stringify({
                  success: false,
                  error: 'Access Denied',
                  message: 'Access Denied: Your email address has not been authorized by the Rang Gurukul owner.',
                })
              );
              return;
            }

            res.statusCode = 200;
            res.end(
              JSON.stringify({
                success: true,
                message: 'Access granted.',
                sessionToken: 'rg_dev_sess_' + Date.now(),
                isOwner: cleanEmail === 'thematrix2741@gmail.com' || cleanEmail === 'owner@ranggurukul.org',
              })
            );
            return;
          }

          if (req.method === 'GET') {
            const authHeader = req.headers['authorization'] || '';
            if (!authHeader.startsWith('Bearer rg_')) {
              res.statusCode = 401;
              res.end(JSON.stringify({ valid: false, message: 'Invalid session.' }));
              return;
            }
            res.statusCode = 200;
            res.end(JSON.stringify({ valid: true, message: 'Session is active.' }));
            return;
          }

          res.statusCode = 405;
          res.end(JSON.stringify({ message: 'Method Not Allowed' }));
        });
        return;
      }

      // 2. /api/admin-access
      if (url.startsWith('/api/admin-access')) {
        let rawBody = '';
        req.on('data', (chunk: any) => {
          rawBody += chunk;
        });
        req.on('end', () => {
          let body: any = {};
          try {
            body = JSON.parse(rawBody);
          } catch {}
          res.setHeader('Content-Type', 'application/json');

          const authHeader = req.headers['authorization'] || '';
          if (!authHeader) {
            res.statusCode = 401;
            res.end(JSON.stringify({ success: false, message: 'Session token required.' }));
            return;
          }

          const { actorEmail, action, targetEmail } = body || {};
          const cleanActor = (actorEmail || '').trim().toLowerCase();
          const owners = ['thematrix2741@gmail.com', 'owner@ranggurukul.org'];

          if (req.method === 'POST') {
            if (!owners.includes(cleanActor)) {
              res.statusCode = 403;
              res.end(
                JSON.stringify({
                  success: false,
                  error: 'Permission Denied',
                  message:
                    'Permission denied: Only the Primary Website Owner can manage administrator email authorizations.',
                })
              );
              return;
            }

            if (action === 'remove' && owners.includes((targetEmail || '').toLowerCase())) {
              res.statusCode = 400;
              res.end(
                JSON.stringify({
                  success: false,
                  error: 'Operation Blocked',
                  message: 'Operation blocked: Cannot delete or revoke access for the last remaining Primary Owner.',
                })
              );
              return;
            }

            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, message: 'Operation completed successfully.' }));
            return;
          }

          if (req.method === 'GET') {
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, message: 'Authorized access list.' }));
            return;
          }

          res.statusCode = 405;
          res.end(JSON.stringify({ message: 'Method Not Allowed' }));
        });
        return;
      }

      next();
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevMiddlewarePlugin()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) {
              return 'vendor-three';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
          }
        },
      },
    },
  },
})
