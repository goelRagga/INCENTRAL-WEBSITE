import { Eyebrow } from "@/components/layout/marketing";
import type { PlanPdpVariantContent } from "@/config/plan-pdp";

import { PlanPdpContainer } from "./plan-pdp-container";

type PlanPdpTechSectionProps = {
  tech: PlanPdpVariantContent["tech"];
};

export function PlanPdpTechSection({ tech }: PlanPdpTechSectionProps) {
  return (
    <section className="pdp-tech-section">
      <PlanPdpContainer>
        <div className="mb-[22px] grid items-end gap-3 min-[1051px]:grid-cols-[minmax(0,0.78fr)_minmax(320px,0.72fr)] min-[1051px]:gap-12">
          <div>
            <Eyebrow>Technical reference</Eyebrow>
            <h2 className="m-0 text-[clamp(27px,2.4vw,35px)] leading-[1.04] font-normal tracking-[-0.042em] text-[#17212b] max-[620px]:text-[32px]">
              Hardware specifications.
            </h2>
          </div>
          <p className="m-0 max-w-[610px] text-[14.5px] leading-[1.6] text-[#60727c]">
            Open the specification sheet when you need the complete hardware reference.
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <details className="group overflow-hidden rounded-[18px] border border-[#dbe5eb] bg-white shadow-[0_10px_26px_rgba(25,45,58,0.04)] max-[620px]:rounded-2xl">
              <summary className="flex min-h-[92px] cursor-pointer list-none items-center justify-between gap-[22px] bg-gradient-to-b from-white to-[#f8fbfd] px-[22px] py-5 transition-colors hover:bg-[#f5f9fc] max-[620px]:min-h-[78px] max-[620px]:gap-3 max-[620px]:px-4 max-[620px]:py-4 [&::-webkit-details-marker]:hidden">
                <span className="flex min-w-0 flex-col gap-[5px]">
                  <span className="text-[10.5px] font-semibold tracking-[0.085em] text-[#1765a9] uppercase">
                    Full hardware specifications
                  </span>
                  <strong className="text-[22px] leading-[1.15] font-medium tracking-[-0.025em] text-[#18262e] max-[620px]:text-[19px]">
                    {tech.deviceName}
                  </strong>
                </span>
                <span className="flex shrink-0 items-center gap-3 text-xs font-semibold whitespace-nowrap text-[#44616f] max-[620px]:gap-0 max-[620px]:text-[0]">
                  <span className="group-open:hidden max-[620px]:hidden">View specifications</span>
                  <span className="hidden group-open:inline max-[620px]:hidden">Hide specifications</span>
                  <span
                    aria-hidden="true"
                    className="relative size-[30px] rounded-full border border-[#cfdce4] bg-white before:absolute before:top-1/2 before:left-1/2 before:h-px before:w-2.5 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-sm before:bg-[#1765a9] after:absolute after:top-1/2 after:left-1/2 after:h-px after:w-2.5 after:-translate-x-1/2 after:-translate-y-1/2 after:rotate-90 after:rounded-sm after:bg-[#1765a9] after:transition-transform group-open:after:rotate-0"
                  />
                </span>
              </summary>
              <div className="border-t border-[#e4ebef] bg-[#f8fbfd]">
                <div className="bg-white px-5 pt-4 pb-0">
                  <p className="m-0 text-xs leading-[1.6] text-[#62747e]">{tech.intro}</p>
                </div>
                <div className="mt-3.5 border-t border-[#edf1f4] bg-white text-[#1d2930]">
                  <table className="w-full table-fixed border-collapse max-[620px]:table-auto">
                    <tbody>
                      {tech.rows.map((row) =>
                        row.type === "group" ? (
                          <tr key={row.label}>
                            <th
                              colSpan={2}
                              className="border-b border-[#dbe7ef] bg-[#eef5fb] px-4 py-[13px] pb-2 text-left text-[10px] font-semibold tracking-[0.075em] text-[#1765a9] uppercase"
                            >
                              {row.label}
                            </th>
                          </tr>
                        ) : (
                          <tr key={`${row.label}-${row.value}`}>
                            <th
                              scope="row"
                              className="w-[31%] border-b border-[#e8eef2] bg-[#fbfcfd] px-4 py-3 text-left text-xs leading-[1.5] font-semibold text-[#526873] max-[620px]:block max-[620px]:w-full max-[620px]:border-b-0 max-[620px]:pb-0.5"
                            >
                              {row.label}
                            </th>
                            <td className="border-b border-[#e8eef2] px-4 py-3 text-left text-xs leading-[1.5] font-medium wrap-anywhere text-[#25333b] max-[620px]:block max-[620px]:w-full max-[620px]:pt-0.5">
                              {row.value}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </details>
          </div>
        </div>
      </PlanPdpContainer>
    </section>
  );
}
