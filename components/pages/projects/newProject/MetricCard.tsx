// deno-lint-ignore-file
import { jsonTag } from '../../../../lib/newtypes/index.ts';
import RichText from '../../../UI/RichText.tsx';

interface IMetricCard {
  metric: any;
  onRemove?: (e?: any) => void;
  onSelect?: (e?: any) => void;
}

export default function MetricCard({ metric, onRemove, onSelect }: IMetricCard) {
  return (
    <div class="metric-card">
      <p class="metric-card-title">{metric.title}</p>
      {metric.description && (
        <RichText class="metric-card-description" jsonText={metric.description as jsonTag} />
      )}
      <div class="metric-card__dates">
        <div class="metric-card__dates-start">
          <p class="metric-card__dates-title">Start Date</p>
          <p class="metric-card__dates-date">{metric.startDate?.toFormat('DD - HH:mm')}</p>
        </div>

        <div class="metric-card__dates-end">
          <p class="metric-card__dates-title">End Date</p>
          <p class="metric-card__dates-date">{metric.endDate?.toFormat('DD - HH:mm')}</p>
        </div>
      </div>
    </div>
  );
}
