import { jsonTag, Task } from '../../../../lib/newtypes/index.ts';
import { formatWithCommas } from '../../../../lib/utils/math.ts';
import FileCard from '../../../cards/FileCard.tsx';
import RichText from '../../../UI/RichText.tsx';
import TaskCard from './TaskCard.tsx';

interface IJobCard {
  job: Task;
  onRemove?: (e?: any) => void;
  onSelect?: (job: Task) => void;
}

export default function JobCard({ job, onRemove, onSelect }: IJobCard) {
  return (
    <div class="job-card" onClick={() => onSelect?.(job)}>
      <div>
        <p class="job-card-title">{job.title}</p>

        {job.description && (
          <div class="job-card__description">
            <p class="job-card__description-title">Description</p>
            <RichText class="job-card__description-content" jsonText={job.description as jsonTag} />
          </div>
        )}

        <div class="job-card-attachments">
          {job.attachments?.map(file => {
            return <FileCard file={file} />;
          })}
        </div>

        <div class="job-card__budget">
          <p class="job-card__budget-title">Budget</p>
          <p class="job-card__budget-amount">
            <span class="job-card__budget-currency">£</span>
            {formatWithCommas(job.budgetAllocated || 0)}
          </p>
        </div>

        <div class="job-card__dates">
          <div class="job-card__dates-start">
            <p class="job-card__dates-title">Start Date</p>
            <p class="job-card__dates-date">{job.startDate?.toFormat('DD - HH:mm')}</p>
          </div>

          <div class="job-card__dates-end">
            <p class="job-card__dates-title">End Date</p>
            <p class="job-card__dates-date">{job.endDate?.toFormat('DD - HH:mm')}</p>
          </div>
        </div>
      </div>
      {job.tasks && job.tasks.length > 0 && (
        <div class="job-card-tasks">
          <p class="job-card-tasks-title">Tasks</p>
          {job.tasks.map(task => {
            return <TaskCard task={task} />;
          })}
        </div>
      )}

      {job.metrics && Object.entries(job.metrics).length > 0 && (
        <div class="job-card-metrics">
          <p class="job-card-metrics-title">Metrics</p>
          {Object.entries(job.metrics).map(([name, val]) => {
            return (
              <div class="job-card-metrics-item">
                <p class="job-card-metrics-item-name">{name}</p>
                <p class="job-card-metrics-item-value">{val}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
