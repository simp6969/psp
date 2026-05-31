"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileImage, ImageOff, Loader2, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { imageUrl } from "@/lib/api";

export function ImageDetailsPopup({ photo, isOpen, onClose }) {
  const [imageStatus, setImageStatus] = useState("loading");

  useEffect(() => {
    if (photo?.fileId) setImageStatus("loading");
  }, [photo?.fileId]);

  if (!photo) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl(photo.fileId));
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = photo.filename || "downloaded-image";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download image", error);
    }
  };

  const src = imageUrl(photo.fileId);
  const displayName = photo.filename || "Untitled photo";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton
        className="w-fit max-w-[96dvw] p-0 gap-0 overflow-hidden border-border bg-card text-card-foreground shadow-2xl sm:max-w-[96dvw] [&>button]:text-muted-foreground [&>button]:hover:text-foreground [&>button]:top-3 [&>button]:right-3"
      >
        <div className="flex max-h-[90dvh] flex-col md:flex-row md:items-stretch">
          <div className="relative flex shrink-0 items-center justify-center bg-muted/30 p-3 sm:p-4 border-b md:border-b-0 md:border-r border-border">
            {imageStatus === "loading" && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="size-10 animate-spin opacity-60" aria-hidden />
                <span className="text-sm">Loading image…</span>
              </div>
            )}

            {imageStatus === "error" && (
              <div className="absolute inset-0 z-10 flex min-w-[200px] min-h-[200px] flex-col items-center justify-center gap-3 px-4 text-center text-muted-foreground">
                <ImageOff className="size-12 opacity-50" aria-hidden />
                <p className="text-sm">This image could not be displayed.</p>
                <p className="text-xs">You can still try downloading the original file.</p>
              </div>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={displayName}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className={`block h-auto max-h-[72dvh] w-auto max-w-[min(92dvw,100%)] select-none transition-opacity duration-300 md:max-h-[82dvh] md:max-w-[min(calc(96dvw-18rem),85dvw)] ${
                imageStatus === "loaded" ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageStatus("loaded")}
              onError={() => setImageStatus("error")}
            />
          </div>

          <aside className="flex w-full shrink-0 flex-col gap-5 bg-background p-5 md:w-64">
            <DialogHeader className="space-y-1 p-0 text-left">
              <DialogTitle className="text-lg font-semibold leading-snug break-all text-foreground">
                {displayName}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Photo details and download
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 text-muted-foreground">
                <User className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
                    Uploaded by
                  </p>
                  <p className="font-medium text-foreground">
                    {photo.username || "Unknown"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-muted-foreground">
                <FileImage className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
                    File
                  </p>
                  <p className="break-all text-foreground">{displayName}</p>
                </div>
              </div>
            </div>

            <Button onClick={handleDownload} className="mt-auto w-full gap-2" size="lg">
              <Download className="size-4" />
              Download
            </Button>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
