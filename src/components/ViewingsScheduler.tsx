import { useState } from 'react';

type Visit = { id: string; date: string; title: string; notes?: string; status?: string };

export default function ViewingsScheduler() {
  const [visits, setVisits] = useState<Visit[]>([
    { id: 'v1', date: '2026-06-12', title: 'Naivasha Plot', status: 'Scheduled' },
    { id: 'v2', date: '2026-06-14', title: 'Karen Land Viewing', status: 'Scheduled' },
    { id: 'v3', date: '2026-06-17', title: 'Boundary Survey Visit', status: 'Planned' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');

  function addAppointment() {
    if (!formTitle || !formDate) return;
    const newVisit: Visit = { id: Date.now().toString(), date: formDate, title: formTitle, status: 'Scheduled' };
    setVisits((prev) => [newVisit, ...prev]);
    setFormTitle('');
    setFormDate('');
    setShowForm(false);
  }

  function reschedule(id: string) {
    const nextDate = prompt('Enter new date (YYYY-MM-DD)');
    if (!nextDate) return;
    setVisits((prev) => prev.map((v) => (v.id === id ? { ...v, date: nextDate, status: 'Rescheduled' } : v)));
  }

  function cancelVisit(id: string) {
    if (!confirm('Cancel this visit?')) return;
    setVisits((prev) => prev.filter((v) => v.id !== id));
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Upcoming site visits</h3>
        <div className="flex gap-2">
          <button onClick={() => setShowForm((s) => !s)} className="rounded-full bg-sky-500 px-3 py-1 text-sm font-semibold text-slate-950">Add Appointment</button>
        </div>
      </div>

      {showForm && (
        <div className="mt-3 grid gap-2">
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Title" className="rounded bg-slate-950 px-3 py-2 text-sm text-slate-100" />
          <input value={formDate} onChange={(e) => setFormDate(e.target.value)} type="date" className="rounded bg-slate-950 px-3 py-2 text-sm text-slate-100" />
          <div className="flex gap-2">
            <button onClick={addAppointment} className="rounded-full bg-emerald-500 px-3 py-1 text-sm font-semibold text-slate-950">Add</button>
            <button onClick={() => setShowForm(false)} className="rounded-full border px-3 py-1 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <ul className="mt-4 space-y-3 text-slate-300">
        {visits.map((v) => (
          <li key={v.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">{v.title}</div>
                <div className="text-xs text-slate-400">{v.date} • {v.status}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => reschedule(v.id)} className="text-xs rounded-full border px-2 py-1">Reschedule</button>
                <button onClick={() => cancelVisit(v.id)} className="text-xs rounded-full border border-rose-600 px-2 py-1 text-rose-300">Cancel</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
