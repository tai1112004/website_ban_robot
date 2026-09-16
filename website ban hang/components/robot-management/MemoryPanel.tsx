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
  const [confirm, setConfirm] = useState(false);
  const value = state.draft!.memory;
  const change = (patch: Partial<MemorySettings>) =>
    state.edit("memory", { ...value, ...patch });
  return (
    <>
      <PanelHeading eyebrow="MEMORY" title="ROBO REMEMBERS WHAT MATTERS.">
        You choose what Robo can remember.
      </PanelHeading>
      <fieldset
        className="management-fields management-settings"
        disabled={!!state.pending}
      >
        <legend className="sr-only">Memory permissions</legend>
        <Toggle
          label="Memory enabled"
          description="Allow Robo to remember the categories you choose."
          checked={value.enabled}
          onChange={(enabled) => change({ enabled })}
        />
        <Toggle
          label="Profile memory"
          description="Name, preferred form of address and language."
          checked={value.profileMemory}
          disabled={!value.enabled}
          onChange={(profileMemory) => change({ profileMemory })}
        />
        <Toggle
          label="Preferences"
          description="Voice, response length and knowledge preferences."
          checked={value.preferenceMemory}
          disabled={!value.enabled}
          onChange={(preferenceMemory) => change({ preferenceMemory })}
        />
        <Toggle
          label="Conversation memory"
          description="Important conversation context. No conversation history is stored in this demo."
          checked={value.conversationMemory}
          disabled={!value.enabled}
          onChange={(conversationMemory) => change({ conversationMemory })}
        />
      </fieldset>
      <SaveSettings state={state} area="memory" label="SAVE MEMORY" />
      <section className="management-privacy">
        <h3>YOU&apos;RE IN CONTROL.</h3>
        <p>
          Clear this Robo&apos;s saved memory permissions. In this demo,
          clearing resets all memory settings to off.
        </p>
        <button
          className="button button-secondary"
          disabled={!!state.pending}
          onClick={() => setConfirm(true)}
        >
          CLEAR MEMORY
        </button>
      </section>
      {confirm && (
        <Modal
          title="CLEAR ROBO MEMORY?"
          onClose={() => {
            if (!state.pending) setConfirm(false);
          }}
        >
          <div className="robot-confirm">
            <p>
              This will clear the saved memory for this Robo in the current
              demo. Memory permissions will be reset to off.
            </p>
            <Feedback state={state} area="memory" />
            <div className="button-row">
              <button
                className="button button-secondary"
                disabled={!!state.pending}
                onClick={() => setConfirm(false)}
              >
                CANCEL
              </button>
              <button
                className="button button-primary"
                disabled={!!state.pending}
                onClick={async () => {
                  if (await state.clearMemory()) setConfirm(false);
                }}
              >
                {state.pending ? "CLEARING..." : "CLEAR MEMORY"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
