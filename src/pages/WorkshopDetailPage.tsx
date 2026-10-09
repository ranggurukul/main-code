import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { PaymentModal } from '../components/PaymentModal';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  Lock,
  Upload,
  AlertCircle,
  FileCheck,
  ChevronRight,
} from 'lucide-react';
import type { FormField } from '../types/database';

export const WorkshopDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workshops, submitWorkshopRegistration } = useDatabase();
  const { currentMember, isMemberLoggedIn } = useAuth();

  const workshop = workshops.find((w) => w.id === id) || workshops[0];

  // Dynamic Form state mapped to field.id
  const [formAnswers, setFormAnswers] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    if (workshop?.formFields) {
      workshop.formFields.forEach((field) => {
        if (field.type === 'checkbox') {
          init[field.id] = [];
        } else if (field.id === 'field_name' && currentMember) {
          init[field.id] = currentMember.name;
        } else if (field.id === 'field_email' && currentMember) {
          init[field.id] = currentMember.email;
        } else if (field.id === 'field_phone' && currentMember) {
          init[field.id] = currentMember.phone;
        } else {
          init[field.id] = '';
        }
      });
    }
    return init;
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [completedRegistration, setCompletedRegistration] = useState<any>(null);

  if (!workshop) {
    return (
      <div className="pt-40 text-center text-[#faf7f2]">
        <h2 className="text-2xl font-editorial">Workshop not found</h2>
        <Link to="/workshops" className="text-[#d4af37] underline mt-4 inline-block">
          Return to Workshops
        </Link>
      </div>
    );
  }

  const handleInputChange = (fieldId: string, value: any) => {
    setFormAnswers((prev) => ({ ...prev, [fieldId]: value }));
    if (formErrors[fieldId]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleCheckboxChange = (fieldId: string, option: string) => {
    setFormAnswers((prev) => {
      const current = (prev[fieldId] as string[]) || [];
      if (current.includes(option)) {
        return { ...prev, [fieldId]: current.filter((o) => o !== option) };
      }
      return { ...prev, [fieldId]: [...current, option] };
    });
  };

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const errors: Record<string, string> = {};
    workshop.formFields.forEach((field) => {
      const val = formAnswers[field.id];
      if (field.required) {
        if (field.type === 'checkbox') {
          if (!val || (Array.isArray(val) && val.length === 0)) {
            errors[field.id] = 'Please select at least one option.';
          }
        } else if (val === undefined || val === null || String(val).trim() === '') {
          errors[field.id] = `${field.label} is required.`;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = ({ transactionId, paymentMethod }: { transactionId: string; paymentMethod: string }) => {
    setIsPaymentOpen(false);

    // Extract primary applicant details from form answers or fallback
    const participantName = formAnswers['field_name'] || formAnswers['f_name'] || currentMember?.name || 'Applicant';
    const participantEmail = formAnswers['field_email'] || formAnswers['f_email'] || currentMember?.email || 'applicant@example.com';
    const participantPhone = formAnswers['field_phone'] || formAnswers['f_phone'] || currentMember?.phone || '+91 98000 00000';

    const reg = submitWorkshopRegistration({
      workshopId: workshop.id,
      participantName,
      participantEmail,
      participantPhone,
      amountPaid: workshop.price,
      answers: formAnswers,
      paymentMethod,
    });

    setCompletedRegistration(reg);
  };

  // Render individual dynamic field
  const renderField = (field: FormField) => {
    const error = formErrors[field.id];
    const value = formAnswers[field.id] ?? '';

    switch (field.type) {
      case 'longtext':
        return (
          <div key={field.id} className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-[#d8d0c5] font-semibold">
              {field.label} {field.required && <span className="text-[#c85a32]">*</span>}
            </label>
            {field.helperText && <p className="text-[11px] text-[#9e968b]">{field.helperText}</p>}
            <textarea
              rows={4}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder || 'Enter your response...'}
              className="w-full px-4 py-3 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
            />
            {error && <span className="text-xs text-rose-400">{error}</span>}
          </div>
        );

      case 'dropdown':
        return (
          <div key={field.id} className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-[#d8d0c5] font-semibold">
              {field.label} {field.required && <span className="text-[#c85a32]">*</span>}
            </label>
            {field.helperText && <p className="text-[11px] text-[#9e968b]">{field.helperText}</p>}
            <select
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
            >
              <option value="">-- Please Select --</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {error && <span className="text-xs text-rose-400">{error}</span>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-[#d8d0c5] font-semibold">
              {field.label} {field.required && <span className="text-[#c85a32]">*</span>}
            </label>
            {field.helperText && <p className="text-[11px] text-[#9e968b]">{field.helperText}</p>}
            <div className="space-y-2 pt-1">
              {field.options?.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#201e1b] border border-[#332f2a] cursor-pointer hover:border-[#d4af37]/40 text-xs text-[#faf7f2]"
                >
                  <input
                    type="radio"
                    name={field.id}
                    value={opt}
                    checked={value === opt}
                    onChange={() => handleInputChange(field.id, opt)}
                    className="accent-[#d4af37]"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {error && <span className="text-xs text-rose-400">{error}</span>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-[#d8d0c5] font-semibold">
              {field.label} {field.required && <span className="text-[#c85a32]">*</span>}
            </label>
            {field.helperText && <p className="text-[11px] text-[#9e968b]">{field.helperText}</p>}
            <div className="space-y-2 pt-1">
              {field.options?.map((opt) => {
                const checked = Array.isArray(value) && value.includes(opt);
                return (
                  <label
                    key={opt}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#201e1b] border border-[#332f2a] cursor-pointer hover:border-[#d4af37]/40 text-xs text-[#faf7f2]"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxChange(field.id, opt)}
                      className="accent-[#d4af37]"
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
            {error && <span className="text-xs text-rose-400">{error}</span>}
          </div>
        );

      case 'file':
        return (
          <div key={field.id} className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-[#d8d0c5] font-semibold">
              {field.label} {field.required && <span className="text-[#c85a32]">*</span>}
            </label>
            {field.helperText && <p className="text-[11px] text-[#9e968b]">{field.helperText}</p>}
            <div className="p-4 rounded-xl border border-dashed border-[#d4af37]/40 bg-[#201e1b] text-center">
              <Upload className="w-5 h-5 text-[#d4af37] mx-auto mb-1.5" />
              <input
                type="text"
                value={value}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder="Upload demo link / file name"
                className="w-full px-3 py-1.5 rounded-lg bg-[#161513] border border-[#332f2a] text-[#faf7f2] text-xs text-center focus:outline-none"
              />
              <span className="text-[10px] text-[#9e968b] mt-1 block">
                Attach Portfolio, Audition Video link or CV (PDF/MP4/Doc)
              </span>
            </div>
            {error && <span className="text-xs text-rose-400">{error}</span>}
          </div>
        );

      default:
        // text, email, phone, number, date, address, emergency_contact
        return (
          <div key={field.id} className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wider text-[#d8d0c5] font-semibold">
              {field.label} {field.required && <span className="text-[#c85a32]">*</span>}
            </label>
            {field.helperText && <p className="text-[11px] text-[#9e968b]">{field.helperText}</p>}
            <input
              type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'email' ? 'email' : 'text'}
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              className="w-full px-4 py-3 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none transition-colors"
            />
            {error && <span className="text-xs text-rose-400">{error}</span>}
          </div>
        );
    }
  };

  return (
    <PageTransition>
      {/* Header Banner */}
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-12 bg-[#161412] border-b border-[#2b2723]">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/workshops"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#9e968b] hover:text-[#d4af37] transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Masterclasses</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-[#c85a32]/20 border border-[#c85a32]/40 text-[#c85a32] text-xs font-semibold uppercase tracking-wider">
                  {workshop.category} Masterclass
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  {workshop.availableSeats} of {workshop.maxParticipants} Seats Left
                </span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-5xl text-[#faf7f2] font-bold leading-tight">
                {workshop.title}
              </h1>

              <div className="text-sm sm:text-base text-[#d4af37] font-medium mt-2">
                {workshop.subtitle}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-[#d8d0c5]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#d4af37]" />
                  <span>{workshop.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#d4af37]" />
                  <span>{workshop.duration} ({workshop.time})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                  <span>{workshop.location}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-[#201e1b] border border-[#d4af37]/30 shadow-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#9e968b]">Tuition Fee</span>
                  <div className="font-mono text-3xl sm:text-4xl font-bold text-[#d4af37]">
                    ₹{workshop.price.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-[#9e968b]">Includes raw materials & meals</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-[#c85a32] block font-semibold">{workshop.status}</span>
                  <a
                    href="#registration-form"
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d4af37] text-[#121110] font-semibold text-xs uppercase tracking-wider hover:bg-[#fae69e] transition-all"
                  >
                    <span>Jump to Form</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#121110]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Workshop Details, Mentor Bio, Benefits */}
          <div className="lg:col-span-6 space-y-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2 font-mono">
                Curriculum Overview
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[#faf7f2] font-bold">
                About the Immersion
              </h2>
              <p className="mt-4 text-sm text-[#d8d0c5] leading-relaxed font-light">
                {workshop.description}
              </p>
            </div>

            {/* Mentor Profile */}
            <div className="p-6 rounded-2xl bg-[#1a1816] border border-[#332f2a] flex items-center gap-5">
              {workshop.instructorAvatar && (
                <img
                  src={workshop.instructorAvatar}
                  alt={workshop.instructor}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#d4af37]/60"
                />
              )}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold">
                  Course Director & Lead Guru
                </span>
                <h3 className="font-editorial text-xl font-bold text-[#faf7f2]">
                  {workshop.instructor}
                </h3>
                <p className="text-xs text-[#9e968b] mt-1 leading-relaxed">
                  {workshop.instructorBio}
                </p>
              </div>
            </div>

            {/* Key Benefits */}
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#faf7f2] mb-4">
                What Participants Receive
              </h3>
              <div className="space-y-3">
                {workshop.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-[#d8d0c5]">
                    <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#faf7f2] mb-4">
                Prerequisites & Preparation
              </h3>
              <div className="space-y-3">
                {workshop.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-[#9e968b]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c85a32] shrink-0 mt-1.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Custom Dynamic Registration Form */}
          <div className="lg:col-span-6" id="registration-form">
            <div className="theatre-card p-6 sm:p-8 rounded-2xl border border-[#d4af37]/30 sticky top-28 shadow-2xl">
              {completedRegistration ? (
                /* Success Receipt Screen */
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37]">
                    REGISTRATION CONFIRMED
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#faf7f2]">
                    Seat Reserved Successfully
                  </h3>
                  <div className="p-4 rounded-xl bg-[#161412] border border-[#2b2723] text-left space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#9e968b]">Registration Pass ID:</span>
                      <span className="font-mono text-[#d4af37] font-bold">
                        {completedRegistration.registrationNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9e968b]">Participant Name:</span>
                      <span className="text-[#faf7f2] font-medium">
                        {completedRegistration.participantName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9e968b]">Workshop:</span>
                      <span className="text-[#faf7f2] font-medium truncate max-w-[200px]">
                        {completedRegistration.workshopTitle}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9e968b]">Amount Paid:</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        ₹{completedRegistration.amountPaid.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#9e968b]">
                    A copy of your registration dossier and campus arrival guidelines have been dispatched to your email.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/member"
                      className="flex-1 py-3 rounded-xl bg-[#d4af37] text-[#121110] font-semibold text-xs uppercase tracking-wider text-center"
                    >
                      View in Member Portal
                    </Link>
                    <button
                      type="button"
                      onClick={() => setCompletedRegistration(null)}
                      className="px-4 py-3 rounded-xl border border-[#332f2a] text-[#9e968b] hover:text-[#faf7f2] text-xs font-semibold uppercase tracking-wider"
                    >
                      Register Another
                    </button>
                  </div>
                </div>
              ) : (
                /* Dynamic Form */
                <form onSubmit={handleStartPayment} className="space-y-5">
                  <div className="border-b border-[#332f2a] pb-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#c85a32] font-semibold block">
                      Custom Application Form
                    </span>
                    <h3 className="font-editorial text-xl font-bold text-[#faf7f2]">
                      Workshop Registration
                    </h3>
                    <p className="text-xs text-[#9e968b] mt-1">
                      Complete the dynamic fields below to reserve your studio workstation.
                    </p>
                  </div>

                  {/* Render all custom form fields configured for this workshop */}
                  <div className="space-y-4">
                    {workshop.formFields.map((field) => renderField(field))}
                  </div>

                  {/* Pricing summary */}
                  <div className="pt-4 border-t border-[#332f2a] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#9e968b] uppercase">Total Tuition</span>
                      <div className="font-mono text-xl font-bold text-[#d4af37]">
                        ₹{workshop.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="text-[11px] text-[#9e968b]">
                      Instant confirmation via Razorpay/Stripe
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl font-editorial font-bold text-sm tracking-wider uppercase text-[#121110] bg-gradient-to-r from-[#d4af37] via-[#f3d068] to-[#d4af37] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
                  >
                    <Sparkles className="w-4 h-4 text-[#121110]" />
                    <span>Proceed to Payment (₹{workshop.price.toLocaleString('en-IN')})</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        title={workshop.title}
        subtitle={`${workshop.duration} • Guided by ${workshop.instructor}`}
        amount={workshop.price}
        itemType="workshop"
        onPaymentSuccess={handlePaymentSuccess}
      />
    </PageTransition>
  );
};
