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
  return (
    <header className="management-panel-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
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
  return (
    <div className="management-save">
      <button
        type="button"
        className="button button-primary"
        disabled={!!state.pending || !state.dirty(area)}
        onClick={() => state.save(area)}
      >
        {state.pending === area ? "SAVING..." : label}
      </button>
      <span>{state.dirty(area) ? "UNSAVED CHANGES" : "UP TO DATE"}</span>
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
  const feedback = state.feedback?.area === area ? state.feedback : null;
  return feedback ? (
    <p
      className={`management-feedback ${feedback.error ? "is-error" : ""}`}
      role={feedback.error ? "alert" : "status"}
    >
      {feedback.message}
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
  return (
    <div className="management-range">
      <div>
        <label htmlFor={id}>{label}</label>
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
  return (
    <label className={`management-toggle ${disabled ? "is-disabled" : ""}`}>
      <span>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        aria-label={label}
      />
      <span className="toggle-track" aria-hidden="true" />
    </label>
  );
}
