import partner1 from '../static/img/partner1.png';
import partner2 from '../static/img/partner2.png';
import partner3 from '../static/img/partner3.png';

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
        <h2 className="text-3xl font-bold text-amber-400 mb-2">Trust & Legitimacy</h2>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Ardhi Plus is a registered business in Kenya. Our office is located at <span className="font-semibold text-white">ABC Towers, 3rd Floor, Nairobi CBD</span>.<br/>
          Business Registration: <span className="font-semibold text-white">BN-2026-123456</span>
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3 mb-10">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Why Choose Us?</h3>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>All listings are professionally verified</li>
            <li>Surveyors and agents are vetted</li>
            <li>Fraud detection and admin review</li>
            <li>Transparent documentation</li>
            <li>Trusted by hundreds of buyers & sellers</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Client Testimonials</h3>
          <ul className="space-y-3">
            {testimonials.map((t, i) => (
              <li key={i} className="rounded-lg bg-slate-800/80 p-3 text-slate-200 shadow">
                <p className="italic">“{t.text}”</p>
                <p className="mt-2 text-xs text-slate-400">- {t.name}, {t.location}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Completed Projects</h3>
          <ul className="space-y-2">
            {completedProjects.map((p, i) => (
              <li key={i} className="flex items-center gap-2 text-slate-200">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400"></span>
                <span>{p.title} <span className="text-xs text-slate-400">({p.location}, {p.year})</span></span>
              </li>
            ))}
          </ul>
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
          Safe and Verified — Buy and sell with confidence
        </span>
      </div>
    </section>
  );
}
