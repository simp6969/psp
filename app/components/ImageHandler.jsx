"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { ImageDetailsPopup } from "./ImageDetailsPopup";

// Skeleton placeholder that matches the masonry layout
function SkeletonGrid() {
  // Varying heights to mimic the masonry look
  const heights = [192, 256, 224, 176, 240, 200, 260, 208, 180, 230, 196, 244];
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-5 p-5 max-w-[1800px] mx-auto">
      {heights.map((h, i) => (
        <div
          key={i}
          className="mb-5 break-inside-avoid rounded-lg bg-muted animate-pulse"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

function PhotoCard({ photo, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const src = `https://photo-share-backend-production.up.railway.app/api/image/${photo.fileId}`;
  const alt = photo.filename || "Uploaded photo";

  return (
    <div
      className="relative mb-5 break-inside-avoid group cursor-pointer"
      onClick={() => onClick(photo)}
    >
      {/* Skeleton placeholder while loading */}
      {!loaded && (
        <div className="w-full h-48 rounded-lg bg-muted animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        sizes="(max-width: 768px) 100dvw, (max-width: 1200px) 50dvw, 33dvw"
        unoptimized
        className={`w-full h-auto object-cover rounded-lg transition-all duration-300 group-hover:brightness-90 group-hover:shadow-lg ${loaded ? "opacity-100" : "opacity-0 absolute top-0 left-0"
          }`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export function ImageHandler({ refreshKey }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const observer = useRef();

  const loadMoreRef = useCallback((node) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }, { rootMargin: '200px' });

    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  const fetchPhotos = useCallback(async (currentPage, isInitial) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetch(`https://photo-share-backend-production.up.railway.app/api/photos?page=${currentPage}&limit=10`, { credentials: "omit" });
      const data = await response.json();

      setImages((prev) => isInitial ? data : [...prev, ...data]);
      setHasMore(data.length === 10);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      if (isInitial) setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchPhotos(1, true);
  }, [refreshKey, fetchPhotos]);

  useEffect(() => {
    if (page > 1) {
      fetchPhotos(page, false);
    }
  }, [page, fetchPhotos]);

  if (loading) {
    return <SkeletonGrid />;
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
        <svg
          className="w-12 h-12 opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm">No photos yet. Be the first to upload one!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-5 p-5 max-w-[1800px] mx-auto w-full">
        {images.map((photo) => (
          <PhotoCard
            key={photo.uniqueID || photo._id}
            photo={photo}
            onClick={setSelectedPhoto}
          />
        ))}
      </div>

      {/* Sentinel for IntersectionObserver */}
      <div ref={loadMoreRef} className="h-4 w-full" />

      {loadingMore && (
        <div className="py-8 w-full flex justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-muted-foreground/30 border-t-primary animate-spin"></div>
        </div>
      )}

      {/* Reusable Popup Component */}
      <ImageDetailsPopup
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  );
}
