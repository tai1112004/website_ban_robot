"use client";
import { useRouter, useSearchParams } from "next/navigation";
import useRobot from "@/hooks/useRobot";
import useRobotManagement from "@/hooks/useRobotManagement";
import type { RobotDevice } from "@/types/robot";
import AccountShell from "../account/AccountShell";
import { RobotLoading } from "../robot/RobotDataState";
import RobotStatus from "../robot/RobotStatus";
import { modelNames } from "../robot/RobotCard";
import { Button } from "../ui/Button";
import RobotNavigation, { tabs, type RobotTab } from "./RobotNavigation";
import RobotOverview from "./RobotOverview";
import PersonalityPanel from "./PersonalityPanel";
import MemoryPanel from "./MemoryPanel";
import VoicePanel from "./VoicePanel";
import DisplayPanel from "./DisplayPanel";
import KnowledgePanel from "./KnowledgePanel";
import ActionsPanel from "./ActionsPanel";
import DevicePanel from "./DevicePanel";
function Workspace({ robot }: { robot: RobotDevice }) {
  const state = useRobotManagement(robot.id);
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get("tab");
  const active: RobotTab = tabs.find((tab) => tab === requested) ?? "overview";
  const select = (tab: RobotTab) => {
    const query = new URLSearchParams(params.toString());
    query.set("tab", tab);
    router.push(`?${query}`, { scroll: false });
  };
  return (
    <>
      <header className="management-header">
        <div>
          <p className="eyebrow">{modelNames[robot.model]}</p>
          <h1>{robot.name}</h1>
          <div className="management-header-meta">
            <RobotStatus status={robot.status} />
            <span>Device ID / {robot.deviceId}</span>
          </div>
        </div>
        <button
          className="button button-secondary"
          onClick={() => select("device")}
        >
          DEVICE INFO
        </button>
      </header>
      <p className="management-demo">
        Configuration preview / Changes are saved for this Robo in the demo.
        They are not applied to a physical device.
      </p>
      <div className="management-layout">
        <RobotNavigation active={active} select={select} />
        <div className="management-content">
          {state.isLoading ? (
            <div className="management-loading" role="status" aria-busy="true">
              Loading your Robo settings...
            </div>
          ) : state.loadError ? (
            <div className="account-empty" role="alert">
              <h2>SETTINGS UNAVAILABLE.</h2>
              <p>{state.loadError}</p>
              <button className="button button-primary" onClick={state.reload}>
                TRY AGAIN
              </button>
            </div>
          ) : (
            state.config &&
            state.draft &&
            tabs.map((tab) => (
              <section
                key={tab}
                id={`robot-panel-${tab}`}
                role="tabpanel"
                aria-labelledby={`robot-tab-${tab}`}
                hidden={active !== tab}
                tabIndex={0}
              >
                {active === tab &&
                  (tab === "overview" ? (
                    <RobotOverview
                      robot={robot}
                      state={state}
                      select={select}
                    />
                  ) : tab === "personality" ? (
                    <PersonalityPanel state={state} />
                  ) : tab === "memory" ? (
                    <MemoryPanel state={state} />
                  ) : tab === "knowledge" ? (
                    <KnowledgePanel state={state} />
                  ) : tab === "voice" ? (
                    <VoicePanel state={state} />
                  ) : tab === "display" ? (
                    <DisplayPanel state={state} />
                  ) : tab === "actions" ? (
                    <ActionsPanel robot={robot} state={state} />
                  ) : (
                    <DevicePanel robot={robot} state={state} />
                  ))}
              </section>
            ))
          )}
        </div>
      </div>
      <a className="account-back" href="/my-robots">
        ← BACK TO MY ROBOTS
      </a>
    </>
  );
}
export default function RobotManagement({ id }: { id: string }) {
  const { robot, isLoading, error, refresh } = useRobot(id);
  return (
    <AccountShell active="robots">
      <nav className="account-breadcrumb" aria-label="Breadcrumb">
        <a href="/account">ACCOUNT</a>
        <span>/</span>
        <a href="/my-robots">MY ROBOTS</a>
        <span>/</span>
        <span aria-current="page">{robot?.name || "ROBO"}</span>
      </nav>
      {isLoading && !robot ? (
        <RobotLoading />
      ) : error ? (
        <section className="account-empty" role="alert">
          <h1>WE COULDN&apos;T LOAD THIS ROBO.</h1>
          <p>Try again when device storage or the service is available.</p>
          <div className="button-row">
            <button className="button button-primary" onClick={refresh}>
              TRY AGAIN
            </button>
            <Button secondary href="/my-robots">
              BACK TO MY ROBOTS
            </Button>
          </div>
        </section>
      ) : !robot ? (
        <section className="account-empty">
          <h1>ROBO NOT FOUND.</h1>
          <p>This device is no longer connected to your account.</p>
          <Button href="/my-robots">VIEW MY ROBOTS</Button>
        </section>
      ) : (
        <Workspace key={id} robot={robot} />
      )}
    </AccountShell>
  );
}
