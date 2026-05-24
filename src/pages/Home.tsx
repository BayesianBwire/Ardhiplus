import { Link } from 'react-router-dom';
import { mockListings } from '../data/mockListings';
import PropertyCard from '../components/PropertyCard';

function Home() {
  return (
    <section className="space-y-16">
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
