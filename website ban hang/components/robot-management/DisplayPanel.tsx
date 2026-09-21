"use client";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import type { RobotManagementState } from "@/hooks/useRobotManagement";
import type { RobotExpression } from "@/types/robotConfig";
import { PanelHeading, Range, SaveSettings } from "./Controls";
const expressions: { id: RobotExpression; image: string }[] = [
  { id: "NORMAL", image: "/images/bieucam_binhthuong.png?v=20260921-1623" },
  { id: "HAPPY", image: "/images/bieucam_vuive.png?v=20260921-1623" },
  { id: "CURIOUS", image: "/images/bieucam_khohieu.png?v=20260921-1623" },
  { id: "SLEEPY", image: "/images/bieucam_chandoi.png?v=20260921-1623" },
];
export default function DisplayPanel({
  state,
}: {
  state: RobotManagementState;
}) {
  const { t } = useLanguage();
  const value = state.draft!.display;
  const active = expressions.find(
    (expression) => expression.id === value.expression,
  )!;
  return (
    <>
      <PanelHeading eyebrow={t("FACE & DISPLAY")} title={t("GIVE ROBO AN EXPRESSION.")}>
        {t("A little expression. A lot of personality.")} </PanelHeading>
      <div className="display-preview">
        <Image
          src={active.image}
          alt={t("{value0} expression preview", { value0: t(value.expression) })}
          fill
          sizes="(max-width:767px) 90vw, 800px"
        />
        <span>{t("PREVIEW /")} {t(value.expression)}</span>
      </div>
      <fieldset disabled={!!state.pending} className="management-fields">
        <legend className="sr-only">{t("Choose expression")}</legend>
        <div className="expression-grid">
          {expressions.map((expression) => (
            <label
              key={expression.id}
              className={`expression-choice ${value.expression === expression.id ? "is-selected" : ""}`}
            >
              <input
                type="radio"
                name="expression"
                checked={value.expression === expression.id}
                onChange={() =>
                  state.edit("display", { ...value, expression: expression.id })
                }
              />
              <div>
                <Image
                  src={expression.image}
                  alt=""
                  fill
                  sizes="(max-width:767px) 40vw, 180px"
                />
              </div>
              <span>{t(expression.id)}</span>
            </label>
          ))}
        </div>
        <div className="management-settings">
          <Range
            id="brightness"
            label={t("Brightness")}
            value={value.brightness}
            onChange={(brightness) =>
              state.edit("display", { ...value, brightness })
            }
          />
        </div>
      </fieldset>
      <SaveSettings state={state} area="display" label={t("APPLY EXPRESSION")} />
    </>
  );
}
