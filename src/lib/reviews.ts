// src/lib/reviews.ts

export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.floor((now - then) / 1000); // seconds

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} d ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)} wk ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} mo ago`;
  return `${Math.floor(diff / 31536000)} yr ago`;
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/** Deterministic pastel color from user name (for avatar backgrounds) */
export function avatarColor(name: string): string {
  const palette = [
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-blue-500 to-cyan-500',
    'from-violet-500 to-fuchsia-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return palette[Math.abs(hash) % palette.length];
}

export interface RatingBreakdown {
  total: number;
  average: number;
  counts: { stars: number; count: number }[]; // 5→1
}

export function getRatingBreakdown(
  reviews: { rating: number }[]
): RatingBreakdown {
  const counts = [0, 0, 0, 0, 0]; // index 4 = 5 stars
  let sum = 0;
  for (const r of reviews) {
    const i = Math.min(5, Math.max(1, Math.round(r.rating))) - 1;
    counts[i]++;
    sum += r.rating;
  }
  const total = reviews.length;
  return {
    total,
    average: total > 0 ? sum / total : 0,
    counts: [5, 4, 3, 2, 1].map((stars, i) => ({
      stars,
      count: counts[4 - i],
    })),
  };
}