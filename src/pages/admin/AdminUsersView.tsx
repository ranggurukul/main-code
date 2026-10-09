import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  ShieldAlert,
} from 'lucide-react';
import type { AdminUser, AdminRole } from '../../types/database';
import { MediaUploadField } from '../../components/media/MediaUploadField';

export const AdminUsersView: React.FC = () => {
  const { adminUsers, saveAdminUser, toggleAdminStatus, deleteAdminUser, members, subscribers } = useDatabase();
  const { isOwner, currentAdmin } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'admins' | 'members' | 'subscribers'>('admins');

  // Admin Modal
  const [editingAdmin, setEditingAdmin] = useState<Partial<AdminUser> | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const handleOpenAddAdmin = () => {
    setEditingAdmin({
      name: '',
      email: '',
      role: 'CONTENT_ADMIN',
      status: 'active',
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

  const handleOpenEditAdmin = (admin: AdminUser) => {
    setEditingAdmin({ ...admin, permissions: { ...admin.permissions } });
    setIsAdminModalOpen(true);
  };

  const handleSaveAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin?.name || !editingAdmin.email || !editingAdmin.role) return;

    saveAdminUser({
      id: editingAdmin.id,
      name: editingAdmin.name,
      email: editingAdmin.email,
      role: editingAdmin.role,
      status: editingAdmin.status || 'active',
      permissions: editingAdmin.permissions as any,
    });

    setIsAdminModalOpen(false);
    setEditingAdmin(null);
  };

  const handleRoleChange = (role: AdminRole) => {
    if (!editingAdmin) return;
    const permissions = {
      canManageAdmins: role === 'OWNER',
      canManageContent: ['OWNER', 'SUPER_ADMIN', 'CONTENT_ADMIN'].includes(role),
      canManageMembership: ['OWNER', 'SUPER_ADMIN', 'MEMBERSHIP_ADMIN'].includes(role),
      canManageWorkshops: ['OWNER', 'SUPER_ADMIN', 'WORKSHOP_ADMIN'].includes(role),
      canManageSubscribers: ['OWNER', 'SUPER_ADMIN', 'COMMUNICATION_ADMIN'].includes(role),
      canManageGallery: ['OWNER', 'SUPER_ADMIN', 'CONTENT_ADMIN'].includes(role),
      canManageSettings: ['OWNER', 'SUPER_ADMIN'].includes(role),
      canManagePrices: ['OWNER'].includes(role),
    };
    setEditingAdmin({ ...editingAdmin, role, permissions });
  };

  const handleTogglePermission = (permKey: keyof AdminUser['permissions']) => {
    if (!editingAdmin || !editingAdmin.permissions) return;
    setEditingAdmin({
      ...editingAdmin,
      permissions: {
        ...editingAdmin.permissions,
        [permKey]: !editingAdmin.permissions[permKey],
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#25221e]">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-1">
            ACCESS CONTROL & ROLE HIERARCHY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-editorial">
            Admin Staff & User Management
          </h2>
          <p className="text-xs text-[#9e968b] mt-1">
            Assign role-based access for Content, Workshops, Memberships, and Communications. Only authorized Owners can create or modify admins.
          </p>
        </div>

        {activeSubTab === 'admins' && isOwner && (
          <button
            onClick={handleOpenAddAdmin}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create Administrator</span>
          </button>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-[#25221e] pb-px">
        {[
          { id: 'admins', label: `Staff Administrators (${adminUsers.length})` },
          { id: 'members', label: `Interns (${members.length})` },
          { id: 'subscribers', label: `Subscribers (${subscribers.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-t-xl transition-colors border-b-2 ${
              activeSubTab === tab.id
                ? 'border-amber-400 text-amber-400 bg-[#1c1a17]'
                : 'border-transparent text-[#9e968b] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ADMINS MANAGEMENT */}
      {activeSubTab === 'admins' && (
        <div className="space-y-4">
          {!isOwner && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>
                You are currently logged in as <strong>{currentAdmin?.name} ({currentAdmin?.role})</strong>.
                Only the Sansthan Trustee (OWNER) can create, edit, or delete administrative staff accounts.
              </span>
            </div>
          )}

          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#201e1b] text-[#9e968b] uppercase tracking-wider text-[10px] border-b border-[#2b2723]">
                  <tr>
                    <th className="py-3.5 px-4">Administrator</th>
                    <th className="py-3.5 px-4">Assigned Role</th>
                    <th className="py-3.5 px-4">Permissions Overview</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Last Activity</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#25221e] text-[#faf7f2]">
                  {adminUsers.map((adm) => (
                    <tr key={adm.id} className="hover:bg-[#1f1d1a] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{adm.name}</span>
                          {adm.role === 'OWNER' && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-500/30 text-[9px] font-bold">
                              TRUSTEE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#9e968b]">{adm.email}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                        {adm.role}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {adm.permissions.canManagePrices && (
                            <span className="px-1.5 py-0.5 rounded bg-[#25221e] text-[9px] text-amber-400">
                              Prices
                            </span>
                          )}
                          {adm.permissions.canManageWorkshops && (
                            <span className="px-1.5 py-0.5 rounded bg-[#25221e] text-[9px] text-emerald-400">
                              Workshops
                            </span>
                          )}
                          {adm.permissions.canManageContent && (
                            <span className="px-1.5 py-0.5 rounded bg-[#25221e] text-[9px] text-sky-400">
                              Content
                            </span>
                          )}
                          {adm.permissions.canManageMembership && (
                            <span className="px-1.5 py-0.5 rounded bg-[#25221e] text-[9px] text-purple-400">
                              Membership
                            </span>
                          )}
                          {adm.permissions.canManageSubscribers && (
                            <span className="px-1.5 py-0.5 rounded bg-[#25221e] text-[9px] text-orange-400">
                              Broadcasts
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          adm.status === 'active'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                        }`}>
                          {adm.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#9e968b]">
                        {adm.lastLogin ? new Date(adm.lastLogin).toLocaleDateString() : 'Never'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isOwner ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditAdmin(adm)}
                              className="p-1 rounded bg-[#25221e] hover:bg-amber-400 hover:text-black text-amber-400"
                              title="Edit Permissions"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {adm.role !== 'OWNER' && (
                              <>
                                <button
                                  onClick={() => toggleAdminStatus(adm.id)}
                                  className={`p-1 rounded text-xs ${
                                    adm.status === 'active'
                                      ? 'bg-[#25221e] hover:bg-amber-950 text-amber-400'
                                      : 'bg-emerald-950 text-emerald-400'
                                  }`}
                                  title={adm.status === 'active' ? 'Disable Account' : 'Re-activate Account'}
                                >
                                  {adm.status === 'active' ? 'Disable' : 'Enable'}
                                </button>
                                <button
                                  onClick={() => deleteAdminUser(adm.id)}
                                  className="p-1 rounded bg-[#25221e] hover:bg-rose-950 hover:text-rose-400 text-[#9e968b]"
                                  title="Delete Admin"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#787168] italic">Owner Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2 & 3: Quick list */}
      {activeSubTab === 'members' && (
        <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6">
          <h3 className="font-editorial text-lg font-bold text-white mb-4">Enrolled Internship List</h3>
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="p-3 rounded-xl bg-[#201e1b] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white">{m.name}</span>
                  <span className="text-[#9e968b] ml-2">({m.email})</span>
                </div>
                <span className="font-mono text-amber-300">{m.membershipId} • {m.planName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'subscribers' && (
        <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6">
          <h3 className="font-editorial text-lg font-bold text-white mb-4">Email Subscribers List</h3>
          <div className="space-y-2">
            {subscribers.map((s) => (
              <div key={s.id} className="p-3 rounded-xl bg-[#201e1b] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white">{s.name}</span>
                  <span className="text-[#9e968b] ml-2">({s.email})</span>
                </div>
                <span className="text-emerald-400 uppercase font-semibold text-[10px]">{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE / EDIT ADMIN MODAL */}
      {isAdminModalOpen && editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#181614] border border-amber-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#faf7f2] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#2b2723]">
              <h3 className="font-editorial text-xl font-bold text-white">
                {editingAdmin.id ? 'Edit Administrator & Permissions' : 'Create New Administrator'}
              </h3>
              <button onClick={() => setIsAdminModalOpen(false)} className="text-[#9e968b] hover:text-white">
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
                  value={editingAdmin.name || ''}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                  placeholder="e.g. Shailaja Murthy"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Admin Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editingAdmin.email || ''}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                  placeholder="admin@ranggurukul.org"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <MediaUploadField
                  label="Administrator Profile Avatar / Photo"
                  value={editingAdmin.avatar || ''}
                  onChange={(url) => setEditingAdmin({ ...editingAdmin, avatar: url })}
                  category="Artists"
                  aspectRatio="1:1"
                  helperText="Upload official profile portrait or select from Media Library"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Assigned Administrative Role
                </label>
                <select
                  value={editingAdmin.role || 'CONTENT_ADMIN'}
                  onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-amber-300 font-mono text-xs focus:border-amber-400 focus:outline-none"
                >
                  <option value="OWNER">OWNER — Full Sovereign Control</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN — System Administrator</option>
                  <option value="CONTENT_ADMIN">CONTENT ADMIN — Events, Repertoire, Stories & Gallery</option>
                  <option value="WORKSHOP_ADMIN">WORKSHOP ADMIN — Workshops, Dynamic Forms & Registrations</option>
                  <option value="MEMBERSHIP_ADMIN">MEMBERSHIP ADMIN — Plans, Interns & Perks</option>
                  <option value="COMMUNICATION_ADMIN">COMMUNICATION ADMIN — Subscribers & Email Broadcasts</option>
                </select>
              </div>

              {/* Granular Permissions Toggles */}
              <div className="pt-2">
                <label className="block text-xs uppercase tracking-wider text-amber-400 mb-2 font-semibold">
                  Granular Permission Overrides
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {editingAdmin.permissions &&
                    Object.entries(editingAdmin.permissions).map(([key, val]) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-[#201e1b] border border-[#332f2a] cursor-pointer hover:border-amber-500/30"
                      >
                        <input
                          type="checkbox"
                          checked={val}
                          onChange={() => handleTogglePermission(key as any)}
                          className="accent-amber-400"
                        />
                        <span className="truncate">{key.replace('canManage', 'Manage ')}</span>
                      </label>
                    ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#2b2723] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#332f2a] text-xs text-[#9e968b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase"
                >
                  Save Administrator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
