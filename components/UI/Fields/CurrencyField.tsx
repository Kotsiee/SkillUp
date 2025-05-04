import { Signal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';
import LabelSlider from './../Sliders/LabelSlider.tsx';

export default function CurrencyField({
  val,
  onValInput,
  ...props
}: {
  val: Signal<number>;
  onValInput?: (val: number) => void;
} & JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <div class={`input-field input-field--currency ${props.class}`}>
      <p class="input-field-title input-field--currency-title">{props.children}</p>
      <LabelSlider
        value={val}
        className="input-field--currency-labelslider"
        onValInput={onValInput}
        steps={0.01}
      >
        £
      </LabelSlider>
    </div>
  );
}
