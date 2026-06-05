import VerificationCenter from '../components/VerificationCenter';
import DataExportActions from '../components/DataExportActions';

export default function Verification() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Verification</h1>
        <p className="mt-3 text-slate-400">Monitor property verification, document uploads, and compliance checks.</p>
      </div>
      <DataExportActions />
      <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <VerificationCenter />
      </div>
    </section>
  );
}
