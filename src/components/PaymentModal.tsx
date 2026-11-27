import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, Loader2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useDatabase } from '../context/DatabaseContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  amount: number;
  itemType: 'membership' | 'workshop' | 'event' | 'patronage';
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onPaymentSuccess: (details: {
    transactionId: string;
    paymentMethod: string;
    amount: number;
    orderId?: string;
  }) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  amount,
  itemType,
  prefill,
  onPaymentSuccess,
}) => {
  const { paymentConfig } = useDatabase();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [txnId, setTxnId] = useState('');

  if (!isOpen) return null;

  const handleRazorpayPay = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. STEP 1: BACKEND - Create Order
      const amountInPaise = Math.round(amount * 100);
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${itemType}_${Date.now()}`,
          notes: {
            itemTitle: title,
            itemType,
          },
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || orderData.message || 'Failed to initialize payment order.');
      }

      // Check if Razorpay SDK script is loaded
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay Checkout SDK is still loading. Please check your internet connection.');
      }

      // Get Razorpay Key from environment or database config
      const razorpayKey =
        (import.meta as any).env?.VITE_RAZORPAY_KEY_ID ||
        paymentConfig.razorpayKeyId ||
        'rzp_test_U55Trtrut503Is';

      // 2. STEP 2: FRONTEND - Open Razorpay Modal
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Rang Gurukul Sansthan',
        description: `${title} (${subtitle || itemType.toUpperCase()})`,
        image: '/logo.png',
        order_id: orderData.order_id,
        theme: {
          color: '#D4AF37',
          backdrop_color: '#121110',
        },
        prefill: {
          name: prefill?.name || '',
          email: prefill?.email || '',
          contact: prefill?.contact || '',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 3. STEP 3: BACKEND - Verify Signature
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.message || 'Signature verification failed. Payment authenticity unverified.');
            }

            // Payment verified authentic!
            const verifiedTxnId = response.razorpay_payment_id;
            setTxnId(verifiedTxnId);
            setIsProcessing(false);
            setIsSuccess(true);

            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#D4AF37', '#C85A32', '#FAF7F2', '#D96B27'],
            });

            setTimeout(() => {
              onPaymentSuccess({
                transactionId: verifiedTxnId,
                paymentMethod: 'Razorpay Standard Checkout (UPI / Card / NetBanking)',
                amount,
                orderId: response.razorpay_order_id,
              });
              setIsSuccess(false);
              onClose();
            }, 1500);
          } catch (err: any) {
            setIsProcessing(false);
            setErrorMessage(err.message || 'Payment verification encountered an unexpected error.');
          }
        },
      };

      const rzpInstance = new window.Razorpay(options);

      rzpInstance.on('payment.failed', (response: any) => {
        setIsProcessing(false);
        const errDesc = response.error?.description || 'Payment was declined or cancelled.';
        setErrorMessage(`Payment Failed: ${errDesc}`);
      });

      rzpInstance.open();
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Could not initiate payment. Please try again.');
    }
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
                Razorpay Standard Gateway
              </div>
              <h3 className="font-editorial text-lg text-[#faf7f2] font-bold">
                Complete Cultural Contribution
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-[#9e968b] hover:text-[#faf7f2] hover:bg-[#282522] transition-colors disabled:opacity-50"
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

          {/* Supported Methods Badges */}
          <div className="p-4 rounded-xl bg-[#161513] border border-[#2a2622] space-y-2.5">
            <div className="text-xs text-[#d8d0c5] font-medium flex items-center justify-between">
              <span>Accepted Instruments</span>
              <span className="text-[10px] uppercase font-mono text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/30">
                Official Razorpay Standard
              </span>
            </div>
            <p className="text-xs text-[#9e968b] leading-relaxed">
              When you click below, Razorpay's secure checkout modal will open with options for:
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono text-[#c4b9aa]">
              <span className="px-2.5 py-1 rounded-md bg-[#24211d] border border-[#3a3530]">UPI (GPay / PhonePe / Paytm)</span>
              <span className="px-2.5 py-1 rounded-md bg-[#24211d] border border-[#3a3530]">Debit / Credit Cards</span>
              <span className="px-2.5 py-1 rounded-md bg-[#24211d] border border-[#3a3530]">NetBanking (50+ Banks)</span>
              <span className="px-2.5 py-1 rounded-md bg-[#24211d] border border-[#3a3530]">Cred / Wallets</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/50 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Security Assurance */}
          <div className="flex items-center gap-2 text-xs text-[#9e968b]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>256-bit TLS encrypted transaction with HMAC-SHA256 signature verification.</span>
          </div>

          {/* Action Button */}
          {isSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
              <span className="font-semibold text-sm">Payment Verified! ID: {txnId}</span>
            </div>
          ) : (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleRazorpayPay}
              className="w-full py-3.5 px-6 rounded-xl font-editorial font-bold text-sm tracking-wider uppercase text-[#121110] bg-gradient-to-r from-[#d4af37] via-[#f3d068] to-[#d4af37] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.3)] disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to Razorpay...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#121110]" />
                  <span>Pay ₹{amount.toLocaleString('en-IN')} via Razorpay</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
