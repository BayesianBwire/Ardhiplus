import { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function QuickListModal({ open, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      location: (form.elements.namedItem('location') as HTMLInputElement).value,
      size: (form.elements.namedItem('size') as HTMLInputElement).value,
      notes: (form.elements.namedItem('notes') as HTMLTextAreaElement).value,
    };

    // Placeholder: send to backend endpoint or integration
    // For now log and show a success message
    // In production, replace with fetch('/api/listing-lead', { method: 'POST', body: JSON.stringify(data) })
    // and proper error handling.
    // eslint-disable-next-line no-console
    console.log('Quick listing lead:', data);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-white">Quick list your land</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">✕</button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input name="name" placeholder="Your name" required className="w-full rounded-lg bg-slate-800 px-3 py-2 text-white" />
              <input name="phone" placeholder="Phone" required className="w-full rounded-lg bg-slate-800 px-3 py-2 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input name="email" type="email" placeholder="Email" required className="w-full rounded-lg bg-slate-800 px-3 py-2 text-white" />
              <input name="location" placeholder="Location (county/area)" required className="w-full rounded-lg bg-slate-800 px-3 py-2 text-white" />
            </div>
            <div>
              <input name="size" placeholder="Size (e.g., 1 acre / 0.5 ha)" className="w-full rounded-lg bg-slate-800 px-3 py-2 text-white" />
            </div>
            <div>
              <textarea name="notes" placeholder="Additional notes (optional)" className="w-full rounded-lg bg-slate-800 px-3 py-2 text-white" rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">Cancel</button>
              <button type="submit" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900">Send</button>
            </div>
          </form>
        ) : (
          <div className="mt-6 text-center text-slate-200">Thanks — we'll connect you with brokers shortly.</div>
        )}
      </div>
    </div>
  );
}
