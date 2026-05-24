import { Link } from 'react-router-dom';

function Services() {
  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Survey Services & Verification</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Request land survey visits, explore transparent pricing, and learn how Ardhi Plus verifies each property
          through certified survey professionals.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Request land survey</h2>
          <p className="mt-4 text-slate-300">
            Submit a survey request for any property on the platform. We connect you with qualified surveyors for a
            boundary check, title review, and risk assessment before you sign.
          </p>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Book a survey visit</h2>
          <p className="mt-4 text-slate-300">
            Schedule an on-site visit with one of our certified survey teams. The survey visit includes field notes,
            measurement verification, and an on-site report for your listing.
          </p>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-white">Pricing</h3>
          <p className="mt-4 text-slate-300">
            Clear survey pricing starts from KES 15,000 for basic boundary checks, with custom quotes for larger
            acreage and confirmed titles.
          </p>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-white">Verification process</h3>
          <p className="mt-4 text-slate-300">
            Every verified listing goes through document checks, on-site boundary confirmation, and quality review by
            our admin team.
          </p>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-white">Report delivery</h3>
          <p className="mt-4 text-slate-300">
            Survey reports are delivered digitally within 2–4 business days, with export-ready boundary plans and
            verification notes.
          </p>
        </article>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-white">Verification explained</h2>
        <p className="mt-4 text-slate-300">
          Our verification workflow ensures each property is authenticated with documented survey data, property
          coordinates, and admin sign-off before it is promoted as verified on the marketplace.
        </p>
        <ul className="mt-6 space-y-4 text-slate-300">
          <li>1. Survey request submission and on-site inspection</li>
          <li>2. Title document validation and boundary confirmation</li>
          <li>3. Report generation and admin approval</li>
          <li>4. Verified badge issuance for the listing</li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            to="/post-property"
            className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Submit property for survey
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-200 transition hover:border-sky-400 hover:text-white"
          >
            Contact our survey team
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Services;
