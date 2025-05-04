// deno-lint-ignore-file
import { Signal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';
import { parseNumber } from '../../../lib/utils/math.ts';

interface SliderFieldOptions extends JSX.HTMLAttributes<HTMLInputElement> {
  val: Signal<any>;
  options?: {
    step?: number;
    showSteps?: boolean;
    allowTextInput?: boolean;
    onChange?: (val: number) => void;
  };
}

export default function SliderField({ val, options, min, max, ...props }: SliderFieldOptions) {
  const MIN = parseNumber(min, -10);
  const MAX = parseNumber(max, 10);
  const STEP = options?.step || 1;

  if (MAX < MIN || STEP > MAX || STEP < MIN) return null;

  const stepIntervals: number[] = [];
  for (let val = MIN; val <= MAX; val += STEP) {
    stepIntervals.push(parseFloat(val.toFixed(10))); // Avoid floating-point errors
  }

  const processInput = (v: JSX.TargetedInputEvent<HTMLInputElement>) => {
    val.value = v.currentTarget.value;
    options?.onChange?.(val.value);
  };

  return (
    <div class={`input-field input-field--slider ${props.class}`}>
      <p class="input-field-title input-field--slider-title">{props.children}</p>
      <div>
        <div>
          <input
            class="input-field--slider-input-slider"
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={val.value}
            onInput={processInput}
          />

          {options?.showSteps && (
            <div class="input-field--slider-input-steps">
              {stepIntervals.map(interval => {
                <p>{interval}</p>;
              })}
            </div>
          )}
        </div>

        {options?.allowTextInput && (
          <div>
            <input
              class="input-field--slider-input-number"
              type="number"
              min={MIN}
              max={MAX}
              step={STEP}
              value={val.value}
              onInput={processInput}
            />
          </div>
        )}
      </div>
    </div>
  );
}
