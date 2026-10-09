import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { PaymentModal } from '../components/PaymentModal';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import { Crown, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Lock } from 'lucide-react';

export const MembershipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { membershipPlans, createMemberAccount } = useDatabase();
  const { currentMember } = useAuth();
  const navigate = useNavigate();

  const plan = membershipPlans.find((p) => p.id === id) || membershipPlans[0];
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: currentMember?.name || '',
    email: currentMember?.email || '',
    phone: currentMember?.phone || '',
    city: currentMember?.city || '',
    address: currentMember?.address || '',
  });

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckoutOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = ({ transactionId, paymentMethod }: { transactionId: string; paymentMethod: string }) => {
    setIsPaymentOpen(false);
    createMemberAccount({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      planId: plan.id,
      paymentMethod,
      amountPaid: plan.price,
      address: formData.address,
      city: formData.city,
    });
    navigate('/member');
  };

  return (
    <PageTransition>
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-12 bg-[#121110]">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/membership"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#9e968b] hover:text-[#d4af37] transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Membership Tiers</span>
          </Link>

          <div className="theatre-card p-8 sm:p-12 rounded-2xl border border-[#d4af37]/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-[#332f2a]">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-[#c85a32] block mb-1">
                  {plan.duration} Kinship
                </span>
                <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#faf7f2]">
                  {plan.name}
                </h1>
                <p className="mt-2 text-sm text-[#9e968b] max-w-xl">
                  {plan.description}
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-[#332f2a] sm:pl-8">
                <span className="text-xs uppercase text-[#9e968b] block">Annual Contribution</span>
                <div className="font-mono text-4xl font-bold text-[#d4af37] mt-1">
                  ₹{plan.price.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="py-8">
              <h3 className="font-editorial text-xl font-bold text-[#faf7f2] mb-4">
                Full Privileges & Access Included:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plan.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1a1816] border border-[#2b2723] text-xs text-[#faf7f2]">
                    <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#332f2a] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#9e968b]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instant membership card issuance & dashboard activation</span>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#d4af37] text-[#121110] font-editorial font-bold text-xs uppercase tracking-wider hover:bg-[#fae69e] transition-all flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4 text-[#121110]" />
                <span>Enroll in {plan.duration}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Member Info Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#1a1816] border border-[#d4af37]/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#faf7f2]">
            <h3 className="font-editorial text-xl font-bold mb-4">
              Enter Member Information
            </h3>
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-1/3 py-3 rounded-xl border border-[#332f2a] text-[#9e968b] text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-xl bg-[#d4af37] text-[#121110] font-editorial font-bold text-xs uppercase"
                >
                  Continue to Payment (₹{plan.price.toLocaleString('en-IN')})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        title={plan.name}
        subtitle={`${plan.duration} Internship`}
        amount={plan.price}
        itemType="membership"
        onPaymentSuccess={handlePaymentSuccess}
      />
    </PageTransition>
  );
};
