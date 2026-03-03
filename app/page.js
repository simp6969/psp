"use client";

import { useState } from "react";
import { Header } from "./components/Header";
import { ImageHandler } from "./components/ImageHandler";
import { ImageUploadModal } from "./components/ImageUploadModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="overflow-x-hidden relative"
    >
      <Header />
      
      <div className="absolute top-24 right-8 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Upload Photo
        </button>
      </div>

      <ImageHandler key={refreshKey} />

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
