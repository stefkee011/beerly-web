import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../config';
import { CountrySelect } from '../components/CountrySelect';
import type { RankingEntry } from '../types';

type Scope = 'global' | 'local';

function Rankings() {
  const { t } = useTranslation();
  const [scope, setScope] = useState<Scope>('global');
  const [country, setCountry] = useState('');
  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const needsCountry = scope === 'local' && !country;

  useEffect(() => {
    if (needsCountry) return;

    let cancelled = false;
    setLoading(true);
    setFailed(false);

    const path = scope === 'global' ? 'global' : `local/${encodeURIComponent(country)}`;

    fetch(`${API_URL}/api/rankings/${path}`)
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setEntries(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [scope, country, needsCountry]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">{t('rankings.title')}</h1>
      <p className="mt-1 text-neutral-400">{t('rankings.subtitle')}</p>

      <div className="mt-8 flex items-center gap-3">
        <div className="inline-flex rounded-xl bg-neutral-900 p-1 text-sm">
          {(['global', 'local'] as Scope[]).map((option) => (
            <button
              key={option}
              onClick={() => setScope(option)}
              className={`rounded-lg px-4 py-1.5 transition ${
                scope === option
                  ? 'bg-neutral-100 font-medium text-neutral-950'
                  : 'text-neutral-400 hover:text-neutral-100'
              }`}
            >
              {t(`rankings.${option}`)}
            </button>
          ))}
        </div>

        {scope === 'local' && (
          <CountrySelect
            value={country}
            onChange={setCountry}
            placeholder={t('rankings.selectCountry')}
            className="px-4 py-2 text-sm"
          />
        )}
      </div>

      {needsCountry && <p className="mt-8 text-neutral-500">{t('rankings.pickCountry')}</p>}
      {!needsCountry && loading && <p className="mt-8 text-neutral-400">{t('common.loading')}</p>}
      {!needsCountry && failed && <p className="mt-8 text-neutral-400">{t('rankings.failed')}</p>}
      {!needsCountry && !loading && !failed && entries.length === 0 && (
        <p className="mt-8 text-neutral-500">{t('rankings.empty')}</p>
      )}

      {!needsCountry && !loading && !failed && entries.length > 0 && (
        <ol className="mt-8 divide-y divide-neutral-800">
          {entries.map((entry, index) => (
            <li key={entry.username} className="flex items-center gap-4 py-4">
              <span className="w-8 text-lg font-semibold text-neutral-600">{index + 1}</span>
              <span className="flex-1 font-medium">{entry.username}</span>
              <span className="text-sm text-neutral-400">
                {t('beers.beerCount', { count: entry.uniqueBeerCount })}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default Rankings;