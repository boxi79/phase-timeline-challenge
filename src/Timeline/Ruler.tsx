import { useEffect, useRef, useCallback } from 'react';
import { useTimeline } from './TimelineContext';

export const Ruler = () => {
  const { updateTime, duration, scrollRefs } = useTimeline();
  const { rulerRef, keyframeListRef } = scrollRefs;

  const isDraggingRef = useRef(false);
  const rulerBarRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (keyframeListRef.current) {
      keyframeListRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  }, [keyframeListRef]);

  // Calculate position from click/drag
  const getTimeFromPosition = useCallback((clientX: number) => {
    if (!rulerBarRef.current || !rulerRef.current) return 0;

    const rect = rulerBarRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;

    return Math.max(0, Math.min(clickX, duration));
  }, [duration, rulerRef]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDraggingRef.current = true;
    const newTime = getTimeFromPosition(e.clientX);
    updateTime(newTime);
  }, [getTimeFromPosition, updateTime]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingRef.current) {
      const newTime = getTimeFromPosition(e.clientX);
      updateTime(newTime);
    }
  }, [getTimeFromPosition, updateTime]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Add global event listeners for drag functionality
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Handle touch events for mobile support
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    const newTime = getTimeFromPosition(e.touches[0].clientX);
    updateTime(newTime);
  }, [getTimeFromPosition, updateTime]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDraggingRef.current) {
      const newTime = getTimeFromPosition(e.touches[0].clientX);
      updateTime(newTime);
    }
  }, [getTimeFromPosition, updateTime]);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={scrollRefs.rulerRef}
      className="px-4 py-2 min-w-0 
      border-b border-solid border-gray-700 
      overflow-x-auto overflow-y-hidden"
      data-testid="ruler"
      onScroll={handleScroll}
    >
      <div
        ref={rulerBarRef}
        className="h-6 rounded-md bg-white/25"
        data-testid="ruler-bar"
        style={{ width: `${duration}px` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      ></div>
    </div>
  );
};