function Admin() {
  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Admin approval panel</h1>
        <p className="mt-3 text-slate-400">
          Review property submissions, verify survey reports, and approve trusted listings for the public marketplace.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-white">Pending listings</h2>
          <p className="mt-4 text-slate-300">Approve new properties after verification data and survey checks are complete.</p>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-white">Verified badges</h2>
          <p className="mt-4 text-slate-300">Grant trusted badges to listings verified by surveyors and admin review.</p>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-white">User management</h2>
          <p className="mt-4 text-slate-300">Monitor seller accounts and survey professionals for platform quality control.</p>
        </article>
      </div>
    </section>
  );
}

export default Admin;
