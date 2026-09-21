"use client";
import { useLanguage } from "@/context/LanguageContext";
import type { RobotConnectionStatus } from "@/types/robot";
export default function RobotStatus({
  status,
}: {
  status: RobotConnectionStatus;
}) {
  const { t } = useLanguage();
  return (
    <span className={`robot-status robot-status-${status.toLowerCase()}`}>
      <i aria-hidden="true" />
      {t(status)}
    </span>
  );
}
