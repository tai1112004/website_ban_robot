"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import type { RobotDevice } from "@/types/robot";
import { modelNames } from "./RobotCard";
import { Button } from "../ui/Button";
export default function PairSuccess({ robot }: { robot: RobotDevice }) {
  const { t } = useLanguage();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  return (
    <section className="pair-success">
      <span className="pair-check">
        <Check size={32} aria-hidden="true" />
      </span>
      <p className="eyebrow">{t("SETUP COMPLETE")}</p>
      <h1 ref={heading} tabIndex={-1}>
        {t("ROBO CONNECTED.")} </h1>
      <p>{t("Your Robo is now linked to your account in this demo.")}</p>
      <dl className="robot-facts">
        <div>
          <dt>{t("Robot name")}</dt>
          <dd>{robot.name}</dd>
        </div>
        <div>
          <dt>{t("Model")}</dt>
          <dd>{t(modelNames[robot.model])}</dd>
        </div>
        <div>
          <dt>{t("Device ID")}</dt>
          <dd>{robot.deviceId}</dd>
        </div>
      </dl>
      <div className="button-row">
        <Button href={`/my-robots/${encodeURIComponent(robot.id)}`}>
          {t("MANAGE ROBO")} </Button>
        <Button secondary href="/my-robots">
          {t("VIEW MY ROBOTS")} </Button>
      </div>
    </section>
  );
}
