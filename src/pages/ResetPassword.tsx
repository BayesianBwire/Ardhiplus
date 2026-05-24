import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const searchParams = new URLSearchParams(useLocation().search);
  const token = searchParams.get('token') || '';

  return (
    <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-soft">
      <h1 className="text-3xl font-semibold text-white">Reset password</h1>
      <p className="mt-3 text-slate-400">Enter a new secure password for your Ardhi Plus account.</p>
      <form className="mt-8 space-y-5" action="/api/reset-password" method="POST">
        <input type="hidden" name="token" value={token} />
        <label className="block text-sm font-semibold text-slate-200">
          New password
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full bg-transparent outline-none"
              name="new_password"
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
        <label className="block text-sm font-semibold text-slate-200">
          Confirm password
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full bg-transparent outline-none"
              name="confirm_password"
            />
            <button
              type="button"
              className="text-sky-300 hover:text-sky-200"
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              {showConfirm ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>
        <p className="text-sm text-slate-400">
          Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
        </p>
        <button className="w-full rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
          Save new password
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Remembered your password?{' '}
        <Link to="/login" className="text-sky-300 hover:text-sky-200">
          Log in
        </Link>
      </p>
    </section>
  );
}

export default ResetPassword;
