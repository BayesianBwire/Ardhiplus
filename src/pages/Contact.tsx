function Contact() {
  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Contact Ardhi Plus</h1>
        <p className="mt-4 max-w-3xl text-slate-400 leading-8">
          Have a question about a listing, survey request, or platform membership? Reach out to our team through
          secure channels and get a fast response.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Contact details</h2>
          <dl className="mt-6 space-y-4 text-slate-300">
            <div>
              <dt className="font-semibold text-white">Email</dt>
              <dd>
                <a href="mailto:support@ardhiplus.co.ke" className="text-sky-300 hover:text-sky-200">
                  support@ardhiplus.co.ke
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Phone</dt>
              <dd>
                <a href="tel:+254746554758" className="text-sky-300 hover:text-sky-200">
                  +254 746 554 758
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-white">WhatsApp</dt>
              <dd>
                <a href="https://wa.me/254746554758" className="text-sky-300 hover:text-sky-200">
                  Chat on WhatsApp
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Our location</h2>
          <p className="mt-4 text-slate-300">Visit our Nairobi office or use the map below to find the nearest regional team.</p>
          <div className="mt-6 h-72 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
            <iframe
              title="Ardhi Plus location map"
              className="h-full w-full"
              src="https://maps.google.com/maps?q=Nairobi%20Kenya&t=&z=11&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
            />
          </div>
        </div>

        <form className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-200">
              Name
              <input type="text" placeholder="Your name" className="mt-2 w-full rounded-3xl bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 focus:ring-sky-500" />
            </label>
            <label className="block text-sm font-semibold text-slate-200">
              Email
              <input type="email" placeholder="you@example.com" className="mt-2 w-full rounded-3xl bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 focus:ring-sky-500" />
            </label>
            <label className="block text-sm font-semibold text-slate-200">
              Message
              <textarea rows={5} placeholder="Tell us about your request" className="mt-2 w-full rounded-3xl bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 focus:ring-sky-500" />
            </label>
            <button className="inline-flex rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
              Send message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Contact;
