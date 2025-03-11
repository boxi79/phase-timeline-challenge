import React, { useRef, useState } from 'react';

type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  dataTestId: string;
};

const isValidNumber = (str: string) => {
  if (typeof str !== "string") return false; // Ensure it's a string
  if (str.trim() === "") return false; // Reject empty or whitespace-only strings
  const numericValue = Number(str);
  return !isNaN(numericValue); // Check if it can be converted to a number
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, dataTestId, min, max, step, label }) => {
  const [displayValue, setDisplayValue] = useState<string>(String(value));
  const cancelRef = useRef(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputType = (e.nativeEvent as InputEvent).inputType;
    const newValue = e.target.value;
    if (
      inputType === "stepUp" ||
      inputType === "stepDown" ||
      (inputType !== "deleteContentBackward" && inputType !== "insertText" && inputType !== "insertFromPaste")
    ) {
      e.target.select();
      handleCheck(newValue);
    }
    else {
      setDisplayValue(newValue);
    }
  };

  const handleBlur = () => {
    if (!cancelRef.current) {
      handleCheck();
    }
  };

  const handleCheck = (newValue?: string) => {
    const v = newValue || displayValue;
    if (!isValidNumber(v)) {
      setDisplayValue(String(value));
    } else {
      const numericValue = Number(Math.max(min, Math.min(max, Math.round(Number(v)))));
      onChange(numericValue);
      setDisplayValue(String(numericValue));
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheck();
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setDisplayValue(String(value));
      cancelRef.current = true;
      e.currentTarget.blur();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
    cancelRef.current = false;
  };

  return (
    <fieldset className="flex gap-1">
      {label}
      <input
        className="bg-gray-700 px-1 rounded"
        type="number"
        data-testid={dataTestId}
        min={min}
        max={max}
        step={step}
        value={displayValue}
        onBlur={handleBlur}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
      />
    </fieldset>
  );
};

export default NumberInput;