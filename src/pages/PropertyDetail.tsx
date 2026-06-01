import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Listing } from '../data/mockListings';
import DownloadReports from '../components/DownloadReports';

function PropertyDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem('token')));
  }, []);

  useEffect(() => {
    if (!id) {
      setError('Invalid property ID.');
      setLoading(false);
      return;
    }

    fetch(`/api/listing/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Listing not found');
        }
        return response.json();
      })
      .then((data) => {
        setListing(data);
      })
      .catch(() => {
        setError('Property not found.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft text-slate-300">Loading property details...</div>
      </section>
    );
  }

  if (error || !listing) {
    return (
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h1 className="text-3xl font-semibold text-white">Property not found</h1>
          <p className="mt-4 text-slate-400">{error ?? 'The listing you are looking for does not exist.'}</p>
          <Link
            to="/listings"
            className="mt-6 inline-flex rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Back to listings
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <h1 className="text-3xl font-semibold text-white">{listing.title}</h1>
            <p className="mt-3 text-slate-300">{listing.location}</p>
          </div>
          <div className="space-y-2 rounded-3xl border border-slate-800 bg-slate-950 p-5 text-slate-300">
            <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
              {listing.badge}
            </span>
            <p className="text-sm">{listing.verified ? 'Verified by survey team' : 'Survey verification pending'}</p>
            <p className="text-2xl font-semibold text-white">{listing.price}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="grid gap-4 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft lg:grid-cols-2">
            {listing.images && listing.images.length ? (
              listing.images.map((src, index) => (
                <div key={index} className="overflow-hidden rounded-3xl bg-slate-800">
                  <img src={src} alt={`${listing.title} ${index + 1}`} className="h-56 w-full object-cover" />
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-3xl bg-slate-800 p-8 text-slate-500">No photos available.</div>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-white">Property details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950 p-4 text-slate-300">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Type</p>
                <p className="mt-2 text-lg font-semibold text-white">{listing.type}</p>
              </div>
              <div className="rounded-3xl bg-slate-950 p-4 text-slate-300">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Size</p>
                <p className="mt-2 text-lg font-semibold text-white">{listing.size}</p>
              </div>
              <div className="rounded-3xl bg-slate-950 p-4 text-slate-300">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Location</p>
                <p className="mt-2 text-lg font-semibold text-white">{listing.location}</p>
              </div>
              <div className="rounded-3xl bg-slate-950 p-4 text-slate-300">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Verification</p>
                <p className="mt-2 text-lg font-semibold text-white">{listing.verified ? 'Verified' : 'Pending'}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
              <h2 className="text-2xl font-semibold text-white">Location map</h2>
              <div className="mt-5 h-72 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
                <iframe
                  title="Property location map"
                  className="h-full w-full"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.location)}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                  loading="lazy"
                />
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
              <h2 className="text-2xl font-semibold text-white">Seller information</h2>
              <p className="mt-4 text-slate-300">
                Full seller contact details are only shared after admin review. To enquire, contact our support or submit a request.
              </p>
              <div className="mt-6 space-y-3 text-slate-300">
                <p className="text-sm font-semibold text-slate-200">Seller name</p>
                <p>{listing.sellerName}</p>
                <p className="text-sm font-semibold text-slate-200">Seller notes</p>
                <p>{listing.sellerNotes}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Downloadable Reports Section */}
        <DownloadReports />

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-white">Quick actions</h2>
            <div className="mt-6 space-y-4">
              {isLoggedIn ? (
                listing.sellerPhone ? (
                  <a
                    href={`https://wa.me/${listing.sellerPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-3xl bg-sky-500 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                  >
                    WhatsApp seller
                  </a>
                ) : (
                  <div className="block rounded-3xl border border-slate-700 px-5 py-3 text-center text-sm text-slate-400">
                    Seller contact pending admin review
                  </div>
                )
              ) : (
                <Link
                  to="/login"
                  className="block rounded-3xl border border-rose-500 px-5 py-3 text-center text-sm text-rose-300 transition hover:bg-rose-500/10"
                >
                  Login to enquire
                </Link>
              )}
              <Link
                to={isLoggedIn ? '/contact' : '/login'}
                className={`block rounded-3xl px-5 py-3 text-center text-sm font-semibold transition ${
                  isLoggedIn
                    ? 'border border-slate-700 text-slate-200 hover:border-sky-400 hover:text-white'
                    : 'border border-rose-500 text-rose-300 hover:bg-rose-500/10'
                }`}
              >
                {isLoggedIn ? 'Request admin contact' : 'Login to request contact'}
              </Link>
              <Link
                to={isLoggedIn ? '/services' : '/login'}
                className={`block rounded-3xl px-5 py-3 text-center text-sm font-semibold transition ${
                  isLoggedIn
                    ? 'bg-slate-800 text-slate-200 hover:border-slate-600 hover:text-white'
                    : 'border border-rose-500 text-rose-300 hover:bg-rose-500/10'
                }`}
              >
                {isLoggedIn ? 'Book survey visit' : 'Login to book survey'}
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-white">About verification</h2>
            <p className="mt-4 text-slate-300">
              This listing is reviewed by administrators and surveyors before verifying the title, boundaries, and buyer
              readiness.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default PropertyDetail;
