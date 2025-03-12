import { useTimeline } from './TimelineContext';
import { useEffect, useState, useCallback } from 'react';

export const Playhead = () => {
  const { time, scrollRefs } = useTimeline();
  const { rulerRef } = scrollRefs;
  const [isVisible, setIsVisible] = useState(true);
  const [scrollOffset, setScrollOffset] = useState(0);

  const updateVisibilityAndPosition = useCallback(() => {
    if (!rulerRef.current) return;

    const ruler = rulerRef.current;
    const scrollLeft = ruler.scrollLeft;
    const viewportWidth = ruler.clientWidth;
    const playheadPosition = time;

    setScrollOffset(scrollLeft);

    const isInView = playheadPosition >= scrollLeft && playheadPosition <= scrollLeft + viewportWidth;
    setIsVisible(isInView);
  }, [time, rulerRef]);

  useEffect(() => {
    updateVisibilityAndPosition();
    const ruler = rulerRef.current;
    if (ruler) {
      ruler.addEventListener('scroll', updateVisibilityAndPosition);
      return () => ruler.removeEventListener('scroll', updateVisibilityAndPosition);
    }
  }, [updateVisibilityAndPosition, rulerRef]);

  return (
    <div
      className={`absolute h-full border-l-2 border-solid border-yellow-600 z-10
        ${!isVisible ? 'hidden' : ''}`}
      data-testid="playhead"
      style={{
        transform: `translateX(${time - scrollOffset}px)`,
        left: 316,
      }}
    >
      <div
        className="absolute border-solid border-[5px] border-transparent
          border-t-yellow-600 -translate-x-1.5 top-0"
      />
    </div>
  );
};