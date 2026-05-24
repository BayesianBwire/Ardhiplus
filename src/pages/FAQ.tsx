function FAQ() {
  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Help & FAQ</h1>
        <p className="mt-4 text-slate-400 max-w-3xl leading-8">
          Find answers to common buyer, seller, survey, and payment questions for Ardhi Plus Properties & Survey.
        </p>
      </div>

      <div className="grid gap-6">
        <article className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Buying and selling process</h2>
          <ul className="mt-6 space-y-4 text-slate-300">
            <li>
              <strong className="text-slate-100">How do I find a property?</strong> Browse listings, filter by location,
              and select a verified or pending listing to review details.
            </li>
            <li>
              <strong className="text-slate-100">How do sellers submit properties?</strong> Sellers use the Post Property page
              to upload land details, images, and location data for admin approval.
            </li>
            <li>
              <strong className="text-slate-100">What happens after I express interest?</strong> Admin connects buyers and
              sellers, and survey requests can be submitted before closing.
            </li>
          </ul>
        </article>

        <article className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Survey process</h2>
          <ul className="mt-6 space-y-4 text-slate-300">
            <li>
              <strong className="text-slate-100">How do I request a survey?</strong> Use the Services page or contact form
              to schedule a survey visit and verification.
            </li>
            <li>
              <strong className="text-slate-100">What does the survey cover?</strong> Boundary mapping, title validation,
              and on-site measurements are included in the survey review.
            </li>
            <li>
              <strong className="text-slate-100">How long do reports take?</strong> Report delivery typically takes 2–4 business
              days after the field visit.
            </li>
          </ul>
        </article>

        <article className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Payment questions</h2>
          <ul className="mt-6 space-y-4 text-slate-300">
            <li>
              <strong className="text-slate-100">How are survey fees charged?</strong> Fees are quoted based on property
              size, location, and the scope of verification.
            </li>
            <li>
              <strong className="text-slate-100">Can I pay after the survey?</strong> Payment terms are agreed with the
              survey team and may include deposit requirements before the visit.
            </li>
            <li>
              <strong className="text-slate-100">Is the marketplace free to use?</strong> Browsing listings is free; sellers may
              pay approval and verification fees when submitting property details.
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}

export default FAQ;
