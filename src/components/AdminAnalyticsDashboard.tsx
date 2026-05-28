export default function AdminAnalyticsDashboard() {
  return (
    <section className="my-16 rounded-[2rem] border border-sky-700/40 bg-slate-900/90 p-8 shadow-soft max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-sky-400 mb-2">Admin Analytics Dashboard (Preview)</h2>
      <p className="text-slate-300 mb-6">Track platform performance and user activity. (Full analytics coming soon!)</p>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-slate-800/80 p-4 text-center">
          <div className="text-3xl font-bold text-emerald-400 mb-1">128</div>
          <div className="text-slate-300">Total Listings</div>
        </div>
        <div className="rounded-xl bg-slate-800/80 p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-1">7</div>
          <div className="text-slate-300">Pending Verifications</div>
        </div>
        <div className="rounded-xl bg-slate-800/80 p-4 text-center">
          <div className="text-3xl font-bold text-sky-400 mb-1">54</div>
          <div className="text-slate-300">Active Users</div>
        </div>
        <div className="rounded-xl bg-slate-800/80 p-4 text-center">
          <div className="text-3xl font-bold text-rose-400 mb-1">3</div>
          <div className="text-slate-300">Fraud Reports</div>
        </div>
        <div className="rounded-xl bg-slate-800/80 p-4 text-center">
          <div className="text-3xl font-bold text-amber-400 mb-1">12</div>
          <div className="text-slate-300">Survey Requests</div>
        </div>
        <div className="rounded-xl bg-slate-800/80 p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">9</div>
          <div className="text-slate-300">Properties Sold</div>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-slate-500">Charts, recent activity, and more analytics coming soon.</div>
    </section>
  );
}
