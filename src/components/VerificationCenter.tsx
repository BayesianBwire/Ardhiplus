import { useState } from 'react';

type DocType = 'Title Deed' | 'Survey Map' | 'Ownership Document' | 'County Approval' | 'Sale Agreement';

export default function VerificationCenter() {
  const [docs, setDocs] = useState<Record<DocType, string[]>>({
    'Title Deed': [],
    'Survey Map': [],
    'Ownership Document': [],
    'County Approval': [],
    'Sale Agreement': [],
  });
  const [health] = useState(92);
  const [officer] = useState('Jane Mwangi');
  const [lastReview] = useState('2026-05-20');

  function handleFiles(type: DocType, files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files).map((f) => f.name);
    setDocs((prev) => ({ ...prev, [type]: [...prev[type], ...arr] }));
    // TODO: upload to backend
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-4">
      <h3 className="text-lg font-semibold text-white">Verification Center</h3>
      <p className="mt-2 text-sm text-slate-400">Track verification status, upload documents, and view the verification timeline.</p>

      <div className="mt-4 grid gap-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Verification Officer</p>
              <div className="font-semibold text-white">{officer}</div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Last review</p>
              <div className="font-semibold text-white">{lastReview}</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Property Health</p>
              <div className="mt-1 text-2xl font-semibold text-white">{health}/100</div>
            </div>
            <div className="text-sm text-slate-300 max-w-xs">
              <p>Suggestions:</p>
              <ul className="ml-4 list-disc">
                <li>Add more images</li>
                <li>Complete ownership verification</li>
                <li>Improve property description</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-3">
          <p className="text-sm text-slate-400">Upload documents</p>
          <div className="mt-3 grid gap-2">
            {(Object.keys(docs) as DocType[]).map((t) => (
              <div key={t} className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">{t}</div>
                  <div className="text-xs text-slate-400">{docs[t].length} document(s) uploaded</div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="rounded-full bg-slate-800 px-3 py-2 text-xs text-slate-200">
                    Upload
                    <input type="file" multiple onChange={(e) => handleFiles(t, e.target.files)} className="hidden" />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
