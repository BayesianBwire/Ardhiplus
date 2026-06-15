import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import FileUploader from '../components/FileUploader';

function parseCoords(value: string) {
  const parts = value.split(',').map((part) => part.trim());
  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);

  if (parts.length === 2 && !Number.isNaN(lat) && !Number.isNaN(lng)) {
    return { lat, lng };
  }

  return { lat: 0.0, lng: 0.0 };
}

function getCookieValue(name: string) {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

function getCsrfToken() {
  if (typeof window !== 'undefined' && (window as any).CSRF_TOKEN) {
    return (window as any).CSRF_TOKEN as string;
  }
  if (typeof document !== 'undefined') {
    const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
    if (meta?.content) {
      return meta.content;
    }
    return getCookieValue('csrf_token');
  }
  return '';
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'success' | 'error' | ''>('');
  const [draftStatus, setDraftStatus] = useState<'saving' | 'saved' | ''>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const saveTimer = useRef<number | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitListing();
  };

  async function submitListing() {
    setStatus('');
    setMessage('');
    setUploadError('');

    if (!title || !location || !size || !price || !description || !sellerName || !sellerPhone) {
      setStatus('error');
      setMessage('Please complete all required fields before submitting.');
      return;
    }

    const csrfHeader = getCsrfToken();
    let response: Response | null = null;
    let result: any = null;
    const coords = parseCoords(coordsInput);

    if (selectedFiles.length > 0) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('location', location);
      formData.append('type', propertyType);
      formData.append('size', size);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('seller_name', sellerName);
      formData.append('seller_phone', sellerPhone);
      formData.append('coords_lat', String(coords.lat));
      formData.append('coords_lng', String(coords.lng));
      selectedFiles.forEach((file) => formData.append('photos', file));

      setUploading(true);
      setUploadProgress(0);
      try {
        result = await new Promise<any>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/api/post-listing');
          if (csrfHeader) {
            xhr.setRequestHeader('X-CSRF-Token', csrfHeader);
          }
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              setUploadProgress(Math.round((event.loaded / event.total) * 100));
            }
          };
          xhr.onload = () => {
            let parsed: any;
            try {
              parsed = JSON.parse(xhr.responseText);
            } catch {
              parsed = { message: xhr.responseText };
            }
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(parsed);
            } else {
              reject(parsed);
            }
          };
          xhr.onerror = () => reject({ message: 'Upload failed due to network error.' });
          xhr.send(formData);
        });
        response = { ok: true } as Response;
      } catch (error) {
        response = { ok: false } as Response;
        result = error;
      } finally {
        setUploading(false);
      }
    } else {
      response = await fetch('/api/post-listing', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfHeader ? { 'X-CSRF-Token': csrfHeader } : {}),
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
          coords,
        }),
      });
      result = await response.json();
    }

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
      setSelectedFiles([]);
      setUploadProgress(0);
      setUploadError('');
      localStorage.removeItem('postPropertyDraft');
    } else {
      setStatus('error');
      const messageText = result?.message || 'Unable to submit the property.';
      setMessage(messageText);
      setUploadError(messageText);
    }
  }

  useEffect(() => {
    setDraftStatus('saving');
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      const draft = {
        title,
        location,
        propertyType,
        size,
        price,
        description,
        sellerName,
        sellerPhone,
        coordsInput,
        savedAt: Date.now(),
      };
      try {
        localStorage.setItem('postPropertyDraft', JSON.stringify(draft));
        setDraftStatus('saved');
        setTimeout(() => setDraftStatus(''), 1500);
      } catch {
        setDraftStatus('');
      }
    }, 900);

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [title, location, propertyType, size, price, description, sellerName, sellerPhone, coordsInput]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('postPropertyDraft');
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft) {
          setTitle(draft.title || '');
          setLocation(draft.location || '');
          setPropertyType(draft.propertyType || 'Residential');
          setSize(draft.size || '');
          setPrice(draft.price || '');
          setDescription(draft.description || '');
          setSellerName(draft.sellerName || '');
          setSellerPhone(draft.sellerPhone || '');
          setCoordsInput(draft.coordsInput || '');
        }
      }
    } catch {
      // ignore
    }
  }, []);

  function removeFile(index: number) {
    setSelectedFiles((files) => files.filter((_, idx) => idx !== index));
  }

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
            <FileUploader
              multiple
              accept="image/*"
              files={selectedFiles}
              onChange={setSelectedFiles}
              uploading={uploading}
              progress={uploadProgress}
              error={uploadError}
              onRemove={removeFile}
              onRetry={submitListing}
            />
          </div>
          {message ? (
            <p className={`mt-4 rounded-3xl px-4 py-3 text-sm ${status === 'success' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
              {message}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={uploading}
              className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Submit for approval
            </button>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-400">Our admin and survey team will review your submission within 24–48 hours.</p>
              {draftStatus === 'saving' && <div className="text-sm text-slate-400">Saving draft…</div>}
              {draftStatus === 'saved' && <div className="text-sm text-emerald-300">Draft saved</div>}
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default PostProperty;
