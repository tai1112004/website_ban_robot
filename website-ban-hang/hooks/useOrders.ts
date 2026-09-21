"use client";
import { useCallback, useEffect, useState } from "react";
import { getOrders, ORDERS_KEY } from "@/lib/orders";
import type { Order } from "@/types/order";
export default function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const reload = useCallback(() => {
    try {
      setOrders(
        getOrders().sort(
          (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
        ),
      );
      setError(false);
    } catch {
      setOrders([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    reload();
    const sync = (event: StorageEvent) => {
      if (event.key === ORDERS_KEY || event.key === null) reload();
    };
    window.addEventListener("storage", sync);
    window.addEventListener("focus", reload);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", reload);
    };
  }, [reload]);
  return { orders, latestOrder: orders[0] ?? null, loading, error, reload };
}
