"use client";

import { Button } from "@/components/ui/button";
import { Download, FileImage, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { imageUrl } from "@/lib/api";

export function ImageDetailsPopup({ photo, isOpen, onClose }) {
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
        className="max-w-[95dvw] sm:max-w-[min(92dvw,1100px)] p-0 gap-0 overflow-hidden border-border bg-card text-card-foreground shadow-2xl [&>button]:text-muted-foreground [&>button]:hover:text-foreground [&>button]:top-3 [&>button]:right-3"
      >
        <div className="flex flex-col md:flex-row md:max-h-[90dvh]">
          <div className="flex-1 flex items-center justify-center bg-muted/40 p-4 md:p-6 min-h-[40dvh] md:min-h-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={displayName}
              className="object-contain max-h-[55dvh] md:max-h-[78dvh] w-full rounded-lg select-none"
            />
          </div>

          <aside className="w-full md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-border bg-background p-5 flex flex-col gap-5">
            <DialogHeader className="text-left space-y-1 p-0">
              <DialogTitle className="text-lg font-semibold text-foreground leading-snug break-all">
                {displayName}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Photo details and download
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 text-muted-foreground">
                <User className="size-4 shrink-0 mt-0.5 text-primary" aria-hidden />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
                    Uploaded by
                  </p>
                  <p className="text-foreground font-medium">
                    {photo.username || "Unknown"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-muted-foreground">
                <FileImage className="size-4 shrink-0 mt-0.5 text-primary" aria-hidden />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
                    File
                  </p>
                  <p className="text-foreground break-all">{displayName}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleDownload}
              className="w-full gap-2 mt-auto"
              size="lg"
            >
              <Download className="size-4" />
              Download
            </Button>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
