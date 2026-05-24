function Dashboard() {
  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Seller dashboard</h1>
        <p className="mt-3 text-slate-400">Manage your listings, review buyer interest, and access sales resources from one dashboard.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">My listings</h2>
          <p className="mt-4 text-slate-300">See all houses and properties you’re selling, with status and verification details.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Edit or remove listings</h2>
          <p className="mt-4 text-slate-300">Update pricing, property details, or remove listings that are no longer available.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Views and inquiries</h2>
          <p className="mt-4 text-slate-300">Track listing views, buyer questions, and inbound interest in your properties.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-white">Sales training</h2>
          <p className="mt-4 text-slate-300">Access best practices for property sales, broker negotiations, and closing deals.</p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-white">Quick actions</h2>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>✅ Add a new listing</li>
          <li>✅ Review buyer interest</li>
          <li>✅ Visit training resources</li>
        </ul>
      </div>
    </section>
  );
}

export default Dashboard;
