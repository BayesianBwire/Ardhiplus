import React from 'react';
import { Link } from 'react-router-dom';

const BookSurveyCTA: React.FC = () => (
  <section className="bg-gradient-to-r from-sky-900 to-slate-950 text-white py-10 px-4 rounded-xl shadow-lg flex flex-col items-center gap-4 my-8">
    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gold-400">Need Land Verification Before Buying?</h2>
    <p className="text-base md:text-lg text-slate-200 mb-2 text-center max-w-xl">
      Request a professional survey today and ensure your property transaction is safe, transparent, and verified by experts.
    </p>
    <Link
      to="/book-survey"
      className="bg-gold-400 hover:bg-gold-500 text-slate-950 font-semibold px-6 py-3 rounded-full shadow transition text-lg"
    >
      Book a Survey Appointment
    </Link>
  </section>
);

export default BookSurveyCTA;
