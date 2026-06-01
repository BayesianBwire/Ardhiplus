import type { ReactNode } from 'react';

const adminSections = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'site', label: 'Site Management' },
  { key: 'listings', label: 'Listings' },
  { key: 'users', label: 'Users' },
  { key: 'verification', label: 'Verification' },
  { key: 'survey', label: 'Survey Requests' },
  { key: 'reports', label: 'Reports' },
  { key: 'payments', label: 'Payments' },
  { key: 'settings', label: 'Settings' },
];

export default function AdminLayout({ children, active, onSelectSection }: { children: ReactNode; active: string; onSelectSection: (key: string) => void }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 py-8 px-6">
        <div className="mb-8 text-2xl font-bold text-amber-400">Ardhi Plus Admin</div>
        <div className="space-y-2">
          {adminSections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => onSelectSection(section.key)}
              className={`w-full text-left rounded-3xl px-4 py-3 text-sm font-medium transition ${active === section.key ? 'bg-amber-900/40 text-amber-300 shadow-inner shadow-amber-500/20' : 'text-slate-200 hover:bg-slate-800/80'}`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
