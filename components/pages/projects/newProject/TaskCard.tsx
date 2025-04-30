import { jsonTag, Task } from '../../../../lib/newtypes/index.ts';
import RichText from '../../../UI/RichText.tsx';

interface ITaskCard {
  task: Task;
  onRemove?: (e?: any) => void;
  onSelect?: (e?: any) => void;
}

export default function TaskCard({ task, onRemove, onSelect }: ITaskCard) {
  return (
    <div class="task-card">
      <p class="task-card-title">{task.title}</p>
      {task.description && (
        <RichText class="task-card-description" jsonText={task.description as jsonTag} />
      )}
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
