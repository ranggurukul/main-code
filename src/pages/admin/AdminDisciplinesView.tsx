import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Plus, Edit2, Trash2, Search, Flame, X, Check, BookOpen, Layers } from 'lucide-react';
import type { Discipline } from '../../types/database';
import { MediaUploadField } from '../../components/media/MediaUploadField';

export const AdminDisciplinesView: React.FC = () => {
  const { disciplines, saveDiscipline, deleteDiscipline } = useDatabase();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<Partial<Discipline> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyPracticesInput, setKeyPracticesInput] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredDisciplines = disciplines.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.sanskritTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.facultyLead.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingItem({
      title: '',
      sanskritTitle: '',
      tagline: '',
      description: '',
      keyPractices: [],
      facultyLead: '',
      duration: '1-Year Intensive',
      image: '/assets/hero.jpg',
      quote: '',
    });
    setKeyPracticesInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Discipline) => {
    setEditingItem({ ...item });
    setKeyPracticesInput((item.keyPractices || []).join('\n'));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title?.trim()) return;

    const practices = keyPracticesInput
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    saveDiscipline({
      ...editingItem,
      title: editingItem.title.trim(),
      keyPractices: practices.length > 0 ? practices : editingItem.keyPractices || [],
    });

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    deleteDiscipline(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#25221e]">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-1">
            SACRED CURRICULUM • विधाएं
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-editorial">
            Disciplines of Expression
          </h2>
          <p className="text-xs text-[#9e968b] mt-1">
            Manage the foundational schools of Indian performing arts, faculty mentors, curricula, and visual photographs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors shrink-0 shadow-lg shadow-amber-400/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Discipline</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-[#141210] p-3 rounded-xl border border-[#2b2723]">
        <div className="flex items-center gap-2.5 flex-1 text-xs">
          <Search className="w-4 h-4 text-[#787168]" />
          <input
            type="text"
            placeholder="Search disciplines by title, Sanskrit name, or mentor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-white placeholder-[#787168] focus:outline-none"
          />
        </div>
        <div className="text-[11px] font-mono text-[#9e968b]">
          Total: {disciplines.length} Disciplines
        </div>
      </div>

      {/* Disciplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDisciplines.map((item) => (
          <div
            key={item.id}
            className="bg-[#181614] border border-[#2b2723] rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-amber-500/50 transition-all duration-300"
          >
            <div>
              {/* Photo Banner */}
              <div className="relative h-44 overflow-hidden bg-[#11100f]">
                <img
                  src={item.image || '/assets/hero.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181614] via-transparent to-black/30" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-sm border border-amber-400/40 text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
                  {item.sanskritTitle}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-sm border border-[#332f2a] text-[#9e968b] text-[10px] font-mono">
                  {item.duration}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <h3 className="font-editorial text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                  {item.title}
                </h3>
                {item.tagline && (
                  <p className="text-[11px] text-amber-200/70 italic line-clamp-1">
                    "{item.tagline}"
                  </p>
                )}
                <p className="text-xs text-[#9e968b] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-3 border-t border-[#25221e] flex flex-col gap-1.5 text-[11px] text-[#787168]">
                  <div className="flex items-center gap-1.5 text-white/90">
                    <span className="text-amber-400 font-medium">Mentor:</span>
                    <span className="line-clamp-1">{item.facultyLead}</span>
                  </div>
                  {item.keyPractices && item.keyPractices.length > 0 && (
                    <div className="text-[10px] text-[#787168]">
                      {item.keyPractices.length} Core Practices Included
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-[#141210] border-t border-[#25221e] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#787168]">ID: {item.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-lg bg-[#201e1b] hover:bg-amber-400 hover:text-black text-[#9e968b] transition-colors"
                  title="Edit Discipline"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="p-2 rounded-lg bg-[#201e1b] hover:bg-rose-950 hover:text-rose-400 text-[#9e968b] transition-colors"
                  title="Delete Discipline"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDisciplines.length === 0 && (
        <div className="text-center py-16 bg-[#141210] border border-[#2b2723] rounded-2xl p-8">
          <Flame className="w-8 h-8 text-amber-400/50 mx-auto mb-3" />
          <p className="text-white font-medium text-sm">No disciplines match your search</p>
          <p className="text-xs text-[#787168] mt-1">Try adjusting the filter or add a new discipline above.</p>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181614] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-editorial text-lg font-bold text-white">Delete Discipline</h3>
            <p className="text-xs text-[#9e968b] leading-relaxed">
              Are you sure you want to remove this discipline? This action will immediately remove it from both the admin management system and the public website curriculum.
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

      {/* ADD / EDIT MODAL */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <form
            onSubmit={handleSave}
            className="bg-[#181614] border border-[#332f2a] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Fixed Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-[#25221e] flex-shrink-0 bg-[#181614]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                  {editingItem.id ? 'EDIT DISCIPLINE' : 'CREATE NEW DISCIPLINE'}
                </span>
                <h3 className="text-xl font-editorial font-bold text-white">
                  {editingItem.id ? editingItem.title : 'New Performing Arts Discipline'}
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
                  <label className="block text-[#9e968b] mb-1 font-semibold">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="e.g. Classical & Contemporary Theatre"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Sanskrit Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.sanskritTitle || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, sanskritTitle: e.target.value })}
                    placeholder="e.g. नाट्य & रंगमंच"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9e968b] mb-1 font-semibold">Tagline</label>
                <input
                  type="text"
                  value={editingItem.tagline || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, tagline: e.target.value })}
                  placeholder="e.g. Bridging Ancient Dramaturgy with Modern Vanguard Playwriting"
                  className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#9e968b] mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Detailed overview of what students explore in this discipline..."
                  className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Faculty Lead / Mentors *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.facultyLead || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, facultyLead: e.target.value })}
                    placeholder="e.g. Padmashri Anuradha Sen"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Duration / Format</label>
                  <input
                    type="text"
                    value={editingItem.duration || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                    placeholder="e.g. 2-Year Intensive / Masterclass Cohorts"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* MEDIA UPLOAD FIELD FOR DISCIPLINE IMAGE */}
              <div className="pt-2">
                <MediaUploadField
                  label="Discipline Feature Photograph *"
                  value={editingItem.image || ''}
                  onChange={(url) => setEditingItem({ ...editingItem, image: url })}
                  category="Disciplines"
                  aspectRatio="16:9"
                  helperText="Upload a new high-res image from device, choose from media library, or enter URL"
                />
              </div>

              <div>
                <label className="block text-[#9e968b] mb-1 font-semibold">
                  Core Practices (one per line)
                </label>
                <textarea
                  rows={3}
                  value={keyPracticesInput}
                  onChange={(e) => setKeyPracticesInput(e.target.value)}
                  placeholder="Natyashastra Fourfold Abhinaya&#10;Site-specific staging in historic amphitheaters&#10;Textual translations of Kalidasa"
                  className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[#9e968b] mb-1 font-semibold">Inspirational Quote</label>
                <input
                  type="text"
                  value={editingItem.quote || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                  placeholder="e.g. The actor is not an imitator of reality, but an incendiary flame."
                  className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none italic"
                />
              </div>
            </div>

            {/* Modal Fixed Footer */}
            <div className="flex items-center justify-end gap-3 p-4 sm:px-6 border-t border-[#25221e] flex-shrink-0 bg-[#181614]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs uppercase font-semibold text-[#9e968b] hover:text-white bg-[#201e1b] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase font-semibold text-black bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-400/20 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Save Discipline</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
