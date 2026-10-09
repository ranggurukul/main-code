import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDatabase } from './DatabaseContext';
import type { AdminUser, MemberUser } from '../types/database';

interface AuthContextValue {
  currentAdmin: AdminUser | null;
  isAdminLoggedIn: boolean;
  isOwner: boolean;
  currentMember: MemberUser | null;
  isMemberLoggedIn: boolean;

  adminLogin: (email: string, password?: string) => { success: boolean; message: string; admin?: AdminUser };
  adminLogout: () => void;
  canAccess: (permission: keyof AdminUser['permissions']) => boolean;

  memberLogin: (email: string, passwordOrPin?: string) => { success: boolean; message: string; member?: MemberUser };
  memberLogout: () => void;
  switchMember: (memberId: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'rang_gurukul_current_admin';
const MEMBER_STORAGE_KEY = 'rang_gurukul_current_member';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { adminUsers, members } = useDatabase();

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
    // Default to the first seed member so member portal is immediately accessible in demo
    return members[0] || null;
  });

  useEffect(() => {
    if (currentAdmin) {
      // Sync with updated admin data if permissions or status changed in db
      const updated = adminUsers.find((a) => a.id === currentAdmin.id);
      if (updated && updated.status !== 'disabled') {
        setCurrentAdmin(updated);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updated));
      } else if (updated && updated.status === 'disabled') {
        setCurrentAdmin(null);
        localStorage.removeItem(ADMIN_STORAGE_KEY);
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

  const adminLogin = (email: string, _password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const admin = adminUsers.find((a) => a.email.toLowerCase() === cleanEmail);

    if (!admin) {
      return { success: false, message: 'Invalid admin credentials or unauthorized account.' };
    }

    if (admin.status === 'disabled') {
      return { success: false, message: 'This administrative account has been deactivated by the Sansthan Trustee.' };
    }

    setCurrentAdmin(admin);
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
    return { success: true, message: `Welcome back, ${admin.name}. Access granted.`, admin };
  };

  const adminLogout = () => {
    setCurrentAdmin(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
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
      return { success: false, message: 'No registered member found with this email. Please check spelling or enroll in an internship.' };
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
    currentMember,
    isMemberLoggedIn: !!currentMember,

    adminLogin,
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
