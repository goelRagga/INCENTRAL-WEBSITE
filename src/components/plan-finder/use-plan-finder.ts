"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { planFinderSection } from "@/config/plan-finder";
import { applyCatalogPriceRows, findZohoVariantId, storeCatalogProducts } from "@/lib/commerce/catalog-prices";
import { normalizeConfiguredLine } from "@/lib/commerce/installation";
import {
  applyCartIdSearchParam,
  extractCartId,
  persistZohoCartId,
} from "@/lib/commerce/zoho-cart-session";
import { api } from "@/lib/backend";
import { useAuth } from "@/hooks/use-auth";

import {
  CONFIGURATOR_STORAGE_KEY,
  MODAL_CONFIGURATOR_STORAGE_KEY,
  NEED_ALIASES,
  NEED_SHORT_LABELS,
  aisCoverageStatus,
  canonicalMake,
  cumulativeCapabilities,
  expandNeeds,
  formatMoney,
  planMeta,
  productFor,
  recommendGroup,
  variantLabel,
  visibleOemEntries,
  resolveOem,
  vehicleData,
  INDIA_REGIONS,
  addToConfiguredCart,
  getConfiguredCart,
  MAX_DIRECT_QTY,
  saveQuoteContext,
  type RecommendationResult,
} from "@/lib/plan-finder";
import {
  PLAN_FINDER_RESET_EVENT,
  consumePlanFinderResetFlag,
} from "@/lib/plan-finder/session-reset";
import type { CartLine, ConfiguratorState, PlanFamily } from "@/lib/plan-finder";

function createVehicleStepState(
  overrides: Partial<ConfiguratorState> = {}
): ConfiguratorState {
  return {
    step: 1,
    segment: "",
    make: "",
    emission: "",
    aisRequired: true,
    stateId: "",
    selectedFamily: "",
    quantity: 1,
    selectedNeeds: [],
    ...overrides,
  };
}

function restoreSelectedNeeds(expanded: string[]): string[] {
  const selected: string[] = [];
  if (expanded.includes("tracking")) selected.push("tracking");
  if (expanded.includes("predictive_health")) selected.push("predictive_health");
  if (expanded.includes("ai_video_telematics")) selected.push("ai_video_telematics");
  if (expanded.includes("fuel_def") && expanded.includes("repair_help")) {
    selected.push("fuel_package");
  }
  if (expanded.includes("driver_behaviour")) selected.push("driver_behaviour");
  if (expanded.includes("fleet_automation")) selected.push("fleet_automation");
  return selected;
}

function loadState(storageKey: string): ConfiguratorState {
  const empty = createVehicleStepState({ segment: "3w" });
  if (typeof window === "undefined") return empty;
  try {
    const stored = JSON.parse(sessionStorage.getItem(storageKey) || "null");
    if (!stored || typeof stored !== "object") return empty;
    const expanded = Array.isArray(stored.needs) ? stored.needs : [];
    return {
      ...createVehicleStepState(),
      ...stored,
      /** Portal always opens vehicle UI on load (setStep(1,false)), not solutions. */
      step: 1,
      segment: typeof stored.segment === "string" ? stored.segment : "",
      selectedNeeds: Array.isArray(stored.selectedNeeds)
        ? stored.selectedNeeds
        : restoreSelectedNeeds(expanded),
    };
  } catch {
    return empty;
  }
}

function persistState(storageKey: string, state: ConfiguratorState) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({ ...state, needs: expandNeeds(state.selectedNeeds) })
    );
  } catch {
    /* ignore */
  }
}

function coverageStatus(aisRequired: boolean, stateId: string) {
  if (!aisRequired) return { status: "ready" as const, copy: "" };
  const status = aisCoverageStatus(stateId);
  if (status === "supported") return { status: "ready" as const, copy: "" };
  if (status === "confirm") {
    return {
      status: "confirm" as const,
      copy: "AIS-140 availability for this state needs confirmation.",
    };
  }
  if (status === "unavailable") {
    return {
      status: "unavailable" as const,
      copy: "AIS-140 is not currently confirmed for this state.",
    };
  }
  return {
    status: "needs-state" as const,
    copy: "Select the state where these vehicles will be installed.",
  };
}

