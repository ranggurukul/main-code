import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, CreditCard, Smartphone, Lock, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDatabase } from '../context/DatabaseContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  amount: number;
  itemType: 'membership' | 'workshop' | 'event';
  onPaymentSuccess: (details: {
    transactionId: string;
    paymentMethod: string;
    amount: number;
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  amount,
  itemType,
  onPaymentSuccess,
}) => {
  const { paymentConfig } = useDatabase();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('rasika@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9012');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    const generatedTxnId = `RZP_${Math.random().toString(36).substring(2, 9).toUpperCase()}_${Date.now().toString().slice(-4)}`;
    setTxnId(generatedTxnId);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#C85A32', '#FAF7F2', '#D96B27'],
      });

      setTimeout(() => {
        onPaymentSuccess({
          transactionId: generatedTxnId,
          paymentMethod: paymentMethod === 'upi' ? `UPI (${upiId})` : `Card (ending in 9012)`,
          amount,
        });
        setIsSuccess(false);
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#1a1816] border border-[#d4af37]/30 rounded-2xl shadow-2xl overflow-hidden text-[#faf7f2]">
        {/* Top Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#d4af37] via-[#c85a32] to-[#d4af37]" />

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#332f2a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                {paymentConfig.provider} Secure Gateway
              </div>
              <h3 className="font-editorial text-lg text-[#faf7f2] font-bold">
                Complete Cultural Contribution
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-[#9e968b] hover:text-[#faf7f2] hover:bg-[#282522] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Order Summary Box */}
          <div className="p-4 rounded-xl bg-[#201e1b] border border-[#332f2a] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#c85a32]/20 text-[#c85a32] font-semibold">
                {itemType.toUpperCase()}
              </span>
              <h4 className="font-editorial text-base text-[#faf7f2] font-bold mt-1">
                {title}
              </h4>
              <p className="text-xs text-[#9e968b]">{subtitle}</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase text-[#9e968b]">Total Payable</div>
              <div className="font-mono text-2xl font-bold text-[#d4af37]">
                ₹{amount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-2 font-medium">
              Select Payment Instrument
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-[#d4af37] bg-[#282522] text-[#faf7f2] shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                    : 'border-[#332f2a] bg-[#161513] text-[#9e968b] hover:text-[#faf7f2]'
                }`}
              >
                <Smartphone className={`w-5 h-5 ${paymentMethod === 'upi' ? 'text-[#d4af37]' : 'text-[#9e968b]'}`} />
                <div>
                  <div className="text-xs font-semibold">Instant UPI / QR</div>
                  <div className="text-[10px] text-[#9e968b]">GPay, PhonePe, Paytm</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#d4af37] bg-[#282522] text-[#faf7f2] shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                    : 'border-[#332f2a] bg-[#161513] text-[#9e968b] hover:text-[#faf7f2]'
                }`}
              >
                <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-[#d4af37]' : 'text-[#9e968b]'}`} />
                <div>
                  <div className="text-xs font-semibold">Card / NetBanking</div>
                  <div className="text-[10px] text-[#9e968b]">Visa, Mastercard, RuPay</div>
                </div>
              </button>
            </div>
          </div>

          {/* Method Fields */}
          {paymentMethod === 'upi' ? (
            <div className="p-4 rounded-xl bg-[#161513] border border-[#2a2622] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9e968b]">Virtual Payment Address (VPA):</span>
                <span className="text-[#d4af37] text-[10px] font-mono">Simulated Test Mode Active</span>
              </div>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@bank"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-sm font-mono focus:border-[#d4af37] focus:outline-none"
              />
              <p className="text-[11px] text-[#9e968b]">
                In test mode, clicking below approves the transaction instantly without actual bank charges.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#161513] border border-[#2a2622] space-y-3">
              <div>
                <label className="text-[11px] text-[#9e968b] block mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-sm font-mono focus:border-[#d4af37] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#9e968b] block mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-sm font-mono focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#9e968b] block mb-1">CVV</label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-sm font-mono focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Assurance */}
          <div className="flex items-center gap-2 text-xs text-[#9e968b]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>256-bit TLS encrypted transaction. Direct settlement into Rang Gurukul Sansthan trust account.</span>
          </div>

          {/* Action Button */}
          {isSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
              <span className="font-semibold text-sm">Payment Approved! Txn: {txnId}</span>
            </div>
          ) : (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handlePay}
              className="w-full py-3.5 px-6 rounded-xl font-editorial font-bold text-sm tracking-wider uppercase text-[#121110] bg-gradient-to-r from-[#d4af37] via-[#f3d068] to-[#d4af37] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.3)] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing Settlement...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#121110]" />
                  <span>Authorize ₹{amount.toLocaleString('en-IN')} & Confirm</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
