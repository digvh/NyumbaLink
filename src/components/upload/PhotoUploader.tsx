// src/components/upload/PhotoUploader.tsx
'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, Image as ImageIcon, Loader2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImages, isValidImage, type UploadResult } from '@/lib/cloudinary';

interface PhotoUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxPhotos?: number;
  primaryIndex?: number;
  onPrimaryChange?: (index: number) => void;
  label?: string;
}

export default function PhotoUploader({
  value,
  onChange,
  maxPhotos = 15,
  primaryIndex = 0,
  onPrimaryChange,
  label = 'Photos',
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files);
      if (arr.length === 0) return;

      if (value.length + arr.length > maxPhotos) {
        toast.error(`Maximum ${maxPhotos} photos allowed`);
        return;
      }

      // Validate all
      for (const f of arr) {
        const v = isValidImage(f);
        if (!v.ok) {
          toast.error(`${f.name}: ${v.error}`);
          return;
        }
      }

      setUploading(true);
      setProgress({ done: 0, total: arr.length });

      try {
        const results: UploadResult[] = await uploadImages(
          arr,
          4,
          (done, total) => setProgress({ done, total })
        );
        const urls = results.map((r) => r.url);
        onChange([...value, ...urls]);
        toast.success(`${urls.length} photo${urls.length > 1 ? 's' : ''} uploaded`);
      } catch (err: any) {
        toast.error(err?.message ?? 'Upload failed');
      } finally {
        setUploading(false);
        setProgress({ done: 0, total: 0 });
      }
    },
    [value, onChange, maxPhotos]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const removeAt = (index: number) => {
    const next = value.filter((_, i) => i !== index);
    onChange(next);
    if (onPrimaryChange && primaryIndex === index) onPrimaryChange(0);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} <span className="text-gray-400">({value.length}/{maxPhotos})</span>
      </label>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40'
            : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Uploading {progress.done}/{progress.total}...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className="w-10 h-10 text-gray-400" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Drag &amp; drop images here
            </p>
            <p className="text-xs text-gray-500">or click to browse — max 10 MB each</p>
          </div>
        )}
      </div>

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          <AnimatePresence>
            {value.map((url, i) => (
              <motion.div
                key={url + i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group aspect-square rounded-xl overflow-hidden border border-white/40 dark:border-white/10 shadow-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary badge */}
                {primaryIndex === i && (
                  <div className="absolute top-1 left-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Primary
                  </div>
                )}

                {/* Actions */}
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  {onPrimaryChange && primaryIndex !== i && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPrimaryChange(i);
                      }}
                      className="w-7 h-7 rounded-full bg-white/90 text-amber-500 flex items-center justify-center shadow"
                      title="Set as primary"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAt(i);
                    }}
                    className="w-7 h-7 rounded-full bg-white/90 text-red-500 flex items-center justify-center shadow"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {value.length === 0 && (
        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
          <ImageIcon className="w-3 h-3" /> Tip: photos with good lighting get 3x more contacts
        </p>
      )}
    </div>
  );
}