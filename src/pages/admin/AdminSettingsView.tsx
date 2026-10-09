import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  CreditCard,
  Mail,
  Globe,
  Phone,
  Save,
  CheckCircle2,
  Cloud,
  Database,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import type { SiteSettings, PaymentGatewayConfig, EmailProviderConfig } from '../../types/database';
import { MediaUploadField } from '../../components/media/MediaUploadField';
import { firebaseConfig } from '../../services/firebase';
import { isFirebaseCloudEnabled, setFirebaseCloudEnabled } from '../../services/storage';

export const AdminSettingsView: React.FC = () => {
  const {
    siteSettings,
    updateSiteSettings,
    paymentConfig,
    updatePaymentConfig,
    emailConfig,
    updateEmailConfig,
    resetDatabase,
  } = useDatabase();

  const { isOwner } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'general' | 'contact' | 'payments' | 'email' | 'seo' | 'firebase'
  >('general');

  // Cloud Sync Toggle
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(isFirebaseCloudEnabled());

  const handleToggleCloudSync = () => {
    const nextVal = !cloudSyncEnabled;
    setCloudSyncEnabled(nextVal);
    setFirebaseCloudEnabled(nextVal);
  };

  // Form States
  const [siteForm, setSiteForm] = useState<SiteSettings>({ ...siteSettings });
  const [payForm, setPayForm] = useState<PaymentGatewayConfig>({ ...paymentConfig });
  const [mailForm, setMailForm] = useState<EmailProviderConfig>({ ...emailConfig });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(siteForm);
    updatePaymentConfig(payForm);
    updateEmailConfig(mailForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#25221e]">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-1">
            GLOBAL CONFIGURATION & INTEGRATIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-editorial">
            Institutional Settings & Gateways
          </h2>
          <p className="text-xs text-[#9e968b] mt-1">
            Configure contact coordinates, payment gateways, email providers, and SEO metadata.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#25221e] pb-px">
        {[
          { id: 'general', label: 'Website Identity', icon: Globe },
          { id: 'contact', label: 'Contact Coordinates', icon: Phone },
          { id: 'payments', label: 'Payment Gateways', icon: CreditCard },
          { id: 'email', label: 'Email Provider API', icon: Mail },
          { id: 'seo', label: 'SEO & Metadata', icon: Settings },
          { id: 'firebase', label: 'Firebase Cloud Storage', icon: Cloud },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-t-xl transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === tab.id
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

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* TAB 1: GENERAL IDENTITY */}
        {activeTab === 'general' && (
          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="font-editorial text-xl font-bold text-white mb-2">
              Sansthan Identity & Taglines
            </h3>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                Official Institution Name
              </label>
              <input
                type="text"
                value={siteForm.sansthanName}
                onChange={(e) => setSiteForm({ ...siteForm, sansthanName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                Institutional Tagline
              </label>
              <input
                type="text"
                value={siteForm.tagline}
                onChange={(e) => setSiteForm({ ...siteForm, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
              />
            </div>

            <div className="pt-2">
              <MediaUploadField
                label="Official Institution Crest / Monogram Logo"
                value={siteForm.logoImage || ''}
                onChange={(url) => setSiteForm({ ...siteForm, logoImage: url })}
                category="General"
                aspectRatio="1:1"
                helperText="Upload emblem from device or choose from Media Library"
              />
            </div>
          </div>
        )}

        {/* TAB 2: CONTACT */}
        {activeTab === 'contact' && (
          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="font-editorial text-xl font-bold text-white mb-2">
              Sanctum Coordinates & Phone Desks
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Official Contact Phone
                </label>
                <input
                  type="text"
                  value={siteForm.contactPhone}
                  onChange={(e) => setSiteForm({ ...siteForm, contactPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Official WhatsApp Desk Number
                </label>
                <input
                  type="text"
                  value={siteForm.whatsappNumber}
                  onChange={(e) => setSiteForm({ ...siteForm, whatsappNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-amber-400 mb-1 font-semibold">
                  Intern Personal Contact Number (Private Perk)
                </label>
                <input
                  type="text"
                  value={siteForm.personalContactNumber}
                  onChange={(e) => setSiteForm({ ...siteForm, personalContactNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-amber-300 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Official Contact Email
                </label>
                <input
                  type="email"
                  value={siteForm.contactEmail}
                  onChange={(e) => setSiteForm({ ...siteForm, contactEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                Campus Address Line 1
              </label>
              <input
                type="text"
                value={siteForm.addressLine1}
                onChange={(e) => setSiteForm({ ...siteForm, addressLine1: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">City</label>
                <input
                  type="text"
                  value={siteForm.city}
                  onChange={(e) => setSiteForm({ ...siteForm, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">State</label>
                <input
                  type="text"
                  value={siteForm.state}
                  onChange={(e) => setSiteForm({ ...siteForm, state: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1">Pincode</label>
                <input
                  type="text"
                  value={siteForm.pincode}
                  onChange={(e) => setSiteForm({ ...siteForm, pincode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT GATEWAY */}
        {activeTab === 'payments' && (
          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#25221e]">
              <div>
                <h3 className="font-editorial text-xl font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <span>Payment Gateway Integration</span>
                </h3>
                <p className="text-xs text-[#9e968b] mt-0.5">
                  Configure Razorpay and Stripe settlement adapters. Secrets remain secure on backend.
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30">
                {payForm.testMode ? 'SANDBOX TEST MODE' : 'PRODUCTION LIVE'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Default Gateway Provider
                </label>
                <select
                  value={payForm.provider}
                  onChange={(e) => setPayForm({ ...payForm, provider: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-amber-300 font-semibold text-xs"
                >
                  <option value="Razorpay">Razorpay (UPI, NetBanking, Cards)</option>
                  <option value="Stripe">Stripe (International Credit Cards, Apple Pay)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Currency Code
                </label>
                <input
                  type="text"
                  value={payForm.currency}
                  onChange={(e) => setPayForm({ ...payForm, currency: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                Razorpay Key ID (Public Client Key)
              </label>
              <input
                type="text"
                value={payForm.razorpayKeyId}
                onChange={(e) => setPayForm({ ...payForm, razorpayKeyId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                Stripe Publishable Key
              </label>
              <input
                type="text"
                value={payForm.stripePublishableKey}
                onChange={(e) => setPayForm({ ...payForm, stripePublishableKey: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs font-mono"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={payForm.testMode}
                  onChange={(e) => setPayForm({ ...payForm, testMode: e.target.checked })}
                  className="accent-amber-400"
                />
                <span>Enable Sandbox Simulator (Allows zero-charge test card and UPI authorizations)</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 4: EMAIL GATEWAY */}
        {activeTab === 'email' && (
          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-editorial text-xl font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-sky-400" />
                <span>Outbound Email Provider Setup</span>
              </h3>
              <p className="text-xs text-[#9e968b] mt-0.5">
                Pluggable connection for Resend, SendGrid, Amazon SES, or Mailgun.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Select Provider Service
                </label>
                <select
                  value={mailForm.provider}
                  onChange={(e) => setMailForm({ ...mailForm, provider: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-amber-300 font-semibold text-xs"
                >
                  <option value="Resend">Resend (Modern Developer API)</option>
                  <option value="SendGrid">SendGrid (Twilio)</option>
                  <option value="Amazon SES">Amazon Simple Email Service (SES)</option>
                  <option value="Mailgun">Mailgun by Sinch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Sender Email Address
                </label>
                <input
                  type="email"
                  value={mailForm.senderEmail}
                  onChange={(e) => setMailForm({ ...mailForm, senderEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                Sender Display Name
              </label>
              <input
                type="text"
                value={mailForm.senderName}
                onChange={(e) => setMailForm({ ...mailForm, senderName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                API Key (Masked for Security)
              </label>
              <input
                type="text"
                value={mailForm.apiKeyMasked}
                onChange={(e) => setMailForm({ ...mailForm, apiKeyMasked: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs font-mono"
              />
            </div>
          </div>
        )}

        {/* TAB 5: SEO */}
        {activeTab === 'seo' && (
          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="font-editorial text-xl font-bold text-white mb-2">
              Search Engine Optimization (SEO)
            </h3>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                Global Page Title Tag
              </label>
              <input
                type="text"
                value={siteForm.seoTitle}
                onChange={(e) => setSiteForm({ ...siteForm, seoTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={siteForm.seoDescription}
                onChange={(e) => setSiteForm({ ...siteForm, seoDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                Target Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={siteForm.seoKeywords}
                onChange={(e) => setSiteForm({ ...siteForm, seoKeywords: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
              />
            </div>

            <div className="pt-2">
              <MediaUploadField
                label="Social Share & Open Graph Card Banner"
                value={siteForm.ogImage || ''}
                onChange={(url) => setSiteForm({ ...siteForm, ogImage: url })}
                category="General"
                aspectRatio="16:9"
                helperText="Rich preview image shown when sharing links on WhatsApp, Twitter, and Facebook"
              />
            </div>
          </div>
        )}

        {/* TAB 6: FIREBASE CLOUD STORAGE & ANALYTICS */}
        {activeTab === 'firebase' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1d1b17] to-[#161412] border border-amber-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-lg font-bold text-white flex items-center gap-2">
                      Google Firebase Cloud Integration
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/80 border border-emerald-500/50 text-emerald-400">
                        Active & Connected
                      </span>
                    </h3>
                    <p className="text-xs text-[#9e968b]">
                      Cloud object storage for media files, Google Analytics tracking, and auth infrastructure.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Cloud Sync Mode Switch */}
              <div className="mt-4 pt-4 border-t border-[#332f2a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Cloud Upload Mode
                  </h4>
                  <p className="text-[11px] text-[#9e968b] mt-0.5">
                    {cloudSyncEnabled
                      ? 'Uploading directly to rang-gurukul.firebasestorage.app (requires active Blaze billing in Firebase console).'
                      : 'Currently using Instant Local High-Speed Storage (0ms delay, 100% reliable, zero card or setup required).'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleCloudSync}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                    cloudSyncEnabled
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                      : 'bg-[#2b2723] hover:bg-[#38332d] text-white border border-[#3e3831]'
                  }`}
                >
                  {cloudSyncEnabled ? 'Cloud Sync: ON' : 'Fast Local Mode (Active)'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#201e1b] border border-[#332f2a] space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#9e968b]">
                  <Database className="w-3.5 h-3.5 text-amber-400" />
                  <span>Firebase Storage Bucket</span>
                </div>
                <p className="text-sm font-mono font-semibold text-white break-all">
                  {firebaseConfig.storageBucket}
                </p>
                <p className="text-[11px] text-[#787168]">
                  Direct target for all device photo uploads, multi-size WebP variants, and museum albums.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#201e1b] border border-[#332f2a] space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#9e968b]">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Firebase Project ID</span>
                </div>
                <p className="text-sm font-mono font-semibold text-white">
                  {firebaseConfig.projectId}
                </p>
                <p className="text-[11px] text-[#787168]">
                  Associated with Google Cloud Project console: {firebaseConfig.authDomain}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#201e1b] border border-[#332f2a] space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#9e968b]">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>Measurement ID (Google Analytics 4)</span>
                </div>
                <p className="text-sm font-mono font-semibold text-white">
                  {firebaseConfig.measurementId}
                </p>
                <p className="text-[11px] text-[#787168]">
                  Real-time visitor analytics, performance monitoring, and page hit recording.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#201e1b] border border-[#332f2a] space-y-1">
                <div className="flex items-center gap-2 text-xs text-[#9e968b]">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Offline / Local Fallback Architecture</span>
                </div>
                <p className="text-sm font-mono font-semibold text-emerald-400">
                  IndexedDB Object Store (rang_gurukul_media_storage_v1)
                </p>
                <p className="text-[11px] text-[#787168]">
                  Zero-downtime failover ensures uploads never fail even when network connectivity drops.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#1a1815] border border-[#2e2a25] text-xs text-[#9e968b] leading-relaxed">
              <strong className="text-amber-400 font-semibold block mb-1">
                Firebase Security Rule Configuration Guide:
              </strong>
              To allow administrators to upload photos directly from the admin panel, ensure your Firebase Console Storage rules allow read/write access. In the Firebase Console, under <strong>Storage → Rules</strong>:
              <pre className="mt-2 p-3 rounded-lg bg-black/60 text-amber-300/90 font-mono text-[11px] overflow-x-auto border border-[#3a3530]">
{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /media/{allPaths=**} {
      allow read: if true;
      allow write: if true; // or request.auth != null
    }
  }
}`}
              </pre>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[#25221e]">
          {isOwner && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all repository data to clean seed defaults? This resets modified plans, workshops, and photos.')) {
                  resetDatabase();
                  window.location.reload();
                }
              }}
              className="text-xs text-rose-400 hover:text-rose-300 underline"
            >
              Reset Database to Initial Seed
            </button>
          )}

          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg ml-auto"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
