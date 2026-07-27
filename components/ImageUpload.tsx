'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

interface ImageUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export function ImageUpload({ file, onChange, error }: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File | null) => {
      setSizeError(null);
      if (!f) {
        onChange(null);
        setPreview(null);
        return;
      }
      if (!ACCEPTED.includes(f.type)) {
        setSizeError('Please upload a JPG, PNG, or WebP image.');
        return;
      }
      if (f.size > MAX_SIZE) {
        setSizeError('Photo must be under 5MB.');
        return;
      }
      onChange(f);
      const url = URL.createObjectURL(f);
      setPreview(url);
    },
    [onChange],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    handleFile(f);
  };

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onChange(null);
    setSizeError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const shownError = error || sizeError;

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      <AnimatePresence mode="wait">
        {preview && file ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden rounded-xl border-2 border-beige-300 bg-white"
          >
            <div className="relative aspect-video w-full bg-beige-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Order photo preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={clear}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-brown-900/70 text-white backdrop-blur-sm transition hover:bg-brown-900"
                aria-label="Remove photo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="truncate text-sm font-medium text-brown-700">
                {file.name}
              </span>
              <span className="shrink-0 text-sm text-brown-500">
                {(file.size / 1024).toFixed(0)} KB
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                'flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all',
                dragging
                  ? 'border-forest-600 bg-forest-50 scale-[1.01]'
                  : 'border-beige-400 bg-white hover:border-forest-500 hover:bg-forest-50/30',
                shownError && 'border-destructive/50',
              )}
            >
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                  dragging ? 'bg-forest-700 text-beige-100' : 'bg-beige-200 text-brown-500',
                )}
              >
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-semibold text-brown-900">
                  {dragging ? 'Drop your photo here' : 'Drag & drop or click to upload'}
                </p>
                <p className="mt-0.5 text-sm text-brown-500">
                  JPG, PNG, or WebP · Max 5MB
                </p>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {shownError && (
        <p className="flex items-center gap-1.5 text-sm font-medium text-destructive">
          <AlertCircle className="h-4 w-4" />
          {shownError}
        </p>
      )}
    </div>
  );
}
