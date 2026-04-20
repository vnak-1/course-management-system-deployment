'use client';
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ImageIcon, X } from 'lucide-react';

interface ThumbnailInputProps {
  onFileSelect: (file: File | null) => void;
  onUrlChange: (url: string) => void;
}

export function ThumbnailInput({ onFileSelect, onUrlChange }: ThumbnailInputProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pasteAreaRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelect(file);
    onUrlChange('');
  };

  const handleUrl = (url: string) => {
    setPreview(url || null);
    onUrlChange(url);
    onFileSelect(null);
  };

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    // Check for image file in clipboard
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          handleFile(file);
          return;
        }
      }
      if (item.type === 'text/plain') {
        item.getAsString((text) => {
          if (text.startsWith('http')) {
            handleUrl(text.trim());
          }
        });
      }
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  };

  const clear = () => {
    setPreview(null);
    onFileSelect(null);
    onUrlChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <Label>Thumbnail</Label>

      {preview ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          ref={pasteAreaRef}
          tabIndex={0}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors outline-none
            ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50'}
            focus:border-primary`}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center px-4">
            Click to upload, drag & drop, or<br />
            <span className="font-medium text-foreground">paste an image or URL</span>
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
