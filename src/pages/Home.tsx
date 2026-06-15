import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TrustSection from '../components/TrustSection';
import CTABlocks from '../components/CTABlocks';
import BookSurveyCTA from '../components/BookSurveyCTA';
import InstallmentSales from '../components/InstallmentSales';
import MapPropertySearch from '../components/MapPropertySearch';
import PropertyCard from '../components/PropertyCard';
import type { Listing } from '../data/mockListings';
import { mockListings } from '../data/mockListings';
import { mockAgents } from '../data/mockAgents';

function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchType, setSearchType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [county, setCounty] = useState('');
  const navigate = useNavigate();

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
        setListings(mockListings);
      });
  }, []);

  const verifiedListings = listings.filter((listing) => listing.verified);
  const featuredListings = verifiedListings.slice(0, 3);
  const hotListings = verifiedListings.slice(0, 4);
  const featuredAgents = mockAgents.filter((agent) => agent.verified).slice(0, 4);

  const heroMetrics = [
    { label: 'Listings', value: '5,000+' },
    { label: 'Counties covered', value: '47' },
    { label: 'Surveys completed', value: '2,000+' },
    { label: 'Verified listings', value: '98%' },
  ];

  const testimonials = [
    {
      quote: 'Verified title before purchase and avoided fraud.',
      author: 'Miriam N.',
      role: 'Homebuyer, Nakuru',
    },
    {
      quote: 'Survey validation gave me confidence to close the deal.',
      author: 'Michael K.',
      role: 'Investor, Nairobi',
    },
    {
      quote: 'Trusted agents and clear documentation made the process simple.',
      author: 'Amina O.',
      role: 'Seller, Mombasa',
    },
  ];

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (searchLocation) params.set('location', searchLocation);
    if (searchType) params.set('type', searchType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (county) params.set('county', county);

    const queryString = params.toString();
    navigate(`/listings${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <section className="space-y-16">
      <div className="grid gap-10 xl:grid-cols-[1.45fr_1fr] xl:items-start">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-200">
            Kenya’s trusted marketplace for verified land & property
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Kenya’s Trusted Marketplace for Verified Land & Property
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            Buy, sell, and verify land confidently with professional survey support, title verification, and trusted
            property listings.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/listings"
              className="rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Search properties
            </Link>
            <Link
              to="/book-survey"
              className="rounded-full border border-slate-700 px-6 py-3 text-base text-slate-200 transition hover:border-sky-400 hover:text-white"
            >
              Request verification
            </Link>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="mt-10 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft"
          >
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[1.4fr_0.9fr]">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-300">
                  Search location
                  <input
                    value={searchLocation}
                    onChange={(event) => setSearchLocation(event.target.value)}
                    placeholder="Nairobi, Kisumu, Mombasa"
                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-300">
                  Property type
                  <select
                    value={searchType}
                    onChange={(event) => setSearchType(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none"
                  >
                    <option value="">Any type</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land</option>
                    <option value="Agricultural">Agricultural</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-300">
                  Min price
                  <input
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    placeholder="KES 5,000,000"
                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-300">
                  Max price
                  <input
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder="KES 50,000,000"
                    className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500"
                  />
                </label>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr] items-end">
              <label className="block text-sm font-medium text-slate-300">
                County
                <select
                  value={county}
                  onChange={(event) => setCounty(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none"
                >
                  <option value="">Any county</option>
                  <option value="Nairobi">Nairobi</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Nakuru">Nakuru</option>
                  <option value="Kiambu">Kiambu</option>
                  <option value="Kisumu">Kisumu</option>
                </select>
              </label>
              <button
                type="submit"
                className="rounded-2xl bg-sky-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Search properties
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-400">Search the marketplace instantly by location, property type, price range, and county.</p>
          </form>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {heroMetrics.map((metric) => (
              <div key={metric.label} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 text-center">
                <p className="text-3xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.25em] text-slate-400">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Verified listings</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Featured verified listings</h2>
              </div>
              <Link to="/listings" className="text-sm font-medium text-sky-300 hover:text-white">
                View all
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {featuredListings.map((listing) => (
                <div key={listing.id} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-300">{listing.type}</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{listing.title}</h3>
                  <p className="mt-2 text-sm text-slate-400 line-clamp-2">{listing.description}</p>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                    <span>{listing.size}</span>
                    <span>{listing.price}</span>
                  </div>
                </div>
              ))}
              {!featuredListings.length && (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 text-slate-400">
                  No featured verified listings are available at the moment.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-amber-300">Fraud prevention</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Verify title, survey, and ownership before you buy</h2>
            <p className="mt-4 text-slate-400">Every property is reviewed by our survey team and admin staff before it gets the verified badge.</p>
            <div className="mt-6 grid gap-3">
              {['Property submitted', 'Admin review', 'Survey verification', 'Ownership checks', 'Listing approved'].map((step, index) => (
                <div key={step} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-lg font-semibold text-sky-300">{index + 1}</span>
                    <span className="font-semibold text-white">{step}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sky-300">Verified marketplace</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Featured listings built for confident buyers</h2>
          </div>
          <Link
            to="/listings"
            className="rounded-full border border-slate-700 bg-slate-950/90 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-400 hover:text-white"
          >
            Browse marketplace
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-4">
          {hotListings.length ? (
            hotListings.map((listing) => <PropertyCard key={listing.id} listing={listing} />)
          ) : (
            <div className="col-span-full rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 text-slate-400 shadow-soft">
              No hot listings are available yet.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
            Trusted agents
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white">Top verified agents & surveyors</h2>
          <p className="mt-2 text-slate-400">
            Work with experienced agents who know local land markets and support verified transactions end to end.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredAgents.map((agent) => (
            <Link
              key={agent.id}
              to="/agents"
              className="group rounded-[2rem] border border-slate-800 bg-slate-900/90 p-5 transition hover:border-sky-500 hover:bg-slate-800"
            >
              <div className="flex items-center gap-4">
                <img src={agent.image} alt={agent.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                  <p className="text-sm text-slate-400">{agent.agency}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-2 text-sm text-slate-300">
                <div className="flex items-center justify-between gap-3">
                  <span>Rating</span>
                  <span className="font-semibold text-white">{agent.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Reviews</span>
                  <span className="font-semibold text-white">{agent.reviews}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Listings</span>
                  <span className="font-semibold text-white">{agent.listings}</span>
                </div>
              </div>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300">
                Verified agent
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-sky-300">
            Social proof
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white">Customer reviews that underscore trust</h2>
          <p className="mt-2 text-slate-400">Verified buyers and sellers share why Ardhi Plus is the marketplace they trust for land and property deals.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.author} className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
              <p className="text-slate-200">“{item.quote}”</p>
              <p className="mt-4 text-sm font-semibold text-white">{item.author}</p>
              <p className="text-sm text-slate-400">{item.role}</p>
            </div>
          ))}
        </div>
      </div>

      <BookSurveyCTA />
      <CTABlocks />
      <InstallmentSales />
      <MapPropertySearch />

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-[2rem] border border-slate-800 bg-slate-900/90 px-6 py-6 shadow-soft sm:px-8">
          <div>
            <p className="text-sky-300">Open to land owners, brokers, and agents</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">List houses, homes, and property deals with ease</h2>
          </div>
          <div className="flex gap-3">
            <Link
              to="/register"
              className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Create account
            </Link>
            <a
              href="https://wa.me/254746554758"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-700 px-5 py-3 text-sm text-slate-200 transition hover:border-sky-400 hover:text-white"
            >
              Contact support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
