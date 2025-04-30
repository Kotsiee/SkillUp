import { Signal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';

export default function DateField({
  val,
  ...props
}: {
  val: Signal<any>;
} & JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <div class={`input-field input-field--date ${props.class}`}>
      <p class="input-field-title input-field--date-title">{props.children}</p>
      <input
        {...props}
        class="input-field--date-input"
        type="datetime-local"
        value={val.value}
        onInput={v => {
          console.log(v.currentTarget.value);
          val.value = v.currentTarget.value;
        }}
      />
    </div>
  );
}
