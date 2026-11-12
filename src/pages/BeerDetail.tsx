import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../config';
import { countryName } from '../countries';
import { useAuth } from '../auth';
import { ReviewForm } from '../components/ReviewForm';
import type { Beer, Review } from '../types';

function BeerDetail() {
  const { id } = useParams();
  const { username } = useAuth();
  const { t, i18n } = useTranslation();
  const [beer, setBeer] = useState<Beer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsVersion, setReviewsVersion] = useState(0);
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
  }, [id, reviewsVersion]);

  if (loading) return <p className="text-neutral-400">{t('common.loading')}</p>;
  if (failed || !beer) return <p className="text-neutral-400">{t('beers.notFound')}</p>;

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  const myReview = reviews.find((r) => r.username === username);

  return (
    <div>
      <Link to="/" className="text-sm text-neutral-400 hover:text-neutral-100">
        {t('common.back')}
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-neutral-900 p-10">
          {beer.imageUrl ? (
            <img src={beer.imageUrl} alt={beer.name} className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-sm text-neutral-600">{t('beers.noImage')}</span>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{beer.name}</h1>
          <p className="mt-1 text-neutral-400">{beer.brewery}</p>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-4xl font-semibold">
              {average !== null ? average.toFixed(1) : '–'}
            </span>
            <span className="text-sm text-neutral-500">
              {t('beers.reviewCount', { count: reviews.length })}
            </span>
          </div>

          <dl className="mt-8 space-y-4">
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">{t('beers.style')}</dt>
              <dd>{beer.style}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">{t('beers.country')}</dt>
              <dd>{countryName(beer.country, i18n.resolvedLanguage ?? 'en')}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">{t('beers.abv')}</dt>
              <dd>{beer.abvPercentage}%</dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight">{t('beers.reviews')}</h2>

        <ReviewForm
          key={myReview?.id ?? 'new'}
          beerId={beer.id}
          existing={myReview}
          onSubmitted={() => setReviewsVersion((v) => v + 1)}
        />

        {reviews.length === 0 && (
          <p className="mt-8 text-neutral-500">{t('beers.noReviews')}</p>
        )}

        <ul className="mt-8 divide-y divide-neutral-800">
          {reviews.map((review) => (
            <li key={review.id} className="py-5">
              <div className="flex items-baseline justify-between">
                <span className="font-medium">{review.username}</span>
                <span className="text-sm text-neutral-500">
                  {new Date(review.createdAt).toLocaleDateString(i18n.resolvedLanguage)}
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