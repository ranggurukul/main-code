import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import {
  Plus,
  Edit2,
  Trash2,
  Settings,
  Search,
  Download,
  ArrowUp,
  ArrowDown,
  Layers,
  X,
  FileText,
} from 'lucide-react';
import type { Workshop, FormField, FormFieldType, WorkshopRegistration } from '../../types/database';
import { MediaUploadField } from '../../components/media/MediaUploadField';

export const AdminWorkshopsView: React.FC = () => {
  const {
    workshops,
    saveWorkshop,
    deleteWorkshop,
    updateWorkshopFormFields,
    workshopRegistrations,
    updateRegistrationStatus,
    deleteRegistration,
  } = useDatabase();

  const [activeSubTab, setActiveSubTab] = useState<'workshops' | 'form_builder' | 'registrations'>('workshops');

  // Workshop Edit / Add Modal
  const [editingWorkshop, setEditingWorkshop] = useState<Partial<Workshop> | null>(null);
  const [isWsModalOpen, setIsWsModalOpen] = useState(false);

  // Form Builder State
  const [selectedWorkshopIdForForm, setSelectedWorkshopIdForForm] = useState<string>(
    workshops[0]?.id || ''
  );
  const currentWorkshopForForm = workshops.find((w) => w.id === selectedWorkshopIdForForm) || workshops[0];

  // Field Add / Edit Modal inside Form Builder
  const [editingField, setEditingField] = useState<Partial<FormField> | null>(null);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [newOptionInput, setNewOptionInput] = useState('');

  // Registrations Filter & Inspector
  const [regSearch, setRegSearch] = useState('');
  const [regFilterStatus, setRegFilterStatus] = useState<string>('All');
  const [inspectingReg, setInspectingReg] = useState<WorkshopRegistration | null>(null);

  // --- WORKSHOP CRUD ---
  const handleOpenAddWorkshop = () => {
    setEditingWorkshop({
      title: '',
      subtitle: '',
      description: '',
      instructor: '',
      instructorBio: '',
      date: 'November 2026',
      time: '10:00 AM – 04:00 PM IST',
      duration: '3 Days',
      location: 'Rang Gurukul Sanctum Campus, Dehradun',
      price: 3500,
      maxParticipants: 20,
      availableSeats: 20,
      status: 'Open',
      category: 'Theatre',
      image: '/assets/craft.jpg',
    });
    setIsWsModalOpen(true);
  };

  const handleOpenEditWorkshop = (ws: Workshop) => {
    setEditingWorkshop({ ...ws });
    setIsWsModalOpen(true);
  };

  const handleSaveWorkshopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkshop?.title || !editingWorkshop.price) return;

    saveWorkshop({
      id: editingWorkshop.id,
      title: editingWorkshop.title,
      subtitle: editingWorkshop.subtitle,
      description: editingWorkshop.description,
      instructor: editingWorkshop.instructor,
      instructorBio: editingWorkshop.instructorBio,
      date: editingWorkshop.date,
      time: editingWorkshop.time,
      duration: editingWorkshop.duration,
      location: editingWorkshop.location,
      price: Number(editingWorkshop.price),
      maxParticipants: Number(editingWorkshop.maxParticipants || 20),
      availableSeats: Number(editingWorkshop.availableSeats ?? editingWorkshop.maxParticipants ?? 20),
      status: editingWorkshop.status || 'Open',
      category: editingWorkshop.category || 'Theatre',
      image: editingWorkshop.image || '/assets/craft.jpg',
    });

    setIsWsModalOpen(false);
    setEditingWorkshop(null);
  };

  // --- FORM BUILDER HANDLERS ---
  const handleOpenAddField = () => {
    setEditingField({
      id: 'field_' + Math.random().toString(36).substring(2, 9),
      label: 'New Question',
      type: 'text',
      placeholder: '',
      helperText: '',
      required: true,
      options: ['Option 1', 'Option 2', 'Option 3'],
      order: (currentWorkshopForForm?.formFields?.length || 0) + 1,
    });
    setIsFieldModalOpen(true);
  };

  const handleOpenEditField = (field: FormField) => {
    setEditingField({ ...field, options: field.options ? [...field.options] : [] });
    setIsFieldModalOpen(true);
  };

  const handleSaveFieldSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingField || !editingField.label || !currentWorkshopForForm) return;

    const currentFields = [...(currentWorkshopForForm.formFields || [])];
    const existingIdx = currentFields.findIndex((f) => f.id === editingField.id);

    const updatedField: FormField = {
      id: editingField.id || 'field_' + Date.now(),
      label: editingField.label,
      type: editingField.type || 'text',
      placeholder: editingField.placeholder || '',
      helperText: editingField.helperText || '',
      required: !!editingField.required,
      options: editingField.options,
      order: editingField.order ?? currentFields.length + 1,
    };

    if (existingIdx >= 0) {
      currentFields[existingIdx] = updatedField;
    } else {
      currentFields.push(updatedField);
    }

    updateWorkshopFormFields(currentWorkshopForForm.id, currentFields);
    setIsFieldModalOpen(false);
    setEditingField(null);
  };

  const handleDeleteField = (fieldId: string) => {
    if (!currentWorkshopForForm) return;
    const currentFields = currentWorkshopForForm.formFields.filter((f) => f.id !== fieldId);
    updateWorkshopFormFields(currentWorkshopForForm.id, currentFields);
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    if (!currentWorkshopForForm) return;
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= currentWorkshopForForm.formFields.length) return;

    const currentFields = [...currentWorkshopForForm.formFields];
    const temp = currentFields[index];
    currentFields[index] = currentFields[newIdx];
    currentFields[newIdx] = temp;

    // re-assign orders
    currentFields.forEach((f, idx) => {
      f.order = idx + 1;
    });

    updateWorkshopFormFields(currentWorkshopForForm.id, currentFields);
  };

  const handleAddOptionToField = () => {
    if (!newOptionInput.trim() || !editingField) return;
    const currentOpts = editingField.options || [];
    setEditingField({ ...editingField, options: [...currentOpts, newOptionInput.trim()] });
    setNewOptionInput('');
  };

  const handleRemoveOptionFromField = (optIdx: number) => {
    if (!editingField || !editingField.options) return;
    setEditingField({
      ...editingField,
      options: editingField.options.filter((_, i) => i !== optIdx),
    });
  };

  // --- REGISTRATIONS EXPORT & FILTER ---
  const filteredRegistrations = workshopRegistrations.filter((r) => {
    const matchesSearch =
      r.participantName.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.participantEmail.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.registrationNumber.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.workshopTitle.toLowerCase().includes(regSearch.toLowerCase());

    const matchesStatus =
      regFilterStatus === 'All' || r.registrationStatus === regFilterStatus;

    return matchesSearch && matchesStatus;
  });

  const exportRegistrationsCSV = () => {
    const headers = ['Registration No', 'Workshop', 'Applicant Name', 'Email', 'Phone', 'Amount Paid', 'Status', 'Date'];
    const rows = filteredRegistrations.map((r) => [
      r.registrationNumber,
      `"${r.workshopTitle}"`,
      `"${r.participantName}"`,
      r.participantEmail,
      r.participantPhone,
      r.amountPaid,
      r.registrationStatus,
      new Date(r.registrationDate).toLocaleDateString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RangGurukul_Workshop_Registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#25221e]">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-1">
            ACADEMIC STUDIOS & FORM BUILDER
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-editorial">
            Workshops & Dynamic Registration Forms
          </h2>
          <p className="text-xs text-[#9e968b] mt-1">
            Build custom application forms with drop-downs, text fields, radio buttons, file uploads and manage student registrations.
          </p>
        </div>

        {activeSubTab === 'workshops' && (
          <button
            onClick={handleOpenAddWorkshop}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Workshop</span>
          </button>
        )}

        {activeSubTab === 'registrations' && (
          <button
            onClick={exportRegistrationsCSV}
            className="px-4 py-2 rounded-xl bg-[#282522] hover:bg-amber-400 hover:text-black text-amber-400 font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2 border border-amber-500/30"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-[#25221e] pb-px">
        {[
          { id: 'workshops', label: `Workshops List (${workshops.length})` },
          { id: 'form_builder', label: `Custom Form Builder` },
          { id: 'registrations', label: `Student Registrations (${workshopRegistrations.length})` },
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

      {/* TAB 1: WORKSHOPS LIST */}
      {activeSubTab === 'workshops' && (
        <div className="bg-[#181614] border border-[#2b2723] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#201e1b] text-[#9e968b] uppercase tracking-wider text-[10px] border-b border-[#2b2723]">
                <tr>
                  <th className="py-3.5 px-4">Workshop</th>
                  <th className="py-3.5 px-4">Instructor</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4">Fee (₹)</th>
                  <th className="py-3.5 px-4">Seats</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#25221e] text-[#faf7f2]">
                {workshops.map((ws) => (
                  <tr key={ws.id} className="hover:bg-[#1f1d1a] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{ws.title}</div>
                      <div className="text-[11px] text-[#9e968b] line-clamp-1">{ws.subtitle}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#d8d0c5]">{ws.instructor}</td>
                    <td className="py-3.5 px-4 text-amber-300 font-mono">{ws.category}</td>
                    <td className="py-3.5 px-4 text-[#9e968b]">{ws.date}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      ₹{ws.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-emerald-400 font-bold">{ws.availableSeats}</span> / {ws.maxParticipants}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        {ws.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedWorkshopIdForForm(ws.id);
                            setActiveSubTab('form_builder');
                          }}
                          className="px-2.5 py-1 rounded bg-[#25221e] hover:bg-amber-400 hover:text-black text-amber-300 text-[10px] font-semibold flex items-center gap-1"
                          title="Open Form Builder"
                        >
                          <Settings className="w-3 h-3" />
                          <span>Form ({ws.formFields?.length || 0})</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditWorkshop(ws)}
                          className="p-1 rounded bg-[#25221e] hover:bg-amber-400 hover:text-black text-[#9e968b]"
                          title="Edit Workshop"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteWorkshop(ws.id)}
                          className="p-1 rounded bg-[#25221e] hover:bg-rose-950 hover:text-rose-400 text-[#9e968b]"
                          title="Delete Workshop"
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

      {/* TAB 2: DYNAMIC FORM BUILDER */}
      {activeSubTab === 'form_builder' && currentWorkshopForForm && (
        <div className="space-y-6">
          {/* Workshop Selector Banner */}
          <div className="p-5 rounded-2xl bg-[#181614] border border-[#2b2723] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#9e968b] block mb-1">
                EDITING REGISTRATION FORM FOR:
              </span>
              <div className="flex items-center gap-3">
                <select
                  value={selectedWorkshopIdForForm}
                  onChange={(e) => setSelectedWorkshopIdForForm(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-[#201e1b] border border-amber-500/40 text-amber-300 font-editorial font-bold text-base focus:outline-none"
                >
                  {workshops.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title} (Fee: ₹{w.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleOpenAddField}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Form Field</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Field Structure Table */}
            <div className="lg:col-span-7 bg-[#181614] border border-[#2b2723] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#25221e]">
                <h3 className="font-editorial text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Configured Form Fields ({currentWorkshopForForm.formFields.length})</span>
                </h3>
                <span className="text-[11px] text-[#9e968b]">Drag/reorder to change appearance</span>
              </div>

              <div className="space-y-3">
                {currentWorkshopForForm.formFields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="p-4 rounded-xl bg-[#201e1b] border border-[#2d2925] flex items-center justify-between gap-4 text-xs hover:border-amber-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-amber-400 font-bold w-5">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{field.label}</span>
                          {field.required && <span className="text-[#c85a32] text-xs">*</span>}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#9e968b] mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-[#2b2723] text-amber-300 font-mono uppercase">
                            {field.type}
                          </span>
                          {field.options && field.options.length > 0 && (
                            <span>{field.options.length} options ({field.options.join(', ')})</span>
                          )}
                          {field.helperText && <span className="italic truncate max-w-xs">{field.helperText}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        disabled={idx === 0}
                        onClick={() => handleMoveField(idx, 'up')}
                        className="p-1 rounded bg-[#282522] text-[#9e968b] hover:text-white disabled:opacity-20"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === currentWorkshopForForm.formFields.length - 1}
                        onClick={() => handleMoveField(idx, 'down')}
                        className="p-1 rounded bg-[#282522] text-[#9e968b] hover:text-white disabled:opacity-20"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEditField(field)}
                        className="p-1.5 rounded bg-[#282522] hover:bg-amber-400 hover:text-black text-amber-400"
                        title="Edit Field"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteField(field.id)}
                        className="p-1.5 rounded bg-[#282522] hover:bg-rose-950 hover:text-rose-400 text-[#9e968b]"
                        title="Delete Field"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Form Preview Panel */}
            <div className="lg:col-span-5 bg-[#181614] border border-[#2b2723] rounded-2xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#25221e]">
                <h3 className="font-editorial text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Live Student Form Preview</span>
                </h3>
                <span className="text-[10px] uppercase font-mono text-emerald-400">Interactive</span>
              </div>

              <div className="space-y-4 pt-2">
                {currentWorkshopForForm.formFields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <label className="block text-[11px] uppercase tracking-wider text-[#d8d0c5] font-semibold">
                      {field.label} {field.required && <span className="text-[#c85a32]">*</span>}
                    </label>
                    {field.type === 'dropdown' ? (
                      <select disabled className="w-full px-3 py-2 rounded-lg bg-[#201e1b] border border-[#332f2a] text-[#9e968b] text-xs">
                        <option>-- Select from {field.options?.join(', ')} --</option>
                      </select>
                    ) : field.type === 'longtext' ? (
                      <textarea disabled rows={2} placeholder={field.placeholder || 'Long response...'} className="w-full px-3 py-2 rounded-lg bg-[#201e1b] border border-[#332f2a] text-[#9e968b] text-xs" />
                    ) : field.type === 'radio' ? (
                      <div className="space-y-1 pt-1">
                        {field.options?.map((opt) => (
                          <div key={opt} className="flex items-center gap-2 text-xs text-[#9e968b]">
                            <input type="radio" disabled />
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    ) : field.type === 'checkbox' ? (
                      <div className="space-y-1 pt-1">
                        {field.options?.map((opt) => (
                          <div key={opt} className="flex items-center gap-2 text-xs text-[#9e968b]">
                            <input type="checkbox" disabled />
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <input disabled type="text" placeholder={field.placeholder || `Enter ${field.label}...`} className="w-full px-3 py-2 rounded-lg bg-[#201e1b] border border-[#332f2a] text-[#9e968b] text-xs" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REGISTRATIONS & APPLICATIONS */}
      {activeSubTab === 'registrations' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#9e968b] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={regSearch}
                onChange={(e) => setRegSearch(e.target.value)}
                placeholder="Search by student, pass ID, workshop..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9e968b]">Status:</span>
              <select
                value={regFilterStatus}
                onChange={(e) => setRegFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-xs text-white"
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#201e1b] text-[#9e968b] uppercase tracking-wider text-[10px] border-b border-[#2b2723]">
                  <tr>
                    <th className="py-3 px-4">Pass ID</th>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Workshop</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Tuition</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Application Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#25221e] text-[#faf7f2]">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-[#1f1d1a] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                        {reg.registrationNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{reg.participantName}</div>
                        <div className="text-[11px] text-[#9e968b]">{reg.participantEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-[200px] truncate">{reg.workshopTitle}</td>
                      <td className="py-3.5 px-4 text-[#9e968b]">
                        {new Date(reg.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        ₹{reg.amountPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          reg.registrationStatus === 'Approved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : reg.registrationStatus === 'Rejected'
                            ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}>
                          {reg.registrationStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInspectingReg(reg)}
                            className="px-3 py-1.5 rounded-lg bg-[#25221e] hover:bg-amber-400 hover:text-black text-amber-400 text-xs font-semibold"
                          >
                            View Answers
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete registration ${reg.registrationNumber}?`)) {
                                deleteRegistration(reg.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-[#25221e] hover:bg-rose-950 hover:text-rose-400 text-[#9e968b] transition-colors"
                            title="Delete Registration"
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
        </div>
      )}

      {/* FIELD ADD / EDIT MODAL */}
      {isFieldModalOpen && editingField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#181614] border border-amber-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#faf7f2] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#2b2723]">
              <h3 className="font-editorial text-xl font-bold text-white">
                Configure Dynamic Form Field
              </h3>
              <button onClick={() => setIsFieldModalOpen(false)} className="text-[#9e968b] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFieldSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Field Question / Label *
                </label>
                <input
                  type="text"
                  required
                  value={editingField.label || ''}
                  onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                  placeholder="e.g. Age Group, Performing Arts Lineage, Audio Reel URL"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Field Input Type
                </label>
                <select
                  value={editingField.type || 'text'}
                  onChange={(e) => setEditingField({ ...editingField, type: e.target.value as FormFieldType })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs focus:border-amber-400 focus:outline-none"
                >
                  <option value="text">Short Text (One line input)</option>
                  <option value="longtext">Long Text (Multi-line paragraph)</option>
                  <option value="email">Email Address</option>
                  <option value="phone">Phone / WhatsApp Number</option>
                  <option value="number">Number</option>
                  <option value="date">Date Picker</option>
                  <option value="dropdown">Dropdown Select</option>
                  <option value="radio">Radio Buttons (Single choice)</option>
                  <option value="checkbox">Checkboxes (Multiple choices)</option>
                  <option value="file">File Upload / Demo Reel Link</option>
                  <option value="address">Address Input</option>
                  <option value="emergency_contact">Emergency Contact Person & Phone</option>
                </select>
              </div>

              {/* Options Editor if dropdown, radio, or checkbox */}
              {['dropdown', 'radio', 'checkbox'].includes(editingField.type || '') && (
                <div className="p-4 rounded-xl bg-[#201e1b] border border-[#332f2a] space-y-3">
                  <label className="block text-xs uppercase tracking-wider text-amber-400 font-semibold">
                    Configured Options List
                  </label>
                  <div className="space-y-2">
                    {editingField.options?.map((opt, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded bg-[#181614] text-xs">
                        <span>{opt}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionFromField(i)}
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
                      value={newOptionInput}
                      onChange={(e) => setNewOptionInput(e.target.value)}
                      placeholder="Add option (e.g. 18–25)..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#181614] border border-[#3a3530] text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddOptionToField}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 text-black text-xs font-semibold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Placeholder / Description
                </label>
                <input
                  type="text"
                  value={editingField.placeholder || ''}
                  onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                  placeholder="Placeholder cue for student..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Helper / Explanatory Note
                </label>
                <input
                  type="text"
                  value={editingField.helperText || ''}
                  onChange={(e) => setEditingField({ ...editingField, helperText: e.target.value })}
                  placeholder="Optional explanatory guidance..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingField.required}
                    onChange={(e) => setEditingField({ ...editingField, required: e.target.checked })}
                    className="accent-amber-400"
                  />
                  <span>Mandatory / Required Field</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#2b2723] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFieldModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#332f2a] text-xs text-[#9e968b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase"
                >
                  Save Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT DYNAMIC REGISTRATION MODAL */}
      {inspectingReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#181614] border border-[#332f2a] rounded-2xl p-6 sm:p-8 text-[#faf7f2] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#2b2723]">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">
                  APPLICATION DOSSIER
                </span>
                <h3 className="font-editorial text-2xl font-bold text-white">
                  {inspectingReg.participantName}
                </h3>
              </div>
              <button onClick={() => setInspectingReg(null)} className="text-[#9e968b] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#24211e]">
                <span className="text-[#9e968b]">Pass ID:</span>
                <span className="font-mono text-amber-300 font-bold">{inspectingReg.registrationNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#24211e]">
                <span className="text-[#9e968b]">Workshop:</span>
                <span className="text-white font-semibold">{inspectingReg.workshopTitle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#24211e]">
                <span className="text-[#9e968b]">Email / Phone:</span>
                <span className="text-white">{inspectingReg.participantEmail} • {inspectingReg.participantPhone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#24211e]">
                <span className="text-[#9e968b]">Tuition Fee Paid:</span>
                <span className="font-mono text-emerald-400 font-bold">₹{inspectingReg.amountPaid.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Dynamic Form Responses */}
            <div className="mt-6 pt-4 border-t border-[#2b2723]">
              <h4 className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-3">
                Dynamic Application Form Answers
              </h4>
              <div className="space-y-3">
                {Object.entries(inspectingReg.answers || {}).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-xl bg-[#201e1b] border border-[#2d2925] text-xs">
                    <span className="text-[10px] text-[#9e968b] uppercase block font-mono">{key}</span>
                    <span className="text-white font-medium block mt-0.5 whitespace-pre-wrap">
                      {Array.isArray(val) ? val.join(', ') : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Approval / Rejection Actions */}
            <div className="mt-6 pt-4 border-t border-[#2b2723] flex items-center justify-between">
              <span className="text-xs text-[#9e968b]">Change Status:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    updateRegistrationStatus(inspectingReg.id, 'Approved');
                    setInspectingReg({ ...inspectingReg, registrationStatus: 'Approved' });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-semibold"
                >
                  Approve Application
                </button>
                <button
                  onClick={() => {
                    updateRegistrationStatus(inspectingReg.id, 'Pending');
                    setInspectingReg({ ...inspectingReg, registrationStatus: 'Pending' });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-950 text-amber-300 border border-amber-500/40 text-xs font-semibold"
                >
                  Mark Pending
                </button>
                <button
                  onClick={() => {
                    updateRegistrationStatus(inspectingReg.id, 'Rejected');
                    setInspectingReg({ ...inspectingReg, registrationStatus: 'Rejected' });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-400 border border-rose-500/40 text-xs font-semibold"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* WORKSHOP CREATE / EDIT MODAL */}
      {isWsModalOpen && editingWorkshop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-[#181614] border border-[#332f2a] rounded-2xl p-6 sm:p-8 text-[#faf7f2] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#2b2723]">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">
                  {editingWorkshop.id ? 'EDIT MASTERCLASS WORKSHOP' : 'NEW GURUKUL WORKSHOP'}
                </span>
                <h3 className="font-editorial text-2xl font-bold text-white">
                  {editingWorkshop.id ? 'Modify Workshop' : 'Create Workshop'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsWsModalOpen(false);
                  setEditingWorkshop(null);
                }}
                className="text-[#9e968b] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWorkshopSubmit} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop.title || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#201e1b] border border-[#332f2a] text-white focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Navarasa Expressions Masterclass"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={editingWorkshop.subtitle || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#201e1b] border border-[#332f2a] text-white focus:border-amber-400 focus:outline-none"
                    placeholder="Brief thematic line"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingWorkshop.description || ''}
                  onChange={(e) => setEditingWorkshop({ ...editingWorkshop, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#201e1b] border border-[#332f2a] text-white focus:border-amber-400 focus:outline-none"
                  placeholder="Detailed curriculum, scope and objectives..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1">Instructor *</label>
                  <input
                    type="text"
                    required
                    value={editingWorkshop.instructor || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, instructor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#201e1b] border border-[#332f2a] text-white focus:border-amber-400 focus:outline-none"
                    placeholder="Guru Name"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1">Category</label>
                  <select
                    value={editingWorkshop.category || 'Theatre'}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#201e1b] border border-[#332f2a] text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Theatre">Theatre</option>
                    <option value="Music">Music</option>
                    <option value="Movement">Movement</option>
                    <option value="Crafts">Crafts</option>
                    <option value="Puppetry">Puppetry</option>
                    <option value="Dramaturgy">Dramaturgy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1">Status</label>
                  <select
                    value={editingWorkshop.status || 'Open'}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#201e1b] border border-[#332f2a] text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="Filling Fast">Filling Fast</option>
                    <option value="Sold Out">Sold Out</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1">Tuition Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingWorkshop.price || 0}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#201e1b] border border-[#332f2a] text-white focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1">Total Capacity</label>
                  <input
                    type="number"
                    value={editingWorkshop.maxParticipants || 20}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, maxParticipants: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#201e1b] border border-[#332f2a] text-white focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1">Available Seats</label>
                  <input
                    type="number"
                    value={editingWorkshop.availableSeats ?? 20}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, availableSeats: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#201e1b] border border-[#332f2a] text-white focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1">Dates</label>
                  <input
                    type="text"
                    value={editingWorkshop.date || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#201e1b] border border-[#332f2a] text-white focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. November 14 - 17, 2026"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1">Location</label>
                  <input
                    type="text"
                    value={editingWorkshop.location || ''}
                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#201e1b] border border-[#332f2a] text-white focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Rang Gurukul Sanctum Campus, Dehradun"
                  />
                </div>
              </div>

              <div className="pt-2">
                <MediaUploadField
                  label="Workshop Poster / Cover Image"
                  value={editingWorkshop.image || ''}
                  onChange={(url) => setEditingWorkshop({ ...editingWorkshop, image: url })}
                  category="Workshops"
                  aspectRatio="16:9"
                  helperText="Select or upload masterclass photograph from device"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2b2723]">
                <button
                  type="button"
                  onClick={() => {
                    setIsWsModalOpen(false);
                    setEditingWorkshop(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#24211e] text-[#9e968b] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors"
                >
                  Save Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
