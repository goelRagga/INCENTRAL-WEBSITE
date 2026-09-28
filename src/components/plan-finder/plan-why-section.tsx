"use client";

import type { PlanNeedCopy } from "@/lib/plan-finder/plan-need-copy";
import { formatChipLabel } from "@/lib/plan-finder/plan-need-copy";
import { cn } from "@/lib/utils";

type PlanWhySectionProps = {
  copy: PlanNeedCopy;
};

export function PlanWhySection({ copy }: PlanWhySectionProps) {
  if (!copy.headline && !copy.selectedLabels.length && !copy.missingLabels.length) {
    return null;
  }

  const extras = copy.extras.slice(0, 3);
  const extraMore = Math.max(0, copy.extras.length - extras.length);
  const missing = copy.missingLabels.slice(0, 3);
  const missingMore = Math.max(0, copy.missingLabels.length - missing.length);

  return (
    <section
      aria-label="Why this solution"
      className={cn(
        "mt-4 rounded-[14px] border px-4 py-3.5",
        copy.tone === "positive" && "border-[#d2eadf] bg-[#f4fbf8]",
        copy.tone === "warning" && "border-[#f0dfc4] bg-[#fffaf0]",
        copy.tone === "neutral" && "border-[#dbe5e9] bg-[#f8fafb]"
      )}
    >
      <div className="mb-2.5">
        <span className="block text-[10px] font-semibold tracking-[0.08em] text-[#6a7880] uppercase">
          Why this solution
        </span>
        <strong className="mt-1 block text-[14px] leading-snug font-semibold text-[#173844]">
          {copy.headline}
        </strong>
      </div>

      {copy.selectedLabels.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {copy.selectedLabels.map((label) => (
            <span
              key={label}
              className="inline-flex rounded-full border border-[#c8ddf4] bg-[#eef5ff] px-2.5 py-1 text-[11px] font-medium text-[#1767ad]"
            >
              {formatChipLabel(label)}
            </span>
          ))}
        </div>
      ) : null}

      {extras.length > 0 ? (
        <div className="mt-3 rounded-[11px] border border-[#d2eadf] bg-white/80 px-3 py-2.5">
          <div className="mb-1.5">
            <strong className="block text-[12px] text-[#24745c]">Also included</strong>
            <small className="text-[11px] text-[#6b7d86]">Beyond your selection</small>
          </div>
          <ul className="m-0 list-none space-y-1 p-0 text-[12px] text-[#29444f]">
            {extras.map((label) => (
              <li key={label} className="flex gap-2">
                <span aria-hidden="true" className="text-[#24745c]">
                  ✓
                </span>
                {formatChipLabel(label)}
              </li>
            ))}
          </ul>
          {extraMore > 0 ? (
            <span className="mt-1.5 block text-[11px] text-[#6b7d86]">
              +{extraMore} more included
            </span>
          ) : null}
        </div>
      ) : null}

      {missing.length > 0 ? (
        <div className="mt-3 rounded-[11px] border border-[#f0d4d4] bg-white/80 px-3 py-2.5">
          <div className="mb-1.5">
            <strong className="block text-[12px] text-[#9a3d32]">Not covered</strong>
            <small className="text-[11px] text-[#6b7d86]">From your selection</small>
          </div>
          <ul className="m-0 list-none space-y-1 p-0 text-[12px] text-[#29444f]">
            {missing.map((label) => (
              <li key={label} className="flex gap-2">
                <span aria-hidden="true" className="text-[#9a3d32]">
                  ×
                </span>
                {formatChipLabel(label)}
              </li>
            ))}
          </ul>
          {missingMore > 0 ? (
            <span className="mt-1.5 block text-[11px] text-[#6b7d86]">
              +{missingMore} more not covered
            </span>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
