"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { photosUrl, PHOTOS_PAGE_SIZE } from "@/lib/api";

function photoKey(photo) {
  return String(photo.uniqueID || photo._id || "");
}

function fileKey(photo) {
  const id = photo.fileId;
  if (id == null) return "";
  return typeof id === "object" ? String(id.$oid || id) : String(id);
}

function dedupeAll(photos) {
  const seenIds = new Set();
  const seenFileIds = new Set();
  const out = [];

  for (const p of photos) {
    const id = photoKey(p);
    const fid = fileKey(p);
    if (!id) continue;
    if (seenIds.has(id) || (fid && seenFileIds.has(fid))) continue;
    seenIds.add(id);
    if (fid) seenFileIds.add(fid);
    out.push(p);
  }

  return out;
}

function mergePhotos(prev, incoming, reset) {
  return dedupeAll(reset ? incoming : [...prev, ...incoming]);
}

export function usePhotos({ refreshKey = 0, searchQuery = "" } = {}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const cursorRef = useRef(null);
  const generationRef = useRef(0);
  const inFlightRef = useRef(false);
  const imagesRef = useRef([]);
  const sentinelRef = useRef(null);

  imagesRef.current = images;

  const fetchPage = useCallback(
    async (reset) => {
      const gen = generationRef.current;

      if (reset) {
        cursorRef.current = null;
        setLoading(true);
        setLoadingMore(false);
        setError(null);
        setHasMore(true);
      } else {
        if (inFlightRef.current) return;
        setLoadingMore(true);
      }

      inFlightRef.current = true;

      const params = { limit: String(PHOTOS_PAGE_SIZE) };
      if (cursorRef.current) {
        params.cursor = cursorRef.current;
      }
      const trimmed = searchQuery.trim();
      if (trimmed) {
        params.q = trimmed;
      }

      try {
        const response = await fetch(photosUrl(params), {
          credentials: "omit",
          cache: "no-store",
        });

        if (gen !== generationRef.current) return;

        if (!response.ok) {
          throw new Error(`Failed to fetch photos (${response.status})`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid photos response");
        }

        if (gen !== generationRef.current) return;

        const prevLen = reset ? 0 : imagesRef.current.length;
        const next = mergePhotos(reset ? [] : imagesRef.current, data, reset);
        const addedCount = next.length - prevLen;

        setImages(next);

        if (data.length > 0) {
          cursorRef.current = String(data[data.length - 1]._id);
        }

        const pageFull = data.length === PHOTOS_PAGE_SIZE;
        setHasMore(pageFull && (reset ? data.length > 0 : addedCount > 0));
      } catch (err) {
        if (gen !== generationRef.current) return;
        console.error("Error fetching photos:", err);
        setError(err.message);
        setHasMore(false);
      } finally {
        if (gen === generationRef.current) {
          inFlightRef.current = false;
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [searchQuery],
  );

  const loadMore = useCallback(() => {
    if (inFlightRef.current || loading || loadingMore || !hasMore) return;
    fetchPage(false);
  }, [loading, loadingMore, hasMore, fetchPage]);

  useEffect(() => {
    generationRef.current += 1;
    inFlightRef.current = false;
    cursorRef.current = null;
    setImages([]);
    setError(null);
    fetchPage(true);
  }, [refreshKey, searchQuery, fetchPage]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || loading || loadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        loadMore();
      },
      { rootMargin: "300px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loading, loadingMore, hasMore, images.length, loadMore]);

  return {
    images,
    loading,
    loadingMore,
    hasMore,
    error,
    sentinelRef,
    searchQuery: searchQuery.trim(),
  };
}
