import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../config';
import type { Beer } from '../types';

function BeerDetail() {
  const { id } = useParams();
  const [beer, setBeer] = useState<Beer | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/beers/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      })
      .then(setBeer)
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-neutral-400">Loading...</p>;
  if (failed || !beer) return <p className="text-neutral-400">Couldn't find this beer.</p>;

  return (
    <div>
      <Link to="/" className="text-sm text-neutral-400 hover:text-neutral-100">
        ← Back
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-neutral-900 p-10">
          <img src={beer.imageUrl} alt={beer.name} className="max-h-full max-w-full object-contain" />
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{beer.name}</h1>
          <p className="mt-1 text-neutral-400">{beer.brewery}</p>

          <dl className="mt-8 space-y-4">
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">Style</dt>
              <dd>{beer.style}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">Country</dt>
              <dd>{beer.country}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">ABV</dt>
              <dd>{beer.abvPercentage}%</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default BeerDetail;