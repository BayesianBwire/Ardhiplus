import { useState } from 'react';
import { mockAgents, type Agent } from '../data/mockAgents';
import QuickListModal from '../components/QuickListModal';

function Agents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showQuickList, setShowQuickList] = useState(false);

  // Get unique specializations
  const specializations = ['All', ...new Set(mockAgents.flatMap((a) => a.specialization))];

  // Filter agents
  let filtered = mockAgents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.agency.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'All' || agent.specialization.includes(selectedSpecialization);
    const matchesVerified = !verifiedOnly || agent.verified;
    return matchesSearch && matchesSpecialization && matchesVerified;
  });

  // Sort by rating
  filtered.sort((a, b) => b.rating - a.rating);

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white">Agents & Brokers</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Find trusted, verified agents and brokers. Whether you're a landowner looking to sell or a broker
              looking to list properties, Ardhi Plus connects you with verified professionals and tools to make the
              process simple and secure.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => setShowQuickList(true)}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                List your land
              </button>
              <a
                href="/register?role=broker"
                className="inline-flex items-center gap-2 rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-emerald-400"
              >
                Join as a broker
              </a>
            </div>
          </div>

          <div className="hidden md:block w-80">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-sm font-semibold text-sky-300">For Landowners</p>
              <p className="mt-2 text-sm text-slate-400">List land quickly, verify survey documents, and get matched with local brokers who specialise in land sales.</p>
              <hr className="my-3 border-slate-800" />
              <p className="text-sm font-semibold text-sky-300">For Brokers</p>
              <p className="mt-2 text-sm text-slate-400">Create a trusted profile, showcase listings, and reach verified landowners actively selling property.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft text-center">
          <p className="text-3xl font-bold text-sky-300">{mockAgents.length}</p>
          <p className="mt-2 text-slate-400">Verified Agents</p>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft text-center">
          <p className="text-3xl font-bold text-emerald-300">
            {mockAgents.reduce((sum, a) => sum + a.listings, 0)}
          </p>
          <p className="mt-2 text-slate-400">Total Listings</p>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft text-center">
          <p className="text-3xl font-bold text-amber-300">
            {(mockAgents.reduce((sum, a) => sum + a.rating, 0) / mockAgents.length).toFixed(1)}
          </p>
          <p className="mt-2 text-slate-400">Average Rating</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-sky-300 mb-2">Search by name or agency</label>
            <input
              type="text"
              placeholder="e.g., Samuel Kipchoge, Ardhi Plus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500"
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-semibold text-sky-300 mb-2">Specialization</label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Verified Toggle */}
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded border border-slate-700 bg-slate-800 w-4 h-4"
              />
              <span className="text-sm font-semibold text-slate-300">Verified agents only</span>
            </label>
          </div>
        </div>

        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedSpecialization('All');
            setVerifiedOnly(false);
          }}
          className="mt-4 rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
        >
          Reset Filters
        </button>
      </div>

      {/* Results */}
      <div className="text-sm text-slate-400">
        Showing {filtered.length} of {mockAgents.length} agents
      </div>

      {/* Agent Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((agent) => (
            <div
              key={agent.id}
              className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft hover:border-sky-500 transition"
            >
              {/* Agent Header */}
              <div className="flex items-start gap-4 mb-4">
                <img src={agent.image} alt={agent.name} className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{agent.name}</h3>
                    {agent.verified && (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                        ✓
                      </span>
                    )}
                    {agent.specialization.includes('Land') && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold px-2 py-1">
                        Land specialist
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-sky-300">{agent.agency}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-amber-400">
                  {'⭐'.repeat(Math.floor(agent.rating))}
                </div>
                <span className="text-sm text-slate-300">
                  {agent.rating} ({agent.reviews} reviews)
                </span>
              </div>

              {/* Bio */}
              <p className="text-sm text-slate-400 mb-4">{agent.bio}</p>

              {/* Testimonial */}
              {agent.testimonials && agent.testimonials.length > 0 && (
                <blockquote className="mb-4 rounded-lg border-l-2 border-slate-800 pl-3 text-sm text-slate-300 italic">"{agent.testimonials[0]}"</blockquote>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4 text-center py-3 border-y border-slate-800">
                <div>
                  <p className="text-xl font-bold text-sky-300">{agent.listings}</p>
                  <p className="text-xs text-slate-500">Listings</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-emerald-300">{agent.reviews}</p>
                  <p className="text-xs text-slate-500">Reviews</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-amber-300">{agent.joinDate}</p>
                  <p className="text-xs text-slate-500">Joined</p>
                </div>
              </div>

              {/* Specialization */}
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wide text-sky-300 mb-2">Specialization</p>
                <div className="flex flex-wrap gap-2">
                  {agent.specialization.map((spec) => (
                    <span key={spec} className="inline-flex rounded-full bg-sky-500/20 px-2 py-1 text-xs font-semibold text-sky-300">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="flex gap-2">
                <a
                  href={`mailto:${agent.email}`}
                  className="flex-1 rounded-full bg-sky-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 text-center"
                >
                  Email
                </a>
                <a
                  href={`tel:${agent.phone}`}
                  className="flex-1 rounded-full border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-sky-500 hover:text-sky-300 text-center"
                >
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 text-center shadow-soft">
          <p className="text-slate-400">No agents found. Try adjusting your filters.</p>
        </div>
      )}
      <QuickListModal open={showQuickList} onClose={() => setShowQuickList(false)} />
    </section>
  );
}

export default Agents;
