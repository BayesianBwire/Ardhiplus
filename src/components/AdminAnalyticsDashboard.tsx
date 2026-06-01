const metrics = [
  { label: 'Total listings', value: '128', change: '+12%', color: 'text-emerald-400' },
  { label: 'Active users', value: '54', change: '+8%', color: 'text-sky-400' },
  { label: 'Published pages', value: '18', change: '+4%', color: 'text-slate-200' },
  { label: 'Content updates', value: '5', change: '-2%', color: 'text-amber-400' },
];

const weeklyTrend = [42, 56, 48, 63, 72, 65, 80];
const topQueues = [
  { label: 'Listings pending review', value: 7, badge: 'High priority' },
  { label: 'Survey requests open', value: 12, badge: 'Medium' },
  { label: 'Site support tickets', value: 9, badge: 'Urgent' },
];

const breakdown = [
  { label: 'Live', percent: 54, color: 'bg-sky-500' },
  { label: 'Under review', percent: 24, color: 'bg-yellow-500' },
  { label: 'Rejected', percent: 12, color: 'bg-rose-500' },
  { label: 'Draft', percent: 10, color: 'bg-slate-500' },
];

export default function AdminAnalyticsDashboard() {
  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-soft">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">Advanced admin dashboard</h2>
            <p className="mt-2 max-w-2xl text-slate-400">Real-time platform insights, review queue state, and verification health for faster admin actions.</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">Updated 2 minutes ago</div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/90 p-5">
              <div className={`text-4xl font-semibold ${metric.color}`}>{metric.value}</div>
              <div className="mt-2 flex items-center justify-between gap-4 text-sm text-slate-400">
                <span>{metric.label}</span>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${metric.color} bg-white/5`}>{metric.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Weekly platform trend</h3>
              <p className="text-slate-400 text-sm">Traffic, submissions, and approvals over the last 7 days.</p>
            </div>
            <div className="text-sm text-slate-300">+18% growth week-over-week</div>
          </div>

          <div className="mt-8 grid grid-cols-7 gap-2">
            {weeklyTrend.map((value, index) => (
              <div key={index} className="group flex flex-col items-center gap-2">
                <div className="relative h-44 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-t from-cyan-500/50 to-transparent" style={{ height: `${value}%` }} />
                </div>
                <div className="text-center text-[10px] uppercase tracking-[0.25em] text-slate-500">Day {index + 1}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-soft">
            <h3 className="text-xl font-semibold text-white">Review queue</h3>
            <div className="mt-6 space-y-4">
              {topQueues.map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-white">{item.label}</div>
                      <div className="text-slate-400 text-sm">{item.value} items awaiting action</div>
                    </div>
                    <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">{item.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-soft">
            <h3 className="text-xl font-semibold text-white">Property status</h3>
            <div className="mt-6 space-y-4">
              {breakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>{item.label}</span>
                    <span>{item.percent}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-800">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-soft">
          <h3 className="text-xl font-semibold text-white">Platform health</h3>
          <p className="mt-2 text-slate-400 text-sm">Monitor verification velocity, approvals, and risk markers in one view.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
              <div className="text-sm text-slate-400">Verification speed</div>
              <div className="mt-3 text-3xl font-semibold text-emerald-300">72%</div>
              <div className="mt-4 h-2 rounded-full bg-slate-800">
                <div className="h-full w-3/4 rounded-full bg-emerald-500" />
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
              <div className="text-sm text-slate-400">Risk rate</div>
              <div className="mt-3 text-3xl font-semibold text-rose-300">8%</div>
              <div className="mt-4 h-2 rounded-full bg-slate-800">
                <div className="h-full w-1/5 rounded-full bg-rose-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-soft">
          <h3 className="text-xl font-semibold text-white">Admin workflow</h3>
          <p className="mt-2 text-slate-400 text-sm">Actions and next steps to keep the platform up to date.</p>
          <ol className="mt-6 space-y-4 text-slate-300">
            <li className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">Review the oldest pending listings and publish verified properties.</li>
            <li className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">Assign surveyors to new requests and track site visits.</li>
            <li className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">Resolve fraud reports within 24 hours and flag suspicious accounts.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
