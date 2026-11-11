import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../config';
import type { Beer, Review } from '../types';

function BeerDetail() {
  const { id } = useParams();
  const [beer, setBeer] = useState<Beer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
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

  useEffect(() => {
    fetch(`${API_URL}/api/reviews/by-beer/${id}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [id]);

  if (loading) return <p className="text-neutral-400">Loading...</p>;
  if (failed || !beer) return <p className="text-neutral-400">Couldn't find this beer.</p>;

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

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

          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-4xl font-semibold">
              {average !== null ? average.toFixed(1) : '–'}
            </span>
            <span className="text-sm text-neutral-500">
              {reviews.length === 1 ? '1 review' : `${reviews.length} reviews`}
            </span>
          </div>

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

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight">Reviews</h2>

        {reviews.length === 0 && (
          <p className="mt-4 text-neutral-500">No reviews yet.</p>
        )}

        <ul className="mt-6 divide-y divide-neutral-800">
          {reviews.map((review) => (
            <li key={review.id} className="py-5">
              <div className="flex items-baseline justify-between">
                <span className="font-medium">{review.username}</span>
                <span className="text-sm text-neutral-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-400">{review.rating} / 5</p>
              {review.comment && <p className="mt-2 text-neutral-300">{review.comment}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default BeerDetail;