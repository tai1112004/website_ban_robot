"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useRef, useState, type FormEvent } from "react";
import { Info, QrCode, ArrowUpRight } from "lucide-react";
import usePairRobot from "@/hooks/usePairRobot";
import type { RobotDevice } from "@/types/robot";
import AccountShell from "../account/AccountShell";
import RobotImage from "./RobotImage";
import PairSuccess from "./PairSuccess";
export default function PairRobotForm() {
  const { t } = useLanguage();
  const { pairRobot, isPairing, error, reset } = usePairRobot();
  const [robot, setRobot] = useState<RobotDevice | null>(null);
  const [deviceId, setDeviceId] = useState("");
  const [activationCode, setCode] = useState("");
  const [errors, setErrors] = useState({ deviceId: "", activationCode: "" });
  const deviceInput = useRef<HTMLInputElement>(null);
  const codeInput = useRef<HTMLInputElement>(null);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (isPairing) return;
    reset();
    const next = {
      deviceId: /^[A-Za-z0-9-]{5,64}$/.test(deviceId.trim())
        ? ""
        : "Enter a Device ID with 5–64 letters, numbers or hyphens.",
      activationCode:
        activationCode.trim().length >= 6 && activationCode.trim().length <= 128
          ? ""
          : "Enter an activation code with 6–128 characters.",
    };
    setErrors(next);
    if (next.deviceId || next.activationCode) {
      (next.deviceId ? deviceInput : codeInput).current?.focus();
      return;
    }
    const result = await pairRobot({ deviceId, activationCode });
    if (result) {
      setCode("");
      setRobot(result);
    }
  }
  return (
    <AccountShell active="robots">
      <nav className="account-breadcrumb" aria-label={t("Breadcrumb")}>
        <a href="/account">{t("ACCOUNT")}</a>
        <span>/</span>
        <a href="/my-robots">{t("MY ROBOTS")}</a>
        <span>/</span>
        <span aria-current="page">{t("PAIR")}</span>
      </nav>
      {robot ? (
        <PairSuccess robot={robot} />
      ) : (
        <section className="pair-layout">
          <div className="pair-intro">
            <header className="account-heading">
              <p className="eyebrow">{t("DEVICE SETUP")}</p>
              <h1>
                {t("CONNECT")} <br />
                {t("YOUR ROBO.")} </h1>
              <p>
                {t("Enter the information that came with your Robo to connect it to your account.")} </p>
            </header>
            <RobotImage src="/images/robot_phongtrang.png" />
          </div>
          <form
            className="pair-form"
            onSubmit={submit}
            noValidate
            aria-busy={isPairing}
          >
            <p className="eyebrow">{t("01 / DEVICE INFORMATION")}</p>
            <h2>{t("A NEW CONNECTION.")}</h2>
            <div className="pair-field">
              <label htmlFor="device-id">{t("DEVICE ID *")}</label>
              <input
                ref={deviceInput}
                id="device-id"
                value={deviceId}
                onChange={(e) => {
                  setDeviceId(e.target.value);
                  reset();
                }}
                disabled={isPairing}
                placeholder={t("RB-A8F2K91")}
                maxLength={64}
                autoCapitalize="characters"
                spellCheck={false}
                required
                aria-invalid={!!errors.deviceId}
                aria-describedby={`device-help${errors.deviceId ? " device-error" : ""}`}
              />
              <p id="device-help" className="pair-help">
                <Info size={15} aria-hidden="true" />
                {t("Device ID can be found on your Robo or included with the device information.")} </p>
              {errors.deviceId && (
                <p className="pair-error" id="device-error">
                  {t(errors.deviceId)}
                </p>
              )}
            </div>
            <div className="pair-field">
              <label htmlFor="activation-code">{t("ACTIVATION CODE *")}</label>
              <input
                ref={codeInput}
                id="activation-code"
                type="password"
                value={activationCode}
                onChange={(e) => {
                  setCode(e.target.value);
                  reset();
                }}
                disabled={isPairing}
                placeholder="••••••••"
                maxLength={128}
                autoComplete="off"
                required
                aria-invalid={!!errors.activationCode}
                aria-describedby={
                  errors.activationCode ? "code-error" : undefined
                }
              />
              {errors.activationCode && (
                <p className="pair-error" id="code-error">
                  {t(errors.activationCode)}
                </p>
              )}
            </div>
            {error && (
              <p className="pair-error" role="alert">
                {t(error)}
              </p>
            )}
            <button
              className="button button-primary pair-submit"
              disabled={isPairing}
              type="submit"
            >
              {t(isPairing ? "CONNECTING..." : "CONNECT ROBO")}
              <ArrowUpRight size={17} />
            </button>
            <p className="pair-help" role="status">
              {t(isPairing
                ? "Connecting your Robo..."
                : "Demo pairing: codes are not verified and no physical device is connected. Model defaults to Robo Basic; live status and firmware are unavailable.")}
            </p>
            <div className="pair-qr">
              <QrCode size={25} aria-hidden="true" />
              <span>
                {t("SCAN QR CODE")}<small>{t("COMING SOON")}</small>
              </span>
              <button type="button" disabled>
                {t("SCAN QR")} </button>
            </div>
            <p className="pair-ownership">
              {t("A Robo can only be connected to one owner account at a time.")} <br />
              <span>
                {t("Ownership verification will be enabled with the backend. This demo only prevents duplicate Device IDs in this browser.")} </span>
            </p>
          </form>
        </section>
      )}
    </AccountShell>
  );
}
