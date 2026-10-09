import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Search,
  Filter,
  Layers,
  Sparkles,
  X,
  CheckCircle2,
  Crop,
  Check,
  FolderOpen,
  Eye,
  Tag,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import type { GalleryPhoto, GalleryAlbum, MediaItem } from '../../types/database';
import { MediaUploadField } from '../../components/media/MediaUploadField';
import { BulkMediaUploader } from '../../components/media/BulkMediaUploader';
import { ImageCropperModal } from '../../components/media/ImageCropperModal';
import { storageService } from '../../services/storage';

export const AdminMediaView: React.FC = () => {
  const {
    galleryPhotos,
    saveGalleryPhoto,
    deleteGalleryPhoto,
    galleryAlbums,
    saveAlbum,
    deleteAlbum,
    mediaLibrary,
    saveMediaItem,
    deleteMediaItem,
    deleteMultipleMediaItems,
    updateMediaItem,
  } = useDatabase();

  const [activeSubTab, setActiveSubTab] = useState<'library' | 'albums' | 'bulk'>('library');

  // Media Library Search & Filter
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'size'>('newest');

  // Bulk Selection in Library
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Metadata Edit Modal / Drawer
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [tagInput, setTagInput] = useState('');

  // Cropper Modal
  const [croppingItem, setCroppingItem] = useState<MediaItem | null>(null);

  // Album Modal
  const [editingAlbum, setEditingAlbum] = useState<Partial<GalleryAlbum> | null>(null);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

  // In-app Delete Confirmation Modals
  const [albumToDelete, setAlbumToDelete] = useState<GalleryAlbum | null>(null);
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);

  // Filtered Media
  const filteredMedia = mediaLibrary
    .filter((item) => {
      const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesSearch =
        !search.trim() ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.fileName.toLowerCase().includes(search.toLowerCase()) ||
        (item.caption && item.caption.toLowerCase().includes(search.toLowerCase())) ||
        item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      if (sortBy === 'oldest') return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'size') return b.fileSize - a.fileSize;
      return 0;
    });

  const categories = [
    'All',
    'Hero',
    'Performances',
    'Workshops',
    'Campus',
    'Artists',
    'General',
  ];

  // Bulk Selection Helpers
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMedia.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMedia.map((m) => m.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const idsToDelete = [...selectedIds];
    deleteMultipleMediaItems(idsToDelete);
    setSelectedIds([]);
    idsToDelete.forEach((id) => {
      const item = mediaLibrary.find((m) => m.id === id);
      try {
        storageService.deleteMedia(id, item?.fileName, item?.storageProvider).catch(() => {});
      } catch {}
    });
  };

  const handleSaveMetadata = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateMediaItem(editingItem.id, editingItem);
    setEditingItem(null);
  };

  const handleAddTag = () => {
    if (!tagInput.trim() || !editingItem) return;
    const currentTags = editingItem.tags || [];
    if (!currentTags.includes(tagInput.trim())) {
      setEditingItem({ ...editingItem, tags: [...currentTags, tagInput.trim()] });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingItem) return;
    setEditingItem({
      ...editingItem,
      tags: editingItem.tags.filter((t) => t !== tagToRemove),
    });
  };

  const handleOpenAddAlbum = () => {
    setEditingAlbum({
      title: '',
      description: '',
      category: 'Performances',
      coverImage: '/assets/hero.jpg',
      year: '2026',
    });
    setIsAlbumModalOpen(true);
  };

  const handleSaveAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbum?.title) return;
    saveAlbum({
      id: editingAlbum.id,
      title: editingAlbum.title,
      description: editingAlbum.description || '',
      category: editingAlbum.category || 'Performances',
      coverImage: editingAlbum.coverImage || '/assets/hero.jpg',
      year: editingAlbum.year || '2026',
    });
    setIsAlbumModalOpen(false);
    setEditingAlbum(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#25221e]">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-1">
            DIGITAL ART ARCHIVE & CMS MEDIA LIBRARY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-editorial">
            Media Library & Gallery Curator
          </h2>
          <p className="text-xs text-[#9e968b] mt-1">
            Upload from device, drag & drop in bulk, crop aspect ratios, assign taxonomy, and manage museum albums.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveSubTab('bulk')}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5 shadow-lg"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Upload Photos</span>
          </button>
          <button
            onClick={handleOpenAddAlbum}
            className="px-4 py-2.5 rounded-xl bg-[#201e1b] hover:bg-[#282522] border border-[#3a3530] text-amber-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Album</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-[#25221e] pb-px">
        {[
          { id: 'library', label: `Media Library (${mediaLibrary.length})` },
          { id: 'albums', label: `Museum Albums (${galleryAlbums.length})` },
          { id: 'bulk', label: 'Bulk Multi-Photo Ingestion' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-t-xl transition-colors border-b-2 ${
              activeSubTab === tab.id
                ? 'border-amber-400 text-amber-400 bg-[#1c1a17]'
                : 'border-transparent text-[#9e968b] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: MEDIA LIBRARY (Professional CMS Grid) */}
      {/* ============================================================== */}
      {activeSubTab === 'library' && (
        <div className="space-y-4">
          {/* Action & Filter Bar */}
          <div className="p-4 rounded-2xl bg-[#181614] border border-[#2b2723] flex flex-wrap gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[#9e968b] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, filename, tags, caption..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#201e1b] border border-[#3a3530] text-xs text-white placeholder-[#787168] focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Filter by Category & Sort */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-[#9e968b]">
                <Filter className="w-3.5 h-3.5 text-amber-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-xs text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Categories' : c}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-xs text-white"
              >
                <option value="newest">Sort: Newest Uploads</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="name">Sort: File Name A–Z</option>
                <option value="size">Sort: File Size</option>
              </select>
            </div>
          </div>

          {/* Bulk Selection Bar */}
          <div className="px-4 py-2.5 rounded-xl bg-[#1d1b18] border border-[#2b2723] flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-[#d8d0c5]">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === filteredMedia.length}
                  onChange={toggleSelectAll}
                  className="accent-amber-400 rounded"
                />
                <span>Select All ({filteredMedia.length} Photos)</span>
              </label>

              {selectedIds.length > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                  {selectedIds.length} Selected
                </span>
              )}
            </div>

            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDelete}
                className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
            )}
          </div>

          {/* Media Grid */}
          {filteredMedia.length === 0 ? (
            <div className="py-20 text-center bg-[#181614] border border-[#2b2723] rounded-2xl p-8">
              <ImageIcon className="w-12 h-12 text-[#4a443d] mx-auto mb-3" />
              <h4 className="text-base font-bold text-white font-editorial">No media found</h4>
              <p className="text-xs text-[#9e968b] mt-1 max-w-sm mx-auto">
                No photos match the selected filter. Upload photos from your device or browse the bulk multi-photo uploader.
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab('bulk')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-amber-400 text-black text-xs font-semibold uppercase tracking-wider"
              >
                Upload Device Photos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border bg-[#181614] overflow-hidden flex flex-col justify-between group transition-all ${
                      isSelected
                        ? 'border-amber-400 shadow-xl ring-1 ring-amber-400'
                        : 'border-[#2b2723] hover:border-[#453f38]'
                    }`}
                  >
                    <div>
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video bg-black overflow-hidden">
                        <img
                          src={item.thumbnailUrl || item.url}
                          alt={item.altText || item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />

                        {/* Checkbox Overlay */}
                        <div className="absolute top-2 left-2 z-10">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(item.id)}
                            className="w-4 h-4 accent-amber-400 rounded cursor-pointer shadow-lg"
                          />
                        </div>

                        {/* Aspect Ratio & Size Badge */}
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-amber-300 backdrop-blur-sm border border-[#332f2a]">
                          {item.aspectRatio || '16:9'} • {item.fileSizeFormatted}
                        </div>

                        {/* Category tag */}
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] uppercase font-semibold text-white backdrop-blur-sm">
                          {item.category}
                        </div>
                      </div>

                      {/* Info & Metadata */}
                      <div className="p-3.5 space-y-1">
                        <h4 className="font-editorial text-sm font-bold text-white leading-tight truncate">
                          {item.title}
                        </h4>
                        <p className="text-[10px] font-mono text-[#857d74] truncate">
                          {item.fileName}
                        </p>
                        {item.dimensions && (
                          <p className="text-[10px] text-[#9e968b] font-mono">
                            {item.dimensions.width} × {item.dimensions.height} px
                          </p>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="pt-1.5 flex flex-wrap gap-1">
                            {item.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="text-[9px] font-mono text-amber-300/80 bg-[#221f1c] px-1.5 py-0.2 rounded border border-[#2e2a26]"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-2.5 bg-[#1c1a17] border-t border-[#262320] flex items-center justify-between text-xs">
                      <span className="text-[10px] text-[#787168] font-mono">
                        {new Date(item.uploadedAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setCroppingItem(item)}
                          className="p-1.5 rounded-lg bg-[#25221e] hover:bg-amber-400 hover:text-black text-amber-300 transition-colors"
                          title="Crop Aspect Ratio"
                        >
                          <Crop className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          className="p-1.5 rounded-lg bg-[#25221e] hover:bg-amber-400 hover:text-black text-[#d8d0c5] transition-colors"
                          title="Edit Alt Text & Metadata"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMediaToDelete(item);
                          }}
                          className="p-1.5 rounded-lg bg-[#25221e] hover:bg-rose-950 hover:text-rose-400 text-[#857d74] transition-colors"
                          title="Delete Photograph"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MUSEUM ALBUMS */}
      {/* ============================================================== */}
      {activeSubTab === 'albums' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-editorial text-xl font-bold text-white">
                Museum Albums & Curated Collections
              </h3>
              <p className="text-xs text-[#9e968b]">
                Group photographs into thematic exhibitions and archival volumes.
              </p>
            </div>
            <button
              onClick={handleOpenAddAlbum}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Album</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryAlbums.map((alb) => {
              const albumPhotos = galleryPhotos.filter((p) => p.albumId === alb.id);
              return (
                <div
                  key={alb.id}
                  className="rounded-2xl bg-[#181614] border border-[#2b2723] overflow-hidden flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="h-44 overflow-hidden bg-black relative">
                      <img
                        src={alb.coverImage}
                        alt={alb.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] uppercase font-mono text-amber-300 border border-[#332f2a]">
                        {alb.category} • {alb.year}
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                        {albumPhotos.length} Photographs
                      </div>
                    </div>

                    <div className="p-5 space-y-1.5">
                      <h4 className="font-editorial text-lg font-bold text-white leading-snug">
                        {alb.title}
                      </h4>
                      <p className="text-xs text-[#9e968b] line-clamp-2">
                        {alb.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#1c1a17] border-t border-[#262320] flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAlbum(alb);
                        setIsAlbumModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#25221e] hover:bg-amber-400 hover:text-black text-amber-300 font-semibold text-xs flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Album</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAlbumToDelete(alb)}
                      className="p-1.5 rounded-lg text-[#857d74] hover:text-rose-400 hover:bg-rose-950/60 transition-colors"
                      title="Delete Album"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: BULK MULTI-PHOTO UPLOAD */}
      {/* ============================================================== */}
      {activeSubTab === 'bulk' && (
        <BulkMediaUploader
          onAllCompleted={(items) => {
            alert(`Successfully ingested ${items.length} photographs into the Media Library!`);
            setActiveSubTab('library');
          }}
        />
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT MEDIA METADATA (Alt text, caption, tags) */}
      {/* ============================================================== */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#181614] border border-amber-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#faf7f2] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#2b2723]">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <h3 className="font-editorial text-xl font-bold text-white">
                  Edit Photo Metadata
                </h3>
              </div>
              <button onClick={() => setEditingItem(null)} className="text-[#9e968b] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMetadata} className="mt-5 space-y-4 text-xs">
              <div className="rounded-xl overflow-hidden border border-[#332f2a] aspect-video bg-black">
                <img src={editingItem.url} alt={editingItem.title} className="w-full h-full object-cover" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Alt Text (Screen Readers & SEO) *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.altText || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, altText: e.target.value })}
                  placeholder="Describe image clearly for accessibility..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Archival Caption / Curatorial Note
                </label>
                <textarea
                  rows={2}
                  value={editingItem.caption || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  placeholder="Historical context, photographer notes..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Category
                </label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
                >
                  <option value="Performances">Performances</option>
                  <option value="Theatre">Theatre</option>
                  <option value="Workshops">Workshops</option>
                  <option value="Campus">Campus</option>
                  <option value="Artists">Artists</option>
                  <option value="General">General</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                  Taxonomy Tags
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {editingItem.tags?.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-[#201e1b] text-amber-300 text-xs flex items-center gap-1 border border-[#332f2a]"
                    >
                      <span>#{t}</span>
                      <button type="button" onClick={() => handleRemoveTag(t)} className="text-rose-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add new tag..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#201e1b] border border-[#3a3530] text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 rounded-lg bg-[#25221e] hover:bg-amber-400 hover:text-black text-amber-300 text-xs font-semibold"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2b2723] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const toDelete = editingItem;
                    deleteMediaItem(toDelete.id);
                    try {
                      storageService.deleteMedia(toDelete.id, toDelete.fileName, toDelete.storageProvider).catch(() => {});
                    } catch {}
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Photograph</span>
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-xl border border-[#332f2a] text-xs text-[#9e968b] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs uppercase"
                  >
                    Save Metadata
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: IMAGE CROPPING */}
      {/* ============================================================== */}
      {croppingItem && (
        <ImageCropperModal
          isOpen={!!croppingItem}
          imageSrc={croppingItem.url}
          onClose={() => setCroppingItem(null)}
          onCropComplete={(croppedUrl) => {
            updateMediaItem(croppingItem.id, {
              url: croppedUrl,
              thumbnailUrl: croppedUrl,
              mediumUrl: croppedUrl,
            });
            setCroppingItem(null);
          }}
        />
      )}

      {/* ============================================================== */}
      {/* MODAL: CREATE / EDIT ALBUM */}
      {/* ============================================================== */}
      {isAlbumModalOpen && editingAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden">
          <form
            onSubmit={handleSaveAlbum}
            className="relative w-full max-w-lg bg-[#181614] border border-[#332f2a] rounded-2xl text-[#faf7f2] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Fixed Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-[#2b2723] flex-shrink-0 bg-[#181614]">
              <h3 className="font-editorial text-xl font-bold text-white">
                {editingAlbum.id ? 'Edit Museum Album' : 'Create New Museum Album'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAlbumModalOpen(false);
                  setEditingAlbum(null);
                }}
                className="p-1 rounded-lg text-[#9e968b] hover:text-white hover:bg-[#201e1b] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1 font-semibold">
                  Album Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingAlbum.title || ''}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
                  placeholder="e.g. Rang Mahotsav 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1 font-semibold">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingAlbum.description || ''}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, description: e.target.value })}
                  placeholder="Curatorial background and historical significance..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1 font-semibold">
                    Category
                  </label>
                  <select
                    value={editingAlbum.category || 'Performances'}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs"
                  >
                    <option value="Performances">Performances</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Festivals">Festivals</option>
                    <option value="Behind the Scenes">Behind the Scenes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1 font-semibold">
                    Year
                  </label>
                  <input
                    type="text"
                    value={editingAlbum.year || '2026'}
                    onChange={(e) => setEditingAlbum({ ...editingAlbum, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Cover Image Picker via MediaUploadField! */}
              <div className="pt-2">
                <MediaUploadField
                  label="Album Cover Photograph"
                  value={editingAlbum.coverImage || ''}
                  onChange={(url) => setEditingAlbum({ ...editingAlbum, coverImage: url })}
                  category="Gallery"
                  aspectRatio="16:9"
                  helperText="Primary visual for the album card"
                />
              </div>
            </div>

            {/* Modal Fixed Footer */}
            <div className="p-4 sm:px-6 border-t border-[#2b2723] flex items-center justify-between flex-shrink-0 bg-[#181614]">
              {editingAlbum.id ? (
                <button
                  type="button"
                  onClick={() => {
                    const idToDelete = editingAlbum.id!;
                    deleteAlbum(idToDelete);
                    setIsAlbumModalOpen(false);
                    setEditingAlbum(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Album</span>
                </button>
              ) : <div />}
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAlbumModalOpen(false);
                    setEditingAlbum(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-[#332f2a] text-xs text-[#9e968b] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs uppercase transition-colors"
                >
                  Save Album
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* CONFIRMATION MODAL: DELETE MUSEUM ALBUM */}
      {/* ============================================================== */}
      {albumToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#181614] border border-rose-500/30 p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/30">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-editorial">Delete Museum Album?</h3>
                <p className="text-xs text-[#9e968b]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#c4b9aa] leading-relaxed">
              Are you sure you want to delete <span className="text-white font-semibold">"{albumToDelete.title}"</span>? Any photographs in this album will remain safely in your media library but will no longer be linked to this album.
            </p>

            <div className="pt-3 border-t border-[#2b2723] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAlbumToDelete(null)}
                className="px-4 py-2 rounded-xl border border-[#332f2a] text-xs text-[#9e968b] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteAlbum(albumToDelete.id);
                  setAlbumToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg transition-colors"
              >
                Delete Album
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CONFIRMATION MODAL: DELETE MEDIA ITEM */}
      {/* ============================================================== */}
      {mediaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#181614] border border-rose-500/30 p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/30">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-editorial">Delete Photograph?</h3>
                <p className="text-xs text-[#9e968b]">This photograph will be permanently removed.</p>
              </div>
            </div>

            <p className="text-xs text-[#c4b9aa] leading-relaxed">
              Are you sure you want to delete <span className="text-white font-semibold">"{mediaToDelete.title || mediaToDelete.fileName}"</span>?
            </p>

            <div className="pt-3 border-t border-[#2b2723] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setMediaToDelete(null)}
                className="px-4 py-2 rounded-xl border border-[#332f2a] text-xs text-[#9e968b] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const toDelete = mediaToDelete;
                  deleteMediaItem(toDelete.id);
                  try {
                    storageService.deleteMedia(toDelete.id, toDelete.fileName, toDelete.storageProvider).catch(() => {});
                  } catch {}
                  setMediaToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg transition-colors"
              >
                Delete Photograph
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
