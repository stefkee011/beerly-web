import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../config';
import { countryName } from '../countries';
import { imageSrc } from '../images';
import type { Beer } from '../types';

const PAGE_SIZE = 24;

interface BeerPage {
  items: Beer[];
  total: number;
}

async function fetchBeers(search: string, page: number): Promise<BeerPage> {
  const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
  if (search) params.set('search', search);

  const res = await fetch(`${API_URL}/api/beers?${params}`);
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

function BeerList() {
  const { t, i18n } = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [beers, setBeers] = useState<Beer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [failed, setFailed] = useState(false);

  
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);

    fetchBeers(search, 1)
      .then((data) => {
        if (cancelled) return;
        setBeers(data.items);
        setTotal(data.total);
        setPage(1);
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
  }, [search]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const data = await fetchBeers(search, page + 1);
      setBeers((current) => [...current, ...data.items]);
      setTotal(data.total);
      setPage(page + 1);
    } catch {
      setFailed(true);
    } finally {
      setLoadingMore(false);
    }
  }

  const language = i18n.resolvedLanguage ?? 'en';

  return (
    <>
      <input
        type="search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder={t('beers.search')}
        aria-label={t('beers.search')}
        className="mb-8 w-full rounded-xl bg-neutral-900 px-4 py-3 text-base outline-none ring-1 ring-neutral-800 focus:ring-neutral-600 sm:max-w-sm"
      />

      {loading && beers.length === 0 && <p className="text-neutral-400">{t('common.loading')}</p>}
      {failed && <p className="text-neutral-400">{t('common.serverError')}</p>}
      {!loading && !failed && beers.length === 0 && (
        <p className="text-neutral-500">{search ? t('beers.noResults') : t('beers.noBeers')}</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {beers.map((beer) => (
          <Link
            key={beer.id}
            to={`/beers/${beer.id}`}
            className="overflow-hidden rounded-2xl bg-neutral-900 transition hover:bg-neutral-800"
          >
            <div className="flex aspect-square items-center justify-center bg-neutral-800 p-6">
              {beer.imageUrl ? (
                <img
                  src={imageSrc(beer.imageUrl)}
                  alt={beer.name}
                  loading="lazy"
                  decoding="async"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-sm text-neutral-600">{t('beers.noImage')}</span>
              )}
            </div>
            <div className="p-4">
              <h2 className="truncate font-medium">{beer.name}</h2>
              <p className="truncate text-sm text-neutral-400">{beer.brewery}</p>
              <p className="mt-1 text-xs text-neutral-500">
                {beer.style} · {countryName(beer.country, language)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {beers.length < total && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-xl bg-neutral-900 px-6 py-3 text-sm text-neutral-300 ring-1 ring-neutral-800 transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {loadingMore ? t('common.loading') : t('beers.loadMore')}
          </button>
        </div>
      )}
    </>
  );
}

export default BeerList;