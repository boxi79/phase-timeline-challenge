import { renderWithTimelineProvider } from './testUtils'; // Adjust the import path as needed
import { screen, fireEvent } from '@testing-library/react';
import { Timeline } from '../Timeline'; // Adjust the import path as needed

describe('Timeline', () => {
  const defaultContextOverrides = {
    duration: 1000,
    time: 0,
    scrollRefs: {
      rulerRef: { current: null },
      keyframeListRef: { current: null },
      trackListRef: { current: null },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Timeline components correctly', () => {
    renderWithTimelineProvider(<Timeline />, { contextOverrides: defaultContextOverrides });

    expect(screen.getByTestId('timeline')).toBeInTheDocument();
    expect(screen.getByTestId('ruler')).toBeInTheDocument();
    expect(screen.getByTestId('playhead')).toBeInTheDocument();
    expect(screen.getByTestId('track-list')).toBeInTheDocument();
    expect(screen.getByTestId('keyframe-list')).toBeInTheDocument();
  });

  test('playhead moves in sync with ruler scrolling', async () => {
    renderWithTimelineProvider(<Timeline />, { contextOverrides: defaultContextOverrides });

    const ruler = screen.getByTestId('ruler');
    const playhead = screen.getByTestId('playhead');

    // Simulate ruler scroll to 200
    fireEvent.scroll(ruler, { target: { scrollLeft: 200 } });

    expect(playhead).toHaveStyle('transform: translateX(-200px)'); // Adjust based on the initial time
  });
});
