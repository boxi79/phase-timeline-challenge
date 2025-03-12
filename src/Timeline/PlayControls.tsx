import { useCallback, useEffect } from 'react';
import NumberInput from '../components/NumberInput';

export const MIN_DURATION = 100;
export const MAX_DURATION = 6000;
export const STEP = 10;

type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
  duration: number;
  setDuration: (time: number) => void;
};

export const PlayControls = ({ time, setTime, duration, setDuration }: PlayControlsProps) => {
  const timeFormat = useCallback((newTime: number) => {
    let value = Math.max(0, Math.round(newTime / STEP) * STEP); // Round to nearest multiple of 10
    if (newTime > duration) {
      value = duration;
    }
    return value;
  }, [duration]);

  const durationFormat = useCallback((newDuration: number) => {
    const value = Math.max(MIN_DURATION, Math.min(MAX_DURATION, Math.round(newDuration / STEP) * STEP)); // Clamp duration and round
    return value;
  }, [])


  const handleTimeChange = (newTime: number) => {
    setTime(newTime);
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
  };

  useEffect(() => {
    if (time > duration) {
      setTime(duration);
    }
  }, [time, duration]);

  return (
    <div
      className="flex items-center justify-between border-b border-r border-solid border-gray-700 px-2"
      data-testid="play-controls"
    >
      <NumberInput
        value={time}
        onChange={handleTimeChange}
        format={timeFormat}
        dataTestId="current-time-input"
        min={0}
        max={duration} // Ensure max is dynamic based on duration
        step={STEP}
        label="Current"
      />
      -
      <NumberInput
        value={duration}
        onChange={handleDurationChange}
        format={durationFormat}
        dataTestId="duration-input"
        min={MIN_DURATION}
        max={MAX_DURATION}
        step={STEP}
        label="Duration"
      />
    </div>
  );
};