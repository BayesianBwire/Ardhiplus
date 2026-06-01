import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import AdminAnalyticsDashboard from '../components/AdminAnalyticsDashboard';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold text-amber-400 mb-4">{children}</h2>;
}

const dummyListings = [
  { id: 1, title: 'Greenfields Estate', county: 'Kiambu', seller: 'Jane Mwangi', price: 'KSh 2.5M', acreage: '1.2', status: 'verified', docs: 3 },
  { id: 2, title: 'Coastal View Plots', county: 'Mombasa', seller: 'Samuel Otieno', price: 'KSh 1.8M', acreage: '0.8', status: 'pending', docs: 2 },
  { id: 3, title: 'Sunset Gardens', county: 'Nairobi', seller: 'Grace Wambui', price: 'KSh 3.1M', acreage: '2.0', status: 'rejected', docs: 1 },
];

const statusColors = {
  verified: 'bg-emerald-700/20 text-emerald-400',
  pending: 'bg-yellow-700/20 text-yellow-300',
  rejected: 'bg-rose-700/20 text-rose-400',
};

export default function Admin() {
  const [active, setActive] = useState('dashboard');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user || !['admin', 'superadmin'].includes(user.role)) {
      navigate('/login');
    }
  }, [user, navigate]);

  function renderSection() {
    switch (active) {
      case 'dashboard':
        return <AdminAnalyticsDashboard />;
      case 'site':
        return (
          <div>
            <SectionTitle>Site management center</SectionTitle>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-6">
                <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Site pages</div>
                <div className="mt-4 text-4xl font-semibold text-sky-300">18</div>
                <div className="mt-3 text-slate-400 text-sm">Pages published, homepage sections, FAQ and services content.</div>
              </div>
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-6">
                <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Contents & updates</div>
                <div className="mt-4 text-4xl font-semibold text-emerald-300">5</div>
                <div className="mt-3 text-slate-400 text-sm">Active content items pending review or update.</div>
              </div>
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-6">
                <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Support tickets</div>
                <div className="mt-4 text-4xl font-semibold text-amber-300">9</div>
                <div className="mt-3 text-slate-400 text-sm">Messages, inquiries, and verification requests waiting for admin response.</div>
              </div>
            </div>
            <div className="mt-8 grid gap-4 xl:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-6">
                <h3 className="font-semibold text-white">Site configuration</h3>
                <p className="mt-3 text-slate-400 text-sm">Manage the site navigation, homepage offers, app settings, and contact info from one place.</p>
                <ul className="mt-5 space-y-3 text-slate-300 text-sm">
                  <li>Homepage banners and hero text</li>
                  <li>Services page copy and survey descriptions</li>
                  <li>FAQ content, contact details, and support channels</li>
                </ul>
              </div>
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-6">
                <h3 className="font-semibold text-white">Site operations</h3>
                <p className="mt-3 text-slate-400 text-sm">Keep the property marketplace, verification workflows, and platform reports in sync.</p>
                <ul className="mt-5 space-y-3 text-slate-300 text-sm">
                  <li>Approve or reject listings across the site</li>
                  <li>Assign surveyor requests and schedule reviews</li>
                  <li>Monitor platform security and fraud reports</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'listings':
        return (
          <div>
            <SectionTitle>Listings Management</SectionTitle>
            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 p-4 shadow-soft">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-slate-400 uppercase tracking-wide text-xs">
                    <th className="px-3 py-3 text-left">Title</th>
                    <th className="px-3 py-3 text-left">County</th>
                    <th className="px-3 py-3 text-left">Seller</th>
                    <th className="px-3 py-3 text-left">Price</th>
                    <th className="px-3 py-3 text-left">Acreage</th>
                    <th className="px-3 py-3 text-left">Status</th>
                    <th className="px-3 py-3 text-left">Docs</th>
                    <th className="px-3 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyListings.map((listing) => (
                    <tr key={listing.id} className="border-t border-slate-800 hover:bg-slate-900/60 transition-colors">
                      <td className="px-3 py-3 font-semibold text-white">{listing.title}</td>
                      <td className="px-3 py-3">{listing.county}</td>
                      <td className="px-3 py-3">{listing.seller}</td>
                      <td className="px-3 py-3">{listing.price}</td>
                      <td className="px-3 py-3">{listing.acreage}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusColors[listing.status]}`}>
                          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-3 py-3">{listing.docs}</td>
                      <td className="px-3 py-3 flex flex-wrap gap-2">
                        <button className="rounded-full bg-emerald-700/20 px-3 py-1 text-emerald-200 text-xs">Approve</button>
                        <button className="rounded-full bg-rose-700/20 px-3 py-1 text-rose-200 text-xs">Reject</button>
                        <button className="rounded-full bg-sky-700/20 px-3 py-1 text-sky-200 text-xs">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'users':
        return (
          <div>
            <SectionTitle>User Management</SectionTitle>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-5">
                <div className="font-semibold text-white">Buyers</div>
                <div className="text-slate-400 text-sm mt-2">Suspend, reset password, assign roles.</div>
              </div>
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-5">
                <div className="font-semibold text-white">Sellers</div>
                <div className="text-slate-400 text-sm mt-2">Verify, suspend, manage listings.</div>
              </div>
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-5">
                <div className="font-semibold text-white">Surveyors</div>
                <div className="text-slate-400 text-sm mt-2">Assign, verify, manage requests.</div>
              </div>
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-5">
                <div className="font-semibold text-white">Admins</div>
                <div className="text-slate-400 text-sm mt-2">Assign roles, manage platform.</div>
              </div>
            </div>
          </div>
        );
      case 'verification':
        return (
          <div>
            <SectionTitle>Verification Pipeline</SectionTitle>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-5">
                <h3 className="text-white font-semibold mb-3">Current stages</h3>
                <ol className="list-decimal list-inside space-y-3 text-slate-300">
                  <li>Submitted<span className="ml-2 inline-flex rounded-full bg-yellow-700/20 px-2 py-1 text-xs text-yellow-300">Pending</span></li>
                  <li>Under Review<span className="ml-2 inline-flex rounded-full bg-sky-700/20 px-2 py-1 text-xs text-sky-300">In progress</span></li>
                  <li>Survey Verified<span className="ml-2 inline-flex rounded-full bg-emerald-700/20 px-2 py-1 text-xs text-emerald-300">Verified</span></li>
                  <li>Published<span className="ml-2 inline-flex rounded-full bg-amber-700/20 px-2 py-1 text-xs text-amber-300">Live</span></li>
                </ol>
              </div>
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-5">
                <h3 className="text-white font-semibold mb-3">Verification notes</h3>
                <p className="text-slate-400 text-sm leading-6">Admin and surveyor review confirms title deed, boundary coordinates, ownership documents, and property history before listings go live.</p>
              </div>
            </div>
          </div>
        );
      case 'survey':
        return (
          <div>
            <SectionTitle>Survey Requests</SectionTitle>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-5">
                <h3 className="text-white font-semibold mb-3">Open assignments</h3>
                <p className="text-slate-400 text-sm">Assign surveyors, schedule visits, track completion for pending requests.</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-5">
                <h3 className="text-white font-semibold mb-3">Verification tasks</h3>
                <p className="text-slate-400 text-sm">Site visits, beacon checks, and boundary survey validation ensure every property is reliably verified.</p>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div>
            <SectionTitle>Fraud Monitoring</SectionTitle>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-5">
                <div className="text-sm uppercase tracking-[0.15em] text-slate-400">Reported listings</div>
                <div className="mt-4 text-3xl font-semibold text-rose-300">3</div>
              </div>
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-5">
                <div className="text-sm uppercase tracking-[0.15em] text-slate-400">Flagged accounts</div>
                <div className="mt-4 text-3xl font-semibold text-sky-300">2</div>
              </div>
              <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-5">
                <div className="text-sm uppercase tracking-[0.15em] text-slate-400">Unreviewed reports</div>
                <div className="mt-4 text-3xl font-semibold text-amber-300">5</div>
              </div>
            </div>
          </div>
        );
      case 'payments':
        return (
          <div>
            <SectionTitle>Payment & Revenue</SectionTitle>
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-5 space-y-3">
              <p className="text-slate-300">Review featured listing subscriptions, survey fees, and M-Pesa payment records from the platform.</p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 text-sm">
                <li>Featured listing payments</li>
                <li>Survey payments</li>
                <li>Subscription plans</li>
                <li>M-Pesa transactions</li>
              </ul>
              <p className="text-xs text-slate-500">(Structured for later integration with merchant and payment reporting flows.)</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div>
            <SectionTitle>Settings & content</SectionTitle>
            <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/90 p-5">
              <ul className="list-disc list-inside text-slate-300 space-y-2 text-sm">
                <li>Edit homepage banners, service sections, FAQ content, and contact details.</li>
                <li>Control user roles, platform policies, and admin defaults.</li>
                <li>Keep the admin panel flexible without hardcoded site text.</li>
              </ul>
            </div>
          </div>
        );
      default:
        return <div className="text-slate-400">Select a section from the sidebar.</div>;
    }
  }

  return (
    <AdminLayout active={active} onSelectSection={setActive}>
      <div className="mb-8 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-white">Admin Dashboard</h1>
              <p className="mt-2 max-w-2xl text-slate-400">Overview of listings, verification status, survey requests, and fraud monitoring for the Ardhi Plus platform.</p>
            </div>
            <div className="rounded-3xl bg-slate-800/80 px-4 py-3 text-sm text-slate-300">Role: Admin</div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-slate-800/80 p-4">
              <div className="text-sm text-slate-400">Pending Approvals</div>
              <div className="mt-3 text-3xl font-semibold text-amber-300">7</div>
            </div>
            <div className="rounded-3xl bg-slate-800/80 p-4">
              <div className="text-sm text-slate-400">Active Users</div>
              <div className="mt-3 text-3xl font-semibold text-sky-300">54</div>
            </div>
            <div className="rounded-3xl bg-slate-800/80 p-4">
              <div className="text-sm text-slate-400">Survey Requests</div>
              <div className="mt-3 text-3xl font-semibold text-emerald-300">12</div>
            </div>
            <div className="rounded-3xl bg-slate-800/80 p-4">
              <div className="text-sm text-slate-400">Fraud Reports</div>
              <div className="mt-3 text-3xl font-semibold text-rose-300">3</div>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-soft">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Quick actions</div>
          <div className="mt-5 grid gap-3">
            <button type="button" onClick={() => setActive('listings')} className="rounded-3xl bg-amber-900/40 px-4 py-3 text-left text-white transition hover:bg-amber-900/70">Review pending listings</button>
            <button type="button" onClick={() => setActive('verification')} className="rounded-3xl bg-slate-800/80 px-4 py-3 text-left text-slate-200 transition hover:bg-slate-700/90">Check verification queue</button>
            <button type="button" onClick={() => setActive('reports')} className="rounded-3xl bg-slate-800/80 px-4 py-3 text-left text-slate-200 transition hover:bg-slate-700/90">View fraud reports</button>
          </div>
        </div>
      </div>
      {renderSection()}
    </AdminLayout>
  );
}
