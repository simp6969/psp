"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

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

function PhotoCard({ src, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative mb-5 break-inside-avoid group">
      {/* Skeleton placeholder while loading */}
      {!loaded && (
        <div className="w-full h-48 rounded-lg bg-muted animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`w-full h-auto object-cover rounded-lg transition-all duration-300 hover:brightness-90 hover:cursor-pointer hover:shadow-lg ${
          loaded ? "opacity-100" : "opacity-0 absolute top-0 left-0"
        }`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export function ImageHandler({ refreshKey }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("https://railway.com/project/58ea7f4d-eeb1-4eb7-9bf4-75bb4abdb89d?environmentId=7cfa99e0-4d12-4875-a71d-539a10ed6ba8/api/photos");
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos, refreshKey]);

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
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-5 p-5 max-w-[1800px] mx-auto">
      {images.map((photo) => (
        <PhotoCard
          key={photo.uniqueID || photo._id}
          src={`http://localhost:5000/api/image/${photo.fileId}`}
          alt={photo.filename || "Uploaded photo"}
        />
      ))}
    </div>
  );
}
