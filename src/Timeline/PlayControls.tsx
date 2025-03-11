import NumberInput from '../components/NumberInput';

type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
  duration: number;
  setDuration: (time: number) => void;
};

export const PlayControls = ({ time, setTime, duration, setDuration }: PlayControlsProps) => {
  return (
    <div
      className="flex items-center justify-between border-b border-r border-solid border-gray-700 
 px-2"
      data-testid="play-controls"
    >
      <NumberInput
        value={time}
        onChange={setTime}
        dataTestId="current-time-input"
        min={0}
        max={duration}
        step={10}
        label="Current"
      />
      -
      <NumberInput
        value={duration}
        onChange={setDuration}
        dataTestId="duration-input"
        min={100}
        max={6000}
        step={10}
        label="Duration"
      />
    </div>
  );
};