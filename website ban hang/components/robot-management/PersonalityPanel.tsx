import type { RobotManagementState } from "@/hooks/useRobotManagement";
import type { PersonalitySettings } from "@/types/robotConfig";
import { PanelHeading, Range, SaveSettings } from "./Controls";
export default function PersonalityPanel({
  state,
}: {
  state: RobotManagementState;
}) {
  const value = state.draft!.personality;
  function change(patch: Partial<PersonalitySettings>) {
    state.edit("personality", { ...value, ...patch });
  }
  return (
    <>
      <PanelHeading eyebrow="PERSONALITY" title="MAKE ROBO FEEL LIKE YOURS.">
        Choose how Robo communicates, responds and expresses itself.
      </PanelHeading>
      <fieldset disabled={!!state.pending} className="management-fields">
        <legend className="sr-only">Personality profile</legend>
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
                <strong>{profile.type}</strong>
                <small>{profile.description}</small>
                <em>{profile.traits}</em>
              </span>
            </label>
          ))}
        </div>
        {value.type === "CUSTOM" && (
          <div className="management-settings">
            <label className="management-select">
              Response Length
              <select
                value={value.responseLength}
                onChange={(e) =>
                  change({
                    responseLength: e.target
                      .value as PersonalitySettings["responseLength"],
                  })
                }
              >
                <option value="SHORT">Short</option>
                <option value="BALANCED">Balanced</option>
                <option value="DETAILED">Detailed</option>
              </select>
            </label>
            <Range
              id="humor"
              label="Humor"
              value={value.humorLevel}
              onChange={(humorLevel) => change({ humorLevel })}
            />
            <Range
              id="formality"
              label="Formality"
              value={value.formalityLevel}
              onChange={(formalityLevel) => change({ formalityLevel })}
            />
          </div>
        )}
      </fieldset>
      <aside className="personality-preview">
        <p className="eyebrow">ROBO WOULD SAY</p>
        <blockquote>
          “
          {
            state.profiles.find((profile) => profile.type === value.type)
              ?.preview
          }
          ”
        </blockquote>
        <small>
          Illustrative preview only. This is not an AI conversation.
        </small>
      </aside>
      <SaveSettings state={state} area="personality" label="SAVE PERSONALITY" />
    </>
  );
}
