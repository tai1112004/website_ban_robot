"use client";
import { useState } from "react";
import Heading from "./ProductSectionHeading";
export default function PersonalMemory() {
  const [enabled, setEnabled] = useState(true);
  return (
    <section id="memory" className="pdp-section pdp-memory">
      <div className="pdp-heading-row">
        <Heading index="04" label="PERSONAL MEMORY">
          A LITTLE MORE
          <br />
          <span className="accent">YOU.</span>
        </Heading>
        <div>
          <p className="pdp-copy">
            You&apos;re always in control of what Robo remembers.
          </p>
          <button
            className="pdp-switch"
            role="switch"
            aria-label="Memory demo"
            aria-checked={enabled}
            onClick={() => setEnabled(!enabled)}
          >
            <span className="pdp-switch-track">
              <i />
            </span>
            MEMORY {enabled ? "ON" : "OFF"}
          </button>
          <p className="pdp-fine">Interactive demo. Nothing is saved.</p>
        </div>
      </div>
      <div className={`pdp-memory-cards ${enabled ? "" : "is-off"}`}>
        {[
          {
            title: "01 / PROFILE",
            values: ["Name", "Nickname", "Preferred language"],
          },
          {
            title: "02 / PREFERENCES",
            values: ["Voice", "Response style", "Volume"],
          },
          {
            title: "03 / CONVERSATION",
            values: [
              "Selected context",
              "What matters to you",
              "Only what you allow",
            ],
          },
        ].map((card) => (
          <article key={card.title}>
            <h3>{card.title}</h3>
            {card.values.map((value) => (
              <p key={value}>
                <span>{value}</span>
                <span>{enabled ? "Your choice" : "Off"}</span>
              </p>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