export type UsePlanFinderOptions = {
  variant?: "section" | "modal";
  onAddedToCart?: () => void;
};

export function usePlanFinder({ variant = "section", onAddedToCart }: UsePlanFinderOptions = {}) {
  const storageKey =
    variant === "modal" ? MODAL_CONFIGURATOR_STORAGE_KEY : CONFIGURATOR_STORAGE_KEY;

  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pendingPurchase = useRef(false);

  const [state, setState] = useState<ConfiguratorState>(() =>
    createVehicleStepState({ segment: "3w" })
  );
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [cartSuccess, setCartSuccess] = useState<{
    title: string;
    summary: string;
  } | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [priceEpoch, setPriceEpoch] = useState(0);
  const [catalogReady, setCatalogReady] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(false);

  useEffect(() => {
    if (consumePlanFinderResetFlag()) {
      const next = createVehicleStepState();
      setState(next);
      persistState(storageKey, next);
    } else {
      setState(loadState(storageKey));
    }
    setCartSuccess(null);
    setHydrated(true);
  }, [storageKey]);

  // No on-mount fetch — prices are fetched fresh on every step-1→step-2 transition.

  useEffect(() => {
    if (!hydrated) return;
    persistState(storageKey, state);
  }, [hydrated, state, storageKey]);

  const expandedNeeds = useMemo(
    () => expandNeeds(state.selectedNeeds),
    [state.selectedNeeds]
  );

  const result: RecommendationResult | null = useMemo(() => {
    if (state.step !== 2) return null;
    void priceEpoch; // recompute when live prices arrive from Zoho
    return recommendGroup({
      segment: state.segment,
      make: state.make,
      emission: state.emission,
      aisRequired: state.aisRequired,
      stateId: state.stateId,
      quantity: state.quantity,
      needs: expandedNeeds,
    });
  }, [state, expandedNeeds, priceEpoch]);

  useEffect(() => {
    if (state.step !== 2 || !result || result.status !== "VERIFIED") return;
    if (
      state.selectedFamily &&
      result.recommendations.some((rec) => rec.family === state.selectedFamily)
    ) {
      return;
    }
    const family =
      result.defaultFamily ||
      result.recommendationFamily ||
      result.recommendations[0]?.family ||
      "";
    if (family) {
      setState((prev) => ({ ...prev, selectedFamily: family as PlanFamily }));
    }
  }, [state.step, state.selectedFamily, result]);

  const segmentOptions = useMemo(
    () =>
      Object.entries(vehicleData)
        .filter(([key]) => key !== "other")
        .map(([value, entry]) => ({ value, label: entry.label })),
    []
  );

  const makeOptions = useMemo(() => {
    if (!state.segment) return [];
    return visibleOemEntries(state.segment).map(([value, entry]) => ({
      value,
      label: entry.label,
    }));
  }, [state.segment]);

  const emissionOptions = useMemo(() => {
    if (!state.segment || !state.make) return [];
    const oem = resolveOem(state.segment, state.make);
    return Object.keys(oem?.emissions || {}).map((value) => ({
      value,
      label: value,
    }));
  }, [state.segment, state.make]);

  const summaryText = useMemo(() => {
    if (!result || result.status !== "VERIFIED") return "Not set";
    return [
      result.summary.segmentLabel,
      result.summary.manufacturerLabel,
      result.summary.emission,
      variantLabel(state.aisRequired),
    ]
      .filter(Boolean)
      .join(" · ");
  }, [result, state.aisRequired]);

  const highlightedFamily = useCallback((rec: RecommendationResult) => {
    return rec.bestValueFamily || rec.closestMatchFamily || rec.recommendationFamily || "";
  }, []);

  const selectedRecommendation = useMemo(() => {
    if (!result || result.status !== "VERIFIED") return null;
    const family =
      state.selectedFamily &&
      result.recommendations.some((r) => r.family === state.selectedFamily)
        ? state.selectedFamily
        : highlightedFamily(result) &&
            result.recommendations.some((r) => r.family === highlightedFamily(result))
          ? (highlightedFamily(result) as PlanFamily)
          : (result.recommendations[0]?.family as PlanFamily | undefined);
    return result.recommendations.find((r) => r.family === family) ?? null;
  }, [result, state.selectedFamily, highlightedFamily]);

  const resultsCopy = useMemo(() => {
    if (!result || result.status !== "VERIFIED") return "";
    const count = result.recommendations.length;
    const hasNeeds = expandedNeeds.length > 0;
    const hasFullNeedsMatch = !hasNeeds || result.needsFullyMet;
    const intro = planFinderSection.resultsStep.resultsIntro;

    if (count === 1) {
      return hasNeeds && !hasFullNeedsMatch
        ? "This plan fits your vehicle, but it does not include everything you selected."
        : `${intro} This is the only plan that fits these vehicle details.`;
    }
    if (hasNeeds && hasFullNeedsMatch) {
      return `${intro} Recommended is the lowest compatible plan that covers everything you selected.`;
    }
    if (hasNeeds) {
      return "These plans fit your vehicle, but none includes everything you selected.";
    }
    return intro;
  }, [result, expandedNeeds]);

  const availabilityNotices = useMemo(() => {
    if (!result || result.status !== "VERIFIED") return [];
    const notices: string[] = [];
    const hasNeeds = expandedNeeds.length > 0;
    const hasFullNeedsMatch = !hasNeeds || result.needsFullyMet;

    if (hasNeeds && !hasFullNeedsMatch) {
      const missing = (result.unsupportedNeeds || []).map(
        (key) => NEED_SHORT_LABELS[key] || key
      );
      const missingCopy = missing.length
        ? ` The unavailable need${missing.length === 1 ? " is" : "s are"} ${missing.join(", ")}.`
        : "";
      notices.push(
        `No compatible solution for this vehicle covers everything you selected.${missingCopy} Change your choices or contact us.`
      );
    }

    const cov = coverageStatus(state.aisRequired, state.stateId);
    if (
      state.aisRequired &&
      (cov.status === "confirm" || cov.status === "unavailable")
    ) {
      notices.push(cov.copy);
    }

    return notices;
  }, [result, expandedNeeds, state.aisRequired, state.stateId]);

  const resultsTitle = useMemo(() => {
    if (!result || result.status !== "VERIFIED") return "Plans that fit";
    const count = result.recommendations.length;
    return count === 1 ? "1 plan fits" : `${count} plans fit`;
  }, [result]);

  const update = useCallback((patch: Partial<ConfiguratorState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const setSegment = useCallback((segment: string) => {
    setState((prev) => ({
      ...prev,
      segment,
      make: "",
      emission: "",
      selectedFamily: "",
    }));
    setError(null);
  }, []);

  const setMake = useCallback((make: string) => {
    setState((prev) => ({
      ...prev,
      make: canonicalMake(prev.segment, make),
      emission: "",
      selectedFamily: "",
    }));
    setError(null);
  }, []);

  const setEmission = useCallback((emission: string) => {
    setState((prev) => ({ ...prev, emission, selectedFamily: "" }));
    setError(null);
  }, []);

  const toggleNeed = useCallback((value: string, checked: boolean) => {
    setState((prev) => ({
      ...prev,
      selectedNeeds: checked
        ? [...prev.selectedNeeds, value]
        : prev.selectedNeeds.filter((item) => item !== value),
      selectedFamily: "",
    }));
  }, []);

  const isNeedChecked = useCallback(
    (value: string) => {
      if (state.selectedNeeds.includes(value)) return true;
      const aliases = NEED_ALIASES[value];
      return Boolean(
        aliases && aliases.every((key) => expandedNeeds.includes(key))
      );
    },
    [state.selectedNeeds, expandedNeeds]
  );

  const validateAndRecommend = useCallback(async () => {
    if (!state.segment || !state.make || !state.emission) {
      setError(
        "Choose the vehicle type, manufacturer and emission / powertrain."
      );
      return false;
    }
    setError(null);
    setCartSuccess(null);
    flushSync(() => setCatalogLoading(true));
    try {
      const planData = await api.catalog.planProducts();
      const planList = Array.isArray(planData) ? planData : [];
      if (planList.length > 0) {
        applyCatalogPriceRows(planList);
        storeCatalogProducts(planList);
      }
      setPriceEpoch((n) => n + 1);
    } catch {
      /* static catalog prices remain — still advance */
    } finally {
      setCatalogLoading(false);
      setCatalogReady(true);
    }
    update({ step: 2, aisRequired: state.aisRequired ?? true });
    return true;
  }, [state, update]);

  const goToStep = useCallback((step: 1 | 2) => {
    setState((prev) => ({ ...prev, step }));
    if (step === 1) setCartSuccess(null);
  }, []);

  /** Portal resetForAnother — back to vehicle details (step 1), clear selections. */
  const resetForAnother = useCallback(() => {
    const next = createVehicleStepState();
    persistState(storageKey, next);
    flushSync(() => {
      setState(next);
      setError(null);
      setCartSuccess(null);
    });
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        document
          .getElementById(planFinderSection.id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [storageKey]);

  useEffect(() => {
    const onReset = () => resetForAnother();
    window.addEventListener(PLAN_FINDER_RESET_EVENT, onReset);
    return () => window.removeEventListener(PLAN_FINDER_RESET_EVENT, onReset);
  }, [resetForAnother]);

  const reset = resetForAnother;

  const selectFamily = useCallback((family: PlanFamily) => {
    setState((prev) => ({ ...prev, selectedFamily: family }));
    setCartSuccess(null);
  }, []);

  const setAisRequired = useCallback((aisRequired: boolean) => {
    setState((prev) => ({
      ...prev,
      aisRequired,
      stateId: aisRequired ? prev.stateId : "",
      selectedFamily: prev.selectedFamily,
    }));
    setCartSuccess(null);
  }, []);

  const setStateId = useCallback((stateId: string) => {
    setState((prev) => ({ ...prev, stateId }));
    setCartSuccess(null);
  }, []);

  const setQuantity = useCallback((quantity: number) => {
    setState((prev) => ({
      ...prev,
      quantity: Math.max(1, Math.floor(quantity) || 1),
    }));
  }, []);

  const getBadge = useCallback(
    (
      rec: RecommendationResult["recommendations"][number],
      total: number,
      recResult: RecommendationResult
    ) => {
      if (recResult.bestValueFamily && rec.family === recResult.bestValueFamily) {
        return { label: "Recommended", variant: "value" as const };
      }
      if (recResult.closestMatchFamily && rec.family === recResult.closestMatchFamily) {
        return { label: "Closest Fit", variant: "match" as const };
      }
      if (expandedNeeds.length) {
        return {
          label: rec.completeMatch ? "Fits your needs" : "Partial match",
          variant: rec.completeMatch ? ("match" as const) : ("partial" as const),
        };
      }
      if (total <= 1) return null;
      return { label: "Compatible", variant: "match" as const };
    },
    [expandedNeeds]
  );

  const purchaseSelected = useCallback(async () => {
    if (!result || result.status !== "VERIFIED" || !selectedRecommendation) return;

    // Auth gate — use a ref so the effect below can retry with the updated closure
    if (!isAuthenticated) {
      pendingPurchase.current = true;
      window.dispatchEvent(new CustomEvent("incentral:open-auth-modal"));
      return;
    }

    const rec = selectedRecommendation;
    const product = productFor(rec.family as PlanFamily, state.aisRequired);
    if (!product) return;

    const cov = coverageStatus(state.aisRequired, state.stateId);
    if (state.aisRequired && !state.stateId) {
      setError("Select the state where these vehicles will be installed.");
      return;
    }
    if (cov.status === "unavailable") {
      setError("AIS-140 is not currently confirmed for this state. Contact us.");
      return;
    }

    const qty = Math.max(1, state.quantity);
    const meta = planMeta[rec.family as PlanFamily];
    const line: CartLine = {
      id: `cfg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sku: product.sku,
      family: rec.family as PlanFamily,
      planName: product.name,
      line: variantLabel(state.aisRequired),
      quantity: qty,
      unitPrice: product.price,
      segment: state.segment,
      segmentLabel: result.summary.segmentLabel,
      make: state.make,
      manufacturerLabel: result.summary.manufacturerLabel,
      emission: state.emission,
      aisRequired: state.aisRequired,
      stateId: state.stateId,
      stateLabel:
        INDIA_REGIONS.find((r) => r.id === state.stateId)?.label || "",
      hardware: meta.hardware[state.aisRequired ? "ais" : "standard"] || meta.hardware.standard,
      source: variant === "modal" ? "modal-configurator" : "homepage-configurator",
      createdAt: Date.now(),
    };

    // Qty > 25 → quote flow
    if (qty > MAX_DIRECT_QTY) {
      saveQuoteContext(line);
      const src = variant === "modal" ? "modal-configurator" : "homepage-configurator";
      window.location.href = `/get-a-quote?source=${src}`;
      return;
    }

    // Add to cart — backend is required (Zoho cart is the purchase of record)
    const variantId = findZohoVariantId(product.name, state.aisRequired);
    if (!variantId) {
      setError("Product not available right now. Please try again or contact us.");
      return;
    }

    setPurchasing(true);
    try {
      const cartPayload = await api.cart.add({ productVariantId: variantId, quantity: qty });
      const cartId = extractCartId(cartPayload);
      if (cartId) {
        persistZohoCartId(cartId);
        router.replace(
          applyCartIdSearchParam(pathname, searchParams, cartId),
          { scroll: false }
        );
      }
    } catch {
      setError("Could not add to cart. Please try again.");
      return;
    } finally {
      setPurchasing(false);
    }

    addToConfiguredCart(normalizeConfiguredLine(line));
    setCartSuccess({
      title: `${qty} × ${product.name}`,
      summary: `${result.summary.manufacturerLabel} · ${result.summary.emission} · ${variantLabel(state.aisRequired)}`,
    });
    onAddedToCart?.();
  }, [
    isAuthenticated,
    pathname,
    result,
    router,
    searchParams,
    selectedRecommendation,
    state,
    variant,
    onAddedToCart,
  ]);

  // Retry purchase after sign-in via auth modal
  useEffect(() => {
    if (isAuthenticated && pendingPurchase.current) {
      pendingPurchase.current = false;
      purchaseSelected();
    }
  }, [isAuthenticated, purchaseSelected]);

  const quoteThresholdNotice =
    result?.status === "VERIFIED" && selectedRecommendation
      ? (() => {
          const qty = Math.max(1, state.quantity);
          const cartCount = getConfiguredCart().reduce((sum, item) => sum + item.quantity, 0);
          const projected = cartCount + qty;
          return projected > MAX_DIRECT_QTY
            ? `${projected} devices in cart. Orders above 25 continue as a quote.`
            : null;
        })()
      : null;

  return {
    state,
    error,
    purchasing,
    hydrated,
    result,
    segmentOptions,
    makeOptions,
    emissionOptions,
    summaryText,
    resultsTitle,
    resultsCopy,
    availabilityNotices,
    selectedRecommendation,
    cartSuccess,
    expandedNeeds,
    update,
    setSegment,
    setMake,
    setEmission,
    toggleNeed,
    isNeedChecked,
    validateAndRecommend,
    goToStep,
    reset,
    resetForAnother,
    selectFamily,
    setAisRequired,
    setStateId,
    setQuantity,
    getBadge,
    purchaseSelected,
    quoteThresholdNotice,
    catalogReady,
    catalogLoading,
    coverageStatus: () => coverageStatus(state.aisRequired, state.stateId),
    cumulativeCapabilities,
    formatMoney,
    productFor,
    highlightedFamily,
  };
}

export type PlanFinderController = ReturnType<typeof usePlanFinder>;
