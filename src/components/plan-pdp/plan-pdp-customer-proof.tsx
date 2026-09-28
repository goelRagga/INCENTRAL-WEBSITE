"use client";

import { useCallback, useState } from "react";

import { PlanPdpContainer } from "./plan-pdp-container";
import { StoryVideoDialog } from "@/components/testimonials/story-video-dialog";
import type { CustomerStory } from "@/config/customer-stories";

type PlanPdpCustomerProofProps = {
  id?: string;
  titleId: string;
  title: string;
  description: string;
  stories: CustomerStory[];
};

export function PlanPdpCustomerProof({
  id = "customer-proof",
  titleId,
  title,
  description,
  stories,
}: PlanPdpCustomerProofProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dialogStory, setDialogStory] = useState<CustomerStory | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const active = stories[activeIndex] ?? stories[0];
  if (!active) return null;

  const countLabel = `${String(activeIndex + 1).padStart(2, "0")} / ${String(stories.length).padStart(2, "0")}`;
  const hasVideo = Boolean(active.youtubeId);
  const watchLabel = hasVideo ? "Watch story" : "View story";

  const openStory = useCallback((story: CustomerStory) => {
    setDialogStory(story);
    setDialogOpen(true);
  }, []);

  return (
    <>
      <section
        id={id}
        aria-labelledby={titleId}
        className="pdt-story-section"
        data-pdt-proof=""
      >
        <PlanPdpContainer>
          <div className="pdt-story-head">
            <div>
              <p className="eyebrow">Customer proof</p>
              <h2 id={titleId}>{title}</h2>
            </div>
            <p>{description}</p>
          </div>
          <div className="pdt-proof-shell">
            <div className="pdt-proof-stage">
              <button
                type="button"
                aria-label={`${hasVideo ? "Play" : "Open"} ${active.name} customer story`}
                className="pdt-proof-media"
                onClick={() => openStory(active)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`${active.name} customer story thumbnail`}
                  decoding="async"
                  loading="lazy"
                  src={active.thumbnail}
                />
                <span aria-hidden="true" className="pdt-proof-play">
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M8 5.5v13L18 12 8 5.5Z" />
                  </svg>
                </span>
              </button>
              <div className="pdt-proof-copy">
                <div className="pdt-proof-topline">
                  <span className="pdt-proof-topic">{active.topic}</span>
                  <span className="pdt-proof-count">{countLabel}</span>
                </div>
                <p className="pdt-proof-quote">{active.quote}</p>
                <div className="pdt-proof-person">
                  <span className="pdt-proof-person-copy">
                    <strong className="pdt-proof-name">{active.name}</strong>
                    <span className="pdt-proof-company">{active.company}</span>
                  </span>
                  <button
                    type="button"
                    className="pdt-proof-watch"
                    onClick={() => openStory(active)}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                      <path d="M8 5.5v13L18 12 8 5.5Z" />
                    </svg>
                    <span>{watchLabel}</span>
                  </button>
                </div>
              </div>
            </div>
            <div
              className="pdt-proof-rail"
              role="tablist"
              aria-label="Choose a customer story"
              style={{ ["--pdt-story-count" as string]: stories.length }}
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
                    className="pdt-proof-tab"
                    onClick={() => setActiveIndex(index)}
                  >
                    <span className="pdt-proof-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="" decoding="async" loading="lazy" src={story.thumbnail} />
                    </span>
                    <span className="pdt-proof-tab-copy">
                      <span className="pdt-proof-tab-name">{story.name}</span>
                      <span className="pdt-proof-tab-topic">{story.topic}</span>
                    </span>
                    <span className="pdt-proof-tab-arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </PlanPdpContainer>
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
