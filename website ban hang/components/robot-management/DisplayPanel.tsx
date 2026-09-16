import Image from "next/image";
import type { RobotManagementState } from "@/hooks/useRobotManagement";
import type { RobotExpression } from "@/types/robotConfig";
import { PanelHeading, Range, SaveSettings } from "./Controls";
const expressions: { id: RobotExpression; image: string }[] = [
  { id: "NORMAL", image: "/images/bieucam_binhthuong.png" },
  { id: "HAPPY", image: "/images/bieucam_vuive.png" },
  { id: "CURIOUS", image: "/images/bieucam_khohieu.png" },
  { id: "SLEEPY", image: "/images/bieucam_chandoi.png" },
];
export default function DisplayPanel({
  state,
}: {
  state: RobotManagementState;
}) {
  const value = state.draft!.display;
  const active = expressions.find(
    (expression) => expression.id === value.expression,
  )!;
  return (
    <>
      <PanelHeading eyebrow="FACE & DISPLAY" title="GIVE ROBO AN EXPRESSION.">
        A little expression. A lot of personality.
      </PanelHeading>
      <div className="display-preview">
        <Image
          src={active.image}
          alt={`${value.expression} expression preview`}
          fill
          sizes="(max-width:767px) 90vw, 800px"
        />
        <span>PREVIEW / {value.expression}</span>
      </div>
      <fieldset disabled={!!state.pending} className="management-fields">
        <legend className="sr-only">Choose expression</legend>
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
              <span>{expression.id}</span>
            </label>
          ))}
        </div>
        <div className="management-settings">
          <Range
            id="brightness"
            label="Brightness"
            value={value.brightness}
            onChange={(brightness) =>
              state.edit("display", { ...value, brightness })
            }
          />
        </div>
      </fieldset>
      <SaveSettings state={state} area="display" label="APPLY EXPRESSION" />
    </>
  );
}
