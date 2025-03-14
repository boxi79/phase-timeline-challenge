import { renderWithTimelineProvider } from './testUtils'; // Adjust the import path as needed
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Playhead } from '../Playhead'; // Adjust the import path as needed
import { Ruler } from '../Ruler'; // Adjust the import path as needed

describe('Playhead', () => {
  const defaultContextOverrides = {
    time: 500,
    duration: 1000,
    scrollRefs: {
      rulerRef: { current: null },
      keyframeListRef: { current: null },
      trackListRef: { current: null },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock getBoundingClientRect for Ruler's click/drag calculations
    jest.spyOn(HTMLDivElement.prototype, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      right: 1000,
      bottom: 0,
      width: 1000,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('playhead moves in sync with ruler scrolling', async () => {
    renderWithTimelineProvider(
      <>
        <Ruler />
        <Playhead />
      </>,
      { contextOverrides: defaultContextOverrides }
    );

    const ruler = screen.getByTestId('ruler');
    const playhead = screen.getByTestId('playhead');

    expect(playhead).toHaveStyle('transform: translateX(500px)'); // Initial position: time - scrollOffset = 500 - 0

    // Simulate ruler scroll to 200
    fireEvent.scroll(ruler, { target: { scrollLeft: 200 } });

    await waitFor(() => {
      expect(playhead).toHaveStyle('transform: translateX(300px)'); // time - scrollOffset = 500 - 200
    });
  });

  test('playhead maintains relative position during scrolling', async () => {
    renderWithTimelineProvider(
      <>
        <Ruler />
        <Playhead />
      </>,
      { contextOverrides: defaultContextOverrides }
    );

    const ruler = screen.getByTestId('ruler');
    const playhead = screen.getByTestId('playhead');

    expect(playhead).toHaveStyle('transform: translateX(500px)'); // Initial: time - scrollOffset = 500 - 0

    // Simulate scroll to 300
    fireEvent.scroll(ruler, { target: { scrollLeft: 300 } });

    await waitFor(() => {
      expect(playhead).toHaveStyle('transform: translateX(200px)'); // time - scrollOffset = 500 - 300
    });

    // Simulate scroll to 400
    fireEvent.scroll(ruler, { target: { scrollLeft: 400 } });

    await waitFor(() => {
      expect(playhead).toHaveStyle('transform: translateX(100px)'); // time - scrollOffset = 500 - 400
    });
  });

  test('playhead is hidden when before visible area', () => {
    renderWithTimelineProvider(
      <>
        <Ruler />
        <Playhead />
      </>,
      {
        contextOverrides: {
          time: 200,
          duration: 1000,
          scrollRefs: {
            rulerRef: { current: null },
            keyframeListRef: { current: null },
            trackListRef: { current: null },
          },
        },
      }
    );

    const ruler = screen.getByTestId('ruler');
    fireEvent.scroll(ruler, { target: { scrollLeft: 300 } });

    const playhead = screen.getByTestId('playhead');
    expect(playhead).toHaveClass('hidden'); // time (200) < scrollLeft (300)
  });

  test('playhead is hidden when after visible area', () => {
    renderWithTimelineProvider(
      <>
        <Ruler />
        <Playhead />
      </>,
      {
        contextOverrides: {
          time: 1500,
          duration: 1000,
          scrollRefs: {
            rulerRef: { current: null },
            keyframeListRef: { current: null },
            trackListRef: { current: null },
          },
        },
      }
    );

    const playhead = screen.getByTestId('playhead');
    expect(playhead).toHaveClass('hidden'); // time (1500) > scrollLeft + clientWidth (1000)
  });
});