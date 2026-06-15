import LeadInbox from '../components/LeadInbox';

export default function Leads() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Lead Management</h1>
        <p className="mt-3 text-slate-400">All recent buyer inquiries and actions for your agency.</p>
      </div>
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <LeadInbox />
      </div>
    </section>
  );
}
