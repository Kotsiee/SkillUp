import { Signal } from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js';
import { JSX } from 'preact/jsx-runtime';

export default function LabelSlider({
  value,
  min,
  max,
  steps,
  children,
  className,
  onValInput,
}: JSX.HTMLAttributes<HTMLDivElement> & {
  value: Signal<number>;
  min?: number;
  max?: number;
  steps?: number;
  onValInput?: (val: number) => void;
}) {
  let isDragging = false;
  let lastX = 0;
  let startValue = value.value;
  let lastTime = performance.now();
  let startTime = performance.now();
  const step = steps ?? 1;

  const startDrag = (event: MouseEvent | TouchEvent) => {
    isDragging = true;
    lastX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    startValue = value.value;
    startTime = performance.now();
    lastTime = startTime;

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', onDrag);
    document.addEventListener('touchend', stopDrag);
  };

  const onDrag = (event: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const now = performance.now();
    const deltaTime = now - lastTime;
    lastTime = now;

    const currentX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const frameDeltaX = currentX - lastX;
    lastX = currentX;

    // velocity in px/ms
    const velocity = Math.abs(frameDeltaX / deltaTime);
    const accelerationFactor = 1 + velocity * 3; // tweak as needed

    let newValue = value.value + frameDeltaX * step * accelerationFactor;

    // Clamp and round
    newValue = Math.min(max || Infinity, Math.max(min || 0, newValue));
    newValue = Math.round((Math.round(newValue / step) * step + Number.EPSILON) * 100) / 100;

    value.value = newValue;
    onValInput?.(value.value);
  };

  const stopDrag = () => {
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', stopDrag);
  };

  return (
    <div class={`label-slider ${className || ''}`}>
      <label class="label-slider__inputs">
        <div
          class="label-slider__inputs-display-label"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          {children}
        </div>
        <input
          class="label-slider__inputs-number"
          type="number"
          min={min}
          max={max}
          step={step}
          value={value.value}
          onInput={e => {
            const raw = Number(e.currentTarget.value);
            const stepped = Math.round(raw / step) * step;
            // Proper rounding to 2 decimal places without float error
            value.value = Math.round((stepped + Number.EPSILON) * 100) / 100;
            onValInput?.(value.value);
          }}
          // hidden
        />
      </label>
    </div>
  );
}
