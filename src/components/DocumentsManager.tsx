import { useState } from 'react';
import type { ChangeEvent } from 'react';

type DocumentType = 'Title Deed' | 'Survey Maps' | 'Ownership Documents' | 'County Approvals' | 'Sale Agreements';

type UploadedDocument = {
  id: string;
  name: string;
  type: DocumentType;
  uploadedAt: string;
};

const documentTypes: DocumentType[] = [
  'Title Deed',
  'Survey Maps',
  'Ownership Documents',
  'County Approvals',
  'Sale Agreements',
];

export default function DocumentsManager() {
  const [selectedType, setSelectedType] = useState<DocumentType>('Title Deed');
  const [files, setFiles] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState(false);

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    const uploadFiles = Array.from(event.target.files).map((file) => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      type: selectedType,
      uploadedAt: new Date().toISOString(),
    }));
    setUploading(true);
    window.setTimeout(() => {
      setFiles((prev) => [...uploadFiles, ...prev]);
      setUploading(false);
    }, 400);
    // TODO: integrate with backend upload endpoint
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  }

  const groupedFiles = documentTypes.map((type) => ({
    type,
    list: files.filter((file) => file.type === type),
  }));

  return (
    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Document Center</h3>
          <p className="mt-1 text-sm text-slate-400">Upload, view and manage verification documents for each property.</p>
        </div>
        <button
          type="button"
          onClick={() => document.getElementById('doc-upload-input')?.click()}
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          Upload files
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="rounded-3xl border border-slate-800 bg-slate-950/70 p-3">
          <span className="block text-sm font-semibold text-slate-200">Document type</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as DocumentType)}
            className="mt-3 w-full rounded-3xl bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-800 focus:ring-sky-500"
          >
            {documentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
        <input
          id="doc-upload-input"
          type="file"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      <div className="mt-6 space-y-4">
        {groupedFiles.map((group) => (
          <div key={group.type} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">{group.type}</p>
                <p className="text-xs text-slate-400">{group.list.length} file(s)</p>
              </div>
              {group.list.length > 0 && <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">Uploaded</span>}
            </div>
            {group.list.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {group.list.map((file) => (
                  <li key={file.id} className="flex items-center justify-between rounded-2xl bg-slate-950/80 px-3 py-2">
                    <div>
                      <div className="font-medium text-white">{file.name}</div>
                      <div className="text-xs text-slate-500">Uploaded {new Date(file.uploadedAt).toLocaleDateString()}</div>
                    </div>
                    <button type="button" onClick={() => removeFile(file.id)} className="text-xs text-rose-300">Remove</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No documents uploaded yet.</p>
            )}
          </div>
        ))}
      </div>

      {uploading && <div className="mt-4 text-sm text-slate-400">Uploading files…</div>}
    </div>
  );
}
