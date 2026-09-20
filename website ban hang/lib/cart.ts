import { roboBasic, type ProductModel } from "../data/products";
import type { CartItem } from "../types/cart";

export const CART_KEY = "robo-ai-cart";
export const MAX_QUANTITY = 5;
const catalog: ProductModel[] = [roboBasic];

export function validQuantity(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(MAX_QUANTITY, Math.max(1, Math.floor(value)))
    : 1;
}
export function toCartItem(product: ProductModel, quantity = 1): CartItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    model: product.id,
    tagline: product.tagline,
    image: product.media.gallery[0].src,
    quantity: validQuantity(quantity),
    price: product.price?.amount ?? null,
    currency: product.price?.currency ?? "USD",
    availability: product.availability,
  };
}
// Storage only identifies products. Current catalog data owns names, images and prices.
export function readCart(raw: string | null): CartItem[] {
  try {
    const entries: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(entries)) return [];
    const items = new Map<string, CartItem>();
    for (const entry of entries) {
      if (!entry || typeof entry !== "object") continue;
      const product = catalog.find((item) => item.id === entry.id);
      if (!product) continue;
      const quantity = validQuantity(entry.quantity);
      items.set(
        product.id,
        toCartItem(product, (items.get(product.id)?.quantity ?? 0) + quantity),
      );
    }
    return [...items.values()];
  } catch {
    return [];
  }
}
export type CartAction =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; item: CartItem }
  | { type: "remove"; id: string }
  | { type: "quantity"; id: string; quantity: number }
  | { type: "clear" };
export type CartState = { items: CartItem[]; ready: boolean };
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { items: action.items, ready: true };
    case "add": {
      const exists = state.items.some((item) => item.id === action.item.id);
      return {
        ...state,
        items: exists
          ? state.items.map((item) =>
              item.id === action.item.id
                ? { ...item, quantity: validQuantity(item.quantity + 1) }
                : item,
            )
          : [...state.items, action.item],
      };
    }
    case "remove":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };
    case "quantity":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id
            ? { ...item, quantity: validQuantity(action.quantity) }
            : item,
        ),
      };
    case "clear":
      return { ...state, items: [] };
  }
}
export function subtotal(items: CartItem[]): number | null {
  if (
    items.some((item) => item.price === null) ||
    new Set(items.map((item) => item.currency)).size > 1
  )
    return null;
  return items.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0,
  );
}
export function formatCartPrice(price: number | null, currency = "USD", locale = "en-US") {
  return price === null
    ? "TO BE ANNOUNCED"
    : new Intl.NumberFormat(locale, { style: "currency", currency }).format(
        price,
      );
}
