"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { ArrowRight, Play } from "lucide-react";

import { Container } from "@/components/common/container";
import { StoryVideoDialog } from "@/components/testimonials/story-video-dialog";
import type { CustomerStory } from "@/config/customer-stories";
import { cn } from "@/lib/utils";

type CustomerStoriesSectionProps = {
  variant: "home" | "plan-pdp";
  id?: string;
  titleId: string;
  eyebrow?: string;
  title: string;
  description: string;
  stories: CustomerStory[];
  className?: string;
};

export function CustomerStoriesSection({
  variant,
  id,
  titleId,
  eyebrow = "Customer proof",
  title,
  description,
  stories,
  className,
}: CustomerStoriesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dialogStory, setDialogStory] = useState<CustomerStory | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const active = stories[activeIndex] ?? stories[0];
  if (!active) return null;

  const openStory = useCallback((story: CustomerStory) => {
    setDialogStory(story);
    setDialogOpen(true);
  }, []);

  const countLabel = `${String(activeIndex + 1).padStart(2, "0")} / ${String(stories.length).padStart(2, "0")}`;
  const personLine = [active.role, active.company].filter(Boolean).join(" · ");
  const hasVideo = Boolean(active.youtubeId);
  const watchLabel = hasVideo ? "Watch story" : "View story";

  return (
    <>
      <section
        id={id}
        aria-labelledby={titleId}
        className={cn(
          variant === "home"
            ? "border-t border-[#e4e8eb] bg-white py-[62px] pb-[66px] max-[780px]:py-12 max-[780px]:pb-[52px]"
            : "border-y border-[#e3e8eb] bg-[#f7f9fb] py-16 pb-[68px] max-[860px]:py-12",
          className
        )}
      >
        <Container>
          <div
            className={cn(
              "mb-[26px] grid items-end gap-[52px] max-[1080px]:grid-cols-1 max-[1080px]:gap-2",
              variant === "home"
                ? "grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] max-[780px]:mb-[21px]"
                : "grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] max-[860px]:grid-cols-1 max-[860px]:gap-3.5"
            )}
          >
            <div>
              <p className="m-0 mb-2.5 text-[11px] font-bold tracking-[0.12em] text-[#1767ad] uppercase">
                {variant === "home" ? eyebrow : eyebrow}
              </p>
              <h2
                id={titleId}
                className="m-0 max-w-[760px] text-[clamp(30px,2.8vw,42px)] leading-[1.04] font-normal tracking-[-0.038em] text-[#172126] max-[780px]:text-[32px]"
              >
                {title}
              </h2>
            </div>
            <p className="m-0 mb-0.5 max-w-[650px] text-[15px] leading-[1.55] text-[#617078] max-[860px]:max-w-[620px]">
              {description}
            </p>
          </div>

          {variant === "home" ? (
            <HomeStoryShowcase
              active={active}
              stories={stories}
              activeIndex={activeIndex}
              countLabel={countLabel}
              personLine={personLine}
              watchLabel={watchLabel}
              hasVideo={hasVideo}
              onSelect={setActiveIndex}
              onOpen={openStory}
            />
          ) : (
            <PlanStoryShowcase
              active={active}
              stories={stories}
              activeIndex={activeIndex}
              countLabel={countLabel}
              watchLabel={watchLabel}
              hasVideo={hasVideo}
              onSelect={setActiveIndex}
              onOpen={openStory}
            />
          )}
        </Container>
      </section>

      <StoryVideoDialog
        story={dialogStory}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setDialogStory(null);
        }}
      />
    </>
  );
}

