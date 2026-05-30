"use client";

import { useEffect, useState } from "react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SignedOutComponent } from "./SignedOut";
import { ModeToggle } from "./DarkLightToggle";
import { Dialogue } from "./Dialogue-Popup";

const DEBOUNCE_MS = 300;

export function Header({ onUploadSuccess, searchQuery = "", onSearchChange }) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        onSearchChange?.(inputValue);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [inputValue, searchQuery, onSearchChange]);

  const clearSearch = () => {
    setInputValue("");
    onSearchChange?.("");
  };

  return (
    <header className="sticky top-0 z-20 backdrop-blur-sm bg-background/80 border-b border-border">
      <div className="h-20 flex items-center justify-between gap-4 px-4 md:px-5 max-w-[1800px] mx-auto w-full">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex shrink-0 hover:opacity-80 transition-opacity h-12 w-12 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Home"
        >
          <Image
            loading="eager"
            src="/icon.svg"
            height={40}
            width={40}
            alt="Photo share home"
          />
        </button>

        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search by filename or uploader..."
            spellCheck={false}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearchChange?.(inputValue);
              }
            }}
            className="pl-9 pr-9 bg-background border-border"
            aria-label="Search photos"
          />
          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 size-7 text-muted-foreground hover:text-foreground"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <ModeToggle />
          <div className="hidden sm:block h-9 w-px bg-border" aria-hidden />
          <Dialogue onUploadSuccess={onUploadSuccess} />
          <div className="hidden sm:block h-9 w-px bg-border" aria-hidden />
          <ClerkLoaded>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOutComponent />
          </ClerkLoaded>
          <ClerkLoading>
            <div className="w-8" aria-hidden />
          </ClerkLoading>
        </div>
      </div>
    </header>
  );
}
