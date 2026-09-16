import { Button } from "../ui/Button";
export function LoadingOrders() {
  return (
    <p className="account-loading" role="status">
      LOADING ORDERS...
    </p>
  );
}
export function OrdersError({ retry }: { retry: () => void }) {
  return (
    <section className="account-empty">
      <h2>ORDERS UNAVAILABLE.</h2>
      <p>
        Your browser could not read local order history. Check storage
        permissions and try again.
      </p>
      <Button onClick={retry}>TRY AGAIN</Button>
    </section>
  );
}
