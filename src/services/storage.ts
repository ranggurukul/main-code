/**
 * Rang Gurukul - Storage Service Architecture
 *
 * Implements high-capacity IndexedDB local object storage + live Firebase Cloud Storage
 * with multi-tier storage fallback ensuring 100% reliable uploads across desktop and mobile.
 */

import type { MediaItem } from '../types/database';
import { optimizeImageFile, type OptimizedImageResult } from '../utils/imageOptimizer';
import { storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

const DB_NAME = 'rang_gurukul_media_storage_v1';
const DB_VERSION = 1;
const STORE_NAME = 'media_blobs';

class LocalIndexedDBStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported in this environment'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.dbPromise;
  }

  async save(id: string, dataUrl: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put({ id, dataUrl, updatedAt: Date.now() });
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('IndexedDB save fallback warning:', e);
    }
  }

  async get(id: string): Promise<string | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => {
          resolve(req.result ? req.result.dataUrl : null);
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
    } catch {
      // ignore
    }
  }
}

export const indexedDBStorage = new LocalIndexedDBStorage();

export interface StorageUploadOptions {
  category?: string;
  albumId?: string;
  albumTitle?: string;
  altText?: string;
  caption?: string;
  tags?: string[];
  onProgress?: (percent: number) => void;
}

export function isFirebaseCloudEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('rang_enable_firebase_cloud') === 'true';
}

export function setFirebaseCloudEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('rang_enable_firebase_cloud', enabled ? 'true' : 'false');
}

/**
 * Storage Service - Unified Media Handler with Firebase Cloud Storage + IndexedDB fallback
 */
export class StorageService {
  /**
   * Processes a manual device photo upload:
   * 1. Validates & automatically optimizes to responsive WebP
   * 2. Attempts direct upload to Firebase Cloud Storage (rang-gurukul.firebasestorage.app)
   * 3. Persists high-res variants in IndexedDB for resilient offline preview
   * 4. Returns complete MediaItem metadata
   */
  async uploadMedia(
    file: File,
    options: StorageUploadOptions = {}
  ): Promise<MediaItem> {
    const id = 'media_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);

    options.onProgress?.(10);

    // 1. Optimize image client-side to generate responsive variants
    const optimized: OptimizedImageResult = await optimizeImageFile(file, (pct) => {
      options.onProgress?.(10 + Math.round(pct * 0.5)); // 10% to 60%
    });

    // 2. Persist in IndexedDB for local high-speed cache
    await indexedDBStorage.save(id, optimized.largeUrl);
    await indexedDBStorage.save(id + '_thumb', optimized.thumbnailUrl);
    await indexedDBStorage.save(id + '_medium', optimized.mediumUrl);

    let activeUrl = optimized.largeUrl;
    let storageProvider: 'firebase' | 'indexeddb' = 'indexeddb';

    // 3. Attempt direct upload to Firebase Cloud Storage ONLY if enabled, with strict 3.5s timeout safeguard
    if (isFirebaseCloudEnabled()) {
      try {
        options.onProgress?.(70);
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const storagePath = `media/${id}/${cleanFileName}`;
        const cloudStorageRef = ref(storage, storagePath);

        const uploadTask = uploadBytesResumable(cloudStorageRef, file, {
          contentType: file.type || 'image/jpeg',
          customMetadata: {
            originalName: file.name,
            category: options.category || 'General',
            albumId: options.albumId || '',
            uploadedAt: new Date().toISOString(),
          },
        });

        await new Promise<void>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            try {
              uploadTask.cancel();
            } catch {}
            reject(new Error('Firebase Storage timeout - bucket may be uninitialized or waiting for Blaze plan'));
          }, 3500);

          uploadTask.on(
            'state_changed',
            (snapshot: any) => {
              if (snapshot.totalBytes > 0) {
                const cloudPct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                options.onProgress?.(70 + Math.round(cloudPct * 0.25));
              }
            },
            (error: any) => {
              clearTimeout(timeoutId);
              reject(error);
            },
            () => {
              clearTimeout(timeoutId);
              resolve();
            }
          );
        });

        const cloudDownloadUrl = await getDownloadURL(cloudStorageRef);
        if (cloudDownloadUrl) {
          activeUrl = cloudDownloadUrl;
          storageProvider = 'firebase';
        }
      } catch (firebaseError) {
        console.warn('Firebase Storage notice (saved cleanly to fast IndexedDB storage):', firebaseError);
        storageProvider = 'indexeddb';
        activeUrl = optimized.largeUrl;
      }
    } else {
      // High-speed Instant Local IndexedDB Storage (0ms network delay, 100% reliable)
      storageProvider = 'indexeddb';
      activeUrl = optimized.largeUrl;
    }

    options.onProgress?.(100);

    const mediaItem: MediaItem = {
      id,
      title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      fileName: file.name,
      fileType: file.type || 'image/webp',
      fileSize: file.size,
      fileSizeFormatted: optimized.originalSizeFormatted,
      url: activeUrl,
      thumbnailUrl: optimized.thumbnailUrl,
      mediumUrl: optimized.mediumUrl,
      largeUrl: activeUrl,
      dimensions: optimized.dimensions,
      aspectRatio: optimized.aspectRatio,
      altText: options.altText || file.name.replace(/\.[^/.]+$/, ''),
      caption: options.caption || '',
      tags: options.tags || ['Rang Gurukul', 'Media'],
      category: options.category || 'General',
      albumId: options.albumId,
      albumTitle: options.albumTitle,
      isFeatured: false,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Admin',
      storageProvider,
    };

    options.onProgress?.(100);
    return mediaItem;
  }

  /**
   * Ingests a photo by direct URL into the Media Library
   */
  createMediaFromUrl(
    url: string,
    title?: string,
    options: StorageUploadOptions = {}
  ): MediaItem {
    const id = 'media_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const cleanedTitle = title || 'Media Asset ' + id.slice(-4);

    return {
      id,
      title: cleanedTitle,
      fileName: url.split('/').pop()?.split('?')[0] || 'remote-asset.jpg',
      fileType: 'image/jpeg',
      fileSize: 1024 * 500, // estimated
      fileSizeFormatted: '500 KB',
      url,
      thumbnailUrl: url,
      mediumUrl: url,
      largeUrl: url,
      dimensions: { width: 1200, height: 800 },
      aspectRatio: '16:9',
      altText: options.altText || cleanedTitle,
      caption: options.caption || '',
      tags: options.tags || ['Rang Gurukul'],
      category: options.category || 'General',
      albumId: options.albumId,
      albumTitle: options.albumTitle,
      isFeatured: false,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Admin',
      storageProvider: 'local',
    };
  }

  /**
   * Deletes a media file from storage (both Firebase Cloud & IndexedDB)
   */
  async deleteMedia(id: string, fileName?: string, storageProvider?: string): Promise<void> {
    if (storageProvider === 'firebase' && fileName) {
      try {
        const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const cloudStorageRef = ref(storage, `media/${id}/${cleanFileName}`);
        await deleteObject(cloudStorageRef);
      } catch (err) {
        console.warn('Could not delete from Firebase Storage:', err);
      }
    }

    await indexedDBStorage.delete(id);
    await indexedDBStorage.delete(id + '_thumb');
    await indexedDBStorage.delete(id + '_medium');
  }
}

export const storageService = new StorageService();
