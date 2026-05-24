import { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import type { Listing } from '../data/mockListings';

function Listings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/listings')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load listings');
        }
        return response.json();
      })
      .then((data) => {
        setListings(data);
      })
      .catch(() => {
        setError('Failed to load listings. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Property Marketplace</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Browse land and property listings that combine real estate offers with professional surveying verification
          and risk protection.
        </p>
      </div>

      {loading ? (
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 text-slate-300 shadow-soft">Loading listings...</div>
      ) : error ? (
        <div className="rounded-[2rem] border border-rose-500 bg-slate-900/90 p-8 text-rose-300 shadow-soft">{error}</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {listings.length ? (
            listings.map((listing) => <PropertyCard key={listing.id} listing={listing} />)
          ) : (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 text-slate-300 shadow-soft">
              No listings available at the moment.
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Listings;
