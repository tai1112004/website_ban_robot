import type { CheckoutErrors, CheckoutFormData, Order } from "../types/order";
import type { CartItem } from "../types/cart";
import { subtotal } from "./cart";
export const ORDERS_KEY = "robo-ai-orders";
export const LAST_ORDER_KEY = "robo-ai-last-order";
export const countries = [
  "Vietnam",
  "United States",
  "United Kingdom",
  "Singapore",
  "Japan",
  "South Korea",
  "Other",
];
export const initialCheckout: CheckoutFormData = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  province: "",
  postalCode: "",
  country: "Vietnam",
};
export function validateCheckout(
  data: CheckoutFormData,
  confirmed: boolean,
): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const required: Partial<Record<keyof CheckoutFormData, string>> = {
    email: "email",
    phone: "phone number",
    firstName: "first name",
    lastName: "last name",
    address: "shipping address",
    city: "city",
    province: "province or state",
    country: "country",
  };
  for (const key of Object.keys(required) as (keyof CheckoutFormData)[])
    if (!data[key].trim()) errors[key] = `Please enter your ${required[key]}.`;
  if (
    data.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
  )
    errors.email = "Please enter a valid email address.";
  const phone = data.phone.trim();
  const digits = phone.replace(/\D/g, "");
  if (
    phone &&
    (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15)
  )
    errors.phone = "Please enter a valid phone number (7–15 digits).";
  if (!countries.includes(data.country))
    errors.country = "Please select a country.";
  if (!confirmed)
    errors.confirmed = "Please confirm that your information is correct.";
  return errors;
}
export function generateOrderId(date = new Date()) {
  const day = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `ROBO-${day}-${Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("")}`;
}
export function createDemoOrder(
  data: CheckoutFormData,
  items: CartItem[],
): Order {
  if (!items.length) throw new Error("Cannot create an empty order");
  const clean = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value.trim()]),
  ) as CheckoutFormData;
  const { email, phone, ...shippingAddress } = clean;
  return {
    id: generateOrderId(),
    internalId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    customer: {
      email,
      phone,
      firstName: clean.firstName,
      lastName: clean.lastName,
    },
    shippingAddress,
    items: items.map((item) => ({ ...item })),
    subtotal: subtotal(items),
    shipping: null,
    total: null,
    status: "ORDER_RECEIVED",
  };
}
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isOrder(value: unknown): value is Order {
  if (
    !record(value) ||
    typeof value.id !== "string" ||
    !/^ROBO-\d{8}-[A-Z0-9]{4}$/.test(value.id) ||
    typeof value.internalId !== "string" ||
    typeof value.createdAt !== "string" ||
    !Number.isFinite(Date.parse(value.createdAt))
  )
    return false;
  if (
    !record(value.customer) ||
    !record(value.shippingAddress) ||
    !Array.isArray(value.items) ||
    !value.items.length
  )
    return false;
  if (
    !["email", "phone", "firstName", "lastName"].every(
      (key) =>
        typeof (value.customer as Record<string, unknown>)[key] === "string",
    )
  )
    return false;
  if (
    ![
      "firstName",
      "lastName",
      "address",
      "apartment",
      "city",
      "province",
      "postalCode",
      "country",
    ].every(
      (key) =>
        typeof (value.shippingAddress as Record<string, unknown>)[key] ===
        "string",
    )
  )
    return false;
  const money = (v: unknown) =>
    v === null || (typeof v === "number" && Number.isFinite(v) && v >= 0);
  return (
    [
      "ORDER_RECEIVED",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
    ].includes(String(value.status)) &&
    money(value.subtotal) &&
    money(value.shipping) &&
    money(value.total) &&
    value.items.every(
      (item) =>
        record(item) &&
        [
          "id",
          "slug",
          "name",
          "model",
          "tagline",
          "image",
          "currency",
          "availability",
        ].every((key) => typeof item[key] === "string") &&
        typeof item.quantity === "number" &&
        Number.isSafeInteger(item.quantity) &&
        item.quantity > 0 &&
        money(item.price),
    )
  );
}
export function getOrders(): Order[] {
  const raw = localStorage.getItem(ORDERS_KEY);
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    return Array.isArray(value)
      ? value.map(normalizeOrderInfo).filter(isOrder)
      : [];
  } catch {
    return [];
  }
}
function normalizeOrderInfo(value: unknown): unknown {
  if (!record(value)) return value;
  const strings = (input: unknown, keys: string[]) =>
    Object.fromEntries(
      keys.map((key) => [
        key,
        record(input) && typeof input[key] === "string" ? input[key] : "",
      ]),
    );
  return {
    ...value,
    customer: strings(value.customer, [
      "email",
      "phone",
      "firstName",
      "lastName",
    ]),
    shippingAddress: strings(value.shippingAddress, [
      "firstName",
      "lastName",
      "address",
      "apartment",
      "city",
      "province",
      "postalCode",
      "country",
    ]),
    items: Array.isArray(value.items)
      ? value.items.map((item) =>
          record(item)
            ? {
                ...item,
                image: typeof item.image === "string" ? item.image : "",
              }
            : item,
        )
      : value.items,
  };
}
export function saveOrder(order: Order) {
  const orders = getOrders();
  if (orders.some((item) => item.internalId === order.internalId)) return;
  if (orders.some((item) => item.id === order.id))
    throw new Error("Order reference collision");
  localStorage.setItem(ORDERS_KEY, JSON.stringify([...orders, order]));
}
export function saveCheckoutOrder(order: Order) {
  const orders = getOrders();
  while (orders.some((item) => item.id === order.id))
    order.id = generateOrderId();
  // Prepare the handoff first. A failed order write never clears the cart.
  const previous = sessionStorage.getItem(LAST_ORDER_KEY);
  sessionStorage.setItem(LAST_ORDER_KEY, order.id);
  try {
    saveOrder(order);
  } catch (error) {
    try {
      if (previous === null) sessionStorage.removeItem(LAST_ORDER_KEY);
      else sessionStorage.setItem(LAST_ORDER_KEY, previous);
    } catch {
      // Storage may have become unavailable; preserve the original save error.
    }
    throw error;
  }
}
export function getLastOrder(): Order | undefined {
  const id = sessionStorage.getItem(LAST_ORDER_KEY);
  return getOrders().find((order) => order.id === id);
}
export function getOrderById(id: string): Order | null {
  return getOrders().find((order) => order.id === id) ?? null;
}
export type RecentOrderResult =
  | { state: "found"; order: Order }
  | { state: "no-recent" | "not-found" | "unavailable" };
export function getRecentOrder(): RecentOrderResult {
  try {
    const id = sessionStorage.getItem(LAST_ORDER_KEY);
    if (!id) return { state: "no-recent" };
    const order = getOrderById(id);
    return order ? { state: "found", order } : { state: "not-found" };
  } catch {
    return { state: "unavailable" };
  }
}
