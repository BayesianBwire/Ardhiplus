import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

function VerifyEmail() {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('Verifying your email...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }
    fetch(`/api/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (res.ok) {
          setStatus('success');
          setMessage('Your email has been verified! You can now log in.');
          // Optionally, fetch user info here if you have auth context
          // setTimeout(() => navigate('/login'), 3000);
        } else {
          const data = await res.json().catch(() => ({}));
          setStatus('error');
          setMessage(data.message || 'Verification failed. The link may have expired or is invalid.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Network error. Please try again later.');
      });
  }, [location, navigate]);

  return (
    <section className="mx-auto max-w-lg rounded-[2rem] border border-slate-800 bg-slate-900/90 p-10 shadow-soft mt-16 text-center">
      <h1 className="text-3xl font-semibold text-white mb-4">Email Verification</h1>
      <p className={`mb-6 ${status === 'success' ? 'text-green-400' : status === 'error' ? 'text-rose-400' : 'text-slate-300'}`}>{message}</p>
      {status === 'success' && (
        <Link to="/login" className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">Go to Login</Link>
      )}
      {status === 'error' && (
        <Link to="/register" className="rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-rose-400">Register Again</Link>
      )}
    </section>
  );
}

export default VerifyEmail;
