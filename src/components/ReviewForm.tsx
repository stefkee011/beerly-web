import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../auth';
import type { Review } from '../types';

interface ReviewFormProps {
  beerId: number;
  existing?: Review;
  onSubmitted: () => void;
}

const ratingOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export function ReviewForm({ beerId, existing, onSubmitted }: ReviewFormProps) {
  const { token } = useAuth();
  const [rating, setRating] = useState(existing?.rating ?? 3);
  const [comment, setComment] = useState(existing?.comment ?? '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (!token) {
    return (
      <p className="mt-6 text-neutral-500">
        <Link to="/login" className="text-neutral-300 underline">
          Log in
        </Link>{' '}
        to leave a review.
      </p>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const url = existing
      ? `${API_URL}/api/reviews/${existing.id}`
      : `${API_URL}/api/reviews`;

    try {
      const res = await fetch(url, {
        method: existing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ beerId, rating, comment: comment.trim() || null }),
      });

      if (res.ok) {
        onSubmitted();
      } else if (res.status === 401) {
        setError('Your session expired. Please log in again.');
      } else if (res.status === 409) {
        setError('You have already reviewed this beer.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!existing) return;
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/reviews/${existing.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        onSubmitted();
      } else if (res.status === 401) {
        setError('Your session expired. Please log in again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setSubmitting(false);
      setConfirmingDelete(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl bg-neutral-900 p-5">
      {existing && <p className="text-sm font-medium text-neutral-300">Your review</p>}

      <div className="flex items-center gap-3">
        <label htmlFor="rating" className="text-sm text-neutral-400">
          Rating
        </label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="rounded-lg bg-neutral-800 px-3 py-2 outline-none"
        >
          {ratingOptions.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What did you think? (optional)"
        rows={3}
        className="w-full resize-none rounded-xl bg-neutral-800 px-4 py-3 outline-none ring-1 ring-neutral-700 focus:ring-neutral-500"
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-neutral-100 px-5 py-2.5 font-medium text-neutral-950 transition hover:bg-white disabled:opacity-50"
        >
          {submitting ? 'Saving…' : existing ? 'Update review' : 'Post review'}
        </button>

        {existing &&
          (confirmingDelete ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-neutral-400">Delete your review?</span>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="text-neutral-400 transition hover:text-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-400 transition hover:bg-red-500/10"
            >
              Delete review
            </button>
          ))}
      </div>
    </form>
  );
}