import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { RobotDevice } from "@/types/robot";
import type { RobotManagementState } from "@/hooks/useRobotManagement";
import { modelNames } from "../robot/RobotCard";
import RobotStatus from "../robot/RobotStatus";
import { Modal } from "../ui/Modal";
import { Feedback, PanelHeading } from "./Controls";
export function DeviceFacts({ robot }: { robot: RobotDevice }) {
  return (
    <dl className="robot-facts device-facts">
      <div>
        <dt>Robot Name</dt>
        <dd>{robot.name}</dd>
      </div>
      <div>
        <dt>Model</dt>
        <dd>{modelNames[robot.model]}</dd>
      </div>
      <div>
        <dt>Device ID</dt>
        <dd>{robot.deviceId}</dd>
      </div>
      <div>
        <dt>Serial Number</dt>
        <dd>{robot.serialNumber || "Not available"}</dd>
      </div>
      <div>
        <dt>Firmware Version</dt>
        <dd>{robot.firmwareVersion || "Not available"}</dd>
      </div>
      <div>
        <dt>Connection Status</dt>
        <dd>
          <RobotStatus status={robot.status} />
        </dd>
      </div>
      <div>
        <dt>Paired At</dt>
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
  );
}
export default function DevicePanel({
  robot,
  state,
}: {
  robot: RobotDevice;
  state: RobotManagementState;
}) {
  const [modal, setModal] = useState<"rename" | "unpair" | null>(null);
  const [name, setName] = useState(robot.name);
  const [invalid, setInvalid] = useState(false);
  const router = useRouter();
  async function rename(event: FormEvent) {
    event.preventDefault();
    const invalid = !name.trim() || name.trim().length > 60;
    setInvalid(invalid);
    if (!invalid && (await state.rename(name))) setModal(null);
  }
  return (
    <>
      <PanelHeading eyebrow="DEVICE" title="YOUR ROBO. THE DETAILS.">
        The essentials, all in one place.
      </PanelHeading>
      <DeviceFacts robot={robot} />
      <div className="button-row">
        <button
          className="button button-primary"
          disabled={!!state.pending}
          onClick={() => {
            setName(robot.name);
            setInvalid(false);
            setModal("rename");
          }}
        >
          RENAME ROBO
        </button>
        <button
          className="button button-secondary"
          disabled={!!state.pending}
          onClick={() => setModal("unpair")}
        >
          UNPAIR ROBO
        </button>
      </div>
      <Feedback state={state} area="device" />
      <p className="management-note">
        Firmware information is read-only. Device updates will be available with
        the connected service.
      </p>
      {modal && (
        <Modal
          title={modal === "rename" ? "RENAME YOUR ROBO" : "UNPAIR THIS ROBO?"}
          onClose={() => {
            if (!state.pending) setModal(null);
          }}
        >
          <div className="robot-confirm">
            {modal === "rename" ? (
              <form onSubmit={rename} noValidate>
                <label className="management-select">
                  Robot Name
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setInvalid(false);
                    }}
                    maxLength={60}
                    disabled={!!state.pending}
                    required
                    aria-invalid={invalid}
                    aria-describedby={invalid ? "rename-error" : undefined}
                  />
                </label>
                {invalid && (
                  <p id="rename-error" role="alert">
                    Enter a name with 1–60 characters.
                  </p>
                )}
                <Feedback state={state} area="device" />
                <div className="button-row">
                  <button
                    type="button"
                    className="button button-secondary"
                    disabled={!!state.pending}
                    onClick={() => setModal(null)}
                  >
                    CANCEL
                  </button>
                  <button
                    className="button button-primary"
                    disabled={!!state.pending}
                    type="submit"
                  >
                    {state.pending ? "SAVING..." : "SAVE NAME"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p>
                  This Robo will be removed from your current account. Your
                  order history will remain unchanged.
                </p>
                <Feedback state={state} area="device" />
                <div className="button-row">
                  <button
                    className="button button-secondary"
                    disabled={!!state.pending}
                    onClick={() => setModal(null)}
                  >
                    CANCEL
                  </button>
                  <button
                    className="button button-primary"
                    disabled={!!state.pending}
                    onClick={async () => {
                      if (await state.unpair()) router.replace("/my-robots");
                    }}
                  >
                    {state.pending ? "UNPAIRING..." : "UNPAIR"}
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
