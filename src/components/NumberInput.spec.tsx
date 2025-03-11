import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import NumberInput from './NumberInput'; // Adjust the path to your component

describe('NumberInput Component', () => {
  const defaultProps = {
    value: 5,
    onChange: jest.fn(),
    min: 0,
    max: 10,
    step: 1,
    label: 'Test Label',
    dataTestId: 'number-input',
  };

  // Helper to render the component with given props
  const renderComponent = (props = {}) =>
    render(<NumberInput {...defaultProps} {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('The displayed value updates immediately while typing, but onChange is not triggered until input is confirmed', async () => {
    renderComponent();
    const input = screen.getByTestId('number-input');

    await userEvent.type(input, '7');
    expect(input).toHaveDisplayValue('7');
    expect(defaultProps.onChange).not.toHaveBeenCalled();

    fireEvent.blur(input);
    expect(defaultProps.onChange).toHaveBeenCalledWith(7);
  });

  test('Clicking outside the input field removes focus and changes the value', async () => {
    renderComponent();
    const input = screen.getByTestId('number-input');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '8' } });
    expect(input).toHaveDisplayValue('8');

    fireEvent.blur(input);
    expect(defaultProps.onChange).toHaveBeenCalledWith(8);
    expect(document.activeElement).not.toBe(input);
  });

  test('Clicking on the native step buttons immediately changes the value', () => {
    renderComponent();
    const input = screen.getByTestId('number-input');

    fireEvent.change(input, { target: { value: '6' }, nativeEvent: new InputEvent('input', { inputType: 'stepUp' }) });
    expect(defaultProps.onChange).toHaveBeenCalledWith(6);
  });

  test('Pressing up arrow or down arrow keys immediately changes the value', async () => {
    renderComponent();
    const input = screen.getByTestId('number-input') as HTMLInputElement;

    // ArrowDown / ArrowUp events in "number" input fields do not trigger onChange
    // https://github.com/testing-library/user-event/issues/1066
    fireEvent.keyDown(input, { key: "ArrowUp" });
    fireEvent.input(input, {
      target: { value: "6" },
      nativeEvent: { inputType: "stepUp" },
    });
    expect(defaultProps.onChange).toHaveBeenCalledWith(6);

    jest.clearAllMocks();
    await userEvent.type(input, '{arrowdown}');
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.input(input, {
      target: { value: "4" },
      nativeEvent: { inputType: "stepUp" },
    });
    expect(defaultProps.onChange).toHaveBeenCalledWith(4);
  });

  test('Entire text is selected when the input field gains focus', async () => {
    renderComponent();
    const input = screen.getByTestId('number-input') as HTMLInputElement;
    const selectSpy = jest.spyOn(input, "select");

    await userEvent.click(input);
    // workround
    // selectionStart/selectionEnd on input type="number" no longer allowed in Chrome
    expect(selectSpy).toHaveBeenCalled();
  });

  test('Entire text is selected after using the native step buttons', async () => {
    renderComponent();
    const input = screen.getByTestId('number-input') as HTMLInputElement;
    const selectSpy = jest.spyOn(input, "select");

    fireEvent.input(input, {
      target: { value: "7" },
      nativeEvent: { inputType: "stepUp" },
    });
    expect(selectSpy).toHaveBeenCalled();
  });

  test('Entire text is selected after using the up arrow or down arrow keys', () => {
    renderComponent();
    const input = screen.getByTestId('number-input') as HTMLInputElement;
    const selectSpy = jest.spyOn(input, "select");

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(selectSpy).toHaveBeenCalled();
  });

  test('Pressing Enter confirms the new value and removes focus', () => {
    renderComponent();
    const input = screen.getByTestId('number-input');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '7' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(defaultProps.onChange).toHaveBeenCalledWith(7);
    expect(document.activeElement).not.toBe(input);
  });

  test('Pressing Escape reverts to the original value and removes focus', async () => {
    renderComponent();
    const input = screen.getByTestId('number-input');

    await userEvent.click(input);
    await userEvent.type(input, '7');
    await userEvent.keyboard('{escape}')

    expect(input).toHaveDisplayValue(String(defaultProps.value));
    expect(defaultProps.onChange).not.toHaveBeenCalled();
    expect(document.activeElement).not.toBe(input);
  });

  test('Leading zeros are automatically removed', () => {
    renderComponent();
    const input = screen.getByTestId('number-input');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '005' } });
    fireEvent.blur(input);

    expect(input).toHaveDisplayValue('5');
    expect(defaultProps.onChange).toHaveBeenCalledWith(5);
  });

  test('Negative values are automatically adjusted to the minimum allowed value', () => {
    renderComponent();
    const input = screen.getByTestId('number-input');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '-1' } });
    fireEvent.blur(input);

    expect(input).toHaveDisplayValue(String(defaultProps.min));
    expect(defaultProps.onChange).toHaveBeenCalledWith(defaultProps.min);
  });

  test('Decimal values are automatically rounded to the nearest integer', () => {
    renderComponent();
    const input = screen.getByTestId('number-input');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '5.6' } });
    fireEvent.blur(input);

    expect(input).toHaveDisplayValue('6');
    expect(defaultProps.onChange).toHaveBeenCalledWith(6);

    jest.clearAllMocks();
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '5.4' } });
    fireEvent.blur(input);

    expect(input).toHaveDisplayValue('5');
    expect(defaultProps.onChange).toHaveBeenCalledWith(5);
  });

  test('Invalid inputs (non-numeric) revert to the previous valid value', () => {
    renderComponent();
    const input = screen.getByTestId('number-input');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.blur(input);

    expect(input).toHaveDisplayValue(String(defaultProps.value));
    expect(defaultProps.onChange).toHaveBeenCalledWith(defaultProps.value);

    jest.clearAllMocks();
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(input).toHaveDisplayValue(String(defaultProps.value));
    expect(defaultProps.onChange).toHaveBeenCalledWith(defaultProps.value);
  });
});