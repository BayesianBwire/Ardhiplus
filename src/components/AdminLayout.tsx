import { useState } from 'react';

const adminSections = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'listings', label: 'Listings' },
  { key: 'users', label: 'Users' },
  { key: 'verification', label: 'Verification' },
  { key: 'survey', label: 'Survey Requests' },
  { key: 'reports', label: 'Reports' },
  { key: 'payments', label: 'Payments' },
  { key: 'settings', label: 'Settings' },
];

export default function AdminLayout({ children }) {
  const [active, setActive] = useState('dashboard');
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-slate-900 border-r border-slate-800 py-8 px-4 flex flex-col gap-2">
        <div className="mb-8 text-2xl font-bold text-amber-400">Ardhi Plus Admin</div>
        {adminSections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={`text-left px-4 py-2 rounded transition font-medium ${active === s.key ? 'bg-amber-900/30 text-amber-300' : 'hover:bg-slate-800/80 text-slate-200'}`}
          >
            {s.label}
          </button>
        ))}
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-slate-950">
        {children ? children : <div className="text-slate-400">Select a section from the sidebar.</div>}
      </main>
    </div>
  );
}
