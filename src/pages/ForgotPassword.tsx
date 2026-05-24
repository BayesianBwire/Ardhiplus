import { Link } from 'react-router-dom';

function ForgotPassword() {
  return (
    <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-soft">
      <h1 className="text-3xl font-semibold text-white">Forgot password</h1>
      <p className="mt-3 text-slate-400">Enter your email and we will send you instructions to reset your account password.</p>
      <form action="/api/forgot-password" method="POST" className="mt-8 space-y-5">
        <label className="block text-sm font-semibold text-slate-200">
          Email
          <input type="email" placeholder="you@example.com" className="mt-2 w-full px-4 py-3" name="email" />
        </label>
        <button className="w-full rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
          Send reset link
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

export default ForgotPassword;
