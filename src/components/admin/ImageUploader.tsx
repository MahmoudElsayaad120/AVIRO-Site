import React, { useState, useRef } from 'react';
import { Upload, X, Star, Link as LinkIcon, Image as ImageIcon, Check } from 'lucide-react';
import { readFileAsOptimizedDataUrl, BRAND_PRESET_IMAGES } from '../../services/siteMediaService';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 5,
  label = 'Product Images',
  helperText = 'Upload high-resolution photography from your computer, choose from brand presets, or paste a URL.',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        if (images.length + newUrls.length >= maxImages) break;
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const dataUrl = await readFileAsOptimizedDataUrl(file);
          newUrls.push(dataUrl);
        }
      }
      if (newUrls.length > 0) {
        onChange([...images, ...newUrls]);
      }
    } catch (err) {
      console.error('Error reading files', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (images.length >= maxImages) return;
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([target, ...rest]);
  };

  const handleSelectPreset = (presetUrl: string) => {
    if (images.includes(presetUrl)) {
      // Toggle off
      onChange(images.filter((img) => img !== presetUrl));
    } else if (images.length < maxImages) {
      onChange([...images, presetUrl]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-white">
          {label} ({images.length}/{maxImages})
        </label>
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          {showPresets ? 'Hide Brand Presets' : 'Browse Brand Library'}
        </button>
      </div>

      {helperText && (
        <p className="text-[11px] text-[#808080] leading-relaxed">
          {helperText}
        </p>
      )}

      {/* Brand Presets Drawer */}
      {showPresets && (
        <div className="p-3.5 bg-[#141414] border border-[#333333] space-y-2.5 rounded-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#808080] uppercase tracking-widest">
              AVIRO HIGH-RES ASSET PRESETS (CLICK TO SELECT)
            </span>
            <span className="text-[10px] text-[#A0A0A0]">
              {BRAND_PRESET_IMAGES.length} brand images available
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {BRAND_PRESET_IMAGES.map((preset) => {
              const isSelected = images.includes(preset.url);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`group relative aspect-[4/5] bg-[#1a1a1a] border overflow-hidden text-left transition-all ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/30'
                      : 'border-[#333333] hover:border-white'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top filter brightness-95 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-1.5 inset-x-1.5 text-[9px] font-medium text-white line-clamp-1">
                    {preset.name}
                  </span>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-white bg-[#222222]'
            : 'border-[#333333] hover:border-[#666666] bg-[#141414]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={maxImages > 1}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#202020] border border-[#333333] flex items-center justify-center text-white">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-white">
            {isUploading ? (
              <span className="text-amber-400">Processing image...</span>
            ) : (
              <>
                <span className="underline underline-offset-4">Click to browse file</span> or drag & drop here
              </>
            )}
          </div>
          <span className="text-[10px] text-[#808080]">
            Supports JPG, PNG, WebP up to 10MB (automatically optimized for fast loading)
          </span>
        </div>
      </div>

      {/* URL Input Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            placeholder="Or paste external image URL (https://...)"
            className="w-full bg-[#111111] border border-[#333333] pl-8 pr-3 py-2 text-xs text-white placeholder-[#666666] focus:border-white focus:outline-none"
          />
          <LinkIcon className="w-3.5 h-3.5 text-[#666666] absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="button"
          onClick={handleAddUrl}
          disabled={!urlInput.trim() || images.length >= maxImages}
          className="px-4 py-2 bg-[#252525] hover:bg-[#333333] disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Add URL
        </button>
      </div>

      {/* Thumbnails Gallery */}
      {images.length > 0 && (
        <div className="pt-2">
          <span className="text-[10px] font-mono text-[#808080] uppercase tracking-wider block mb-2">
            ATTACHED IMAGES (FIRST IMAGE IS PRIMARY THUMBNAIL)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="group relative aspect-[3/4] bg-[#1a1a1a] border border-[#333333] overflow-hidden"
              >
                <img
                  src={img}
                  alt={`Product view ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />

                {/* Primary Tag */}
                {idx === 0 ? (
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-white text-black text-[9px] font-black uppercase tracking-wider shadow">
                    PRIMARY
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    className="absolute top-1.5 left-1.5 p-1 bg-black/70 hover:bg-black text-white/80 hover:text-white rounded text-[9px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                    title="Make this the primary thumbnail"
                  >
                    <Star className="w-2.5 h-2.5" />
                    Set Main
                  </button>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded bg-black/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
