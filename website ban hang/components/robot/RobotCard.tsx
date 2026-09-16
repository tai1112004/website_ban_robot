import type { RobotDevice } from "@/types/robot";
import RobotImage from "./RobotImage";
import RobotStatus from "./RobotStatus";
import { Button } from "../ui/Button";
export const modelNames = {
  BASIC: "Robo Basic",
  PLUS: "Robo Plus",
  CUSTOM: "Robo Custom",
};
export default function RobotCard({
  robot,
  onUnpair,
}: {
  robot: RobotDevice;
  onUnpair: (robot: RobotDevice) => void;
}) {
  const href = `/my-robots/${encodeURIComponent(robot.id)}`;
  return (
    <article className="robot-card">
      <RobotImage src={robot.image} name={robot.name} />
      <div className="robot-card-content">
        <div className="robot-card-top">
          <p className="eyebrow">{modelNames[robot.model]}</p>
          <RobotStatus status={robot.status} />
        </div>
        <h2>{robot.name}</h2>
        <dl className="robot-facts">
          <div>
            <dt>Device ID</dt>
            <dd>{robot.deviceId}</dd>
          </div>
          <div>
            <dt>Firmware</dt>
            <dd>{robot.firmwareVersion || "Not available"}</dd>
          </div>
          <div>
            <dt>Paired</dt>
            <dd>
              {robot.pairedAt
                ? new Date(robot.pairedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Not available"}
            </dd>
          </div>
        </dl>
        <Button href={href}>MANAGE ROBO</Button>
        <div className="robot-secondary">
          <a href={`${href}?tab=device`}>DEVICE DETAILS</a>
          <button onClick={() => onUnpair(robot)}>UNPAIR ROBO</button>
        </div>
      </div>
    </article>
  );
}
