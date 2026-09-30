"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Spin } from "antd";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";

import { Container } from "@/components/common/container";
import { PlanFinderVehicleStepLink } from "@/components/plan-finder/plan-finder-vehicle-step-link";
import { useAuth } from "@/hooks/use-auth";
import {
  clearQuoteContext,
  isCartQuoteContext,
  isQuoteContextValid,
  loadQuoteContext,
  PLAN_FALLBACK_OPTIONS,
  quoteAsideCopy,
  quotePlanLabel,
  quoteQuantity,
  routeLabel,
  unsupportedStateLabels,
  vehicleLabel,
  type QuoteContextRecord,
} from "@/lib/get-a-quote/quote-context-utils";
import { cn } from "@/lib/utils";

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-[#17242b]">
      {children}
      {required ? (
        <>
          <span aria-hidden="true" className="required-marker ml-0.5">
            *
          </span>
          <span className="sr-only"> required</span>
        </>
      ) : null}
    </label>
  );
}

const fieldClass =
  "min-h-[46px] w-full rounded-xl border border-[#cfdbe1] bg-white px-3 text-sm text-[#19272e] outline-none transition-[border-color,box-shadow] focus:border-[#3287d8] focus:shadow-[0_0_0_4px_rgba(50,135,216,0.11)]";

