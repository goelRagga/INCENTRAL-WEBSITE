"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { XIcon } from "lucide-react";

import type { CustomerStory } from "@/config/customer-stories";
import { cn } from "@/lib/utils";

type StoryVideoDialogProps = {
  story: CustomerStory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function youtubeEmbedUrl(id: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    playsinline: "1",
    rel: "0",
  });
  if (typeof window !== "undefined" && window.location.origin) {
    params.set("origin", window.location.origin);
  }
  return `https://www.youtube.com/embed/${encodeURIComponent(id)}?${params.toString()}`;
}

export function StoryVideoDialog({ story, open, onOpenChange }: StoryVideoDialogProps) {
  const [embedReady, setEmbedReady] = useState(false);
  const isShort = story?.format === "short";
  const hasVideo = Boolean(story?.youtubeId);

  useEffect(() => {
    setEmbedReady(false);
  }, [open, story?.id]);

  const embedSrc = useMemo(
    () => (story?.youtubeId ? youtubeEmbedUrl(story.youtubeId) : ""),
    [story?.youtubeId]
  );

  if (!story) return null;

  const personLine = [story.role, story.company].filter(Boolean).join(" · ");

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className={cn(
            "fixed inset-0 z-[1300] bg-[rgba(4,13,20,0.82)] backdrop-blur-[8px]",
            "transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0"
          )}
        />
        <DialogPrimitive.Popup
          className={cn(
            "fixed top-1/2 left-1/2 z-[1301] max-h-[calc(100dvh-40px)] -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-[18px] border-0 bg-transparent p-0 text-white shadow-[0_34px_100px_rgba(0,0,0,0.42)]",
            isShort ? "w-[min(500px,calc(100vw-36px))]" : "w-[min(960px,calc(100vw-40px))]",
            "max-[600px]:fixed max-[600px]:inset-0 max-[600px]:h-dvh max-[600px]:max-h-none max-[600px]:w-screen max-[600px]:translate-none max-[600px]:rounded-none max-[600px]:shadow-none"
          )}
        >
          <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#07141e] max-[600px]:flex max-[600px]:h-full max-[600px]:flex-col max-[600px]:rounded-none max-[600px]:border-0">
            <header className="flex h-[52px] items-center justify-between gap-[18px] border-b border-white/10 bg-[#07141e] px-4 pl-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="inline-flex shrink-0 items-center gap-2 text-[10px] font-bold tracking-[0.08em] text-[#9db0bf] uppercase before:size-1.5 before:rounded-full before:bg-[#4c9cff] before:shadow-[0_0_0_4px_rgba(76,156,255,0.11)] before:content-['']">
                  Customer Story
                </span>
                <span className="truncate text-[12.5px] font-semibold text-[#edf4f8]">
                  {story.name}
                </span>
              </div>
              <DialogPrimitive.Close
                aria-label="Close customer story"
                className="grid size-9 shrink-0 place-items-center rounded-full border border-white/20 bg-white/[0.06] text-white hover:border-white/30 hover:bg-white/[0.13]"
              >
                <XIcon className="size-4" strokeWidth={1.8} />
              </DialogPrimitive.Close>
            </header>

            <div className="flex min-h-0 flex-col bg-[#07141e] max-[600px]:flex-1 max-[600px]:overflow-auto">
              <div
                className={cn(
                  "relative grid place-items-center bg-[#020608]",
                  isShort && "px-3 pt-3"
                )}
              >
                <div
                  className={cn(
                    "relative w-full overflow-hidden bg-black",
                    isShort
                      ? "mx-auto aspect-[9/16] h-[min(62dvh,590px)] w-[min(350px,100%)] rounded-t-xl"
                      : "aspect-video"
                  )}
                >
                  {hasVideo ? (
                    <>
                      {open && !embedReady ? (
                        <div className="absolute inset-0 z-[2] grid place-items-center bg-[#06111a]">
                          <Image
                            src={story.thumbnail}
                            alt=""
                            fill
                            className="object-cover brightness-[0.52] saturate-[0.85]"
                            sizes="(max-width: 960px) 100vw, 960px"
                          />
                          <span className="relative z-[2] grid size-[58px] place-items-center rounded-full bg-white/95 text-[#0565cf] shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
                            <PlayIcon />
                          </span>
                        </div>
                      ) : null}
                      {open ? (
                        <iframe
                          title={`${story.name} testimonial video`}
                          src={embedSrc}
                          className="absolute inset-0 size-full border-0 bg-black"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="strict-origin-when-cross-origin"
                          onLoad={() => setEmbedReady(true)}
                        />
                      ) : null}
                    </>
                  ) : (
                    <div className="absolute inset-0">
                      <Image
                        src={story.thumbnail}
                        alt={`${story.name} customer story`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 960px) 100vw, 960px"
                      />
                    </div>
                  )}
                </div>
              </div>

              <aside
                className={cn(
                  "grid items-center gap-[26px] border-t border-white/10 bg-[#0b1a24] px-[22px] py-5",
                  "min-[901px]:grid-cols-[minmax(0,1fr)_minmax(280px,0.78fr)]",
                  isShort && "grid-cols-1 gap-3.5 px-5 py-5"
                )}
              >
                <div className="min-w-0 self-center">
                  <DialogPrimitive.Description className="inline-flex items-center text-[9.5px] font-bold tracking-[0.085em] text-[#68afff] uppercase before:mr-2 before:h-0.5 before:w-5 before:rounded-sm before:bg-[#2c8cff] before:content-['']">
                    {story.topic}
                  </DialogPrimitive.Description>
                  <DialogPrimitive.Title className="mt-2 mb-0 text-[21px] leading-[1.08] font-semibold tracking-[-0.026em] text-[#f4f8fb]">
                    {story.name}
                  </DialogPrimitive.Title>
                  {personLine ? (
                    <p className="mt-1 mb-0 text-[11.5px] leading-snug text-[#9caeb9]">
                      {personLine}
                    </p>
                  ) : null}
                </div>
                <p
                  className={cn(
                    "m-0 text-sm leading-[1.46] tracking-[-0.006em] text-[#dce7ed]",
                    "before:text-[#4c9cff] before:content-['“'] after:text-[#4c9cff] after:content-['”']",
                    "min-[901px]:border-l min-[901px]:border-white/15 min-[901px]:pl-[18px]",
                    "max-[900px]:border-t max-[900px]:border-white/10 max-[900px]:pt-3.5 max-[900px]:pl-0",
                    isShort && "border-t-0 pl-0 max-[900px]:border-t max-[900px]:border-white/10"
                  )}
                >
                  {story.quote}
                </p>
              </aside>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5 translate-x-px fill-current">
      <path d="M8 5.5v13L18 12 8 5.5Z" />
    </svg>
  );
}
