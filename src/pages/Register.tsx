import { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-soft">
      <h1 className="text-3xl font-semibold text-white">Create your Ardhi Plus account</h1>
      <p className="mt-3 text-slate-400">Register as a land owner, broker, or agent to list houses, homes, and verified property deals.</p>
      <form className="mt-8 space-y-5">
        <label className="block text-sm font-semibold text-slate-200">
          Full name
          <input type="text" placeholder="Your name" className="mt-2 w-full px-4 py-3" name="name" />
        </label>
        <label className="block text-sm font-semibold text-slate-200">
          Email
          <input type="email" placeholder="you@example.com" className="mt-2 w-full px-4 py-3" name="email" />
        </label>
        <label className="block text-sm font-semibold text-slate-200">
          Role
          <select name="role" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-200" defaultValue="">
            <option value="" disabled>Select your role</option>
            <option value="land_owner">Land owner</option>
            <option value="broker">Broker</option>
            <option value="agent">Agent</option>
          </select>
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
        <p className="text-sm text-slate-400">
          Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
        </p>
        <button className="w-full rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
          Register
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-sky-300 hover:text-sky-200">
          Log in
        </Link>
      </p>
    </section>
  );
}

export default Register;
