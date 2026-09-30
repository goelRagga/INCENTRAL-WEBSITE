"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Spin } from "antd";

import { supportPage } from "@/config/support";
import { cn } from "@/lib/utils";

import { supportFieldClassName } from "./support-field-styles";
import { SupportSelectField } from "./support-select-field";

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
          <span aria-hidden="true" className="ml-0.5 text-[#c0392b]">
            *
          </span>
          <span className="sr-only"> required</span>
        </>
      ) : null}
    </label>
  );
}

export function SupportRequestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState({
    category: "",
    email: "",
    order: "",
  });

  const { form, success } = supportPage;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = formRef.current;
    if (!formElement?.reportValidity()) return;

    if (!category.trim()) {
      setError("Please select an issue category.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const data = new FormData(formElement);
    const nextSummary = {
      category: category.trim() || "Support request",
      email: String(data.get("email") || "").trim() || "Submitted contact",
      order: String(data.get("orderReference") || "").trim() || "Not provided",
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSummary(nextSummary);
      setSubmitted(true);
      successRef.current?.focus({ preventScroll: true });
      successRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "center",
      });
    } catch {
      setError(form.errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAnother = () => {
    setSubmitted(false);
    setError(null);
    setCategory("");
    formRef.current?.reset();
    formRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    document.getElementById("sCategory")?.focus({ preventScroll: true });
  };

  if (submitted) {
    return (
      <section
        ref={successRef}
        tabIndex={-1}
        aria-live="polite"
        className="flex min-h-[560px] flex-col justify-center rounded-[28px] border border-[#d9e3e8] bg-white p-[clamp(24px,2.4vw,30px)] shadow-[0_20px_60px_rgba(15,45,64,0.07)]"
      >
        <div
          aria-hidden="true"
          className="mb-[22px] grid size-[62px] place-items-center rounded-[20px] bg-[#e8f7f0] text-[#147a50]"
        >
          <svg viewBox="0 0 24 24" className="size-[31px]" aria-hidden="true">
            <path
              d="M20 6 9 17l-5-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
            />
          </svg>
        </div>

        <p className="mb-2.5 text-[12px] font-semibold tracking-[0.085em] text-[#1767ad] uppercase">
          {success.eyebrow}
        </p>
        <h2 className="m-0 text-[clamp(34px,3.5vw,48px)] leading-[1.04] font-normal tracking-[-0.035em] text-[#17242b]">
          {success.title}
        </h2>
        <p className="mt-3 mb-0 max-w-[620px] text-[17px] leading-[1.6] text-[#61727c]">
          {success.lead}
        </p>

        <div
          aria-label="Submitted support request summary"
          className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-[#dde5e9] bg-[#dde5e9] max-[640px]:grid-cols-1"
        >
          {[
            { label: success.summaryLabels.category, value: summary.category },
            { label: success.summaryLabels.email, value: summary.email },
            { label: success.summaryLabels.order, value: summary.order },
            { label: success.summaryLabels.direct, value: success.directSupport },
          ].map((item) => (
            <div key={item.label} className="bg-[#f8fafb] px-[18px] py-[17px]">
              <span className="block text-xs font-semibold tracking-[0.07em] text-[#72818a] uppercase">
                {item.label}
              </span>
              <strong className="mt-1.5 block text-[15px] font-semibold wrap-anywhere text-[#17242b]">
                {item.value}
              </strong>
            </div>
          ))}
        </div>

        <div className="mt-6 border-l-[3px] border-[#0b65ce] bg-[#f5f9fd] px-5 py-[18px]">
          <strong className="mb-1 block text-[#17242b]">{success.nextTitle}</strong>
          <p className="m-0 text-[#5e707a] leading-[1.55]">{success.nextDescription}</p>
        </div>

        <div className="mt-7 flex flex-wrap gap-3 max-[640px]:flex-col">
          <Link
            href={success.myInCentral.href}
            className="inline-flex min-h-12 items-center justify-center rounded-[999px] border border-inc-blue bg-inc-blue px-[22px] text-[15px] font-semibold text-white no-underline transition-colors hover:border-inc-blue-dark hover:bg-inc-blue-dark max-[640px]:w-full"
          >
            {success.myInCentral.label}
          </Link>
          <button
            type="button"
            onClick={handleSubmitAnother}
            className="inline-flex min-h-12 items-center justify-center rounded-[999px] border border-[#2a3338] bg-white px-[22px] text-[15px] font-semibold text-inc-ink transition-colors hover:bg-[#f6f7f7] max-[640px]:w-full"
          >
            {success.againLabel}
          </button>
        </div>
      </section>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-[#d9e3e8] bg-white p-[clamp(24px,2.4vw,30px)] shadow-[0_20px_60px_rgba(15,45,64,0.07)]"
    >
      <div className="mb-3.5 flex items-start justify-between gap-6 max-[640px]:block">
        <div>
          <h2 className="m-0 text-[27px] font-normal tracking-[-0.02em] text-[#17242b]">
            {form.title}
          </h2>
          <p className="mt-[7px] mb-0 text-sm text-[#6a7b84]">{form.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[11px] max-[760px]:grid-cols-1">
        <SupportSelectField
          id="sCategory"
          name="category"
          value={category}
          onValueChange={setCategory}
          options={form.categories}
          placeholder={form.fields.category.placeholder}
          required={form.fields.category.required}
          label={
            <>
              {form.fields.category.label}
              {form.fields.category.required ? (
                <>
                  <span aria-hidden="true" className="ml-0.5 text-[#c0392b]">
                    *
                  </span>
                  <span className="sr-only"> required</span>
                </>
              ) : null}
            </>
          }
        />

        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="sOrder">{form.fields.orderReference.label}</FieldLabel>
          <input
            id="sOrder"
            name="orderReference"
            autoComplete="off"
            className={supportFieldClassName}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="sEmail" required={form.fields.email.required}>
            {form.fields.email.label}
          </FieldLabel>
          <input
            id="sEmail"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={supportFieldClassName}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="sPhone" required={form.fields.phone.required}>
            {form.fields.phone.label}
          </FieldLabel>
          <input
            id="sPhone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            className={supportFieldClassName}
          />
        </div>

        <div className="col-span-2 flex flex-col gap-1.5 max-[760px]:col-span-1">
          <FieldLabel htmlFor="sDesc" required={form.fields.description.required}>
            {form.fields.description.label}
          </FieldLabel>
          <textarea
            id="sDesc"
            name="description"
            required
            placeholder={form.fields.description.placeholder}
            className={cn(
              supportFieldClassName,
              "h-auto min-h-[78px] resize-y py-[11px] leading-[1.45]"
            )}
          />
        </div>

        <div className="col-span-2 flex flex-col gap-1.5 max-[760px]:col-span-1">
          <FieldLabel htmlFor="sFiles">{form.fields.attachments.label}</FieldLabel>
          <input
            id="sFiles"
            name="attachments"
            type="file"
            accept="image/*,.pdf"
            multiple
            className="min-h-12 w-full cursor-pointer rounded-[14px] border border-[#c9d5dc] bg-white px-2.5 py-2 text-sm text-[#667780] file:mr-3.5 file:min-h-10 file:cursor-pointer file:rounded-full file:border file:border-[#b9c9d2] file:bg-[#f5f8fa] file:px-[18px] file:text-[13px] file:font-semibold file:text-[#173447] hover:file:border-[#8eabbc] hover:file:bg-[#edf4f8] hover:file:text-[#0b65ce]"
          />
          <span className="mt-1 text-xs leading-[1.45] text-[#76858d]">
            {form.fields.attachments.hint}
          </span>
        </div>
      </div>

      {error ? (
        <div
          tabIndex={-1}
          className="mt-[18px] rounded-xl bg-[#fff3f1] px-[15px] py-[13px] text-sm text-[#9d2d23]"
        >
          {error}
        </div>
      ) : null}

      <div className="mt-3.5 flex flex-wrap items-end justify-between gap-4 max-[760px]:flex-col max-[760px]:items-stretch">
        <p className="m-0 text-xs text-[#687680]">
          <span aria-hidden="true" className="text-[#c0392b]">
            *
          </span>{" "}
          {form.requiredNote}
        </p>
        <div className="flex flex-wrap gap-3 max-[760px]:flex-col">
          <Link
            href={form.helpLink.href}
            className="inline-flex min-h-12 items-center justify-center rounded-[999px] border border-[#2a3338] bg-white px-[22px] text-[15px] font-semibold text-inc-ink no-underline transition-colors hover:bg-[#f6f7f7] max-[760px]:w-full"
          >
            {form.helpLink.label}
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[999px] border border-inc-blue bg-inc-blue px-[22px] text-[15px] font-semibold text-white transition-colors hover:border-inc-blue-dark hover:bg-inc-blue-dark disabled:cursor-not-allowed disabled:opacity-70 max-[760px]:w-full"
          >
            {submitting ? <Spin size="small" /> : null}
            {submitting ? form.submittingLabel : form.submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
