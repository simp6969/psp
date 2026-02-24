"use client";

import { Header } from "./components/Header";

export default function Loading() {
  // A more visually appealing loading skeleton for the photo gallery
  const skeletonItems = Array.from({ length: 20 });
  const heights = ["h-48", "h-64", "h-56", "h-72", "h-80"];

  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className="overflow-hidden"
    >
      <Header />
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-5 p-5 max-w-400 mx-auto">
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className="relative mb-5 break-inside-avoid animate-pulse"
          >
            <div
              className={`w-[] ${
                heights[index % heights.length]
              } rounded-lg bg-primary`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
