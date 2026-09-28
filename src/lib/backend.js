import { clearAuthSession, readAuthSession } from './auth/session';

const BASE = '';

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // Expired session detected from a protected endpoint — clear local state and redirect
    if (res.status === 401 && !path.startsWith('/auth/') && typeof window !== 'undefined' && readAuthSession()) {
      clearAuthSession();
      window.location.href = '/sign-in?expired=1';
    }
    throw Object.assign(new Error(data?.error || `HTTP ${res.status}`), { status: res.status, data });
  }
  return data;
}

export const api = {
  catalog: {
    products: ()    => apiFetch('/catalog/products'),
    product:  (id)  => apiFetch(`/catalog/products/${id}`),
    categories: ()  => apiFetch('/catalog/categories'),
  },
  store: {
    meta:   () => apiFetch('/store/meta'),
    stores: () => apiFetch('/store/stores'),
    taxes:  () => apiFetch('/store/taxes'),
  },
  cart: {
    get:    ()    => apiFetch('/cart'),
    add:    (b)   => apiFetch('/cart', { method: 'POST', body: JSON.stringify(b) }),
    update: (b)   => apiFetch('/cart', { method: 'PUT',  body: JSON.stringify(b) }),
    remove: (b)   => apiFetch('/cart', { method: 'DELETE', body: JSON.stringify(b) }),
  },
  checkout: {
    get:      (checkoutId)  => apiFetch(`/checkout?checkoutId=${checkoutId}`),
    address:  (b)           => apiFetch('/checkout/address',  { method: 'POST', body: JSON.stringify(b) }),
    shipping: (b)           => apiFetch('/checkout/shipping', { method: 'POST', body: JSON.stringify(b) }),
    place:    (b)           => apiFetch('/checkout/place',    { method: 'POST', body: JSON.stringify(b) }),
  },
  auth: {
    signIn:  (b) => apiFetch('/auth/signin',  { method: 'POST', body: JSON.stringify(b) }),
    signUp:  (b) => apiFetch('/auth/signup',  { method: 'POST', body: JSON.stringify(b) }),
    signOut: ()  => apiFetch('/auth/signout', { method: 'POST' }),
    me:      ()  => apiFetch('/auth/me'),
  },
  account: {
    profile:   ()    => apiFetch('/account/profile'),
    orders:    ()    => apiFetch('/account/orders'),
    order:     (id)  => apiFetch(`/account/orders/${id}`),
    addresses: ()    => apiFetch('/account/addresses'),
  },
  coupons: {
    apply: (b) => apiFetch('/coupons/apply', { method: 'POST', body: JSON.stringify(b) }),
  },
  payments: {
    config: () => apiFetch('/payments/config'),
  },
};
