import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../auth';

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
          country: country.trim() || null,
        }),
      });

      if (res.ok) {
        await login(username.trim(), password);
        navigate('/');
      } else if (res.status === 400) {
        const message = await res.text();
        setError(message || 'Please check your details.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle =
    'w-full rounded-xl bg-neutral-900 px-4 py-3 outline-none ring-1 ring-neutral-800 focus:ring-neutral-600';

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className={inputStyle}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className={inputStyle}
        />
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country (optional)"
          className={inputStyle}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className={inputStyle}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-neutral-100 py-3 font-medium text-neutral-950 transition hover:bg-white disabled:opacity-50"
        >
          {submitting ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <Link to="/login" className="text-neutral-300 underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default Register;