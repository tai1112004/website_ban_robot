"use client";
import { useLanguage } from "@/context/LanguageContext";
import { Modal } from "../ui/Modal";
import { useEffect, useRef } from "react";
import { modelLinks, type ModelId } from "@/data/products";
export default function InterestModal({
  model,
  onClose,
  onSubmit,
}: {
  model: ModelId;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const { t } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);
  const validationStarted = useRef(false);
  const validate = () => {
    const form = formRef.current;
    if (!form) return;
    for (const field of ["name", "email", "country"] as const) {
      const input = form.elements.namedItem(field) as HTMLInputElement;
      const message = !input.value.trim()
        ? { name: "Please enter your name.", email: "Please enter your email.", country: "Please enter your country." }[field]
        : field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())
          ? "Please enter a valid email address." : "";
      input.setCustomValidity(t(message));
    }
  };
  useEffect(() => {
    if (validationStarted.current) validate();
  }, [t]);
  return (
    <Modal title={t("Meet your future companion")} onClose={onClose}>
      <p className="pdp-form-intro">
        {t("Leave a little interest in what comes next.")} </p>
      <p className="pdp-demo-disclosure" id="interest-demo">
        {t("Frontend demo: this form does not send or save your information and does not join a real mailing list.")} </p>
      <form
        ref={formRef}
        noValidate
        className="pdp-interest-form"
        aria-describedby="interest-demo"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          validationStarted.current = true;
          validate();
          if (!form.reportValidity()) return;
          form.reset();
          onSubmit();
        }}
      >
        <label>
          {t("Name")} <input
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            onInput={(event) => event.currentTarget.setCustomValidity("")}
          />
        </label>
        <label>
          {t("Email")} <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <label>
          {t("Phone")} <span>{t("(optional)")}</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
        <label>
          {t("Country")} <input
            name="country"
            autoComplete="country-name"
            required
            maxLength={100}
            onInput={(event) => event.currentTarget.setCustomValidity("")}
          />
        </label>
        <label className="pdp-form-full">
          {t("Interested Model")} <select name="model" defaultValue={model}>
            {modelLinks.map((item) => (
              <option key={item.id} value={item.id}>
                {t("Robo")} {item.name}
              </option>
            ))}
          </select>
        </label>
        <button className="button button-primary pdp-form-full" type="submit">
          {t("SUBMIT INTEREST ↗")} </button>
      </form>
    </Modal>
  );
}
