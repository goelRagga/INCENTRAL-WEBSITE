import type { CSSProperties } from "react";
import Link from "next/link";

import type { PlanShowcaseCard } from "@/config/plans";
import { cn } from "@/lib/utils";

import { SolutionFeatureIcon } from "./solution-feature-icon";

const planFinderFamilyId: Record<string, string> = {
  incert: "incert",
  insight: "insight",
  ingenious: "ingenious",
  "invision-plus": "invisionplus",
};

/** v375 h139 showcase card accents (distinct from mega-menu Pass 180 tokens). */
const showcaseAccent: Record<
  PlanShowcaseCard["accent"],
  { accent: string; soft: string }
> = {
  incert: { accent: "#1d71c8", soft: "#eef6ff" },
  insight: { accent: "#2b86db", soft: "#eef6fd" },
  ingenious: { accent: "#4c75e0", soft: "#f1f4fe" },
  invisionplus: { accent: "#6a8fe8", soft: "#f3f6ff" },
};

type SolutionCardProps = {
  card: PlanShowcaseCard;
  className?: string;
};

function SolutionCardContent({ card }: { card: PlanShowcaseCard }) {
  const { accent, soft } = showcaseAccent[card.accent];

  return (
    <>
      <div
        className="relative h-36 overflow-hidden border-b border-[#e2e8eb] max-[1120px]:h-[162px] max-[780px]:h-[146px]"
        style={{ background: soft }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- v375 native lazy img */}
        <img
          src={card.image}
          alt=""
          decoding="async"
          loading="lazy"
          className="absolute inset-0 size-full scale-[1.02] object-cover object-center saturate-[0.91] contrast-[0.99] transition-[transform,filter] duration-350 group-hover/card:scale-[1.055] group-hover/card:saturate-100 group-hover/card:contrast-100"
        />
        <span
          className="absolute top-[13px] left-3.5 z-[2] inline-flex max-w-[calc(100%-62px)] min-h-[29px] items-center rounded-full border px-2.5 py-[5px] text-[9.5px] leading-[1.22] font-semibold normal-case backdrop-blur-md"
          style={{
            borderColor: `color-mix(in srgb, ${accent} 25%, #dbe5eb)`,
            background: "rgba(255,255,255,0.91)",
            boxShadow: "0 5px 16px rgba(30, 52, 64, 0.07)",
            color: accent,
          }}
        >
          <span
            className="mr-1.5 size-1.5 rounded-full"
            style={{
              background: accent,
              boxShadow: `0 0 0 3px color-mix(in srgb, ${accent} 10%, transparent)`,
            }}
          />
          {card.value}
        </span>
        <span
          aria-hidden="true"
          className="absolute top-[13px] right-3.5 z-[2] grid size-[31px] place-items-center rounded-[11px] border border-white/70 bg-[rgba(20,42,53,0.73)] text-[9.5px] font-semibold tracking-[0.04em] text-white backdrop-blur-md"
        >
          {card.number}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-[18px] pt-[18px] pb-[19px] max-[520px]:px-4 max-[520px]:pt-[17px] max-[520px]:pb-4">
        <div className="border-b border-[#e5eaed] pb-3.5">
          <h3 className="m-0 text-2xl leading-[1.05] font-medium tracking-[-0.035em] text-[#162c37] max-[520px]:text-[23px]">
            {card.name}
          </h3>
          <p className="mt-[7px] mb-0 min-h-[34px] text-[11.5px] leading-[1.45] font-normal text-[#687a83]">
            {card.tagline}
          </p>
        </div>

        <ul className="mt-3.5 mb-0.5 grid list-none gap-2 p-0">
          {card.features.map((feature) => (
            <li
              key={feature.label}
              className="flex min-h-[27px] items-center gap-2 text-[11.5px] leading-[1.3] font-medium text-[#344d59]"
            >
              <SolutionFeatureIcon icon={feature.icon} accent={accent} soft={soft} />
              {feature.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function SolutionCard({ card, className }: SolutionCardProps) {
  const { accent } = showcaseAccent[card.accent];
  const finderPlanId = planFinderFamilyId[card.id] ?? card.id;

  const cardClassName = cn(
    "group/card relative flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-[#d7e1e7] bg-white text-inherit no-underline shadow-[0_12px_32px_rgba(24,49,64,0.055)] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--card-accent)_32%,#d7e1e7)] hover:shadow-[0_22px_46px_rgba(25,51,66,0.105)]",
    className
  );

  const style = { "--card-accent": accent } as CSSProperties;

  if (card.href) {
    return (
      <Link
        href={card.href}
        aria-label={`View ${card.name} product page`}
        data-h132-plan={finderPlanId}
        data-plan={card.id}
        className={cardClassName}
        style={style}
      >
        <SolutionCardContent card={card} />
      </Link>
    );
  }

  return (
    <article
      data-plan={card.id}
      data-h132-plan={finderPlanId}
      className={cardClassName}
      style={style}
    >
      <SolutionCardContent card={card} />
    </article>
  );
}
