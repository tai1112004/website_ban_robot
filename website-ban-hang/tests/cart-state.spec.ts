import { test, expect } from "@playwright/test";
import {
  cartReducer,
  formatCartPrice,
  readCart,
  subtotal,
  toCartItem,
  validQuantity,
} from "../lib/cart";
import { roboBasic } from "../data/products";

test("cart restores only catalog products and normalizes unsafe storage", () => {
  for (const raw of ["broken", "{}", "null", '[null,4,"basic"]'])
    expect(readCart(raw)).toEqual([]);
  const items = readCart(
    JSON.stringify([
      { id: "missing", quantity: 3 },
      {
        id: "basic",
        quantity: -7,
        name: "Fake",
        price: 499,
        image: "https://example.com/image",
      },
      { id: "basic", quantity: 2 },
    ]),
  );
  expect(items).toEqual([toCartItem(roboBasic, 3)]);
  for (const value of [null, "3", NaN, Infinity, -2, 0])
    expect(validQuantity(value)).toBe(1);
  expect(validQuantity(2.8)).toBe(2);
  expect(validQuantity(99)).toBe(5);
});

test("quantity, clear and unknown-price totals stay consistent", () => {
  const item = toCartItem(roboBasic);
  let state = cartReducer({ items: [], ready: true }, { type: "add", item });
  state = cartReducer(state, { type: "add", item });
  expect(state.items[0].quantity).toBe(2);
  expect(subtotal(state.items)).toBeNull();
  expect(formatCartPrice(subtotal(state.items))).toBe("TO BE ANNOUNCED");
  state = cartReducer(state, { type: "quantity", id: item.id, quantity: 99 });
  expect(state.items[0].quantity).toBe(5);
  expect(subtotal([{ ...item, price: 100, quantity: 2 }])).toBe(200);
  expect(
    subtotal([
      { ...item, price: 100 },
      { ...item, id: "other", price: null },
    ]),
  ).toBeNull();
  expect(cartReducer(state, { type: "clear" }).items).toEqual([]);
});
