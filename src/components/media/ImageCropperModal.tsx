import React, { useState, useRef, useEffect } from 'react';
import { X, Crop, Check, RotateCw, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';
import { cropImageToWebP } from '../../utils/imageOptimizer';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedUrl: string) => void;
  aspectRatioPreset?: '1:1' | '4:5' | '16:9' | '21:9' | 'free';
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  aspectRatioPreset = 'free',
}) => {
  const [selectedRatio, setSelectedRatio] = useState<'free' | '1:1' | '4:5' | '16:9' | '21:9'>(aspectRatioPreset);
  const [zoom, setZoom] = useState(1);
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, width: 80, height: 80 }); // in percentages
  const [isCropping, setIsCropping] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setZoom(1);

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      applyRatioToBox(selectedRatio, img.naturalWidth, img.naturalHeight);
    };
  }, [isOpen, imageSrc]);

  const applyRatioToBox = (ratio: 'free' | '1:1' | '4:5' | '16:9' | '21:9', imgW?: number, imgH?: number) => {
    setSelectedRatio(ratio);
    const w = imgW || imageDimensions?.width || 800;
    const h = imgH || imageDimensions?.height || 600;

    if (ratio === 'free') {
      setCropBox({ x: 5, y: 5, width: 90, height: 90 });
      return;
    }

    let targetRatio = 1;
    if (ratio === '1:1') targetRatio = 1;
    if (ratio === '4:5') targetRatio = 4 / 5;
    if (ratio === '16:9') targetRatio = 16 / 9;
    if (ratio === '21:9') targetRatio = 21 / 9;

    const imgRatio = w / h;

    if (targetRatio > imgRatio) {
      // Crop is wider than image
      const boxW = 90;
      const pixelW = (boxW / 100) * w;
      const pixelH = pixelW / targetRatio;
      const boxH = Math.min(90, (pixelH / h) * 100);
      setCropBox({
        x: (100 - boxW) / 2,
        y: (100 - boxH) / 2,
        width: boxW,
        height: boxH,
      });
    } else {
      // Crop is taller than image
      const boxH = 90;
      const pixelH = (boxH / 100) * h;
      const pixelW = pixelH * targetRatio;
      const boxW = Math.min(90, (pixelW / w) * 100);
      setCropBox({
        x: (100 - boxW) / 2,
        y: (100 - boxH) / 2,
        width: boxW,
        height: boxH,
      });
    }
  };

  const handleApplyCrop = async () => {
    if (!imageDimensions) return;
    setIsCropping(true);

    try {
      const realX = (cropBox.x / 100) * imageDimensions.width;
      const realY = (cropBox.y / 100) * imageDimensions.height;
      const realW = (cropBox.width / 100) * imageDimensions.width;
      const realH = (cropBox.height / 100) * imageDimensions.height;

      const result = await cropImageToWebP(imageSrc, {
        x: realX,
        y: realY,
        width: realW,
        height: realH,
      });

      onCropComplete(result.url);
      onClose();
    } catch (err) {
      console.error('Failed to crop image', err);
      alert('Could not complete cropping. Original image preserved.');
    } finally {
      setIsCropping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#161412] border border-amber-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#faf7f2] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2b2723]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white">
                Precision Image Cropping
              </h3>
              <p className="text-xs text-[#9e968b]">
                Adjust aspect ratio & boundaries without degrading image fidelity.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#9e968b] hover:text-white hover:bg-[#201e1b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#24211e]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] uppercase tracking-wider text-[#9e968b] font-mono mr-1">Preset:</span>
            {[
              { id: 'free', label: 'Free / Original' },
              { id: '1:1', label: '1:1 Square' },
              { id: '4:5', label: '4:5 Portrait' },
              { id: '16:9', label: '16:9 Landscape' },
              { id: '21:9', label: '21:9 Banner' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => applyRatioToBox(r.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                  selectedRatio === r.id
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'bg-[#201e1b] text-[#9e968b] hover:text-white border border-[#332f2a]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Zoom Control */}
          <div className="flex items-center gap-2 text-xs text-[#9e968b]">
            <ZoomOut className="w-3.5 h-3.5" />
            <input
              type="range"
              min="0.8"
              max="2.0"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-24 accent-amber-400"
            />
            <ZoomIn className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] text-amber-300 min-w-8">
              {Math.round(zoom * 100)}%
            </span>
          </div>
        </div>

        {/* Canvas / Image Work Area */}
        <div
          ref={containerRef}
          className="relative flex-1 min-h-[350px] max-h-[480px] bg-[#0c0b0a] rounded-xl overflow-hidden my-4 border border-[#2b2723] flex items-center justify-center select-none"
        >
          <div
            className="relative transition-transform duration-100 ease-out"
            style={{ transform: `scale(${zoom})` }}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop Source"
              className="max-h-[440px] max-w-full object-contain pointer-events-none rounded"
            />

            {/* Simulated Crop Frame Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
                left: `${cropBox.x}%`,
                top: `${cropBox.y}%`,
                width: `${cropBox.width}%`,
                height: `${cropBox.height}%`,
                border: '2px solid #d4af37',
              }}
            >
              {/* Corner Handles */}
              <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-amber-400 border border-black rounded-sm" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-400 border border-black rounded-sm" />
              <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-amber-400 border border-black rounded-sm" />
              <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-amber-400 border border-black rounded-sm" />

              {/* Grid 3x3 Rule of Thirds */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                <div className="border-r border-b border-amber-300/40" />
                <div className="border-r border-b border-amber-300/40" />
                <div className="border-b border-amber-300/40" />
                <div className="border-r border-b border-amber-300/40" />
                <div className="border-r border-b border-amber-300/40" />
                <div className="border-b border-amber-300/40" />
                <div className="border-r border-amber-300/40" />
                <div className="border-r border-amber-300/40" />
                <div />
              </div>
            </div>
          </div>

          {imageDimensions && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-black/80 text-[10px] font-mono text-[#9e968b] border border-[#332f2a]">
              Original: {imageDimensions.width} × {imageDimensions.height} px
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#2b2723]">
          <div className="text-[11px] text-[#857d74]">
            Original master file is preserved untouched. A cropped WebP copy will be generated.
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#201e1b] text-xs text-[#9e968b] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isCropping}
              onClick={handleApplyCrop}
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg disabled:opacity-50"
            >
              {isCropping ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Cropped Photo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
