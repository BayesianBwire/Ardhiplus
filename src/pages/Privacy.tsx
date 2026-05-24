function Privacy() {
  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Privacy & Terms</h1>
        <p className="mt-4 text-slate-400 max-w-3xl leading-8">
          Learn how Ardhi Plus collects and protects your data, and review the terms that govern marketplace and
          survey services.
        </p>
      </div>

      <div className="grid gap-6">
        <article className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Privacy policy</h2>
          <p className="mt-4 text-slate-300">
            We collect user details to support property listings, survey requests, and secure communication between
            buyers, sellers, and administrators.
          </p>
          <p className="mt-4 text-slate-300">
            Personal information is used only for service delivery, account management, and platform security.
          </p>
        </article>

        <article className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Terms of use</h2>
          <p className="mt-4 text-slate-300">
            Use the platform responsibly and provide accurate property information when posting or requesting listings.
          </p>
          <p className="mt-4 text-slate-300">
            Ardhi Plus does not guarantee transactions but offers verification tools, survey support, and admin review
            to reduce risk.
          </p>
        </article>

        <article className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Security and data</h2>
          <p className="mt-4 text-slate-300">
            We recommend using strong passwords, avoiding shared credentials, and contacting support for any account
            or privacy questions.
          </p>
          <p className="mt-4 text-slate-300">
            Contact support via email at support@ardhiplus.co.ke for privacy requests or data inquiries.
          </p>
        </article>
      </div>
    </section>
  );
}

export default Privacy;
