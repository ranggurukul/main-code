import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { PaymentModal } from '../components/PaymentModal';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import {
  Crown,
  CheckCircle2,
  Flame,
  Phone,
  MessageSquare,
  Users,
  Calendar,
  Lock,
  ArrowRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import type { MembershipPlan } from '../types/database';

export const MembershipPage: React.FC = () => {
  const { membershipPlans, createMemberAccount } = useDatabase();
  const { isMemberLoggedIn, currentMember } = useAuth();
  const navigate = useNavigate();

  // Active plans only
  const activePlans = membershipPlans.filter((p) => p.status === 'active');

  // Checkout flow state
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Form details
  const [formData, setFormData] = useState({
    name: currentMember?.name || '',
    email: currentMember?.email || '',
    phone: currentMember?.phone || '',
    city: currentMember?.city || '',
    address: currentMember?.address || '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [purchasedMember, setPurchasedMember] = useState<any>(null);

  const handleSelectPlan = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setIsCheckoutOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = ({
    transactionId,
    paymentMethod,
  }: {
    transactionId: string;
    paymentMethod: string;
  }) => {
    setIsPaymentModalOpen(false);

    if (!selectedPlan) return;

    const newMember = createMemberAccount({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      planId: selectedPlan.id,
      paymentMethod,
      amountPaid: selectedPlan.price,
      address: formData.address,
      city: formData.city,
    });

    setPurchasedMember(newMember);
  };

  return (
    <PageTransition>
      {/* Banner */}
      <section className="pt-36 pb-16 px-4 sm:px-6 lg:px-12 bg-[#161412] border-b border-[#2b2723]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#d4af37]/40 bg-[#221f1c] text-[#d4af37] text-xs font-semibold uppercase tracking-widest mb-4">
            <Crown className="w-3.5 h-3.5" />
            Sansthan Internship & Kinship Circle
          </div>
          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl text-[#faf7f2] font-bold">
            Paid Cultural Membership
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#d8d0c5] max-w-2xl mx-auto font-light leading-relaxed">
            Direct personal WhatsApp connection with Sansthan coordinators, stage act participation privileges,
            priority masterclasses, and sacred retreats. Dynamic pricing managed directly by the Sansthan Trust.
          </p>
        </div>
      </section>

      {/* Membership Plans Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#121110]">
        <div className="max-w-7xl mx-auto">
          {purchasedMember ? (
            /* Purchase Success Confirmation View */
            <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-[#1a1816] border border-[#d4af37] shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37]">
                INTERNSHIP ACTIVATED
              </span>
              <h2 className="font-editorial text-3xl font-bold text-[#faf7f2]">
                Welcome, {purchasedMember.name}
              </h2>
              <div className="p-5 rounded-xl bg-[#201e1b] border border-[#332f2a] text-left space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#9e968b]">Membership Plan:</span>
                  <span className="font-semibold text-[#faf7f2]">{purchasedMember.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9e968b]">Unique Member ID:</span>
                  <span className="font-mono text-[#d4af37] font-bold text-sm">
                    {purchasedMember.membershipId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9e968b]">Valid Until:</span>
                  <span className="font-mono text-[#faf7f2]">
                    {new Date(purchasedMember.expiryDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9e968b]">Payment Status:</span>
                  <span className="text-emerald-400 font-semibold">Active & Confirmed</span>
                </div>
              </div>

              <p className="text-xs text-[#9e968b] leading-relaxed">
                Your confirmation email and digital membership card have been issued. You now have full access to the Private Member Dashboard.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/member')}
                  className="flex-1 py-3.5 rounded-xl bg-[#d4af37] text-[#121110] font-editorial font-bold text-xs uppercase tracking-wider hover:bg-[#fae69e] transition-all flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4 text-[#121110]" />
                  <span>Enter Member Dashboard</span>
                </button>
                <button
                  onClick={() => setPurchasedMember(null)}
                  className="px-6 py-3.5 rounded-xl border border-[#332f2a] text-[#9e968b] hover:text-[#faf7f2] text-xs font-semibold uppercase tracking-wider"
                >
                  Browse Plans
                </button>
              </div>
            </div>
          ) : (
            /* Plans Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {activePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-7 flex flex-col justify-between border transition-all duration-300 relative group ${
                    plan.isPopular
                      ? 'bg-[#221f1b] border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.2)] scale-[1.03]'
                      : 'bg-[#1a1816] border-[#332f2a] hover:border-[#d4af37]/60'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-[#d4af37] text-[#121110] text-[10px] font-bold uppercase tracking-widest shadow-md">
                      {plan.badge || 'Most Valued'}
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#c85a32] block mb-1">
                      {plan.duration}
                    </span>
                    <h3 className="font-editorial text-2xl font-bold text-[#faf7f2] group-hover:text-[#d4af37] transition-colors">
                      {plan.name}
                    </h3>

                    <div className="mt-5 pb-5 border-b border-[#332f2a]">
                      <span className="text-[11px] text-[#9e968b] block uppercase">Internship Contribution</span>
                      <div className="font-mono text-4xl font-bold text-[#d4af37] mt-1">
                        ₹{plan.price.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-[#6b635b]">All inclusive • Tax exempt 80G</span>
                    </div>

                    <p className="mt-4 text-xs text-[#9e968b] leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="mt-6 space-y-2.5">
                      <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold block">
                        Included Perks & Privileges:
                      </span>
                      {plan.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-[#d8d0c5]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                          <span className="leading-snug text-[11px]">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#332f2a]">
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3.5 px-4 rounded-xl text-center text-xs font-editorial font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        plan.isPopular
                          ? 'bg-[#d4af37] text-[#121110] hover:bg-[#fae69e] shadow-lg shadow-[#d4af37]/20'
                          : 'border border-[#d4af37]/40 bg-[#24201c] text-[#faf7f2] hover:bg-[#d4af37] hover:text-[#121110]'
                      }`}
                    >
                      <span>Join {plan.duration}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Detailed Breakdown */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#161412] border-t border-[#2a2622]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#c85a32] font-semibold block mb-2 font-mono">
              Privileges of the Inner Circle
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#faf7f2] font-bold">
              What It Means to Be an Intern
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#1c1a17] border border-[#332f2a]">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-lg text-[#faf7f2] font-bold mb-2">
                Personal Contact & Direct WhatsApp
              </h3>
              <p className="text-xs text-[#9e968b] leading-relaxed">
                Connect directly with our Sansthan curators via a dedicated phone number and WhatsApp channel for priority queries, reservations, and private artist introductions.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#1c1a17] border border-[#332f2a]">
              <div className="w-10 h-10 rounded-full bg-[#c85a32]/15 border border-[#c85a32]/30 flex items-center justify-center text-[#c85a32] mb-4">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-lg text-[#faf7f2] font-bold mb-2">
                Opportunity to Participate in Acts
              </h3>
              <p className="text-xs text-[#9e968b] leading-relaxed">
                Eligible interns (3-Year & 5-Year tiers) can request participation in select chorus roles, Chhau movement ensembles, and Aharya mask sculpting for major tours.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#1c1a17] border border-[#332f2a]">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-lg text-[#faf7f2] font-bold mb-2">
                Priority Workshops & Masterclasses
              </h3>
              <p className="text-xs text-[#9e968b] leading-relaxed">
                Guaranteed seat reservations and up to 20% tuition discounts on paid intensives taught by Padmashri awardees and visiting international maestros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Member Information Form Modal */}
      {isCheckoutOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#1a1816] border border-[#d4af37]/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#faf7f2]">
            <div className="flex items-center justify-between pb-4 border-b border-[#332f2a]">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#d4af37]">
                  INTERNSHIP ENROLLMENT
                </span>
                <h3 className="font-editorial text-xl font-bold">
                  {selectedPlan.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#9e968b] block">Payable</span>
                <div className="font-mono text-xl font-bold text-[#d4af37]">
                  ₹{selectedPlan.price.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <form onSubmit={handleProceedToPayment} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full legal name"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
                />
                {formErrors.name && <span className="text-xs text-rose-400">{formErrors.name}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                  {formErrors.email && <span className="text-xs text-rose-400">{formErrors.email}</span>}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">
                    Phone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98000 00000"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                  {formErrors.phone && <span className="text-xs text-rose-400">{formErrors.phone}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">
                    City / Country
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. New Delhi"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">
                    Postal Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Residential address"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-1/3 py-3 rounded-xl border border-[#332f2a] text-[#9e968b] hover:text-[#faf7f2] text-xs uppercase font-semibold tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-xl bg-[#d4af37] hover:bg-[#fae69e] text-[#121110] font-editorial font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Proceed to Payment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Step 4: Payment Gateway Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={selectedPlan.name}
          subtitle={`${selectedPlan.duration} Internship • Full Privileges`}
          amount={selectedPlan.price}
          itemType="membership"
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </PageTransition>
  );
};
