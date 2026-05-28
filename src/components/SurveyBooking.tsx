import { useState } from 'react';

export default function SurveyBooking() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', service: '', date: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    // In real app, send to backend
  }

  return (
    <section className="my-16 rounded-[2rem] border border-emerald-700/40 bg-slate-900/90 p-8 shadow-soft max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-emerald-400 mb-2">Book a Survey Appointment</h2>
      <p className="text-slate-300 mb-6">Request a professional land survey or verification. Our team will contact you to confirm your appointment.</p>
      {submitted ? (
        <div className="text-emerald-400 font-semibold text-center py-8">Thank you! Your request has been received.</div>
      ) : (
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Your Name" className="p-3 rounded bg-slate-800 text-white" />
          <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="Email" className="p-3 rounded bg-slate-800 text-white" />
          <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone Number" className="p-3 rounded bg-slate-800 text-white" />
          <input name="location" value={form.location} onChange={handleChange} required placeholder="Land Location" className="p-3 rounded bg-slate-800 text-white" />
          <select name="service" value={form.service} onChange={handleChange} required className="p-3 rounded bg-slate-800 text-white">
            <option value="">Select Service</option>
            <option value="Boundary Survey">Boundary Survey</option>
            <option value="Title Verification">Title Verification</option>
            <option value="Site Visit">Site Visit</option>
            <option value="Beacon Check">Beacon Check</option>
            <option value="Subdivision">Land Subdivision</option>
          </select>
          <input name="date" value={form.date} onChange={handleChange} required type="date" className="p-3 rounded bg-slate-800 text-white" />
          <button type="submit" className="rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400">Book Appointment</button>
        </form>
      )}
    </section>
  );
}
