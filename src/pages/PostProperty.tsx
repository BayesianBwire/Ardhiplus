import { FormEvent, useState } from 'react';

function parseCoords(value: string) {
  const parts = value.split(',').map((part) => part.trim());
  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);

  if (parts.length === 2 && !Number.isNaN(lat) && !Number.isNaN(lng)) {
    return { lat, lng };
  }

  return { lat: 0.0, lng: 0.0 };
}

function PostProperty() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('Residential');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [coordsInput, setCoordsInput] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'success' | 'error' | ''>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('');
    setMessage('');

    if (!title || !location || !size || !price || !description || !sellerName || !sellerPhone) {
      setStatus('error');
      setMessage('Please complete all required fields before submitting.');
      return;
    }

    const response = await fetch('/api/post-listing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        location,
        type: propertyType,
        size,
        price,
        description,
        seller_name: sellerName,
        seller_phone: sellerPhone,
        coords: parseCoords(coordsInput),
      }),
    });

    const result = await response.json();
    if (response.ok) {
      setStatus('success');
      setMessage(result.message || 'Property submission sent successfully.');
      setTitle('');
      setLocation('');
      setPropertyType('Residential');
      setSize('');
      setPrice('');
      setDescription('');
      setSellerName('');
      setSellerPhone('');
      setCoordsInput('');
    } else {
      setStatus('error');
      setMessage(result.message || 'Unable to submit the property.');
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Post a property for approval</h1>
        <p className="mt-4 text-slate-400 max-w-3xl leading-8">
          Upload your land details, add images, and submit the property for admin review and survey verification.
        </p>
      </div>

      <form className="grid gap-8" onSubmit={handleSubmit}>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Property details</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-200">
              Property title
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Prime residential plot"
                className="mt-2 w-full rounded-3xl bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 focus:ring-sky-500"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-200">
              Location
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Nairobi, Kenya"
                className="mt-2 w-full rounded-3xl bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 focus:ring-sky-500"
              />
            </label>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <label className="block text-sm font-semibold text-slate-200">
              Property type
              <select
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value)}
                className="mt-2 w-full rounded-3xl bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 focus:ring-sky-500"
              >
                <option>Residential</option>
                <option>Commercial</option>
                <option>Agricultural</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-200">
              Size
              <input
                type="text"
                value={size}
                onChange={(event) => setSize(event.target.value)}
                placeholder="e.g. 1.2 acres"
                className="mt-2 w-full rounded-3xl bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 focus:ring-sky-500"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-200">
              Price
              <input
                type="text"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="KES 12,500,000"
                className="mt-2 w-full rounded-3xl bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 focus:ring-sky-500"
              />
            </label>
          </div>
          <label className="block text-sm font-semibold text-slate-200 mt-6">
            Description
            <textarea
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter property description and special notes"
              className="mt-2 w-full rounded-3xl bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 focus:ring-sky-500"
            />
          </label>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Upload & verification</h2>
          <div className="mt-6 space-y-6">
            <label className="block text-sm font-semibold text-slate-200">
              Seller name
              <input
                type="text"
                value={sellerName}
                onChange={(event) => setSellerName(event.target.value)}
                placeholder="e.g. John Mwangi"
                className="mt-2 w-full rounded-3xl bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 focus:ring-sky-500"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-200">
              Seller contact phone
              <input
                type="text"
                value={sellerPhone}
                onChange={(event) => setSellerPhone(event.target.value)}
                placeholder="+254 700 000 000"
                className="mt-2 w-full rounded-3xl bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 focus:ring-sky-500"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-200">
              Location pin / GPS coordinates
              <input
                type="text"
                value={coordsInput}
                onChange={(event) => setCoordsInput(event.target.value)}
                placeholder="Latitude, Longitude"
                className="mt-2 w-full rounded-3xl bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 focus:ring-sky-500"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-200">
              Property images
              <input
                type="file"
                multiple
                className="mt-2 w-full rounded-3xl bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-800 focus:ring-sky-500"
              />
            </label>
          </div>
          {message ? (
            <p className={`mt-4 rounded-3xl px-4 py-3 text-sm ${status === 'success' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
              {message}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="submit"
              className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Submit for approval
            </button>
            <p className="text-sm text-slate-400">Our admin and survey team will review your submission within 24–48 hours.</p>
          </div>
        </div>
      </form>
    </section>
  );
}

export default PostProperty;
