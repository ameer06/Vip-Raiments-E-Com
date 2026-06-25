export function sanitizeInput(value: string, maxLength = 500): string {
  return value.trim().slice(0, maxLength);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^\+?\d{10,15}$/.test(phone);
}

export function isValidPostalCode(code: string): boolean {
  return /^\d{4,10}$/.test(code);
}

export function isValidAmount(amount: unknown): amount is number {
  return typeof amount === "number" && amount > 0 && amount < 10000000 && Number.isFinite(amount);
}

export function isValidOrderRef(ref: string): boolean {
  return /^ORDER_\d{13,}$/.test(ref);
}

export function validateCheckoutPayload(body: Record<string, unknown>): {
  ok: true;
  sanitized: {
    email: string;
    customerName: string;
    phone: string;
    addressLine: string;
    city: string;
    postalCode: string;
    amount: number;
    orderRef: string;
    items: unknown[];
  };
} | { ok: false; error: string } {
  const email = body.email;
  const customerName = body.customerName;
  const phone = body.phone;
  const addressLine = body.addressLine;
  const city = body.city;
  const postalCode = body.postalCode;
  const amount = body.amount;
  const orderRef = body.orderRef;
  const items = body.items;

  if (!email || !customerName || !addressLine || !city || !postalCode || !amount || !orderRef || !items) {
    return { ok: false, error: "Missing required fields" };
  }

  if (typeof email !== "string" || !isValidEmail(email)) {
    return { ok: false, error: "Invalid email address" };
  }

  if (typeof customerName !== "string" || customerName.trim().length < 2) {
    return { ok: false, error: "Name must be at least 2 characters" };
  }

  if (phone && typeof phone === "string" && !isValidPhone(phone)) {
    return { ok: false, error: "Invalid phone number" };
  }

  if (typeof addressLine !== "string" || addressLine.trim().length < 5) {
    return { ok: false, error: "Address must be at least 5 characters" };
  }

  if (typeof city !== "string" || city.trim().length < 2) {
    return { ok: false, error: "Invalid city" };
  }

  if (typeof postalCode !== "string" || !isValidPostalCode(postalCode)) {
    return { ok: false, error: "Invalid postal code" };
  }

  if (!isValidAmount(amount)) {
    return { ok: false, error: "Invalid amount" };
  }

  if (typeof orderRef !== "string" || !isValidOrderRef(orderRef)) {
    return { ok: false, error: "Invalid order reference" };
  }

  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return { ok: false, error: "Invalid items" };
  }

  return {
    ok: true,
    sanitized: {
      email: sanitizeInput(email, 254),
      customerName: sanitizeInput(customerName, 200),
      phone: phone ? sanitizeInput(String(phone), 20) : "",
      addressLine: sanitizeInput(addressLine, 500),
      city: sanitizeInput(city, 200),
      postalCode: sanitizeInput(postalCode, 10),
      amount: Math.round(Number(amount)),
      orderRef: sanitizeInput(orderRef, 50),
      items,
    },
  };
}
