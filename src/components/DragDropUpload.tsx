'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';

export default function DragDropUpload({
  name,
  accept,
  label,
  helperText,
}: {
  name: string;
  accept: string;
  label: string;
  helperText: string;
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      if (inputRef.current) {
        inputRef.current.files = e.dataTransfer.files;
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const removeFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[9px] uppercase font-mono text-inkdim block">{label}</label>
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`w-full border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 relative group flex flex-col items-center justify-center min-h-[110px] ${
          isDragActive
            ? 'border-amber bg-amber/5 shadow-[0_0_15px_rgba(242,169,59,0.15)]'
            : file
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : 'border-white/10 hover:border-white/20 bg-voidsoft/30 hover:bg-voidsoft/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {file ? (
          <div className="space-y-2 w-full px-2">
            <div className="flex items-center justify-between gap-2 bg-void/50 border border-white/5 rounded-lg p-2 text-left">
              <div className="flex items-center gap-2 overflow-hidden">
                <i className={`text-sm ${name === 'file' && file.type.startsWith('video/') ? 'fa-solid fa-file-video text-amber' : 'fa-solid fa-file-image text-amber'}`}></i>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-ink font-semibold truncate">{file.name}</p>
                  <p className="text-[9px] text-inkdim font-mono">{formatSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-[9px] bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 px-2 py-0.5 rounded transition cursor-pointer flex-shrink-0"
              >
                Remove
              </button>
            </div>
            <p className="text-[9px] text-emerald-400 font-mono">
              <i className="fa-solid fa-circle-check mr-0.5"></i> Ready to upload
            </p>
          </div>
        ) : (
          <div className="space-y-1 select-none pointer-events-none">
            <i className={`fa-solid ${isDragActive ? 'fa-cloud-arrow-up text-amber scale-110' : 'fa-arrow-up-from-bracket text-inkdim group-hover:text-amber group-hover:scale-105'} text-lg transition-all duration-300`}></i>
            <p className="text-[10px] text-ink font-medium">
              {isDragActive ? 'Drop file here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-[9px] text-inkdim">{helperText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
