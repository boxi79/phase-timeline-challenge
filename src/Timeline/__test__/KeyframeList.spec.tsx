import { renderWithTimelineProvider, TestTimelineProviderWithState } from './testUtils'; // Adjust the import path as needed
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { KeyframeList } from '../KeyframeList'; // Adjust the import path as needed

describe('KeyframeList', () => {
  const mockScrollTop = jest.fn();
  const mockScrollLeft = jest.fn();

  const defaultContextOverrides = {
    duration: 1000,
    scrollRefs: {
      keyframeListRef: { current: null },
      trackListRef: { current: { scrollTop: 0, scrollTo: mockScrollTop } },
      rulerRef: { current: { scrollLeft: 0, scrollTo: mockScrollLeft } },
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Requirement 1: Vertical scrolling is synchronized with the Track List
  test('vertical scrolling synchronizes with trackListRef', () => {
    renderWithTimelineProvider(<KeyframeList />, { contextOverrides: defaultContextOverrides });

    const keyframeList = screen.getByTestId('keyframe-list');

    // Simulate vertical scroll event
    fireEvent.scroll(keyframeList, { target: { scrollTop: 100 } });

    expect(defaultContextOverrides.scrollRefs.trackListRef.current?.scrollTop).toBe(100);
  });

  // Requirement 2: Horizontal scrolling is synchronized with the Ruler
  test('horizontal scrolling synchronizes with rulerRef', () => {
    renderWithTimelineProvider(<KeyframeList />, { contextOverrides: defaultContextOverrides });

    const keyframeList = screen.getByTestId('keyframe-list');

    // Simulate horizontal scroll event
    fireEvent.scroll(keyframeList, { target: { scrollLeft: 200 } });

    expect(defaultContextOverrides.scrollRefs.rulerRef.current?.scrollLeft).toBe(200);
  });

  // Requirement 3: Segment length visually represents the total Duration (1ms = 1px)
  test('segment length matches duration (1ms = 1px)', () => {
    renderWithTimelineProvider(<KeyframeList />, { contextOverrides: defaultContextOverrides });

    const segments = screen.getAllByTestId('segment'); // Assumes Segment has data-testid="segment"

    segments.forEach((segment) => {
      expect(segment).toHaveStyle('width: 1000px');
    });
  });

  // Requirement 4: Segment length updates only after specific actions on Duration input
  // Note: This requirement is primarily tested in the PlayControls component, but we can test
  // that KeyframeList (and its Segment children) react to duration changes here using real state.
  test('segment length updates when duration changes (real state)', async () => {
    const { rerender } = renderWithTimelineProvider(<KeyframeList />, {
      useRealState: true,
      initialTime: 0,
      initialDuration: 1000,
    });

    const segments = screen.getAllByTestId('segment'); // Assumes Segment has data-testid="segment"
    segments.forEach((segment) => {
      expect(segment).toHaveStyle('width: 1000px');
    });

    // Simulate duration change to 2000
    rerender(
      <TestTimelineProviderWithState initialTime={0} initialDuration={2000}>
        <KeyframeList />
      </TestTimelineProviderWithState>
    );

    await waitFor(() => {
      const updatedSegments = screen.getAllByTestId('segment');
      updatedSegments.forEach((segment) => {
        expect(segment).toHaveStyle('width: 2000px');
      });
    });
  });

  // Additional rendering test to ensure segments are rendered
  test('renders all segments', () => {
    renderWithTimelineProvider(<KeyframeList />, { contextOverrides: defaultContextOverrides });

    const segments = screen.getAllByTestId('segment'); // Assumes Segment has data-testid="segment"
    expect(segments).toHaveLength(10); // 10 segments as per Array.from({ length: 10 })
  });

  // Test ref assignment
  test('keyframeListRef is assigned to the keyframe list div', () => {
    const keyframeListRef = { current: null };
    renderWithTimelineProvider(<KeyframeList />, {
      contextOverrides: {
        scrollRefs: {
          keyframeListRef,
          trackListRef: { current: { scrollTop: 0, scrollTo: mockScrollTop } },
          rulerRef: { current: { scrollLeft: 0, scrollTo: mockScrollLeft } },
        } as any,
      },
    });

    const keyframeList = screen.getByTestId('keyframe-list');
    expect(keyframeListRef.current).toBe(keyframeList);
  });
});