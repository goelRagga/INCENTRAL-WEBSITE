import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

const containerClassName = cn(
  "container mx-auto w-[calc(100%-var(--gutter-mobile))] max-w-(--max-width-content)",
  "min-[761px]:w-[min(calc(100%-var(--gutter-tablet)),var(--max-width-content))]",
  "min-[1101px]:w-[min(calc(100%-var(--gutter-desktop)),var(--max-width-content))]"
);

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  className?: string;
  children: ReactNode;
};

export function Container<T extends ElementType = "div">({
  as,
  className,
  children,
}: ContainerProps<T>) {
  const Component = as ?? "div";

  return (
    <Component className={cn(containerClassName, className)}>
      {children}
    </Component>
  );
}
