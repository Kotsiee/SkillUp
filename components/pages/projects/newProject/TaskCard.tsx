import { jsonTag, Task } from '../../../../lib/newtypes/index.ts';
import { formatWithCommas } from '../../../../lib/utils/math.ts';
import RichText from '../../../UI/RichText.tsx';

interface ITaskCard {
  task: Task;
  onRemove?: (e?: any) => void;
  onSelect?: (task: Task) => void;
}

export default function TaskCard({ task, onRemove, onSelect }: ITaskCard) {
  return (
    <div class="task-card" onClick={() => onSelect?.(task)}>
      <p class="task-card-title">{task.title}</p>
      {task.description && (
        <RichText class="task-card-description" jsonText={task.description as jsonTag} />
      )}
      <div class="task-card__budget">
        <p class="task-card__budget-title">Budget</p>
        <p class="task-card__budget-amount">
          <span class="task-card__budget-currency">£</span>
          {formatWithCommas(task.budgetAllocated || 0)}
        </p>
      </div>
      <div class="task-card__dates">
        <div class="task-card__dates-start">
          <p class="task-card__dates-title">Start Date</p>
          <p class="task-card__dates-date">{task.startDate?.toFormat('DD - HH:mm')}</p>
        </div>

        <div class="task-card__dates-end">
          <p class="task-card__dates-title">End Date</p>
          <p class="task-card__dates-date">{task.endDate?.toFormat('DD - HH:mm')}</p>
        </div>
      </div>
    </div>
  );
}
