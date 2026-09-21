"use client";
import { useLanguage } from "@/context/LanguageContext";
import {
  BookOpen,
  GraduationCap,
  Languages,
  Sparkles,
  Landmark,
  BriefcaseBusiness,
  SlidersHorizontal,
  Music2,
} from "lucide-react";
import type { RobotManagementState } from "@/hooks/useRobotManagement";
import { PanelHeading, Feedback } from "./Controls";
const icons = [
  BookOpen,
  GraduationCap,
  Languages,
  Sparkles,
  Landmark,
  BriefcaseBusiness,
  SlidersHorizontal,
  Music2,
];
export default function KnowledgePanel({
  state,
}: {
  state: RobotManagementState;
}) {
  const { t } = useLanguage();
  return (
    <>
      <PanelHeading eyebrow={t("KNOWLEDGE")} title={t("WHAT SHOULD YOUR ROBO KNOW?")}>
        {t("Choose the knowledge that belongs in your Robo's world.")} </PanelHeading>
      <p className="management-note">
        {t("Demo selections only. Installing a pack saves your preference; it does not download or activate AI content.")} </p>
      <div className="knowledge-grid">
        {state.packs.map((pack, index) => {
          const Icon = icons[index % icons.length];
          return (
            <article
              className={`knowledge-card ${pack.id === "hat-sac-bua" ? "knowledge-featured" : ""}`}
              key={pack.id}
            >
              <div className="knowledge-card-top">
                <Icon size={25} strokeWidth={1.4} />
                <span>
                  {t(pack.id === "hat-sac-bua"
                    ? "FIRST KNOWLEDGE PACK"
                    : pack.category)}
                </span>
              </div>
              <h3>{t(pack.name)}</h3>
              <p>{t(pack.description)}</p>
              <div className="knowledge-card-bottom">
                <span>{t(pack.installed ? "INSTALLED" : "AVAILABLE")}</span>
                <button
                  disabled={!!state.pending}
                  className="button button-secondary"
                  onClick={() => state.changePack(pack)}
                  aria-label={t("{value0} {value1}", { value0: t(pack.installed ? "REMOVE" : "INSTALL"), value1: t(pack.name) })}
                >
                  {t(pack.installed ? "REMOVE" : "INSTALL")}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {state.pending === "knowledge" && (
        <p role="status">{t("UPDATING KNOWLEDGE PACKS...")}</p>
      )}
      <Feedback state={state} area="knowledge" />
    </>
  );
}
