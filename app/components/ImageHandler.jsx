"use client";

import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { imageUrl, thumbnailUrl } from "@/lib/api";
import { usePhotos } from "@/hooks/usePhotos";
import { ImageDetailsPopup } from "./ImageDetailsPopup";

const SKELETON_HEIGHTS = [192, 256, 224, 176, 240, 200, 260, 208, 180, 230, 196, 244];

function cardKey(photo) {
  const fid = photo.fileId;
  const fileId =
    fid == null ? "" : typeof fid === "object" ? String(fid.$oid || fid) : String(fid);
  return `${photo._id}-${fileId}`;
}

function SkeletonGrid() {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-5 p-5 max-w-[1800px] mx-auto w-full">
      {SKELETON_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="mb-5 break-inside-avoid rounded-lg border border-border bg-muted animate-pulse"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

function PhotoCard({ photo, onClick, priority = false }) {
  const [status, setStatus] = useState("loading");
  const [useFullRes, setUseFullRes] = useState(false);
  const src = useFullRes ? imageUrl(photo.fileId) : thumbnailUrl(photo.fileId);
  const alt = photo.filename || "Uploaded photo";

  useEffect(() => {
    setStatus("loading");
    setUseFullRes(false);
  }, [photo.fileId]);

  const handleError = () => {
    if (!useFullRes) {
      setUseFullRes(true);
      setStatus("loading");
      return;
    }
    setStatus("error");
  };

  return (
    <figure className="mb-5 break-inside-avoid rounded-lg border border-border overflow-hidden bg-muted/30 isolate shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => onClick(photo)}
        className="relative block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`View ${alt}`}
      >
        <div className="relative w-full min-h-[80px] bg-muted">
          {status === "loading" && (
            <div
              className="absolute inset-0 z-10 min-h-[120px] bg-muted animate-pulse"
              aria-hidden
            />
          )}

          {status === "error" && (
            <div className="absolute inset-0 z-10 flex min-h-[120px] flex-col items-center justify-center gap-2 px-4 text-center text-muted-foreground bg-muted">
              <ImageOff className="size-8 opacity-50" aria-hidden />
              <span className="text-xs leading-snug">Tap to view full image</span>
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={src}
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            className={`block w-full h-auto transition-opacity duration-300 ${
              status === "loaded" ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setStatus("loaded")}
            onError={handleError}
          />
        </div>
      </button>
    </figure>
  );
}

export function ImageHandler({ refreshKey = 0, searchQuery = "" }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { images, loading, loadingMore, hasMore, error, sentinelRef, searchQuery: activeSearch } =
    usePhotos({ refreshKey, searchQuery });

  if (loading && images.length === 0) {
    return <SkeletonGrid />;
  }

  if (!loading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2 px-5">
        <svg
          className="w-12 h-12 opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm text-center">
          {activeSearch
            ? `No results for "${activeSearch}". Try a different search.`
            : "No photos yet. Be the first to upload one!"}
        </p>
        {error && (
          <p className="text-sm text-destructive mt-2" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {error && (
        <p className="text-sm text-destructive py-2 px-5" role="alert">
          {error}
        </p>
      )}

      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-5 p-5 max-w-[1800px] mx-auto w-full">
        {images.map((photo, index) => (
          <PhotoCard
            key={cardKey(photo)}
            photo={photo}
            onClick={setSelectedPhoto}
            priority={index < 8}
          />
        ))}
      </div>

      <div ref={sentinelRef} className="h-4 w-full" aria-hidden />

      {loadingMore && (
        <div className="py-8 w-full flex justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-muted-foreground/30 border-t-primary animate-spin" />
        </div>
      )}

      {!hasMore && images.length > 0 && (
        <p className="text-sm text-muted-foreground pb-8">You&apos;ve reached the end</p>
      )}

      <ImageDetailsPopup
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  );
}
