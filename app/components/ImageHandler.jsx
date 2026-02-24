"use client";

import { useEffect, useState } from "react";
import { sha256, sha224 } from "js-sha256";
import Image from "next/image";

const ImageWithShadow = ({ src, alt }) => {
  return (
    <div className="relative mb-5 break-inside-avoid">
      <Image
        src={src}
        alt={alt}
        fill
        className="top-5 left-0 object-cover rounded-lg blur-xl opacity-50 -z-10"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <Image
        src={src}
        alt={alt}
        // The width and height props are required for next/Image when using a string for src.
        // These values are used to calculate the aspect ratio and prevent layout shift.
        // They don't determine the rendered size of the image.
        // I've assumed a 16:9 aspect ratio for the wallpapers.
        width={1920}
        height={1080}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="w-full h-auto object-cover rounded-lg hover:brightness-80 duration-300 hover:cursor-pointer"
      />
    </div>
  );
};

export function ImageHandler() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const newImages = [];
    for (let i = 1; i <= 10; i++) {
      const random_string_number = toString(Math.random() * i * 100);

      newImages.push({
        path: "/wallpaper_" + i + ".jpeg",
        uniqueID: sha256(random_string_number),
      });
    }
    setImages(newImages);
  }, []);
  console.log(images);

  if (images.length > 0) {
    return (
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-5 p-5 max-w-400 mx-auto">
        {images.map((e, key) => {
          return <ImageWithShadow key={key} src={e.path} alt="wall" />;
        })}
      </div>
    );
  }
}
