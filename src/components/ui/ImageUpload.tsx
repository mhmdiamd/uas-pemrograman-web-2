'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from './Button';

interface ImageUploadProps {
  label?: string;
  onChange?: (file: File | null) => void;
  onClearDefault?: () => void;
  defaultUrl?: string | null;
  className?: string;
}

export const ImageUpload = ({ label, onChange, onClearDefault, defaultUrl, className = '' }: ImageUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDefaultCleared, setIsDefaultCleared] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with defaultUrl changes
  useEffect(() => {
    setIsDefaultCleared(false);
    setFile(null);
    setPreviewUrl(null);
  }, [defaultUrl]);

  // Clean up URL object when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const processFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, GIF, etc.)');
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setIsDefaultCleared(true);
    if (onChange) onChange(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setIsDefaultCleared(true);
    if (inputRef.current) inputRef.current.value = '';
    if (onChange) onChange(null);
    if (onClearDefault) onClearDefault();
  };

  const displayUrl = previewUrl || (!isDefaultCleared ? defaultUrl : null);
  const hasImage = !!displayUrl;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block font-bold text-neo-text">{label}</label>}
      <div 
        onClick={() => !hasImage && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-3 border-dashed border-neo-text p-2 flex flex-col items-center justify-center text-center transition-all min-h-[200px] overflow-hidden
          ${!hasImage ? 'cursor-pointer' : ''}
          ${isDragging 
            ? 'bg-[var(--color-neo-accent)] text-neo-text scale-[1.01] shadow-[4px_4px_0px_0px_var(--color-neo-text)]' 
            : hasImage 
              ? 'bg-gray-100 shadow-[2px_2px_0px_0px_var(--color-neo-text)]' 
              : 'bg-white hover:bg-[var(--color-neo-secondary)] shadow-[2px_2px_0px_0px_var(--color-neo-text)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--color-neo-text)]'}
        `}
      >
        <input 
          type="file" 
          ref={inputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        {displayUrl ? (
          <div className="relative w-full h-full flex items-center justify-center group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={displayUrl} 
              alt="Preview" 
              className="max-h-[300px] max-w-full object-contain neo-border shadow-[4px_4px_0px_0px_var(--color-neo-text)]" 
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex gap-4">
                 <Button variant="secondary" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} className="px-4 py-2">Change Image</Button>
                 <Button variant="danger" onClick={clearFile} className="px-4 py-2">Remove</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center p-6 pointer-events-none">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <p className="font-bold text-lg">Upload Image</p>
            <p className="text-sm font-medium mt-1 opacity-70">Drag & drop or click to browse</p>
          </div>
        )}
      </div>
    </div>
  );
};
