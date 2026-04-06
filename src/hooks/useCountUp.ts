import { useState, useEffect, useRef } from 'react';


export function useCountUp(target: number, duration: number = 800): number {
  const [current, setCurrent] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(target);

  useEffect(() => {
    // Reset animation when target changes
    if (targetRef.current !== target) {
      targetRef.current = target;
      startTimeRef.current = null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrent(0);
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function: easeOutQuart = 1 - (1 - t)^4
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = target * eased;

      setCurrent(value);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration]);

  return current;
}
