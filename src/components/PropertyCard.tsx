import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import type { Listing } from '../data/mockListings';

interface PropertyCardProps {
  listing: Listing;
}

function PropertyCard({ listing }: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(listing.id);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem('token')));
  }, []);

  const handleFavoriteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    toggleFavorite(listing.id);
  };

  const handleCompare = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    navigate('/listings');
  };

  return (
    <article className="relative group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-soft transition hover:-translate-y-1 hover:border-sky-500">
      <Link
        to={`/property/${listing.id}`}
        className="absolute inset-0 z-0 bg-transparent"
        aria-label={`View details for ${listing.title}`}
      />
      <div className="relative z-10">
        <div className="relative h-48 overflow-hidden bg-slate-800">
          {listing.images[0] ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">No image available</div>
          )}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 z-20 rounded-full bg-slate-950/80 p-2 transition hover:bg-slate-950 backdrop-blur-sm"
            title={isLoggedIn ? (isFav ? 'Remove from favorites' : 'Add to favorites') : 'Login to save this listing'}
          >
            <span className={`text-lg transition ${isFav ? 'text-rose-400' : 'text-slate-400 hover:text-rose-400'}`}>
              {isFav ? '❤️' : '🤍'}
            </span>
          </button>
        </div>
        <div className="p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-sky-300">
                <span>{listing.type}</span>
                <span>{listing.county}</span>
              </div>
              <h3 className="text-xl font-semibold text-white">{listing.title}</h3>
              <p className="text-sm text-slate-400">{listing.location}</p>
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
          <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-950/80 p-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Land size</p>
              <p className="mt-2 font-semibold text-white">{listing.size}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Price</p>
              <p className="mt-2 font-semibold text-white">{listing.price}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-400">
            {listing.postedDate && <span className="rounded-full bg-slate-800/80 px-3 py-2">Posted {listing.postedDate}</span>}
            {listing.views !== undefined && <span className="rounded-full bg-slate-800/80 px-3 py-2">{listing.views} views</span>}
            {listing.sellerName && <span className="rounded-full bg-slate-800/80 px-3 py-2">Agent: {listing.sellerName}</span>}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={`/property/${listing.id}`}
              className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-sky-400"
            >
              View details
            </Link>
            {isLoggedIn ? (
              <Link
                to="/book-survey"
                className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400 hover:text-white"
              >
                Request survey
              </Link>
            ) : (
              <Link
                to="/login"
                className="rounded-full border border-rose-500 px-4 py-2 text-sm text-rose-300 transition hover:bg-rose-500/10"
              >
                Login to request
              </Link>
            )}
            <button
              type="button"
              onClick={handleCompare}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400 hover:text-white"
            >
              Compare
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
