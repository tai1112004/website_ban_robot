export default function OrderTimeline() {
  return (
    <section className="order-next" aria-labelledby="order-next-title">
      <p className="eyebrow">LOOKING AHEAD</p>
      <h2 id="order-next-title">WHAT HAPPENS NEXT?</h2>
      <p className="order-next-note">
        A preview of the future order journey. This demo does not trigger
        confirmation emails or delivery.
      </p>
      <ol>
        {[
          {
            title: "ORDER RECEIVED",
            text: "Your Robo order request has been saved in this browser for this demonstration.",
          },
          {
            title: "CONFIRMATION",
            text: "Product availability, pricing and delivery details will be confirmed when Robo enters the next commercial stage.",
          },
          {
            title: "ROBO DELIVERY",
            text: "When Robo becomes available, delivery and device setup information will be shared. No delivery date is confirmed yet.",
          },
        ].map((step, index) => (
          <li key={step.title}>
            <span>0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
