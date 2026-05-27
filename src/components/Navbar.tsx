import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Listings', path: '/listings' },
  { label: 'Agents', path: '/agents' },
  { label: 'Services', path: '/services' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'FAQ', path: '/faq' },
];

function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-sky-300">
          <img src="/logo.svg" alt="Ardhi Plus logo" className="h-10 w-10" />
          Ardhi Plus
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-sky-300' : 'text-slate-300 hover:text-white'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/favorites"
            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-rose-400 hover:text-rose-400"
            title="View favorites"
          >
            ❤️ Favorites
          </Link>
          <Link
            to="/post-property"
            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400 hover:text-white"
          >
            Post property
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400 hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-sky-400"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
