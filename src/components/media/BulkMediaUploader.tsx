import React, { useState } from 'react';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FolderOpen,
  Image as ImageIcon,
  Check,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { storageService } from '../../services/storage';
import { useDatabase } from '../../context/DatabaseContext';
import type { MediaItem, GalleryPhoto } from '../../types/database';

interface FileUploadQueueItem {
  id: string;
  file: File;
  name: string;
  sizeFormatted: string;
  progress: number;
  status: 'queued' | 'uploading' | 'completed' | 'error';
  error?: string;
  mediaItem?: MediaItem;
}

interface BulkMediaUploaderProps {
  defaultCategory?: string;
  defaultAlbumId?: string;
  onAllCompleted?: (uploadedItems: MediaItem[]) => void;
}

export const BulkMediaUploader: React.FC<BulkMediaUploaderProps> = ({
  defaultCategory = 'Performances',
  defaultAlbumId,
  onAllCompleted,
}) => {
  const { galleryAlbums, saveMultipleMediaItems, saveGalleryPhoto } = useDatabase();

  const [category, setCategory] = useState<string>(defaultCategory);
  const [albumId, setAlbumId] = useState<string>(defaultAlbumId || '');
  const [queue, setQueue] = useState<FileUploadQueueItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const selectedAlbum = galleryAlbums.find((a) => a.id === albumId);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: FileUploadQueueItem[] = Array.from(files).map((file, idx) => ({
      id: 'q_' + Date.now() + '_' + idx + '_' + Math.random().toString(36).slice(2, 6),
      file,
      name: file.name,
      sizeFormatted: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      progress: 0,
      status: 'queued',
    }));

    setQueue((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const startBatchUpload = async () => {
    if (queue.length === 0 || isUploading) return;
    setIsUploading(true);

    const uploadedResults: MediaItem[] = [];
    const pendingItems = queue.filter((item) => item.status === 'queued' || item.status === 'error');

    // Process files in concurrency-limited batches (3 files at a time) to prevent UI freezing
    const CONCURRENCY = 3;
    for (let i = 0; i < pendingItems.length; i += CONCURRENCY) {
      const batch = pendingItems.slice(i, i + CONCURRENCY);

      await Promise.all(
        batch.map(async (queueItem) => {
          // Update status to uploading
          setQueue((prev) =>
            prev.map((q) => (q.id === queueItem.id ? { ...q, status: 'uploading', progress: 10 } : q))
          );

          try {
            const mediaItem = await storageService.uploadMedia(queueItem.file, {
              category,
              albumId: albumId || undefined,
              albumTitle: selectedAlbum?.title || undefined,
              onProgress: (pct) => {
                setQueue((prev) =>
                  prev.map((q) => (q.id === queueItem.id ? { ...q, progress: pct } : q))
                );
              },
            });

            // Also create a GalleryPhoto record so it instantly appears in the public gallery!
            saveGalleryPhoto({
              title: mediaItem.title,
              caption: `Archival photograph from ${selectedAlbum?.title || category}.`,
              category: category as any,
              albumId: albumId || undefined,
              albumTitle: selectedAlbum?.title || undefined,
              tags: ['Archival', category, selectedAlbum?.title || 'Rang Gurukul'].filter(Boolean),
              imageUrl: mediaItem.url,
              aspectRatio: (mediaItem.aspectRatio === '1:1' ? 'square' : mediaItem.aspectRatio === '4:5' ? 'portrait' : 'landscape') as any,
              isFeatured: false,
              order: 100,
              year: '2026',
            });

            uploadedResults.push(mediaItem);

            setQueue((prev) =>
              prev.map((q) =>
                q.id === queueItem.id
                  ? { ...q, status: 'completed', progress: 100, mediaItem }
                  : q
              )
            );
          } catch (err: any) {
            setQueue((prev) =>
              prev.map((q) =>
                q.id === queueItem.id
                  ? { ...q, status: 'error', error: err.message || 'Upload failed' }
                  : q
              )
            );
          }
        })
      );

      // Brief tick to allow UI to breathe
      await new Promise((r) => setTimeout(r, 50));
    }

    if (uploadedResults.length > 0) {
      saveMultipleMediaItems(uploadedResults);
      onAllCompleted?.(uploadedResults);
    }

    setIsUploading(false);
  };

  const clearCompleted = () => {
    setQueue((prev) => prev.filter((q) => q.status !== 'completed'));
  };

  const removeQueueItem = (id: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
  };

  // Metrics
  const completedCount = queue.filter((q) => q.status === 'completed').length;
  const errorCount = queue.filter((q) => q.status === 'error').length;
  const overallPercentage = queue.length > 0 ? Math.round((completedCount / queue.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Upload Setup Configuration Box */}
      <div className="p-6 rounded-2xl bg-[#181614] border border-[#2b2723] space-y-4">
        <h4 className="text-base font-editorial font-bold text-white flex items-center gap-2">
          <Upload className="w-4 h-4 text-amber-400" />
          <span>Batch Ingestion Settings</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1">
              Target Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#201e1b] border border-[#332f2a] text-white focus:outline-none"
            >
              <option value="Performances">Performances</option>
              <option value="Theatre">Theatre</option>
              <option value="Workshops">Workshops</option>
              <option value="Artists">Artists</option>
              <option value="Festivals">Festivals</option>
              <option value="Campus">Campus & Gurukul</option>
              <option value="Behind the Scenes">Behind the Scenes</option>
              <option value="General">General Media</option>
            </select>
          </div>

          <div>
            <label className="block text-[#9e968b] uppercase font-mono text-[10px] mb-1">
              Assign to Museum Album (Optional)
            </label>
            <select
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#201e1b] border border-[#332f2a] text-white focus:outline-none"
            >
              <option value="">-- No Specific Album (General Gallery) --</option>
              {galleryAlbums.map((alb) => (
                <option key={alb.id} value={alb.id}>
                  {alb.title} ({alb.year})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`p-10 rounded-2xl border-2 border-dashed text-center transition-all bg-[#161412] ${
          isDragging
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : 'border-[#332f2a] hover:border-amber-500/50'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-xl">
          <Upload className="w-8 h-8" />
        </div>

        <h3 className="font-editorial text-2xl font-bold text-white">
          Upload Multiple Photographs (50–200+ Photos)
        </h3>
        <p className="text-xs text-[#9e968b] mt-1.5 max-w-md mx-auto">
          Select dozens or hundreds of photos directly from your device. Each photograph is automatically optimized, converted to responsive WebP variants, and added to the Media Library.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <label className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs uppercase tracking-wider cursor-pointer shadow-lg transition-transform active:scale-95 inline-flex items-center gap-2">
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>Select Multiple Device Photos</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) => handleFilesSelected(e.target.files)}
            />
          </label>
        </div>

        <div className="mt-6 pt-4 border-t border-[#292521] flex flex-wrap items-center justify-center gap-4 text-[10px] text-[#787168] font-mono">
          <span>✓ Multi-Select Enabled</span>
          <span>•</span>
          <span>✓ Non-blocking Parallel Batches</span>
          <span>•</span>
          <span>✓ Auto-Optimized to WebP</span>
        </div>
      </div>

      {/* Queue & Progress Section */}
      {queue.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#181614] border border-[#2b2723] space-y-5">
          {/* Header Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262320]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-editorial font-bold text-white">
                  Batch Upload Queue ({queue.length} Files Selected)
                </span>
                {completedCount > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    {completedCount} Completed
                  </span>
                )}
                {errorCount > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500/40">
                    {errorCount} Failed
                  </span>
                )}
              </div>
              <p className="text-xs text-[#9e968b] mt-0.5">
                Target: {selectedAlbum ? selectedAlbum.title : category}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {completedCount > 0 && !isUploading && (
                <button
                  type="button"
                  onClick={clearCompleted}
                  className="text-xs text-[#9e968b] hover:text-white underline"
                >
                  Clear Completed
                </button>
              )}

              <button
                type="button"
                disabled={isUploading || completedCount === queue.length}
                onClick={startBatchUpload}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Uploading ({overallPercentage}%)</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload All {queue.length} Photos</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#9e968b]">
                {completedCount} of {queue.length} Photos Uploaded
              </span>
              <span className="text-amber-400 font-bold">{overallPercentage}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#201e1b] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>

          {/* Individual Queue Items List */}
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {queue.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#201e1b] border border-[#2d2925] flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center border border-[#332f2a] flex-shrink-0 text-[#787168]">
                    <ImageIcon className="w-4 h-4 text-amber-400/80" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white truncate text-xs">{item.name}</div>
                    <div className="text-[10px] text-[#857d74] font-mono">{item.sizeFormatted}</div>
                  </div>
                </div>

                {/* Progress / Status */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  {item.status === 'uploading' && (
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-[#161412] overflow-hidden">
                        <div
                          className="h-full bg-amber-400 transition-all duration-150"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-amber-300">{item.progress}%</span>
                    </div>
                  )}

                  {item.status === 'completed' && (
                    <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1 font-mono">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Complete</span>
                    </span>
                  )}

                  {item.status === 'error' && (
                    <span className="text-rose-400 font-semibold text-xs flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>Failed</span>
                    </span>
                  )}

                  {item.status === 'queued' && (
                    <span className="text-[#787168] text-[11px] font-mono">Queued</span>
                  )}

                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => removeQueueItem(item.id)}
                      className="p-1 rounded text-[#787168] hover:text-rose-400 hover:bg-[#2b2723]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
