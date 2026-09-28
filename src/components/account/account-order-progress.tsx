import { orderStageRank } from "@/lib/account/format";
import type { AccountOrder } from "@/lib/account/types";

const PROGRESS_LABELS = ["Placed", "Confirmed", "Packed", "Shipped", "Delivered"];

export function AccountOrderProgress({ order }: { order: AccountOrder }) {
  const current = orderStageRank(order.stage || order.status);
  return (
    <div className="a295-progress">
      <div className="a295-progress-track">
        {PROGRESS_LABELS.map((label, i) => {
          const stepState =
            i < current ? "is-done" : i === current ? "is-current" : "is-upcoming";
          const marker =
            i < current ? (
              "✓"
            ) : i === current ? (
              <span className="a295-progress-dot-core" />
            ) : (
              ""
            );
          return (
            <div
              key={label}
              className={`a295-progress-step ${stepState}`}
              {...(i === current ? { "aria-current": "step" as const } : {})}
            >
              <span className="a295-progress-node" aria-hidden>
                <span className="a295-progress-dot">{marker}</span>
              </span>
              <span className="a295-progress-label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
