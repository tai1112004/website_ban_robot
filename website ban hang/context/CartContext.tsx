"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { ProductModel } from "@/data/products";
import type { CartItem } from "@/types/cart";
import {
  CART_KEY,
  cartReducer,
  readCart,
  subtotal,
  toCartItem,
} from "@/lib/cart";

type CartValue = {
  items: CartItem[];
  ready: boolean;
  storageUnavailable: boolean;
  addItem: (product: ProductModel) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number | null;
};
const CartContext = createContext<CartValue | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    ready: false,
  });
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  useEffect(() => {
    try {
      dispatch({
        type: "hydrate",
        items: readCart(localStorage.getItem(CART_KEY)),
      });
    } catch {
      setStorageUnavailable(true);
      dispatch({ type: "hydrate", items: [] });
    }
    const sync = (event: StorageEvent) => {
      if (event.key === CART_KEY || event.key === null)
        dispatch({ type: "hydrate", items: readCart(event.newValue) });
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (!state.ready) return;
    try {
      const next = JSON.stringify(
        state.items.map(({ id, quantity }) => ({ id, quantity })),
      );
      if (localStorage.getItem(CART_KEY) !== next)
        localStorage.setItem(CART_KEY, next);
      setStorageUnavailable(false);
    } catch {
      setStorageUnavailable(true);
    }
  }, [state.items, state.ready]);
  const addItem = useCallback(
    (product: ProductModel) =>
      dispatch({ type: "add", item: toCartItem(product) }),
    [],
  );
  const removeItem = useCallback(
    (id: string) => dispatch({ type: "remove", id }),
    [],
  );
  const updateQuantity = useCallback(
    (id: string, quantity: number) =>
      dispatch({ type: "quantity", id, quantity }),
    [],
  );
  const clearCart = useCallback(() => dispatch({ type: "clear" }), []);
  const value = useMemo(
    () => ({
      ...state,
      storageUnavailable,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems: () =>
        state.items.reduce((sum, item) => sum + item.quantity, 0),
      getSubtotal: () => subtotal(state.items),
    }),
    [state, storageUnavailable, addItem, removeItem, updateQuantity, clearCart],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart requires CartProvider");
  return value;
}
