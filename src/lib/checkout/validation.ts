export type AddressFormValues = {
  email: string;
  marketingOptIn: boolean;
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  billingSame: boolean;
  billingFirstName: string;
  billingLastName: string;
  billingAddress1: string;
  billingCity: string;
  billingState: string;
  billingPostalCode: string;
  includeCompanyTax: boolean;
  companyName: string;
  gstin: string;
};

export type FieldErrors = Partial<Record<keyof AddressFormValues, string>>;

const ERROR_LABELS: Partial<Record<keyof AddressFormValues, string>> = {
  email: "Email",
  firstName: "First name",
  lastName: "Last name",
  address1: "Address",
  city: "City",
  state: "State / Union Territory",
  postalCode: "PIN code",
  phone: "Mobile number",
  companyName: "Company name",
  gstin: "GSTIN",
  billingFirstName: "Billing first name",
  billingLastName: "Billing last name",
  billingAddress1: "Billing address",
  billingCity: "Billing city",
  billingState: "Billing State / Union Territory",
  billingPostalCode: "Billing PIN code",
};

export function validateAddressForm(values: AddressFormValues): FieldErrors {
  const errors: FieldErrors = {};
  const req: (keyof AddressFormValues)[] = [
    "email",
    "firstName",
    "lastName",
    "address1",
    "city",
    "state",
    "postalCode",
    "phone",
  ];

  req.forEach((name) => {
    const v = String(values[name] ?? "").trim();
    if (!v) errors[name] = "Required";
  });

  const email = values.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }

  const pin = values.postalCode.trim();
  if (pin && !/^\d{6}$/.test(pin)) {
    errors.postalCode = "Enter a 6 digit PIN code";
  }

  const phone = values.phone.replace(/\D/g, "");
  if (phone && phone.length !== 10) {
    errors.phone = "Enter a 10 digit mobile number";
  }

  if (values.includeCompanyTax) {
    if (!values.companyName.trim()) {
      errors.companyName = "Required when company tax details are included";
    }
    const gstin = values.gstin.trim().toUpperCase();
    if (
      gstin &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gstin)
    ) {
      errors.gstin = "Enter a valid GSTIN";
    }
  }

  if (!values.billingSame) {
    (
      [
        "billingFirstName",
        "billingLastName",
        "billingAddress1",
        "billingCity",
        "billingState",
        "billingPostalCode",
      ] as const
    ).forEach((name) => {
      if (!String(values[name] ?? "").trim()) errors[name] = "Required";
    });
    const billingPin = values.billingPostalCode.trim();
    if (billingPin && !/^\d{6}$/.test(billingPin)) {
      errors.billingPostalCode = "Enter a 6 digit PIN code";
    }
  }

  return errors;
}

export function errorSummaryEntries(errors: FieldErrors) {
  return Object.entries(errors)
    .filter(([, msg]) => msg)
    .map(([name, msg]) => ({
      name: name as keyof AddressFormValues,
      label: ERROR_LABELS[name as keyof AddressFormValues] || name,
      message: msg as string,
    }));
}
