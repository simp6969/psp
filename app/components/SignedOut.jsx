import { SignedOut, SignInButton } from "@clerk/nextjs";

export function SignedOutComponent() {
    return (
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
    )
}