"use client";
import { useLanguage } from "@/context/LanguageContext";
import { Bot } from "lucide-react";
export default function Footer({
  info,
  homeHref = "#home",
  overviewHref = homeHref,
  sectionPrefix = "",
}: {
  info: (name: string) => void;
  homeHref?: string;
  overviewHref?: string;
  sectionPrefix?: string;
}) {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <a href={homeHref} className="brand">
            <Bot size={30} />  {t("ROBO")}<span>{t("AI")}</span>
          </a>
          <p>
            {t("A little intelligence.")} <br />{t("A lot of personality.")} </p>
        </div>
        <div className="footer-links">
          <div>
            <h3>{t("PRODUCT")}</h3>
            <a href={overviewHref}>{t("Overview")}</a>
            <a href={`${sectionPrefix}#features`}>{t("Features")}</a>
            <a href={`${sectionPrefix}#technology`}>{t("Technology")}</a>
            <a href={`${sectionPrefix}#models`}>{t("Models")}</a>
          </div>
          <div>
            <h3>{t("PLATFORM")}</h3>
            <a href={`${sectionPrefix}#experience`}>{t("Personality")}</a>
            <a href={`${sectionPrefix}#memory`}>{t("Memory")}</a>
            <a href={`${sectionPrefix}#knowledge`}>{t("Knowledge Packs")}</a>
          </div>
          {[
            ["COMPANY", "About", "Research", "Contact"],
            ["SUPPORT", "Help", "FAQ"],
          ].map(([title, ...links]) => (
            <div key={title}>
              <h3>{t(title)}</h3>
              {links.map((link) => (
                <button key={link} onClick={() => info(link)}>
                  {t(link)}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>{t("© 2026 ROBO AI. All rights reserved.")}</span>
        <span>
          <button onClick={() => info("Privacy")}>{t("Privacy")}</button>
          <button onClick={() => info("Terms")}>{t("Terms")}</button>
        </span>
        <a href={overviewHref}>{t("BACK TO TOP ↑")}</a>
      </div>
    </footer>
  );
}
