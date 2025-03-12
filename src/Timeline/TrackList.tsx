import { useCallback } from 'react';
import { useTimeline } from './TimelineContext';

export const TrackList = () => {
  const { scrollRefs } = useTimeline();
  const { trackListRef, keyframeListRef } = scrollRefs;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (trackListRef.current && keyframeListRef.current) {
      keyframeListRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  }, [trackListRef, keyframeListRef]);

  return (
    <div
      ref={trackListRef}
      className="grid grid-flow-row auto-rows-[40px]
      border-r border-solid border-r-gray-700 
      overflow-auto"
      data-testid="track-list"
      onScroll={handleScroll}
    >
      <div className="p-2">
        <div>Track A</div>
      </div>
      <div className="p-2">
        <div>Track B</div>
      </div>
      <div className="p-2">
        <div>Track C</div>
      </div>
      <div className="p-2">
        <div>Track D</div>
      </div>
      <div className="p-2">
        <div>Track E</div>
      </div>
      <div className="p-2">
        <div>Track F </div>
      </div>
      <div className="p-2">
        <div>Track G</div>
      </div>
      <div className="p-2">
        <div>Track H</div>
      </div>
      <div className="p-2">
        <div>Track I </div>
      </div>
      <div className="p-2">
        <div>Track J</div>
      </div>
    </div>
  );
};