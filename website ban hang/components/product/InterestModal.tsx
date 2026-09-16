import { Modal } from "../ui/Modal";
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
  return (
    <Modal title="Meet your future companion" onClose={onClose}>
      <p className="pdp-form-intro">
        Leave a little interest in what comes next.
      </p>
      <p className="pdp-demo-disclosure" id="interest-demo">
        Frontend demo: this form does not send or save your information and does
        not join a real mailing list.
      </p>
      <form
        className="pdp-interest-form"
        aria-describedby="interest-demo"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const name = form.elements.namedItem("name") as HTMLInputElement;
          const country = form.elements.namedItem(
            "country",
          ) as HTMLInputElement;
          name.setCustomValidity(
            name.value.trim() ? "" : "Please enter your name.",
          );
          country.setCustomValidity(
            country.value.trim() ? "" : "Please enter your country.",
          );
          if (!form.reportValidity()) return;
          form.reset();
          onSubmit();
        }}
      >
        <label>
          Name
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            onInput={(event) => event.currentTarget.setCustomValidity("")}
          />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <label>
          Phone <span>(optional)</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
        <label>
          Country
          <input
            name="country"
            autoComplete="country-name"
            required
            maxLength={100}
            onInput={(event) => event.currentTarget.setCustomValidity("")}
          />
        </label>
        <label className="pdp-form-full">
          Interested Model
          <select name="model" defaultValue={model}>
            {modelLinks.map((item) => (
              <option key={item.id} value={item.id}>
                Robo {item.name}
              </option>
            ))}
          </select>
        </label>
        <button className="button button-primary pdp-form-full" type="submit">
          SUBMIT INTEREST ↗
        </button>
      </form>
    </Modal>
  );
}
