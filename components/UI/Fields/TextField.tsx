import { Signal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';

export default function TextField({
  val,
  ...props
}: {
  val: Signal<any>;
} & JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <div class={`input-field input-field--text ${props.class}`}>
      <p class="input-field-title input-field--text-title">{props.children}</p>
      <input
        {...props}
        class="input-field--text-input"
        type="text"
        value={val.value}
        onInput={v => (val.value = v.currentTarget.value)}
      />
    </div>
  );
}
