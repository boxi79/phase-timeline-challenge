
import { createContext, ReactNode, useContext, useState, useRef, useCallback } from 'react';

export const MAX_DURATION = 6000;
export const MIN_DURATION = 100;
export const STEP = 10;

interface TimelineContextType {
  time: number;
  duration: number;
  setTime: (time: number) => void;
  updateTime: (time: number) => void;
  setDuration: (duration: number) => void;
  scrollRefs: {
    rulerRef: React.RefObject<HTMLDivElement>;
    keyframeListRef: React.RefObject<HTMLDivElement>;
    trackListRef: React.RefObject<HTMLDivElement>;
  };
}

export const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const TimelineProvider = ({ children }: { children: ReactNode }) => {
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(2000);

  const rulerRef = useRef<HTMLDivElement>(null);
  const keyframeListRef = useRef<HTMLDivElement>(null);
  const trackListRef = useRef<HTMLDivElement>(null);

  const updateTime = useCallback((newTime: number) => {
    const formattedTime = Math.max(0, Math.round(newTime / STEP) * STEP); // Round to nearest multiple of STEP
    setTime(formattedTime > duration ? duration : formattedTime); // Ensure time does not exceed duration
  }, [time, duration]);

  const contexts = { time, setTime, updateTime, duration, setDuration, scrollRefs: { rulerRef, keyframeListRef, trackListRef } }

  return (
    <TimelineContext.Provider value={contexts}>
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("useTimeline must be used within a TimelineProvider");
  }
  return context;
};


