import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
      <div>
        <h1 className="text-4xl font-semibold text-white">Terms of Service</h1>
        <p className="mt-3 text-slate-400">Review Ardhi Plus policies for verified property listings, buyer matching, and agent operations.</p>
      </div>
      <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-6 text-slate-300">
        <p className="text-sm">
          These terms describe the service and operational expectations for agents, buyers, and verification workflows on Ardhi Plus.
        </p>
        <p className="mt-4 text-slate-400">This page is a placeholder for your service agreement and can be extended with your legal policies.</p>
      </div>
      <Link
        to="/dashboard"
        className="inline-flex rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
      >
        Return to dashboard
      </Link>
    </div>
  );
}
