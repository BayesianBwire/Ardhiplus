import PropertyTable from '../components/PropertyTable';
import { mockListings } from '../data/mockListings';

export default function MyListings() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">My Listings</h1>
            <p className="mt-3 text-slate-400">All properties you manage, with verification status and buyer activity.</p>
          </div>
          <div className="flex gap-3">
            <a href="/api/export/listings.csv" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200">Export CSV</a>
            <a href="/documents" className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950">Open documents</a>
          </div>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {mockListings.slice(0, 4).map((listing) => (
          <div key={listing.id} className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-white">{listing.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{listing.location}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
              <span>{listing.price}</span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{listing.badge}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <PropertyTable />
      </div>
    </section>
  );
}
