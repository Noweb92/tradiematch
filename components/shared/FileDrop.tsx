"use client";

import { useState, useRef } from "react";
import { Camera, Image as ImageIcon, X, Loader2 } from "lucide-react";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
} from "@/lib/storage/upload";

interface Props {
  label: string;
  hint?: string;
  multiple?: boolean;
  maxFiles?: number;
  files: File[];
  onChange: (files: File[]) => void;
  uploading?: boolean;
  existingUrls?: string[];
  onRemoveExisting?: (url: string) => void;
}

export function FileDrop({
  label,
  hint,
  multiple = false,
  maxFiles = 1,
  files,
  onChange,
  uploading,
  existingUrls = [],
  onRemoveExisting,
}: Props) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function pickFiles(selected: FileList | null) {
    if (!selected) return;
    const next: File[] = [];
    for (let i = 0; i < selected.length; i++) {
      const f = selected[i];
      if (!ALLOWED_IMAGE_TYPES.includes(f.type)) continue;
      if (f.size > MAX_UPLOAD_BYTES) continue;
      next.push(f);
    }
    if (multiple) {
      const combined = [...files, ...next].slice(0, maxFiles);
      onChange(combined);
    } else {
      onChange(next.slice(0, 1));
    }
  }

  const filled = files.length + existingUrls.length;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-navy/75 tracking-wide">
          {label}
        </label>
        {multiple && (
          <span className="text-[10px] font-bold text-navy/45">
            {filled} / {maxFiles}
          </span>
        )}
      </div>

      {/* Previews */}
      {(files.length > 0 || existingUrls.length > 0) && (
        <div className="grid grid-cols-3 gap-2">
          {existingUrls.map((url) => (
            <div
              key={url}
              className="relative aspect-square rounded-xl overflow-hidden bg-navy/[0.04] border border-navy/8"
            >
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
              />
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={() => onRemoveExisting(url)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 grid place-items-center text-white text-xs hover:bg-black/80"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
          {files.map((f, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-xl overflow-hidden bg-navy/[0.04] border border-navy/8"
            >
              <img
                src={URL.createObjectURL(f)}
                alt={f.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onChange(files.filter((_, j) => j !== i))}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 grid place-items-center text-white text-xs hover:bg-black/80"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {filled < maxFiles && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            pickFiles(e.dataTransfer.files);
          }}
          className={`flex flex-col items-center justify-center gap-1.5 py-6 rounded-xl border-2 border-dashed transition-all ${
            drag
              ? "border-orange bg-orange/10"
              : "border-navy/15 bg-navy/[0.02] hover:border-orange/50 hover:bg-orange/5"
          }`}
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 text-orange animate-spin" />
          ) : (
            <ImageIcon className="w-5 h-5 text-navy/45" />
          )}
          <span className="text-xs font-bold text-navy/75">
            {drag ? "Drop to upload" : multiple ? "Tap or drop images" : "Tap or drop an image"}
          </span>
          <span className="text-[10px] text-navy/45">
            JPG, PNG, WebP · max 5 MB each
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        multiple={multiple}
        className="hidden"
        onChange={(e) => pickFiles(e.target.files)}
      />

      {hint && !drag && (
        <p className="text-[11px] text-navy/50 leading-snug">{hint}</p>
      )}
    </div>
  );
}