function HomeStoryShowcase({
  active,
  stories,
  activeIndex,
  countLabel,
  personLine,
  watchLabel,
  hasVideo,
  onSelect,
  onOpen,
}: {
  active: CustomerStory;
  stories: CustomerStory[];
  activeIndex: number;
  countLabel: string;
  personLine: string;
  watchLabel: string;
  hasVideo: boolean;
  onSelect: (index: number) => void;
  onOpen: (story: CustomerStory) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#dce3e8] bg-white shadow-[0_12px_30px_rgba(25,43,54,0.05)] max-[780px]:rounded-[15px]">
      <div
        aria-live="polite"
        className="grid min-h-[318px] grid-cols-[minmax(0,1.14fr)_minmax(350px,0.86fr)] max-[1080px]:grid-cols-1"
      >
        <button
          type="button"
          aria-label={`${hasVideo ? "Play" : "Open"} ${active.name} customer story`}
          onClick={() => onOpen(active)}
          className="relative isolate block min-h-[318px] w-full cursor-pointer overflow-hidden border-0 bg-[#0c1b26] p-0 text-left max-[1080px]:min-h-[360px] max-[780px]:min-h-[226px]"
        >
          <Image
            src={active.thumbnail}
            alt={`${active.name} customer testimonial video`}
            fill
            className="object-cover transition-[transform,filter] duration-300 hover:scale-[1.018] hover:saturate-[1.03]"
            sizes="(max-width: 1080px) 100vw, 60vw"
            priority={activeIndex === 0}
          />
          <span className="pointer-events-none absolute inset-0 bg-linear-to-b from-[rgba(5,18,28,0.04)] from-28% to-[rgba(5,18,28,0.5)]" />
          <span className="pointer-events-none absolute top-[18px] left-[18px] inline-flex min-h-7 items-center rounded-full border border-white/30 bg-[rgba(6,21,33,0.62)] px-2.5 text-[11px] font-bold tracking-[0.07em] text-white uppercase backdrop-blur-md">
            Customer Story
          </span>
          <span className="pointer-events-none absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#0565cf] shadow-[0_13px_34px_rgba(0,0,0,0.2)]">
            <Play className="size-[23px] translate-x-0.5 fill-current" aria-hidden />
          </span>
          <span className="pointer-events-none absolute bottom-[17px] left-5 inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.01em] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)] before:size-1.75 before:rounded-full before:bg-white before:content-['']">
            Watch the Story
          </span>
        </button>

        <div className="flex flex-col justify-center bg-white px-[30px] py-[25px] max-[780px]:px-5 max-[780px]:py-5">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex max-w-[calc(100%-52px)] min-h-7 items-center rounded-full bg-[#eef4ff] px-2.5 text-[10.5px] font-bold tracking-[0.07em] text-[#135da8] uppercase">
              {active.topic}
            </span>
            <span className="shrink-0 text-[11px] font-semibold tracking-[0.06em] text-[#89949a]">
              {countLabel}
            </span>
          </div>
          <p className="story-stage-quote mt-[17px] mb-0 text-[clamp(23px,1.95vw,29px)] leading-[1.04] font-normal tracking-[-0.03em] text-[#172126] before:text-[#0565cf] before:content-['“'] after:text-[#0565cf] after:content-['”'] max-[780px]:text-2xl!">
            {active.quote}
          </p>
          <div className="mt-[17px] border-t border-[#e3e8eb] pt-4 max-[780px]:mt-[15px] max-[780px]:pt-3.5">
            <strong className="block text-[15px] font-semibold text-[#26333a]">{active.name}</strong>
            <span className="mt-1 block text-[12.5px] leading-snug text-[#718088]">{personLine}</span>
          </div>
          <button
            type="button"
            onClick={() => onOpen(active)}
            className="mt-[15px] inline-flex w-max cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-[12.5px] font-bold text-[#075ba8] hover:[&_svg]:translate-x-0.5"
          >
            {watchLabel}
            <ArrowRight className="size-[15px]" strokeWidth={1.8} aria-hidden />
          </button>
        </div>
      </div>

      <nav aria-label="Choose a customer story" className="border-t border-[#dce3e8] bg-[#f8fafb]">
        <div
          role="tablist"
          aria-label="Customer stories"
          className="grid grid-cols-5 max-[1080px]:grid-cols-[repeat(5,minmax(180px,1fr))] max-[1080px]:overflow-x-auto max-[1080px]:overscroll-x-contain max-[1080px]:scroll-smooth max-[780px]:grid-cols-[repeat(5,minmax(170px,72vw))]"
        >
          {stories.map((story, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={story.id}
                type="button"
                role="tab"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => onSelect(index)}
                className={cn(
                  "relative min-h-[72px] w-full min-w-0 cursor-pointer border-0 border-r border-[#e1e6e9] px-4 py-3.5 text-left transition-colors max-[780px]:min-h-[68px] max-[780px]:px-3.5",
                  selected ? "bg-white" : "bg-transparent hover:bg-[#f2f6f8]",
                  "before:absolute before:inset-x-0 before:top-[-1px] before:h-[3px] before:content-['']",
                  selected ? "before:bg-[#0565cf]" : "before:bg-transparent"
                )}
              >
                <span
                  className={cn(
                    "mb-1 block text-[9.5px] font-bold tracking-[0.08em]",
                    selected ? "text-[#0565cf]" : "text-[#9aa4aa]"
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "block truncate text-[13px] leading-tight font-semibold",
                    selected ? "text-[#075ba8]" : "text-[#26333a]"
                  )}
                >
                  {story.name}
                </span>
                <span className="mt-0.5 block truncate text-[10.5px] leading-snug text-[#78858c]">
                  {story.tabDetail ?? `${story.company} · ${story.topic}`}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function PlanStoryShowcase({
  active,
  stories,
  activeIndex,
  countLabel,
  watchLabel,
  hasVideo,
  onSelect,
  onOpen,
}: {
  active: CustomerStory;
  stories: CustomerStory[];
  activeIndex: number;
  countLabel: string;
  watchLabel: string;
  hasVideo: boolean;
  onSelect: (index: number) => void;
  onOpen: (story: CustomerStory) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#d9e2e8] bg-white shadow-[0_12px_32px_rgba(27,45,56,0.055)]">
      <div className="grid grid-cols-[minmax(430px,560px)_minmax(0,1fr)] items-stretch bg-white max-[860px]:grid-cols-1">
        <button
          type="button"
          aria-label={`${hasVideo ? "Play" : "Open"} ${active.name} customer story`}
          onClick={() => onOpen(active)}
          className="relative isolate block aspect-video w-full max-w-[560px] cursor-pointer self-center overflow-hidden border-0 bg-[#07141e] p-0 max-[860px]:max-w-none"
        >
          <Image
            src={active.thumbnail}
            alt={`${active.name} customer story thumbnail`}
            fill
            className="object-cover transition-[transform,filter] duration-300 hover:scale-[1.012] hover:saturate-[1.025]"
            sizes="(max-width: 860px) 100vw, 560px"
          />
          <span className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent from-[58%] to-[rgba(4,14,23,0.18)]" />
          <span className="absolute right-4 bottom-4 grid size-12 place-items-center rounded-full bg-white text-[#0565cf] shadow-[0_10px_26px_rgba(0,0,0,0.2)]">
            <Play className="size-[18px] translate-x-px fill-current" aria-hidden />
          </span>
        </button>

        <div className="flex min-w-0 flex-col justify-center px-[34px] py-7 max-[860px]:px-6 max-[860px]:py-6">
          <div className="mb-[18px] flex items-center justify-between gap-[18px]">
            <span className="inline-flex items-center gap-2 text-[10.5px] font-bold tracking-[0.085em] text-[#0d5da8] uppercase before:h-0.5 before:w-[22px] before:rounded-sm before:bg-[#0565cf] before:content-['']">
              {active.topic}
            </span>
            <span className="shrink-0 text-[10.5px] font-semibold tracking-[0.08em] text-[#96a2a9]">
              {countLabel}
            </span>
          </div>
          <p className="m-0 max-w-[690px] text-[clamp(22px,1.85vw,28px)] leading-[1.16] font-normal tracking-[-0.026em] text-[#1c282f] before:text-[#0565cf] before:content-['“'] after:text-[#0565cf] after:content-['”']">
            {active.quote}
          </p>
          <div className="mt-6 flex items-end justify-between gap-5 border-t border-[#e5eaed] pt-[18px]">
            <span className="min-w-0">
              <strong className="block text-base leading-tight font-semibold text-[#25323a]">
                {active.name}
              </strong>
              <span className="mt-1 block text-xs leading-snug text-[#728089]">{active.company}</span>
            </span>
            <button
              type="button"
              onClick={() => onOpen(active)}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#cfdbe3] bg-white px-3.5 py-0 text-xs font-bold text-[#075ba8] transition hover:-translate-y-px hover:border-[#aebfcb] hover:bg-[#f7fbff]"
            >
              <Play className="size-3.5 fill-current" aria-hidden />
              <span>{watchLabel}</span>
            </button>
          </div>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Choose a customer story"
        className="grid border-t border-[#dde5ea] bg-[#f5f8fa]"
        style={{ gridTemplateColumns: `repeat(${stories.length}, minmax(0, 1fr))` }}
      >
        {stories.map((story, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={story.id}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(index)}
              className={cn(
                "relative grid min-h-[82px] cursor-pointer grid-cols-[88px_minmax(0,1fr)_18px] items-center gap-3 border-0 border-r border-[#e0e7eb] px-3.5 py-3 text-left last:border-r-0",
                selected ? "bg-white" : "bg-transparent hover:bg-[#eef3f6]",
                "before:absolute before:inset-x-0 before:top-[-1px] before:h-[3px] before:content-['']",
                selected ? "before:bg-[#0565cf]" : "before:bg-transparent"
              )}
            >
              <span className="relative block aspect-video overflow-hidden rounded-lg bg-[#07141e] shadow-[0_0_0_1px_rgba(23,42,54,0.08)]">
                <Image
                  src={story.thumbnail}
                  alt=""
                  fill
                  className={cn(
                    "object-cover transition-opacity duration-150",
                    selected ? "opacity-100" : "opacity-82"
                  )}
                  sizes="88px"
                />
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block truncate text-[12.5px] leading-tight font-semibold",
                    selected ? "text-[#075ba8]" : "text-[#2a373e]"
                  )}
                >
                  {story.name}
                </span>
                <span className="mt-1 block truncate text-[10.5px] leading-tight text-[#7a878e]">
                  {story.topic}
                </span>
              </span>
              <span
                className={cn(
                  "text-[17px] leading-none transition-transform",
                  selected ? "translate-x-0.5 text-[#0565cf]" : "text-[#a2adb3]"
                )}
                aria-hidden
              >
                →
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
