function About() {
  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">About Ardhi Plus Properties & Survey</h1>
        <p className="mt-4 max-w-3xl text-slate-400 leading-8">
          Ardhi Plus is a property marketplace built to make land sales safer by combining verified listings with
          professional survey services and transparent buyer-seller workflows.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Mission</h2>
          <p className="mt-4 text-slate-300">
            To prevent land fraud and empower buyers, sellers, and surveyors with verified property data and reliable
            transaction support.
          </p>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Company identity</h2>
          <p className="mt-4 text-slate-300">
            A hybrid brokerage and survey verification portal designed for East African land markets, focused on
            accuracy, trust, and administrative approval.
          </p>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Why we are different</h2>
          <p className="mt-4 text-slate-300">
            We blend property listings with survey checks, admin review, and direct WhatsApp contact options so buyers
            can move with confidence.
          </p>
        </article>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-white">Our promise</h2>
        <ul className="mt-6 space-y-4 text-slate-300">
          <li>Verified listings reviewed by survey professionals</li>
          <li>Transparent pricing for survey and listing approvals</li>
          <li>Secure connection between buyers, sellers, and administrators</li>
          <li>Support for ownership transfer and boundary confirmation</li>
        </ul>
      </div>
    </section>
  );
}

export default About;
