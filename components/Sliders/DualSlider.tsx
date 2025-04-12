// deno-lint-ignore-file no-explicit-any
import { JSX } from 'preact';
import { useSignal } from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js';
import { useRef } from 'preact/hooks';
import { getPercentage, roundToStep } from '../../lib/utils/math.ts';

interface DualSliderProps {
  minVal: number;
  maxVal: number;

  startMinVal: number | 'min' | undefined;
  startMaxVal: number | 'max' | undefined;
  onChang: (values: { min: number | 'min'; max: number | 'max' }) => void;
}

export function DualSlider(props: JSX.HTMLAttributes<HTMLInputElement> & DualSliderProps) {
  const minVal = useSignal(
    (props.startMinVal != 'min' ? props.startMinVal : props.minVal) || props.minVal
  );
  const maxVal = useSignal(
    (props.startMaxVal != 'max' ? props.startMaxVal : props.maxVal) || props.maxVal
  );
  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  const minInput = useRef<HTMLInputElement>(null);
  const maxInput = useRef<HTMLInputElement>(null);

  const change = () => {
    const minV = minVal.value != props.minVal ? minVal.value : 'min';
    const maxV = maxVal.value != props.maxVal ? maxVal.value : 'max';
    props.onChang({ min: minV, max: maxV });
  };

  return (
    <div class={props.class}>
      <link rel="stylesheet" href="/styles/components/dualslider.css" />
      <div className={`${props.className} DualSlider`}>
        <div className={`${props.className} DualSlider-sliders`}>
          <input
            type="range"
            step={props.step}
            min={`${props.minVal}`}
            max={`${props.maxVal}`}
            value={minVal.value}
            onInput={e => {
              minVal.value = parseFloat(e.currentTarget.value);
              change();
            }}
            ref={minRef}
          />

          <input
            type="range"
            step={props.step}
            min={`${props.minVal}`}
            max={`${props.maxVal}`}
            value={maxVal.value}
            onInput={e => {
              maxVal.value = parseFloat(e.currentTarget.value);
              change();
            }}
            ref={maxRef}
          />
        </div>

        <div className={`${props.className} DualSlider-slider-container`}>
          <div
            ref={range}
            className={`${props.className} DualSlider-slider-range`}
            style={{
              left: `${getPercentage(
                props.minVal,
                props.maxVal,
                Math.min(minVal.value, maxVal.value)
              )}%`,
              width: `${getPercentage(
                props.minVal,
                props.maxVal,
                Math.max(minVal.value, maxVal.value) - Math.min(minVal.value, maxVal.value)
              )}%`,
            }}
          />
        </div>
      </div>

      <div className={`${props.className} DualSlider-Inputs`}>
        <input
          ref={minInput}
          className="DualSlider-Input DualSlider-Input-Left"
          type="number"
          min={`${props.minVal}`}
          max={`${props.maxVal}`}
          value={Math.min(minVal.value, maxVal.value)}
          onChange={e => {
            minVal.value = roundToStep(
              parseFloat(e.currentTarget.value),
              (props.step as number) ? (props.step as number) : 1
            );
          }}
        />

        <input
          ref={maxInput}
          className="DualSlider-Input DualSlider-Input-Right"
          type="number"
          min={`${props.minVal}`}
          max={`${props.maxVal}`}
          value={Math.max(minVal.value, maxVal.value)}
          onChange={e => {
            minVal.value = roundToStep(
              parseFloat(e.currentTarget.value),
              (props.step as number) ? (props.step as number) : 1
            );
          }}
        />
      </div>
    </div>
  );
}
