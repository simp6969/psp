"use client";

import { useState } from "react";
import { Header } from "./components/Header";
import { ImageHandler } from "./components/ImageHandler";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="overflow-x-hidden relative"
    >
      <Header onUploadSuccess={handleUploadSuccess} />
      <ImageHandler refreshKey={refreshKey} />
    </div>
  );
}
