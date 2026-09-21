"use client";
import { useLanguage } from "@/context/LanguageContext";
import type { RobotManagementState } from "@/hooks/useRobotManagement";
import type { PersonalitySettings } from "@/types/robotConfig";
import { PanelHeading, Range, SaveSettings } from "./Controls";
export default function PersonalityPanel({
  state,
}: {
  state: RobotManagementState;
}) {
  const { t } = useLanguage();
  const value = state.draft!.personality;
  function change(patch: Partial<PersonalitySettings>) {
    state.edit("personality", { ...value, ...patch });
  }
  return (
    <>
      <PanelHeading eyebrow={t("PERSONALITY")} title={t("MAKE ROBO FEEL LIKE YOURS.")}>
        {t("Choose how Robo communicates, responds and expresses itself.")} </PanelHeading>
      <fieldset disabled={!!state.pending} className="management-fields">
        <legend className="sr-only">{t("Personality profile")}</legend>
        <div className="personality-grid">
          {state.profiles.map((profile) => (
            <label
              className={`personality-choice ${value.type === profile.type ? "is-selected" : ""}`}
              key={profile.type}
            >
              <input
                type="radio"
                name="personality"
                checked={value.type === profile.type}
                onChange={() => change({ type: profile.type })}
              />
              <span>
                <strong>{t(profile.type)}</strong>
                <small>{t(profile.description)}</small>
                <em>{t(profile.traits)}</em>
              </span>
            </label>
          ))}
        </div>
        {value.type === "CUSTOM" && (
          <div className="management-settings">
            <label className="management-select">
              {t("Response Length")} <select
                value={value.responseLength}
                onChange={(e) =>
                  change({
                    responseLength: e.target
                      .value as PersonalitySettings["responseLength"],
                  })
                }
              >
                <option value="SHORT">{t("Short")}</option>
                <option value="BALANCED">{t("Balanced")}</option>
                <option value="DETAILED">{t("Detailed")}</option>
              </select>
            </label>
            <Range
              id="humor"
              label={t("Humor")}
              value={value.humorLevel}
              onChange={(humorLevel) => change({ humorLevel })}
            />
            <Range
              id="formality"
              label={t("Formality")}
              value={value.formalityLevel}
              onChange={(formalityLevel) => change({ formalityLevel })}
            />
          </div>
        )}
      </fieldset>
      <aside className="personality-preview">
        <p className="eyebrow">{t("ROBO WOULD SAY")}</p>
        <blockquote>
          “
          {
            t(state.profiles.find((profile) => profile.type === value.type)
              ?.preview)
          }
          ”
        </blockquote>
        <small>
          {t("Illustrative preview only. This is not an AI conversation.")} </small>
      </aside>
      <SaveSettings state={state} area="personality" label={t("SAVE PERSONALITY")} />
    </>
  );
}
