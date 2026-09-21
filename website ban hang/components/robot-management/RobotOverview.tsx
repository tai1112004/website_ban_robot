"use client";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowUpRight } from "lucide-react";
import type { RobotDevice } from "@/types/robot";
import type { RobotManagementState } from "@/hooks/useRobotManagement";
import type { RobotTab } from "./RobotNavigation";
import RobotImage from "../robot/RobotImage";
import RobotStatus from "../robot/RobotStatus";
import { modelNames } from "../robot/RobotCard";
import { DeviceFacts } from "./DevicePanel";
export default function RobotOverview({
  robot,
  state,
  select,
}: {
  robot: RobotDevice;
  state: RobotManagementState;
  select: (tab: RobotTab) => void;
}) {
  const { t } = useLanguage();
  const config = state.config!;
  const summaries: { tab: RobotTab; label: string; value: string }[] = [
    {
      tab: "personality",
      label: "PERSONALITY",
      value: config.personality.type,
    },
    {
      tab: "memory",
      label: "MEMORY",
      value: config.memory.enabled ? "ENABLED" : "DISABLED",
    },
    {
      tab: "knowledge",
      label: "KNOWLEDGE",
      value: t("{count} PACKS", { count: state.packs.filter((p) => p.installed).length }),
    },
    { tab: "voice", label: "VOICE", value: config.voice.profile },
    { tab: "display", label: "DISPLAY", value: config.display.expression },
  ];
  return (
    <>
      <div className="management-overview">
        <RobotImage
          src={robot.image || "/images/product_render_goc_nghieng.png?v=20260921-1635"}
          name={robot.name}
        />
        <div>
          <p className="eyebrow">{t(modelNames[robot.model])}</p>
          <h2>{t("MEET YOUR ROBO.")}</h2>
          <p className="overview-companion">{t("Your personal AI companion.")}</p>
          <RobotStatus status={robot.status} />
          <button
            className="button button-primary"
            onClick={() => select("personality")}
          >
            {t("PERSONALIZE ROBO")} <ArrowUpRight size={17} />
          </button>
        </div>
      </div>
      <div className="management-summary">
        {summaries.map((item) => (
          <article key={item.tab}>
            <span>{t(item.label)}</span>
            <strong>{t(item.value)}</strong>
            <button
              onClick={() => select(item.tab)}
              aria-label={t("Manage {value0}", { value0: t(item.label.toLowerCase()) })}
            >
              {t("MANAGE")} <ArrowUpRight size={14} />
            </button>
          </article>
        ))}
      </div>
      <section className="overview-details">
        <h3>{t("AT A GLANCE")}</h3>
        <DeviceFacts robot={robot} />
      </section>
    </>
  );
}
