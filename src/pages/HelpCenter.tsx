import { Link } from 'react-router-dom';

export default function HelpCenter() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Help Center</h1>
        <p className="mt-3 text-slate-400">Find answers to common questions and get support for your agent workflow.</p>
      </div>
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft space-y-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
          <h2 className="text-lg font-semibold text-white">How to post a property</h2>
          <p className="mt-2 text-sm text-slate-400">Use the Post Property page to submit your listing details, upload documents, and publish quickly.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
          <h2 className="text-lg font-semibold text-white">Managing leads</h2>
          <p className="mt-2 text-sm text-slate-400">Review recent leads, contact prospects, and schedule viewings from the Leads section.</p>
        </div>
        <Link to="/dashboard" className="inline-flex rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}
