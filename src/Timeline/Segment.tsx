import { useTimeline } from './TimelineContext';

export const Segment = () => {
  const { duration } = useTimeline();
  return (
    <div
      className="py-2"
      data-testid="segment"
      style={{
        width: `${duration}px`,
      }}
    >
      <div className="h-6 rounded-md bg-white/10"></div>
    </div>
  );
};