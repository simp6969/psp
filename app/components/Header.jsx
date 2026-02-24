"use client";

import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { ModeToggle } from "./DarkLightToggle";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
export function Header() {
  const router = useRouter();
  return (
    <div className=" h-20 flex items-center mt-0 flex-row justify-between m-5 gap-5">
      <div
        onClick={() => {
          router.push("/");
        }}
        className="flex hover:cursor-pointer h-20 overflow-hidden w-20 justify-center items-center"
      >
        <Image
          loading="eager"
          src="/icon.svg"
          height={50}
          width={50}
          alt="our icon"
        />
      </div>
      <Input placeholder="Search..." spellCheck={false} />
      <div className="flex justify-center items-center gap-3">
        <ModeToggle />
        <div className="border border-[primary] h-9"></div>

        <ClerkLoaded>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton
              className=" bg-[--primary] w-20
            h-10
  text-[--primary-foreground] 
    font-semibold
  hover:cursor-pointer
  rounded-lg
  text-[16px]
  border-2
   border-[--light-mode-text-border]"
            />
          </SignedOut>
        </ClerkLoaded>
      </div>
      <ClerkLoading>
        <div className="w-25"></div>
      </ClerkLoading>
    </div>
  );
}
