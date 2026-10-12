// src/lib/cloudinary.ts

export interface UploadResult {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Uploads a single image to Cloudinary (unsigned preset).
 * If Cloudinary isn't configured, falls back to a local Data URL
 * (useful for demo/dev so the feature still works).
 */
export async function uploadImage(file: File): Promise<UploadResult> {
  // Fallback: no Cloudinary configured → use Data URL
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    return readAsDataUrl(file);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Cloudinary upload failed: ${res.status} ${txt}`);
  }

  const data = await res.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
    bytes: data.bytes,
  };
}

/**
 * Upload multiple images in parallel (max 6 at a time).
 */
export async function uploadImages(
  files: File[],
  concurrency = 6,
  onProgress?: (done: number, total: number) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = new Array(files.length);
  let done = 0;

  const queue = files.map((file, index) => async () => {
    results[index] = await uploadImage(file);
    done += 1;
    onProgress?.(done, files.length);
  });

  const workers = Array.from({ length: Math.min(concurrency, queue.length) }).map(
    async () => {
      while (queue.length) {
        const task = queue.shift();
        if (task) await task();
      }
    }
  );

  await Promise.all(workers);
  return results;
}

function readAsDataUrl(file: File): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: String(reader.result),
        format: file.type.split('/')[1],
        bytes: file.size,
      });
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/** Validate a file is an acceptable image. */
export function isValidImage(file: File): { ok: boolean; error?: string } {
  const MAX = 10 * 1024 * 1024; // 10 MB
  const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!TYPES.includes(file.type)) {
    return { ok: false, error: 'Only JPG, PNG, WEBP or AVIF allowed' };
  }
  if (file.size > MAX) {
    return { ok: false, error: 'Max file size is 10 MB' };
  }
  return { ok: true };
}