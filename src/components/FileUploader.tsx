import React, { useRef } from 'react';

export type FileUploaderProps = {
  multiple?: boolean;
  accept?: string;
  files: File[];
  onChange: (files: File[]) => void;
  uploading?: boolean;
  progress?: number;
  error?: string;
  onRemove?: (index: number) => void;
  onRetry?: () => void;
};

export default function FileUploader({ multiple = false, accept, files, onChange, uploading = false, progress = 0, error, onRemove, onRetry }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const arr = Array.from(e.target.files);
    onChange(arr);
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-200">
        Property images
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFiles}
          className="mt-2 w-full rounded-3xl bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 focus:ring-sky-500"
        />
      </label>
      {files.length > 0 && (
        <div className="space-y-2 rounded-3xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300">
          {files.map((file, index) => (
            <div key={`${file.name}-${file.size}-${index}`} className="flex items-center justify-between gap-3">
              <div className="truncate">{file.name}</div>
              {onRemove ? (
                <button type="button" onClick={() => onRemove(index)} className="text-xs text-sky-300 underline">
                  Remove
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
      {uploading && (
        <div className="rounded-3xl bg-slate-950/80 p-3 text-sm text-slate-300">
          <div className="mb-2 flex items-center justify-between text-slate-300">
            <span>Uploading files</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      {error && (
        <div className="rounded-3xl bg-rose-500/10 p-3 text-sm text-rose-200">
          <p>{error}</p>
          {onRetry && (
            <button type="button" onClick={onRetry} className="mt-2 rounded-full border border-rose-300 px-3 py-1 text-xs text-rose-100">
              Retry upload
            </button>
          )}
        </div>
      )}
    </div>
  );
}
