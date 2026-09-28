import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "eyebrow mb-[5px] text-xs leading-[1.22] font-semibold tracking-[0.085em] text-[#1767ad] uppercase max-[760px]:mb-1",
        "[&+h1]:mt-0 [&+h2]:mt-0 [&+h3]:mt-0 [&+h4]:mt-0",
        className
      )}
      {...props}
    />
  );
}
