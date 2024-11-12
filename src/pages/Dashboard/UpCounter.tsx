import { FC, useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

type UpCounterProps = {
  upperRange: number;
  style: {
    color: string;
    size: string;
  };
};

const UpCounter: FC<UpCounterProps> = ({ upperRange, style }) => {
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
    <span
      className={`text-${style.color}-600 text-${style.size} font-bold`}
      ref={ref}
    />
  );
};

export default UpCounter;
