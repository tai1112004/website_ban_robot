import type { RobotManagementState } from "@/hooks/useRobotManagement";
import type { VoiceSettings } from "@/types/robotConfig";
import { PanelHeading, Range, SaveSettings } from "./Controls";
export default function VoicePanel({ state }: { state: RobotManagementState }) {
  const value = state.draft!.voice;
  const change = (patch: Partial<VoiceSettings>) =>
    state.edit("voice", { ...value, ...patch });
  return (
    <>
      <PanelHeading eyebrow="VOICE" title="CHOOSE HOW ROBO SPEAKS.">
        A voice that feels right for your everyday conversations.
      </PanelHeading>
      <fieldset
        disabled={!!state.pending}
        className="management-fields management-settings"
      >
        <legend className="sr-only">Voice settings</legend>
        <div className="management-two-fields">
          <label className="management-select">
            Voice Profile
            <select
              value={value.profile}
              onChange={(e) =>
                change({ profile: e.target.value as VoiceSettings["profile"] })
              }
            >
              <option value="DEFAULT">Default</option>
              <option value="WARM">Warm</option>
              <option value="CLEAR">Clear</option>
              <option value="ENERGETIC">Energetic</option>
            </select>
          </label>
          <label className="management-select">
            Language
            <select
              value={value.language}
              onChange={(e) =>
                change({
                  language: e.target.value as VoiceSettings["language"],
                })
              }
            >
              <option value="VI">Vietnamese</option>
              <option value="EN">English</option>
            </select>
          </label>
        </div>
        <Range
          id="volume"
          label="Volume"
          value={value.volume}
          onChange={(volume) => change({ volume })}
        />
        <Range
          id="speed"
          label="Speech Speed"
          value={value.speed}
          min={0.5}
          max={1.5}
          step={0.1}
          unit="×"
          onChange={(speed) => change({ speed })}
        />
      </fieldset>
      <div className="voice-preview">
        <button className="button button-secondary" disabled>
          PREVIEW VOICE
        </button>
        <p>Voice preview will be available when connected to the AI service.</p>
      </div>
      <SaveSettings state={state} area="voice" label="SAVE VOICE" />
    </>
  );
}
