import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDatabase } from './DatabaseContext';
import type { AdminUser, MemberUser } from '../types/database';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthContextValue {
  currentAdmin: AdminUser | null;
  isAdminLoggedIn: boolean;
  isOwner: boolean;
  sessionToken: string | null;
  currentMember: MemberUser | null;
  isMemberLoggedIn: boolean;

  adminLogin: (email: string, password?: string) => { success: boolean; message: string; admin?: AdminUser; errorType?: string };
  adminGoogleLogin: (simulatedEmail?: string) => Promise<{ success: boolean; message: string; admin?: AdminUser; errorType?: string }>;
  adminLogout: () => void;
  canAccess: (permission: keyof AdminUser['permissions']) => boolean;

  memberLogin: (email: string, passwordOrPin?: string) => { success: boolean; message: string; member?: MemberUser };
  memberLogout: () => void;
  switchMember: (memberId: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'rang_gurukul_current_admin';
const ADMIN_SESSION_KEY = 'rang_gurukul_admin_session_token';
const MEMBER_STORAGE_KEY = 'rang_gurukul_current_member';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    adminUsers,
    authorizedAdminEmails,
    members,
    verifyAdminAccess,
    validateAdminSession,
    revokeAdminSession,
  } = useDatabase();

  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ADMIN_SESSION_KEY);
    } catch {
      return null;
    }
  });

  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [currentMember, setCurrentMember] = useState<MemberUser | null>(() => {
    try {
      const stored = localStorage.getItem(MEMBER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return members[0] || null;
  });

  // Verify session validity on mount and when authorizedAdminEmails changes
  useEffect(() => {
    if (sessionToken) {
      const check = validateAdminSession(sessionToken);
      if (!check.valid) {
        // Session expired or administrator authorization was revoked
        setCurrentAdmin(null);
        setSessionToken(null);
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        localStorage.removeItem(ADMIN_SESSION_KEY);
      } else if (check.admin) {
        setCurrentAdmin(check.admin);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(check.admin));
      }
    } else if (currentAdmin) {
      // Check if admin is still in authorized list and active
      const isAuth = authorizedAdminEmails.some(
        (a) => a.email.toLowerCase() === currentAdmin.email.toLowerCase() && a.status === 'active'
      );
      if (!isAuth) {
        setCurrentAdmin(null);
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    }
  }, [sessionToken, authorizedAdminEmails]);

  // Sync admin user profile modifications
  useEffect(() => {
    if (currentAdmin) {
      const updated = adminUsers.find((a) => a.id === currentAdmin.id || a.email.toLowerCase() === currentAdmin.email.toLowerCase());
      if (updated && updated.status !== 'disabled') {
        setCurrentAdmin(updated);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updated));
      } else if (updated && updated.status === 'disabled') {
        setCurrentAdmin(null);
        setSessionToken(null);
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }
  }, [adminUsers]);

  useEffect(() => {
    if (currentMember) {
      const updated = members.find((m) => m.id === currentMember.id);
      if (updated) {
        setCurrentMember(updated);
        localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(updated));
      }
    } else if (members.length > 0) {
      setCurrentMember(members[0]);
    }
  }, [members]);

  // 1. EMAIL & PASSWORD LOGIN
  const adminLogin = (email: string, _password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const result = verifyAdminAccess(cleanEmail, 'password');

    if (!result.authorized || !result.admin) {
      return {
        success: false,
        errorType: result.errorType,
        message: result.message,
      };
    }

    setCurrentAdmin(result.admin);
    if (result.sessionToken) {
      setSessionToken(result.sessionToken);
      localStorage.setItem(ADMIN_SESSION_KEY, result.sessionToken);
    }
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(result.admin));
    return {
      success: true,
      message: result.message,
      admin: result.admin,
    };
  };

  // 2. STRICT GOOGLE SIGN-IN
  const adminGoogleLogin = async (
    simulatedEmail?: string
  ): Promise<{ success: boolean; message: string; admin?: AdminUser; errorType?: string }> => {
    let verifiedEmail = '';

    if (simulatedEmail) {
      verifiedEmail = simulatedEmail.trim().toLowerCase();
    } else {
      try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const userCredential = await signInWithPopup(auth, provider);
        verifiedEmail = userCredential.user.email?.trim().toLowerCase() || '';
      } catch (err: any) {
        // Return clear, actionable error
        const code = err.code || '';
        if (code === 'auth/popup-closed-by-user') {
          return { success: false, message: 'Google Sign-In was cancelled before completing.' };
        }
        if (code === 'auth/operation-not-allowed' || code === 'auth/configuration-not-found') {
          return {
            success: false,
            errorType: 'GOOGLE_CONFIG_REQUIRED',
            message:
              'Google Sign-In provider is not yet enabled in the Firebase Console. Please enable Google in Firebase Console > Authentication > Sign-in method.',
          };
        }
        return {
          success: false,
          message: err.message || 'Google authentication encountered an unexpected error.',
        };
      }
    }

    if (!verifiedEmail) {
      return { success: false, message: 'No verified email address received from Google authentication.' };
    }

    // Backend / Database authorization check
    const authResult = verifyAdminAccess(verifiedEmail, 'google');

    if (!authResult.authorized || !authResult.admin) {
      // Immediately sign out from Firebase/Google session
      try {
        await signOut(auth);
      } catch {
        // ignore
      }
      return {
        success: false,
        errorType: 'PERMISSION_DENIED',
        message: authResult.message,
      };
    }

    // Authorized Admin
    setCurrentAdmin(authResult.admin);
    if (authResult.sessionToken) {
      setSessionToken(authResult.sessionToken);
      localStorage.setItem(ADMIN_SESSION_KEY, authResult.sessionToken);
    }
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(authResult.admin));

    return {
      success: true,
      message: authResult.message,
      admin: authResult.admin,
    };
  };

  const adminLogout = () => {
    if (sessionToken) {
      revokeAdminSession(sessionToken);
    }
    try {
      signOut(auth);
    } catch {
      // ignore
    }
    setCurrentAdmin(null);
    setSessionToken(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  };

  const canAccess = (permission: keyof AdminUser['permissions']) => {
    if (!currentAdmin) return false;
    if (currentAdmin.role === 'OWNER') return true;
    return !!currentAdmin.permissions[permission];
  };

  const memberLogin = (email: string, _pin?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const member = members.find((m) => m.email.toLowerCase() === cleanEmail);

    if (!member) {
      return {
        success: false,
        message: 'No registered member found with this email. Please check spelling or enroll in an internship.',
      };
    }

    setCurrentMember(member);
    localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(member));
    return { success: true, message: `Welcome to the Inner Sanctum, ${member.name}.`, member };
  };

  const memberLogout = () => {
    setCurrentMember(null);
    localStorage.removeItem(MEMBER_STORAGE_KEY);
  };

  const switchMember = (memberId: string) => {
    const mem = members.find((m) => m.id === memberId);
    if (mem) {
      setCurrentMember(mem);
      localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(mem));
    }
  };

  const value: AuthContextValue = {
    currentAdmin,
    isAdminLoggedIn: !!currentAdmin,
    isOwner: currentAdmin?.role === 'OWNER',
    sessionToken,
    currentMember,
    isMemberLoggedIn: !!currentMember,

    adminLogin,
    adminGoogleLogin,
    adminLogout,
    canAccess,

    memberLogin,
    memberLogout,
    switchMember,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
