import { useState } from 'react';

const counties = [
  'Nairobi', 'Mombasa', 'Nakuru', 'Kiambu', 'Kisumu', 'Machakos', 'Eldoret', 'Kajiado', 'Laikipia', 'Nyeri',
];

export default function MapPropertySearch() {
  const [county, setCounty] = useState('');
  return (
    <section className="my-16 rounded-[2rem] border border-sky-700/40 bg-slate-900/90 p-8 shadow-soft max-w-5xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-bold text-sky-400 mb-2">Map-Based Property Search</h2>
      <p className="text-base md:text-lg text-slate-200 mb-4 text-center max-w-2xl">
        Browse available properties visually on the map. Filter by county, price, acreage, and verification status. Click on a marker to view property details.
      </p>
      <div className="w-full max-w-3xl flex flex-col gap-4 items-center">
        <select value={county} onChange={e => setCounty(e.target.value)} className="p-3 rounded bg-slate-800 text-white w-full max-w-xs">
          <option value="">Select County</option>
          {counties.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
          <span className="text-slate-500">[Interactive map coming soon{county ? `: ${county}` : ''}]</span>
        </div>
      </div>
    </section>
  );
}
