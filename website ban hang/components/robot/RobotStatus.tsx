import type { RobotConnectionStatus } from "@/types/robot";
export default function RobotStatus({
  status,
}: {
  status: RobotConnectionStatus;
}) {
  return (
    <span className={`robot-status robot-status-${status.toLowerCase()}`}>
      <i aria-hidden="true" />
      {status}
    </span>
  );
}
