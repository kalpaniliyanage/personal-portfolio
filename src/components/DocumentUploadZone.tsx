import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, FileText, Check, Trash2 } from 'lucide-react';

interface DocumentUploadZoneProps {
  onFileSelected: (fileName: string, fileType: string, fileSize: string, dataUrl: string) => void;
  maxSizeMB?: number;
}

export default function DocumentUploadZone({ onFileSelected, maxSizeMB = 5 }: DocumentUploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const processFile = (file: File) => {
    setError(null);

    // Limit size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const formattedSize = formatBytes(file.size);
      onFileSelected(file.name, file.type, formattedSize, result);
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10'
            : 'border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.md"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-2.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400">
            <Upload className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Drag & Drop your written article file
            </p>
            <p className="text-[10px] text-zinc-500 mt-1">
              Supports PDF, DOC, DOCX, TXT, or MD (Max {maxSizeMB}MB)
            </p>
          </div>
        </div>
      </div>
      {error && (
        <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3 text-rose-500 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
