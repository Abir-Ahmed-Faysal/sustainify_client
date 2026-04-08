/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useCallback } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CloudinaryImageUploaderProps {
  /**
   * Mode: 'single' for one image, 'multiple' for many
   */
  mode?: "single" | "multiple";

  /**
   * Current uploaded image URL(s)
   * - Single mode: string
   * - Multiple mode: string[]
   */
  value?: string | string[];

  /**
   * Called when image(s) change
   * - Single mode: (url: string) => void
   * - Multiple mode: (urls: string[]) => void
   */
  onChange: (value: string | string[]) => void;

  /**
   * Called when upload state changes (for disabling submit button)
   */
  onUploadingChange?: (isUploading: boolean) => void;

  /**
   * Max number of files for multiple mode
   */
  maxFiles?: number;

  /**
   * Optional label to display above uploader
   */
  label?: string;

  /**
   * Optional helper text below uploader
   */
  hint?: string;

  /**
   * Disable the uploader
   */
  disabled?: boolean;

  /**
   * CSS class for custom styling
   */
  className?: string;
}

export default function CloudinaryImageUploader({
  mode = "single",
  value,
  onChange,
  onUploadingChange,
  maxFiles = 5,
  label,
  hint,
  disabled = false,
  className = "",
}: CloudinaryImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize value to array
  const currentUrls =
    value && typeof value === "string"
      ? [value].filter((u) => u.length > 0)
      : Array.isArray(value)
        ? value.filter((u) => u.length > 0)
        : [];

  const handleUploadingState = useCallback(
    (state: boolean) => {
      setIsUploading(state);
      if (onUploadingChange) onUploadingChange(state);
    },
    [onUploadingChange]
  );

  const startUpload = async (files: File[]) => {
    // Check limit
    if (mode === "multiple" && currentUrls.length + files.length > maxFiles) {
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

      if (mode === "multiple") {
        const newUrls = [...currentUrls, ...uploadedUrls];
        onChange(newUrls);
      } else {
        onChange(uploadedUrls[0] || "");
      }

      toast.success(`Image${files.length > 1 ? "s" : ""} uploaded successfully`);
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
    if (isUploading || disabled) return;
    if (mode === "multiple") {
      const newValues = currentUrls.filter((_, index) => index !== indexToRemove);
      onChange(newValues);
    } else {
      onChange("");
    }
  };

  const handleClick = () => {
    if (isUploading || disabled) return;
    fileInputRef.current?.click();
  };

  const isMultiple = mode === "multiple";
  const canAddMore = !isMultiple || currentUrls.length < maxFiles;

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      {/* Previews */}
      {currentUrls.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {currentUrls.map((url, i) => (
            <div
              key={i}
              className="relative group rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 aspect-4/3 overflow-hidden"
            >
              <img
                src={url}
                alt={`upload preview ${i}`}
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(i);
                }}
                disabled={isUploading || disabled}
                className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {canAddMore ? (
        <div
          onClick={handleClick}
          className={`
            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
            ${
              disabled
                ? "bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 opacity-50 cursor-not-allowed"
                : isUploading
                  ? "bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 opacity-60"
                  : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            }
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple={isMultiple}
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
            disabled={disabled}
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Uploading...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <UploadCloud className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Click to upload {isMultiple ? "images" : "an image"}
                </p>
                <p className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP</p>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {hint && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}

      {isMultiple && maxFiles && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {currentUrls.length} / {maxFiles} images
        </p>
      )}
    </div>
  );
}
