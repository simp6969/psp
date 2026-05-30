"use client";

import { useState } from "react";
import { Header } from "./components/Header";
import { ImageHandler } from "./components/ImageHandler";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-dvh w-full overflow-x-hidden flex flex-col">
      <Header
        onUploadSuccess={handleUploadSuccess}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="flex-1">
        <ImageHandler refreshKey={refreshKey} searchQuery={searchQuery} />
      </main>
    </div>
  );
}
