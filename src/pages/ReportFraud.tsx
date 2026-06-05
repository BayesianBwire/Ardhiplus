import { Link } from 'react-router-dom';

export default function ReportFraud() {
  return (
    <div className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
      <div>
        <h1 className="text-4xl font-semibold text-white">Report Fraud</h1>
        <p className="mt-3 text-slate-400">Report suspicious land listings, duplicate titles, or boundary disputes to Ardhi Plus review.</p>
      </div>
      <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-6 text-slate-300">
        <p className="text-sm">If you suspect fraud, contact the Ardhi Plus support team, provide listing details, and attach any relevant documents.</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-400">
          <li>Suspected duplicate title or ownership conflict</li>
          <li>Expired documents or missing approvals</li>
          <li>Unverified land claims or survey inconsistencies</li>
        </ul>
      </div>
      <Link
        to="/contact"
        className="inline-flex rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
      >
        Contact support
      </Link>
    </div>
  );
}
