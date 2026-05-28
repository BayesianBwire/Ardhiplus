import React, { useState } from 'react';

const SurveyTypes = [
  'Site Visit',
  'Beacon Check',
  'Land Subdivision',
  'Title Verification',
];

const BookSurveyPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: SurveyTypes[0],
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with backend/email
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-950 text-white rounded-xl shadow-lg p-8 my-10">
      <h1 className="text-2xl font-bold mb-4 text-gold-400">Book a Survey Appointment</h1>
      {submitted ? (
        <div className="text-green-400 text-lg font-semibold text-center py-8">
          Thank you! Your request has been received.<br />We will contact you soon.
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="bg-slate-900 border border-slate-700 rounded px-4 py-2 text-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="bg-slate-900 border border-slate-700 rounded px-4 py-2 text-white"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="bg-slate-900 border border-slate-700 rounded px-4 py-2 text-white"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="bg-slate-900 border border-slate-700 rounded px-4 py-2 text-white"
          >
            {SurveyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <textarea
            name="message"
            placeholder="Additional details (optional)"
            value={form.message}
            onChange={handleChange}
            rows={3}
            className="bg-slate-900 border border-slate-700 rounded px-4 py-2 text-white"
          />
          <button
            type="submit"
            className="bg-gold-400 hover:bg-gold-500 text-slate-950 font-semibold px-6 py-2 rounded-full shadow transition mt-2"
          >
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
};

export default BookSurveyPage;
