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
import { usePathname, useRouter } from "next/navigation";

import { Container } from "@/components/common/container";
import { AccountAddressDialog } from "@/components/account/account-address-dialog";
import { AccountNewTicketDialog } from "@/components/account/account-new-ticket-dialog";
import { AccountOrderDialog } from "@/components/account/account-order-dialog";
import { AccountOrderProgress } from "@/components/account/account-order-progress";
import { AccountProfileDialog } from "@/components/account/account-profile-dialog";
import { AccountTicketDialog } from "@/components/account/account-ticket-dialog";
import { useAccountToast } from "@/components/account/account-toast";
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
  accountUseMockMutations,
  type AccountPanelId,
} from "@/config/account";
import { authPage } from "@/config/auth";
import { api } from "@/lib/backend";
import { useAuth } from "@/hooks/use-auth";
import { loadAccountBootstrap } from "@/lib/account/load-account-bootstrap";
import {
  formatAddressLines,
  formatDate,
  formatMoney,
  greetingForHour,
  initialsFromName,
  isPastOrder,
  orderDeviceCount,
  orderItemSummary,
  statusInfo,
  ticketStatus,
} from "@/lib/account/format";
import { mapApiOrderDetail } from "@/lib/account/map-api-bootstrap";
import type { AccountAddress, AccountBootstrap, AccountOrder } from "@/lib/account/types";

