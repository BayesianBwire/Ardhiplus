export default function DownloadReports() {
  return (
    <section className="my-16 rounded-[2rem] border border-gold-400/40 bg-slate-900/90 p-8 shadow-soft max-w-2xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-bold text-gold-400 mb-2">Download Property & Survey Reports</h2>
      <p className="text-base md:text-lg text-slate-200 mb-4 text-center max-w-2xl">
        Access downloadable PDF reports for property details, survey results, and verification certificates. Stay informed and keep a record of every transaction.
      </p>
      <button
        className="bg-gold-400 hover:bg-gold-500 text-slate-950 font-semibold px-6 py-3 rounded-full shadow transition text-lg disabled:opacity-60"
        disabled
        title="Coming soon!"
      >
        Download Report (Coming Soon)
      </button>
    </section>
  );
}
