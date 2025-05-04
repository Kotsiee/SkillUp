import { Signal, useSignal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';
import { Metrics } from '../../../../lib/newtypes/index.ts';
import TextDropdownField from '../../../UI/Fields/TextDropdownField.tsx';
import ProportionalSliderField from '../../../UI/Fields/ProportionalSliderField.tsx';
import { testMetrics } from '../../../../lib/testArrays.ts';

export default function NewMetric({
  metrics,
  ...props
}: {
  metrics: Signal<Metrics>;
} & JSX.HTMLAttributes<HTMLDivElement>) {
  const addedMetricsNames = useSignal<string[]>(
    Object.entries(metrics.value).map(([name, _]) => name)
  );

  return (
    <div {...props} class={`input-field input-field--metric ${props.class}`}>
      <TextDropdownField
        val={addedMetricsNames}
        items={testMetrics}
        onAdd={item => {
          if (Object.entries(metrics.value).findIndex(([name, _]) => name === item) === -1) {
            const entries = Object.entries(metrics.value);
            const newLength = entries.length + 1;

            const normalized = entries.reduce((acc, [name]) => {
              acc[name] = 1 / newLength;
              return acc;
            }, {} as Record<string, number>);

            metrics.value = {
              ...normalized,
              [item]: 1 / newLength,
            };

            console.log(metrics.value);
          } else {
            // Dont add the item
            addedMetricsNames.value = addedMetricsNames.value.filter(i => i !== item);
          }
        }}
        onMinus={item => {
          if (Object.entries(metrics.value).findIndex(([name, _]) => name === item) !== -1) {
            // Remove the metric
            const { [item]: _, ...remaining } = metrics.value;

            const entries = Object.entries(remaining);
            const newLength = entries.length;

            // Rebalance remaining weights
            const normalized = entries.reduce((acc, [name]) => {
              acc[name] = 1 / newLength;
              return acc;
            }, {} as Record<string, number>);

            metrics.value = normalized;

            console.log(metrics.value);
          }
        }}
      >
        Add Metrics
      </TextDropdownField>

      {Object.entries(metrics.value).length > 0 && (
        <div>
          <ProportionalSliderField val={metrics}>Weights</ProportionalSliderField>
        </div>
      )}
    </div>
  );
}
