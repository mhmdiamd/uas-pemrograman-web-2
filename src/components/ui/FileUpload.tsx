'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from './Button';

interface FileUploadProps {
  label?: string;
  accept?: string;
  onChange?: (file: File | null) => void;
  onClearDefault?: () => void;
  defaultUrl?: string | null;
  defaultFileName?: string;
  className?: string;
}

export const FileUpload = ({ label, accept, onChange, onClearDefault, defaultUrl, defaultFileName, className = '' }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDefaultCleared, setIsDefaultCleared] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsDefaultCleared(false);
    setFile(null);
  }, [defaultUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setIsDefaultCleared(true);
      if (onChange) onChange(selectedFile);
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
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setIsDefaultCleared(true);
      if (onChange) onChange(droppedFile);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setIsDefaultCleared(true);
    if (inputRef.current) inputRef.current.value = '';
    if (onChange) onChange(null);
    if (onClearDefault) onClearDefault();
  };

  const displayUrl = !isDefaultCleared ? defaultUrl : null;
  const hasFile = file || displayUrl;

  const getFileName = () => {
    if (file) return file.name;
    if (displayUrl) {
      if (defaultFileName) return defaultFileName;
      return displayUrl.split('/').pop() || 'Existing File';
    }
    return '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block font-bold text-neo-text">{label}</label>}
      <div 
        onClick={() => !hasFile && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-3 border-dashed border-neo-text p-6 flex flex-col items-center justify-center text-center transition-all
          ${!hasFile ? 'cursor-pointer' : ''}
          ${isDragging 
            ? 'bg-[var(--color-neo-accent)] text-neo-text scale-[1.01] shadow-[4px_4px_0px_0px_var(--color-neo-text)]' 
            : hasFile
              ? 'bg-gray-100 shadow-[2px_2px_0px_0px_var(--color-neo-text)]' 
              : 'bg-white hover:bg-[var(--color-neo-secondary)] shadow-[2px_2px_0px_0px_var(--color-neo-text)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--color-neo-text)]'}
        `}
      >
        <input 
          type="file" 
          ref={inputRef} 
          onChange={handleFileChange} 
          accept={accept} 
          className="hidden" 
        />
        
        {hasFile ? (
          <div className="flex flex-col items-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-[var(--color-neo-primary)]">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <p className="font-bold text-lg">{getFileName()}</p>
            {file && <p className="text-sm font-medium mt-1">{(file.size / 1024).toFixed(2)} KB</p>}
            {displayUrl && !file && (
              <a href={displayUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 underline mt-1" onClick={(e) => e.stopPropagation()}>
                View Current File
              </a>
            )}
            <div className="flex gap-2 mt-4">
              <Button variant="secondary" className="text-sm px-3 py-1" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>Change File</Button>
              <Button variant="danger" className="text-sm px-3 py-1" onClick={clearFile}>Remove File</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center pointer-events-none">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <p className="font-bold text-lg">Click or drag file to this area to upload</p>
            <p className="text-sm font-medium mt-1 opacity-70">Support for a single file upload.</p>
          </div>
        )}
      </div>
    </div>
  );
};
