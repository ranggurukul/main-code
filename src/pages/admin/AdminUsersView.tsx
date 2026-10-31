import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Search,
  CheckCircle,
  AlertTriangle,
  History,
  UserCheck,
  KeyRound,
  Crown,
  Lock,
  Mail,
  Filter,
} from 'lucide-react';
import type { AdminUser, AdminRole, AuthorizedAdminEmail, AdminAuditLog } from '../../types/database';
import { MediaUploadField } from '../../components/media/MediaUploadField';

export const AdminUsersView: React.FC = () => {
  const {
    adminUsers,
    authorizedAdminEmails,
    adminAuditLogs,
    saveAdminUser,
    addAuthorizedEmail,
    removeAuthorizedEmail,
    toggleAuthorizedEmailStatus,
    members,
    subscribers,
  } = useDatabase();

  const { isOwner, currentAdmin } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'admins' | 'audit' | 'members' | 'subscribers'>('admins');
  const [searchTerm, setSearchTerm] = useState('');
  const [auditFilter, setAuditFilter] = useState<'ALL' | 'LOGINS' | 'DENIED' | 'MANAGEMENT'>('ALL');

  // Add / Edit Modal
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<{
    id?: string;
    name: string;
    email: string;
    role: AdminRole;
    status: 'active' | 'disabled';
    notes?: string;
    avatar?: string;
    permissions?: AdminUser['permissions'];
  } | null>(null);

  // Remove confirmation modal
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<AuthorizedAdminEmail | AdminUser | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filtered admins
  const filteredAdmins = (authorizedAdminEmails.length > 0 ? authorizedAdminEmails : (adminUsers as any)).filter(
    (adm: any) =>
      adm.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adm.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adm.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtered audit logs
  const filteredAuditLogs = adminAuditLogs.filter((log) => {
    const matchesSearch =
      log.actorEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (auditFilter === 'LOGINS') {
      return log.action === 'LOGIN_SUCCESS' || log.action === 'LOGOUT';
    }
    if (auditFilter === 'DENIED') {
      return log.action === 'GOOGLE_AUTH_DENIED' || log.action === 'LOGIN_FAILED' || log.status === 'DENIED' || log.status === 'BLOCKED';
    }
    if (auditFilter === 'MANAGEMENT') {
      return log.action === 'ADMIN_ADDED' || log.action === 'ADMIN_REMOVED' || log.action === 'STATUS_CHANGED' || log.action === 'ROLE_UPDATED';
    }
    return true;
  });

  const handleOpenAddAdmin = () => {
    setEditingAdmin({
      name: '',
      email: '',
      role: 'CONTENT_ADMIN',
      status: 'active',
      notes: 'Authorized Administrator',
      permissions: {
        canManageAdmins: false,
        canManageContent: true,
        canManageMembership: false,
        canManageWorkshops: false,
        canManageSubscribers: false,
        canManageGallery: true,
        canManageSettings: false,
        canManagePrices: false,
      },
    });
    setIsAdminModalOpen(true);
  };

  const handleOpenEditAdmin = (admin: any) => {
    setEditingAdmin({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status || 'active',
      notes: admin.notes || 'Authorized Administrator',
      avatar: admin.avatar,
      permissions: admin.permissions || {
        canManageAdmins: admin.role === 'OWNER',
        canManageContent: ['OWNER', 'SUPER_ADMIN', 'CONTENT_ADMIN'].includes(admin.role),
        canManageMembership: ['OWNER', 'SUPER_ADMIN', 'MEMBERSHIP_ADMIN'].includes(admin.role),
        canManageWorkshops: ['OWNER', 'SUPER_ADMIN', 'WORKSHOP_ADMIN'].includes(admin.role),
        canManageSubscribers: ['OWNER', 'SUPER_ADMIN', 'COMMUNICATION_ADMIN'].includes(admin.role),
        canManageGallery: ['OWNER', 'SUPER_ADMIN', 'CONTENT_ADMIN'].includes(admin.role),
        canManageSettings: ['OWNER', 'SUPER_ADMIN'].includes(admin.role),
        canManagePrices: ['OWNER'].includes(admin.role),
      },
    });
    setIsAdminModalOpen(true);
  };

  const handleSaveAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin?.name || !editingAdmin.email || !editingAdmin.role) return;

    if (!isOwner) {
      setActionFeedback({
        type: 'error',
        message: 'Permission Denied: Only the Primary Website Owner can manage administrator email authorizations.',
      });
      return;
    }

    if (editingAdmin.id) {
      // Update existing admin
      saveAdminUser({
        id: editingAdmin.id,
        name: editingAdmin.name,
        email: editingAdmin.email,
        role: editingAdmin.role,
        status: editingAdmin.status,
        permissions: editingAdmin.permissions as any,
      });
      setActionFeedback({
        type: 'success',
        message: `Administrator ${editingAdmin.email} permissions updated successfully.`,
      });
    } else {
      // Add new authorized email
      const res = addAuthorizedEmail(
        {
          name: editingAdmin.name,
          email: editingAdmin.email,
          role: editingAdmin.role,
          notes: editingAdmin.notes,
        },
        currentAdmin?.email || 'owner@ranggurukul.org'
      );

      if (res.success) {
        setActionFeedback({
          type: 'success',
          message: res.message,
        });
      } else {
        setActionFeedback({
          type: 'error',
          message: res.message,
        });
      }
    }

    setIsAdminModalOpen(false);
    setEditingAdmin(null);
  };

  const handleToggleStatus = (id: string) => {
    if (!isOwner) {
      setActionFeedback({
        type: 'error',
        message: 'Permission Denied: Only the Primary Website Owner can change administrator active status.',
      });
      return;
    }

    const res = toggleAuthorizedEmailStatus(id, currentAdmin?.email || 'owner@ranggurukul.org');
    if (res.success) {
      setActionFeedback({ type: 'success', message: res.message });
    } else {
      setActionFeedback({ type: 'error', message: res.message });
    }
  };

  const handleConfirmRevoke = () => {
    if (!confirmDeleteTarget) return;

    if (!isOwner) {
      setActionFeedback({
        type: 'error',
        message: 'Permission Denied: Only the Primary Website Owner can revoke administrator access.',
      });
      setConfirmDeleteTarget(null);
      return;
    }

    const res = removeAuthorizedEmail(
      confirmDeleteTarget.email,
      currentAdmin?.email || 'owner@ranggurukul.org'
    );

    if (res.success) {
      setActionFeedback({ type: 'success', message: res.message });
    } else {
      setActionFeedback({ type: 'error', message: res.message });
    }
    setConfirmDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#25221e]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">
              OWNER ACCESS CONTROL & WHITELIST
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono font-bold">
              PROTECTED
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-editorial flex items-center gap-2">
            <span>Admin Access Management</span>
          </h2>
          <p className="text-xs text-[#9e968b] mt-1 max-w-2xl">
            Only the Primary Website Owner can authorize, view, and revoke administrator access. Every administrator must be verified by email before gaining CMS access via Google or password.
          </p>
        </div>

        {activeSubTab === 'admins' && isOwner && (
          <button
            onClick={handleOpenAddAdmin}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-110 text-black font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-lg shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Authorized Email</span>
          </button>
        )}
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/60 border border-rose-500/50 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionFeedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-[#9e968b] hover:text-white text-xs px-2 py-1 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Non-Owner Notice Banner */}
      {!isOwner && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-300 flex items-center gap-3">
          <Lock className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            You are logged in as <strong>{currentAdmin?.name} ({currentAdmin?.role})</strong>.
            Admin Access Management is restricted to the <strong>Primary Website Owner</strong>. As an Authorized Administrator, you can view existing permissions, but cannot add, remove, or modify authorized email accounts.
          </span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#25221e] pb-px">
        {[
          { id: 'admins', label: `Authorized Administrators (${filteredAdmins.length})`, icon: ShieldCheck },
          { id: 'audit', label: `Access History & Audit (${adminAuditLogs.length})`, icon: History },
          { id: 'members', label: `Interns (${members.length})`, icon: UserCheck },
          { id: 'subscribers', label: `Subscribers (${subscribers.length})`, icon: Mail },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeSubTab === tab.id
                  ? 'border-amber-400 text-amber-400 bg-[#1c1a17]'
                  : 'border-transparent text-[#9e968b] hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: AUTHORIZED ADMINISTRATORS & OWNER ACCESS */}
      {activeSubTab === 'admins' && (
        <div className="space-y-6">
          {/* PRIMARY OWNER CARDS */}
          <div className="bg-gradient-to-br from-[#1c1813] to-[#141210] border border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold">
                      PRIMARY WEBSITE OWNER
                    </span>
                    <span className="px-2 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold">
                      SOVEREIGN TRUSTEE
                    </span>
                    <span className="px-2 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono">
                      Protected from Removal
                    </span>
                  </div>
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-white mt-0.5">
                    Mann Gor & Padmashri Anuradha Sen
                  </h3>
                  <div className="text-xs text-[#9e968b] mt-0.5 flex flex-wrap items-center gap-3">
                    <span>
                      Owner Emails:{' '}
                      <code className="text-amber-300 font-mono">thematrix2741@gmail.com</code> •{' '}
                      <code className="text-amber-300 font-mono">owner@ranggurukul.org</code>
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right text-[11px] text-[#9e968b] border-t md:border-t-0 pt-3 md:pt-0 border-[#2b2723]">
                <div className="text-white font-semibold">Strict Whitelist Enforcement</div>
                <div className="text-[10px] text-[#787168]">Public Registration: Permanently Disabled</div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#787168] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search authorized administrator by name, email, or role..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181614] border border-[#2b2723] text-xs text-white placeholder:text-[#555] focus:outline-none focus:border-amber-400/60"
              />
            </div>
          </div>

          {/* AUTHORIZED ADMINISTRATORS TABLE */}
          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-4 border-b border-[#2b2723] flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-base font-bold text-white">Authorized Administrator Email Whitelist</h3>
                <p className="text-[11px] text-[#9e968b]">
                  Only accounts listed here can sign in via Google OAuth or Password.
                </p>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
                {filteredAdmins.length} Registered Accounts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#201e1b] text-[#9e968b] uppercase tracking-wider text-[10px] border-b border-[#2b2723]">
                  <tr>
                    <th className="py-3.5 px-4">Administrator / Email</th>
                    <th className="py-3.5 px-4">Assigned Role</th>
                    <th className="py-3.5 px-4">Account Type</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Added By</th>
                    <th className="py-3.5 px-4">Last Login</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#25221e] text-[#faf7f2]">
                  {filteredAdmins.map((adm: any) => {
                    const isAdmOwner = adm.role === 'OWNER';
                    const isActive = adm.status !== 'disabled';

                    return (
                      <tr key={adm.id || adm.email} className="hover:bg-[#1f1d1a] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span>{adm.name}</span>
                            {isAdmOwner && (
                              <span title="Primary Owner">
                                <Crown className="w-3.5 h-3.5 text-amber-400" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-amber-300 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3 text-[#787168]" />
                            <span>{adm.email}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              isAdmOwner
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                : 'bg-[#25221e] text-sky-300 border border-sky-500/30'
                            }`}
                          >
                            {adm.role}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {isAdmOwner ? (
                            <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Primary Owner
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#9e968b]">Authorized Staff Admin</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              isActive
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-[11px] text-[#9e968b]">
                          {adm.addedBy || 'System Seed'}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#9e968b]">
                          {adm.lastLogin ? new Date(adm.lastLogin).toLocaleDateString() : 'Never'}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {isOwner ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditAdmin(adm)}
                                className="p-1.5 rounded-lg bg-[#25221e] hover:bg-amber-400 hover:text-black text-amber-400 transition-colors"
                                title="Edit Role / Permissions"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {!isAdmOwner && (
                                <>
                                  <button
                                    onClick={() => handleToggleStatus(adm.id || adm.email)}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                                      isActive
                                        ? 'bg-[#25221e] hover:bg-amber-950 text-amber-400'
                                        : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                                    }`}
                                    title={isActive ? 'Deactivate Account' : 'Reactivate Account'}
                                  >
                                    {isActive ? 'Disable' : 'Enable'}
                                  </button>

                                  <button
                                    onClick={() => setConfirmDeleteTarget(adm)}
                                    className="p-1.5 rounded-lg bg-[#25221e] hover:bg-rose-950 hover:text-rose-400 text-[#9e968b] transition-colors"
                                    title="Revoke Admin Access"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}

                              {isAdmOwner && (
                                <span className="text-[10px] text-amber-500/60 font-mono px-2 py-1">Protected</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] text-[#787168] italic">Protected</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACCESS HISTORY & AUDIT LOG */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-editorial text-xl font-bold text-white">Access History & Security Audit Log</h3>
              <p className="text-xs text-[#9e968b]">
                Real-time security log tracking every login attempt, Google OAuth verification, and access management change.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'ALL', label: 'All Events' },
                { id: 'LOGINS', label: 'Logins' },
                { id: 'DENIED', label: 'Denied Attempts' },
                { id: 'MANAGEMENT', label: 'Admin Changes' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setAuditFilter(btn.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-mono tracking-wider transition-colors ${
                    auditFilter === btn.id
                      ? 'bg-amber-400 text-black font-bold'
                      : 'bg-[#201e1b] text-[#9e968b] hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#201e1b] text-[#9e968b] uppercase tracking-wider text-[10px] border-b border-[#2b2723]">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Event Action</th>
                    <th className="py-3 px-4">Actor Email</th>
                    <th className="py-3 px-4">Target Email</th>
                    <th className="py-3 px-4">Event Details</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#25221e] text-[#faf7f2]">
                  {filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#787168]">
                        No audit events found matching this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map((log) => {
                      const isDenied = log.status === 'DENIED' || log.status === 'BLOCKED' || log.action === 'GOOGLE_AUTH_DENIED';
                      const isSuccess = log.status === 'SUCCESS';

                      return (
                        <tr key={log.id} className="hover:bg-[#1f1d1a] transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-[#9e968b] whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>

                          <td className="py-3 px-4 font-mono font-bold">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                isDenied
                                  ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              }`}
                            >
                              {log.action}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-mono text-[11px] text-amber-300">
                            {log.actorEmail}
                          </td>

                          <td className="py-3 px-4 font-mono text-[11px] text-[#9e968b]">
                            {log.targetEmail || '—'}
                          </td>

                          <td className="py-3 px-4 text-[11px] text-[#c4b9aa] max-w-md">
                            {log.details}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                                isSuccess
                                  ? 'bg-emerald-950 text-emerald-400'
                                  : isDenied
                                  ? 'bg-rose-950 text-rose-400'
                                  : 'bg-amber-950 text-amber-400'
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3 & 4: INTERNS & SUBSCRIBERS */}
      {activeSubTab === 'members' && (
        <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6">
          <h3 className="font-editorial text-lg font-bold text-white mb-4">Enrolled Internships & Members</h3>
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="p-3 rounded-xl bg-[#201e1b] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white">{m.name}</span>
                  <span className="text-[#9e968b] ml-2 font-mono">({m.email})</span>
                </div>
                <span className="font-mono text-amber-300">{m.membershipId} • {m.planName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'subscribers' && (
        <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6">
          <h3 className="font-editorial text-lg font-bold text-white mb-4">Email Subscribers Whitelist</h3>
          <div className="space-y-2">
            {subscribers.map((s) => (
              <div key={s.id} className="p-3 rounded-xl bg-[#201e1b] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white">{s.name}</span>
                  <span className="text-[#9e968b] ml-2 font-mono">({s.email})</span>
                </div>
                <span className="text-emerald-400 uppercase font-semibold text-[10px]">{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT AUTHORIZED ADMIN MODAL */}
      {isAdminModalOpen && editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#181614] border border-amber-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#faf7f2] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#2b2723]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-editorial text-xl font-bold text-white">
                  {editingAdmin.id ? 'Edit Administrator Permissions' : 'Authorize New Administrator Email'}
                </h3>
              </div>
              <button onClick={() => setIsAdminModalOpen(false)} className="text-[#9e968b] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdminSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Administrator Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingAdmin.name}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                  placeholder="e.g. Shailaja Murthy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Authorized Email Address (Google / Work Email) *
                </label>
                <input
                  type="email"
                  required
                  value={editingAdmin.email}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                  placeholder="admin@ranggurukul.org or user@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[10px] text-[#787168] mt-1 block">
                  This person will be permitted to authenticate via Google Sign-In or Password.
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Assigned Administrative Role *
                </label>
                <select
                  value={editingAdmin.role}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, role: e.target.value as AdminRole })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-amber-300 font-mono text-xs focus:border-amber-400 focus:outline-none"
                >
                  <option value="CONTENT_ADMIN">CONTENT ADMIN — Events, Repertoire, Stories & Gallery</option>
                  <option value="WORKSHOP_ADMIN">WORKSHOP ADMIN — Workshops & Registrations</option>
                  <option value="MEMBERSHIP_ADMIN">MEMBERSHIP ADMIN — Plans & Interns</option>
                  <option value="COMMUNICATION_ADMIN">COMMUNICATION ADMIN — Broadcasts & Subscribers</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN — System Administrator</option>
                  <option value="OWNER">OWNER — Full Sovereign Control (Website Owner)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Administrative Notes / Department
                </label>
                <input
                  type="text"
                  value={editingAdmin.notes || ''}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, notes: e.target.value })}
                  placeholder="e.g. Lead Dramaturge / Mumbai Tour Coordinator"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#2b2723] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#332f2a] text-xs text-[#9e968b] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-black font-semibold text-xs uppercase hover:brightness-110 cursor-pointer shadow-md"
                >
                  {editingAdmin.id ? 'Save Changes' : 'Register & Authorize Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM REVOKE ACCESS MODAL */}
      {confirmDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#181614] border border-rose-500/50 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#faf7f2] text-center">
            <div className="w-14 h-14 rounded-full bg-rose-950/80 border border-rose-500/40 mx-auto flex items-center justify-center text-rose-400 mb-4 shadow-lg">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <span className="text-[10px] uppercase font-mono tracking-widest text-rose-400 block mb-1">
              Revoke Authorization
            </span>

            <h3 className="font-editorial text-2xl font-bold text-white mb-2">
              Revoke Administrator Access?
            </h3>

            <p className="text-xs text-[#c4b9aa] leading-relaxed mb-4">
              Are you sure you want to remove administrator authorization for{' '}
              <strong className="text-white">{confirmDeleteTarget.name}</strong> (
              <span className="text-amber-300 font-mono">{confirmDeleteTarget.email}</span>)?
            </p>

            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-[11px] text-rose-300 text-left mb-6 space-y-1">
              <div className="font-semibold">• This administrator will immediately lose all CMS access.</div>
              <div>• Any active browser sessions will be terminated immediately.</div>
              <div>• Future Google Sign-In attempts with this account will be denied.</div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteTarget(null)}
                className="w-1/2 py-2.5 px-4 rounded-xl border border-[#332f2a] text-[#9e968b] hover:text-white text-xs font-semibold uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="w-1/2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-lg cursor-pointer"
              >
                Confirm Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
