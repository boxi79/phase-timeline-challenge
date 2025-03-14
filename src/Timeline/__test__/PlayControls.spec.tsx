import { renderWithTimelineProvider } from './testUtils'; // Adjust the import path as needed
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayControls } from '../PlayControls'; // Adjust the import path as needed
import { MIN_DURATION, MAX_DURATION } from '../TimelineContext'; // Adjust the import path as needed

describe('PlayControls', () => {
  const mockSetTime = jest.fn();
  const mockSetDuration = jest.fn();

  const defaultContextOverrides = {
    time: 100,
    setTime: mockSetTime,
    duration: 1000,
    setDuration: mockSetDuration,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test requirement: Current Time is always between 0ms and the Duration
  test('Current Time cannot exceed Duration', async () => {
    renderWithTimelineProvider(<PlayControls />, { contextOverrides: defaultContextOverrides });

    const timeInput = screen.getByTestId('current-time-input');
    await userEvent.type(timeInput, '2000');
    fireEvent.blur(timeInput);

    expect(mockSetTime).toHaveBeenLastCalledWith(defaultContextOverrides.duration);
  });

  // Test requirement: Current Time adjusts if it exceeds the newly set Duration
  test('Current Time adjusts when Duration is set below current time', async () => {
    renderWithTimelineProvider(<PlayControls />, {
      useRealState: true, // Use real state management instead of mocks
      initialTime: 2000,
      initialDuration: 2000,
    });

    const durationInput = screen.getByTestId('duration-input') as HTMLInputElement;
    const timeInput = screen.getByTestId('current-time-input') as HTMLInputElement;

    // Verify initial values
    expect(timeInput).toHaveValue(2000);
    expect(durationInput).toHaveValue(2000);

    // Set duration to 500
    await userEvent.clear(durationInput);
    await userEvent.type(durationInput, '500');
    fireEvent.blur(durationInput);

    // Wait for the state updates to reflect in the UI
    await waitFor(() => {
      expect(durationInput).toHaveValue(500);
      expect(timeInput).toHaveValue(500);
    });
  });

  // Test requirement: Duration is always between 100ms and 6000ms
  test('Duration cannot be less than MIN_DURATION', async () => {
    renderWithTimelineProvider(<PlayControls />, { contextOverrides: defaultContextOverrides });

    const durationInput = screen.getByTestId('duration-input');
    await userEvent.type(durationInput, '50');
    fireEvent.blur(durationInput);

    expect(mockSetDuration).toHaveBeenLastCalledWith(MIN_DURATION);
  });

  test('Duration cannot exceed MAX_DURATION', async () => {
    renderWithTimelineProvider(<PlayControls />, { contextOverrides: defaultContextOverrides });

    const durationInput = screen.getByTestId('duration-input');
    await userEvent.type(durationInput, '7000');
    fireEvent.blur(durationInput);

    expect(mockSetDuration).toHaveBeenLastCalledWith(MAX_DURATION);
  });

  // Test requirement: Current Time and Duration are always multiples of 10ms
  test('Current Time rounds to nearest multiple of STEP', async () => {
    renderWithTimelineProvider(<PlayControls />, { contextOverrides: defaultContextOverrides });

    const timeInput = screen.getByTestId('current-time-input');
    await userEvent.type(timeInput, '123');
    fireEvent.blur(timeInput);

    expect(mockSetTime).toHaveBeenLastCalledWith(120);
  });

  test('Duration rounds to nearest multiple of STEP', async () => {
    renderWithTimelineProvider(<PlayControls />, { contextOverrides: defaultContextOverrides });

    const durationInput = screen.getByTestId('duration-input');
    await userEvent.type(durationInput, '1234');
    fireEvent.blur(durationInput);

    expect(mockSetDuration).toHaveBeenLastCalledWith(1230);
  });

  // Test requirement: Current Time and Duration are always positive integers
  test('Current Time rejects non-integer values', async () => {
    renderWithTimelineProvider(<PlayControls />, { contextOverrides: defaultContextOverrides });

    const timeInput = screen.getByTestId('current-time-input');
    await userEvent.type(timeInput, '123.5');
    fireEvent.blur(timeInput);

    expect(mockSetTime).toHaveBeenLastCalledWith(120);
  });

  // Test requirement: Playhead position updates only after specific actions
  test('Current Time updates on blur', async () => {
    renderWithTimelineProvider(<PlayControls />, { contextOverrides: defaultContextOverrides });

    const timeInput = screen.getByTestId('current-time-input');
    await userEvent.type(timeInput, '500');
    expect(mockSetTime).not.toHaveBeenCalled();
    fireEvent.blur(timeInput);
    expect(mockSetTime).toHaveBeenCalledWith(500);
  });

  test('Current Time updates on Enter key', async () => {
    renderWithTimelineProvider(<PlayControls />, { contextOverrides: defaultContextOverrides });

    const timeInput = screen.getByTestId('current-time-input');
    await userEvent.type(timeInput, '500');
    expect(mockSetTime).not.toHaveBeenCalled();
    await userEvent.keyboard('{Enter}');
    expect(mockSetTime).toHaveBeenCalledWith(500);
  });

  test('renders with correct initial values', () => {
    renderWithTimelineProvider(<PlayControls />, { contextOverrides: defaultContextOverrides });

    expect(screen.getByTestId('current-time-input')).toHaveValue(100);
    expect(screen.getByTestId('duration-input')).toHaveValue(1000);
  });
});