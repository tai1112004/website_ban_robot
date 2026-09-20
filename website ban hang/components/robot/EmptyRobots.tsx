"use client";
import TranslatedHeading from "@/components/ui/TranslatedHeading";
import { useLanguage } from "@/context/LanguageContext";
import RobotImage from "./RobotImage";
import { Button } from "../ui/Button";
export default function EmptyRobots() {
  const { t } = useLanguage();
  return (
    <section className="robot-empty">
      <RobotImage src="/images/robot_phongtrang.png" />
      <div>
        <p className="eyebrow">{t("YOUR NEXT CHAPTER")}</p>
        <h2>
          <TranslatedHeading message="NO ROBOS<br><accent>CONNECTED YET.</accent>" /> </h2>
        <p>{t("Connect your Robo to start personalizing your AI companion.")}</p>
        <div className="button-row">
          <Button href="/my-robots/pair">{t("PAIR YOUR ROBO")}</Button>
          <Button secondary href="/#models">
            {t("EXPLORE ROBO")} </Button>
        </div>
      </div>
    </section>
  );
}
