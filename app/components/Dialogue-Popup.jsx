"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadForm } from "./ImageUploadModal";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { SignedOutComponent } from "./SignedOut";

export function Dialogue({ onUploadSuccess }) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onUploadSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="bg-primary border shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 size-9 cursor-pointer"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <SignedIn><DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Photo</DialogTitle>
          <DialogDescription>
            Share a photo with the community.
          </DialogDescription>
        </DialogHeader>
        <UploadForm onUploadSuccess={handleSuccess} />
      </DialogContent></SignedIn>
      <SignedOut>
        <DialogContent>
          <DialogHeader className="flex gap-5">
            <DialogTitle>Please Sign In to Upload Photo</DialogTitle>
            <DialogDescription>
                <SignedOutComponent/>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </SignedOut>
    </Dialog>
  );
}
