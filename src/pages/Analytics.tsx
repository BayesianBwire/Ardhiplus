import AdminAnalyticsDashboard from '../components/AdminAnalyticsDashboard';

export default function Analytics() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Analytics</h1>
        <p className="mt-3 text-slate-400">Track weekly views, conversion rates, and top-performing listings.</p>
      </div>
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <AdminAnalyticsDashboard />
      </div>
    </section>
  );
}
