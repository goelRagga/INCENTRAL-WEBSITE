"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { useRouter } from "next/navigation";

import { Container } from "@/components/common/container";
import {
  IconAddresses,
  IconBilling,
  IconLogout,
  IconOrders,
  IconOverview,
  IconSummaryBilling,
  IconSummaryOrders,
  IconSummarySupport,
  IconSupport,
} from "@/components/account/account-nav-icons";
import {
  accountPage,
  accountPanelIds,
  accountUseMockData,
  type AccountPanelId,
} from "@/config/account";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/backend";
import { loadAccountMockBootstrap } from "@/lib/account/mock-data";
import {
  formatAddressLines,
  formatDate,
  formatMoney,
  greetingForHour,
  initialsFromName,
  isPastOrder,
  orderDeviceCount,
  orderItemSummary,
  orderStageRank,
  statusInfo,
  ticketStatus,
} from "@/lib/account/format";
import type { AccountBootstrap, AccountOrder } from "@/lib/account/types";

const PROGRESS_LABELS = ["Placed", "Confirmed", "Packed", "Shipped", "Delivered"];

function panelFromHash(hash: string): AccountPanelId {
  const id = hash.replace(/^#/, "") as AccountPanelId;
  return accountPanelIds.includes(id) ? id : "overview";
}

function OrderProgress({ order }: { order: AccountOrder }) {
  const current = orderStageRank(order.stage || order.status);
  return (
    <div className="a295-progress">
      <div className="a295-progress-track">
        {PROGRESS_LABELS.map((label, i) => {
          const stepState =
            i < current ? "is-done" : i === current ? "is-current" : "is-upcoming";
          const marker =
            i < current ? (
              "✓"
            ) : i === current ? (
              <span className="a295-progress-dot-core" />
            ) : (
              ""
            );
          return (
            <div
              key={label}
              className={`a295-progress-step ${stepState}`}
              {...(i === current ? { "aria-current": "step" as const } : {})}
            >
              <span className="a295-progress-node" aria-hidden>
                <span className="a295-progress-dot">{marker}</span>
              </span>
              <span className="a295-progress-label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function mapApiToBootstrap(
  profile: Record<string, unknown> | null,
  ordersRaw: unknown[],
  session?: { name?: string; email?: string }
): AccountBootstrap {
  const contact = String(profile?.contact_name ?? session?.name ?? "");
  const parts = contact.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");
  const emptyAddress = {
    id: "billing",
    label: "Billing address",
    attention: contact || "Not provided",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  };

  const orders: AccountOrder[] = ordersRaw.map((row) => {
    const o = row as Record<string, unknown>;
    return {
      id: String(o.salesorder_id ?? o.id ?? ""),
      number: String(o.salesorder_number ?? o.number ?? ""),
      date: String(o.date ?? ""),
      status: String(o.status ?? "pending"),
      total: Number(o.total ?? 0),
      currencyCode: o.currency_code ? String(o.currency_code) : "₹",
      items: [],
      shipment: null,
    };
  });

  return {
    profile: {
      firstName,
      lastName,
      fullName: contact || session?.name || "Your account",
      companyName: String(profile?.company_name ?? ""),
      email: String(profile?.email ?? session?.email ?? ""),
      phone: String(profile?.phone ?? ""),
      gstin: profile?.gstin ? String(profile.gstin) : undefined,
      billingAddress: emptyAddress,
      shippingAddresses: [],
    },
    orders,
    invoices: [],
    payments: [],
    tickets: [],
  };
}

export function AccountPage() {
  const router = useRouter();
  const { ready, isAuthenticated, session, signOut } = useAuth();
  const { intro } = accountPage;
  const signedOut = useRef(false);

  const [bootstrap, setBootstrap] = useState<AccountBootstrap | null>(null);
  const [activePanel, setActivePanel] = useState<AccountPanelId>("overview");
  const [orderFilter, setOrderFilter] = useState<"all" | "active" | "past">("all");
  const [orderQuery, setOrderQuery] = useState("");

  useEffect(() => {
    if (ready && !isAuthenticated && !signedOut.current) {
      router.replace("/sign-in?next=/account");
    }
  }, [ready, isAuthenticated, router]);

  useEffect(() => {
    const sync = () => setActivePanel(panelFromHash(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (accountUseMockData) {
      setBootstrap(loadAccountMockBootstrap());
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          api.account.profile().catch(() => null),
          api.account.orders().catch(() => []),
        ]);
        const list = Array.isArray(ordersRes)
          ? ordersRes
          : ((ordersRes as { salesorders?: unknown[] })?.salesorders ?? []);
        if (!cancelled) {
          setBootstrap(
            mapApiToBootstrap(
              profileRes as Record<string, unknown> | null,
              list,
              session ?? undefined
            )
          );
        }
      } catch {
        if (!cancelled) {
          setBootstrap(
            mapApiToBootstrap(null, [], session ?? undefined)
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, session]);

  const goToPanel = useCallback((panel: AccountPanelId) => {
    setActivePanel(panel);
    const hash = panel === "overview" ? "" : `#${panel}`;
    window.history.replaceState(null, "", `/account${hash}`);
  }, []);

  const handleSignOut = useCallback(async () => {
    signedOut.current = true;
    await signOut();
    router.push("/");
  }, [signOut, router]);

  const profile = bootstrap?.profile;
  const orders = bootstrap?.orders ?? [];
  const invoices = bootstrap?.invoices ?? [];
  const payments = bootstrap?.payments ?? [];
  const tickets = bootstrap?.tickets ?? [];

  const firstName = profile?.firstName || "there";
  const fullName = profile?.fullName || "Your account";
  const company = profile?.companyName || "";
  const initials = initialsFromName(fullName);

  const filteredOrders = useMemo(() => {
    let list = [...orders];
    if (orderFilter === "active") list = list.filter((o) => !isPastOrder(o.status));
    if (orderFilter === "past") list = list.filter((o) => isPastOrder(o.status));
    const q = orderQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          o.number.toLowerCase().includes(q) ||
          orderItemSummary(o.items).toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, orderFilter, orderQuery]);

  const activeOrderCount = useMemo(
    () => orders.filter((o) => !isPastOrder(o.status)).length,
    [orders]
  );

  const paidInvoiceCount = useMemo(
    () =>
      invoices.filter((i) => String(i.status).toLowerCase() === "paid").length,
    [invoices]
  );

  const openTicketCount = useMemo(
    () => tickets.filter((t) => ![4, 5].includes(Number(t.status))).length,
    [tickets]
  );

  const recentOrder = orders[0];

  const preventMockPdf = (e: MouseEvent) => {
    if (accountUseMockData) e.preventDefault();
  };

  if (!ready || !isAuthenticated) {
    return (
      <main id="main" className="page-shell account295">
        <section className="a295-body">
          <Container>
            <div className="a295-loading">Loading your account</div>
          </Container>
        </section>
      </main>
    );
  }

  return (
    <main id="main" className="page-shell account295">
      <section className="a295-intro">
        <Container>
          <div className="a295-intro-row">
            <div className="a295-intro-copy">
              <p className="eyebrow">{intro.eyebrow}</p>
              <h1>
                {greetingForHour()}, <span>{firstName}</span>.
              </h1>
              <p>{intro.lead}</p>
            </div>
            <div className="a295-identity">
              <span className="a295-avatar">{initials}</span>
              <span className="a295-identity-copy">
                <strong>{fullName}</strong>
                {company ? <span>{company}</span> : null}
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section className="a295-body">
        <Container>
          {!bootstrap ? (
            <div className="a295-loading">Loading your account</div>
          ) : (
            <div className="a295-layout">
              <aside className="a295-sidebar">
                <nav aria-label="Account navigation" className="a295-nav">
                  {(
                    [
                      ["overview", "Overview", IconOverview],
                      ["orders", "Orders", IconOrders],
                      ["billing", "Billing", IconBilling],
                      ["addresses", "Account details", IconAddresses],
                      ["support", "Support", IconSupport],
                    ] as const
                  ).map(([id, label, Icon]) => (
                    <a
                      key={id}
                      href={id === "overview" ? "#overview" : `#${id}`}
                      className={activePanel === id ? "is-active" : undefined}
                      aria-current={activePanel === id ? "page" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        goToPanel(id);
                      }}
                    >
                      <Icon />
                      <span>{label}</span>
                    </a>
                  ))}
                  <div className="a295-nav-separator" role="separator" />
                  <button
                    type="button"
                    className="a295-nav-logout"
                    onClick={handleSignOut}
                  >
                    <IconLogout />
                    <span>Log Out</span>
                  </button>
                </nav>
                <div className="a295-side-help">
                  <span>24×7 support</span>
                  <strong>Need help right now?</strong>
                  <p>Our command centre is available around the clock.</p>
                  <a href="tel:18002689111">1800-268-9111</a>
                </div>
              </aside>

              <div className="a295-content">
                <section
                  className="a295-panel"
                  id="overview"
                  hidden={activePanel !== "overview"}
                >
                  <div className="a295-panel-head">
                    <div>
                      <h2>Account overview</h2>
                      <p>
                        Your latest order activity, billing and support at a glance.
                      </p>
                    </div>
                  </div>
                  <div className="a295-summary-grid">
                    <article className="a295-summary-card">
                      <div className="a295-summary-card-top">
                        <span>Active orders</span>
                        <span className="a295-summary-icon">
                          <IconSummaryOrders />
                        </span>
                      </div>
                      <strong>{activeOrderCount}</strong>
                      <small>
                        {activeOrderCount === 1
                          ? "Order in progress"
                          : "Orders in progress"}
                      </small>
                    </article>
                    <article className="a295-summary-card">
                      <div className="a295-summary-card-top">
                        <span>Invoices</span>
                        <span className="a295-summary-icon">
                          <IconSummaryBilling />
                        </span>
                      </div>
                      <strong>{invoices.length}</strong>
                      <small>
                        {paidInvoiceCount} paid invoice
                        {paidInvoiceCount === 1 ? "" : "s"}
                      </small>
                    </article>
                    <article className="a295-summary-card">
                      <div className="a295-summary-card-top">
                        <span>Open support</span>
                        <span className="a295-summary-icon">
                          <IconSummarySupport />
                        </span>
                      </div>
                      <strong>{openTicketCount}</strong>
                      <small>
                        {openTicketCount === 1
                          ? "Request needs attention"
                          : "Requests in progress"}
                      </small>
                    </article>
                  </div>
                  <div className="a295-overview-grid">
                    <article className="a295-card">
                      <div className="a295-card-head">
                        <h3>Latest order</h3>
                        <button type="button" onClick={() => goToPanel("orders")}>
                          View all orders
                        </button>
                      </div>
                      <div className="a295-card-body">
                        {!recentOrder ? (
                          <div className="a295-empty">
                            <h3>No orders yet</h3>
                            <p>
                              Once you place an order, its status, invoice and delivery
                              information will appear here.
                            </p>
                            <Link className="a295-btn primary" href="/#solutions">
                              Explore solutions
                            </Link>
                          </div>
                        ) : (
                          <>
                            <div className="a295-recent-order-top">
                              <div>
                                <div className="a295-order-id">
                                  <strong>{recentOrder.number}</strong>
                                  <span
                                    className={`a295-status ${statusInfo(recentOrder.status).cls}`}
                                  >
                                    {statusInfo(recentOrder.status).label}
                                  </span>
                                </div>
                                <span className="a295-order-date">
                                  Placed {formatDate(recentOrder.date)}
                                </span>
                              </div>
                              <div className="a295-order-total">
                                <span>Total</span>
                                <strong>
                                  {formatMoney(
                                    recentOrder.total,
                                    recentOrder.currencyCode ?? "₹"
                                  )}
                                </strong>
                              </div>
                            </div>
                            {recentOrder.items.length > 0 ? (
                              <div className="a295-order-items">
                                {recentOrder.items.map((item) => (
                                  <div
                                    key={`${item.name}-${item.variant}`}
                                    className="a295-order-item"
                                  >
                                    <span className="a295-order-item-copy">
                                      <strong>
                                        {item.name} · {item.variant}
                                      </strong>
                                      <span>
                                        {item.quantity}{" "}
                                        {item.quantity === 1 ? "device" : "devices"}
                                      </span>
                                    </span>
                                    <strong>
                                      {formatMoney(
                                        item.lineTotal || item.unitPrice * item.quantity
                                      )}
                                    </strong>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                            <OrderProgress order={recentOrder} />
                            <div className="a295-order-actions">
                              <button
                                type="button"
                                className="a295-btn primary"
                                onClick={() => goToPanel("orders")}
                              >
                                View order
                              </button>
                              {recentOrder.invoiceId ? (
                                <a
                                  className="a295-btn"
                                  href="#"
                                  onClick={preventMockPdf}
                                >
                                  Download invoice
                                </a>
                              ) : null}
                              {recentOrder.shipment?.trackingNumber ? (
                                <button
                                  type="button"
                                  className="a295-btn"
                                  onClick={() => goToPanel("orders")}
                                >
                                  Track delivery
                                </button>
                              ) : null}
                            </div>
                          </>
                        )}
                      </div>
                    </article>
                    <article className="a295-card a295-account-card">
                      <div className="a295-card-head">
                        <h3>Account details</h3>
                        <button type="button" onClick={() => goToPanel("addresses")}>
                          Manage
                        </button>
                      </div>
                      <div className="a295-card-body">
                        <dl>
                          <div>
                            <dt>Company</dt>
                            <dd>{profile?.companyName || "Not provided"}</dd>
                          </div>
                          <div>
                            <dt>Email</dt>
                            <dd>{profile?.email || "Not provided"}</dd>
                          </div>
                          <div>
                            <dt>Phone</dt>
                            <dd>{profile?.phone || "Not provided"}</dd>
                          </div>
                          <div>
                            <dt>GSTIN</dt>
                            <dd>{profile?.gstin || "Not provided"}</dd>
                          </div>
                        </dl>
                        <div className="a295-quicklinks">
                          {(
                            [
                              ["orders", "All orders", "Order status and delivery"],
                              ["billing", "Invoices", "Invoices and payments"],
                              ["addresses", "Account details", "Company and addresses"],
                              ["support", "Support", "Requests and replies"],
                            ] as const
                          ).map(([panel, title, sub]) => (
                            <a
                              key={panel}
                              className="a295-quicklink"
                              href={`#${panel}`}
                              onClick={(e) => {
                                e.preventDefault();
                                goToPanel(panel);
                              }}
                            >
                              <strong>{title}</strong>
                              <span>{sub}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </article>
                  </div>
                </section>

                <section
                  className="a295-panel"
                  id="orders"
                  hidden={activePanel !== "orders"}
                >
                  <div className="a295-panel-head">
                    <div>
                      <h2>Your orders</h2>
                      <p>
                        See order status, delivery information, totals and invoices
                        without leaving InCentral.
                      </p>
                    </div>
                  </div>
                  <div className="a295-toolbar">
                    <div
                      className="a295-filter-group"
                      role="group"
                      aria-label="Filter orders"
                    >
                      {(
                        [
                          ["all", "All"],
                          ["active", "Active"],
                          ["past", "Past"],
                        ] as const
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          className={`a295-filter${orderFilter === key ? " is-active" : ""}`}
                          onClick={() => setOrderFilter(key)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="search"
                      className="a295-search"
                      placeholder="Search order or solution"
                      aria-label="Search orders"
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                    />
                  </div>
                  <div className="a295-list">
                    {!filteredOrders.length ? (
                      <div className="a295-empty">
                        <h3>No matching orders</h3>
                        <p>Try another filter or search term.</p>
                      </div>
                    ) : (
                      filteredOrders.map((o) => {
                        const st = statusInfo(o.status);
                        const devices = orderDeviceCount(o.items);
                        return (
                          <article key={o.id} className="a295-order-card">
                            <div className="a295-order-card-main">
                              <div>
                                <h3>{o.number}</h3>
                                <div className="a295-order-card-meta">
                                  <span>{formatDate(o.date)}</span>
                                  <span className={`a295-status ${st.cls}`}>
                                    {st.label}
                                  </span>
                                  {o.shipment?.trackingNumber ? (
                                    <span>Tracking {o.shipment.trackingNumber}</span>
                                  ) : null}
                                </div>
                              </div>
                              <div className="a295-order-card-items">
                                <strong>
                                  {devices} device{devices === 1 ? "" : "s"}
                                </strong>
                                {orderItemSummary(o.items) || "—"}
                              </div>
                              <div className="a295-order-card-total">
                                <span>Total</span>
                                <strong>
                                  {formatMoney(o.total, o.currencyCode ?? "₹")}
                                </strong>
                              </div>
                            </div>
                            <div className="a295-order-card-actions">
                              {o.invoiceId ? (
                                <a
                                  className="a295-btn ghost"
                                  href="#"
                                  onClick={preventMockPdf}
                                >
                                  Download invoice
                                </a>
                              ) : null}
                              <button type="button" className="a295-btn">
                                Order details
                              </button>
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                </section>

                <section
                  className="a295-panel"
                  id="billing"
                  hidden={activePanel !== "billing"}
                >
                  <div className="a295-panel-head">
                    <div>
                      <h2>Billing &amp; payments</h2>
                      <p>
                        Download GST invoices and review payment records linked to your
                        orders.
                      </p>
                    </div>
                  </div>
                  <div className="a295-billing-grid">
                    <section className="a295-table-card">
                      <div className="a295-table-head">
                        <h3>Invoices</h3>
                      </div>
                      <table className="a295-table">
                        <thead>
                          <tr>
                            <th>Invoice</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Balance</th>
                            <th className="a295-download-col">
                              <span
                                className="a295-download-head"
                                title="Download invoice"
                              >
                                <svg aria-hidden viewBox="0 0 24 24">
                                  <path d="M12 3v11m0 0 4-4m-4 4-4-4M5 18v2h14v-2" />
                                </svg>
                                <span className="sr-only">Download invoice</span>
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.length ? (
                            invoices.map((inv) => {
                              const st = statusInfo(inv.status);
                              return (
                                <tr key={inv.id}>
                                  <td>
                                    <strong>{inv.number}</strong>
                                    <br />
                                    <span>{inv.orderNumber}</span>
                                  </td>
                                  <td>{formatDate(inv.date)}</td>
                                  <td>
                                    <span className={`a295-status ${st.cls}`}>
                                      {st.label}
                                    </span>
                                  </td>
                                  <td>{formatMoney(inv.total)}</td>
                                  <td>{formatMoney(inv.balance)}</td>
                                  <td>
                                    <a href="#" onClick={preventMockPdf}>
                                      PDF
                                    </a>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={6}>No invoices available.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </section>
                    <section className="a295-table-card">
                      <div className="a295-table-head">
                        <h3>Payments</h3>
                      </div>
                      <table className="a295-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Method</th>
                            <th>Reference</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.length ? (
                            payments.map((p) => (
                              <tr key={p.id}>
                                <td>{formatDate(p.date)}</td>
                                <td>{p.mode || "Not provided"}</td>
                                <td>{p.reference || "Not provided"}</td>
                                <td>{formatMoney(p.amount)}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4}>No payment records available.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </section>
                  </div>
                </section>

                <section
                  className="a295-panel"
                  id="addresses"
                  hidden={activePanel !== "addresses"}
                >
                  <div className="a295-panel-head">
                    <div>
                      <h2>Account details</h2>
                      <p>
                        Keep your company, GST and delivery details current for future
                        orders.
                      </p>
                    </div>
                  </div>
                  <div className="a295-address-grid">
                    <article className="a295-address-card">
                      <div className="a295-address-card-head">
                        <span>Account &amp; company</span>
                        <button type="button">Edit</button>
                      </div>
                      <strong>{fullName}</strong>
                      <div className="a295-profile-lines">
                        <div className="a295-profile-line">
                          <span>Company</span>
                          <strong>{profile?.companyName || "Not provided"}</strong>
                        </div>
                        <div className="a295-profile-line">
                          <span>GSTIN</span>
                          <strong>{profile?.gstin || "Not provided"}</strong>
                        </div>
                        <div className="a295-profile-line">
                          <span>Email</span>
                          <strong>{profile?.email || "Not provided"}</strong>
                        </div>
                        <div className="a295-profile-line">
                          <span>Phone</span>
                          <strong>{profile?.phone || "Not provided"}</strong>
                        </div>
                      </div>
                    </article>
                    {profile?.billingAddress ? (
                      <article className="a295-address-card">
                        <div className="a295-address-card-head">
                          <span>
                            {profile.billingAddress.label || "Billing address"}
                          </span>
                          <button type="button">Edit</button>
                        </div>
                        <strong>
                          {profile.billingAddress.attention || fullName}
                        </strong>
                        <address>{formatAddressLines(profile.billingAddress)}</address>
                      </article>
                    ) : null}
                    {profile?.shippingAddresses.map((a) => (
                      <article key={a.id} className="a295-address-card">
                        <div className="a295-address-card-head">
                          <span>{a.label || "Saved address"}</span>
                          <button type="button">Edit</button>
                        </div>
                        <strong>{a.attention || fullName}</strong>
                        <address>{formatAddressLines(a)}</address>
                      </article>
                    ))}
                  </div>
                </section>

                <section
                  className="a295-panel"
                  id="support"
                  hidden={activePanel !== "support"}
                >
                  <div className="a295-panel-head">
                    <div>
                      <h2>Support requests</h2>
                      <p>
                        Raise a request, follow replies and keep order-related support in
                        one thread.
                      </p>
                    </div>
                    <Link className="a295-btn primary" href="/support">
                      New support request
                    </Link>
                  </div>
                  <div className="a295-support-layout">
                    <div className="a295-ticket-list">
                      {!tickets.length ? (
                        <div className="a295-empty">
                          <h3>No support requests</h3>
                          <p>
                            When you contact support, your requests and replies will
                            appear here.
                          </p>
                          <Link className="a295-btn primary" href="/support">
                            New support request
                          </Link>
                        </div>
                      ) : (
                        tickets.map((t) => {
                          const st = ticketStatus(t);
                          return (
                            <button
                              key={t.id}
                              type="button"
                              className="a295-ticket"
                            >
                              <span>
                                <h3>{t.subject}</h3>
                                <span className="a295-ticket-meta">
                                  <span>#{t.id}</span>
                                  <span>{t.category || "Support request"}</span>
                                  {t.orderNumber ? <span>{t.orderNumber}</span> : null}
                                </span>
                              </span>
                              <span className="a295-ticket-right">
                                <span className={`a295-status ${st.cls}`}>
                                  {st.label}
                                </span>
                                <time dateTime={t.updatedAt}>
                                  {formatDate(t.updatedAt)}
                                </time>
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                    <aside className="a295-support-help">
                      <h3>Need immediate help?</h3>
                      <p>
                        For urgent operational issues, you can still contact our command
                        centre directly.
                      </p>
                      <div className="a295-support-contact">
                        <a href="tel:18002689111">
                          <span>Phone</span>
                          <span>1800-268-9111</span>
                        </a>
                        <a href="mailto:commandcenter@intangles.com">
                          <span>Email</span>
                          <span>Command Centre</span>
                        </a>
                      </div>
                    </aside>
                  </div>
                </section>
              </div>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
