"use client";
import { useLanguage } from "@/context/LanguageContext";
import {
  Hand,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Pause,
  Square,
} from "lucide-react";
import type { RobotDevice } from "@/types/robot";
import type { RobotAction } from "@/types/robotConfig";
import type { RobotManagementState } from "@/hooks/useRobotManagement";
import { Feedback, PanelHeading } from "./Controls";
const actions = [
  { id: "WAVE", label: "WAVE", icon: Hand },
  { id: "NOD", label: "NOD", icon: ArrowDown },
  { id: "TURN_LEFT", label: "TURN LEFT", icon: ArrowLeft },
  { id: "TURN_RIGHT", label: "TURN RIGHT", icon: ArrowRight },
  { id: "IDLE", label: "IDLE", icon: Pause },
  { id: "STOP", label: "STOP", icon: Square },
] as const;
export default function ActionsPanel({
  robot,
  state,
}: {
  robot: RobotDevice;
  state: RobotManagementState;
}) {
  const { t } = useLanguage();
  const motion = robot.capabilities?.includes("MOTION") === true;
  const online = robot.status === "ONLINE";
  return (
    <>
      <PanelHeading eyebrow={t("ACTIONS")} title={t("MOVE. REACT. EXPRESS.")}>
        {t("Simple commands for a companion with character.")} </PanelHeading>
      {!online && (
        <div className="management-connection-note">
          <strong>
            {t(robot.status === "OFFLINE"
              ? "ROBO IS OFFLINE."
              : "ROBO IS NOT ONLINE.")}
          </strong>
          <p>{t("Actions will be available when the device reconnects.")}</p>
        </div>
      )}
      {!motion && (
        <p className="management-note">
          {t("NOT AVAILABLE ON THIS MODEL. Motion capability has not been enabled for this Robo.")} </p>
      )}
      <div className="actions-grid">
        {actions.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`action-command ${id === "STOP" ? "action-stop" : ""}`}
            disabled={!motion || !online || !!state.pending}
            onClick={() => state.sendAction(id as RobotAction)}
          >
            <Icon size={30} strokeWidth={1.4} />
            <strong>{t(label)}</strong>
            <small>
              {t(!motion
                ? "NOT AVAILABLE ON THIS MODEL"
                : !online
                  ? "WAITING FOR CONNECTION"
                  : "SEND COMMAND")}
            </small>
          </button>
        ))}
      </div>
      {state.pending === "actions" && (
        <p role="status" className="management-feedback">
          {t("SENDING COMMAND...")} </p>
      )}
      <Feedback state={state} area="actions" />
      <p className="management-note">
        {t("Commands in this demo do not move a physical robot. A sent command is not confirmation that a device has performed the action.")} </p>
    </>
  );
}
