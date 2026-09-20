"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import type { RobotManagementState } from "@/hooks/useRobotManagement";
import type { MemorySettings } from "@/types/robotConfig";
import { PanelHeading, SaveSettings, Toggle, Feedback } from "./Controls";
import { Modal } from "../ui/Modal";
export default function MemoryPanel({
  state,
}: {
  state: RobotManagementState;
}) {
  const { t } = useLanguage();
  const [confirm, setConfirm] = useState(false);
  const value = state.draft!.memory;
  const change = (patch: Partial<MemorySettings>) =>
    state.edit("memory", { ...value, ...patch });
  return (
    <>
      <PanelHeading eyebrow={t("MEMORY")} title={t("ROBO REMEMBERS WHAT MATTERS.")}>
        {t("You choose what Robo can remember.")} </PanelHeading>
      <fieldset
        className="management-fields management-settings"
        disabled={!!state.pending}
      >
        <legend className="sr-only">{t("Memory permissions")}</legend>
        <Toggle
          label={t("Memory enabled")}
          description={t("Allow Robo to remember the categories you choose.")}
          checked={value.enabled}
          onChange={(enabled) => change({ enabled })}
        />
        <Toggle
          label={t("Profile memory")}
          description={t("Name, preferred form of address and language.")}
          checked={value.profileMemory}
          disabled={!value.enabled}
          onChange={(profileMemory) => change({ profileMemory })}
        />
        <Toggle
          label={t("Preferences")}
          description={t("Voice, response length and knowledge preferences.")}
          checked={value.preferenceMemory}
          disabled={!value.enabled}
          onChange={(preferenceMemory) => change({ preferenceMemory })}
        />
        <Toggle
          label={t("Conversation memory")}
          description={t("Important conversation context. No conversation history is stored in this demo.")}
          checked={value.conversationMemory}
          disabled={!value.enabled}
          onChange={(conversationMemory) => change({ conversationMemory })}
        />
      </fieldset>
      <SaveSettings state={state} area="memory" label={t("SAVE MEMORY")} />
      <section className="management-privacy">
        <h3>{t("YOU'RE IN CONTROL.")}</h3>
        <p>
          {t("Clear this Robo's saved memory permissions. In this demo, clearing resets all memory settings to off.")} </p>
        <button
          className="button button-secondary"
          disabled={!!state.pending}
          onClick={() => setConfirm(true)}
        >
          {t("CLEAR MEMORY")} </button>
      </section>
      {confirm && (
        <Modal
          title={t("CLEAR ROBO MEMORY?")}
          onClose={() => {
            if (!state.pending) setConfirm(false);
          }}
        >
          <div className="robot-confirm">
            <p>
              {t("This will clear the saved memory for this Robo in the current demo. Memory permissions will be reset to off.")} </p>
            <Feedback state={state} area="memory" />
            <div className="button-row">
              <button
                className="button button-secondary"
                disabled={!!state.pending}
                onClick={() => setConfirm(false)}
              >
                {t("CANCEL")} </button>
              <button
                className="button button-primary"
                disabled={!!state.pending}
                onClick={async () => {
                  if (await state.clearMemory()) setConfirm(false);
                }}
              >
                {t(state.pending ? "CLEARING..." : "CLEAR MEMORY")}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
