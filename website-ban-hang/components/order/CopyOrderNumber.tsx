"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";
import { Copy } from "lucide-react";
export default function CopyOrderNumber({ id }: { id: string }) {
  const { t } = useLanguage();
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return (
    <div className="order-number">
      <label htmlFor="order-reference">{t("ORDER NUMBER")}</label>
      <div>
        <input
          ref={input}
          id="order-reference"
          className="order-reference"
          value={id}
          readOnly
          aria-describedby={message ? "order-copy-status" : undefined}
          onFocus={(event) => event.target.select()}
        />
        <button
          type="button"
          aria-label={t("Copy order number")}
          onClick={async () => {
            try {
              if (!navigator.clipboard)
                throw new Error("Clipboard unavailable");
              await navigator.clipboard.writeText(id);
              if (mounted.current) setMessage("ORDER NUMBER COPIED");
            } catch {
              if (!mounted.current) return;
              input.current?.focus();
              input.current?.select();
              let copied = false;
              try {
                copied = document.execCommand("copy");
              } catch {
                /* Keep the selected number available for manual copy. */
              }
              setMessage(
                copied
                  ? "ORDER NUMBER COPIED"
                  : "Automatic copy is unavailable. The number is selected; press Ctrl+C or Command+C, or use Copy on your phone.",
              );
            }
          }}
        >
          <Copy size={16} />
          <span>{t("COPY ORDER NUMBER")}</span>
        </button>
      </div>
      <p id="order-copy-status" role="status">
        {t(message)}
      </p>
    </div>
  );
}
