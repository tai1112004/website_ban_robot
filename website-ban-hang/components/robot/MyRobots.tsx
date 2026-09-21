"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";
import AccountShell from "../account/AccountShell";
import useRobots from "@/hooks/useRobots";
import useUnpairRobot from "@/hooks/useUnpairRobot";
import type { RobotDevice } from "@/types/robot";
import RobotCard from "./RobotCard";
import EmptyRobots from "./EmptyRobots";
import { RobotError, RobotLoading } from "./RobotDataState";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
export default function MyRobots() {
  const { t } = useLanguage();
  const { robots, isLoading, error, refresh } = useRobots();
  const { unpair, isUnpairing, error: unpairError, reset } = useUnpairRobot();
  const [selected, setSelected] = useState<RobotDevice | null>(null);
  const [notice, setNotice] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (notice && !selected) heading.current?.focus();
  }, [notice, selected]);
  async function confirm() {
    if (selected && (await unpair(selected.id))) {
      setSelected(null);
      setNotice("Robo unpaired. Your order history is unchanged.");
    }
  }
  return (
    <AccountShell active="robots">
      <nav className="account-breadcrumb" aria-label={t("Breadcrumb")}>
        <a href="/">{t("HOME")}</a>
        <span>/</span>
        <a href="/account">{t("ACCOUNT")}</a>
        <span>/</span>
        <span aria-current="page">{t("MY ROBOTS")}</span>
      </nav>
      <header className="account-heading robot-heading">
        <div>
          <p className="eyebrow">{t("MY ROBOTS")}</p>
          <h1 ref={heading} tabIndex={-1}>
            {t("YOUR ROBOS.")} </h1>
          <p>
            {t("Connect, manage and personalize the Robo devices that belong to you.")} </p>
        </div>
        {!isLoading && !error && robots.length > 0 && (
          <Button href="/my-robots/pair">{t("+ ADD ROBO")}</Button>
        )}
      </header>
      <p role="status" className="robot-notice">
        {t(notice)}
      </p>
      {isLoading ? (
        <RobotLoading />
      ) : error ? (
        <RobotError retry={refresh} />
      ) : robots.length === 0 ? (
        <EmptyRobots />
      ) : (
        <div
          className={`robot-grid ${robots.length === 1 ? "robot-grid-single" : ""}`}
        >
          {robots.map((robot) => (
            <RobotCard
              key={robot.id}
              robot={robot}
              onUnpair={(robot) => {
                reset();
                setNotice("");
                setSelected(robot);
              }}
            />
          ))}
        </div>
      )}
      {selected && (
        <Modal
          title={t("UNPAIR THIS ROBO?")}
          onClose={() => {
            if (!isUnpairing) setSelected(null);
          }}
        >
          <div className="robot-confirm">
            <p>
              {t("Remove {name} from this account in the current demo? Your order history will remain unchanged.", { name: selected.name })} </p>
            <p>{t("Order history will remain unchanged.")}</p>
            {unpairError && <p role="alert">{t(unpairError)}</p>}
            <div className="button-row">
              <button
                className="button button-secondary"
                disabled={isUnpairing}
                onClick={() => setSelected(null)}
              >
                {t("CANCEL")} </button>
              <button
                className="button button-primary"
                disabled={isUnpairing}
                onClick={confirm}
              >
                {t(isUnpairing ? "UNPAIRING..." : "UNPAIR")}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AccountShell>
  );
}
