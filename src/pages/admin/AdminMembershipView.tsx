import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  X,
} from 'lucide-react';
import type { MembershipPlan, MemberUser } from '../../types/database';

export const AdminMembershipView: React.FC = () => {
  const {
    membershipPlans,
    saveMembershipPlan,
    deleteMembershipPlan,
    reorderMembershipPlans,
    members,
  } = useDatabase();

  const [activeSubTab, setActiveSubTab] = useState<'plans' | 'members' | 'benefits'>('plans');

  // Plan Edit / Create Modal state
  const [editingPlan, setEditingPlan] = useState<Partial<MembershipPlan> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBenefitInput, setNewBenefitInput] = useState('');

  // Member search
  const [memberSearch, setMemberSearch] = useState('');
  const [inspectingMember, setInspectingMember] = useState<MemberUser | null>(null);

  const handleOpenCreate = () => {
    setEditingPlan({
      name: '',
      duration: '1 Year',
      durationMonths: 12,
      price: 2499,
      description: '',
      benefits: [
        'Personal Rang Gurukul contact number',
        'Direct WhatsApp connection',
        'Priority workshop access',
      ],
      status: 'active',
      badge: 'Cultural Internship',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: MembershipPlan) => {
    setEditingPlan({ ...plan });
    setIsModalOpen(true);
  };

  const handleSavePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan?.name || !editingPlan.price || !editingPlan.duration) return;

    saveMembershipPlan({
      id: editingPlan.id,
      name: editingPlan.name,
      duration: editingPlan.duration,
      durationMonths: editingPlan.durationMonths || 12,
      price: Number(editingPlan.price),
      description: editingPlan.description || '',
      benefits: editingPlan.benefits || [],
      status: editingPlan.status || 'active',
      isPopular: !!editingPlan.isPopular,
      badge: editingPlan.badge,
    });

    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleAddBenefit = () => {
    if (!newBenefitInput.trim() || !editingPlan) return;
    const current = editingPlan.benefits || [];
    setEditingPlan({ ...editingPlan, benefits: [...current, newBenefitInput.trim()] });
    setNewBenefitInput('');
  };

  const handleRemoveBenefit = (index: number) => {
    if (!editingPlan) return;
    const current = editingPlan.benefits || [];
    setEditingPlan({ ...editingPlan, benefits: current.filter((_, i) => i !== index) });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= membershipPlans.length) return;

    const ids = membershipPlans.map((p) => p.id);
    const temp = ids[index];
    ids[index] = ids[newIndex];
    ids[newIndex] = temp;
    reorderMembershipPlans(ids);
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.membershipId.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#25221e]">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-1">
            PATRONAGE & INTERNSHIP ADMINISTRATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-editorial">
            Membership Plans & Subscriptions
          </h2>
          <p className="text-xs text-[#9e968b] mt-1">
            Dynamic pricing, durations, perks, and members registry. Prices immediately update on the live website.
          </p>
        </div>

        {activeSubTab === 'plans' && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Plan</span>
          </button>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-[#25221e] pb-px">
        {[
          { id: 'plans', label: `Configurable Plans (${membershipPlans.length})` },
          { id: 'members', label: `Enrolled Members (${members.length})` },
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

      {/* TAB 1: PLANS MANAGEMENT */}
      {activeSubTab === 'plans' && (
        <div className="bg-[#181614] border border-[#2b2723] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#201e1b] text-[#9e968b] uppercase tracking-wider text-[10px] border-b border-[#2b2723]">
                <tr>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Plan Name</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Live Price</th>
                  <th className="py-3.5 px-4">Benefits Count</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#25221e] text-[#faf7f2]">
                {membershipPlans.map((plan, idx) => (
                  <tr key={plan.id} className="hover:bg-[#1f1d1a] transition-colors">
                    <td className="py-4 px-4 font-mono text-[#9e968b]">
                      <div className="flex items-center gap-1">
                        <span>{plan.order}</span>
                        <div className="flex flex-col">
                          <button
                            disabled={idx === 0}
                            onClick={() => handleMove(idx, 'up')}
                            className="text-[#9e968b] hover:text-white disabled:opacity-20"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={idx === membershipPlans.length - 1}
                            onClick={() => handleMove(idx, 'down')}
                            className="text-[#9e968b] hover:text-white disabled:opacity-20"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-white">{plan.name}</div>
                      <div className="text-[11px] text-[#9e968b] line-clamp-1">{plan.description}</div>
                      {plan.isPopular && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-950 text-amber-400 border border-amber-500/30">
                          {plan.badge || 'Popular'}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-mono text-amber-300">
                      {plan.duration}
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-mono text-base font-bold text-white">
                        ₹{plan.price.toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-[#9e968b]">
                      {plan.benefits.length} perks
                    </td>

                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        plan.status === 'active'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#2a2622] text-[#9e968b]'
                      }`}>
                        {plan.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(plan)}
                          className="p-1.5 rounded-lg bg-[#25221e] hover:bg-amber-400 hover:text-black text-amber-400 transition-colors"
                          title="Edit Price & Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteMembershipPlan(plan.id)}
                          className="p-1.5 rounded-lg bg-[#25221e] hover:bg-rose-950 hover:text-rose-400 text-[#9e968b] transition-colors"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ENROLLED MEMBERS */}
      {activeSubTab === 'members' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-[#9e968b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search by name, ID, or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#201e1b] text-[#9e968b] uppercase tracking-wider text-[10px] border-b border-[#2b2723]">
                  <tr>
                    <th className="py-3.5 px-4">Member ID</th>
                    <th className="py-3.5 px-4">Intern Name</th>
                    <th className="py-3.5 px-4">Enrolled Plan</th>
                    <th className="py-3.5 px-4">Valid Until</th>
                    <th className="py-3.5 px-4">Contribution</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#25221e] text-[#faf7f2]">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-[#1f1d1a] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                        {m.membershipId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{m.name}</div>
                        <div className="text-[11px] text-[#9e968b]">{m.email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">{m.planName}</td>
                      <td className="py-3.5 px-4 font-mono text-[#9e968b]">
                        {new Date(m.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400">
                        ₹{m.amountPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setInspectingMember(m)}
                          className="px-2.5 py-1 rounded-lg bg-[#25221e] hover:bg-amber-400 hover:text-black text-amber-400 text-[11px] font-semibold"
                        >
                          View Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PLAN EDIT / CREATE MODAL */}
      {isModalOpen && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[90vh] bg-[#181614] border border-amber-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#faf7f2] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#2b2723]">
              <h3 className="font-editorial text-xl font-bold text-white">
                {editingPlan.id ? 'Edit Membership Plan' : 'Create New Membership Plan'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#9e968b] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlanSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Plan Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingPlan.name || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  placeholder="e.g. 1 Year Classical Internship"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                    Duration Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPlan.duration || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, duration: e.target.value })}
                    placeholder="e.g. 1 Year, 2 Years, 5 Years"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingPlan.price ?? 2499}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs font-mono font-bold focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Plan Description
                </label>
                <textarea
                  rows={2}
                  value={editingPlan.description || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  placeholder="Brief summary of privileges..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Benefits Editor */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1.5 font-semibold">
                  Configured Perks & Privileges
                </label>
                <div className="space-y-2 mb-3">
                  {editingPlan.benefits?.map((b, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#201e1b] border border-[#332f2a] text-xs">
                      <span className="text-white">{b}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(i)}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBenefitInput}
                    onChange={(e) => setNewBenefitInput(e.target.value)}
                    placeholder="Add custom benefit (e.g. Personal contact number)..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="px-3.5 py-2 rounded-xl bg-[#2a2622] hover:bg-amber-400 hover:text-black text-amber-400 text-xs font-semibold"
                  >
                    Add Perk
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#201e1b] border border-[#332f2a] text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.status === 'active'}
                    onChange={(e) => setEditingPlan({ ...editingPlan, status: e.target.checked ? 'active' : 'inactive' })}
                    className="accent-amber-400"
                  />
                  <span>Active & Available Online</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#201e1b] border border-[#332f2a] text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingPlan.isPopular}
                    onChange={(e) => setEditingPlan({ ...editingPlan, isPopular: e.target.checked })}
                    className="accent-amber-400"
                  />
                  <span>Mark as Popular / Featured</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#2b2723] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#332f2a] text-[#9e968b] hover:text-white text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs uppercase tracking-wider"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEMBER DOSSIER INSPECTOR MODAL */}
      {inspectingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#181614] border border-[#332f2a] rounded-2xl p-6 sm:p-8 text-[#faf7f2]">
            <div className="flex items-center justify-between pb-4 border-b border-[#2b2723]">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">
                  INTERN DOSSIER
                </span>
                <h3 className="font-editorial text-2xl font-bold text-white">
                  {inspectingMember.name}
                </h3>
              </div>
              <button onClick={() => setInspectingMember(null)} className="text-[#9e968b] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#24211e]">
                <span className="text-[#9e968b]">Membership ID:</span>
                <span className="font-mono text-amber-300 font-bold">{inspectingMember.membershipId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#24211e]">
                <span className="text-[#9e968b]">Email Address:</span>
                <span className="text-white">{inspectingMember.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#24211e]">
                <span className="text-[#9e968b]">WhatsApp Contact:</span>
                <span className="text-white">{inspectingMember.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#24211e]">
                <span className="text-[#9e968b]">Plan Enrolled:</span>
                <span className="text-white font-semibold">{inspectingMember.planName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#24211e]">
                <span className="text-[#9e968b]">Commencement:</span>
                <span className="text-white">{new Date(inspectingMember.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#24211e]">
                <span className="text-[#9e968b]">Expiry Date:</span>
                <span className="font-mono text-emerald-400">{new Date(inspectingMember.expiryDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#24211e]">
                <span className="text-[#9e968b]">Total Contribution:</span>
                <span className="font-mono text-emerald-400 font-bold">₹{inspectingMember.amountPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#24211e]">
                <span className="text-[#9e968b]">Payment Ref:</span>
                <span className="font-mono text-[11px] text-[#787168]">{inspectingMember.transactionId}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setInspectingMember(null)}
                className="px-5 py-2 rounded-xl bg-[#25221e] text-white text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
