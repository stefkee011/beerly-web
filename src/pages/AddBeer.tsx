import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { API_URL } from '../config';
import { useAuth } from '../auth';
import { CountrySelect } from '../components/CountrySelect';

const inputStyle =
  'w-full rounded-xl bg-neutral-900 px-4 py-3 outline-none ring-1 ring-neutral-800 focus:ring-neutral-600';
const labelStyle = 'mb-1.5 block text-xs uppercase tracking-wide text-neutral-500';

function AddBeer() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [brewery, setBrewery] = useState('');
  const [style, setStyle] = useState('');
  const [abv, setAbv] = useState('');
  const [country, setCountry] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFailed, setImageFailed] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!token) {
    return (
      <p className="text-neutral-500">
        <Trans
          i18nKey="addBeer.loginPrompt"
          components={{ loginLink: <Link to="/login" className="text-neutral-300 underline" /> }}
        />
      </p>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!country) {
      setError(t('addBeer.invalid'));
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/beers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          brewery: brewery.trim(),
          style: style.trim(),
          abvPercentage: Number(abv),
          country,
          imageUrl: imageUrl.trim(),
        }),
      });

      if (res.status === 201) {
        const beer = await res.json();
        navigate(`/beers/${beer.id}`);
      } else if (res.status === 401) {
        setError(t('common.sessionExpired'));
      } else if (res.status === 409) {
        setError(t('addBeer.duplicate'));
      } else if (res.status === 400) {
        setError(t('addBeer.invalid'));
      } else {
        setError(t('common.somethingWrong'));
      }
    } catch {
      setError(t('common.serverError'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold tracking-tight">{t('addBeer.title')}</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className={labelStyle}>{t('addBeer.name')}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className={inputStyle} />
        </div>

        <div>
          <label className={labelStyle}>{t('addBeer.brewery')}</label>
          <input value={brewery} onChange={(e) => setBrewery(e.target.value)} required className={inputStyle} />
        </div>

        <div>
          <label className={labelStyle}>{t('addBeer.style')}</label>
          <input value={style} onChange={(e) => setStyle(e.target.value)} required className={inputStyle} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelStyle}>{t('addBeer.abv')}</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="100"
              value={abv}
              onChange={(e) => setAbv(e.target.value)}
              required
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>{t('addBeer.country')}</label>
            <CountrySelect
              value={country}
              onChange={setCountry}
              placeholder="—"
              className="w-full px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className={labelStyle}>{t('addBeer.imageUrl')}</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImageFailed(false);
            }}
            required
            className={inputStyle}
          />

          {imageUrl.trim() && (
            <div className="mt-3 flex size-48 items-center justify-center rounded-2xl bg-neutral-900 p-4">
              {imageFailed ? (
                <span className="text-center text-sm text-neutral-600">{t('addBeer.imageFailed')}</span>
              ) : (
                <img
                  src={imageUrl.trim()}
                  alt=""
                  onError={() => setImageFailed(true)}
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-neutral-100 py-3 font-medium text-neutral-950 transition hover:bg-white disabled:opacity-50"
        >
          {submitting ? t('addBeer.submitting') : t('addBeer.submit')}
        </button>
      </form>
    </div>
  );
}

export default AddBeer;