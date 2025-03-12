import { useCallback } from 'react';
import { useTimeline } from './TimelineContext';
import { Segment } from './Segment';

export const KeyframeList = () => {
  const { scrollRefs } = useTimeline();
  const { keyframeListRef, rulerRef, trackListRef } = scrollRefs;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (rulerRef.current) {
      rulerRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
    if (trackListRef.current) {
      trackListRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  }, [keyframeListRef, rulerRef]);

  return (
    <div
      ref={keyframeListRef}
      className="px-4 min-w-0 overflow-auto"
      data-testid="keyframe-list"
      onScroll={handleScroll}
    >
      {Array.from({ length: 10 }, (_, index) => (
        <Segment key={index} />
      ))}
    </div>
  );
};