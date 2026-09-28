import type { PlanPdpVariantContent } from "@/config/plan-pdp";
import { cn } from "@/lib/utils";

import { Eyebrow } from "@/components/layout/marketing";

import { PlanPdpContainer } from "./plan-pdp-container";

type PlanPdpOrderPathProps = {
  order: PlanPdpVariantContent["order"];
};

export function PlanPdpOrderPath({ order }: PlanPdpOrderPathProps) {
  const twoSteps = order.steps.length === 2;

  return (
    <section
      aria-label="What happens after you order"
      className="pdp-order-path"
    >
      <PlanPdpContainer>
        <div className="grid gap-[42px] rounded-[18px] border border-[#dce4e9] bg-[#f8fafb] p-[28px_30px] min-[901px]:grid-cols-[minmax(210px,0.62fr)_minmax(0,1.38fr)] max-[900px]:grid-cols-1 max-[900px]:gap-[22px] max-[700px]:px-5 max-[700px]:py-[23px]">
          <div>
            <Eyebrow className="mb-2 !text-inc-blue">After you order</Eyebrow>
            <h2 className="m-0 max-w-[330px] text-[clamp(24px,2.1vw,31px)] leading-[1.13] font-medium tracking-[-0.025em] text-[#1e333d]">
              {order.title}
            </h2>
          </div>
          <ol
            className={cn(
              "m-0 grid list-none gap-0 p-0",
              twoSteps
                ? "grid-cols-2 max-[700px]:grid-cols-1 max-[700px]:gap-[15px]"
                : "grid-cols-3 max-[700px]:grid-cols-1 max-[700px]:gap-[15px]"
            )}
          >
            {order.steps.map((step, index) => (
              <li
                key={step.title}
                className={cn(
                  "grid grid-cols-[34px_minmax(0,1fr)] gap-3 px-5 py-1 max-[900px]:px-3.5 max-[700px]:border-0 max-[700px]:p-0",
                  index > 0 && "border-l border-[#d9e1e6] max-[700px]:border-t max-[700px]:border-l-0 max-[700px]:pt-[15px]",
                  index === 0 && "max-[700px]:border-0 max-[700px]:pt-0"
                )}
              >
                <span className="grid size-[30px] place-items-center rounded-full bg-[#e9f2fc] text-[10px] font-extrabold text-inc-blue">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <strong className="mt-0.5 block text-[13.5px] font-bold text-[#203741]">
                    {step.title}
                  </strong>
                  <p className="mt-[5px] mb-0 text-[12.5px] leading-[1.45] text-[#64767e]">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </PlanPdpContainer>
    </section>
  );
}
