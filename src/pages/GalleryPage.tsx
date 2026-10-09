import React, { useState, useEffect } from 'react';
import { PageTransition } from '../components/PageTransition';
import { useDatabase } from '../context/DatabaseContext';
import {
  Search,
  Filter,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Calendar,
  Tag,
  Download,
  Info,
} from 'lucide-react';
import type { GalleryPhoto } from '../types/database';

const PAGE_SIZE = 8;

export const GalleryPage: React.FC = () => {
  const { galleryPhotos, galleryAlbums } = useDatabase();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAlbum, setSelectedAlbum] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Lightbox State
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const categories = [
    'All',
    'Performances',
    'Theatre',
    'Workshops',
    'Artists',
    'Festivals',
    'Campus',
    'Behind the Scenes',
    'Cultural Events',
    'Rang Gurukul Memories',
    'General',
  ];

  // Filtering
  const filteredPhotos = galleryPhotos.filter((p) => {
    const matchesCat =
      selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesAlbum = selectedAlbum === 'All' || p.albumId === selectedAlbum;
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesAlbum && matchesSearch;
  });

  const displayedPhotos = filteredPhotos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPhotos.length;

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') setActivePhotoIndex(null);
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev !== null && prev < displayedPhotos.length - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : displayedPhotos.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, displayedPhotos.length]);

  const activePhoto = activePhotoIndex !== null ? displayedPhotos[activePhotoIndex] : null;

  return (
    <PageTransition>
      {/* Top Banner */}
      <section className="pt-36 pb-16 px-4 sm:px-6 lg:px-12 bg-[#161412] border-b border-[#2b2723]">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2 font-mono">
            Living Digital Art Archive • रंग संग्रहालय
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl text-[#faf7f2] font-bold">
            The Cultural Photo Archive
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#d8d0c5] max-w-2xl font-light leading-relaxed">
            Curated photographic chronicles of theatrical stagings, mask sculpting guilds,
            sacred dawn rehearsals, and rare oral folk traditions preserved by Rang Gurukul.
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#9e968b] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder="Search archive by keyword, tag, or artist..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            {/* Album Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9e968b] whitespace-nowrap">Album:</span>
              <select
                value={selectedAlbum}
                onChange={(e) => {
                  setSelectedAlbum(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs focus:border-[#d4af37] focus:outline-none"
              >
                <option value="All">All Albums ({galleryAlbums.length})</option>
                {galleryAlbums.map((alb) => (
                  <option key={alb.id} value={alb.id}>
                    {alb.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                  selectedCategory === cat
                    ? 'border-[#d4af37] bg-[#2a2622] text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                    : 'border-[#332f2a] bg-[#1a1816] text-[#9e968b] hover:text-[#faf7f2]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Museum Masonry Layout */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 bg-[#121110]">
        <div className="max-w-7xl mx-auto">
          {/* Asset Counter */}
          <div className="flex items-center justify-between text-xs text-[#9e968b] mb-8 pb-3 border-b border-[#221f1c]">
            <span>
              Showing {displayedPhotos.length} of {filteredPhotos.length} curated archival photographs
            </span>
            <span className="hidden sm:inline font-mono text-[#d4af37]">
              CDN-Optimized High-Res Asset Vault
            </span>
          </div>

          {displayedPhotos.length === 0 ? (
            <div className="py-20 text-center text-[#9e968b] space-y-3">
              <Info className="w-10 h-10 text-[#d4af37] mx-auto opacity-60" />
              <p className="text-base font-editorial">No archival images match your filter criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedAlbum('All');
                  setSearchQuery('');
                }}
                className="text-xs uppercase text-[#d4af37] hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[280px]">
              {displayedPhotos.map((photo, idx) => {
                // Vary aspect ratios for museum feel
                const isWide = photo.aspectRatio === 'wide' || idx % 7 === 0;
                const isTall = photo.aspectRatio === 'portrait' || idx % 5 === 0;

                return (
                  <div
                    key={photo.id}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`theatre-card rounded-2xl overflow-hidden border border-[#332f2a] cursor-pointer group relative ${
                      isWide ? 'sm:col-span-2' : ''
                    } ${isTall ? 'row-span-2' : ''}`}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-[#d4af37] bg-black/70 px-2.5 py-1 rounded-full backdrop-blur-md border border-[#d4af37]/30">
                        {photo.category}
                      </span>
                      {photo.isFeatured && (
                        <span className="text-[10px] uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Bottom Metadata */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-editorial text-base sm:text-lg font-bold text-[#faf7f2] group-hover:text-[#d4af37] transition-colors leading-tight">
                        {photo.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-[#9e968b] line-clamp-2 leading-relaxed">
                        {photo.caption}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#787168] pt-2 border-t border-[#332f2a]/60">
                        <span>{photo.year}</span>
                        <span className="flex items-center gap-1 text-[#d4af37] group-hover:underline">
                          <Maximize2 className="w-3 h-3" />
                          <span>View Fullscreen</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button (Thousands of Photos Architecture) */}
          {hasMore && (
            <div className="mt-14 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="px-8 py-3.5 rounded-full border border-[#d4af37]/50 bg-[#1c1a17] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#121110] font-editorial font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl"
              >
                Load More Archival Assets ({filteredPhotos.length - displayedPhotos.length} remaining)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Lightbox Fullscreen Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8">
          <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col lg:flex-row bg-[#161412] border border-[#d4af37]/40 rounded-2xl overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setActivePhotoIndex(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-[#d4af37] hover:text-[#121110] text-[#faf7f2] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Nav Arrow */}
            <button
              onClick={() =>
                setActivePhotoIndex((prev) =>
                  prev !== null && prev > 0 ? prev - 1 : displayedPhotos.length - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/70 hover:bg-[#d4af37] hover:text-[#121110] text-[#faf7f2] transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Nav Arrow */}
            <button
              onClick={() =>
                setActivePhotoIndex((prev) =>
                  prev !== null && prev < displayedPhotos.length - 1 ? prev + 1 : 0
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 lg:right-[360px] z-20 p-2.5 rounded-full bg-black/70 hover:bg-[#d4af37] hover:text-[#121110] text-[#faf7f2] transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image Stage */}
            <div className="lg:flex-1 bg-black flex items-center justify-center p-4 overflow-hidden relative">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[75vh] w-auto object-contain mx-auto transition-transform duration-300"
              />
            </div>

            {/* Archival Metadata Sidebar */}
            <div className="lg:w-80 sm:w-96 p-6 sm:p-8 bg-[#1a1816] border-t lg:border-t-0 lg:border-l border-[#332f2a] flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37] block">
                    {activePhoto.category} • {activePhoto.year}
                  </span>
                  <h2 className="font-editorial text-2xl font-bold text-[#faf7f2] mt-1">
                    {activePhoto.title}
                  </h2>
                </div>

                <p className="text-xs text-[#d8d0c5] leading-relaxed">
                  {activePhoto.caption}
                </p>

                {activePhoto.albumTitle && (
                  <div className="text-xs">
                    <span className="text-[#9e968b] block text-[10px] uppercase">Album</span>
                    <span className="text-[#faf7f2] font-semibold">{activePhoto.albumTitle}</span>
                  </div>
                )}

                {activePhoto.credit && (
                  <div className="text-xs">
                    <span className="text-[#9e968b] block text-[10px] uppercase">Attribution</span>
                    <span className="text-[#faf7f2] italic">{activePhoto.credit}</span>
                  </div>
                )}

                {activePhoto.tags.length > 0 && (
                  <div>
                    <span className="text-[#9e968b] block text-[10px] uppercase mb-2">Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activePhoto.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-[#25221e] text-[10px] text-[#d4af37] border border-[#3a3530]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-[#332f2a] flex items-center justify-between text-xs text-[#9e968b]">
                <span>
                  Photo {(activePhotoIndex || 0) + 1} of {displayedPhotos.length}
                </span>
                <span className="text-[10px] font-mono">Use ← → arrow keys</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};
