import * as React from 'react';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  currentFileName?: string;
  onClear?: () => void;
}

export function FileUpload({
  onFileSelect,
  accept = '.xlsx,.xls,.csv',
  maxSize = 10,
  currentFileName,
  onClear,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

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

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check file size
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > maxSize) {
      alert(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    // Check file type
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (accept && !accept.split(',').includes(extension)) {
      alert(`Please upload a file with one of these extensions: ${accept}`);
      return;
    }

    onFileSelect(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear?.();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  if (currentFileName) {
    return (
      <div className="flex items-center gap-2 p-3 border rounded-lg bg-secondary/50">
        <FileSpreadsheet className="h-5 w-5 text-green-600" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{currentFileName}</div>
          <div className="text-xs text-muted-foreground">File loaded</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-accent/50'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-2 text-center">
        <div className="p-3 rounded-full bg-primary/10">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="text-sm font-medium">
            Drop your Excel file here, or click to browse
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Supports .xlsx, .xls files up to {maxSize}MB
          </div>
        </div>
      </div>
    </div>
  );
}
