import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const ok = await login(username, password);
    if (ok) {
      navigate('/');
    } else {
      setError('Invalid username or password.');
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full rounded-xl bg-neutral-900 px-4 py-3 outline-none ring-1 ring-neutral-800 focus:ring-neutral-600"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-xl bg-neutral-900 px-4 py-3 outline-none ring-1 ring-neutral-800 focus:ring-neutral-600"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-xl bg-neutral-100 py-3 font-medium text-neutral-950 transition hover:bg-white"
        >
          Log in
        </button>
      </form>
    </div>
  );
}

export default Login;