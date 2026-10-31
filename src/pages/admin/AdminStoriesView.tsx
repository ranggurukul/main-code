import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Plus, Edit2, Trash2, Search, BookOpen, Clock, Calendar, User, X, Check } from 'lucide-react';
import type { Story } from '../../types/database';
import { MediaUploadField } from '../../components/media/MediaUploadField';

export const AdminStoriesView: React.FC = () => {
  const { stories, saveStory, deleteStory } = useDatabase();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingItem, setEditingItem] = useState<Partial<Story> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentInput, setContentInput] = useState('');
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(null);

  const categories = ['All', 'Natyashastra', 'Aharya Craft', 'Dhrupad Acoustics', 'Living Heritage', 'Interviews'];

  const filteredStories = stories.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingItem({
      title: '',
      slug: '',
      category: 'Natyashastra',
      author: 'Dr. Siddharth Narayan',
      authorRole: 'Head of Dramaturgy',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: '6 min read',
      coverImage: '/assets/hero.jpg',
      excerpt: '',
      content: [],
    });
    setContentInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Story) => {
    setEditingItem({ ...item });
    setContentInput((item.content || []).join('\n\n'));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title?.trim()) return;

    const paragraphs = contentInput
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    saveStory({
      ...editingItem,
      title: editingItem.title.trim(),
      slug:
        editingItem.slug?.trim() ||
        editingItem.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      content: paragraphs.length > 0 ? paragraphs : editingItem.content || [],
    });

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (slug: string) => {
    deleteStory(slug);
    setDeleteConfirmSlug(null);
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#25221e]">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-1">
            CULTURAL JOURNAL • रंग पत्रिका
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-editorial">
            Stories, Monographs & Essays
          </h2>
          <p className="text-xs text-[#9e968b] mt-1">
            Publish scholarly treatises, master craftsman memoirs, acoustic essays, and historical dispatches.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors shrink-0 shadow-lg shadow-amber-400/20"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Story</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141210] p-3 rounded-xl border border-[#2b2723]">
        <div className="flex items-center gap-2.5 flex-1 text-xs">
          <Search className="w-4 h-4 text-[#787168]" />
          <input
            type="text"
            placeholder="Search stories by title, author, or topic..."
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

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <article
            key={story.slug}
            className="bg-[#181614] border border-[#2b2723] rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-amber-500/50 transition-all duration-300"
          >
            <div>
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden bg-[#11100f]">
                <img
                  src={story.coverImage || '/assets/hero.jpg'}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181614] via-transparent to-black/30" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-sm border border-amber-400/40 text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
                  {story.category}
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-[#d8d0c5]">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    {story.date}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {story.readTime}
                  </span>
                </div>
              </div>

              {/* Story Details */}
              <div className="p-5 space-y-3">
                <h3 className="font-editorial text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
                  {story.title}
                </h3>
                <p className="text-xs text-[#9e968b] line-clamp-3 leading-relaxed">
                  {story.excerpt}
                </p>

                <div className="pt-3 border-t border-[#25221e] flex items-center gap-2 text-xs">
                  <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-white font-medium line-clamp-1">{story.author}</span>
                  <span className="text-[#787168] text-[10px]">({story.authorRole})</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-[#141210] border-t border-[#25221e] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#787168] truncate max-w-[140px]">
                /{story.slug}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(story)}
                  className="p-2 rounded-lg bg-[#201e1b] hover:bg-amber-400 hover:text-black text-[#9e968b] transition-colors"
                  title="Edit Story"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmSlug(story.slug)}
                  className="p-2 rounded-lg bg-[#201e1b] hover:bg-rose-950 hover:text-rose-400 text-[#9e968b] transition-colors"
                  title="Delete Story"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <div className="text-center py-16 bg-[#141210] border border-[#2b2723] rounded-2xl p-8">
          <BookOpen className="w-8 h-8 text-amber-400/50 mx-auto mb-3" />
          <p className="text-white font-medium text-sm">No stories match your search</p>
          <p className="text-xs text-[#787168] mt-1">Try adjusting the filter or write a new story above.</p>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmSlug && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181614] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-editorial text-lg font-bold text-white">Delete Story</h3>
            <p className="text-xs text-[#9e968b] leading-relaxed">
              Are you sure you want to delete this monograph? It will be permanently removed from the public cultural journal.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmSlug(null)}
                className="px-4 py-2 rounded-xl text-xs uppercase font-semibold text-[#9e968b] hover:text-white bg-[#221f1c]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmSlug)}
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
                  {editingItem.slug ? 'EDIT STORY' : 'PUBLISH NEW MONOGRAPH'}
                </span>
                <h3 className="text-xl font-editorial font-bold text-white">
                  {editingItem.title || 'New Cultural Essay'}
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
              <div>
                <label className="block text-[#9e968b] mb-1 font-semibold">Story Title *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. The Fourfold Abhinaya: Deconstructing Bharata Muni"
                  className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">URL Slug (unique path)</label>
                  <input
                    type="text"
                    value={editingItem.slug || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    placeholder="fourfold-abhinaya-natyashastra"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Category *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="e.g. Natyashastra, Aharya Craft, Dhrupad Acoustics"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.author || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value })}
                    placeholder="e.g. Dr. Siddharth Narayan"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Author Role / Title</label>
                  <input
                    type="text"
                    value={editingItem.authorRole || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, authorRole: e.target.value })}
                    placeholder="e.g. Head of Dramaturgy"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Publication Date</label>
                  <input
                    type="text"
                    value={editingItem.date || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    placeholder="e.g. February 15, 2026"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Read Time</label>
                  <input
                    type="text"
                    value={editingItem.readTime || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, readTime: e.target.value })}
                    placeholder="e.g. 6 min read"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* MEDIA UPLOAD FIELD FOR STORY COVER PHOTO */}
              <div className="pt-2">
                <MediaUploadField
                  label="Story Cover Photograph *"
                  value={editingItem.coverImage || ''}
                  onChange={(url) => setEditingItem({ ...editingItem, coverImage: url })}
                  category="Stories"
                  aspectRatio="16:9"
                  helperText="Upload cover photo from device, pick from library, or paste image URL"
                />
              </div>

              <div>
                <label className="block text-[#9e968b] mb-1 font-semibold">Excerpt / Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={editingItem.excerpt || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })}
                  placeholder="One or two sentences summarizing the premise of this monograph..."
                  className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[#9e968b] mb-1 font-semibold">
                  Article Content (separate paragraphs with an empty line)
                </label>
                <textarea
                  rows={6}
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  placeholder="Paragraph 1 text...&#10;&#10;Paragraph 2 text...&#10;&#10;Paragraph 3 text..."
                  className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none font-sans text-xs leading-relaxed"
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
                <span>Publish Story</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
