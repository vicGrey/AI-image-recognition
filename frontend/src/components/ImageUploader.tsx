import { useState, useRef, type ChangeEvent } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  onClear: () => void;
  preview: string | null;
}

const ImageUploader = ({ onImageSelect, onClear, preview }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelect(file, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  if (preview) {
    return (
      <div className="relative group">
        <div className="overflow-hidden rounded-lg border border-border bg-muted/50">
          <img
            src={preview}
            alt="Selected preview"
            className="mx-auto max-h-72 w-auto object-contain"
          />
        </div>
        <button
          onClick={() => {
            onClear();
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="absolute top-2 right-2 rounded-full bg-foreground/80 p-1.5 text-background opacity-0 transition-opacity group-hover:opacity-100 hover:bg-foreground"
          aria-label="Remove image"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 transition-all ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      }`}
    >
      <div className="rounded-full bg-muted p-3">
        {isDragging ? (
          <ImageIcon className="h-6 w-6 text-primary" />
        ) : (
          <Upload className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          Drop an image here or <span className="text-primary">browse</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP supported</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
