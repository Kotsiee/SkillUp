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
  let startX = 0;
  let startValue = value.value;
  const step = steps ?? 1;

  const startDrag = (event: MouseEvent | TouchEvent) => {
    isDragging = true;
    startX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    startValue = value.value;

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', onDrag);
    document.addEventListener('touchend', stopDrag);
  };

  const onDrag = (event: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const currentX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const delta = currentX - startX; // Calculate movement

    // Compute the new value, ensuring it aligns with the step
    let newValue = Math.min(max || Infinity, Math.max(min || 0, startValue + delta * step));
    newValue = Math.round(newValue / step) * step; // Apply step rounding

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
    <div
      class={`label-slider ${className || ''}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Hidden Range Input (Still Functional) */}
      <input
        type="range"
        id="labelSlider"
        min={min}
        max={max}
        step={step}
        value={value.value}
        onInput={e => {
          (value.value = Math.round(Number(e.currentTarget.value) / step) * step).toFixed(2);
          onValInput?.(value.value);
        }}
        hidden
      />

      {/* Label Becomes the Slider */}
      <label
        for="labelSlider"
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        style={{
          cursor: 'ew-resize',
          userSelect: 'none',
        }}
      >
        {children}
      </label>
    </div>
  );
}
