import { Signal } from '@preact/signals';
import AIcon, { Icons } from '../Icons.tsx';
import LabelSlider from '../UI/Sliders/LabelSlider.tsx';

export default function ImageController({
  controller,
}: {
  controller: Signal<{ [ctrl: string]: Signal<any> } | null>;
}) {
  const rotate = controller.value?.['rotate']!;
  const scale = controller.value?.['scale']!;

  return (
    <div class="controls">
      <div class="rotation">
        <p>Rotation</p>

        <button onClick={() => (rotate.value = 0)}>Reset</button>
        <div class="rotation-input-container">
          <div class="rotation-input">
            <LabelSlider value={rotate} min={-180} max={180}>
              <AIcon startPaths={Icons.Filter} size={16} />
            </LabelSlider>

            <input
              type="number"
              value={rotate.value}
              min={-180}
              max={180}
              step={1}
              onInput={val => (rotate.value = Number.parseInt(val.currentTarget.value))}
            />
            <p>°</p>
          </div>
        </div>

        <div class="fixed-rotate">
          <button
            onClick={() => {
              if (rotate.value - 90 <= -180) {
                const remainer = 180 + (rotate.value - 90);
                rotate.value = 180 - remainer;
              } else {
                rotate.value -= 90;
              }
            }}
          >
            <AIcon startPaths={Icons.Filter} size={16} />
          </button>

          <button
            onClick={() => {
              if (rotate.value + 90 >= 180) {
                const remainer = 180 - (rotate.value + 90);
                rotate.value = -180 + remainer;
              } else {
                rotate.value += 90;
              }
            }}
          >
            <AIcon startPaths={Icons.Filter} size={16} />
          </button>
        </div>
      </div>

      <div class="scale">
        <p>Scale</p>

        <button onClick={() => (scale.value = 0.75)}>Reset</button>
        <div class="scale-input-container">
          <div class="scale-input">
            <LabelSlider value={scale} min={0.1} max={10} steps={0.01}>
              <AIcon startPaths={Icons.Filter} size={16} />
            </LabelSlider>

            <input
              type="number"
              value={scale.value}
              min={0.1}
              max={10}
              step={0.01}
              onInput={val => (scale.value = Number.parseInt(val.currentTarget.value).toFixed(2))}
            />
            <p>x</p>
          </div>
        </div>
      </div>
    </div>
  );
}
