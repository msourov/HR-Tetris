import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

const UpCounter = ({ upperRange }: { upperRange: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const lowerRange: number = 0;
  const motionValue = useMotionValue(lowerRange);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 50,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  useEffect(() => {
    if (isInView) {
      motionValue.set(upperRange);
    }
  }, [motionValue, isInView, upperRange]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("en-US").format(
            Math.round(latest)
          );
        }
      }),
    [springValue]
  );

  return (
    <span className="text-blue-600 text-xl font-bold float-right" ref={ref} />
  );
};

export default UpCounter;