export function GetAQuotePageContent() {
  const searchParams = useSearchParams();
  const { session, isAuthenticated } = useAuth();
  const [context, setContext] = useState<QuoteContextRecord | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fleetSize, setFleetSize] = useState("");
  const [plan, setPlan] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setContext(loadQuoteContext());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !isAuthenticated) return;
    if (name.trim() && email.trim()) return;
    setName((v) => v || session?.name || "");
    setCompany((v) => v || session?.company || "");
    setEmail((v) => v || session?.email || "");
    setPhone((v) => v || session?.mobile || "");
  }, [hydrated, isAuthenticated, session, name, email]);

  const cartContext = isCartQuoteContext(context);
  const contextValid = isQuoteContextValid(context);

  const aside = useMemo(() => {
    if (!contextValid || !context) {
      return {
        eyebrow: "Fleet enquiry",
        title: "Get a Quote",
        lead: "Share your vehicle and plan details with our team to get a quote.",
      };
    }
    return quoteAsideCopy(context, cartContext);
  }, [context, contextValid, cartContext]);

  const accountPrefilled =
    isAuthenticated &&
    Boolean(session?.name || session?.email || session?.mobile);

  const formTitle = contextValid
    ? accountPrefilled
      ? "Confirm your contact details"
      : "Your contact details"
    : "Quote request";

  const formIntro = contextValid
    ? accountPrefilled
      ? "Review your contact details and add any notes before submitting."
      : "Add your contact details and any notes for our team."
    : "Choose the plan and device quantity, then add your contact details.";

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const submitQuote = (
        window as Window & {
          INCENTRAL_SUBMIT_QUOTE?: (payload: unknown) => Promise<{ ok?: boolean } | false>;
        }
      ).INCENTRAL_SUBMIT_QUOTE;

      const payload = {
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: phone.trim(),
        fleetSize: contextValid && context
          ? String(quoteQuantity(context, cartContext))
          : fleetSize.trim(),
        plan:
          contextValid && context
            ? cartContext
              ? quotePlanLabel(context, cartContext)
              : `${context.planName}, ${routeLabel(context, cartContext)}`
            : plan.trim(),
        notes: notes.trim(),
        source: contextValid
          ? context?.source || searchParams.get("source") || "homepage-configurator"
          : "direct-quote-page",
        quoteReason: context?.quoteReasonLabel || "",
      };

      if (submitQuote && searchParams.get("review") !== "1") {
        const result = await submitQuote(payload);
        if (result === false || result?.ok === false) {
          throw new Error("Quote request was not accepted.");
        }
      }

      clearQuoteContext();
      setComplete(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We could not submit the quote request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) return null;

  const qty =
    contextValid && context ? quoteQuantity(context, cartContext) : null;
  const states =
    contextValid && context
      ? unsupportedStateLabels(context, cartContext)
      : [];
  const stateText = states.length
    ? `${states.join(", ")} (AIS-140 availability pending)`
    : context?.stateLabel || "";

  return (
    <main id="main" className="page-shell bg-white py-12 min-[1100px]:py-16">
      <Container>
        <div
          className={cn(
            "grid items-start gap-10 min-[1100px]:grid-cols-[minmax(280px,0.75fr)_minmax(0,1.25fr)] min-[1100px]:gap-12",
            complete && "min-[1100px]:items-start"
          )}
        >
          <aside className="min-w-0 min-[1100px]:sticky min-[1100px]:top-[104px]">
            <p className="eyebrow">{complete ? "Quote request" : aside.eyebrow}</p>
            <h1 className="m-0 text-[clamp(34px,3vw,48px)] leading-[1.05] font-normal tracking-[-0.04em] text-[#172126]">
              {complete ? "Thank you" : aside.title}
            </h1>
            <p className="lead mt-3.5 max-w-[520px] text-[15px] leading-[1.6] text-[#627680]">
              {complete
                ? "We received your quote request. Our team will review the request and contact you using the details you provided."
                : aside.lead}
            </p>
          </aside>

          <div className="min-w-0">
            {complete ? (
              <section
                aria-live="polite"
                className="rounded-[20px] border border-[#c9dbe9] bg-[linear-gradient(180deg,#fff_0%,#f8fbfe_100%)] p-[clamp(24px,2.4vw,30px)] shadow-[0_14px_36px_rgba(24,40,51,0.06)]"
                tabIndex={-1}
              >
                <div
                  aria-hidden="true"
                  className="mb-[22px] grid size-12 place-items-center rounded-full bg-[#eaf4ff] text-2xl font-semibold text-[#0565cf]"
                >
                  ✓
                </div>
                <p className="eyebrow">Request received</p>
                <h2 className="m-0 text-[clamp(30px,3vw,40px)] leading-[1.05] font-medium tracking-[-0.035em] text-[#172126]">
                  We received your quote request.
                </h2>
                <p className="mt-3 max-w-[660px] text-[15px] leading-[1.58] text-[#5d707a]">
                  Thanks, <strong>{name.trim().split(/\s+/)[0] || "there"}</strong>.
                  Your request has been submitted.
                </p>
                <div className="mt-6 grid overflow-hidden rounded-[14px] border border-[#d9e5ec] bg-white min-[900px]:grid-cols-3">
                  <div className="p-4 min-[900px]:border-r min-[900px]:border-[#d9e5ec]">
                    <span className="block text-[10.5px] font-semibold tracking-[0.07em] text-[#71838d] uppercase">
                      Plan
                    </span>
                    <strong className="mt-1.5 block text-sm leading-snug font-semibold text-[#173746]">
                      {contextValid && context
                        ? cartContext
                          ? quotePlanLabel(context, cartContext)
                          : `${context.planName}, ${routeLabel(context, cartContext)}`
                        : plan || "Not specified"}
                    </strong>
                  </div>
                  <div className="border-t border-[#d9e5ec] p-4 min-[900px]:border-t-0 min-[900px]:border-r min-[900px]:border-[#d9e5ec]">
                    <span className="block text-[10.5px] font-semibold tracking-[0.07em] text-[#71838d] uppercase">
                      Devices
                    </span>
                    <strong className="mt-1.5 block text-sm font-semibold text-[#173746]">
                      {qty ?? fleetSize ?? "Not specified"} device
                      {Number(qty ?? fleetSize) === 1 ? "" : "s"}
                    </strong>
                  </div>
                  {contextValid ? (
                    <div className="border-t border-[#d9e5ec] p-4 min-[900px]:border-t-0">
                      <span className="block text-[10.5px] font-semibold tracking-[0.07em] text-[#71838d] uppercase">
                        Vehicle details
                      </span>
                      <strong className="mt-1.5 block text-sm leading-snug font-semibold text-[#173746]">
                        {cartContext
                          ? "Multiple vehicle or configuration selections"
                          : vehicleLabel(context!) || "Selected vehicle details"}
                      </strong>
                    </div>
                  ) : null}
                </div>
                <div className="mt-6 border-t border-[#dce6eb] pt-5">
                  <h3 className="m-0 text-[17px] font-semibold text-[#1a303b]">
                    What happens next
                  </h3>
                  <div className="mt-3.5 grid gap-3 min-[760px]:grid-cols-2">
                    <div className="grid grid-cols-[34px_minmax(0,1fr)] items-start gap-2.5 rounded-xl bg-[#f2f7fb] p-3.5">
                      <span className="grid size-[30px] place-items-center rounded-full border border-[#bed4e7] text-[10px] font-semibold text-[#0565cf]">
                        01
                      </span>
                      <p className="m-0 text-[12.5px] leading-snug text-[#647780]">
                        <strong className="mb-0.5 block text-[#263e4a]">
                          Request review
                        </strong>
                        We review the vehicle, quantity and AIS-140 requirements you
                        submitted.
                      </p>
                    </div>
                    <div className="grid grid-cols-[34px_minmax(0,1fr)] items-start gap-2.5 rounded-xl bg-[#f2f7fb] p-3.5">
                      <span className="grid size-[30px] place-items-center rounded-full border border-[#bed4e7] text-[10px] font-semibold text-[#0565cf]">
                        02
                      </span>
                      <p className="m-0 text-[12.5px] leading-snug text-[#647780]">
                        <strong className="mb-0.5 block text-[#263e4a]">
                          We contact you
                        </strong>
                        Our team will contact you to confirm availability, pricing and
                        next steps.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2.5 border-t border-[#dce6eb] pt-5 max-[760px]:[&_.btn]:w-full">
                  <PlanFinderVehicleStepLink href="/#check-compatibility" className="btn primary">
                    Back to solution finder
                  </PlanFinderVehicleStepLink>
                  <Link href="/" className="btn secondary">
                    Return Home
                  </Link>
                </div>
              </section>
            ) : (
              <>
                {contextValid && context ? (
                  <section
                    aria-labelledby="quoteContextTitle"
                    className="mb-4 rounded-[20px] border border-[#cbdde8] bg-[#f5f9fc] p-[18px_20px_20px] shadow-none"
                  >
                    <div className="flex items-start justify-between gap-4 border-b border-[#d9e7ef] pb-3.5 max-[620px]:block">
                      <div>
                        <p className="eyebrow !mb-1">Your selection</p>
                        <h2
                          id="quoteContextTitle"
                          className="m-0 text-lg font-semibold tracking-[-0.02em] text-[#183440]"
                        >
                          Review your selection
                        </h2>
                      </div>
                      <PlanFinderVehicleStepLink
                        href="/#check-compatibility"
                        className="inline-flex min-h-9 shrink-0 items-center rounded-[10px] border border-[#c7dbea] bg-white px-3 text-xs font-semibold text-[#0968bc] no-underline hover:bg-[#edf6fd] max-[620px]:mt-2.5"
                      >
                        Edit selection
                      </PlanFinderVehicleStepLink>
                    </div>
                    <div className="mt-3.5 grid overflow-hidden rounded-[14px] border border-[#d5e3ea] bg-white min-[980px]:grid-cols-4">
                      <ContextCell label="Plan" value={
                        cartContext
                          ? quotePlanLabel(context, cartContext)
                          : `${context.planName} · ${routeLabel(context, cartContext)}`
                      } />
                      <ContextCell
                        label="Devices"
                        value={`${quoteQuantity(context, cartContext)} device${quoteQuantity(context, cartContext) === 1 ? "" : "s"}`}
                      />
                      <ContextCell label="AIS-140 option" value={routeLabel(context, cartContext)} />
                      <ContextCell
                        label="Hardware"
                        value={
                          cartContext
                            ? "Multiple device configurations"
                            : context.hardware || "To be confirmed"
                        }
                      />
                      {context.quoteReasonLabel ? (
                        <div className="col-span-full border-t border-[#d5e3ea] p-[14px_15px] min-[980px]:col-span-2">
                          <span className="block text-[9.5px] font-bold tracking-[0.065em] text-[#74858e] uppercase">
                            Why a quote is required
                          </span>
                          <strong className="mt-1 block text-[12.5px] leading-snug font-semibold text-[#7a3d00]">
                            {context.quoteReasonLabel}
                          </strong>
                        </div>
                      ) : null}
                      <div className="col-span-full border-t border-[#d5e3ea] bg-[#fbfdff] p-[14px_15px]">
                        <span className="block text-[9.5px] font-bold tracking-[0.065em] text-[#74858e] uppercase">
                          Vehicle details
                        </span>
                        <strong className="mt-1 block text-[13px] leading-snug font-semibold text-[#1c3946]">
                          {cartContext
                            ? "Multiple vehicle or configuration selections"
                            : vehicleLabel(context)}
                        </strong>
                      </div>
                      {stateText ? (
                        <div className="col-span-full border-t border-[#d5e3ea] bg-[#fbfdff] p-[14px_15px]">
                          <span className="block text-[9.5px] font-bold tracking-[0.065em] text-[#74858e] uppercase">
                            State
                          </span>
                          <strong className="mt-1 block text-[12.5px] font-semibold text-[#1c3946]">
                            {stateText}
                          </strong>
                        </div>
                      ) : null}
                    </div>
                    {cartContext && context.cartItems?.length ? (
                      <div className="mt-3.5 overflow-hidden rounded-[14px] border border-[#d5e3ea] bg-white">
                        <div className="border-b border-[#e1e9ee] bg-[#f8fbfd] px-[15px] py-3">
                          <span className="block text-[10px] font-bold tracking-[0.065em] text-[#74858e] uppercase">
                            Included in this request
                          </span>
                        </div>
                        <div className="divide-y divide-[#e8eef1]">
                          {context.cartItems.map((item, index) => {
                            const lineName =
                              [item.planName, item.line]
                                .filter(Boolean)
                                .join(" · ") || "Selected solution";
                            const vehicle = [
                              item.segmentLabel,
                              item.manufacturerLabel,
                              item.emission,
                            ]
                              .filter(Boolean)
                              .join(" · ");
                            const state =
                              item.aisRequired && item.stateLabel
                                ? ` · ${item.stateLabel}`
                                : "";
                            const itemQty = Math.max(1, Number(item.quantity) || 1);
                            return (
                              <div
                                key={`${item.sku}-${index}`}
                                className="grid items-center gap-2 px-[15px] py-3 min-[620px]:grid-cols-[minmax(0,1fr)_auto]"
                              >
                                <div>
                                  <strong className="block text-[13px] font-semibold text-[#1c3946]">
                                    {lineName}
                                  </strong>
                                  <small className="mt-0.5 block text-[11.5px] leading-snug text-[#6f8088]">
                                    {vehicle || "Vehicle details saved"}
                                    {state}
                                  </small>
                                </div>
                                <span className="text-xs font-semibold text-[#314851]">
                                  {itemQty} device{itemQty === 1 ? "" : "s"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </section>
                ) : null}

                <form
                  className="form-card rounded-[28px] border border-[#d9e3e8] bg-white p-[clamp(24px,2.4vw,30px)] shadow-[0_20px_60px_rgba(15,45,64,0.07)]"
                  onSubmit={onSubmit}
                >
                  <h2 className="m-0 text-[27px] font-medium tracking-[-0.03em] text-[#172126]">
                    {formTitle}
                  </h2>
                  <p className="quote-v168-form-intro mt-1.5 mb-0 max-w-[680px] text-[13px] leading-snug text-[#667983]">
                    {formIntro}
                  </p>
                  <p className="quote-v357-next-note mt-3 mb-0 text-xs leading-snug text-[#677981]">
                    After you submit, our team will review the request and contact you.
                  </p>

                  <div className="form-grid mt-[18px]">
                    <div className="field">
                      <FieldLabel htmlFor="qName" required>
                        Full name
                      </FieldLabel>
                      <input
                        id="qName"
                        name="name"
                        autoComplete="name"
                        required
                        className={fieldClass}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <FieldLabel htmlFor="qCompany" required>
                        Company
                      </FieldLabel>
                      <input
                        id="qCompany"
                        name="company"
                        autoComplete="organization"
                        required
                        className={fieldClass}
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <FieldLabel htmlFor="qEmail" required>
                        Work email
                      </FieldLabel>
                      <input
                        id="qEmail"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className={fieldClass}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <FieldLabel htmlFor="qPhone" required>
                        Mobile number
                      </FieldLabel>
                      <input
                        id="qPhone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        className={fieldClass}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    {!contextValid ? (
                      <>
                        <div className="field">
                          <FieldLabel htmlFor="qFleet" required>
                            Number of devices
                          </FieldLabel>
                          <input
                            id="qFleet"
                            name="fleetSize"
                            type="number"
                            min={1}
                            step={1}
                            inputMode="numeric"
                            required
                            className={fieldClass}
                            value={fleetSize}
                            onChange={(e) => setFleetSize(e.target.value)}
                          />
                        </div>
                        <div className="field">
                          <FieldLabel htmlFor="qPlan" required>
                            Plan
                          </FieldLabel>
                          <select
                            id="qPlan"
                            name="plan"
                            required
                            className={cn(fieldClass, "appearance-none")}
                            value={plan}
                            onChange={(e) => setPlan(e.target.value)}
                          >
                            <option value="">Select plan</option>
                            {PLAN_FALLBACK_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    ) : null}
                    <div className="field full">
                      <FieldLabel htmlFor="qNotes">
                        Additional details, optional
                      </FieldLabel>
                      <textarea
                        id="qNotes"
                        name="notes"
                        placeholder="Rollout timing, installation requirements or any other useful details"
                        className={cn(
                          fieldClass,
                          "min-h-[100px] resize-y py-3 leading-normal"
                        )}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>

                  {error ? (
                    <div
                      className="form-result warn mt-3.5 rounded-[11px] border border-[#f0dcc4] bg-[#fff7f0] px-3.5 py-3 text-[13px] text-[#7a4a12]"
                      tabIndex={-1}
                    >
                      {error}
                    </div>
                  ) : null}

                  <div className="form-footer-row">
                    <p className="form-required-note">
                      <span aria-hidden="true" className="required-marker">
                        *
                      </span>{" "}
                      Fields marked with an asterisk are mandatory.
                    </p>
                    <div className="form-actions">
                      <PlanFinderVehicleStepLink
                        href="/#check-compatibility"
                        className="btn secondary"
                      >
                        Back to solution finder
                      </PlanFinderVehicleStepLink>
                      <button
                        type="submit"
                        className="btn primary inline-flex items-center gap-2"
                        disabled={submitting}
                      >
                        {submitting ? <Spin size="small" /> : null}
                        {submitting ? "Submitting…" : "Submit quote request"}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}

function ContextCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-[#e1e9ee] p-[14px_15px] first:border-t-0 min-[980px]:border-t-0 min-[980px]:not-first:border-l min-[980px]:border-[#e1e9ee]">
      <span className="block text-[9.5px] font-bold tracking-[0.065em] text-[#74858e] uppercase">
        {label}
      </span>
      <strong className="mt-1 block text-[12.5px] leading-snug font-semibold text-[#1c3946] break-words">
        {value}
      </strong>
    </div>
  );
}
