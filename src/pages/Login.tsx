import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-soft">
      <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
      <p className="mt-3 text-slate-400">Log in to manage your property listings, survey requests, and dashboard actions.</p>
      <form className="mt-8 space-y-5">
        <label className="block text-sm font-semibold text-slate-200">
          Email
          <input type="email" placeholder="you@example.com" className="mt-2 w-full px-4 py-3" name="email" />
        </label>
        <label className="block text-sm font-semibold text-slate-200">
          Password
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full bg-transparent outline-none"
              name="password"
            />
            <button
              type="button"
              className="text-sky-300 hover:text-sky-200"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>
        <button className="w-full rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
          Login
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-slate-400">
        <Link to="/forgot-password" className="text-sky-300 hover:text-sky-200">
          Forgot password?
        </Link>
      </div>
      <p className="mt-6 text-center text-sm text-slate-400">
        Don’t have an account?{' '}
        <Link to="/register" className="text-sky-300 hover:text-sky-200">
          Register now
        </Link>
      </p>
    </section>
  );
}

export default Login;
