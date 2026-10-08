"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Spin } from "antd";

import { CheckoutPaymentModal } from "@/components/checkout/checkout-payment-modal";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { Container } from "@/components/common/container";
import { PlanFinderVehicleStepLink } from "@/components/plan-finder/plan-finder-vehicle-step-link";
import { useAuth } from "@/hooks/use-auth";
import { useConfiguredCart } from "@/hooks/use-configured-cart";
import { checkoutApi } from "@/lib/checkout/checkout-api";
import type { CheckoutAddress } from "@/lib/checkout/order-storage";
import { saveLastOrder } from "@/lib/checkout/order-storage";
import {
  errorSummaryEntries,
  validateAddressForm,
  type AddressFormValues,
  type FieldErrors,
} from "@/lib/checkout/validation";
import { saveCartQuoteContext } from "@/lib/commerce/quote-context";
import {
  fetchZohoCheckout,
  normalizeZohoCheckout,
  zohoStateLabel,
  type ZohoCheckoutSnapshot,
} from "@/lib/commerce/zoho-checkout";
import {
  persistZohoCartId,
  readZohoCartId,
  withCartIdQuery,
  ZOHO_CART_ID_QUERY_PARAM,
} from "@/lib/commerce/zoho-cart-session";
import { calculateCartTotals, lineGrossExGst } from "@/lib/commerce/totals";
import { formatMoney } from "@/lib/plan-finder/format";
import { INDIA_REGIONS } from "@/lib/plan-finder/compatibility-data";
import type { CartLine } from "@/lib/plan-finder/types";

const INITIAL_FORM: AddressFormValues = {
  email: "",
  marketingOptIn: false,
  firstName: "",
  lastName: "",
  address1: "",
  city: "",
  state: "",
  postalCode: "",
  phone: "",
  billingSame: true,
  billingFirstName: "",
  billingLastName: "",
  billingAddress1: "",
  billingCity: "",
  billingState: "",
  billingPostalCode: "",
  includeCompanyTax: false,
  companyName: "",
  gstin: "",
};

function formatAddressHtml(address: CheckoutAddress, stateLabel?: string) {
  return (
    <>
      <strong>
        {address.firstName} {address.lastName}
      </strong>
      <br />
      {address.address1}
      <br />
      {address.city}, {stateLabel ?? address.state} {address.postalCode}
      <br />
      {address.country}
      {address.phone ? (
        <>
          <br />
          {address.phone}
        </>
      ) : null}
    </>
  );
}

function buildOrderItems(lines: CartLine[]) {
  return lines.map((x) => ({
    sku: x.sku,
    name: x.planName,
    line: x.line,
    quantity: x.quantity,
    unitPriceExGst: x.unitPrice,
    vehicle: {
      segment: x.segmentLabel || "",
      manufacturer: x.manufacturerLabel || "",
      powertrain: x.emission || "",
    },
    aisState: x.aisRequired
      ? { id: x.stateId || "", label: x.stateLabel || "" }
      : null,
    installation: {
      method: x.installationMethod || "intangles",
      label: x.installationLabel || "",
      feePerDeviceExGst: Number(x.installationFeeExGst || 0),
    },
  }));
}

