"use client";
import { useLanguage } from "@/context/LanguageContext";
import type { ReactNode } from "react";
import type { RobotManagementState } from "@/hooks/useRobotManagement";
import type { SettingKey } from "@/types/robotConfig";
export function PanelHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  const { t, localeTag } = useLanguage();
  return (
    <header className="management-panel-heading">
      <p className="eyebrow">{t(eyebrow)}</p>
      <h2>{t(title)}</h2>
      {children && <p>{children}</p>}
    </header>
  );
}
export function SaveSettings({
  state,
  area,
  label,
}: {
  state: RobotManagementState;
  area: SettingKey;
  label: string;
}) {
  const { t, localeTag } = useLanguage();
  return (
    <div className="management-save">
      <button
        type="button"
        className="button button-primary"
        disabled={!!state.pending || !state.dirty(area)}
        onClick={() => state.save(area)}
      >
        {t(state.pending === area ? "SAVING..." : label)}
      </button>
      <span>{t(state.dirty(area) ? "UNSAVED CHANGES" : "UP TO DATE")}</span>
      <Feedback state={state} area={area} />
    </div>
  );
}
export function Feedback({
  state,
  area,
}: {
  state: RobotManagementState;
  area: string;
}) {
  const { t, localeTag } = useLanguage();
  const feedback = state.feedback?.area === area ? state.feedback : null;
  return feedback ? (
    <p
      className={`management-feedback ${feedback.error ? "is-error" : ""}`}
      role={feedback.error ? "alert" : "status"}
    >
      {t(feedback.message)}
    </p>
  ) : null;
}
export function Range({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "%",
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  const { t, localeTag } = useLanguage();
  return (
    <div className="management-range">
      <div>
        <label htmlFor={id}>{t(label)}</label>
        <output htmlFor={id}>
          {value}
          {unit}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${value}${unit}`}
      />
    </div>
  );
}
export function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  const { t, localeTag } = useLanguage();
  return (
    <label className={`management-toggle ${disabled ? "is-disabled" : ""}`}>
      <span>
        <strong>{t(label)}</strong>
        {description && <small>{t(description)}</small>}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        aria-label={t(label)}
      />
      <span className="toggle-track" aria-hidden="true" />
    </label>
  );
}
