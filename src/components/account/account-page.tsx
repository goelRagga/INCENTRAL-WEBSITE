"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Container } from "@/components/common/container";
import { accountPage } from "@/config/account";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/backend";

type Order = {
  salesorder_id: string;
  salesorder_number: string;
  date: string;
  status: string;
  total: number;
  currency_code?: string;
};

type Profile = {
  contact_name?: string;
  company_name?: string;
  email?: string;
  phone?: string;
};

export function AccountPage() {
  const router = useRouter();
  const { ready, isAuthenticated, session, signOut } = useAuth();
  const { hero, overviewEyebrow, widgets } = accountPage;
  const signedOut = useRef(false);

  const [profile, setProfile] = useState<Profile | null | "loading">("loading");
  const [orders, setOrders] = useState<Order[] | null>(null);

  // Auth guard — skip redirect if user explicitly signed out (they get pushed to / instead)
  useEffect(() => {
    if (ready && !isAuthenticated && !signedOut.current) {
      router.replace("/sign-in?next=/account");
    }
  }, [ready, isAuthenticated, router]);

  // Fetch data once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    api.account.profile()
      .then((data) => setProfile(data as Profile))
      .catch(() => setProfile(null));
    api.account.orders().then((data: unknown) => {
      const list = Array.isArray(data) ? data : (data as { salesorders?: Order[] })?.salesorders ?? [];
      setOrders(list as Order[]);
    }).catch(() => setOrders([]));
  }, [isAuthenticated]);

  const handleSignOut = useCallback(async () => {
    signedOut.current = true;
    await signOut();
    router.push("/");
  }, [signOut, router]);

  if (!ready || !isAuthenticated) {
    return (
      <main id="main" className="account-page min-h-[52vh] bg-white">
        <Container className="py-20 text-center text-sm text-[#64757e]">Loading…</Container>
      </main>
    );
  }

  const displayName = profile !== "loading"
    ? (profile?.contact_name || session?.name || session?.email || undefined)
    : (session?.name || session?.email || undefined);

  return (
    <main id="main" className="account-page min-h-[52vh] bg-white">
      <section className="border-b border-[#e2e2dc] bg-inc-warm py-[54px] pb-[50px] max-[760px]:py-[38px] max-[760px]:pb-[34px]">
        <Container>
          <p className="account-eyebrow">{hero.eyebrow}</p>
          <h1 className="account-hero-title">
            {hero.title}
            {displayName ? `, ${displayName.split(" ")[0]}` : null}
          </h1>
          <p className="account-hero-lead">{hero.lead}</p>
        </Container>
      </section>

      <section className="py-[62px] max-[760px]:py-[46px]">
        <Container>
          <div className="account-section-head">
            <div>
              <p className="account-eyebrow">{overviewEyebrow}</p>
            </div>
          </div>

          <div className="account-dashboard-grid">
            {widgets.map((widget) => {
              if (widget.id === "orders") {
                return (
                  <section key={widget.id} className="account-widget">
                    <h2>{widget.title}</h2>
                    <p>{widget.description}</p>
                    {orders === null ? (
                      <div className="account-widget-state text-[#64757e]">Loading orders…</div>
                    ) : orders.length === 0 ? (
                      <div className="account-widget-state">{widget.emptyState}</div>
                    ) : (
                      <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#e2e2dc] text-left text-[#64757e]">
                              <th className="pb-2 pr-4 font-medium">Order</th>
                              <th className="pb-2 pr-4 font-medium">Date</th>
                              <th className="pb-2 pr-4 font-medium">Status</th>
                              <th className="pb-2 font-medium text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((o) => (
                              <tr key={o.salesorder_id} className="border-b border-[#f0f0ec]">
                                <td className="py-2 pr-4 font-medium text-inc-blue">{o.salesorder_number}</td>
                                <td className="py-2 pr-4 text-[#64757e]">{o.date}</td>
                                <td className="py-2 pr-4 capitalize text-[#64757e]">{o.status?.replace(/_/g, " ")}</td>
                                <td className="py-2 text-right">
                                  {o.currency_code ?? "₹"} {Number(o.total).toLocaleString("en-IN")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                );
              }

              if (widget.id === "account-company") {
                return (
                  <section key={widget.id} className="account-widget">
                    <h2>{widget.title}</h2>
                    <p>{widget.description}</p>
                    {profile === "loading" ? (
                      <div className="account-widget-state text-[#64757e]">Loading profile…</div>
                    ) : profile ? (
                      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                        {profile.contact_name && <><dt className="font-medium text-[#64757e]">Name</dt><dd>{profile.contact_name}</dd></>}
                        {profile.company_name && <><dt className="font-medium text-[#64757e]">Company</dt><dd>{profile.company_name}</dd></>}
                        {profile.email && <><dt className="font-medium text-[#64757e]">Email</dt><dd>{profile.email}</dd></>}
                        {profile.phone && <><dt className="font-medium text-[#64757e]">Mobile</dt><dd>{profile.phone}</dd></>}
                      </dl>
                    ) : (
                      <div className="account-widget-state">{widget.emptyState}</div>
                    )}
                  </section>
                );
              }

              return (
                <section key={widget.id} className="account-widget">
                  <h2>{widget.title}</h2>
                  <p>{widget.description}</p>
                  <div className="account-widget-state">{widget.emptyState}</div>
                </section>
              );
            })}
          </div>

          <div className="mt-12 flex justify-end">
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border border-[#d8dfe2] bg-white px-5 py-2 text-sm font-medium text-[#64757e] transition-colors hover:border-[#b0bec5] hover:text-[#152129]"
            >
              Sign out
            </button>
          </div>
        </Container>
      </section>
    </main>
  );
}
