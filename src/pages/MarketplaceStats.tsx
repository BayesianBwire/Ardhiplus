import { mockListings } from '../data/mockListings';
import { mockAgents } from '../data/mockAgents';

function MarketplaceStats() {
  // Calculate stats
  const totalListings = mockListings.length;
  const verifiedListings = mockListings.filter((l) => l.verified).length;
  const unverifiedListings = totalListings - verifiedListings;
  const avgPrice = mockListings.reduce((sum, l) => sum + l.priceNum, 0) / totalListings;
  const totalValue = mockListings.reduce((sum, l) => sum + l.priceNum, 0);
  const totalAgents = mockAgents.length;
  const totalBedrooms = mockListings.filter((l) => l.bedrooms).length;

  // County breakdown
  const countyBreakdown = mockListings.reduce(
    (acc, listing) => {
      const county = listing.county;
      acc[county] = (acc[county] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Property type breakdown
  const typeBreakdown = mockListings.reduce(
    (acc, listing) => {
      const type = listing.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Price ranges
  const priceRanges = {
    '0-10M': mockListings.filter((l) => l.priceNum <= 10000000).length,
    '10-25M': mockListings.filter((l) => l.priceNum > 10000000 && l.priceNum <= 25000000).length,
    '25-50M': mockListings.filter((l) => l.priceNum > 25000000 && l.priceNum <= 50000000).length,
    '50M+': mockListings.filter((l) => l.priceNum > 50000000).length,
  };

  const maxCount = Math.max(...Object.values(countyBreakdown), ...Object.values(typeBreakdown));

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-4xl font-bold text-white">Marketplace Statistics</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Real-time insights into the Ardhi Plus property marketplace. Track market trends, property distribution, and
          pricing data across all counties.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <p className="text-4xl font-bold text-sky-300">{totalListings}</p>
          <p className="mt-2 text-sm text-slate-400">Total Listings</p>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <p className="text-4xl font-bold text-emerald-300">{verifiedListings}</p>
          <p className="mt-2 text-sm text-slate-400">Verified Properties</p>
          <p className="mt-3 text-xs text-slate-500">{((verifiedListings / totalListings) * 100).toFixed(0)}% verified</p>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <p className="text-4xl font-bold text-amber-300">{totalAgents}</p>
          <p className="mt-2 text-sm text-slate-400">Active Agents</p>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <p className="text-4xl font-bold text-rose-300">KES {(totalValue / 1000000000).toFixed(1)}B</p>
          <p className="mt-2 text-sm text-slate-400">Market Value</p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <p className="text-3xl font-bold text-sky-300">KES {(avgPrice / 1000000).toFixed(1)}M</p>
          <p className="mt-2 text-sm text-slate-400">Avg. Property Price</p>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <p className="text-3xl font-bold text-emerald-300">{totalBedrooms}</p>
          <p className="mt-2 text-sm text-slate-400">Residential Units</p>
          <p className="mt-3 text-xs text-slate-500">{((totalBedrooms / totalListings) * 100).toFixed(0)}% of marketplace</p>
        </div>
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
          <p className="text-3xl font-bold text-amber-300">{Object.keys(countyBreakdown).length}</p>
          <p className="mt-2 text-sm text-slate-400">Counties Covered</p>
        </div>
      </div>

      {/* County Distribution */}
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h2 className="mb-6 text-2xl font-bold text-white">Properties by County</h2>
        <div className="space-y-4">
          {Object.entries(countyBreakdown)
            .sort(([, a], [, b]) => b - a)
            .map(([county, count]) => (
              <div key={county} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-white">{county}</span>
                  <span className="text-slate-400">{count} properties</span>
                </div>
                <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Property Type Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="mb-6 text-2xl font-bold text-white">Properties by Type</h2>
          <div className="space-y-4">
            {Object.entries(typeBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-white">{type}</span>
                    <span className="text-slate-400">{count} properties</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Price Range Distribution */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
          <h2 className="mb-6 text-2xl font-bold text-white">Price Range Distribution</h2>
          <div className="space-y-4">
            {Object.entries(priceRanges).map(([range, count]) => (
              <div key={range} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-white">{range}</span>
                  <span className="text-slate-400">{count} properties</span>
                </div>
                <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h2 className="mb-6 text-2xl font-bold text-white">Verification Status</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-white">Verified</span>
                <span className="text-slate-400">{verifiedListings} properties</span>
              </div>
              <div className="h-4 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  style={{ width: `${(verifiedListings / totalListings) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-slate-400">
              {((verifiedListings / totalListings) * 100).toFixed(1)}% of marketplace
            </p>
          </div>
          <div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-white">Survey Pending</span>
                <span className="text-slate-400">{unverifiedListings} properties</span>
              </div>
              <div className="h-4 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                  style={{ width: `${(unverifiedListings / totalListings) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-slate-400">
              {((unverifiedListings / totalListings) * 100).toFixed(1)}% of marketplace
            </p>
          </div>
        </div>
      </div>

      {/* Market Insights */}
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h2 className="mb-6 text-2xl font-bold text-white">Market Insights</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sky-300 mb-2">Most Active County</h3>
              <p className="text-lg font-bold text-white">
                {Object.entries(countyBreakdown).sort(([, a], [, b]) => b - a)[0][0]}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {Object.entries(countyBreakdown).sort(([, a], [, b]) => b - a)[0][1]} properties listed
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-emerald-300 mb-2">Most Common Type</h3>
              <p className="text-lg font-bold text-white">
                {Object.entries(typeBreakdown).sort(([, a], [, b]) => b - a)[0][0]}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {Object.entries(typeBreakdown).sort(([, a], [, b]) => b - a)[0][1]} properties
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-amber-300 mb-2">Highest Price</h3>
              <p className="text-lg font-bold text-white">
                KES {Math.max(...mockListings.map((l) => l.priceNum)).toLocaleString()}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {mockListings.find((l) => l.priceNum === Math.max(...mockListings.map((l) => l.priceNum)))?.title}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-rose-300 mb-2">Lowest Price</h3>
              <p className="text-lg font-bold text-white">
                KES {Math.min(...mockListings.map((l) => l.priceNum)).toLocaleString()}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {mockListings.find((l) => l.priceNum === Math.min(...mockListings.map((l) => l.priceNum)))?.title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MarketplaceStats;
