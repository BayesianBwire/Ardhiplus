import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { mockListings, type Listing } from '../data/mockListings';

function Listings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [propertyType, setPropertyType] = useState<string>('All');
  const [county, setCounty] = useState<string>('All');
  const [bedrooms, setBedrooms] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const location = useLocation();

  // Fetch listings
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
        setError('Failed to load listings. Please try again later. Showing sample listings.');
        setListings(mockListings);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('location') || '';
    const type = params.get('type') || 'All';
    const countyParam = params.get('county') || 'All';
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');

    setSearchQuery(query);
    setPropertyType(type);
    setCounty(countyParam);

    const lowValue = minPrice ? parseInt(minPrice, 10) : 0;
    const highValue = maxPrice ? parseInt(maxPrice, 10) : 100000000;
    setPriceRange([Number.isNaN(lowValue) ? 0 : lowValue, Number.isNaN(highValue) ? 100000000 : highValue]);
  }, [location.search]);

  // Apply filters
  useEffect(() => {
    let filtered = [...listings];

    // Price filter
    filtered = filtered.filter((l) => l.priceNum >= priceRange[0] && l.priceNum <= priceRange[1]);

    // Property type filter
    if (propertyType !== 'All') {
      filtered = filtered.filter((l) => l.type === propertyType);
    }

    // County filter
    if (county !== 'All') {
      filtered = filtered.filter((l) => l.county === county);
    }

    // Bedrooms filter
    if (bedrooms !== 'All') {
      const bedroomNum = parseInt(bedrooms, 10);
      filtered = filtered.filter((l) => l.bedrooms === bedroomNum);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(query) ||
          l.location.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query) ||
          l.county.toLowerCase().includes(query)
      );
    }

    // Verified only filter
    if (verifiedOnly) {
      filtered = filtered.filter((l) => l.verified);
    }

    // Sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.priceNum - b.priceNum);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.priceNum - a.priceNum);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredListings(filtered);
  }, [listings, priceRange, propertyType, county, bedrooms, verifiedOnly, sortBy, searchQuery]);

  // Get unique values for filters
  const counties = ['All', ...new Set(listings.map((l) => l.county))];
  const types = ['All', ...new Set(listings.map((l) => l.type))];
  const bedroomOptions = [
    'All',
    ...Array.from(
      new Set(
        listings
          .filter((l): l is Listing => typeof l.bedrooms === 'number')
          .map((l) => l.bedrooms.toString())
      )
    ).sort((a, b) => Number(a) - Number(b)),
  ];

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-soft">
        <div className="max-w-4xl space-y-6">
          <span className="inline-flex rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
            Public marketplace
          </span>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">Browse verified land and property listings openly.</h1>
            <p className="text-lg leading-8 text-slate-400">
              Explore the marketplace without logging in. Login only when you want to save favorites, request a survey,
              or contact the seller.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {['Land', 'Residential', 'Commercial'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setPropertyType(type)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  propertyType === type
                    ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                    : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-[1.5fr_0.5fr]">
            <div>
              <label htmlFor="marketplace-search" className="sr-only">
                Search listings
              </label>
              <input
                id="marketplace-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, location, county, or description"
                className="w-full rounded-3xl border border-slate-700 bg-slate-800 px-5 py-4 text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="rounded-3xl border border-slate-700 bg-slate-950 p-4 text-slate-300">
              <p className="text-sm font-semibold text-slate-100">Browse tips</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                <li>Search or filter by county, price, type, and bedrooms.</li>
                <li>Verified listings are marked and reviewed by survey teams.</li>
                <li>Login to save favorites or request seller contact.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <h2 className="mb-6 text-xl font-semibold text-white">Filters</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold text-sky-300">Price Range</label>
            <div className="mt-2 space-y-2 text-sm text-slate-300">
              <input
                type="range"
                min="0"
                max="100000000"
                step="1000000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="100000000"
                step="1000000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <p className="text-xs text-slate-400">
                KES {(priceRange[0] / 1000000).toFixed(1)}M - {(priceRange[1] / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-semibold text-sky-300">Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* County */}
          <div>
            <label className="block text-sm font-semibold text-sky-300">County</label>
            <select
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
            >
              {counties.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-semibold text-sky-300">Bedrooms</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
            >
              {bedroomOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-semibold text-sky-300">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Verified Toggle */}
        <div className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            id="verified"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="rounded border border-slate-700 bg-slate-800"
          />
          <label htmlFor="verified" className="text-sm font-medium text-slate-300">
            Verified properties only
          </label>
        </div>

        {/* Reset Filters */}
        <button
          onClick={() => {
            setPriceRange([0, 100000000]);
            setPropertyType('All');
            setCounty('All');
            setBedrooms('All');
            setVerifiedOnly(false);
            setSortBy('newest');
          }}
          className="mt-6 rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          Reset Filters
        </button>
      </div>

      {/* Results */}
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <p className="text-sm text-slate-400">
          Showing {filteredListings.length} listings. Browse openly with public search, then login for favorites, survey requests, and seller contact.
        </p>
      </div>

      {loading ? (
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 text-slate-300 shadow-soft">
          Loading listings...
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-rose-500 bg-slate-900/90 p-8 text-rose-300 shadow-soft">{error}</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {filteredListings.length ? (
            filteredListings.map((listing) => <PropertyCard key={listing.id} listing={listing} />)
          ) : (
            <div className="col-span-full rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 text-slate-300 shadow-soft">
              No properties match your filters. Try adjusting your search criteria.
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Listings;
