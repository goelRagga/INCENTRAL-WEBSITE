/** Set before navigating to /#check-compatibility to open vehicle step (portal resetForAnother). */
export const PLAN_FINDER_RESET_FLAG = "incentralPlanFinderResetV1";

export const PLAN_FINDER_RESET_EVENT = "incentral:plan-finder-reset";

export function requestPlanFinderVehicleStep() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PLAN_FINDER_RESET_FLAG, "1");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(PLAN_FINDER_RESET_EVENT));
}

export function consumePlanFinderResetFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (sessionStorage.getItem(PLAN_FINDER_RESET_FLAG) !== "1") return false;
    sessionStorage.removeItem(PLAN_FINDER_RESET_FLAG);
    return true;
  } catch {
    return false;
  }
}
