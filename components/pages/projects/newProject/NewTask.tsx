import { Signal, useSignal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';
import { jsonTag, Task } from '../../../../lib/newtypes/index.ts';
import TaskCard from './TaskCard.tsx';
import TextField from '../../../UI/Fields/TextField.tsx';
import RichTextField from '../../../UI/Fields/RichTextField.tsx';
import DateField from '../../../UI/Fields/DateField.tsx';
import { DateTime } from 'https://esm.sh/luxon@3.5.0';

export default function NewTask({
  tasks,
  ...props
}: {
  tasks: Signal<Task[]>;
} & JSX.HTMLAttributes<HTMLDivElement>) {
  const openCreateTask = useSignal<boolean>(false);

  return (
    <div {...props} class={`input-field input-field--task ${props.class}`}>
      <div class="input-field--tasks__uploads">
        {tasks.value.map((task, index) => {
          return <TaskCard key={index} task={task} />;
        })}
      </div>

      <CreateTask open={openCreateTask} tasks={tasks} />

      <button
        class="input-field--task-open"
        onClick={() => {
          openCreateTask.value = true;
        }}
        hidden={openCreateTask.value}
      >
        + Add Task
      </button>
    </div>
  );
}

function CreateTask({ open, tasks }: { open: Signal<boolean>; tasks: Signal<Task[]> }) {
  const title = useSignal<string>('');
  const description = useSignal<jsonTag | null>(null);
  const now = DateTime.now().plus({ day: 1 });
  const startDate = useSignal<string>(now.toFormat("yyyy-LL-dd'T'00:00"));
  const endDate = useSignal<string>(now.plus({ month: 1 }).toFormat("yyyy-LL-dd'T'00:00"));

  if (!open.value) {
    title.value = '';
    description.value = null;
    startDate.value = now.toFormat("yyyy-LL-dd'T'00:00");
    endDate.value = now.plus({ month: 1 }).toFormat("yyyy-LL-dd'T'00:00");
    return null;
  }

  return (
    <div class="create-task">
      <TextField val={title} placeholder="Task Title">
        Title
      </TextField>
      <RichTextField val={description}>Description</RichTextField>

      <div class="create-task-dates">
        <DateField val={startDate} min={now.toFormat("yyyy-LL-dd'T'00:00")}>
          Start Date
        </DateField>
        <DateField val={endDate} min={startDate.value ?? now.toFormat("yyyy-LL-dd'T'00:00")}>
          End Date
        </DateField>
      </div>

      <div class="create-task-actions">
        <button
          class="create-task-save"
          onClick={() => {
            tasks.value = [
              ...tasks.value,
              {
                id: crypto.randomUUID(),
                title: title.value,
                description: description.value ? description.value : undefined,
                startDate: DateTime.fromFormat(startDate.value, "yyyy-LL-dd'T'00:00"),
                endDate: DateTime.fromFormat(endDate.value, "yyyy-LL-dd'T'00:00"),
              },
            ];

            open.value = false;
          }}
        >
          Save Task
        </button>

        <button
          class="create-task-cancel"
          onClick={() => {
            open.value = false;
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
