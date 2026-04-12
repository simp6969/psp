import { Button } from "@/components/ui/button";
import { Download, X, User, FileImage } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

export function ImageDetailsPopup({ photo, isOpen, onClose }) {
  if (!photo) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(`https://photo-share-backend-alpha.vercel.app/api/image/${photo.fileId}`);
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

  const imageUrl = `https://photo-share-backend-alpha.vercel.app//api/image/${photo.fileId}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95dvw] md:max-w-[90dvw] md:w-fit items-center p-5 overflow-hidden bg-background border rounded-xl shadow-2xl flex flex-col md:flex-row gap-5">
        <DialogTitle hidden>Image details</DialogTitle>
        <div className="relative flex items-center justify-center">
          <img
            src={imageUrl}
            alt={photo.filename || "Image details"}
            className="object-contain select-none max-h-[60dvh] md:max-h-[85dvh] max-w-full md:max-w-[calc(90dvw-250px)] rounded"
          />
        </div>
        <div className="w-[200px] flex flex-col gap-[20px] shrink-0">
          <h1 className="font-bold text-[20px] truncate" title={photo.filename}>
            {photo.filename}
          </h1>
          <p>Uploaded: {photo.username}</p>
          <Button
            onClick={handleDownload}
            className="w-full gap-2"
            size="lg"
          >
            <Download className="w-4 h-4" />
            Download Image
          </Button>
        </div>
      </DialogContent>

    </Dialog>
  );
}