import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

function Services() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    location: '',
    property: '',
    message: '',
    status: 'idle',
    feedback: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState((current) => ({ ...current, status: 'loading', feedback: '' }));

    if (!formState.name || !formState.email || !formState.location || !formState.property) {
      setFormState((current) => ({
        ...current,
        status: 'error',
        feedback: 'Please complete all required fields before submitting your survey request.',
      }));
      return;
    }

    try {
      const response = await fetch('/api/survey-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_title: formState.property,
          owner_name: formState.name,
          email: formState.email,
          location: formState.location,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Request failed');
      }

      setFormState({
        name: '',
        email: '',
        location: '',
        property: '',
        message: '',
        status: 'success',
        feedback: 'Survey request submitted. Our team will contact you shortly to confirm the visit.',
      });
    } catch (error) {
      setFormState((current) => ({
        ...current,
        status: 'error',
        feedback:
          error instanceof Error
            ? error.message
            : 'Something went wrong while submitting your request. Please try again or contact support.',
      }));
    }
  };

  return (
    <section className="space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-soft">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-sky-500/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
              Trusted survey partners across Kenya
            </p>
            <h1 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">
              Property verification and land survey services for every county in Kenya.
            </h1>
            <p className="mt-5 max-w-3xl text-slate-300 leading-8">
              Protect your land purchase with professional boundary verification, title review, and anti-fraud property checks.
              Ardhi Plus supports buyers, sellers, and surveyors across all 47 counties with fast, trusted survey services.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Book a survey consultation
              </Link>
              <a
                href="https://wa.me/254700000000?text=Hello%20Ardhi%20Plus%20team%20I%20need%20survey%20support"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 px-7 py-3 text-sm text-slate-200 transition hover:border-sky-400 hover:text-white"
              >
                Chat on WhatsApp
              </a>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-900/90 px-4 py-4 text-sm text-slate-300">
                <p className="font-semibold text-white">Serving all 47 counties</p>
                <p className="mt-2">Nairobi, Mombasa, Kisumu, Eldoret, Nakuru and every region.</p>
              </div>
              <div className="rounded-3xl bg-slate-900/90 px-4 py-4 text-sm text-slate-300">
                <p className="font-semibold text-white">Survey report in 2–4 days</p>
                <p className="mt-2">Field visit, document review, and final verification notes.</p>
              </div>
              <div className="rounded-3xl bg-slate-900/90 px-4 py-4 text-sm text-slate-300">
                <p className="font-semibold text-white">Licensed surveyors</p>
                <p className="mt-2">Certified professionals with trusted local partners.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-white">Schedule your survey today</h2>
            <p className="mt-3 text-slate-400 leading-7">
              Fill the request form and we’ll assign a surveyor with the right expertise for your property type and county.
            </p>
            <div className="mt-6 space-y-3 rounded-3xl bg-slate-950/90 p-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-sky-500/15 px-2 py-1 text-sky-200">•</span>
                <span>Secure property verification workflow</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-200">•</span>
                <span>Regional surveyors across Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/15 px-2 py-1 text-amber-200">•</span>
                <span>Anti-fraud title and boundary checks</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <div className="flex flex-col gap-4 rounded-3xl bg-slate-950/95 p-8 text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">Anti-fraud protection</p>
            <p className="mt-2 text-xl font-semibold text-white">Protect yourself from land fraud with professional survey verification.</p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full bg-slate-800 px-4 py-3 text-sm text-slate-200">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-200">✓</span>
            Real-time property checks and verified title data.
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-800 bg-slate-950/95 p-6">
            <p className="text-sky-300">Survey Request</p>
            <h3 className="mt-3 text-xl font-semibold text-white">Request your assessment</h3>
            <p className="mt-4 text-slate-400">Submit property details, and our team will assign a licensed surveyor in your county.</p>
          </article>
          <article className="rounded-3xl border border-slate-800 bg-slate-950/95 p-6">
            <p className="text-sky-300">Verification</p>
            <h3 className="mt-3 text-xl font-semibold text-white">Document and boundary check</h3>
            <p className="mt-4 text-slate-400">We validate title documents, cadastral records, and on-site boundary measurements.</p>
          </article>
          <article className="rounded-3xl border border-slate-800 bg-slate-950/95 p-6">
            <p className="text-sky-300">Approval</p>
            <h3 className="mt-3 text-xl font-semibold text-white">Verified listing badge</h3>
            <p className="mt-4 text-slate-400">Approved properties receive a verification badge for buyers and agents to trust.</p>
          </article>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-3xl font-semibold text-white">How it works</h2>
          <p className="text-slate-400 leading-8">
            Our survey process is designed to give you clarity and confidence before you complete any land or property transaction.
          </p>
          <ol className="space-y-5 text-slate-300">
            <li className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="font-semibold text-white">1. Submit request</p>
              <p className="mt-2 text-sm text-slate-400">Tell us the property location, buyer name, and title details.</p>
            </li>
            <li className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="font-semibold text-white">2. Survey visit</p>
              <p className="mt-2 text-sm text-slate-400">A certified surveyor visits the site for boundary and document verification.</p>
            </li>
            <li className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="font-semibold text-white">3. Analysis and report</p>
              <p className="mt-2 text-sm text-slate-400">We review the survey findings, title records and prepare an official verification report.</p>
            </li>
            <li className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="font-semibold text-white">4. Verified result</p>
              <p className="mt-2 text-sm text-slate-400">Receive a verified property status and guidance for safe transaction next steps.</p>
            </li>
          </ol>
        </div>

        <div className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-3xl font-semibold text-white">Why choose Ardhi Plus?</h2>
          <div className="grid gap-5">
            {[
              {
                title: 'Verified survey professionals',
                description: 'Our team works with licensed surveyors and regional partners across Kenya for trusted execution.',
              },
              {
                title: 'Anti-fraud property checks',
                description: 'We review title documents, cadastral records, and boundary coordinates before approval.',
              },
              {
                title: 'Fast local response',
                description: 'Most requests are reviewed same day, and report delivery starts within 2–4 business days.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-sky-400">Secure</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl bg-slate-950/80 p-6 text-slate-300">
            <p className="text-slate-400">Office hours</p>
            <p className="mt-2 text-lg font-semibold text-white">Monday – Friday, 8am – 6pm EAT</p>
            <p className="mt-1 text-sm">Ready to support urgent survey requests and buyer protection checks.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-3xl font-semibold text-white">Nationwide coverage</h2>
          <p className="mt-4 text-slate-400 leading-8">
            Ardhi Plus serves every county in Kenya with local survey partners and Kenya-wide verification services that build institutional trust.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              'Nairobi County',
              'Mombasa County',
              'Kisumu County',
              'Nakuru County',
              'Eldoret / Uasin Gishu',
              'Kericho County',
            ].map((county) => (
              <div key={county} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-slate-300">
                {county}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Coverage extends through all 47 counties, including rural, township, and peri-urban property locations.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-3xl font-semibold text-white">Request a survey now</h2>
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                Your name
                <input
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
                  value={formState.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Email address
                <input
                  type="email"
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
                  value={formState.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  placeholder="you@email.com"
                  required
                />
              </label>
            </div>

            <label className="space-y-2 text-sm text-slate-300">
              Property location
              <input
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
                value={formState.location}
                onChange={(event) => handleChange('location', event.target.value)}
                placeholder="Example: Nairobi, Kasarani"
                required
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              Property type or title name
              <input
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
                value={formState.property}
                onChange={(event) => handleChange('property', event.target.value)}
                placeholder="Example: 5-acre title deed"
                required
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              Additional details
              <textarea
                className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-sky-500"
                rows={4}
                value={formState.message}
                onChange={(event) => handleChange('message', event.target.value)}
                placeholder="Tell us any urgent details or concerns"
              />
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={formState.status === 'loading'}
              >
                {formState.status === 'loading' ? 'Sending request...' : 'Submit survey request'}
              </button>
              <p className="text-sm text-slate-400">
                Most requests are reviewed within 1 business day.
              </p>
            </div>

            {formState.status === 'success' && (
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {formState.feedback}
              </div>
            )}
            {formState.status === 'error' && (
              <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {formState.feedback}
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h2 className="text-3xl font-semibold text-white">Customer trust and verification</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {[
            {
              label: 'Verified ratings',
              value: '4.9/5 average review',
              subtitle: 'Sellers and buyers trust our survey validations.',
            },
            {
              label: 'Licensed teams',
              value: 'Registered surveyors',
              subtitle: 'We work only with accredited professionals and local partners.',
            },
            {
              label: 'Secure reviews',
              value: 'Property anti-fraud checks',
              subtitle: 'Every survey includes title and boundary verification.',
            },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-sky-400">{item.label}</p>
              <p className="mt-4 text-2xl font-semibold text-white">{item.value}</p>
              <p className="mt-3 text-slate-400">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-3xl font-semibold text-white">What customers say</h2>
          <div className="mt-6 space-y-5">
            {[
              {
                name: 'Esther W.',
                detail: 'Land buyer, Nairobi',
                quote:
                  'The survey report gave us the confidence to close safely. Ardhi Plus helped us avoid a risky title purchase.',
              },
              {
                name: 'Joseph M.',
                detail: 'Developer, Nakuru',
                quote:
                  'Professional communication, fast survey scheduling, and clear boundary checks across our site.',
              },
            ].map((review) => (
              <div key={review.name} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <p className="text-slate-300">"{review.quote}"</p>
                <p className="mt-4 font-semibold text-white">{review.name}</p>
                <p className="text-sm text-slate-500">{review.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-3xl font-semibold text-white">Frequently asked questions</h2>
          <div className="mt-6 space-y-4 text-slate-300">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="font-semibold text-white">How quickly can I get a survey?</p>
              <p className="mt-2 text-sm text-slate-400">Most survey requests are reviewed within 1 business day and reports delivered in 2–4 days.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="font-semibold text-white">Do you cover all counties?</p>
              <p className="mt-2 text-sm text-slate-400">Yes, Ardhi Plus supports all 47 counties in Kenya through regional survey partners.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="font-semibold text-white">What does the verification include?</p>
              <p className="mt-2 text-sm text-slate-400">Title document checks, boundary confirmation, and survey report issuance with admin approval.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h2 className="text-3xl font-semibold text-white">Legal disclaimer</h2>
        <p className="mt-4 text-slate-400 leading-7">
          Ardhi Plus provides survey coordination and verification advisory services. All buyers and sellers should conduct independent legal due diligence and confirm property title ownership with relevant land registry offices. Ardhi Plus is not a substitute for licensed conveyancing services.
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 sm:hidden">
        <div className="mx-4 mb-4 rounded-full bg-slate-950/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <a
            href="https://wa.me/254700000000?text=Hello%20Ardhi%20Plus%20I%20need%20survey%20support"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-sky-400"
          >
            WhatsApp survey support
          </a>
        </div>
      </div>
    </section>
  );
}

export default Services;
