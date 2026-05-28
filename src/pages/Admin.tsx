import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminAnalyticsDashboard from '../components/AdminAnalyticsDashboard';

function SectionTitle({ children }) {
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

  function renderSection() {
    switch (active) {
      case 'dashboard':
        return <AdminAnalyticsDashboard />;
      case 'listings':
        return (
          <div>
            <SectionTitle>Listings Management</SectionTitle>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-slate-400">
                    <th className="px-3 py-2">Title</th>
                    <th className="px-3 py-2">County</th>
                    <th className="px-3 py-2">Seller</th>
                    <th className="px-3 py-2">Price</th>
                    <th className="px-3 py-2">Acreage</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Docs</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyListings.map((l) => (
                    <tr key={l.id} className="border-b border-slate-800">
                      <td className="px-3 py-2 font-semibold text-white">{l.title}</td>
                      <td className="px-3 py-2">{l.county}</td>
                      <td className="px-3 py-2">{l.seller}</td>
                      <td className="px-3 py-2">{l.price}</td>
                      <td className="px-3 py-2">{l.acreage}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[l.status]}`}>{l.status.charAt(0).toUpperCase() + l.status.slice(1)}</span>
                      </td>
                      <td className="px-3 py-2">{l.docs}</td>
                      <td className="px-3 py-2 flex gap-2">
                        <button className="px-2 py-1 rounded bg-emerald-700/30 text-emerald-300 text-xs">Approve</button>
                        <button className="px-2 py-1 rounded bg-rose-700/30 text-rose-300 text-xs">Reject</button>
                        <button className="px-2 py-1 rounded bg-sky-700/30 text-sky-300 text-xs">Edit</button>
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
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-800/80 p-4">
                <div className="font-semibold text-white">Buyers</div>
                <div className="text-slate-400 text-xs">Suspend, reset password, assign roles</div>
              </div>
              <div className="rounded-xl bg-slate-800/80 p-4">
                <div className="font-semibold text-white">Sellers</div>
                <div className="text-slate-400 text-xs">Verify, suspend, manage listings</div>
              </div>
              <div className="rounded-xl bg-slate-800/80 p-4">
                <div className="font-semibold text-white">Surveyors</div>
                <div className="text-slate-400 text-xs">Assign, verify, manage requests</div>
              </div>
              <div className="rounded-xl bg-slate-800/80 p-4">
                <div className="font-semibold text-white">Admins</div>
                <div className="text-slate-400 text-xs">Assign roles, manage platform</div>
              </div>
            </div>
          </div>
        );
      case 'verification':
        return (
          <div>
            <SectionTitle>Verification System</SectionTitle>
            <ol className="list-decimal list-inside text-slate-300 space-y-2">
              <li>Submitted <span className="ml-2 px-2 py-1 rounded-full bg-yellow-700/20 text-yellow-300 text-xs">Pending</span></li>
              <li>Under Review <span className="ml-2 px-2 py-1 rounded-full bg-sky-700/20 text-sky-300 text-xs">In Progress</span></li>
              <li>Survey Verified <span className="ml-2 px-2 py-1 rounded-full bg-emerald-700/20 text-emerald-300 text-xs">Verified</span></li>
              <li>Published <span className="ml-2 px-2 py-1 rounded-full bg-amber-700/20 text-amber-300 text-xs">Live</span></li>
            </ol>
            <div className="mt-6 text-slate-400 text-xs">Admin/surveyors verify title deed, coordinates, boundaries, ownership, and survey documents.</div>
          </div>
        );
      case 'survey':
        return (
          <div>
            <SectionTitle>Survey Requests</SectionTitle>
            <div className="rounded-xl bg-slate-800/80 p-4 mb-4">Assign surveyors, set appointment dates, track progress.</div>
            <div className="rounded-xl bg-slate-800/80 p-4">Site visits, beacon checks, land subdivision, title verification.</div>
          </div>
        );
      case 'reports':
        return (
          <div>
            <SectionTitle>Fraud Monitoring & Messaging</SectionTitle>
            <div className="rounded-xl bg-slate-800/80 p-4 mb-4">Reported listings, suspicious users, duplicate properties, fake title reports.</div>
            <div className="rounded-xl bg-slate-800/80 p-4 mb-4">Inquiries sent, unread messages, property interest stats, WhatsApp/email integration.</div>
            <div className="rounded-xl bg-slate-800/80 p-4 text-xs text-slate-400">Emails for inquiry are sent to <span className="text-sky-400">inquiry@ardhiplus.co.ke</span></div>
          </div>
        );
      case 'payments':
        return (
          <div>
            <SectionTitle>Payment & Revenue</SectionTitle>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Featured listing payments</li>
              <li>Survey payments</li>
              <li>Subscription plans</li>
              <li>M-Pesa transactions</li>
            </ul>
            <div className="mt-4 text-xs text-slate-400">(Structure in place for future expansion.)</div>
          </div>
        );
      case 'settings':
        return (
          <div>
            <SectionTitle>Content Management</SectionTitle>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Edit homepage text, banners, services, testimonials, FAQ, contact info</li>
              <li>Prevents hardcoding everything</li>
            </ul>
          </div>
        );
      default:
        return <div className="text-slate-400">Select a section from the sidebar.</div>;
    }
  }

  return (
    <AdminLayout>
      {/* Section switcher (simulate sidebar state) */}
      <div className="mb-8 flex flex-wrap gap-2">
        {[
          { key: 'dashboard', label: 'Dashboard' },
          { key: 'listings', label: 'Listings' },
          { key: 'users', label: 'Users' },
          { key: 'verification', label: 'Verification' },
          { key: 'survey', label: 'Survey Requests' },
          { key: 'reports', label: 'Reports' },
          { key: 'payments', label: 'Payments' },
          { key: 'settings', label: 'Settings' },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={`px-4 py-2 rounded transition font-medium text-xs ${active === s.key ? 'bg-amber-900/30 text-amber-300' : 'hover:bg-slate-800/80 text-slate-200'}`}
          >
            {s.label}
          </button>
        ))}
      </div>
      {renderSection()}
    </AdminLayout>
  );
}
