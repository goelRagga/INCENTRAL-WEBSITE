export function formatMoney(amount: number, currency = "₹") {
  return `${currency}${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(value?: string | null) {
  if (!value) return "Not provided";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}

export function statusInfo(status?: string) {
  const s = String(status || "").toLowerCase();
  if (["delivered", "fulfilled", "paid", "resolved", "closed", "success"].includes(s)) {
    const label =
      s === "fulfilled" ? "Fulfilled" : s.charAt(0).toUpperCase() + s.slice(1);
    return { label, cls: "is-green" };
  }
  if (["shipped", "confirmed", "open"].includes(s)) {
    return { label: s.charAt(0).toUpperCase() + s.slice(1), cls: "is-blue" };
  }
  if (["pending", "packed", "cancellation_requested"].includes(s)) {
    const label =
      s === "cancellation_requested"
        ? "Cancellation requested"
        : s.charAt(0).toUpperCase() + s.slice(1);
    return { label, cls: "is-amber" };
  }
  if (["cancelled", "void", "failed", "overdue"].includes(s)) {
    return { label: s.charAt(0).toUpperCase() + s.slice(1), cls: "is-red" };
  }
  return {
    label: s ? s.charAt(0).toUpperCase() + s.slice(1) : "Pending",
    cls: "is-gray",
  };
}

export function orderStageRank(status?: string) {
  const rank: Record<string, number> = {
    pending: 0,
    draft: 0,
    placed: 0,
    confirmed: 1,
    packed: 2,
    shipped: 3,
    delivered: 4,
    fulfilled: 4,
    cancellation_requested: 1,
    cancelled: 0,
  };
  return rank[String(status || "").toLowerCase()] ?? 0;
}

export function isPastOrder(status?: string) {
  return ["delivered", "fulfilled", "cancelled"].includes(
    String(status || "").toLowerCase()
  );
}

export function greetingForHour(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function initialsFromName(name?: string) {
  if (!name) return "IC";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2) || "IC";
}

export function ticketStatus(ticket: {
  status: number;
  statusLabel?: string;
}) {
  const n = Number(ticket.status);
  if (n === 2) return { label: "Open", cls: "is-blue" };
  if (n === 3) return { label: "Pending", cls: "is-amber" };
  if (n === 4) return { label: "Resolved", cls: "is-green" };
  if (n === 5) return { label: "Closed", cls: "is-gray" };
  return statusInfo(ticket.statusLabel);
}

export function orderItemSummary(
  items: { name: string; variant: string; quantity: number }[]
) {
  return items
    .map((i) => `${i.name} · ${i.variant} × ${i.quantity}`)
    .join(", ");
}

export function orderDeviceCount(
  items: { quantity: number }[]
) {
  return items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);
}

export function formatAddressLines(a?: {
  address?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}) {
  if (!a) return "Not provided";
  return [a.address, a.street2, a.city, a.state, a.zip, a.country]
    .filter(Boolean)
    .join(", ");
}
