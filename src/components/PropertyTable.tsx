import { useEffect, useMemo, useState } from 'react';
import type { Listing } from '../data/mockListings';
import { mockListings } from '../data/mockListings';

type SortKey = 'title' | 'location' | 'priceNum' | 'verified';

export default function PropertyTable() {
  const [items, setItems] = useState<Listing[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('title');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    // load from API if available, otherwise mock
    let mounted = true;
    fetch('/api/properties')
      .then((res) => {
        if (!res.ok) throw new Error('no api');
        return res.json();
      })
      .then((data) => mounted && setItems(data))
      .catch(() => {
        if (mounted) setItems(mockListings as Listing[]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      let av: any = a[sortKey as keyof Listing];
      let bv: any = b[sortKey as keyof Listing];
      if (sortKey === 'title' || sortKey === 'location') {
        av = String(av).toLowerCase();
        bv = String(bv).toLowerCase();
        return sortAsc ? (av > bv ? 1 : -1) : av > bv ? -1 : 1;
      }
      if (sortKey === 'priceNum') {
        return sortAsc ? av - bv : bv - av;
      }
      if (sortKey === 'verified') {
        return sortAsc ? (av === bv ? 0 : av ? -1 : 1) : av === bv ? 0 : av ? 1 : -1;
      }
      return 0;
    });
    return copy;
  }, [items, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function startEdit(id: number) {
    setEditingId(id);
  }

  function saveEdit(id: number, updates: Partial<Listing>) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    setEditingId(null);
    // attempt backend save
    fetch(`/api/property/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) }).catch(() => {});
  }

  function deleteProperty(id: number) {
    if (!confirm('Remove this property from your portfolio?')) return;
    setItems((prev) => prev.filter((p) => p.id !== id));
    fetch(`/api/property/${id}`, { method: 'DELETE' }).catch(() => {});
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-4">
      <h3 className="text-lg font-semibold text-white">Property table</h3>
      <p className="text-sm text-slate-400">Editable table — click Edit to update price or verification status.</p>
      <div className="mt-4 overflow-auto">
        <table className="w-full table-auto text-sm text-slate-200">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort('title')}>Title</th>
              <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort('location')}>Location</th>
              <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort('priceNum')}>Price</th>
              <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort('verified')}>Verified</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr key={p.id} className="border-t border-slate-800">
                <td className="px-3 py-3 align-top">
                  <div className="font-semibold text-white">{p.title}</div>
                  <div className="text-xs text-slate-500">{p.type} • {p.size}</div>
                </td>
                <td className="px-3 py-3 align-top">{p.location}</td>
                <td className="px-3 py-3 align-top">
                  {editingId === p.id ? (
                    <input defaultValue={p.price} id={`price-${p.id}`} className="w-36 rounded bg-slate-950 px-2 py-1 text-sm text-slate-100" />
                  ) : (
                    <div className="font-semibold">{p.price}</div>
                  )}
                </td>
                <td className="px-3 py-3 align-top">
                  {editingId === p.id ? (
                    <select defaultValue={p.verified ? 'yes' : 'no'} id={`ver-${p.id}`} className="rounded bg-slate-950 px-2 py-1 text-sm text-slate-100">
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs ${p.verified ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>{p.badge}</span>
                  )}
                </td>
                <td className="px-3 py-3 align-top">
                  {editingId === p.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const priceEl = document.getElementById(`price-${p.id}`) as HTMLInputElement | null;
                          const verEl = document.getElementById(`ver-${p.id}`) as HTMLSelectElement | null;
                          const newPrice = priceEl ? priceEl.value : p.price;
                          const verified = verEl ? verEl.value === 'yes' : p.verified;
                          saveEdit(p.id, { price: newPrice, priceNum: p.priceNum, verified, badge: verified ? 'Verified Survey' : 'Survey Pending' });
                        }}
                        className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950"
                      >
                        Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="rounded-full border px-3 py-1 text-xs">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(p.id)} className="rounded-full border border-slate-700 px-3 py-1 text-xs">Edit</button>
                      <button onClick={() => deleteProperty(p.id)} className="rounded-full border border-rose-600 px-3 py-1 text-xs text-rose-300">Remove</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
