/** Relative /api paths use next.config rewrites to the Vercel backend. */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

/** Max column width ~360px × 2 for retina */
export const THUMB_WIDTH = 480;
export const THUMB_QUALITY = 68;

export function imageUrl(fileId) {
  return `${API_BASE}/api/image/${fileId}`;
}

export function thumbnailUrl(fileId, width = THUMB_WIDTH) {
  const params = new URLSearchParams({
    w: String(width),
    q: String(THUMB_QUALITY),
  });
  return `${API_BASE}/api/image/${fileId}?${params.toString()}`;
}

export function photosUrl(params) {
  const search = new URLSearchParams(params);
  return `${API_BASE}/api/photos?${search.toString()}`;
}

export const PHOTOS_PAGE_SIZE = 24;
