import { Link } from 'react-router-dom';

export default function Settings() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Settings</h1>
        <p className="mt-3 text-slate-400">Update your account preferences, notifications, and security settings.</p>
      </div>
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft space-y-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
          <h2 className="text-lg font-semibold text-white">Account settings</h2>
          <p className="mt-2 text-sm text-slate-400">Manage your profile, login details, and notification preferences.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
          <h2 className="text-lg font-semibold text-white">Security</h2>
          <p className="mt-2 text-sm text-slate-400">Enable stronger security for your agent account.</p>
        </div>
        <Link to="/dashboard" className="inline-flex rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
          Return to dashboard
        </Link>
      </div>
    </section>
  );
}
