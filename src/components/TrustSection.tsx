import partner1 from '../static/img/partner1.png';
import partner2 from '../static/img/partner2.png';
import partner3 from '../static/img/partner3.png';

const trustStats = [
  { label: 'Verified listings', value: '98%' },
  { label: 'Average response time', value: '2h' },
  { label: 'Survey approvals', value: '2,000+' },
  { label: 'Active counties', value: '47' },
];

const verificationSteps = [
  'Property submitted',
  'Admin review',
  'Survey verification',
  'Ownership checks',
  'Listing approved',
];

const testimonials = [
  {
    name: 'Jane Mwangi',
    text: 'Ardhi Plus made my land purchase safe and stress-free. The survey verification gave me total confidence.',
    location: 'Nairobi',
  },
  {
    name: 'Samuel Otieno',
    text: 'I sold my property faster and got genuine buyers. The admin support is top-notch.',
    location: 'Kisumu',
  },
  {
    name: 'Grace Wambui',
    text: 'The fraud checks and verified listings are a game changer for Kenyan land buyers.',
    location: 'Nakuru',
  },
];

const completedProjects = [
  {
    title: 'Greenfields Estate',
    location: 'Kiambu',
    year: 2025,
  },
  {
    title: 'Coastal View Plots',
    location: 'Mombasa',
    year: 2024,
  },
  {
    title: 'Sunset Gardens',
    location: 'Nairobi',
    year: 2026,
  },
];

export default function TrustSection() {
  return (
    <section className="my-16 rounded-[2rem] border border-amber-700/40 bg-slate-900/90 p-8 shadow-soft">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-amber-400 mb-2">Trust & Verification</h2>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Ardhi Plus combines professional survey validation, title review, and fraud monitoring so buyers can transact with confidence.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-10">
        {trustStats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 text-center">
            <p className="text-3xl font-semibold text-white">{stat.value}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.25em] text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] mb-10">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Why choose Ardhi Plus?</h3>
          <ul className="list-disc list-inside text-slate-300 space-y-2">
            <li>Verified listings with survey and ownership checks</li>
            <li>Professional land survey support across Kenya</li>
            <li>Fraud prevention built into every listing review</li>
            <li>Transparent property and title documentation</li>
            <li>Trusted by buyers, sellers, and agents nationwide</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">How verification works</h3>
          <div className="space-y-3">
            {verificationSteps.map((step, index) => (
              <div key={step} className="flex items-start gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-base font-semibold text-slate-950">{index + 1}</span>
                <div>
                  <p className="font-semibold text-white">{step}</p>
                  <p className="text-sm text-slate-400">{step === 'Property submitted' ? 'Owner or agent submits the full listing details.' : step === 'Admin review' ? 'Our team checks documents and listing accuracy.' : step === 'Survey verification' ? 'Survey experts confirm boundary and title details.' : step === 'Ownership checks' ? 'We verify ownership and title records.' : 'The listing is approved for the verified marketplace.'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3 mb-10">
        {testimonials.map((t, i) => (
          <div key={i} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 text-slate-200 shadow-soft">
            <p className="italic">“{t.text}”</p>
            <p className="mt-4 text-sm font-semibold text-white">{t.name}</p>
            <p className="text-sm text-slate-400">{t.location}</p>
          </div>
        ))}
      </div>

      <div className="mb-10 text-center">
        <h3 className="text-lg font-semibold text-white mb-3">Completed verification projects</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {completedProjects.map((project) => (
            <div key={project.title} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{project.year}</p>
              <p className="mt-2 text-base font-semibold text-white">{project.title}</p>
              <p className="text-sm text-slate-400">{project.location}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-8 mb-10">
        <span className="text-slate-400">Our Partners:</span>
        <div className="flex gap-6 items-center">
          <img src={partner1} alt="Partner 1" className="h-10" />
          <img src={partner2} alt="Partner 2" className="h-10" />
          <img src={partner3} alt="Partner 3" className="h-10" />
        </div>
      </div>

      <div className="text-center">
        <span className="inline-block rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
          Safe and verified — buy and sell with confidence
        </span>
      </div>
    </section>
  );
}
