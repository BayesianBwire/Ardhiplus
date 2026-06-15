import DocumentsManager from '../components/DocumentsManager';

export default function Documents() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Documents</h1>
        <p className="mt-3 text-slate-400">Upload and manage verification paperwork in one secure place.</p>
      </div>
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <DocumentsManager />
      </div>
    </section>
  );
}
