"use client";
import { useLanguage } from "@/context/LanguageContext";
import {
  Package,
  Bot,
  UserRound,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import useOrders from "@/hooks/useOrders";
import useRobots from "@/hooks/useRobots";
import AccountShell from "./AccountShell";
import { LoadingOrders, OrdersError } from "./AccountDataState";
import OrderCard from "../order/OrderCard";
import { Button } from "../ui/Button";
export default function AccountOverview() {
  const { t } = useLanguage();
  const { orders, latestOrder, loading, error, reload } = useOrders();
  const devices = useRobots();
  const profile = latestOrder?.customer;
  const hasProfile =
    profile && Object.values(profile).some((value) => value.trim());
  return (
    <AccountShell active="overview">
      <header className="account-heading">
        <p className="eyebrow">{t("MY ACCOUNT")}</p>
        <h1>{t("WELCOME BACK.")}</h1>
        <p>{t("Manage your orders and get ready for your future Robo.")}</p>
      </header>
      {loading ? (
        <LoadingOrders />
      ) : error ? (
        <OrdersError retry={reload} />
      ) : (
        <>
          <section className="account-overview" aria-label={t("Account overview")}>
            <article>
              <Package size={26} strokeWidth={1.3} />
              <h2>{t("ORDERS")}</h2>
              <p>{t("View your Robo orders and track their status.")}</p>
              <strong className="account-count">
                {orders.length}{" "}
                <span>{t(orders.length === 1 ? "ORDER" : "ORDERS")}</span>
              </strong>
              <a href="/orders">
                {t("VIEW ORDERS")} <ArrowUpRight size={15} />
              </a>
            </article>
            <article>
              <Bot size={26} strokeWidth={1.3} />
              <h2>{t("MY ROBOTS")}</h2>
              <p>{t("Your connected Robo devices, all in one place.")}</p>
              {devices.isLoading ? (
                <p role="status">{t("Loading Robos...")}</p>
              ) : devices.error ? (
                <p role="alert">
                  {t("Robos unavailable.")}{" "}
                  <button onClick={devices.refresh}>{t("Try again")}</button>
                </p>
              ) : (
                <strong className="account-count">
                  {devices.robots.length} <span>{t("CONNECTED")}</span>
                </strong>
              )}
              <a href="/my-robots">
                {t("VIEW MY ROBOTS")} <ArrowUpRight size={15} />
              </a>
            </article>
            <article className="account-profile">
              <UserRound size={26} strokeWidth={1.3} />
              <h2>{t("PROFILE")}</h2>
              {hasProfile ? (
                <>
                  <p>{t("From your most recent order.")}</p>
                  <dl>
                    <div>
                      <dt>{t("Name")}</dt>
                      <dd>
                        {[profile.firstName, profile.lastName]
                          .filter(Boolean)
                          .join(" ") || t("Not provided")}
                      </dd>
                    </div>
                    <div>
                      <dt>{t("Email")}</dt>
                      <dd>{profile.email || t("Not provided")}</dd>
                    </div>
                    <div>
                      <dt>{t("Phone")}</dt>
                      <dd>{profile.phone || t("Not provided")}</dd>
                    </div>
                  </dl>
                </>
              ) : (
                <p>{t("No profile information yet.")}</p>
              )}
              <span className="account-soon">{t("ACCOUNT SETTINGS COMING SOON")}</span>
            </article>
            <article>
              <MessageCircle size={26} strokeWidth={1.3} />
              <h2>{t("SUPPORT")}</h2>
              <p>{t("Need help with your Robo order?")}</p>
              <p className="account-support-note">
                {t("Support services will be available in a future release.")} </p>
              <a href="/support">
                {t("CONTACT SUPPORT")} <ArrowUpRight size={15} />
              </a>
            </article>
          </section>
          <section className="account-recent">
            <p className="eyebrow">{t("YOUR ROBO JOURNEY")}</p>
            <h2>{t("RECENT ORDER")}</h2>
            {latestOrder ? (
              <OrderCard order={latestOrder} />
            ) : (
              <div className="account-empty">
                <h3>{t("NO ORDERS YET.")}</h3>
                <p>{t("Your Robo journey can start whenever you're ready.")}</p>
                <Button href="/#models">{t("DISCOVER ROBO")}</Button>
              </div>
            )}
          </section>
        </>
      )}
    </AccountShell>
  );
}
