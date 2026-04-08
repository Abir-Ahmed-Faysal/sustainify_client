"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CloudinaryImageUploaderProps {
  // Allow multiple files?
  multiple?: boolean;
  // Existing uploaded URLs
  value?: string[];
  // Callback when URLs change
  onChange: (urls: string[]) => void;
  // Callback to inform parent if upload is in progress (to disable submit)
  onUploadingChange?: (isUploading: boolean) => void;
  // Max number of files
  maxFiles?: number;
}

export default function CloudinaryImageUploader({
  multiple = false,
  value = [],
  onChange,
  onUploadingChange,
  maxFiles = 5,
}: CloudinaryImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadingState = (state: boolean) => {
    setIsUploading(state);
    if (onUploadingChange) onUploadingChange(state);
  };

  const startUpload = async (files: File[]) => {
    // Check limit
    if (multiple && value.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    handleUploadingState(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      const res = await fetch("/api/cloudinary", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to upload to Cloudinary");
      }

      const data = await res.json();
      const uploadedUrls = data.files.map((file: { url: string }) => file.url);
      
      if (multiple) {
        onChange([...value, ...uploadedUrls]);
      } else {
        onChange([uploadedUrls[0]]);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Image upload failed";
      console.error(error);
      toast.error(message);
    } finally {
      handleUploadingState(false);
      // Reset input so the same file could be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    startUpload(files);
  };

  const handleRemove = (indexToRemove: number) => {
    if (isUploading) return;
    const newValues = value.filter((_, index) => index !== indexToRemove);
    onChange(newValues);
  };

  const handleClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {value.map((url, i) => (
            <div key={i} className="relative group rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="upload preview" className="object-cover w-full h-full" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(i); }}
                className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {(!multiple && value.length === 0) || (multiple && value.length < maxFiles) ? (
        <div 
          onClick={handleClick}
          className={`
            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
            ${isUploading ? "bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 opacity-60" : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"}
          `}
        >
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple={multiple}
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <UploadCloud className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Click to upload {multiple ? 'images' : 'an image'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  JPG, PNG, WEBP
                </p>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
