"use client";
import { useLanguage } from "@/context/LanguageContext";
import type { CheckoutErrors, CheckoutFormData } from "@/types/order";
import { countries } from "@/lib/orders";
type Field = {
  name: keyof CheckoutFormData;
  label: string;
  autocomplete: string;
  type?: string;
  optional?: boolean;
  wide?: boolean;
};
const contact: Field[] = [
  { name: "email", label: "Email", autocomplete: "email", type: "email" },
  { name: "phone", label: "Phone number", autocomplete: "tel", type: "tel" },
];
const shipping: Field[] = [
  { name: "firstName", label: "First name", autocomplete: "given-name" },
  { name: "lastName", label: "Last name", autocomplete: "family-name" },
  {
    name: "address",
    label: "Address",
    autocomplete: "address-line1",
    wide: true,
  },
  {
    name: "apartment",
    label: "Apartment / Suite",
    autocomplete: "address-line2",
    optional: true,
    wide: true,
  },
  { name: "city", label: "City", autocomplete: "address-level2" },
  {
    name: "province",
    label: "Province / State",
    autocomplete: "address-level1",
  },
  {
    name: "postalCode",
    label: "Postal code",
    autocomplete: "postal-code",
    optional: true,
  },
  { name: "country", label: "Country", autocomplete: "country-name" },
];
export default function CheckoutFields({
  section,
  data,
  errors,
  onChange,
  onBlur,
}: {
  section: "contact" | "shipping";
  data: CheckoutFormData;
  errors: CheckoutErrors;
  onChange: (key: keyof CheckoutFormData, value: string) => void;
  onBlur: (key: keyof CheckoutFormData) => void;
}) {
  const { t } = useLanguage();
  return (
    <fieldset className="checkout-section">
      <legend>
        <span>{t(section === "contact" ? "01" : "02")}</span>
        {t(section === "contact" ? "CONTACT INFORMATION" : "SHIPPING INFORMATION")}
      </legend>
      <div className="checkout-fields">
        {(section === "contact" ? contact : shipping).map((field) => (
          <div
            key={field.name}
            className={field.wide ? "checkout-field is-wide" : "checkout-field"}
          >
            <label htmlFor={`checkout-${field.name}`}>
              {t(field.label)} <span>{t(field.optional ? "(optional)" : "*")}</span>
            </label>
            {field.name === "country" ? (
              <select
                id={`checkout-${field.name}`}
                name={field.name}
                autoComplete={field.autocomplete}
                value={data.country}
                required
                aria-invalid={!!errors.country}
                aria-describedby={errors.country ? "error-country" : undefined}
                onChange={(event) => onChange(field.name, event.target.value)}
                onBlur={() => onBlur(field.name)}
              >
                {countries.map((country) => (
                  <option key={country} value={country}>{t(country)}</option>
                ))}
              </select>
            ) : (
              <input
                id={`checkout-${field.name}`}
                name={field.name}
                type={field.type ?? "text"}
                autoComplete={field.autocomplete}
                value={data[field.name]}
                required={!field.optional}
                maxLength={
                  field.name === "address"
                    ? 250
                    : field.name === "email"
                      ? 254
                      : 100
                }
                aria-invalid={!!errors[field.name]}
                aria-describedby={
                  errors[field.name] ? `error-${field.name}` : undefined
                }
                onChange={(event) => onChange(field.name, event.target.value)}
                onBlur={() => onBlur(field.name)}
              />
            )}
            {errors[field.name] && (
              <p className="checkout-field-error" id={`error-${field.name}`}>
                {t(errors[field.name])}
              </p>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
}
