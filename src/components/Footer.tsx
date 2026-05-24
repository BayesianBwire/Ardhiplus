import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 text-sm sm:px-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p>© 2026 Ardhi Plus Properties & Survey. Built for land verification and trusted property transactions.</p>
          <p>Designed to reduce fraud with verified listings and survey transparency.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/faq" className="text-slate-300 transition hover:text-white">
            FAQ
          </Link>
          <Link to="/privacy" className="text-slate-300 transition hover:text-white">
            Privacy & Terms
          </Link>
          <Link to="/post-property" className="text-slate-300 transition hover:text-white">
            Post property
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
