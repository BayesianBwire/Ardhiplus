import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Lead = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  propertyId?: number | string;
  propertyTitle: string;
  message?: string;
  unread?: boolean;
  createdAt?: string;
};

const initialLeads: Lead[] = [
  { id: 'l1', name: 'Jane Mwende', email: 'jane@example.com', phone: '+254700111222', propertyId: 1, propertyTitle: 'Prime Residential Plot', message: 'Interested — please send details', unread: true, createdAt: new Date().toISOString() },
  { id: 'l2', name: 'Peter Otieno', email: 'peter@example.com', phone: '+254700333444', propertyId: 3, propertyTitle: '2 acre farm land', message: 'Is price negotiable?', unread: false, createdAt: new Date().toISOString() },
];

export default function LeadInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchLeads() {
      setLoading(true);
      try {
        const res = await fetch('/api/leads');
        if (!res.ok) throw new Error('no api');
        const data = await res.json();
        if (mounted) setLeads(data);
      } catch (err) {
        // fallback to local mock data
        setLeads(initialLeads);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchLeads();
    return () => {
      mounted = false;
    };
  }, []);

  function markRead(id: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, unread: false } : l)));
    // try to notify backend, ignore errors
    fetch(`/api/leads/${id}/read`, { method: 'POST' }).catch(() => {});
  }

  function deleteLead(id: string) {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    fetch(`/api/leads/${id}`, { method: 'DELETE' }).catch(() => {});
  }

  function markAllRead() {
    setLeads((prev) => prev.map((l) => ({ ...l, unread: false })));
    fetch('/api/leads/mark_all_read', { method: 'POST' }).catch(() => {});
  }

  if (loading) return <div className="text-slate-400">Loading leads…</div>;
  if (error) return <div className="text-rose-300">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">Leads</h3>
        <div className="text-sm text-slate-400">Unread: {leads.filter((l) => l.unread).length}</div>
      </div>
      <div className="space-y-2">
        {leads.map((lead) => (
          <div key={lead.id} className={`rounded-xl border border-slate-800 bg-slate-950/60 p-3 ${lead.unread ? 'ring-2 ring-amber-400/20' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-white">{lead.name}</div>
                <div className="text-xs text-slate-400">{lead.propertyTitle}</div>
                <div className="mt-1 text-sm text-slate-300">{lead.message}</div>
                {lead.createdAt && <div className="mt-2 text-xs text-slate-500">{new Date(lead.createdAt).toLocaleString()}</div>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex flex-col items-end gap-2">
                  {lead.email && (
                    <a className="text-sm text-sky-300" href={`mailto:${lead.email}`}>Email</a>
                  )}
                  {lead.phone && (
                    <a className="text-sm text-slate-300" href={`tel:${lead.phone}`}>Call</a>
                  )}
                </div>
                <div className="flex gap-2">
                  {lead.unread && (
                    <button onClick={() => markRead(lead.id)} className="text-xs text-emerald-300">Mark read</button>
                  )}
                  <Link to={lead.propertyId ? `/property/${lead.propertyId}` : '/listings'} className="text-xs text-sky-300">Open</Link>
                  <button onClick={() => deleteLead(lead.id)} className="text-xs text-rose-300">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-right">
        <button onClick={markAllRead} className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300">Mark all read</button>
      </div>
    </div>
  );
}
