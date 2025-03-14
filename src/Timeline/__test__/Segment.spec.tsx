import { renderWithTimelineProvider } from './testUtils'; // Adjust the import path as needed
import { screen } from '@testing-library/react';
import { Segment } from '../Segment'; // Adjust the import path as needed

describe('Segment', () => {
  const defaultContextOverrides = {
    duration: 1000,
    time: 0, // Required by useTimeline but not used in Segment
    scrollRefs: {
      rulerRef: { current: null },
      keyframeListRef: { current: null },
      trackListRef: { current: null },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test initial width rendering
  test('segment width matches duration (1ms = 1px)', () => {
    renderWithTimelineProvider(<Segment />, { contextOverrides: defaultContextOverrides });

    const segment = screen.getByTestId('segment');
    expect(segment).toHaveStyle('width: 1000px'); // duration = 1000
  });

  // Test width with different duration values
  test('segment width reflects different duration values', () => {
    renderWithTimelineProvider(<Segment />, {
      contextOverrides: {
        ...defaultContextOverrides,
        duration: 500,
      },
    });

    const segment = screen.getByTestId('segment');
    expect(segment).toHaveStyle('width: 500px'); // duration = 500
  });
});