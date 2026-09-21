import type { CartItem } from "./cart";
export type CheckoutFormData = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};
export type CheckoutErrors = Partial<
  Record<keyof CheckoutFormData | "confirmed", string>
>;
export type OrderStatus =
  "ORDER_RECEIVED" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED";
export type CheckoutCustomer = Pick<
  CheckoutFormData,
  "email" | "phone" | "firstName" | "lastName"
>;
export type ShippingAddress = Omit<CheckoutFormData, "email" | "phone">;
export type Order = {
  id: string;
  internalId: string;
  createdAt: string;
  customer: CheckoutCustomer;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number | null;
  shipping: number | null;
  total: number | null;
  status: OrderStatus;
};
