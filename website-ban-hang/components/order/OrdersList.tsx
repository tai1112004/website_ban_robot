"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import useOrders from "@/hooks/useOrders";
import AccountShell from "../account/AccountShell";
import { LoadingOrders, OrdersError } from "../account/AccountDataState";
import OrderCard from "./OrderCard";
import EmptyOrders from "./EmptyOrders";
export default function OrdersList() {
  const { t } = useLanguage();
  const { orders, loading, error, reload } = useOrders();
  const [sort, setSort] = useState("newest");
  const sorted = sort === "newest" ? orders : [...orders].reverse();
  return (
    <AccountShell active="orders">
      <nav className="account-breadcrumb" aria-label={t("Breadcrumb")}>
        <a href="/">{t("HOME")}</a>
        <span>/</span>
        <a href="/account">{t("ACCOUNT")}</a>
        <span>/</span>
        <span aria-current="page">{t("ORDERS")}</span>
      </nav>
      <header className="account-heading">
        <h1>{t("YOUR ORDERS.")}</h1>
        <p>{t("Track every step of your Robo journey.")}</p>
      </header>
      {loading ? (
        <LoadingOrders />
      ) : error ? (
        <OrdersError retry={reload} />
      ) : orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <>
          <div className="history-toolbar">
            <span>
              {orders.length} {t(orders.length === 1 ? "ORDER" : "ORDERS")}
            </span>
            <label htmlFor="order-sort">
              {t("SORT BY")}{" "}
              <select
                id="order-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="newest">{t("NEWEST")}</option>
                <option value="oldest">{t("OLDEST")}</option>
              </select>
            </label>
          </div>
          <section className="history-list" aria-label={t("Your saved orders")}>
            {sorted.map((order) => (
              <OrderCard key={order.internalId} order={order} />
            ))}
          </section>
        </>
      )}
    </AccountShell>
  );
}
