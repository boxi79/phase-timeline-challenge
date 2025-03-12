import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { PlayControls } from "./PlayControls";
import { TimelineProvider } from "./TimelineContext";

export const Timeline = () => {
  // FIXME: performance concerned
  return (
    <TimelineProvider>
      <div
        className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700"
        data-testid="timeline"
      >
        <PlayControls />
        <Ruler />
        <TrackList />
        <KeyframeList />
        <Playhead />
      </div>
    </TimelineProvider>
  );
};
