import { useEffect, useState } from "react";
export function useIsTouchDevice() {
  const [touch, setTouch] = useState(true);
  useEffect(() => {
    const media = matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setTouch(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return touch;
}
