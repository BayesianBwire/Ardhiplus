import { Link } from 'react-router-dom';
import { mockListings } from '../data/mockListings';
import PropertyCard from '../components/PropertyCard';
import TrustSection from '../components/TrustSection';
import CTABlocks from '../components/CTABlocks';
import BookSurveyCTA from '../components/BookSurveyCTA';
import InstallmentSales from '../components/InstallmentSales';

function Home() {
  return (
    <section className="space-y-16">
      {/* Hero/Intro Section */}
      <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-200">
            Trusted property marketplace with survey integration
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Connect land buyers, sellers and certified surveyors in one verified platform.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            Ardhi Plus Properties & Survey blends real estate and broker services with land surveying support so you can
            discover authenticated houses, homes, and property listings with confidence.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/listings"
              className="rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Explore listings
            </Link>
            <Link
              to="/services"
              className="rounded-full border border-slate-700 px-6 py-3 text-base text-slate-200 transition hover:border-sky-400 hover:text-white"
            >
              Survey services
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-xl font-semibold text-white">Featured verified listings</h2>
          <div className="mt-6 grid gap-4">
            {mockListings.slice(0, 3).map((listing) => (
              <div key={listing.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-300">{listing.location}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{listing.title}</h3>
                <p className="mt-3 text-sm text-slate-400">{listing.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-200">
                  <span>{listing.size}</span>
                  <span>{listing.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Trust & Legitimacy Section */}
      <TrustSection />

      {/* Book Survey CTA Section */}
      <BookSurveyCTA />

      {/* Strong CTA Blocks */}
      <CTABlocks />

      <div className="grid gap-8 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft lg:grid-cols-3">
        <div>
          <p className="text-sky-300">Smart property search</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Search by location, size, and price</h2>
          <p className="mt-4 text-slate-400">
            Find properties using filters designed for land buyers, developers, and surveyors. Save time and avoid
            risky listings.
          </p>
        </div>
        <div>
          <p className="text-sky-300">Survey verification</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Trusted land surveying services</h2>
          <p className="mt-4 text-slate-400">
            Request professional land verification, boundary mapping, and trusted survey reports before closing any
            deal.
          </p>
        </div>
        <div>
          <p className="text-sky-300">Secure marketplace</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Verified listings with fraud protection</h2>
          <p className="mt-4 text-slate-400">
            Each verified property gets a trust badge after admin approval and professional survey validation.
          </p>
        </div>
      </div>

      {/* Hot Deals Section */}
      <div className="space-y-6">
        <div>
          <span className="inline-flex rounded-full bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300">
            🔥 Best deals right now
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white">Hot Properties</h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            Recently listed verified properties at competitive prices. Don't miss these opportunities.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-4">
          {mockListings.slice(0, 4).map((listing) => (
            <Link
              key={listing.id}
              to={`/property/${listing.id}`}
              className="group rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft transition hover:border-sky-500 hover:bg-slate-800"
            >
              <div className="overflow-hidden rounded-3xl bg-slate-800 mb-4">
                <img src={listing.images[0]} alt={listing.title} className="h-40 w-full object-cover group-hover:scale-105 transition" />
              </div>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-sky-300">{listing.county}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white group-hover:text-sky-300 transition">{listing.title}</h3>
                  </div>
                  {listing.verified && (
                    <span className="inline-flex rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-300">✓</span>
                  )}
                </div>
                <p className="text-2xl font-bold text-white">{listing.price}</p>
                <p className="text-sm text-slate-400">{listing.size}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link
            to="/listings"
            className="inline-flex rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Browse all listings
          </Link>
        </div>
      </div>

      {/* Installment Sales Section */}
      <InstallmentSales />

      {/* Map-Based Property Search Section */}
      <MapPropertySearch />

      {/* Trending Locations */}
      <div className="space-y-6">
        <div>
          <span className="inline-flex rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300">
            📍 Trending now
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white">Popular Locations</h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            Most active counties with verified properties and strong market demand.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { county: 'Nairobi', count: 4, icon: '🏙️' },
            { county: 'Mombasa', count: 1, icon: '🏖️' },
            { county: 'Nakuru', count: 1, icon: '🏞️' },
            { county: 'Kiambu', count: 1, icon: '🌳' },
          ].map((loc) => (
            <Link
              key={loc.county}
              to={`/listings`}
              onClick={() => {
                // In real app, would filter listings by county
                window.scrollTo(0, 0);
              }}
              className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft transition hover:border-sky-500 hover:bg-slate-800 text-center"
            >
              <p className="text-4xl mb-3">{loc.icon}</p>
              <h3 className="text-xl font-semibold text-white">{loc.county}</h3>
              <p className="mt-2 text-sm text-slate-400">{loc.count} verified properties</p>
              <p className="mt-3 inline-flex rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-300">
                View all →
              </p>
            </Link>
          ))}
        </div>
      </div>

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
