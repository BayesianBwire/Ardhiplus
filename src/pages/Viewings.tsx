import ViewingsScheduler from '../components/ViewingsScheduler';

export default function Viewings() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Viewings</h1>
        <p className="mt-3 text-slate-400">Manage appointment requests, reschedule site visits, and confirm buyer attendance.</p>
      </div>
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <ViewingsScheduler />
      </div>
    </section>
  );
}
