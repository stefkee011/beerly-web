import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../config';
import { countryName } from '../countries';
import type { Beer } from '../types';

function BeerList() {
  const { t, i18n } = useTranslation();
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/beers`)
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      })
      .then(setBeers)
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {loading && <p className="text-neutral-400">{t('common.loading')}</p>}
      {failed && <p className="text-neutral-400">{t('common.serverError')}</p>}

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {beers.map((beer) => (
          <Link
            key={beer.id}
            to={`/beers/${beer.id}`}
            className="overflow-hidden rounded-2xl bg-neutral-900 transition hover:bg-neutral-800"
          >
            <div className="flex aspect-square items-center justify-center bg-neutral-800 p-6">
              {beer.imageUrl ? (
                <img src={beer.imageUrl} alt={beer.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-sm text-neutral-600">{t('beers.noImage')}</span>
              )}
            </div>
            <div className="p-4">
              <h2 className="truncate font-medium">{beer.name}</h2>
              <p className="truncate text-sm text-neutral-400">{beer.brewery}</p>
              <p className="mt-1 text-xs text-neutral-500">
                {beer.style} · {countryName(beer.country, i18n.resolvedLanguage ?? 'en')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default BeerList;