"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Spin } from "antd";

import { Logo } from "@/components/common/logo";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const FLEET_SIZE_OPTIONS = [
  "1 to 10 vehicles",
  "11 to 50 vehicles",
  "51 to 200 vehicles",
  "201 to 1,000 vehicles",
  "1,000+ vehicles",
] as const;

const INTEREST_OPTIONS = [
  "Vehicle tracking and fleet visibility",
  "Fuel and maintenance intelligence",
  "Predictive vehicle health",
  "Video telematics and driver safety",
  "Full fleet intelligence",
  "Not sure yet",
] as const;

export function RegionUnavailablePage() {
  const searchParams = useSearchParams();
  const [regionName, setRegionName] = useState("your region");
  const [showDetected, setShowDetected] = useState(false);
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCountry, setSuccessCountry] = useState("your region");

  useEffect(() => {
    document.body.classList.add("geo-page");
    return () => document.body.classList.remove("geo-page");
  }, []);

  useEffect(() => {
    const code = (
      searchParams.get("country") ||
      searchParams.get("cc") ||
      ""
    )
      .trim()
      .toUpperCase();
    const explicit =
      searchParams.get("countryName")?.trim() ||
      searchParams.get("region")?.trim() ||
      "";

    let resolved = explicit;
    if (!resolved && code.length === 2 && typeof Intl !== "undefined") {
      try {
        resolved =
          new Intl.DisplayNames(["en"], { type: "region" }).of(code) || "";
      } catch {
        resolved = "";
      }
    }
    if (resolved) {
      setRegionName(resolved);
      setShowDetected(true);
    }
  }, [searchParams]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    setSubmitting(true);
    try {
      const submitInterest = (
        window as Window & {
          INCENTRAL_SUBMIT_PRODUCT_INTEREST?: (
            data: unknown
          ) => Promise<{ ok?: boolean } | false>;
        }
      ).INCENTRAL_SUBMIT_PRODUCT_INTEREST;

      if (submitInterest) {
        const result = await submitInterest({
          ...payload,
          source: "region-unavailable-product-enquiry",
          page: window.location.href,
          referrer: document.referrer || "",
        });
        if (result === false || result?.ok === false) {
          throw new Error("Request was not accepted.");
        }
      }

      setSuccessCountry(String(payload.country || regionName));
      setComplete(true);
    } catch {
      setError(
        "We could not send your enquiry right now. Please try again in a moment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <header className="header geo-header">
        <div className="geo-shell geo-header-inner">
          <Logo className="geo-brand" />
          <a
            className="geo-site-link"
            href={siteConfig.parentBrandUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Visit Intangles.ai</span>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path
                d="M7 17 17 7M9 7h8v8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </header>

      <main id="main">
        <section aria-labelledby="geoTitle" className="geo-hero">
          <div className="geo-shell">
            <div className="geo-hero-grid">
              <div className="geo-copy">
                <p className="geo-eyebrow">Regional availability</p>
                <h1 id="geoTitle">
                  InCentral is not currently available in{" "}
                  <span>{regionName}</span>.
                </h1>
                <p className="geo-lead">
                  You can still talk to Intangles about fleet intelligence products for
                  your operation. Share a few details and our team can discuss product
                  availability, compatibility, pricing and deployment options for your
                  market.
                </p>
                <div className="geo-actions">
                  <a className="btn primary" href="#product-interest">
                    Talk to our team
                  </a>
                  <a
                    className="geo-text-action"
                    href={siteConfig.parentBrandUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Visit Intangles.ai <span aria-hidden="true">↗</span>
                  </a>
                </div>
                <div
                  className={cn("geo-detected", showDetected && "is-visible")}
                >
                  <span className="geo-detected-dot" />
                  <span>
                    Detected location: <strong>{regionName}</strong>
                  </span>
                </div>
                <p className="geo-mistake">
                  Location looks wrong?{" "}
                  <a
                    href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("InCentral regional access")}`}
                  >
                    Contact support
                  </a>
                  .
                </p>
              </div>

              <div aria-hidden="true" className="geo-visual">
                <div className="geo-visual-top">
                  <span className="geo-visual-dot" />
                  <span>Regional availability</span>
                </div>
                <GeoRegionArt />
                <div className="geo-visual-caption">
                  <strong>Planning a deployment?</strong>
                  <span>
                    Tell us where your fleet operates and our team will take it from
                    there.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="geoInterestTitle"
          className="geo-interest"
          id="product-interest"
        >
          <div className="geo-shell">
            <div className="geo-interest-grid">
              <div className="geo-interest-copy">
                <p className="geo-eyebrow">Product enquiry</p>
                <h2 id="geoInterestTitle">Tell us what your fleet needs.</h2>
                <p>
                  Tell us about your fleet and what you would like to improve. We will
                  route your enquiry to the right Intangles team.
                </p>
                <GeoSignalList />
              </div>

              <div
                className={cn("geo-form-card", complete && "is-complete")}
              >
                <div className="geo-form-head">
                  <div>
                    <p className="geo-form-kicker">Product enquiry</p>
                    <h3>Talk to Intangles</h3>
                    <p>Required fields are marked with an asterisk.</p>
                  </div>
                  <span className="geo-form-badge">About 2 Minutes</span>
                </div>

                <form className="geo-form" onSubmit={onSubmit} noValidate>
                  <input
                    id="geoCountryCode"
                    name="detectedCountryCode"
                    type="hidden"
                  />
                  <GeoField label="Full name" htmlFor="geoName" required>
                    <input
                      id="geoName"
                      name="fullName"
                      autoComplete="name"
                      required
                    />
                  </GeoField>
                  <GeoField label="Work email" htmlFor="geoEmail" required>
                    <input
                      id="geoEmail"
                      name="workEmail"
                      type="email"
                      autoComplete="email"
                      required
                    />
                  </GeoField>
                  <GeoField label="Phone number" htmlFor="geoPhone" required>
                    <input
                      id="geoPhone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      placeholder="Include country code"
                    />
                  </GeoField>
                  <GeoField label="Company" htmlFor="geoCompany" required>
                    <input
                      id="geoCompany"
                      name="company"
                      autoComplete="organization"
                      required
                    />
                  </GeoField>
                  <GeoField
                    label="Primary operating country / region"
                    htmlFor="geoCountry"
                    required
                  >
                    <input
                      id="geoCountry"
                      name="country"
                      autoComplete="country-name"
                      required
                      defaultValue={
                        regionName !== "your region" ? regionName : ""
                      }
                    />
                  </GeoField>
                  <GeoField label="Fleet size" htmlFor="geoFleet" required>
                    <select id="geoFleet" name="fleetSize" required defaultValue="">
                      <option value="">Select fleet size</option>
                      {FLEET_SIZE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </GeoField>
                  <GeoField
                    label="What are you interested in?"
                    htmlFor="geoInterest"
                    required
                    full
                  >
                    <select id="geoInterest" name="interest" required defaultValue="">
                      <option value="">Select an area</option>
                      {INTEREST_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </GeoField>
                  <GeoField
                    label="Tell us a little more"
                    htmlFor="geoNotes"
                    optional
                    full
                  >
                    <textarea
                      id="geoNotes"
                      name="notes"
                      placeholder="For example, your fleet type, operating model, current challenges, or what you would like to improve."
                    />
                  </GeoField>
                  <label className="geo-consent">
                    <input type="checkbox" required />
                    <span>
                      I agree that Intangles may contact me about product availability,
                      pricing and deployment options for my region.
                    </span>
                  </label>
                  <p
                    className={cn("geo-form-status", error && "is-error")}
                    hidden={!error}
                    tabIndex={-1}
                  >
                    {error}
                  </p>
                  <div className="geo-form-actions">
                    <button
                      type="submit"
                      className="geo-submit inline-flex items-center gap-2"
                      disabled={submitting}
                    >
                      {submitting ? <Spin size="small" /> : null}
                      {submitting ? "Sending…" : "Submit product enquiry"}
                    </button>
                  </div>
                </form>

                <div className="geo-form-success" tabIndex={-1}>
                  <span className="geo-success-mark">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="m5 12 4 4L19 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h3>Product enquiry received.</h3>
                  <p>
                    Thank you. We have your product enquiry for{" "}
                    <strong>{successCountry}</strong>. Our team can review your
                    requirements and get in touch about relevant Intangles solutions.
                  </p>
                  <a
                    href={siteConfig.parentBrandUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Visit Intangles.ai →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="geo-bottom">
        <div className="geo-shell geo-bottom-inner">
          <Link
            href={siteConfig.parentBrandUrl}
            rel="noopener noreferrer"
            target="_blank"
            aria-label="Visit Intangles website"
            className="geo-parent-brand"
          >
            <Image
              src={siteConfig.assets.logoWhite}
              alt="Intangles"
              width={140}
              height={32}
            />
          </Link>
          <span>
            © {new Date().getFullYear()} {siteConfig.parentCompany} · InCentral
            availability varies by region.
          </span>
          <div className="geo-bottom-links">
            <Link href="/policies/privacy-notice">Privacy</Link>
            <Link href="/policies/terms-conditions">Terms</Link>
            <a href={`mailto:${siteConfig.email}`}>Contact support</a>
          </div>
        </div>
      </footer>
    </>
  );
}

function GeoRegionArt() {
  return (
    <svg
      className="geo-region-art"
      focusable="false"
      role="presentation"
      viewBox="0 0 640 420"
    >
      <defs>
        <linearGradient id="geoCardGlow" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f8fbff" />
          <stop offset="1" stopColor="#eef5fb" />
        </linearGradient>
      </defs>
      <rect fill="url(#geoCardGlow)" height="418" rx="30" width="638" x="1" y="1" />
      <g fill="none" opacity="0.82" stroke="#b9cee0" strokeWidth="1.35">
        <circle cx="320" cy="207" r="132" />
        <ellipse cx="320" cy="207" rx="72" ry="132" />
        <ellipse cx="320" cy="207" rx="132" ry="52" />
        <path d="M191 177h258M191 237h258" />
      </g>
      <g
        fill="none"
        stroke="#1767ad"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M225 283c42-48 82-69 122-62 39 7 65 5 91-21"
          opacity="0.58"
          strokeDasharray="2 10"
          strokeWidth="2.2"
        />
        <circle cx="226" cy="282" fill="#fff" r="6" strokeWidth="2" />
        <circle cx="438" cy="200" fill="#fff" r="6" strokeWidth="2" />
      </g>
      <g transform="translate(396 114)">
        <path
          d="M30 0c16.6 0 30 13.4 30 30 0 23.4-30 50-30 50S0 53.4 0 30C0 13.4 13.4 0 30 0Z"
          fill="#e9f3ff"
          stroke="#1767ad"
          strokeWidth="2"
        />
        <circle cx="30" cy="30" fill="#fff" r="9" stroke="#1767ad" strokeWidth="2" />
      </g>
      <g
        fill="none"
        stroke="#17385f"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        transform="translate(181 263)"
      >
        <path d="M4 18V8.5A4.5 4.5 0 0 1 8.5 4h28A4.5 4.5 0 0 1 41 8.5V18" />
        <path d="M41 11h8l7 7v8H4v-8h37Z" />
        <circle cx="15" cy="27" fill="#f8fbff" r="4" />
        <circle cx="45" cy="27" fill="#f8fbff" r="4" />
        <path d="M10 10h18M31 10h6" />
      </g>
      <g transform="translate(462 278)">
        <rect fill="#fff" height="62" rx="16" stroke="#d4e1ea" width="118" />
        <circle cx="24" cy="22" fill="#eaf3ff" r="8" stroke="#1767ad" strokeWidth="1.5" />
        <path
          d="M19.5 22l3 3 5.5-6"
          fill="none"
          stroke="#1767ad"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <rect fill="#d4e1ea" height="5" rx="2.5" width="50" x="42" y="16" />
        <rect fill="#e3ebf0" height="5" rx="2.5" width="63" x="42" y="29" />
        <rect fill="#edf2f5" height="4" rx="2" width="87" x="18" y="43" />
      </g>
    </svg>
  );
}

function GeoSignalList() {
  const items = [
    {
      title: "Your market",
      body: "Tell us where your fleet operates so we can route the enquiry appropriately.",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
          <circle cx="12" cy="10" r="2.2" />
        </svg>
      ),
    },
    {
      title: "Your fleet",
      body: "Fleet size helps us understand the scale of deployment you are considering.",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M3 15V8.5A3.5 3.5 0 0 1 6.5 5h8A3.5 3.5 0 0 1 18 8.5V15" />
          <path d="M18 10h2.5L23 13v5H3v-3h15Z" />
          <circle cx="8" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
          <path d="M6 9h8" />
        </svg>
      ),
    },
    {
      title: "Your priorities",
      body: "Share what you want to improve so we can discuss the most relevant solution.",
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
          <path d="M17.5 6.5 21 3M18 3h3v3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="geo-signal-list">
      {items.map((item) => (
        <div key={item.title} className="geo-signal">
          <span className="geo-signal-icon">{item.icon}</span>
          <div>
            <strong>{item.title}</strong>
            <span>{item.body}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function GeoField({
  label,
  htmlFor,
  required,
  optional,
  full,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn("geo-field", full && "full")}>
      <label htmlFor={htmlFor}>
        {label}{" "}
        {required ? (
          <span aria-hidden="true" className="portal-asterisk">
            *
          </span>
        ) : null}
        {optional ? <span className="optional">Optional</span> : null}
      </label>
      {children}
    </div>
  );
}
