import { Signal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';

interface IOptionSwitch extends JSX.HTMLAttributes<HTMLDivElement> {
  options: string[];
  currentOption: Signal<string>;
  onSwitch?: (currentOption: string) => void;
}

export default function OptionSwitch({
  options,
  currentOption,
  onSwitch,
  ...props
}: IOptionSwitch) {
  return (
    <div class={`option-switch-container ${props.class}`}>
      <div class="option-switch">
        <div
          class="switch-box"
          style={{
            transform: `translateX(${options.indexOf(currentOption.value) * 100}%)`,
            width: `${100 / options.length}%`,
          }}
        />
        <div class="options">
          {options.map((option, index) => {
            return (
              <label key={`${props.name}-${option}-${index}`} class="option-wrapper">
                <input
                  type="radio"
                  name={props.name}
                  checked={currentOption.value === option}
                  onInput={() => {
                    currentOption.value = option;
                    onSwitch?.(currentOption.value);
                  }}
                  hidden
                />
                {option}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
