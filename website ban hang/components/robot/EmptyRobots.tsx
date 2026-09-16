import RobotImage from "./RobotImage";
import { Button } from "../ui/Button";
export default function EmptyRobots() {
  return (
    <section className="robot-empty">
      <RobotImage src="/images/robot_phongtrang.png" />
      <div>
        <p className="eyebrow">YOUR NEXT CHAPTER</p>
        <h2>
          NO ROBOS
          <br />
          CONNECTED YET.
        </h2>
        <p>Connect your Robo to start personalizing your AI companion.</p>
        <div className="button-row">
          <Button href="/my-robots/pair">PAIR YOUR ROBO</Button>
          <Button secondary href="/#models">
            EXPLORE ROBO
          </Button>
        </div>
      </div>
    </section>
  );
}
