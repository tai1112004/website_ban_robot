export function RobotLoading() {
  return (
    <div
      className="robot-grid"
      role="status"
      aria-label="Loading Robos"
      aria-busy="true"
    >
      <div className="robot-skeleton" />
      <div className="robot-skeleton" />
      <span className="sr-only">Loading your Robos...</span>
    </div>
  );
}
export function RobotError({ retry }: { retry: () => void }) {
  return (
    <section className="account-empty" role="alert">
      <h2>WE COULDN&apos;T LOAD YOUR ROBOS.</h2>
      <p>
        Your device data could not be read. Try again when storage or the
        service is available.
      </p>
      <button className="button button-primary" onClick={retry}>
        TRY AGAIN
      </button>
    </section>
  );
}
