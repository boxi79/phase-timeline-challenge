// testUtils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactNode, ReactElement, useState, useCallback } from 'react';
import {
  TimelineContext,
  TimelineContextType,
  MAX_DURATION,
  MIN_DURATION,
  STEP,
} from '../TimelineContext';

// Default context values for testing with mocks
const defaultMockContext: TimelineContextType = {
  time: 0,
  duration: 2000,
  setTime: jest.fn(),
  updateTime: jest.fn((newTime: number) => {
    const formattedTime = Math.max(0, Math.round(newTime / STEP) * STEP);
    defaultMockContext.time = formattedTime > defaultMockContext.duration ? defaultMockContext.duration : formattedTime;
  }),
  setDuration: jest.fn((newDuration: number) => {
    defaultMockContext.duration = Math.min(Math.max(newDuration, MIN_DURATION), MAX_DURATION);
  }),
  scrollRefs: {
    rulerRef: { current: null },
    keyframeListRef: { current: null },
    trackListRef: { current: null },
  },
};

// Custom provider for tests with real state management
const TestTimelineProviderWithState = ({
  children,
  initialTime = 0,
  initialDuration = 2000,
}: {
  children: ReactNode;
  initialTime?: number;
  initialDuration?: number;
}) => {
  const [time, setTime] = useState(initialTime);
  const [duration, setDuration] = useState(initialDuration);

  const updateTime = useCallback((newTime: number) => {
    const formattedTime = Math.max(0, Math.round(newTime / STEP) * STEP);
    setTime(formattedTime > duration ? duration : formattedTime);
  }, [duration]);

  const handleSetDuration = useCallback((newDuration: number) => {
    const clampedDuration = Math.min(Math.max(newDuration, MIN_DURATION), MAX_DURATION);
    setDuration(clampedDuration);
    if (time > clampedDuration) {
      setTime(clampedDuration);
    }
  }, [time]);

  const contextValue: TimelineContextType = {
    time,
    duration,
    setTime,
    updateTime,
    setDuration: handleSetDuration,
    scrollRefs: {
      rulerRef: { current: null },
      keyframeListRef: { current: null },
      trackListRef: { current: null },
    },
  };

  return (
    <TimelineContext.Provider value={contextValue}>
      {children}
    </TimelineContext.Provider>
  );
};

// Custom provider for tests with mocked context values
const TestTimelineProviderWithMocks = ({
  children,
  contextOverrides = {},
}: {
  children: ReactNode;
  contextOverrides?: Partial<TimelineContextType>;
}) => {
  const contextValue: TimelineContextType = {
    ...defaultMockContext,
    ...contextOverrides,
    setTime: contextOverrides?.setTime || defaultMockContext.setTime,
    updateTime: contextOverrides?.updateTime || defaultMockContext.updateTime,
    setDuration: contextOverrides?.setDuration || defaultMockContext.setDuration,
  };

  return (
    <TimelineContext.Provider value={contextValue}>
      {children}
    </TimelineContext.Provider>
  );
};

// Utility to render components with the TimelineProvider
interface TimelineRenderOptions extends RenderOptions {
  contextOverrides?: Partial<TimelineContextType>;
  useRealState?: boolean;
  initialTime?: number;
  initialDuration?: number;
}

const renderWithTimelineProvider = (
  ui: ReactElement,
  options: TimelineRenderOptions = {}
) => {
  const { contextOverrides, useRealState = false, initialTime, initialDuration, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: ReactNode }) => {
    if (useRealState) {
      return (
        <TestTimelineProviderWithState initialTime={initialTime} initialDuration={initialDuration}>
          {children}
        </TestTimelineProviderWithState>
      );
    }
    return (
      <TestTimelineProviderWithMocks contextOverrides={contextOverrides}>
        {children}
      </TestTimelineProviderWithMocks>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Export the utilities
export { renderWithTimelineProvider, TestTimelineProviderWithMocks, TestTimelineProviderWithState, defaultMockContext };