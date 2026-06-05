import { Link, useLocation } from 'react-router-dom';
import LeadInbox from '../components/LeadInbox';
import PropertyTable from '../components/PropertyTable';
import MessagesCenter from '../components/MessagesCenter';
import ViewingsScheduler from '../components/ViewingsScheduler';
import VerificationCenter from '../components/VerificationCenter';
import DocumentsManager from '../components/DocumentsManager';
import { mockListings, type Listing } from '../data/mockListings';

type Role = 'agent' | 'broker' | 'owner';

function Dashboard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = (params.get('role') as Role) || 'agent';
  const isOwner = role === 'owner';
  const isBroker = role === 'broker';
  const userName = role === 'owner' ? 'Property Owner' : role === 'broker' ? 'Broker' : 'Bilford';
  const dashboardLabel = role === 'owner' ? 'Owner dashboard' : role === 'broker' ? 'Broker dashboard' : 'Agent dashboard';
  const roleDescription = isOwner
    ? 'Control your land assets, upload titles, and match verified buyers with confidence.'
    : isBroker
    ? 'Manage broker listings, buyer relationships, and commission performance in one place.'
    : 'Your mission control for verified listings, buyer leads, visits, commissions, and fraud prevention.';

  const totalListings = 24;
  const activeListings = 18;
  const soldProperties = 6;
  const pendingDeals = 4;
  const totalLeads = 112;
  const monthlyCommission = 'KES 345,000';
  const profileCompletion = 92;

  const performanceMetrics = [
    { label: 'Total Listings', value: totalListings.toString() },
    { label: 'Active Listings', value: activeListings.toString() },
    { label: 'Sold Properties', value: soldProperties.toString() },
    { label: 'Pending Deals', value: pendingDeals.toString() },
    { label: 'Total Leads', value: totalLeads.toString() },
    { label: 'Monthly Commission', value: monthlyCommission },
  ];

  const leadManagement = [
    { id: 'l1', name: 'John Kamau', note: 'Interested in Naivasha plot', status: 'Open' },
    { id: 'l2', name: 'Mary Achieng', note: 'Requested callback', status: 'Pending' },
    { id: 'l3', name: 'Peter Otieno', note: 'Requested viewing', status: 'Scheduled' },
  ];

  const propertyStatus = [
    { name: 'Karen Plot A', status: 'Verified', views: 145, leads: 8 },
    { name: 'Kitengela Land', status: 'Pending', views: 67, leads: 2 },
    { name: 'Naivasha Acreage', status: 'Sold', views: 320, leads: 14 },
  ];

  const upcomingVisits = [
    { date: '12 Jun', title: 'Naivasha Plot' },
    { date: '14 Jun', title: 'Karen Land Viewing' },
    { date: '17 Jun', title: 'Boundary Survey Visit' },
  ];

  const notifications = [
    'New inquiry received',
    'Survey completed',
    'Property verified',
    'Buyer submitted offer',
    'Document approved',
  ];

  const buyerMatches = [
    { name: 'Buyer A', note: 'Interested in farmland' },
    { name: 'Buyer B', note: 'Wants residential plots' },
    { name: 'Buyer C', note: 'Looking for Nairobi properties' },
  ];

  const fraudFlags = [
    'High risk listings',
    'Duplicate titles',
    'Boundary disputes',
    'Expired documents',
  ];

  const communicationActions = [
    { label: 'WhatsApp buyer', action: '/contact' },
    { label: 'Call buyer', action: '/contact' },
    { label: 'Email buyer', action: '/contact' },
    { label: 'Internal chat', action: '/messages' },
  ];

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300">{dashboardLabel}</p>
            <h1 className="mt-4 text-5xl font-semibold text-white">Welcome back, {userName}</h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-400">{roleDescription}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-500 hover:text-white"
            >
              Refresh overview
            </Link>
            <Link
              to="/post-property"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Post property
            </Link>
            <a
              href="/api/export/listings.csv"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-500 hover:text-white"
            >
              Export listings CSV
            </a>
            <a
              href="/api/export/leads.csv"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-500 hover:text-white"
            >
              Export leads CSV
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {performanceMetrics.map((metric) => {
            const to = metric.label === 'Total Leads' ? '/leads' : metric.label === 'Monthly Commission' ? '/commission' : '/my-listings';
            return (
              <Link
                key={metric.label}
                to={to}
                className="block rounded-xl border border-slate-800 bg-slate-950/70 p-4 shadow-sm hover:shadow-md"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{metric.value}</p>
              </Link>
            );
          })}
          <Link to="/settings" className="block rounded-xl border border-slate-800 bg-slate-950/70 p-4 shadow-sm hover:shadow-md">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Profile completion</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-2xl font-semibold text-white">{profileCompletion}%</p>
              <div className="flex-1">
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-emerald-400" style={{ width: `${profileCompletion}%` }} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.8fr_1.05fr]">
        <div className="space-y-8">
          <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-4 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Lead management</h2>
                <p className="mt-3 text-slate-400">Manage active leads, contact buyers, and close more deals from one place.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/leads" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400 hover:text-white">
                  View all leads
                </Link>
                <Link to="/viewings" className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
                  Schedule visit
                </Link>
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {leadManagement.map((lead) => (
                <Link key={lead.id} to={`/leads`} className="block rounded-xl border border-slate-800 bg-slate-950/80 p-4 shadow-sm hover:shadow-md">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">{lead.name}</p>
                      <h3 className="mt-1 text-lg font-semibold text-white">{lead.note}</h3>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-300">{lead.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-4 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Property status tracker</h2>
                <p className="mt-3 text-slate-400">Monitor property verification, traffic, and lead performance at a glance.</p>
              </div>
              <Link to="/my-listings" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400 hover:text-white">
                Manage listings
              </Link>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                <thead className="border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Property Name</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Views</th>
                    <th className="px-4 py-3">Leads</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {propertyStatus.map((item) => (
                    <tr key={item.name} className="hover:bg-slate-950/50">
                      <td className="px-4 py-4 font-semibold text-white">{item.name}</td>
                      <td className="px-4 py-4 text-slate-300">{item.status}</td>
                      <td className="px-4 py-4 text-slate-300">{item.views}</td>
                      <td className="px-4 py-4 text-slate-300">{item.leads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-4 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Upcoming site visits</h2>
                <p className="mt-3 text-slate-400">Stay ahead of appointments and reschedule with one click.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">Add Appointment</button>
                <button type="button" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400 hover:text-white">Reschedule</button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {upcomingVisits.map((visit) => (
                <Link key={visit.date} to="/viewings" className="block rounded-xl border border-slate-800 bg-slate-950/70 p-3 shadow-sm hover:shadow-md">
                  <p className="text-sm text-slate-400">{visit.date}</p>
                  <h3 className="mt-1 text-md font-semibold text-white">{visit.title}</h3>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-4 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Communication center</h2>
                <p className="mt-3 text-slate-400">Messages, email, call and WhatsApp shortcuts for every buyer interaction.</p>
              </div>
              <Link to="/messages" className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400 hover:text-white">
                Open messages
              </Link>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {communicationActions.map((item) => (
                <Link key={item.label} to={item.action} className="block rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-3 text-left text-sm text-slate-200 transition hover:border-sky-500 hover:bg-slate-950">
                  <div className="font-semibold text-white">{item.label}</div>
                  <div className="mt-1 text-xs text-slate-400">Quick action</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-white">Verification center</h2>
            <p className="mt-3 text-slate-400 text-sm">Open the verification workflow to see real title, survey, and county review status.</p>
            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/90 p-5 text-sm text-slate-300">
              <p className="font-semibold text-white">No dummy verification badges displayed here.</p>
              <p className="mt-3">Use the Verification section to manage actual property approvals, document uploads, and audit milestones.</p>
            </div>
            <Link
              to="/verification"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              Open verification center
            </Link>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-white">Notifications</h2>
            <p className="mt-3 text-slate-400 text-sm">Latest platform events and buyer updates.</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {notifications.map((note) => (
                <li key={note} className="rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3">{note}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-white">Buyer matching</h2>
            <p className="mt-3 text-slate-400 text-sm">Match your listings to active buyer requests.</p>
            <div className="mt-6 space-y-3">
              {buyerMatches.map((buyer) => (
                <div key={buyer.name} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                  <div className="font-semibold text-white">{buyer.name}</div>
                  <div className="text-sm text-slate-400">{buyer.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-white">Emergency / fraud flags</h2>
            <p className="mt-3 text-slate-400 text-sm">Alert items flagged for verification or legal review.</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {fraudFlags.map((flag) => (
                <li key={flag} className="rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3">{flag}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-white">Document center</h2>
            <p className="mt-3 text-slate-400 text-sm">Trusted uploads for title, survey, and ownership paperwork.</p>
            <div className="mt-5 space-y-3 rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
              {['Title Deed', 'Survey Maps', 'Ownership Documents', 'County Approvals', 'Sale Agreements'].map((doc) => (
                <div key={doc} className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-3 text-sm text-slate-200">
                  <span>{doc}</span>
                  <button type="button" className="rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-slate-950">Upload</button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
            <h2 className="text-2xl font-semibold text-white">Commission snapshot</h2>
            <p className="mt-3 text-slate-400 text-sm">Your latest payouts, revenue, and commission history.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Paid commission</span>
                  <span className="font-semibold text-white">KES 995,000</span>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Pending commission</span>
                  <span className="font-semibold text-amber-300">KES 245,000</span>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Total revenue generated</span>
                  <span className="font-semibold text-white">KES 8,320,000</span>
                </div>
              </div>
            </div>
            <Link
              to="/commission"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              View commission history
            </Link>
          </div>
        </aside>
      </div>

      {mockListings.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft text-center">
          <h2 className="text-2xl font-semibold text-white">You have no active listings.</h2>
          <p className="mt-3 text-slate-400">Post your first property to start receiving leads and engagement.</p>
          <Link
            to="/post-property"
            className="mt-6 inline-flex rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Post first property
          </Link>
        </div>
      ) : null}
    </section>
  );
}

export default Dashboard;
