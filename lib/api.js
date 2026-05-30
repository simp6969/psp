/** Relative /api paths use next.config rewrites to the Vercel backend. */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export function imageUrl(fileId) {
  return `${API_BASE}/api/image/${fileId}`;
}

export function photosUrl(params) {
  const search = new URLSearchParams(params);
  return `${API_BASE}/api/photos?${search.toString()}`;
}

export const PHOTOS_PAGE_SIZE = 24;