export function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ready, isAuthenticated } = useAuth();
  const { lines, coupon, clearCart } = useConfiguredCart();

  const checkoutId = useMemo(() => {
    const fromUrl = searchParams.get(ZOHO_CART_ID_QUERY_PARAM);
    if (fromUrl?.trim()) return fromUrl.trim();
    return readZohoCartId();
  }, [searchParams]);

  const totals = useMemo(
    () => calculateCartTotals(lines, coupon),
    [lines, coupon]
  );

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<AddressFormValues>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [address, setAddress] = useState<CheckoutAddress | null>(null);
  const [billing, setBilling] = useState<CheckoutAddress | null>(null);
  const [customer, setCustomer] = useState<{
    email: string;
    marketingOptIn: boolean;
  } | null>(null);
  const [taxProfile, setTaxProfile] = useState({
    includeCompanyTax: false,
    companyName: "",
    gstin: "",
  });
  const [notes, setNotes] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [zohoCheckoutLoading, setZohoCheckoutLoading] = useState(false);
  const [zohoCheckoutError, setZohoCheckoutError] = useState<string | null>(null);
  const [zohoCheckout, setZohoCheckout] = useState<ZohoCheckoutSnapshot | null>(null);
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState("");

  const stateOptions = useMemo(() => {
    if (zohoCheckout?.stateOptions.length) return zohoCheckout.stateOptions;
    return INDIA_REGIONS.map((region) => ({
      code: region.label,
      name: region.label,
    }));
  }, [zohoCheckout]);

  const defaultCountry = useMemo(() => {
    const code = zohoCheckout?.defaultCountryCode ?? "IN";
    return (
      zohoCheckout?.countries.find((country) => country.code === code) ?? {
        code: "IN",
        name: "India",
        mobileCode: "+91",
        states: stateOptions,
      }
    );
  }, [zohoCheckout, stateOptions]);

  const shippingMethods = zohoCheckout?.shippingMethods ?? [];

  const effectiveShippingMethods = useMemo(() => {
    if (shippingMethods.length) return shippingMethods;
    return [
      {
        id: "standard",
        name: "Standard shipping",
        rate: totals.shippingBase,
        deliveryTime:
          "Estimated delivery in 8 to 12 days from your order date. Installation or AIS-140 certification is arranged separately where applicable.",
        isDefault: true,
      },
    ];
  }, [shippingMethods, totals.shippingBase]);

  const selectedShippingMethod = useMemo(
    () =>
      effectiveShippingMethods.find((method) => method.id === selectedShippingMethodId) ??
      effectiveShippingMethods.find((method) => method.isDefault) ??
      effectiveShippingMethods[0] ??
      null,
    [effectiveShippingMethods, selectedShippingMethodId]
  );

  const zohoOrderTotal = zohoCheckout?.order.total ?? 0;

  const updateField = useCallback(
    (name: keyof AddressFormValues, value: string | boolean) => {
      setForm((prev) => ({ ...prev, [name]: value }));
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    []
  );

  const summaryIssues = useMemo(
    () => errorSummaryEntries(fieldErrors),
    [fieldErrors]
  );

  const goToStep = useCallback((next: 1 | 2 | 3) => {
    setStep(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const handleAddressSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors = validateAddressForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    const phoneDigits = form.phone.replace(/\D/g, "");
    const dialCode = (defaultCountry.mobileCode ?? "+91").replace(/\s/g, "");
    const shippingAddress: CheckoutAddress & { email?: string } = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      address1: form.address1.trim(),
      city: form.city.trim(),
      state: form.state,
      postalCode: form.postalCode.trim(),
      country: defaultCountry.name,
      phone: `${dialCode}${phoneDigits}`,
      email: form.email.trim(),
    };
    const billingAddress: CheckoutAddress & { email?: string } = form.billingSame
      ? shippingAddress
      : {
          firstName: form.billingFirstName.trim(),
          lastName: form.billingLastName.trim(),
          address1: form.billingAddress1.trim(),
          city: form.billingCity.trim(),
          state: form.billingState,
          postalCode: form.billingPostalCode.trim(),
          country: defaultCountry.name,
          email: form.email.trim(),
        };

    try {
      const response = await checkoutApi.validateAddress({
        shippingAddress,
        billingAddress,
        billingSame: form.billingSame,
        checkoutId,
        cartId: checkoutId,
      });
      const snapshot = normalizeZohoCheckout(response, checkoutId);
      if (snapshot) {
        setZohoCheckout(snapshot);
        const defaultMethod =
          snapshot.shippingMethods.find((method) => method.isDefault) ??
          snapshot.shippingMethods[0];
        if (defaultMethod) setSelectedShippingMethodId(defaultMethod.id);
      }
      setAddress(shippingAddress);
      setCustomer({
        email: form.email.trim(),
        marketingOptIn: form.marketingOptIn,
      });
      setBilling(billingAddress);
      setTaxProfile({
        includeCompanyTax: form.includeCompanyTax,
        companyName: form.includeCompanyTax ? form.companyName.trim() : "",
        gstin: form.includeCompanyTax ? form.gstin.trim().toUpperCase() : "",
      });
      goToStep(2);
    } catch (err) {
      setFieldErrors({
        address1:
          err instanceof Error ? err.message : "Address validation failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDispatchContinue = async () => {
    if (!address) return;
    setSubmitting(true);
    try {
      const methodId =
        selectedShippingMethodId || shippingMethods[0]?.id || "standard";
      const response = await checkoutApi.getDispatchOptions({
        shippingMethodId: methodId,
        cartId: checkoutId,
      });
      const snapshot = normalizeZohoCheckout(response, checkoutId);
      if (snapshot) setZohoCheckout(snapshot);
      goToStep(3);
    } catch (err) {
      setFieldErrors({
        address1:
          err instanceof Error ? err.message : "Could not confirm shipping method.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuote = () => {
    saveCartQuoteContext(lines);
    router.push("/get-a-quote?source=checkout");
  };

  const openPayment = () => {
    if (!termsAccepted) {
      setTermsError(
        "Review the order and accept the Terms & Conditions before payment."
      );
      return;
    }
    setTermsError("");
    setPaymentError("");
    setPaymentOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closePayment = () => {
    setPaymentOpen(false);
    setPaymentProcessing(false);
    setPaymentError("");
    document.body.style.overflow = "";
  };

  const handlePay = async () => {
    if (!address || !customer || !billing) return;
    setPaymentProcessing(true);
    setPaymentError("");
    try {
      const payload = {
        customer,
        shippingAddress: address,
        billingAddress: billing,
        taxProfile,
        dispatch: {
          method: selectedShippingMethodId || selectedShippingMethod?.id || "standard",
          shippingFeeExGst: selectedShippingMethod?.rate ?? totals.shippingBase,
          shippingFeeGross: (selectedShippingMethod?.rate ?? totals.shippingBase) * 1.18,
        },
        couponCode: totals.coupon.code || null,
        notes,
        items: buildOrderItems(lines),
        totals: {
          productSubtotal: totals.productBase,
          installation: totals.installationBase,
          shipping: totals.shippingBase,
          gst: totals.gst,
          discount: totals.discount,
          total: totals.total,
        },
        paymentProvider: "razorpay",
      };

      const order = await checkoutApi.createOrder(payload);
      const paymentOrder = await checkoutApi.createPaymentOrder({
        orderId: order.orderId,
        amount: order.amount ?? totals.total,
        currency: "INR",
      });
      const verified = await checkoutApi.verifyPayment({
        orderId: order.orderId,
        razorpayOrderId: paymentOrder.razorpayOrderId,
      });

      const finalOrder = {
        ...payload,
        ...order,
        ...paymentOrder,
        ...verified,
      };
      saveLastOrder(finalOrder);
      clearCart();
      router.push("/order-confirmation");
    } catch (err) {
      setPaymentProcessing(false);
      setPaymentError(
        err instanceof Error
          ? err.message
          : "Payment could not be completed. Please try again."
      );
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const fromUrl = searchParams.get(ZOHO_CART_ID_QUERY_PARAM);
    if (fromUrl?.trim()) {
      persistZohoCartId(fromUrl);
      return;
    }
    const stored = readZohoCartId();
    if (stored) {
      router.replace(withCartIdQuery("/checkout", stored), { scroll: false });
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (!ready || !isAuthenticated || !checkoutId) return;
    let cancelled = false;
    (async () => {
      setZohoCheckoutLoading(true);
      setZohoCheckoutError(null);
      try {
        const { snapshot } = await fetchZohoCheckout(checkoutId);
        if (!cancelled && snapshot) {
          setZohoCheckout(snapshot);
          const defaultMethod =
            snapshot.shippingMethods.find((method) => method.isDefault) ??
            snapshot.shippingMethods[0];
          if (defaultMethod) setSelectedShippingMethodId(defaultMethod.id);
        }
      } catch (err) {
        if (!cancelled) {
          setZohoCheckoutError(
            err instanceof Error
              ? err.message
              : "Could not load checkout from the store."
          );
        }
      } finally {
        if (!cancelled) setZohoCheckoutLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, isAuthenticated, checkoutId]);

  const signInHref = useMemo(
    () =>
      `/sign-in?mode=login&checkout=1&next=${encodeURIComponent(withCartIdQuery("/checkout", checkoutId))}`,
    [checkoutId]
  );

  if (!ready) return null;

  return (
    <main id="main" className="page-shell checkout-headless-page">
      <section data-headless-checkout="">
        <Container>
          <nav aria-label="Breadcrumb" className="coh-breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">›</span>
            <Link href="/cart">Cart</Link>
            <span aria-hidden="true">›</span>
            <span>Checkout</span>
          </nav>

          <div className="coh-hero">
            <p className="eyebrow">Secure checkout</p>
            <h1>Checkout</h1>
            <p>
              Complete your delivery and tax details, then review your order before
              payment.
            </p>
          </div>

          {!isAuthenticated ? (
            <div className="coh-gate">
              <h2>Sign in to continue.</h2>
              <p>Sign in or create an InCentral account to continue with checkout.</p>
              <Link className="coh-btn primary" href={signInHref}>
                Sign In or Create Account
              </Link>
            </div>
          ) : lines.length === 0 ? (
            <div className="coh-empty">
              <h2>Your cart is empty.</h2>
              <p>Add a compatible solution to your cart before starting checkout.</p>
              <PlanFinderVehicleStepLink className="coh-btn primary">
                Find the right solution
              </PlanFinderVehicleStepLink>
            </div>
          ) : !checkoutId ? (
            <div className="coh-gate">
              <h2>Cart session missing.</h2>
              <p>
                We need your store cart id to start checkout. Return to the cart or add
                items again from the configurator.
              </p>
              <Link className="coh-btn primary" href="/cart">
                Back to cart
              </Link>
            </div>
          ) : zohoCheckoutLoading ? (
            <div className="coh-gate" aria-busy="true">
              <Spin size="large" />
              <p>Loading checkout…</p>
            </div>
          ) : zohoCheckoutError ? (
            <div className="coh-gate">
              <h2>Checkout unavailable.</h2>
              <p>{zohoCheckoutError}</p>
              <Link className="coh-btn primary" href={withCartIdQuery("/cart", checkoutId)}>
                Back to cart
              </Link>
            </div>
          ) : totals.quoteRequired ? (
            <div className="coh-quote-gate">
              <p className="eyebrow">Quote required</p>
              <h2>This order needs an assisted quote.</h2>
              <p>{totals.quoteReasonLabel}</p>
              <button type="button" className="coh-btn primary" onClick={handleQuote}>
                Get a quote
              </button>
            </div>
          ) : (
            <div className="coh-app">
              <div aria-label="Checkout progress" className="coh-progress">
                {(
                  [
                    [1, "Address"],
                    [2, "Dispatch"],
                    [3, "Review & payment"],
                  ] as const
                ).map(([n, label]) => (
                  <div
                    key={n}
                    className={`coh-progress-step${step === n ? " is-active" : ""}${step > n ? " is-complete" : ""}`}
                  >
                    <span>{n}</span>
                    <b>{label}</b>
                  </div>
                ))}
              </div>

              <div className="coh-layout">
                <div className="coh-main">
                  {step === 1 ? (
                    <section className="coh-panel">
                      <form onSubmit={handleAddressSubmit} noValidate>
                        {summaryIssues.length > 0 ? (
                          <div
                            className="coh-error-summary"
                            role="alert"
                            tabIndex={-1}
                          >
                            <strong>
                              There {summaryIssues.length === 1 ? "is" : "are"}{" "}
                              {summaryIssues.length}{" "}
                              {summaryIssues.length === 1 ? "thing" : "things"} to
                              fix.
                            </strong>
                            <ul>
                              {summaryIssues.map((issue) => (
                                <li key={issue.name}>
                                  {issue.label}: {issue.message}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        <div className="coh-section">
                          <div className="coh-section-head">
                            <div>
                              <h2>Profile details</h2>
                              <p>We use this email for order and payment updates.</p>
                            </div>
                          </div>
                          <div className="coh-form-grid">
                            <div className="coh-field span-2">
                              <label htmlFor="cohEmail">
                                Email <span className="coh-required">*</span>
                              </label>
                              <input
                                id="cohEmail"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={(e) => updateField("email", e.target.value)}
                              />
                              <div className="coh-field-error">
                                {fieldErrors.email}
                              </div>
                            </div>
                          </div>
                          <div className="coh-toggle-block">
                            <label className="coh-check">
                              <input
                                type="checkbox"
                                checked={form.marketingOptIn}
                                onChange={(e) =>
                                  updateField("marketingOptIn", e.target.checked)
                                }
                              />
                              <span>
                                Keep me updated on Intangles product news and offers.
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="coh-section">
                          <div className="coh-section-head">
                            <div>
                              <h2>Shipping address</h2>
                              <p>Enter the address where the devices should be delivered.</p>
                            </div>
                          </div>
                          <div className="coh-form-grid">
                            <div className="coh-field">
                              <label htmlFor="firstName">
                                First name <span className="coh-required">*</span>
                              </label>
                              <input
                                id="firstName"
                                name="firstName"
                                autoComplete="given-name"
                                value={form.firstName}
                                onChange={(e) =>
                                  updateField("firstName", e.target.value)
                                }
                              />
                              <div className="coh-field-error">
                                {fieldErrors.firstName}
                              </div>
                            </div>
                            <div className="coh-field">
                              <label htmlFor="lastName">
                                Last name <span className="coh-required">*</span>
                              </label>
                              <input
                                id="lastName"
                                name="lastName"
                                autoComplete="family-name"
                                value={form.lastName}
                                onChange={(e) =>
                                  updateField("lastName", e.target.value)
                                }
                              />
                              <div className="coh-field-error">
                                {fieldErrors.lastName}
                              </div>
                            </div>
                            <div className="coh-field span-2">
                              <label htmlFor="address1">
                                Address <span className="coh-required">*</span>
                              </label>
                              <textarea
                                id="address1"
                                name="address1"
                                autoComplete="street-address"
                                value={form.address1}
                                onChange={(e) =>
                                  updateField("address1", e.target.value)
                                }
                              />
                              <div className="coh-field-error">
                                {fieldErrors.address1}
                              </div>
                            </div>
                            <div className="coh-field">
                              <label htmlFor="city">
                                City <span className="coh-required">*</span>
                              </label>
                              <input
                                id="city"
                                name="city"
                                autoComplete="address-level2"
                                value={form.city}
                                onChange={(e) => updateField("city", e.target.value)}
                              />
                              <div className="coh-field-error">{fieldErrors.city}</div>
                            </div>
                            <div className="coh-field">
                              <label htmlFor="field">Country</label>
                              <input id="field" readOnly value={defaultCountry.name} />
                            </div>
                            <div className="coh-field">
                              <label htmlFor="state">
                                State / Union Territory{" "}
                                <span className="coh-required">*</span>
                              </label>
                              <select
                                id="state"
                                name="state"
                                autoComplete="address-level1"
                                value={form.state}
                                onChange={(e) => updateField("state", e.target.value)}
                              >
                                <option value="">Select state / union territory</option>
                                {stateOptions.map((region) => (
                                  <option key={region.code} value={region.code}>
                                    {region.name}
                                  </option>
                                ))}
                              </select>
                              <div className="coh-field-error">{fieldErrors.state}</div>
                            </div>
                            <div className="coh-field">
                              <label htmlFor="postalCode">
                                PIN code <span className="coh-required">*</span>
                              </label>
                              <input
                                id="postalCode"
                                name="postalCode"
                                inputMode="numeric"
                                maxLength={6}
                                autoComplete="postal-code"
                                value={form.postalCode}
                                onChange={(e) =>
                                  updateField("postalCode", e.target.value)
                                }
                              />
                              <div className="coh-field-error">
                                {fieldErrors.postalCode}
                              </div>
                            </div>
                            <div className="coh-field span-2">
                              <label htmlFor="phone">
                                Mobile number <span className="coh-required">*</span>
                              </label>
                              <div className="coh-phone-row">
                                <input
                                  readOnly
                                  value={defaultCountry.mobileCode ?? "+91"}
                                  aria-label="Country code"
                                />
                                <input
                                  id="phone"
                                  name="phone"
                                  inputMode="tel"
                                  maxLength={10}
                                  autoComplete="tel-national"
                                  placeholder="10-digit mobile number"
                                  value={form.phone}
                                  onChange={(e) => updateField("phone", e.target.value)}
                                />
                              </div>
                              <p className="coh-field-help">
                                Used for delivery, installation and order coordination.
                              </p>
                              <div className="coh-field-error">{fieldErrors.phone}</div>
                            </div>
                          </div>

                          <div className="coh-toggle-block">
                            <label className="coh-check">
                              <input
                                type="checkbox"
                                checked={form.billingSame}
                                onChange={(e) =>
                                  updateField("billingSame", e.target.checked)
                                }
                              />
                              <span>Billing address is the same as shipping address.</span>
                            </label>
                          </div>

                          {!form.billingSame ? (
                            <div className="coh-reveal">
                              <div className="coh-section-head">
                                <div>
                                  <h2>Billing address</h2>
                                  <p>Enter a different billing address.</p>
                                </div>
                              </div>
                              <div className="coh-form-grid">
                                <div className="coh-field">
                                  <label htmlFor="billingFirstName">First name</label>
                                  <input
                                    id="billingFirstName"
                                    value={form.billingFirstName}
                                    onChange={(e) =>
                                      updateField("billingFirstName", e.target.value)
                                    }
                                  />
                                  <div className="coh-field-error">
                                    {fieldErrors.billingFirstName}
                                  </div>
                                </div>
                                <div className="coh-field">
                                  <label htmlFor="billingLastName">Last name</label>
                                  <input
                                    id="billingLastName"
                                    value={form.billingLastName}
                                    onChange={(e) =>
                                      updateField("billingLastName", e.target.value)
                                    }
                                  />
                                  <div className="coh-field-error">
                                    {fieldErrors.billingLastName}
                                  </div>
                                </div>
                                <div className="coh-field span-2">
                                  <label htmlFor="billingAddress1">Address</label>
                                  <textarea
                                    id="billingAddress1"
                                    value={form.billingAddress1}
                                    onChange={(e) =>
                                      updateField("billingAddress1", e.target.value)
                                    }
                                  />
                                  <div className="coh-field-error">
                                    {fieldErrors.billingAddress1}
                                  </div>
                                </div>
                                <div className="coh-field">
                                  <label htmlFor="billingCity">City</label>
                                  <input
                                    id="billingCity"
                                    value={form.billingCity}
                                    onChange={(e) =>
                                      updateField("billingCity", e.target.value)
                                    }
                                  />
                                  <div className="coh-field-error">
                                    {fieldErrors.billingCity}
                                  </div>
                                </div>
                                <div className="coh-field">
                                  <label htmlFor="billingState">State / UT</label>
                                  <select
                                    id="billingState"
                                    value={form.billingState}
                                    onChange={(e) =>
                                      updateField("billingState", e.target.value)
                                    }
                                  >
                                    <option value="">Select state / union territory</option>
                                    {stateOptions.map((region) => (
                                      <option key={region.code} value={region.code}>
                                        {region.name}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="coh-field-error">
                                    {fieldErrors.billingState}
                                  </div>
                                </div>
                                <div className="coh-field">
                                  <label htmlFor="billingPostalCode">PIN code</label>
                                  <input
                                    id="billingPostalCode"
                                    maxLength={6}
                                    value={form.billingPostalCode}
                                    onChange={(e) =>
                                      updateField("billingPostalCode", e.target.value)
                                    }
                                  />
                                  <div className="coh-field-error">
                                    {fieldErrors.billingPostalCode}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null}

                          <div className="coh-toggle-block">
                            <label className="coh-check">
                              <input
                                type="checkbox"
                                checked={form.includeCompanyTax}
                                onChange={(e) =>
                                  updateField("includeCompanyTax", e.target.checked)
                                }
                              />
                              <span>
                                Include company name and GST details on the invoice.
                              </span>
                            </label>
                          </div>
                          {form.includeCompanyTax ? (
                            <div className="coh-reveal">
                              <div className="coh-form-grid">
                                <div className="coh-field">
                                  <label htmlFor="companyName">Company name</label>
                                  <input
                                    id="companyName"
                                    value={form.companyName}
                                    onChange={(e) =>
                                      updateField("companyName", e.target.value)
                                    }
                                  />
                                  <div className="coh-field-error">
                                    {fieldErrors.companyName}
                                  </div>
                                </div>
                                <div className="coh-field">
                                  <label htmlFor="gstin">GSTIN</label>
                                  <input
                                    id="gstin"
                                    className="coh-uppercase"
                                    maxLength={15}
                                    value={form.gstin}
                                    onChange={(e) =>
                                      updateField("gstin", e.target.value)
                                    }
                                  />
                                  <div className="coh-field-error">{fieldErrors.gstin}</div>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>

                        <div className="coh-actions">
                          <Link className="coh-btn" href="/cart">
                            Back to cart
                          </Link>
                          <button
                            type="submit"
                            className="coh-btn primary inline-flex items-center gap-2"
                            disabled={submitting}
                          >
                            {submitting ? <Spin size="small" /> : null}
                            {submitting ? "Checking address..." : "Continue to dispatch"}
                          </button>
                        </div>
                      </form>
                    </section>
                  ) : null}

                  {step === 2 && address ? (
                    <section className="coh-panel">
                      <div className="coh-section">
                        <div className="coh-section-head">
                          <div>
                            <h2>Shipping address</h2>
                            <p>Confirm where this order will be delivered.</p>
                          </div>
                          <button
                            type="button"
                            className="coh-text-btn"
                            onClick={() => goToStep(1)}
                          >
                            Change
                          </button>
                        </div>
                        <div className="coh-address-card">
                          {formatAddressHtml(
                            address,
                            zohoStateLabel(address.state, zohoCheckout)
                          )}
                        </div>
                      </div>
                      <div className="coh-section">
                        <div className="coh-section-head">
                          <div>
                            <h2>Shipping method</h2>
                            <p>Dispatch timing starts after the order is confirmed.</p>
                          </div>
                        </div>
                        {effectiveShippingMethods.map((method) => (
                          <label key={method.id} className="coh-shipping-option">
                            <input
                              type="radio"
                              name="shippingMethod"
                              checked={
                                selectedShippingMethodId
                                  ? selectedShippingMethodId === method.id
                                  : method.isDefault
                              }
                              onChange={() => setSelectedShippingMethodId(method.id)}
                            />
                            <span className="coh-option-copy">
                              <strong>{method.name}</strong>
                              {method.deliveryTime ? <span>{method.deliveryTime}</span> : null}
                            </span>
                            <span className="coh-option-price">
                              {formatMoney(method.rate || totals.shippingBase)}
                            </span>
                          </label>
                        ))}
                        {!shippingMethods.length ? (
                          <p className="coh-field-help coh-mt-10">
                            Shipping options from the store will appear here once your
                            address is saved. You can continue with standard dispatch for
                            now.
                          </p>
                        ) : null}
                      </div>
                      <div className="coh-actions">
                        <button
                          type="button"
                          className="coh-btn"
                          onClick={() => goToStep(1)}
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          className="coh-btn primary inline-flex items-center gap-2"
                          disabled={submitting}
                          onClick={handleDispatchContinue}
                        >
                          {submitting ? <Spin size="small" /> : null}
                          {submitting ? "Confirming..." : "Continue to review"}
                        </button>
                      </div>
                    </section>
                  ) : null}

                  {step === 3 && address ? (
                    <section className="coh-panel">
                      <div className="coh-section">
                        <div className="coh-section-head">
                          <div>
                            <h2>Shipping and dispatch</h2>
                            <p>Review the final delivery details before payment.</p>
                          </div>
                          <button
                            type="button"
                            className="coh-text-btn"
                            onClick={() => goToStep(1)}
                          >
                            Change address
                          </button>
                        </div>
                        <div className="coh-address-card">
                          {formatAddressHtml(
                            address,
                            zohoStateLabel(address.state, zohoCheckout)
                          )}
                        </div>
                        <div className="coh-dispatch-card coh-mt-10">
                          <strong>Shipping method</strong>
                          <span>
                            {selectedShippingMethod?.name ?? "Standard shipping"} ·{" "}
                            {formatMoney(
                              selectedShippingMethod?.rate ?? totals.shippingBase
                            )}
                            {selectedShippingMethod?.deliveryTime
                              ? ` · ${selectedShippingMethod.deliveryTime}`
                              : " · 8 to 12 days from your order date"}
                          </span>
                        </div>
                      </div>

                      <div className="coh-section">
                        <div className="coh-section-head">
                          <div>
                            <h2>Review order</h2>
                            <p>
                              Confirm vehicle compatibility, quantities, installation and
                              delivery details before payment.
                            </p>
                          </div>
                        </div>
                        <div className="coh-review-items">
                          {lines.map((x) => {
                            const vehicle =
                              [x.segmentLabel, x.manufacturerLabel, x.emission]
                                .filter(Boolean)
                                .join(" · ") || "Configured vehicle";
                            return (
                              <div key={x.id} className="coh-review-line">
                                <div className="coh-review-main">
                                  <strong>
                                    {x.planName} · {x.line}
                                  </strong>
                                  <div className="coh-review-config">
                                    <div className="coh-review-fact">
                                      <b>Vehicle</b>
                                      <span>{vehicle}</span>
                                    </div>
                                    {x.aisRequired && x.stateLabel ? (
                                      <div className="coh-review-fact">
                                        <b>State / UT</b>
                                        <span>{x.stateLabel}</span>
                                      </div>
                                    ) : null}
                                    <div className="coh-review-fact coh-review-verified">
                                      <b>Compatibility</b>
                                      <span>Verified</span>
                                    </div>
                                    <div className="coh-review-fact">
                                      <b>Installation</b>
                                      <span>{x.installationLabel}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="qty">
                                  <small>Devices</small>
                                  {x.quantity}
                                </div>
                                <div className="amount">
                                  {formatMoney(lineGrossExGst(x))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="coh-section">
                        <div className="coh-section-head">
                          <div>
                            <h2>Payment</h2>
                            <p>
                              Payment is collected through Razorpay after the final order
                              is created.
                            </p>
                          </div>
                        </div>
                        <label className="coh-payment-option">
                          <input type="radio" defaultChecked />
                          <span className="coh-option-copy">
                            <strong>Razorpay Secure Checkout</strong>
                            <span>
                              UPI, cards and net banking are handled inside the Razorpay
                              payment window.
                            </span>
                          </span>
                        </label>
                        <div className="coh-field coh-mt-18">
                          <label htmlFor="order-notes">Additional order information</label>
                          <textarea
                            id="order-notes"
                            placeholder="Add delivery or order notes, if required"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                        <div className="coh-terms coh-mt-18">
                          <label className="coh-check">
                            <input
                              type="checkbox"
                              checked={termsAccepted}
                              onChange={(e) => {
                                setTermsAccepted(e.target.checked);
                                if (e.target.checked) setTermsError("");
                              }}
                            />
                            <span>
                              I have reviewed the vehicle compatibility, quantities,
                              installation selections and order details. I accept the{" "}
                              <Link
                                href="/policies/terms-conditions"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Terms &amp; Conditions
                              </Link>{" "}
                              and understand that orders are final after payment.
                            </span>
                          </label>
                          <div className="coh-field-error">{termsError}</div>
                          <p className="coh-final-policy">
                            Review our{" "}
                            <Link
                              href="/policies/returns-refunds-cancellation"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Returns, Refunds &amp; Cancellation Policy
                            </Link>
                            .
                          </p>
                        </div>
                      </div>
                      <div className="coh-actions">
                        <button
                          type="button"
                          className="coh-btn"
                          onClick={() => goToStep(1)}
                        >
                          Edit address
                        </button>
                        <button
                          type="button"
                          className="coh-btn primary"
                          onClick={openPayment}
                        >
                          Make payment
                        </button>
                      </div>
                    </section>
                  ) : null}
                </div>

                <CheckoutSummary lines={lines} totals={totals} />
              </div>
            </div>
          )}
        </Container>
      </section>

      <CheckoutPaymentModal
        open={paymentOpen}
        amount={totals.total}
        email={customer?.email || ""}
        phone={address?.phone || ""}
        processing={paymentProcessing}
        error={paymentError}
        onClose={closePayment}
        onPay={handlePay}
      />
    </main>
  );
}
