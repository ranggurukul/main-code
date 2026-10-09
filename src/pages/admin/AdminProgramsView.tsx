import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  GraduationCap,
  X,
  Check,
  Calendar,
  Users,
  MapPin,
  Sliders,
  RotateCcw,
  RefreshCw,
  Save,
  Layers,
  Sparkles,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
} from 'lucide-react';
import type { AcademyProgram } from '../../types/database';

export const AdminProgramsView: React.FC = () => {
  const { programs, saveProgram, deleteProgram, siteSettings, updateSiteSettings } = useDatabase();

  const [activeTab, setActiveTab] = useState<'programs' | 'form_options'>('programs');

  // Programs Catalogue state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingItem, setEditingItem] = useState<Partial<AcademyProgram> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [curriculumInput, setCurriculumInput] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Application Options State
  const defaultDisciplines = [
    'Classical & Physical Theatre',
    'Classical Dance (Kathak, Bharatanatyam, Chhau)',
    'Indian Classical Vocal / Dhrupad',
    'Percussion (Pakhawaj, Mridangam, Tabla)',
    'Mask Sculpting & Puppetry',
    'Dramatic Playwriting & Dramaturgy',
  ];

  const defaultPriorTraining = [
    '1–2 Years',
    '3–5 Years',
    '5–8 Years',
    '8+ Years (Professional)',
    'Self-Taught / Folk Tradition',
  ];

  const [appPrograms, setAppPrograms] = useState<string[]>(() => {
    if (Array.isArray(siteSettings.applicationPrograms)) {
      return [...siteSettings.applicationPrograms];
    }
    return programs.map((p) => `${p.title} (${p.duration})`);
  });

  const [appDisciplines, setAppDisciplines] = useState<string[]>(() => {
    if (Array.isArray(siteSettings.applicationDisciplines)) {
      return [...siteSettings.applicationDisciplines];
    }
    return [...defaultDisciplines];
  });

  const [appTraining, setAppTraining] = useState<string[]>(() => {
    if (Array.isArray(siteSettings.applicationPriorTraining)) {
      return [...siteSettings.applicationPriorTraining];
    }
    return [...defaultPriorTraining];
  });

  useEffect(() => {
    if (Array.isArray(siteSettings.applicationPrograms)) {
      setAppPrograms([...siteSettings.applicationPrograms]);
    }
  }, [siteSettings.applicationPrograms]);

  useEffect(() => {
    if (Array.isArray(siteSettings.applicationDisciplines)) {
      setAppDisciplines([...siteSettings.applicationDisciplines]);
    }
  }, [siteSettings.applicationDisciplines]);

  useEffect(() => {
    if (Array.isArray(siteSettings.applicationPriorTraining)) {
      setAppTraining([...siteSettings.applicationPriorTraining]);
    }
  }, [siteSettings.applicationPriorTraining]);

  const [newProgramInput, setNewProgramInput] = useState('');
  const [newDisciplineInput, setNewDisciplineInput] = useState('');
  const [newTrainingInput, setNewTrainingInput] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const categories = [
    'All',
    'Full-Time Internship',
    'Masterclass Intensive',
    'Summer Residency',
    'Folk Heritage Camp',
  ];

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sanskritName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mentor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingItem({
      title: '',
      sanskritName: '',
      category: 'Full-Time Internship',
      duration: '1 Academic Year (Full Boarding)',
      intake: '16 Selected Interns Only',
      mentor: '',
      dates: 'August 2026 – June 2027',
      location: 'Rang Gurukul Sanctum Campus, Dehradun Foothills',
      curriculum: [],
      prerequisites: 'Audition and interview mandatory.',
      tuition: 'Internship Funded / Stipend Provided',
      status: 'Applications Open',
    });
    setCurriculumInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AcademyProgram) => {
    setEditingItem({ ...item });
    setCurriculumInput((item.curriculum || []).join('\n'));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title?.trim()) return;

    const curr = curriculumInput
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    const saved = saveProgram({
      ...editingItem,
      title: editingItem.title.trim(),
      curriculum: curr.length > 0 ? curr : editingItem.curriculum || [],
    });

    // Keep appPrograms updated if not already present
    const label = `${saved.title} (${saved.duration})`;
    if (!appPrograms.includes(label)) {
      const updated = [...appPrograms, label];
      setAppPrograms(updated);
      updateSiteSettings({ applicationPrograms: updated });
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    const prog = programs.find((p) => p.id === id);
    if (prog) {
      const label = `${prog.title} (${prog.duration})`;
      const progTitleLower = prog.title.trim().toLowerCase();
      const updated = appPrograms.filter(
        (ap) =>
          ap !== label &&
          !ap.toLowerCase().includes(progTitleLower) &&
          !progTitleLower.includes(ap.toLowerCase())
      );
      setAppPrograms(updated);
      updateSiteSettings({ applicationPrograms: updated });
    }
    deleteProgram(id);
    setDeleteConfirmId(null);
  };

  // Application Options handlers
  const handleAddAppProgram = () => {
    if (!newProgramInput.trim()) return;
    const updated = [...appPrograms, newProgramInput.trim()];
    setAppPrograms(updated);
    setNewProgramInput('');
    updateSiteSettings({ applicationPrograms: updated });
  };

  const handleRemoveAppProgram = (index: number) => {
    const updated = appPrograms.filter((_, i) => i !== index);
    setAppPrograms(updated);
    updateSiteSettings({ applicationPrograms: updated });
  };

  const handleClearAllPrograms = () => {
    setAppPrograms([]);
    updateSiteSettings({ applicationPrograms: [] });
  };

  const handleEditAppProgram = (index: number, val: string) => {
    const updated = [...appPrograms];
    updated[index] = val;
    setAppPrograms(updated);
    updateSiteSettings({ applicationPrograms: updated });
  };

  const handleSyncProgramsFromCatalogue = () => {
    const synced = programs.map((p) => `${p.title} (${p.duration})`);
    setAppPrograms(synced);
    updateSiteSettings({ applicationPrograms: synced });
  };

  const handleAddDiscipline = () => {
    if (!newDisciplineInput.trim()) return;
    const updated = [...appDisciplines, newDisciplineInput.trim()];
    setAppDisciplines(updated);
    setNewDisciplineInput('');
    updateSiteSettings({ applicationDisciplines: updated });
  };

  const handleRemoveDiscipline = (index: number) => {
    const updated = appDisciplines.filter((_, i) => i !== index);
    setAppDisciplines(updated);
    updateSiteSettings({ applicationDisciplines: updated });
  };

  const handleClearAllDisciplines = () => {
    setAppDisciplines([]);
    updateSiteSettings({ applicationDisciplines: [] });
  };

  const handleResetDisciplines = () => {
    setAppDisciplines([...defaultDisciplines]);
    updateSiteSettings({ applicationDisciplines: [...defaultDisciplines] });
  };

  const handleEditDiscipline = (index: number, val: string) => {
    const updated = [...appDisciplines];
    updated[index] = val;
    setAppDisciplines(updated);
    updateSiteSettings({ applicationDisciplines: updated });
  };

  const handleMoveDiscipline = (index: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= appDisciplines.length) return;
    const copy = [...appDisciplines];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setAppDisciplines(copy);
    updateSiteSettings({ applicationDisciplines: copy });
  };

  const handleAddTraining = () => {
    if (!newTrainingInput.trim()) return;
    const updated = [...appTraining, newTrainingInput.trim()];
    setAppTraining(updated);
    setNewTrainingInput('');
    updateSiteSettings({ applicationPriorTraining: updated });
  };

  const handleRemoveTraining = (index: number) => {
    const updated = appTraining.filter((_, i) => i !== index);
    setAppTraining(updated);
    updateSiteSettings({ applicationPriorTraining: updated });
  };

  const handleClearAllTraining = () => {
    setAppTraining([]);
    updateSiteSettings({ applicationPriorTraining: [] });
  };

  const handleResetTraining = () => {
    setAppTraining([...defaultPriorTraining]);
    updateSiteSettings({ applicationPriorTraining: [...defaultPriorTraining] });
  };

  const handleEditTraining = (index: number, val: string) => {
    const updated = [...appTraining];
    updated[index] = val;
    setAppTraining(updated);
    updateSiteSettings({ applicationPriorTraining: updated });
  };

  const handleMoveTraining = (index: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= appTraining.length) return;
    const copy = [...appTraining];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setAppTraining(copy);
    updateSiteSettings({ applicationPriorTraining: copy });
  };

  const handleSaveApplicationOptions = () => {
    updateSiteSettings({
      applicationPrograms: appPrograms,
      applicationDisciplines: appDisciplines,
      applicationPriorTraining: appTraining,
    });
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3500);
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#25221e]">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-1">
            ACADEMIES & INTERNSHIPS • गुरुकुल शिक्षण
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-editorial">
            Academic Programs & Internships
          </h2>
          <p className="text-xs text-[#9e968b] mt-1">
            Manage residential internships, cohorts, and application dropdown fields (Selected Intensive, Artistic Discipline & Prior Training).
          </p>
        </div>

        {activeTab === 'programs' ? (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors shrink-0 shadow-lg shadow-amber-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Program</span>
          </button>
        ) : (
          <button
            onClick={handleSaveApplicationOptions}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs tracking-wider uppercase transition-colors shrink-0 shadow-lg shadow-emerald-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save All Application Options</span>
          </button>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-[#25221e] pb-px">
        <button
          onClick={() => setActiveTab('programs')}
          className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'programs'
              ? 'border-amber-400 text-amber-400 bg-[#201e1b]'
              : 'border-transparent text-[#9e968b] hover:text-white hover:bg-[#1a1816]'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Programs Catalogue ({programs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('form_options')}
          className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'form_options'
              ? 'border-amber-400 text-amber-400 bg-[#201e1b]'
              : 'border-transparent text-[#9e968b] hover:text-white hover:bg-[#1a1816]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Application Form Options</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-400/20 text-amber-300 font-mono">
            Intensive • Discipline • Training
          </span>
        </button>
      </div>

      {/* TAB 1: PROGRAMS CATALOGUE */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          {/* Quick Notice linking to form options */}
          <div className="p-3.5 rounded-xl bg-[#1c1a17] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-300">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                Want to customize the <strong>Selected Intensive</strong>, <strong>Artistic Discipline</strong>, or <strong>Prior Training</strong> dropdown choices for the student application form?
              </span>
            </div>
            <button
              onClick={() => setActiveTab('form_options')}
              className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black font-semibold text-[11px] uppercase tracking-wider transition-colors shrink-0"
            >
              Configure Dropdowns →
            </button>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141210] p-3 rounded-xl border border-[#2b2723]">
            <div className="flex items-center gap-2.5 flex-1 text-xs">
              <Search className="w-4 h-4 text-[#787168]" />
              <input
                type="text"
                placeholder="Search programs by title, Sanskrit name, or mentor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-white placeholder-[#787168] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-black'
                      : 'bg-[#201e1b] text-[#9e968b] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6 flex flex-col justify-between group hover:border-amber-500/50 transition-all duration-300"
              >
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-[10px] uppercase tracking-widest text-[#c85a32] font-semibold bg-[#25201c] px-3 py-1 rounded-full border border-[#3d332a]">
                      {program.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                        program.status === 'Applications Open'
                          ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30'
                          : program.status === 'Limited Seats'
                          ? 'border-amber-500/40 text-amber-400 bg-amber-950/30'
                          : 'border-[#787168]/40 text-[#9e968b] bg-[#1e1b18]'
                      }`}
                    >
                      {program.status}
                    </span>
                  </div>

                  {/* Title & Sanskrit */}
                  <div className="mb-4">
                    <span className="text-xs font-mono text-amber-400 block">{program.sanskritName}</span>
                    <h3 className="font-editorial text-xl font-bold text-white group-hover:text-amber-400 transition-colors mt-0.5">
                      {program.title}
                    </h3>
                  </div>

                  {/* Key Meta details */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#25221e] text-xs text-[#d8d0c5] mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="line-clamp-1">{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="line-clamp-1">{program.intake}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-[#c85a32] shrink-0" />
                      <span className="line-clamp-1 text-[#9e968b]">{program.location}</span>
                    </div>
                  </div>

                  {/* Mentor */}
                  <div className="text-xs text-[#9e968b] mb-4">
                    <span className="text-amber-400 font-semibold">Faculty Mentor: </span>
                    <span className="text-white/90">{program.mentor}</span>
                  </div>

                  {/* Curriculum Points */}
                  {program.curriculum && program.curriculum.length > 0 && (
                    <div className="space-y-1 mb-4">
                      <div className="text-[10px] uppercase font-mono tracking-wider text-[#787168]">
                        Syllabus Highlights ({program.curriculum.length} units):
                      </div>
                      <ul className="text-xs text-[#9e968b] space-y-1 pl-4 list-disc marker:text-amber-400">
                        {program.curriculum.slice(0, 3).map((c, i) => (
                          <li key={i} className="line-clamp-1">
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-[#25221e] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#787168]">ID: {program.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(program)}
                      className="p-2 rounded-lg bg-[#201e1b] hover:bg-amber-400 hover:text-black text-[#9e968b] transition-colors"
                      title="Edit Program"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(program.id)}
                      className="p-2 rounded-lg bg-[#201e1b] hover:bg-rose-950 hover:text-rose-400 text-[#9e968b] transition-colors"
                      title="Delete Program"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPrograms.length === 0 && (
            <div className="text-center py-16 bg-[#141210] border border-[#2b2723] rounded-2xl p-8">
              <GraduationCap className="w-8 h-8 text-amber-400/50 mx-auto mb-3" />
              <p className="text-white font-medium text-sm">No programs match your search</p>
              <p className="text-xs text-[#787168] mt-1">Try adjusting the filter or add a new program above.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPLICATION FORM OPTIONS */}
      {activeTab === 'form_options' && (
        <div className="space-y-8">
          {saveSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong>Options Successfully Saved!</strong> All choices for Selected Intensive, Artistic Discipline, and Prior Training are immediately active on the live application modal.
              </div>
            </div>
          )}

          {/* Section 1: Selected Intensive / Program */}
          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#25221e]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                  DROPDOWN 1 • APPLICANT CHOICES
                </span>
                <h3 className="text-lg font-bold font-editorial text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Selected Intensive / Program Options</span>
                </h3>
                <p className="text-xs text-[#9e968b] mt-0.5">
                  Controls the exact options shown in the "Selected Intensive / Program" dropdown of the application modal.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {appPrograms.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllPrograms}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201e1b] hover:bg-rose-950/40 text-rose-400 border border-rose-500/20 text-xs transition-colors shrink-0"
                    title="Remove all program options"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSyncProgramsFromCatalogue}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201e1b] hover:bg-[#2b2824] text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors shrink-0"
                  title="Populate from all programs in the catalogue"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync From Catalogue</span>
                </button>
              </div>
            </div>

            {/* Add new program option input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type new Intensive / Program option (e.g. Residential Internship in Classical Dramaturgy (1 Year))..."
                value={newProgramInput}
                onChange={(e) => setNewProgramInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAppProgram();
                  }
                }}
                className="flex-1 bg-[#121110] border border-[#332f2a] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#787168] focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddAppProgram}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors shrink-0"
              >
                + Add Option
              </button>
            </div>

            {/* List of Program options */}
            {appPrograms.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#141210] border border-dashed border-[#332f2a] text-center text-xs text-[#787168]">
                No options currently configured. The application modal will display "No programs available at this time".
              </div>
            ) : (
              <div className="space-y-2.5">
                {appPrograms.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#141210] border border-[#2b2723] group hover:border-[#3d3832] transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#201e1b] text-amber-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleEditAppProgram(idx, e.target.value)}
                      className="flex-1 bg-transparent text-xs text-white focus:outline-none focus:bg-[#201e1b] px-2 py-1 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAppProgram(idx)}
                      className="p-1.5 rounded-lg text-[#787168] hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                      title="Remove this option"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Artistic Discipline */}
          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#25221e]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                  DROPDOWN 2 • APPLICANT CHOICES
                </span>
                <h3 className="text-lg font-bold font-editorial text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Artistic Discipline Options</span>
                </h3>
                <p className="text-xs text-[#9e968b] mt-0.5">
                  Controls the options in the "Artistic Discipline" dropdown in the application modal.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {appDisciplines.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllDisciplines}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201e1b] hover:bg-rose-950/40 text-rose-400 border border-rose-500/20 text-xs transition-colors shrink-0"
                    title="Remove all disciplines"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleResetDisciplines}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201e1b] hover:bg-[#2b2824] text-[#9e968b] hover:text-white border border-[#332f2a] text-xs transition-colors shrink-0"
                  title="Reset to default disciplines"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Defaults</span>
                </button>
              </div>
            </div>

            {/* Add new discipline option input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type new Artistic Discipline (e.g. Classical Sanskrit Chanting, Mask Movement)..."
                value={newDisciplineInput}
                onChange={(e) => setNewDisciplineInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDiscipline();
                  }
                }}
                className="flex-1 bg-[#121110] border border-[#332f2a] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#787168] focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddDiscipline}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors shrink-0"
              >
                + Add Discipline
              </button>
            </div>

            {/* List of Disciplines */}
            {appDisciplines.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#141210] border border-dashed border-[#332f2a] text-center text-xs text-[#787168]">
                No disciplines configured. The application modal will display "No disciplines configured".
              </div>
            ) : (
              <div className="space-y-2.5">
                {appDisciplines.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-[#141210] border border-[#2b2723] group hover:border-[#3d3832] transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#201e1b] text-amber-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleEditDiscipline(idx, e.target.value)}
                      className="flex-1 bg-transparent text-xs text-white focus:outline-none focus:bg-[#201e1b] px-2 py-1 rounded"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveDiscipline(idx, 'up')}
                        className={`p-1 rounded text-[#787168] hover:text-white transition-colors ${idx === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === appDisciplines.length - 1}
                        onClick={() => handleMoveDiscipline(idx, 'down')}
                        className={`p-1 rounded text-[#787168] hover:text-white transition-colors ${idx === appDisciplines.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveDiscipline(idx)}
                        className="p-1 rounded text-[#787168] hover:text-rose-400 hover:bg-rose-950/40 transition-colors ml-1"
                        title="Remove discipline"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Prior Training */}
          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#25221e]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                  DROPDOWN 3 • APPLICANT CHOICES
                </span>
                <h3 className="text-lg font-bold font-editorial text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Prior Training Options</span>
                </h3>
                <p className="text-xs text-[#9e968b] mt-0.5">
                  Controls the experience levels available in the "Prior Training" dropdown in the application modal.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {appTraining.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllTraining}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201e1b] hover:bg-rose-950/40 text-rose-400 border border-rose-500/20 text-xs transition-colors shrink-0"
                    title="Remove all training levels"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleResetTraining}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201e1b] hover:bg-[#2b2824] text-[#9e968b] hover:text-white border border-[#332f2a] text-xs transition-colors shrink-0"
                  title="Reset to default prior training levels"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Defaults</span>
                </button>
              </div>
            </div>

            {/* Add new training option input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type new Prior Training level (e.g. 10+ Years (Senior Guru), Self-Taught Gurukul Disciple)..."
                value={newTrainingInput}
                onChange={(e) => setNewTrainingInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTraining();
                  }
                }}
                className="flex-1 bg-[#121110] border border-[#332f2a] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#787168] focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTraining}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors shrink-0"
              >
                + Add Level
              </button>
            </div>

            {/* List of Training levels */}
            {appTraining.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#141210] border border-dashed border-[#332f2a] text-center text-xs text-[#787168]">
                No training levels configured. The application modal will display "No training options configured".
              </div>
            ) : (
              <div className="space-y-2.5">
                {appTraining.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-[#141210] border border-[#2b2723] group hover:border-[#3d3832] transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#201e1b] text-amber-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleEditTraining(idx, e.target.value)}
                      className="flex-1 bg-transparent text-xs text-white focus:outline-none focus:bg-[#201e1b] px-2 py-1 rounded"
                    />
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveTraining(idx, 'up')}
                        className={`p-1 rounded text-[#787168] hover:text-white transition-colors ${idx === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === appTraining.length - 1}
                        onClick={() => handleMoveTraining(idx, 'down')}
                        className={`p-1 rounded text-[#787168] hover:text-white transition-colors ${idx === appTraining.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveTraining(idx)}
                        className="p-1 rounded text-[#787168] hover:text-rose-400 hover:bg-rose-950/40 transition-colors ml-1"
                        title="Remove level"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Save Action Bar */}
          <div className="p-6 rounded-2xl bg-[#181614] border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-editorial text-base font-bold text-white">Ready to apply changes?</h4>
              <p className="text-xs text-[#9e968b] mt-0.5">
                Saving will instantly update the application form on the live site across all applicant sessions.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveApplicationOptions}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors shrink-0 shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Application Form Options</span>
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181614] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-editorial text-lg font-bold text-white">Delete Program</h3>
            <p className="text-xs text-[#9e968b] leading-relaxed">
              Are you sure you want to remove this academic program? It will immediately disappear from admissions and public curriculum.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs uppercase font-semibold text-[#9e968b] hover:text-white bg-[#221f1c]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs uppercase font-semibold text-white bg-rose-600 hover:bg-rose-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PROGRAM MODAL */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Fixed Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-[#25221e] flex-shrink-0 bg-[#181614]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                  {editingItem.id ? 'EDIT PROGRAM' : 'CREATE ACADEMIC PROGRAM'}
                </span>
                <h3 className="text-xl font-editorial font-bold text-white">
                  {editingItem.id ? editingItem.title : 'New Internship / Residency'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-[#9e968b] hover:text-white hover:bg-[#201e1b] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Program Title *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="e.g. Residential Internship in Contemporary Natyashastra"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Sanskrit Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.sanskritName || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, sanskritName: e.target.value })}
                    placeholder="e.g. नाट्यशास्त्र अध्येता वृत्ति"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Category *</label>
                  <select
                    value={editingItem.category || 'Full-Time Internship'}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value as AcademyProgram['category'],
                      })
                    }
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Full-Time Internship">Full-Time Internship</option>
                    <option value="Masterclass Intensive">Masterclass Intensive</option>
                    <option value="Summer Residency">Summer Residency</option>
                    <option value="Folk Heritage Camp">Folk Heritage Camp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Admission Status</label>
                  <select
                    value={editingItem.status || 'Applications Open'}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        status: e.target.value as AcademyProgram['status'],
                      })
                    }
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Applications Open">Applications Open</option>
                    <option value="Limited Seats">Limited Seats</option>
                    <option value="Waitlist Only">Waitlist Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Lead Mentor / Guru *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.mentor || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, mentor: e.target.value })}
                    placeholder="e.g. Padmashri Anuradha Sen"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Intake Capacity</label>
                  <input
                    type="text"
                    value={editingItem.intake || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, intake: e.target.value })}
                    placeholder="e.g. 16 Selected Interns Only"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Duration</label>
                  <input
                    type="text"
                    value={editingItem.duration || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                    placeholder="e.g. 1 Academic Year (Full Boarding)"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Dates</label>
                  <input
                    type="text"
                    value={editingItem.dates || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, dates: e.target.value })}
                    placeholder="e.g. August 2026 – June 2027"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9e968b] mb-1 font-semibold">Location / Campus</label>
                <input
                  type="text"
                  value={editingItem.location || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  placeholder="e.g. Rang Gurukul Sanctum Campus, Dehradun Foothills"
                  className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#9e968b] mb-1 font-semibold">Tuition / Scholarship Note</label>
                <input
                  type="text"
                  value={editingItem.tuition || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, tuition: e.target.value })}
                  placeholder="e.g. Internship Funded / Stipend Provided"
                  className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#9e968b] mb-1 font-semibold">Prerequisites</label>
                <input
                  type="text"
                  value={editingItem.prerequisites || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, prerequisites: e.target.value })}
                  placeholder="e.g. Audition and interview mandatory."
                  className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#9e968b] mb-1 font-semibold">
                  Curriculum Highlights (One unit per line)
                </label>
                <textarea
                  rows={4}
                  value={curriculumInput}
                  onChange={(e) => setCurriculumInput(e.target.value)}
                  placeholder="Comprehensive Sanskrit dramaturgy&#10;Daily 3-hour dawn physical training&#10;Voice projection and Naad yoga"
                  className="w-full bg-[#121110] border border-[#332f2a] rounded-xl p-3 text-white focus:border-amber-400 focus:outline-none font-mono text-xs"
                />
              </div>
            </div>

            {/* Modal Fixed Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-[#25221e] flex-shrink-0 bg-[#181614]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs uppercase font-semibold text-[#9e968b] hover:text-white bg-[#201e1b] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors shadow-lg shadow-amber-400/20"
              >
                <Check className="w-4 h-4" />
                <span>Save Program</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
