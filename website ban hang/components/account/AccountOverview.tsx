"use client";
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
  const { orders, latestOrder, loading, error, reload } = useOrders();
  const devices = useRobots();
  const profile = latestOrder?.customer;
  const hasProfile =
    profile && Object.values(profile).some((value) => value.trim());
  return (
    <AccountShell active="overview">
      <header className="account-heading">
        <p className="eyebrow">MY ACCOUNT</p>
        <h1>WELCOME BACK.</h1>
        <p>Manage your orders and get ready for your future Robo.</p>
      </header>
      {loading ? (
        <LoadingOrders />
      ) : error ? (
        <OrdersError retry={reload} />
      ) : (
        <>
          <section className="account-overview" aria-label="Account overview">
            <article>
              <Package size={26} strokeWidth={1.3} />
              <h2>ORDERS</h2>
              <p>View your Robo orders and track their status.</p>
              <strong className="account-count">
                {orders.length}{" "}
                <span>{orders.length === 1 ? "ORDER" : "ORDERS"}</span>
              </strong>
              <a href="/orders">
                VIEW ORDERS <ArrowUpRight size={15} />
              </a>
            </article>
            <article>
              <Bot size={26} strokeWidth={1.3} />
              <h2>MY ROBOTS</h2>
              <p>Your connected Robo devices, all in one place.</p>
              {devices.isLoading ? (
                <p role="status">Loading Robos...</p>
              ) : devices.error ? (
                <p role="alert">
                  Robos unavailable.{" "}
                  <button onClick={devices.refresh}>Try again</button>
                </p>
              ) : (
                <strong className="account-count">
                  {devices.robots.length} <span>CONNECTED</span>
                </strong>
              )}
              <a href="/my-robots">
                VIEW MY ROBOTS <ArrowUpRight size={15} />
              </a>
            </article>
            <article className="account-profile">
              <UserRound size={26} strokeWidth={1.3} />
              <h2>PROFILE</h2>
              {hasProfile ? (
                <>
                  <p>From your most recent order.</p>
                  <dl>
                    <div>
                      <dt>Name</dt>
                      <dd>
                        {[profile.firstName, profile.lastName]
                          .filter(Boolean)
                          .join(" ") || "Not provided"}
                      </dd>
                    </div>
                    <div>
                      <dt>Email</dt>
                      <dd>{profile.email || "Not provided"}</dd>
                    </div>
                    <div>
                      <dt>Phone</dt>
                      <dd>{profile.phone || "Not provided"}</dd>
                    </div>
                  </dl>
                </>
              ) : (
                <p>No profile information yet.</p>
              )}
              <span className="account-soon">ACCOUNT SETTINGS COMING SOON</span>
            </article>
            <article>
              <MessageCircle size={26} strokeWidth={1.3} />
              <h2>SUPPORT</h2>
              <p>Need help with your Robo order?</p>
              <p className="account-support-note">
                Support services will be available in a future release.
              </p>
              <a href="/support">
                CONTACT SUPPORT <ArrowUpRight size={15} />
              </a>
            </article>
          </section>
          <section className="account-recent">
            <p className="eyebrow">YOUR ROBO JOURNEY</p>
            <h2>RECENT ORDER</h2>
            {latestOrder ? (
              <OrderCard order={latestOrder} />
            ) : (
              <div className="account-empty">
                <h3>NO ORDERS YET.</h3>
                <p>Your Robo journey can start whenever you&apos;re ready.</p>
                <Button href="/#models">DISCOVER ROBO</Button>
              </div>
            )}
          </section>
        </>
      )}
    </AccountShell>
  );
}
