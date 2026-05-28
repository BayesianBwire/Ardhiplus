export default function InstallmentSales() {
  return (
    <section className="my-16 rounded-[2rem] border border-emerald-500/40 bg-slate-900/90 p-8 shadow-soft max-w-3xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-2">Installment Property Sales</h2>
      <p className="text-base md:text-lg text-slate-200 mb-4 text-center max-w-2xl">
        Buy land or property with flexible payment plans. Secure your investment and pay in manageable installments, verified by Ardhi Plus.
      </p>
      <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
        <li>Low deposit required</li>
        <li>Flexible monthly payments</li>
        <li>Transparent contracts</li>
        <li>Admin support throughout the process</li>
      </ul>
      <a
        href="/listings?installment=true"
        className="bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-semibold px-6 py-3 rounded-full shadow transition text-lg"
      >
        View Installment Listings
      </a>
    </section>
  );
}
