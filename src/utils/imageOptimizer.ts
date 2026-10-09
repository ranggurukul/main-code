/**
 * Rang Gurukul - Client-Side Image Optimization Engine
 *
 * Automatically generates responsive WebP variants (Thumbnail, Medium, Large)
 * from device photos to keep website performance lightning fast without server dependency.
 */

export interface OptimizedImageResult {
  fileName: string;
  fileType: string;
  originalSize: number;
  originalSizeFormatted: string;
  dimensions: { width: number; height: number };
  aspectRatio: string;
  url: string; // High-quality responsive WebP
  thumbnailUrl: string; // 320px WebP for fast grids & previews
  mediumUrl: string; // 1200px WebP for standard pages
  largeUrl: string; // 1920px WebP for hero & full-screen view
}

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
];

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB safety limit

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check extension or MIME type
  const isTypeValid = SUPPORTED_IMAGE_TYPES.includes(file.type.toLowerCase()) ||
    /\.(jpg|jpeg|png|webp|avif)$/i.test(file.name);

  if (!isTypeValid) {
    return {
      valid: false,
      error: `Unsupported file format. Please upload JPG, PNG, WebP, or AVIF.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${formatFileSize(file.size)}). Max allowed is 50MB.`,
    };
  }

  return { valid: true };
}

/**
 * Calculates a human-readable aspect ratio label (e.g. 16:9, 1:1, 4:5, 3:2)
 */
export function getAspectRatioLabel(width: number, height: number): string {
  const ratio = width / height;
  if (Math.abs(ratio - 1) < 0.05) return '1:1';
  if (Math.abs(ratio - 16 / 9) < 0.08) return '16:9';
  if (Math.abs(ratio - 4 / 3) < 0.08) return '4:3';
  if (Math.abs(ratio - 3 / 2) < 0.08) return '3:2';
  if (Math.abs(ratio - 4 / 5) < 0.08) return '4:5';
  if (Math.abs(ratio - 9 / 16) < 0.08) return '9:16';
  if (ratio > 2.0) return '21:9';
  return `${ratio.toFixed(2)}:1`;
}

/**
 * Resizes an image onto a Canvas and outputs a WebP Data URL
 */
function resizeToWebP(
  img: HTMLImageElement,
  targetMaxDim: number,
  quality = 0.85
): string {
  const canvas = document.createElement('canvas');
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (width > height) {
    if (width > targetMaxDim) {
      height = Math.round((height * targetMaxDim) / width);
      width = targetMaxDim;
    }
  } else {
    if (height > targetMaxDim) {
      width = Math.round((width * targetMaxDim) / height);
      height = targetMaxDim;
    }
  }

  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return img.src;

  // Use high-quality bicubic smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(img, 0, 0, width, height);

  try {
    return canvas.toDataURL('image/webp', quality);
  } catch {
    // Fallback if browser doesn't support WebP export
    return canvas.toDataURL('image/jpeg', quality);
  }
}

/**
 * Optimizes an image File into responsive variants (Thumbnail, Medium, Large)
 */
export async function optimizeImageFile(
  file: File,
  onProgress?: (pct: number) => void
): Promise<OptimizedImageResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  onProgress?.(15);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read file from device'));

    reader.onload = (e) => {
      onProgress?.(45);
      const rawDataUrl = e.target?.result as string;

      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image data'));

      img.onload = () => {
        onProgress?.(70);
        const naturalWidth = img.naturalWidth || 800;
        const naturalHeight = img.naturalHeight || 600;

        // Generate responsive WebP variants
        const thumbnail = resizeToWebP(img, 320, 0.8);
        onProgress?.(85);

        const medium = naturalWidth > 1200 ? resizeToWebP(img, 1200, 0.85) : rawDataUrl;
        const large = naturalWidth > 1920 ? resizeToWebP(img, 1920, 0.88) : rawDataUrl;

        onProgress?.(100);

        resolve({
          fileName: file.name,
          fileType: file.type || 'image/jpeg',
          originalSize: file.size,
          originalSizeFormatted: formatFileSize(file.size),
          dimensions: { width: naturalWidth, height: naturalHeight },
          aspectRatio: getAspectRatioLabel(naturalWidth, naturalHeight),
          url: large,
          thumbnailUrl: thumbnail,
          mediumUrl: medium,
          largeUrl: large,
        });
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Crops an image based on source coordinates and returns a new WebP Data URL
 */
export async function cropImageToWebP(
  imageSrc: string,
  cropBox: { x: number; y: number; width: number; height: number },
  quality = 0.9
): Promise<{ url: string; width: number; height: number; aspectRatio: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onerror = () => reject(new Error('Failed to load image for cropping'));

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const cropW = Math.max(1, Math.round(cropBox.width));
      const cropH = Math.max(1, Math.round(cropBox.height));

      canvas.width = cropW;
      canvas.height = cropH;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        img,
        cropBox.x,
        cropBox.y,
        cropBox.width,
        cropBox.height,
        0,
        0,
        cropW,
        cropH
      );

      const croppedUrl = canvas.toDataURL('image/webp', quality);
      resolve({
        url: croppedUrl,
        width: cropW,
        height: cropH,
        aspectRatio: getAspectRatioLabel(cropW, cropH),
      });
    };

    img.src = imageSrc;
  });
}
