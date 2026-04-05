import { useState, useCallback, useRef } from 'react';

interface UseSwipeToDeleteOptions {
  onDelete: () => void;
  threshold?: number;
}

interface UseSwipeToDeleteReturn {
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
  translateX: number;
  isDeleting: boolean;
}

export function useSwipeToDelete({
  onDelete,
  threshold = 50,
}: UseSwipeToDeleteOptions): UseSwipeToDeleteReturn {
  const [translateX, setTranslateX] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const startXRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    currentXRef.current = e.touches[0].clientX;
    const distance = currentXRef.current - startXRef.current;

    // Only allow left swipe (negative distance)
    if (distance < 0) {
      setTranslateX(distance);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const distance = currentXRef.current - startXRef.current;

    // Check if swipe exceeded threshold
    if (Math.abs(distance) >= threshold) {
      setIsDeleting(true);
      onDelete();
    } else {
      // Reset position if threshold not met
      setTranslateX(0);
    }

    // Reset refs
    startXRef.current = 0;
    currentXRef.current = 0;
  }, [threshold, onDelete]);

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    translateX,
    isDeleting,
  };
}
