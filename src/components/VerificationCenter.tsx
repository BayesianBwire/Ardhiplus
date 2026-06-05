import { useState } from 'react';

type DocType = 'Title Deed' | 'Survey Map' | 'Ownership Document' | 'County Approval' | 'Sale Agreement';

type VerificationStep = { label: string; status: string; note: string };

type TimelineEvent = { date: string; event: string };

export default function VerificationCenter() {
  const [docs, setDocs] = useState<Record<DocType, string[]>>({
    'Title Deed': [],
    'Survey Map': [],
    'Ownership Document': [],
    'County Approval': [],
    'Sale Agreement': [],
  });

  const verificationSteps: VerificationStep[] = [
    { label: 'Title deed review', status: 'Verified', note: 'Ownership confirmed' },
    { label: 'Survey verification', status: 'In progress', note: 'Boundary check underway' },
    { label: 'County approval', status: 'Reviewed', note: 'Records matched' },
    { label: 'Ownership audit', status: 'Complete', note: 'Title cleared' },
  ];

  const timeline: TimelineEvent[] = [
    { date: '2026-05-01', event: 'Verification workflow started' },
    { date: '2026-05-06', event: 'Survey team assigned' },
    { date: '2026-05-12', event: 'Property documents reviewed' },
    { date: '2026-05-20', event: 'Pending final approval' },
  ];

  function handleFiles(type: DocType, files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files).map((f) => f.name);
    setDocs((prev) => ({ ...prev, [type]: [...prev[type], ...arr] }));
    // TODO: upload to backend
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-4">
      <h3 className="text-lg font-semibold text-white">Verification Center</h3>
      <p className="mt-2 text-sm text-slate-400">Manage verification status, upload missing paperwork, and track approval milestones.</p>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {verificationSteps.map((step) => (
            <div key={step.label} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{step.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{step.status}</p>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">{step.status}</span>
              </div>
              <p className="mt-3 text-sm text-slate-400">{step.note}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Upload documents</p>
              <p className="mt-2 text-lg font-semibold text-white">Secure title and survey files</p>
            </div>
            <button type="button" className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
              Request audit
            </button>
          </div>

          <div className="mt-6 grid gap-3">
            {(Object.keys(docs) as DocType[]).map((type) => (
              <div key={type} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{type}</p>
                    <p className="text-xs text-slate-500">{docs[type].length} uploaded</p>
                  </div>
                  <label className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-sky-400">
                    Upload
                    <input type="file" multiple onChange={(e) => handleFiles(type, e.target.files)} className="hidden" />
                  </label>
                </div>
                {docs[type].length > 0 ? (
                  <p className="mt-3 text-xs text-slate-400">Latest: {docs[type][docs[type].length - 1]}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Verification timeline</p>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {timeline.map((item) => (
              <div key={item.date} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                <span>{item.date}</span>
                <span className="text-slate-400">{item.event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
