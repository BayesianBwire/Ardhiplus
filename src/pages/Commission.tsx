import { Link } from 'react-router-dom';

export default function Commission() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Commission Tracker</h1>
        <p className="mt-3 text-slate-400">Review your earned and pending commission details.</p>
      </div>
      <div className="space-y-4 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
            <p className="text-sm text-slate-400">Total revenue generated</p>
            <p className="mt-2 text-3xl font-semibold text-white">KES 8,320,000</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
            <p className="text-sm text-slate-400">Paid commission</p>
            <p className="mt-2 text-3xl font-semibold text-white">KES 995,000</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
            <p className="text-sm text-slate-400">Pending commission</p>
            <p className="mt-2 text-3xl font-semibold text-amber-300">KES 245,000</p>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
          <h2 className="text-lg font-semibold text-white">Commission history</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li className="rounded-2xl bg-slate-900/80 px-4 py-3">01 Jun - KES 120,000 paid</li>
            <li className="rounded-2xl bg-slate-900/80 px-4 py-3">18 May - KES 95,000 paid</li>
            <li className="rounded-2xl bg-slate-900/80 px-4 py-3">05 May - KES 80,000 paid</li>
          </ul>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          Return to dashboard
        </Link>
      </div>
    </section>
  );
}
