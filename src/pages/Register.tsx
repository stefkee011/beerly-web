import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { API_URL } from '../config';
import { useAuth } from '../auth';
import { CountrySelect } from '../components/CountrySelect';

function Register() {
  const { t } = useTranslation();
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
      setError(t('auth.passwordTooShort'));
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
          country: country || null,
        }),
      });

      if (res.ok) {
        await login(username.trim(), password);
        navigate('/');
      } else if (res.status === 400) {
        const message = await res.text();
        setError(message || t('common.somethingWrong'));
      } else {
        setError(t('common.somethingWrong'));
      }
    } catch {
      setError(t('common.serverError'));
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle =
    'w-full rounded-xl bg-neutral-900 px-4 py-3 outline-none ring-1 ring-neutral-800 focus:ring-neutral-600';

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold tracking-tight">{t('auth.registerTitle')}</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t('auth.username')}
          required
          className={inputStyle}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.email')}
          required
          className={inputStyle}
        />
        <CountrySelect
          value={country}
          onChange={setCountry}
          placeholder={t('auth.countryOptional')}
          className="w-full px-4 py-3"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.password')}
          required
          className={inputStyle}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-neutral-100 py-3 font-medium text-neutral-950 transition hover:bg-white disabled:opacity-50"
        >
          {submitting ? t('auth.creating') : t('auth.createAccount')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        <Trans
          i18nKey="auth.haveAccount"
          components={{ loginLink: <Link to="/login" className="text-neutral-300 underline" /> }}
        />
      </p>
    </div>
  );
}

export default Register;