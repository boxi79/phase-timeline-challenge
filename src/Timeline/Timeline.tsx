import { useState } from "react";
import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { PlayControls } from "./PlayControls";

export const Timeline = () => {
  // FIXME: performance concerned
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(2000);

  return (
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700"
      data-testid="timeline"
    >
      <PlayControls time={time} setTime={setTime} duration={duration} setDuration={setDuration}/>
      <Ruler />
      <TrackList />
      <KeyframeList />
      <Playhead time={time} />
    </div>
  );
};
