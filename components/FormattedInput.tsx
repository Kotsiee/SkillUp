/**
 * This component demonstrates a custom text input
 * that enforces numeric entry with commas and two decimals.
 */

import { Signal, useSignal } from '@preact/signals';
import { JSX } from 'preact';

function formatNumberWithCommas(value: number): string {
  // Convert number to string with commas + exactly two decimals
  // Example: 12345.5 -> "12,345.50"
  return value.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseAndSanitize(inputVal: string): number {
  // Remove all characters except digits and decimal point
  let sanitized = inputVal.replace(/[^0-9.]/g, '');

  // Prevent multiple decimals — keep only the first
  const firstDecimal = sanitized.indexOf('.');
  if (firstDecimal !== -1) {
    // Cut off everything after a second decimal point
    sanitized =
      sanitized.substring(0, firstDecimal + 1) +
      sanitized.substring(firstDecimal + 1).replace(/\./g, '');
  }

  // Enforce at most two digits after decimal
  const match = sanitized.match(/^(\d+(\.\d{0,2})?).*/);
  sanitized = match ? match[1] : '';

  // Disallow leading zeros unless “0.” or “0”
  // e.g. "000123" => "123", but "0.5" => "0.5"
  // This also ensures we don't produce something like "01.23"
  if (sanitized.length > 1 && sanitized.startsWith('0') && sanitized[1] !== '.') {
    // remove leading zeros
    sanitized = sanitized.replace(/^0+/, '');
  }

  // If user has typed nothing or only ".", treat as zero
  if (!sanitized || sanitized === '.') {
    return 0;
  }

  // Finally, convert to a floating number
  const numericVal = parseFloat(sanitized);
  if (isNaN(numericVal)) {
    return 0;
  }

  return numericVal;
}

export default function FormattedInput({
  val,
  onValIn,
  ...props
}: JSX.HTMLAttributes<HTMLInputElement> & {
  val: Signal<number>;
  onValIn?: (val: number) => void;
}) {
  const handleInput = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const inputVal = e.currentTarget.value;
    const numeric = parseAndSanitize(inputVal);
    val.value = numeric;
    onValIn?.(val.value);
  };

  // Optional: Reformat displayed text (with commas + 2 decimals) whenever user blurs
  const handleBlur = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    e.currentTarget.value = formatNumberWithCommas(val.value);
  };

  return (
    <input
      {...props}
      type="text"
      // Format with commas in the value. If you want to
      // let the user see partial input, you could just store
      // e.currentTarget.value in a separate signal.
      // For brevity, we will keep it always formatted:
      value={formatNumberWithCommas(val.value)}
      placeholder="0.00"
      onInput={handleInput}
      onBlur={handleBlur}
    />
  );
}
