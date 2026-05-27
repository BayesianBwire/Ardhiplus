import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Main footer content */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between mb-8 pb-8 border-b border-slate-800">
          <div>
            <p className="text-base font-semibold text-white mb-2">Ardhi Plus Properties & Survey</p>
            <p className="text-sm">Built for land verification and trusted property transactions.</p>
            <p className="text-sm mt-2">Designed to reduce fraud with verified listings and survey transparency.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/faq" className="text-slate-300 transition hover:text-sky-300">
              FAQ
            </Link>
            <Link to="/privacy" className="text-slate-300 transition hover:text-sky-300">
              Privacy & Terms
            </Link>
            <Link to="/post-property" className="text-slate-300 transition hover:text-sky-300">
              Post property
            </Link>
          </div>
        </div>
        {/* Copyright bar */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-300">© {currentYear} Ardhi Plus Properties & Survey. All rights reserved.</p>
            <p className="mt-2">Developed by Bwire Global Tech.</p>
          </div>
          <p className="text-sky-400">🏘️ Trusted property marketplace</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
