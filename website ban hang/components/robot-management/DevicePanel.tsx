"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { RobotDevice } from "@/types/robot";
import type { RobotManagementState } from "@/hooks/useRobotManagement";
import { modelNames } from "../robot/RobotCard";
import RobotStatus from "../robot/RobotStatus";
import { Modal } from "../ui/Modal";
import { Feedback, PanelHeading } from "./Controls";
export function DeviceFacts({ robot }: { robot: RobotDevice }) {
  const { t, localeTag } = useLanguage();
  return (
    <dl className="robot-facts device-facts">
      <div>
        <dt>{t("Robot Name")}</dt>
        <dd>{robot.name}</dd>
      </div>
      <div>
        <dt>{t("Model")}</dt>
        <dd>{t(modelNames[robot.model])}</dd>
      </div>
      <div>
        <dt>{t("Device ID")}</dt>
        <dd>{robot.deviceId}</dd>
      </div>
      <div>
        <dt>{t("Serial Number")}</dt>
        <dd>{robot.serialNumber || t("Not available")}</dd>
      </div>
      <div>
        <dt>{t("Firmware Version")}</dt>
        <dd>{robot.firmwareVersion || t("Not available")}</dd>
      </div>
      <div>
        <dt>{t("Connection Status")}</dt>
        <dd>
          <RobotStatus status={robot.status} />
        </dd>
      </div>
      <div>
        <dt>{t("Paired At")}</dt>
        <dd>
          {t(robot.pairedAt
            ? new Date(robot.pairedAt).toLocaleDateString(localeTag === "en-US" ? "en-GB" : localeTag, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Not available")}
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
  const { t, localeTag } = useLanguage();
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
      <PanelHeading eyebrow={t("DEVICE")} title={t("YOUR ROBO. THE DETAILS.")}>
        {t("The essentials, all in one place.")} </PanelHeading>
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
          {t("RENAME ROBO")} </button>
        <button
          className="button button-secondary"
          disabled={!!state.pending}
          onClick={() => setModal("unpair")}
        >
          {t("UNPAIR ROBO")} </button>
      </div>
      <Feedback state={state} area="device" />
      <p className="management-note">
        {t("Firmware information is read-only. Device updates will be available with the connected service.")} </p>
      {modal && (
        <Modal
          title={t(modal === "rename" ? "RENAME YOUR ROBO" : "UNPAIR THIS ROBO?")}
          onClose={() => {
            if (!state.pending) setModal(null);
          }}
        >
          <div className="robot-confirm">
            {modal === "rename" ? (
              <form onSubmit={rename} noValidate>
                <label className="management-select">
                  {t("Robot Name")} <input
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
                    {t("Enter a name with 1–60 characters.")} </p>
                )}
                <Feedback state={state} area="device" />
                <div className="button-row">
                  <button
                    type="button"
                    className="button button-secondary"
                    disabled={!!state.pending}
                    onClick={() => setModal(null)}
                  >
                    {t("CANCEL")} </button>
                  <button
                    className="button button-primary"
                    disabled={!!state.pending}
                    type="submit"
                  >
                    {t(state.pending ? "SAVING..." : "SAVE NAME")}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p>
                  {t("This Robo will be removed from your current account. Your order history will remain unchanged.")} </p>
                <Feedback state={state} area="device" />
                <div className="button-row">
                  <button
                    className="button button-secondary"
                    disabled={!!state.pending}
                    onClick={() => setModal(null)}
                  >
                    {t("CANCEL")} </button>
                  <button
                    className="button button-primary"
                    disabled={!!state.pending}
                    onClick={async () => {
                      if (await state.unpair()) router.replace("/my-robots");
                    }}
                  >
                    {t(state.pending ? "UNPAIRING..." : "UNPAIR")}
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
