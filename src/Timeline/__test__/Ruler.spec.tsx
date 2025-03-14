import { renderWithTimelineProvider, TestTimelineProviderWithState } from './testUtils'; // Adjust the import path as needed
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Ruler } from '../Ruler'; // Adjust the import path as needed

describe('Ruler', () => {
  const mockUpdateTime = jest.fn();
  const mockScrollLeft = jest.fn();

  const defaultContextOverrides = {
    duration: 1000,
    updateTime: mockUpdateTime,
    scrollRefs: {
      rulerRef: { current: null },
      keyframeListRef: { current: { scrollLeft: 0, scrollTo: mockScrollLeft } },
      trackListRef: { current: null },
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock getBoundingClientRect for consistent positioning in tests
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

  // Requirement 1: Clicking or dragging on the Ruler updates the Current Time and Playhead position
  test('clicking on the ruler updates the current time', () => {
    renderWithTimelineProvider(<Ruler />, { contextOverrides: defaultContextOverrides });

    const rulerBar = screen.getByTestId('ruler-bar');

    // Simulate click at x=500
    fireEvent.mouseDown(rulerBar, { clientX: 500 });

    expect(mockUpdateTime).toHaveBeenCalledWith(500);
  });

  test('dragging on the ruler updates the current time', () => {
    renderWithTimelineProvider(<Ruler />, { contextOverrides: defaultContextOverrides });

    const rulerBar = screen.getByTestId('ruler-bar');

    // Simulate drag: mouse down at x=500, move to x=600
    fireEvent.mouseDown(rulerBar, { clientX: 500 });
    expect(mockUpdateTime).toHaveBeenCalledWith(500);

    fireEvent.mouseMove(document, { clientX: 600 });
    expect(mockUpdateTime).toHaveBeenCalledWith(600);

    // Simulate mouse up to end drag
    fireEvent.mouseUp(document);

    // Ensure no further updates after drag ends
    fireEvent.mouseMove(document, { clientX: 700 });
    expect(mockUpdateTime).not.toHaveBeenCalledWith(700);
  });

  test('touch dragging on the ruler updates the current time', () => {
    renderWithTimelineProvider(<Ruler />, { contextOverrides: defaultContextOverrides });

    const rulerBar = screen.getByTestId('ruler-bar');

    // Simulate touch drag: touch start at x=500, move to x=600
    fireEvent.touchStart(rulerBar, { touches: [{ clientX: 500 }] });
    expect(mockUpdateTime).toHaveBeenCalledWith(500);

    fireEvent.touchMove(document, { touches: [{ clientX: 600 }] });
    expect(mockUpdateTime).toHaveBeenCalledWith(600);

    // Simulate touch end to end drag
    fireEvent.touchEnd(document);

    // Ensure no further updates after drag ends
    fireEvent.touchMove(document, { touches: [{ clientX: 700 }] });
    expect(mockUpdateTime).not.toHaveBeenCalledWith(700);
  });

  test('clicking or dragging clamps time to 0 when before start', () => {
    renderWithTimelineProvider(<Ruler />, { contextOverrides: defaultContextOverrides });

    const rulerBar = screen.getByTestId('ruler-bar');

    // Simulate click at x=-100 (before start)
    fireEvent.mouseDown(rulerBar, { clientX: -100 });
    expect(mockUpdateTime).toHaveBeenCalledWith(0);
  });

  test('clicking or dragging clamps time to duration when past end', () => {
    renderWithTimelineProvider(<Ruler />, { contextOverrides: defaultContextOverrides });

    const rulerBar = screen.getByTestId('ruler-bar');

    // Simulate click at x=1500 (past duration of 1000)
    fireEvent.mouseDown(rulerBar, { clientX: 1500 });
    expect(mockUpdateTime).toHaveBeenCalledWith(1000);
  });

  // Requirement 2: Horizontal scrolling of the Ruler is synchronized with the Keyframe List
  test('scrolling the ruler synchronizes with keyframeListRef', () => {
    renderWithTimelineProvider(<Ruler />, { contextOverrides: defaultContextOverrides });

    const ruler = screen.getByTestId('ruler');

    // Simulate scroll event
    fireEvent.scroll(ruler, { target: { scrollLeft: 100 } });

    expect(defaultContextOverrides.scrollRefs.keyframeListRef.current?.scrollLeft).toBe(100);
  });

  // Requirement 3: Ruler length visually represents the total Duration (1ms = 1px)
  test('ruler length matches duration (1ms = 1px)', () => {
    renderWithTimelineProvider(<Ruler />, { contextOverrides: defaultContextOverrides });

    const rulerBar = screen.getByTestId('ruler-bar');
    expect(rulerBar).toHaveStyle('width: 1000px');
  });


  // Requirement 4: Ruler length updates only after specific actions on Duration input
  // Note: This requirement is primarily tested in the PlayControls component, but we can test
  // that Ruler reacts to duration changes here.
  test('ruler length updates when duration changes (real state)', async () => {
    const { rerender } = renderWithTimelineProvider(<Ruler />, {
      useRealState: true,
      initialTime: 0,
      initialDuration: 1000,
    });

    const rulerBar = screen.getByTestId('ruler-bar');
    expect(rulerBar).toHaveStyle('width: 1000px');

    // Simulate duration change to 2000
    rerender(
      <TestTimelineProviderWithState initialTime={0} initialDuration={2000}>
        <Ruler />
      </TestTimelineProviderWithState>
    );

    await waitFor(() => {
      const rulerBar = screen.getByTestId('ruler-bar');
      expect(rulerBar).toHaveStyle('width: 2000px');
    });
  });

  // Additional tests for cleanup and edge cases
  test('removes global event listeners on unmount', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = renderWithTimelineProvider(<Ruler />, { contextOverrides: defaultContextOverrides });

    // Check that event listeners were added
    expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));

    unmount();

    // Check that event listeners were removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
  });
});