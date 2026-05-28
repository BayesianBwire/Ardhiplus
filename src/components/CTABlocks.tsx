import { Link } from 'react-router-dom';

export default function CTABlocks() {
  return (
    <section className="my-16 grid gap-8 md:grid-cols-2">
      {/* Land Verification CTA */}
      <div className="rounded-2xl border border-emerald-700/40 bg-slate-900/90 p-8 flex flex-col items-start shadow-soft">
        <h3 className="text-2xl font-bold text-emerald-400 mb-2">Need land verification before buying?</h3>
        <p className="text-slate-300 mb-4">Request a professional survey and get a certified report before you commit. Protect yourself from fraud and hidden risks.</p>
        <Link
          to="/services"
          className="rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Book a Survey Appointment
        </Link>
      </div>
      {/* Property Listing CTA */}
      <div className="rounded-2xl border border-sky-700/40 bg-slate-900/90 p-8 flex flex-col items-start shadow-soft">
        <h3 className="text-2xl font-bold text-sky-400 mb-2">Want to sell your land faster?</h3>
        <p className="text-slate-300 mb-4">List your property on Ardhi Plus and reach verified buyers. Enjoy secure transactions and admin support.</p>
        <Link
          to="/post-property"
          className="rounded-full bg-sky-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          List Your Property
        </Link>
      </div>
    </section>
  );
}
