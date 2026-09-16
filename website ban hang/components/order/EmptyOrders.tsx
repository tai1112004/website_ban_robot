import { Button } from "../ui/Button";
import OrderImage from "./OrderImage";
import { roboBasic } from "@/data/products";
export default function EmptyOrders() {
  return (
    <section className="history-empty">
      <OrderImage
        src={roboBasic.media.cutout}
        name="Robo waiting to meet you"
        cutout
      />
      <div>
        <h2>NO ORDERS YET.</h2>
        <p>Your future AI companion is waiting.</p>
        <div className="button-row">
          <Button href="/#models">DISCOVER ROBO</Button>
          <Button href="/account" secondary>
            BACK TO ACCOUNT
          </Button>
        </div>
      </div>
    </section>
  );
}
