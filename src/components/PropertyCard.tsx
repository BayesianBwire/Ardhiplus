import { Link } from 'react-router-dom';
import type { Listing } from '../data/mockListings';

interface PropertyCardProps {
  listing: Listing;
}

function PropertyCard({ listing }: PropertyCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-soft transition hover:-translate-y-1 hover:border-sky-500">
      <div className="h-48 overflow-hidden bg-slate-800">
        {listing.images[0] ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">No image available</div>
        )}
      </div>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-white">{listing.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{listing.location}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              listing.verified ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'
            }`}
          >
            {listing.badge}
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-300">{listing.description}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
          <span>{listing.size}</span>
          <span className="text-lg font-semibold text-white">{listing.price}</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={`/property/${listing.id}`}
            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-sky-400"
          >
            View details
          </Link>
          <Link
            to="/services"
            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400 hover:text-white"
          >
            Request survey
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
