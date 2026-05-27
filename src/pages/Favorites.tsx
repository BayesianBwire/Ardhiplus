import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { mockListings } from '../data/mockListings';
import PropertyCard from '../components/PropertyCard';

function Favorites() {
  const { favorites } = useFavorites();

  // Get favorite listings
  const favoriteListings = useMemo(() => {
    return mockListings.filter((listing) => favorites.includes(listing.id));
  }, [favorites]);

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-4xl font-bold text-white">My Favorites</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Your saved properties and watchlist. Keep track of properties you're interested in.
        </p>
      </div>

      {favoriteListings.length > 0 ? (
        <>
          {/* Results Count */}
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
            <p className="text-sm text-slate-400">
              You have <span className="font-bold text-sky-300">{favoriteListings.length}</span> saved properties
            </p>
          </div>

          {/* Favorites Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {favoriteListings.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
            <div className="text-center">
              <p className="text-3xl font-bold text-sky-300">{favoriteListings.length}</p>
              <p className="mt-2 text-slate-400">Total properties</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-300">
                {favoriteListings.filter((l) => l.verified).length}
              </p>
              <p className="mt-2 text-slate-400">Verified</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-300">
                KES {(favoriteListings.reduce((sum, l) => sum + l.priceNum, 0) / 1000000).toFixed(1)}M
              </p>
              <p className="mt-2 text-slate-400">Total value</p>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-12 shadow-soft text-center">
          <p className="text-lg text-slate-400 mb-6">You haven't saved any properties yet.</p>
          <p className="text-slate-500 mb-8">
            Browse our listings and click the heart icon to save properties to your watchlist.
          </p>
          <Link
            to="/listings"
            className="inline-flex rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Browse listings
          </Link>
        </div>
      )}
    </section>
  );
}

export default Favorites;
