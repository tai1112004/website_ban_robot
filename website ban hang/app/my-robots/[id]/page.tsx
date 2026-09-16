import RobotManagement from "@/components/robot-management/RobotManagement";
import "../management.css";
export const metadata = { title: "Manage Your Robo | Robo AI" };
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RobotManagement id={id} />;
}
