import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Image as ImageIcon, Save, CheckCircle2, Sparkles, RefreshCw, Eye } from 'lucide-react';
import type { HomepageConfig } from '../../types/database';
import { MediaUploadField } from '../../components/media/MediaUploadField';

export const AdminContentView: React.FC = () => {
  const { homepageConfig, updateHomepageConfig } = useDatabase();

  const [form, setForm] = useState<HomepageConfig>({ ...homepageConfig });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomepageConfig(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between pb-6 border-b border-[#25221e]">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-1">
            DYNAMIC CONTENT & ASSET REPOSITORY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-editorial">
            Homepage & Visual Assets Management
          </h2>
          <p className="text-xs text-[#9e968b] mt-1">
            Modify hero copy, imagery, 3D mandala settings, and featured sections without touching React code.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved to Live Site</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: HOMEPAGE HERO IMAGES */}
        <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 text-white font-editorial text-xl font-bold">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h3>Hero Banner Imagery & 3D Settings</h3>
          </div>

          <div className="space-y-4">
            <MediaUploadField
              label="Hero Main Background Photograph"
              value={form.heroImage}
              onChange={(url) => setForm({ ...form, heroImage: url })}
              category="Hero"
              aspectRatio="16:9"
              helperText="High-resolution panoramic banner shown on the homepage hero"
            />
          </div>

          <div className="pt-4 border-t border-[#25221e] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">Three.js Interactive 3D Stage Canvas</span>
              <span className="text-[11px] text-[#9e968b]">Display the sacred animated mandala and gold starlight particles</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.threeStageEnabled}
                onChange={(e) => setForm({ ...form, threeStageEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#332f2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>

        {/* SECTION 2: OTHER HOMEPAGE IMAGES */}
        <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 text-white font-editorial text-xl font-bold">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h3>Key Section Visual Assets</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MediaUploadField
              label="About / Parampara Lineage Section"
              value={form.aboutImage}
              onChange={(url) => setForm({ ...form, aboutImage: url })}
              category="Campus"
              aspectRatio="4:5"
              helperText="Living Guru-Shishya sanctum portrait"
            />

            <MediaUploadField
              label="Featured Staging / Repertoire Banner"
              value={form.featuredEventImage}
              onChange={(url) => setForm({ ...form, featuredEventImage: url })}
              category="Performances"
              aspectRatio="16:9"
              helperText="Mainstage dramatic capture"
            />
          </div>
        </div>

        {/* SECTION 3: HERO TEXT & EDITORIAL HEADLINES */}
        <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-white font-editorial text-xl font-bold">
            Hero Copy & Call-To-Actions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                Sansthan Title
              </label>
              <input
                type="text"
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                Hero Subtitle / Tagline
              </label>
              <input
                type="text"
                value={form.heroSubtitle}
                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
              Hero Editorial Statement / Quote
            </label>
            <textarea
              rows={3}
              value={form.heroQuote}
              onChange={(e) => setForm({ ...form, heroQuote: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                Primary CTA Button Text
              </label>
              <input
                type="text"
                value={form.heroPrimaryCtaText}
                onChange={(e) => setForm({ ...form, heroPrimaryCtaText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9e968b] mb-1 font-semibold">
                Secondary CTA Button Text
              </label>
              <input
                type="text"
                value={form.heroSecondaryCtaText}
                onChange={(e) => setForm({ ...form, heroSecondaryCtaText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#201e1b] border border-[#3a3530] text-[#faf7f2] text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Publish Homepage Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
