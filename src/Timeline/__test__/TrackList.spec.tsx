import { renderWithTimelineProvider } from './testUtils'; // Adjust the import path as needed
import { screen, fireEvent } from '@testing-library/react';
import { TrackList } from '../TrackList'; // Adjust the import path as needed

describe('TrackList', () => {
  const mockScrollTop = jest.fn();

  const defaultContextOverrides = {
    scrollRefs: {
      trackListRef: { current: null },
      keyframeListRef: { current: { scrollTop: 0, scrollTo: mockScrollTop } },
      rulerRef: { current: null },
    } as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('vertical scrolling synchronizes with keyframeListRef', () => {
    renderWithTimelineProvider(<TrackList />, { contextOverrides: defaultContextOverrides });

    const trackList = screen.getByTestId('track-list');

    // Simulate scroll event
    fireEvent.scroll(trackList, { target: { scrollTop: 100 } });

    expect(defaultContextOverrides.scrollRefs.keyframeListRef.current?.scrollTop).toBe(100);
  });
});