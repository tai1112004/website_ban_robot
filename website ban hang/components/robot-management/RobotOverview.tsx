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
      value: `${state.packs.filter((p) => p.installed).length} PACKS`,
    },
    { tab: "voice", label: "VOICE", value: config.voice.profile },
    { tab: "display", label: "DISPLAY", value: config.display.expression },
  ];
  return (
    <>
      <div className="management-overview">
        <RobotImage
          src={robot.image || "/images/product_render_goc_nghieng.png"}
          name={robot.name}
        />
        <div>
          <p className="eyebrow">{modelNames[robot.model]}</p>
          <h2>MEET YOUR ROBO.</h2>
          <p className="overview-companion">Your personal AI companion.</p>
          <RobotStatus status={robot.status} />
          <button
            className="button button-primary"
            onClick={() => select("personality")}
          >
            PERSONALIZE ROBO <ArrowUpRight size={17} />
          </button>
        </div>
      </div>
      <div className="management-summary">
        {summaries.map((item) => (
          <article key={item.tab}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <button
              onClick={() => select(item.tab)}
              aria-label={`Manage ${item.label.toLowerCase()}`}
            >
              MANAGE <ArrowUpRight size={14} />
            </button>
          </article>
        ))}
      </div>
      <section className="overview-details">
        <h3>AT A GLANCE</h3>
        <DeviceFacts robot={robot} />
      </section>
    </>
  );
}
