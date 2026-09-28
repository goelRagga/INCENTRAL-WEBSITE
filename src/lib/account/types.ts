/** Account dashboard shapes aligned with portal account-dashboard-v339 mock bootstrap. */

export type AccountAddress = {
  id: string;
  label?: string;
  attention?: string;
  address?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

export type AccountProfile = {
  firstName: string;
  lastName: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  gstin?: string;
  gstTreatment?: string;
  billingAddress: AccountAddress;
  shippingAddresses: AccountAddress[];
};

export type AccountOrderItem = {
  name: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type AccountShipment = {
  status?: string;
  carrier?: string;
  trackingNumber?: string;
  deliveryMethod?: string;
  shippingDate?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  detail?: string;
};

export type AccountOrder = {
  id: string;
  number: string;
  date: string;
  status: string;
  stage?: string;
  total: number;
  currencyCode?: string;
  items: AccountOrderItem[];
  shipment?: AccountShipment | null;
  invoiceId?: string;
  invoiceNumber?: string;
  canCancel?: boolean;
};

export type AccountInvoice = {
  id: string;
  number: string;
  date: string;
  status: string;
  total: number;
  balance: number;
  orderNumber?: string;
};

export type AccountPayment = {
  id: string;
  date: string;
  status?: string;
  mode: string;
  amount: number;
  reference?: string;
  invoiceNumber?: string;
};

export type AccountTicket = {
  id: number;
  subject: string;
  category?: string;
  status: number;
  statusLabel?: string;
  createdAt: string;
  updatedAt: string;
  orderNumber?: string;
  description?: string;
};

export type AccountBootstrap = {
  profile: AccountProfile;
  orders: AccountOrder[];
  invoices: AccountInvoice[];
  payments: AccountPayment[];
  tickets: AccountTicket[];
};
