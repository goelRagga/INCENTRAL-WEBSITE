import Link from "next/link";

import { footerSupport } from "@/config/footer";

export function CartEmptyState() {
  return (
    <section className="grid gap-6 min-[960px]:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
      <div className="rounded-[20px] border border-[#d8e4e9] bg-white px-8 py-10 shadow-[0_10px_28px_rgba(20,48,64,0.05)] max-[760px]:px-6 max-[760px]:py-8">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-[14px] bg-[#eef5ff] text-[#1767ad]"
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 4h2l2.1 9.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 7H6.1" />
              <circle cx="10" cy="19" r="1.3" />
              <circle cx="18" cy="19" r="1.3" />
            </svg>
          </span>
          <p className="m-0 text-[11px] font-bold tracking-[0.1em] text-[#1767ad] uppercase">
            Your cart is empty
          </p>
        </div>
        <h2 className="mt-4 mb-0 text-[28px] font-normal tracking-[-0.03em] text-[#163541]">
          Start by finding the right plan
        </h2>
        <p className="mt-2 mb-0 max-w-[480px] text-[15px] leading-[1.55] text-[#61747d]">
          Check each vehicle type to see which solutions are compatible.
        </p>
        <Link
          href="/#check-compatibility"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-inc-blue bg-inc-blue px-5 text-[14px] font-semibold text-white no-underline hover:bg-inc-blue-dark"
        >
          Find the right solution
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <aside className="rounded-[20px] border border-[#d8e4e9] bg-[linear-gradient(180deg,#f8fafb_0%,#eef4f7_100%)] p-6">
        <p className="m-0 text-[11px] font-bold tracking-[0.1em] text-[#1767ad] uppercase">
          Fleet support
        </p>
        <h3 className="mt-2 mb-0 text-[20px] font-semibold tracking-[-0.02em] text-[#163541]">
          Talk to our team about your fleet
        </h3>
        <p className="mt-2 mb-0 text-[13.5px] leading-[1.5] text-[#61747d]">
          Contact us for help with mixed fleets, plan selection or installation.
        </p>
        <div className="mt-5 grid gap-2">
          <a
            href={footerSupport.phone.href}
            className="flex items-center gap-3 rounded-[12px] border border-[#dbe5eb] bg-white px-3 py-2.5 no-underline"
          >
            <span className="text-[12px] text-[#829199]">Phone</span>
            <strong className="text-[14px] text-[#173844]">{footerSupport.phone.value}</strong>
          </a>
          <a
            href={footerSupport.email.href}
            className="flex items-center gap-3 rounded-[12px] border border-[#dbe5eb] bg-white px-3 py-2.5 no-underline"
          >
            <span className="text-[12px] text-[#829199]">Email</span>
            <strong className="text-[14px] text-[#173844]">{footerSupport.email.value}</strong>
          </a>
        </div>
        <Link
          href="/support"
          className="mt-4 inline-flex text-[13px] font-semibold text-[#1767ad] no-underline hover:underline"
        >
          Contact Support →
        </Link>
      </aside>
    </section>
  );
}
