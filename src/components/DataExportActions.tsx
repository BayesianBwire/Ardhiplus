import { useState } from 'react';

const exportButtons = [
  { label: 'Download listings CSV', href: '/api/export/listings.csv' },
  { label: 'Download leads CSV', href: '/api/export/leads.csv' },
];

export default function DataExportActions() {
  const [message, setMessage] = useState('');

  function handleExport(label: string) {
    setMessage(`${label} started. Check your downloads folder.`);
    window.setTimeout(() => setMessage(''), 4000);
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Export & download</h2>
          <p className="mt-1 text-sm text-slate-400">Download CSV exports for listings and leads across your role workflows.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {exportButtons.map((button) => (
            <a
              key={button.href}
              href={button.href}
              onClick={() => handleExport(button.label)}
              className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-500 hover:bg-slate-950"
            >
              {button.label}
            </a>
          ))}
        </div>
      </div>
      {message ? <p className="mt-3 text-sm text-emerald-300">{message}</p> : null}
    </div>
  );
}
