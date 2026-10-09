import React, { useState } from 'react';
import {
  X,
  Search,
  Filter,
  Check,
  Upload,
  Image as ImageIcon,
  Calendar,
  Layers,
  Sparkles,
  Info,
  Clock,
  Trash2,
} from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';
import type { MediaItem } from '../../types/database';
import { storageService } from '../../services/storage';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
  initialCategory?: string;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialCategory = 'All',
}) => {
  const { mediaLibrary, saveMediaItem, deleteMediaItem } = useDatabase();

  const [activeTab, setActiveTab] = useState<'browse' | 'upload'>('browse');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'size'>('newest');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Quick upload state inside modal
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const categories = [
    'All',
    'Hero',
    'Performances',
    'Workshops',
    'Campus',
    'Artists',
    'General',
  ];

  // Filter & Sort
  const filteredItems = mediaLibrary
    .filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !search.trim() ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.fileName.toLowerCase().includes(search.toLowerCase()) ||
        (item.caption && item.caption.toLowerCase().includes(search.toLowerCase())) ||
        item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      }
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'size') {
        return b.fileSize - a.fileSize;
      }
      return 0;
    });

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploadProgress(10);
    setUploadError(null);

    try {
      const mediaItem = await storageService.uploadMedia(file, {
        category: selectedCategory === 'All' ? 'General' : selectedCategory,
        onProgress: (pct) => setUploadProgress(pct),
      });

      saveMediaItem(mediaItem);
      setSelectedItem(mediaItem);
      setActiveTab('browse');
      setUploadProgress(null);
    } catch (err: any) {
      console.error('Upload failed', err);
      setUploadError(err.message || 'Upload failed. Please check file format.');
      setUploadProgress(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#141210] border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[#faf7f2]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#262320] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-white">
                Select Photo from Media Library
              </h3>
              <p className="text-xs text-[#9e968b]">
                Browse existing curated photographs or upload a new photo from your device.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="flex rounded-xl bg-[#201e1b] p-1 border border-[#332f2a]">
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === 'browse'
                    ? 'bg-amber-400 text-black shadow'
                    : 'text-[#9e968b] hover:text-white'
                }`}
              >
                Browse Library ({mediaLibrary.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === 'upload'
                    ? 'bg-amber-400 text-black shadow'
                    : 'text-[#9e968b] hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#9e968b] hover:text-white hover:bg-[#201e1b] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Browse Media */}
        {activeTab === 'browse' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Main Grid Area */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-[#262320]">
              {/* Filter & Search Bar */}
              <div className="p-4 border-b border-[#262320] flex flex-wrap gap-3 items-center justify-between bg-[#181614]">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-[#9e968b] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title, tag, or file name..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#201e1b] border border-[#332f2a] text-xs text-white placeholder-[#787168] focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-[#201e1b] border border-[#332f2a] text-xs text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c === 'All' ? 'All Categories' : c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-xl bg-[#201e1b] border border-[#332f2a] text-xs text-white focus:outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Name A–Z</option>
                    <option value="size">Largest Size</option>
                  </select>
                </div>
              </div>

              {/* Photo Grid */}
              <div className="flex-1 p-4 overflow-y-auto">
                {filteredItems.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-[#9e968b]">
                    <ImageIcon className="w-12 h-12 text-[#4a443d] mb-3" />
                    <p className="text-sm font-semibold text-white">No photographs found</p>
                    <p className="text-xs text-[#787168] mt-1 max-w-xs">
                      Try broadening your search or upload a new photo directly from your computer.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className="mt-4 px-4 py-2 rounded-xl bg-amber-400 text-black text-xs font-semibold uppercase tracking-wider"
                    >
                      Upload A Photo
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                    {filteredItems.map((item) => {
                      const isSelected = selectedItem?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all aspect-square bg-black ${
                            isSelected
                              ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[0.98]'
                              : 'border-[#2d2925] hover:border-amber-500/50'
                          }`}
                        >
                          <img
                            src={item.thumbnailUrl || item.url}
                            alt={item.altText || item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />

                          {/* Selected check badge */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}

                          {/* Category badge */}
                          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-amber-300 backdrop-blur-sm">
                            {item.aspectRatio || '16:9'} • {item.fileSizeFormatted}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Details Drawer */}
            <div className="w-full md:w-80 bg-[#171513] p-5 flex flex-col justify-between overflow-y-auto">
              {selectedItem ? (
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden border border-[#332f2a] aspect-video bg-black">
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h4 className="font-editorial text-base font-bold text-white leading-snug">
                      {selectedItem.title}
                    </h4>
                    <p className="text-[11px] font-mono text-[#9e968b] truncate mt-0.5">
                      {selectedItem.fileName}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs border-y border-[#262320] py-3">
                    <div className="flex justify-between">
                      <span className="text-[#857d74]">Dimensions:</span>
                      <span className="text-white font-mono">
                        {selectedItem.dimensions?.width} × {selectedItem.dimensions?.height} px ({selectedItem.aspectRatio})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#857d74]">File Size:</span>
                      <span className="text-emerald-400 font-mono font-semibold">
                        {selectedItem.fileSizeFormatted}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#857d74]">Category:</span>
                      <span className="text-amber-400 font-semibold">{selectedItem.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#857d74]">Upload Date:</span>
                      <span className="text-[#9e968b]">
                        {new Date(selectedItem.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {selectedItem.caption && (
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#857d74] block mb-1">
                        Caption
                      </span>
                      <p className="text-xs text-[#d8d0c5] bg-[#1f1d1a] p-2.5 rounded-lg border border-[#2b2723]">
                        {selectedItem.caption}
                      </p>
                    </div>
                  )}

                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 bg-[#24211e] border border-[#332f2a]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#857d74]">
                  <Info className="w-8 h-8 text-[#4a443d] mb-2" />
                  <p className="text-xs">Click any photo in the library to view details and use it.</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#262320] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#201e1b] text-xs text-[#9e968b] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedItem}
                  onClick={() => {
                    if (selectedItem) {
                      onSelect(selectedItem);
                      onClose();
                    }
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs uppercase tracking-wider transition-all disabled:opacity-40 shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Use This Photo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Upload New Photo */}
        {activeTab === 'upload' && (
          <div className="flex-1 p-8 flex flex-col items-center justify-center overflow-y-auto">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`w-full max-w-xl p-10 rounded-2xl border-2 border-dashed text-center transition-all ${
                isDragging
                  ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                  : 'border-[#38332c] bg-[#1a1815] hover:border-amber-500/50'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Upload className="w-7 h-7" />
              </div>

              <h4 className="font-editorial text-xl font-bold text-white">
                Drag & Drop Photos Here
              </h4>
              <p className="text-xs text-[#9e968b] mt-1.5 max-w-sm mx-auto">
                Select high-resolution photographs directly from your computer or phone. Supported: JPG, PNG, WebP, AVIF up to 50MB.
              </p>

              {uploadProgress !== null && (
                <div className="mt-6 max-w-xs mx-auto space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-amber-400">Optimizing & Uploading...</span>
                    <span className="text-white">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#201e1b] overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs">
                  {uploadError}
                </div>
              )}

              <div className="mt-6 flex items-center justify-center gap-4">
                <label className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs uppercase tracking-wider cursor-pointer shadow-lg transition-transform active:scale-95 inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Browse Device Files</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </label>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2d2925] flex items-center justify-center gap-4 text-[10px] text-[#787168] font-mono">
                <span>✓ Auto-Optimized to WebP</span>
                <span>•</span>
                <span>✓ Generates Responsive Sizes</span>
                <span>•</span>
                <span>✓ Stored Securely</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
