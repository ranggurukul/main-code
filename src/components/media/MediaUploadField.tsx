import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  FolderOpen,
  Link as LinkIcon,
  X,
  Crop,
  Check,
  RefreshCw,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { MediaLibraryModal } from './MediaLibraryModal';
import { ImageCropperModal } from './ImageCropperModal';
import { storageService } from '../../services/storage';
import { useDatabase } from '../../context/DatabaseContext';
import type { MediaItem } from '../../types/database';

interface MediaUploadFieldProps {
  label: string;
  value: string; // Image URL
  onChange: (url: string, mediaItem?: MediaItem) => void;
  onRemove?: () => void;
  category?: string;
  aspectRatio?: '1:1' | '4:5' | '16:9' | '21:9' | 'free';
  helperText?: string;
  required?: boolean;
  allowCrop?: boolean;
}

export const MediaUploadField: React.FC<MediaUploadFieldProps> = ({
  label,
  value,
  onChange,
  onRemove,
  category = 'General',
  aspectRatio = '16:9',
  helperText,
  required = false,
  allowCrop = true,
}) => {
  const { saveMediaItem } = useDatabase();

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  // Upload state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>('');

  const handleDeviceUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setCurrentFileName(file.name);
    setUploadStatus('uploading');
    setUploadProgress(15);
    setUploadError(null);

    try {
      const mediaItem = await storageService.uploadMedia(file, {
        category,
        onProgress: (pct) => setUploadProgress(pct),
      });

      saveMediaItem(mediaItem);
      onChange(mediaItem.url, mediaItem);
      setUploadStatus('success');
      setTimeout(() => {
        setUploadProgress(null);
        setUploadStatus('idle');
      }, 2000);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadStatus('error');
      setUploadError(err.message || 'Upload failed. Please retry.');
      setUploadProgress(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleDeviceUpload(e.dataTransfer.files);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    const mediaItem = storageService.createMediaFromUrl(manualUrl.trim(), label, { category });
    saveMediaItem(mediaItem);
    onChange(manualUrl.trim(), mediaItem);
    setShowUrlInput(false);
    setManualUrl('');
  };

  return (
    <div className="space-y-2">
      {/* Field Label & Actions */}
      <div className="flex items-center justify-between">
        <label className="block text-xs uppercase tracking-wider text-[#9e968b] font-semibold">
          {label} {required && <span className="text-amber-400">*</span>}
        </label>
        {helperText && (
          <span className="text-[10px] text-[#787168] font-mono">{helperText}</span>
        )}
      </div>

      {/* State A: Image Exists (Preview & Management Mode) */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-[#332f2a] bg-[#161412] group shadow-lg">
          <div className="relative aspect-video max-h-56 w-full overflow-hidden bg-black flex items-center justify-center">
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Quick Action Overlay on Hover */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {allowCrop && (
                <button
                  type="button"
                  onClick={() => setIsCropperOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-black/80 hover:bg-amber-400 hover:text-black text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/40 backdrop-blur-sm transition-all shadow-md"
                  title="Crop image to aspect ratio"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>Crop</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsLibraryOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-black/80 hover:bg-white hover:text-black text-[#faf7f2] text-xs font-semibold flex items-center gap-1.5 border border-white/30 backdrop-blur-sm transition-all shadow-md"
                title="Choose another photo from library"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Change</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onRemove) onRemove();
                  else onChange('');
                }}
                className="p-1.5 rounded-lg bg-rose-950/90 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 transition-colors shadow-md"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Indicator */}
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-[#332f2a] text-[10px] text-amber-300 font-mono">
              Active Photo
            </div>
          </div>

          {/* Under-Preview Action Bar */}
          <div className="p-3 bg-[#1c1a17] border-t border-[#292521] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <label className="cursor-pointer text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Device</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={(e) => handleDeviceUpload(e.target.files)}
                />
              </label>
              <span className="text-[#453f38]">•</span>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(true)}
                className="text-[#9e968b] hover:text-white text-xs font-medium flex items-center gap-1"
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-400/80" />
                <span>Media Library</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[11px] text-[#787168] hover:text-amber-400 flex items-center gap-1 font-mono"
              >
                <LinkIcon className="w-3 h-3" />
                <span>URL</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* State B: No Image Selected (Upload Box with 3 clear options) */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all bg-[#171513] ${
            isDragging
              ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
              : 'border-[#332f2a] hover:border-amber-500/40'
          }`}
        >
          {/* Progress / Status display during upload */}
          {uploadStatus === 'uploading' && uploadProgress !== null ? (
            <div className="space-y-3 py-4 max-w-sm mx-auto">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-amber-300 truncate max-w-[200px]">{currentFileName}</span>
                <span className="text-white font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#201e1b] overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-[#9e968b] block font-mono">
                Optimizing high-res image & generating WebP variants...
              </span>
            </div>
          ) : uploadStatus === 'success' ? (
            <div className="py-4 text-emerald-400 flex items-center justify-center gap-2 text-xs font-semibold animate-pulse">
              <Check className="w-4 h-4" />
              <span>✓ Upload Complete</span>
            </div>
          ) : uploadStatus === 'error' ? (
            <div className="py-3 text-rose-400 space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>Upload Failed — {uploadError}</span>
              </div>
              <label className="inline-block px-3 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-500/40 text-[11px] font-semibold cursor-pointer">
                Retry Upload
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  onChange={(e) => handleDeviceUpload(e.target.files)}
                />
              </label>
            </div>
          ) : (
            /* Normal Empty State */
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <Upload className="w-5 h-5" />
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  Drag & drop your photo here, or browse files
                </p>
                <p className="text-[11px] text-[#787168] mt-1 font-mono">
                  Supports JPG, PNG, WebP, AVIF up to 50MB. Auto-optimized for web.
                </p>
              </div>

              {/* Action Buttons: 1. Upload From Device (Primary), 2. Choose from Library (Secondary) */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <label className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-95 inline-flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Upload From Device</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={(e) => handleDeviceUpload(e.target.files)}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setIsLibraryOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#201e1b] hover:bg-[#282522] text-[#faf7f2] border border-[#38332c] text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Choose From Media Library</span>
                </button>
              </div>

              {/* 3. Add from URL (Optional Tertiary) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-[11px] text-[#787168] hover:text-amber-400 transition-colors inline-flex items-center gap-1 font-mono"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>{showUrlInput ? 'Hide URL Input' : 'Or paste an image URL'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accordion URL Input */}
      {showUrlInput && (
        <form onSubmit={handleApplyUrl} className="flex gap-2 pt-1 animate-fadeIn">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-[#201e1b] border border-[#332f2a] text-xs text-white placeholder-[#787168] focus:border-amber-400 focus:outline-none font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-400 text-black font-semibold text-xs uppercase tracking-wider shadow"
          >
            Apply URL
          </button>
        </form>
      )}

      {/* Modals */}
      <MediaLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        initialCategory={category}
        onSelect={(media) => {
          onChange(media.url, media);
        }}
      />

      {value && (
        <ImageCropperModal
          isOpen={isCropperOpen}
          imageSrc={value}
          aspectRatioPreset={aspectRatio}
          onClose={() => setIsCropperOpen(false)}
          onCropComplete={(croppedUrl) => {
            onChange(croppedUrl);
          }}
        />
      )}
    </div>
  );
};