function panelFromHash(hash: string): AccountPanelId {
  const id = hash.replace(/^#/, "") as AccountPanelId;
  return accountPanelIds.includes(id) ? id : "overview";
}

export function AccountPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, isAuthenticated, session, signOut } = useAuth();
  const { intro } = accountPage;
  const signedOut = useRef(false);
  const { showToast, toastPortal } = useAccountToast();

  const [bootstrap, setBootstrap] = useState<AccountBootstrap | null>(null);
  const [activePanel, setActivePanel] = useState<AccountPanelId>("overview");
  const [orderFilter, setOrderFilter] = useState<"all" | "active" | "past">("all");
  const [orderQuery, setOrderQuery] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<AccountOrder | null>(null);
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [newTicketOrderRef, setNewTicketOrderRef] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<AccountAddress | null>(null);

  useEffect(() => {
    if (ready && !isAuthenticated && !signedOut.current) {
      router.replace(
        `/sign-in?next=${encodeURIComponent(authPage.accountOverviewHref)}`
      );
    }
  }, [ready, isAuthenticated, router]);

  const syncPanelFromHash = useCallback(() => {
    setActivePanel(panelFromHash(window.location.hash));
  }, []);

  useEffect(() => {
    syncPanelFromHash();
    window.addEventListener("hashchange", syncPanelFromHash);
    window.addEventListener("popstate", syncPanelFromHash);
    return () => {
      window.removeEventListener("hashchange", syncPanelFromHash);
      window.removeEventListener("popstate", syncPanelFromHash);
    };
  }, [syncPanelFromHash]);

  useEffect(() => {
    if (pathname === "/account") {
      syncPanelFromHash();
    }
  }, [pathname, syncPanelFromHash]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    (async () => {
      const data = await loadAccountBootstrap(session ?? undefined);
      if (!cancelled) setBootstrap(data);
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, session]);

  const goToPanel = useCallback((panel: AccountPanelId) => {
    setActivePanel(panel);
    const nextUrl = `/account#${panel}`;
    if (window.location.hash !== `#${panel}`) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    signedOut.current = true;
    await signOut();
    router.push("/");
  }, [signOut, router]);

  const handleTicketReply = useCallback(async (ticketId: number, body: string) => {
    setBootstrap((prev) => {
      if (!prev) return prev;
      const now = new Date().toISOString();
      return {
        ...prev,
        tickets: prev.tickets.map((t) => {
          if (t.id !== ticketId) return t;
          return {
            ...t,
            status: 2,
            statusLabel: "Open",
            updatedAt: now,
            conversations: [
              ...(t.conversations ?? []),
              {
                id: Date.now(),
                from: prev.profile.fullName,
                customer: true,
                body,
                createdAt: now,
              },
            ],
          };
        }),
      };
    });
  }, []);

  const openOrder = useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
    setSelectedOrderDetail(null);
    api.account.order(orderId).then((raw: unknown) => {
      const detail = mapApiOrderDetail(raw);
      if (detail) setSelectedOrderDetail(detail);
    }).catch(() => {});
  }, []);

  const openNewTicket = useCallback((orderNumber = "") => {
    setNewTicketOrderRef(orderNumber);
    setNewTicketOpen(true);
  }, []);

  const handleCreateTicket = useCallback(
    async (payload: {
      category: string;
      orderReference: string;
      email: string;
      phone: string;
      subject: string;
      description: string;
    }) => {
      let newId = 0;
      setBootstrap((prev) => {
        if (!prev) return prev;
        newId = 11000 + prev.tickets.length + 1;
        const now = new Date().toISOString();
        const ticket = {
          id: newId,
          subject: payload.subject,
          category: payload.category,
          status: 2,
          statusLabel: "Open",
          createdAt: now,
          updatedAt: now,
          orderNumber: payload.orderReference,
          description: payload.description,
          conversations: [
            {
              id: 1,
              from: prev.profile.fullName,
              customer: true,
              body: payload.description,
              createdAt: now,
            },
          ],
        };
        return { ...prev, tickets: [ticket, ...prev.tickets] };
      });
      showToast(`Support request #${newId} submitted.`);
    },
    [showToast]
  );

  const handleSaveProfile = useCallback(
    async (payload: {
      firstName?: string;
      lastName?: string;
      companyName?: string;
      phone?: string;
      gstin?: string;
    }) => {
      await api.account.updateProfile(payload);
      setBootstrap((prev) => {
        if (!prev) return prev;
        const profile = {
          ...prev.profile,
          ...payload,
          fullName: [payload.firstName, payload.lastName].filter(Boolean).join(" "),
        };
        return { ...prev, profile };
      });
      showToast("Account details updated.");
    },
    [showToast]
  );

  const handleSaveAddress = useCallback(
    async (payload: AccountAddress) => {
      await api.account.updateAddress(payload.id, payload);
      setBootstrap((prev) => {
        if (!prev) return prev;
        if (payload.id === "billing") {
          return {
            ...prev,
            profile: { ...prev.profile, billingAddress: payload },
          };
        }
        return {
          ...prev,
          profile: {
            ...prev.profile,
            shippingAddresses: prev.profile.shippingAddresses.map((a) =>
              a.id === payload.id ? payload : a
            ),
          },
        };
      });
      showToast("Address updated.");
    },
    [showToast]
  );

  const handleInvoiceDownload = useCallback(
    (e?: MouseEvent) => {
      e?.preventDefault();
      const ordersList = bootstrap?.orders ?? [];
      const invoicesList = bootstrap?.invoices ?? [];
      const order = selectedOrderDetail ?? ordersList.find((o) => o.id === selectedOrderId);
      if (!order?.invoiceId) {
        showToast("Invoice not available yet for this order.", "bad");
        return;
      }
      const invoice = invoicesList.find((inv) => inv.id === order.invoiceId);
      if (invoice?.url) {
        window.open(invoice.url, "_blank", "noopener");
      } else {
        showToast("Invoice link not available. Please contact support.", "bad");
      }
    },
    [bootstrap, selectedOrderDetail, selectedOrderId, showToast]
  );

  const profile = bootstrap?.profile;
  const orders = bootstrap?.orders ?? [];
  const invoices = bootstrap?.invoices ?? [];
  const payments = bootstrap?.payments ?? [];
  const tickets = bootstrap?.tickets ?? [];
  const selectedTicket =
    selectedTicketId != null
      ? tickets.find((t) => t.id === selectedTicketId) ?? null
      : null;
  const selectedOrder =
    selectedOrderId != null
      ? selectedOrderDetail ?? orders.find((o) => o.id === selectedOrderId) ?? null
      : null;

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

  if (!ready || !isAuthenticated) {
    return null;
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
                            <AccountOrderProgress order={recentOrder} />
                            <div className="a295-order-actions">
                              <button
                                type="button"
                                className="a295-btn primary"
                                onClick={() => openOrder(recentOrder.id)}
                              >
                                View order
                              </button>
                              {recentOrder.invoiceId ? (
                                <a
                                  className="a295-btn"
                                  href="#"
                                  onClick={handleInvoiceDownload}
                                >
                                  Download invoice
                                </a>
                              ) : null}
                              {recentOrder.shipment?.trackingNumber ? (
                                <button
                                  type="button"
                                  className="a295-btn"
                                  onClick={() => openOrder(recentOrder.id)}
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
                                  onClick={handleInvoiceDownload}
                                >
                                  Download invoice
                                </a>
                              ) : null}
                              <button
                                type="button"
                                className="a295-btn"
                                onClick={() => openOrder(o.id)}
                              >
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
                                    <a href="#" onClick={handleInvoiceDownload}>
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
                        <button type="button" onClick={() => setProfileOpen(true)}>
                          Edit
                        </button>
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
                          <button
                            type="button"
                            onClick={() => setEditAddress(profile.billingAddress)}
                          >
                            Edit
                          </button>
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
                          <button type="button" onClick={() => setEditAddress(a)}>
                            Edit
                          </button>
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
                    <button
                      type="button"
                      className="a295-btn primary"
                      onClick={() => openNewTicket()}
                    >
                      New support request
                    </button>
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
                          <button
                            type="button"
                            className="a295-btn primary"
                            onClick={() => openNewTicket()}
                          >
                            New support request
                          </button>
                        </div>
                      ) : (
                        tickets.map((t) => {
                          const st = ticketStatus(t);
                          return (
                            <button
                              key={t.id}
                              type="button"
                              className="a295-ticket"
                              onClick={() => setSelectedTicketId(t.id)}
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
        </Container>
      </section>

      <AccountOrderDialog
        order={selectedOrder}
        open={selectedOrderId !== null && selectedOrder !== null}
        onClose={() => { setSelectedOrderId(null); setSelectedOrderDetail(null); }}
        onGetSupport={(orderNumber) => {
          goToPanel("support");
          openNewTicket(orderNumber);
        }}
        onInvoiceDownload={() => handleInvoiceDownload()}
      />
      <AccountTicketDialog
        ticket={selectedTicket}
        customerName={fullName}
        open={selectedTicketId !== null && selectedTicket !== null}
        onClose={() => setSelectedTicketId(null)}
        onReply={handleTicketReply}
      />
      <AccountNewTicketDialog
        open={newTicketOpen}
        onClose={() => setNewTicketOpen(false)}
        profile={{
          email: profile?.email ?? session?.email ?? "",
          phone: profile?.phone ?? "",
        }}
        orderReference={newTicketOrderRef}
        onSubmit={handleCreateTicket}
      />
      <AccountProfileDialog
        open={profileOpen}
        profile={profile ?? null}
        onClose={() => setProfileOpen(false)}
        onSave={handleSaveProfile}
      />
      <AccountAddressDialog
        open={editAddress !== null}
        address={editAddress}
        onClose={() => setEditAddress(null)}
        onSave={handleSaveAddress}
      />
      {toastPortal}
    </main>
  );
}
