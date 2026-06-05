import { Link } from 'react-router-dom';

const quickLinks = [
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Help Center', path: '/help-center' },
  { label: 'Report Fraud', path: '/report-fraud' },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 pt-6 pb-2 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Main footer content: 3 columns on desktop, stacked on mobile */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 md:gap-0 pb-4 border-b border-slate-800">
          {/* Logo & Description */}
          <div className="flex-1 min-w-[200px] flex flex-col items-center md:items-start mb-4 md:mb-0">
            <img src="/logo.svg" alt="Ardhi Plus logo" className="h-10 w-10 mb-2" />
            <p className="text-base font-semibold text-white mb-1 text-center md:text-left">Ardhi Plus Properties & Survey</p>
            <p className="text-xs md:text-sm text-center md:text-left max-w-xs">Built for land verification and trusted property transactions.<br className="hidden md:inline"/> Designed to reduce fraud with verified listings and survey transparency.</p>
          </div>
          {/* Quick Links */}
          <div className="flex-1 min-w-[200px] flex flex-col items-center mb-4 md:mb-0">
            <span className="text-sm font-semibold text-white mb-2">Quick Links</span>
            <div className="footer-links flex flex-wrap justify-center gap-4 md:gap-6">
              {quickLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-slate-300 text-sm font-medium px-2 py-1 rounded transition hover:text-sky-300 hover:bg-slate-800"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Contact & Socials */}
          <div className="flex-1 min-w-[200px] flex flex-col items-center md:items-end gap-2">
            <span className="text-sm font-semibold text-white mb-2">Contact</span>
            <a href="mailto:info@ardhiplus.com" className="text-slate-300 text-xs hover:text-sky-300">info@ardhiplus.com</a>
            <span className="text-xs mb-2">Dar es Salaam, Tanzania</span>
            <div className="flex gap-3 mt-1">
              <a href="https://twitter.com/" target="_blank" rel="noopener" aria-label="Twitter" className="hover:text-sky-400">
                {/* ...existing code... */}
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.724-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.239-.616c-.054 2.385 1.693 4.623 4.188 5.117a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg>
              </a>
              <a href="https://facebook.com/" target="_blank" rel="noopener" aria-label="Facebook" className="hover:text-sky-400">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .592 0 1.326v21.348C0 23.408.597 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.408 24 22.674V1.326C24 .592 23.403 0 22.675 0"/></svg>
              </a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn" className="hover:text-sky-400">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20.452h-3.5v-10.5h3.5v10.5zm-1.75-11.75c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2zm15.25 11.75h-3.5v-5.604c0-1.336-.027-3.059-1.865-3.059-1.867 0-2.154 1.459-2.154 2.967v5.696h-3.5v-10.5h3.364v1.433h.049c.469-.888 1.613-1.825 3.322-1.825 3.555 0 4.211 2.341 4.211 5.386v5.506z"/></svg>
              </a>
            </div>
          </div>
        </div>
        {/* Copyright and developer credit */}
        <div className="flex flex-col items-center gap-1 pt-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-300">© {currentYear} Ardhi Plus Properties & Survey. All rights reserved.</span>
          <a
            href="https://bwireglobaltech.com/"
            target="_blank"
            rel="noopener"
            className="text-xs text-slate-500 hover:text-sky-400 mt-0.5"
            style={{ fontWeight: 400, fontSize: '0.82em' }}
          >
            Developed by <span className="underline">Bwire Global Tech</span>
          </a>
          <span className="text-sky-400 mt-1">🏘️ Trusted property marketplace</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
