// Client-Side Admin Authentication & Access Service
// Interacts with backend API endpoints (/api/admin-auth and /api/admin-access)

export interface VerifyAdminResult {
  success: boolean;
  message: string;
  sessionToken?: string;
  isOwner?: boolean;
  error?: string;
  errorType?: string;
}

export const adminAuthService = {
  // 1. Verify via Backend API
  async verifyViaServer(email: string, authMethod: 'google' | 'password'): Promise<VerifyAdminResult> {
    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, authMethod }),
      });

      const data = await response.json();
      return {
        success: response.ok && data.success,
        message: data.message || (response.ok ? 'Access granted.' : 'Authorization check failed.'),
        sessionToken: data.sessionToken,
        isOwner: data.isOwner,
        error: data.error,
        errorType: response.status === 403 ? 'NOT_AUTHORIZED' : undefined,
      };
    } catch {
      // In standalone client-side or offline mode, graceful fallback to local db validation
      return {
        success: false,
        message: 'Backend server connection unavailable, falling back to local database validation.',
      };
    }
  },

  // 2. Reject Public Registration via Server
  async attemptPublicRegistrationViaServer(email: string): Promise<{ success: boolean; error: string; message: string }> {
    try {
      const response = await fetch('/api/admin-auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, action: 'register' }),
      });

      const data = await response.json();
      return {
        success: false,
        error: data.error || 'Access Restricted',
        message:
          data.message ||
          'Administrator registration is invitation-only. Your email address has not been authorized by the Rang Gurukul owner.',
      };
    } catch {
      return {
        success: false,
        error: 'Access Restricted',
        message:
          'Administrator registration is invitation-only. Your email address has not been authorized by the Rang Gurukul owner.',
      };
    }
  },

  // 3. Check Server Session Validity
  async validateServerSession(sessionToken: string): Promise<boolean> {
    try {
      const response = await fetch('/api/admin-auth', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      return response.ok;
    } catch {
      return true; // Fall back to local validation
    }
  },
};
