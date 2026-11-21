import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { imageSrc } from '../images';
import { Link, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { API_URL } from '../config';
import { useAuth } from '../auth';
import { CountrySelect } from '../components/CountrySelect';

const inputStyle =
  'w-full rounded-xl bg-neutral-900 px-4 py-3 outline-none ring-1 ring-neutral-800 focus:ring-neutral-600';
const labelStyle = 'mb-1.5 block text-xs uppercase tracking-wide text-neutral-500';

const rejectMessages: Record<string, string> = {
  not_beer: 'addBeer.notBeer',
  person: 'addBeer.person',
  watermark: 'addBeer.watermark',
  poor_quality: 'addBeer.poorQuality',
};

function AddBeer() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [brewery, setBrewery] = useState('');
  const [style, setStyle] = useState('');
  const [abv, setAbv] = useState('');
  const [country, setCountry] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');
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

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError('');
    setUploading(true);

      try {
        const body = new FormData();
        body.append('file', file);

      const res = await fetch(`${API_URL}/api/images`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      if (res.ok) {
        const data = await res.json();
        setImagePath(data.imageUrl);
      } else if (res.status === 401) {
        setPhotoError(t('common.sessionExpired'));
      } else if (res.status === 422) {
        const data = await res.json().catch(() => null);
        setPhotoError(t(rejectMessages[data?.code] ?? 'addBeer.photoRejected'));
      } else if (res.status === 400) {
        const data = await res.json().catch(() => null);
        setPhotoError(
          data?.code === 'too_small'
            ? t('addBeer.tooSmall', { min: data.min })
            : t('addBeer.photoRejected'),
        );
      } else if (res.status === 429) {
        setPhotoError(t('addBeer.tooManyUploads'));
      } else if (res.status === 503) {
        setPhotoError(t('addBeer.unavailable'));
      } else {
        setPhotoError(t('addBeer.photoRejected'));
      }
    } catch {
      setPhotoError(t('common.serverError'));
    } finally {
      setUploading(false);
      e.target.value = ''; 
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!country || !imagePath) {
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
          imageUrl: imagePath,
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
            <label className={labelStyle}>{t('addBeer.photo')}</label>

            <label className="flex size-48 cursor-pointer items-center justify-center rounded-2xl bg-neutral-900 p-4 ring-1 ring-neutral-800 transition hover:bg-neutral-800">
                {imagePath ? (
                    <img src={imageSrc(imagePath)} alt="" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-center text-sm text-neutral-500">
                    {uploading ? t('addBeer.uploading') : t('addBeer.choosePhoto')}
                  </span>
                )}
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFile}
                    disabled={uploading}
                    className="hidden"
                />
            </label>

            {photoError && <p className="mt-2 text-sm text-red-400">{photoError}</p>}
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