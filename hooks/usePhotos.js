"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { photosUrl, PHOTOS_PAGE_SIZE } from "@/lib/api";

function photoKey(photo) {
  return photo.uniqueID || String(photo._id);
}

function dedupePhotos(prev, incoming) {
  const seenIds = new Set(prev.map((p) => photoKey(p)));
  const seenFileIds = new Set(prev.map((p) => String(p.fileId)));
  const unique = incoming.filter((p) => {
    const id = photoKey(p);
    const fid = String(p.fileId);
    if (seenIds.has(id) || seenFileIds.has(fid)) return false;
    seenIds.add(id);
    seenFileIds.add(fid);
    return true;
  });
  return [...prev, ...unique];
}

export function usePhotos({ refreshKey = 0, searchQuery = "" } = {}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const cursorRef = useRef(null);
  const fetchingRef = useRef(false);
  const abortRef = useRef(null);
  const loadMoreNodeRef = useRef(null);
  const observerRef = useRef(null);

  const fetchPage = useCallback(async ({ reset = false } = {}) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    if (reset) {
      cursorRef.current = null;
      setHasMore(true);
      setError(null);
      setLoading(true);
      setLoadingMore(false);
    } else {
      setLoadingMore(true);
    }

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
        signal: controller.signal,
        credentials: "omit",
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch photos (${response.status})`);
      }
      const data = await response.json();

      if (controller.signal.aborted) return;

      let hasMoreNext = data.length === PHOTOS_PAGE_SIZE;
      setImages((prev) => {
        if (reset) return data;
        const next = dedupePhotos(prev, data);
        if (next.length === prev.length && data.length > 0) {
          hasMoreNext = false;
        }
        return next;
      });
      setHasMore(hasMoreNext);

      if (data.length > 0) {
        const last = data[data.length - 1];
        cursorRef.current = String(last._id);
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Error fetching photos:", err);
      setError(err.message);
    } finally {
      fetchingRef.current = false;
      if (!controller.signal.aborted) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [searchQuery]);

  const loadMore = useCallback(() => {
    if (!hasMore || fetchingRef.current || loading || loadingMore) return;
    fetchPage({ reset: false });
  }, [hasMore, loading, loadingMore, fetchPage]);

  // Reset and fetch when refresh or search changes
  useEffect(() => {
    setImages([]);
    cursorRef.current = null;
    fetchingRef.current = false;
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    fetchPage({ reset: true });
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [refreshKey, searchQuery, fetchPage]);

  // IntersectionObserver for infinite scroll
  const setLoadMoreRef = useCallback(
    (node) => {
      loadMoreNodeRef.current = node;
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!node || loading || loadingMore || !hasMore) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            observerRef.current?.disconnect();
            observerRef.current = null;
            loadMore();
          }
        },
        { rootMargin: "400px" },
      );
      observerRef.current.observe(node);
    },
    [loading, loadingMore, hasMore, loadMore],
  );

  // Re-attach observer after a load completes
  useEffect(() => {
    const node = loadMoreNodeRef.current;
    if (!node || loading || loadingMore || !hasMore) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observerRef.current?.disconnect();
          observerRef.current = null;
          loadMore();
        }
      },
      { rootMargin: "400px" },
    );
    observerRef.current.observe(node);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading, loadingMore, hasMore, images.length, loadMore]);

  return {
    images,
    loading,
    loadingMore,
    hasMore,
    error,
    setLoadMoreRef,
    searchQuery: searchQuery.trim(),
  };
}
