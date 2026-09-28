import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type PlanPdpContainerProps<T extends ElementType = "div"> = {
  as?: T;
  className?: string;
  children: ReactNode;
};

/** PDP content width (v375 gutters; not Tailwind `container`). */
export function PlanPdpContainer<T extends ElementType = "div">({
  as,
  className,
  children,
}: PlanPdpContainerProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        "mx-auto max-w-none px-0",
        "w-[calc(100%-var(--gutter-mobile))] min-[761px]:w-[min(calc(100%-var(--gutter-tablet)),var(--max-width-content))] min-[1101px]:w-[min(calc(100%-var(--gutter-desktop)),var(--max-width-content))]",
        className
      )}
    >
      {children}
    </Component>
  );
}
