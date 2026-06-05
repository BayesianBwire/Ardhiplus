import DocumentsManager from '../components/DocumentsManager';
import DataExportActions from '../components/DataExportActions';

export default function Documents() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Documents</h1>
            <p className="mt-3 text-slate-400">Upload and manage verification paperwork in one secure place.</p>
          </div>
          <div className="flex gap-3">
            <a href="/api/export/listings.csv" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200">Export listings</a>
            <a href="/api/export/leads.csv" className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950">Export leads</a>
          </div>
        </div>
      </div>
      <DataExportActions />
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <DocumentsManager />
      </div>
    </section>
  );
}
