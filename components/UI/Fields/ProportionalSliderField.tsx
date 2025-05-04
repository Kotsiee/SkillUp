import { Signal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';
import { useRef } from 'preact/hooks';
import { ValueAnimation } from 'https://esm.sh/fabric@6.6.1/dist/src/util/animation/ValueAnimation.d.ts';

export default function ProportionalSliderField({
  val,
  ...props
}: {
  val: Signal<{ [name: string]: number }>;
} & JSX.HTMLAttributes<HTMLInputElement>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (index: number) => (e: MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const keys = Object.keys(val.value);
    const current = keys[index];
    const next = keys[index + 1];
    const containerWidth = containerRef.current?.offsetWidth || 1;
    const startVals = { ...val.value };
    const minWidth = 0.1;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = deltaX / containerWidth;

      const currentWidth = startVals[current];
      const nextWidth = startVals[next];

      const newCurrent = currentWidth + deltaPercent;
      const newNext = nextWidth - deltaPercent;
      if (newCurrent < minWidth || newNext < minWidth) return;

      val.value = {
        ...val.value,
        [current]: newCurrent,
        [next]: newNext,
      };
    };

    const onMouseUp = () => {
      globalThis.removeEventListener('mousemove', onMouseMove);
      globalThis.removeEventListener('mouseup', onMouseUp);
    };

    globalThis.addEventListener('mousemove', onMouseMove);
    globalThis.addEventListener('mouseup', onMouseUp);
  };

  const keys = Object.keys(val.value);

  return (
    <div class={`input-field input-field--pSlider ${props.class}`}>
      <p class="input-field-title input-field--pSlider-title">{props.children}</p>
      <div
        ref={containerRef}
        class="input-field--pSlider-container"
        style={{ display: 'flex', width: '100%' }}
      >
        {keys.map((name, i) => {
          const width = val.value[name] * 100;
          //   const clickedVal = useS
          return (
            <div
              key={name}
              class="input-field--pSlider-item"
              style={{ width: `${width}%`, position: 'relative' }}
            >
              <div class="input-field--pSlider-item-content">
                <p class="input-field--pSlider-item-name">{name}</p>
                {/* <p class="input-field--pSlider-item-value">{val.value[name].toPrecision(2)}</p> */}
                <input
                  class="input-field--pSlider-item-value"
                  type="number"
                  step={0.01}
                  min={0.1}
                  max={1}
                  value={val.value[name].toPrecision(2)}
                  onInput={e => {
                    const newValue = parseFloat((e.target as HTMLInputElement).value);
                    if (isNaN(newValue) || newValue < 0.1 || newValue > 1) return;

                    const otherKey = i < keys.length - 1 ? keys[i + 1] : keys[i - 1];
                    const total = val.value[name] + val.value[otherKey];
                    const newOther = total - newValue;

                    // prevent underflow of the other
                    if (newOther < 0.1) return;

                    val.value = {
                      ...val.value,
                      [name]: newValue,
                      [otherKey]: newOther,
                    };
                  }}
                />
              </div>
              {i < keys.length - 1 && (
                <div class="input-field--pSlider-item-handle" onMouseDown={handleMouseDown(i)} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
