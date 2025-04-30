// deno-lint-ignore-file no-explicit-any
import { Signal, useSignal } from '@preact/signals';
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { Task } from '../../../../lib/types/index.ts';
import { EditAttachments, EditTextbox } from '../../EditTools.tsx';

interface LayoutProps {
  editableRecord: Signal<Record<string, any> | null>;
  modalRef: any;
  modalSettings: Signal<any>;
  type?: string;
}

interface MetricTemplate {
  [metric: string]: MetricTemplateInner;
}

interface MetricTemplateInner {
  weight: number;
  tasks?: { [taskWeight: string]: number | null };
}

export default function EditJobs({ editableRecord, modalRef, modalSettings, type }: LayoutProps) {
  return (
    <div class="content">
      <link rel="stylesheet" href="/styles/islands/edit/projects/job.css" />
      <h1>New Job</h1>
      <section id="Details">
        <h2>Job Details</h2>

        <EditTextbox account={editableRecord} val="title" placeholder="Title">
          Project Title
        </EditTextbox>

        <EditTextbox account={editableRecord} val="description" placeholder="Description" resize>
          Description
        </EditTextbox>

        <EditAttachments
          modalRef={modalRef}
          modalSettings={modalSettings}
          onAdd={files => {
            editableRecord.value = { ...editableRecord.value, attachments: files };
          }}
        />
      </section>

      <section id="Tasks">
        {/**Task name, description, start date, end date */}
        <h2>Tasks</h2>
        {(editableRecord.value as Task).tasks?.map((task, index) => {
          return <TaskCard key={index} task={task} />;
        })}

        <NewTaskCard editableRecord={editableRecord} />
      </section>

      <section id="Metrics">
        {/**Metric name, priority, assign to (whole job or specific task ) */}
        <h2>Metrics</h2>
        {Object.entries((editableRecord.value as Task).metrics ?? []).map(([name, value]) => {
          return <MetricCard name={name} value={value} />;
        })}

        <NewMetricCard tasks={editableRecord.value!.tasks} editableRecord={editableRecord} />
      </section>
    </div>
  );
}

function NewTaskCard({ editableRecord }: { editableRecord: Signal<Record<string, any> | null> }) {
  const isAdding = useSignal<boolean>(false);
  const now = DateTime.now().plus({ day: 1 });

  const newTask = useSignal<Task>({
    title: '',
    description: '',
    startDate: now,
    endDate: DateTime.now().plus({ month: 1 }),
    budgetAllocated: 0,
  });

  if (!isAdding.value) {
    return (
      <button
        onClick={() => {
          isAdding.value = true;
          newTask.value = {
            title: '',
            description: '',
            startDate: now,
            endDate: DateTime.now().plus({ month: 1 }),
          };
        }}
      >
        + Add Task
      </button>
    );
  }

  return (
    <div>
      <button onClick={() => (isAdding.value = false)}>Cancel</button>
      <div>
        <EditTextbox account={newTask} val="title" placeholder="Title">
          Task Title
        </EditTextbox>

        <EditTextbox account={newTask} val="description" placeholder="Description" resize>
          Task Description
        </EditTextbox>
      </div>

      <div>
        <p>Start / End Date</p>
        <input
          type="datetime-local"
          value={newTask.value!.startDate!.toFormat("yyyy-LL-dd'T'00:00")}
          min={now.toFormat("yyyy-LL-dd'T'00:00")}
        />

        <input
          type="datetime-local"
          value={newTask.value!.endDate!.toFormat("yyyy-LL-dd'T'00:00")}
          min={now.toFormat("yyyy-LL-dd'T'00:00")}
        />
      </div>

      <button
        onClick={() => {
          editableRecord.value = {
            ...editableRecord.value,
            tasks: [...(editableRecord.value!.tasks || []), newTask.value],
          };
          isAdding.value = false;
        }}
      >
        Save
      </button>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div>
      <div>
        <h5>{task.title}</h5>
        <p>{task.description}</p>
      </div>

      <div>
        <p>Start / End Date</p>
        <p>
          {task.startDate?.toFormat('yyyy-LL-dd')} - {task.endDate?.toFormat('yyyy-LL-dd')}
        </p>
      </div>
    </div>
  );
}

function NewMetricCard({
  tasks,
  editableRecord,
}: {
  tasks: Task[];
  editableRecord: Signal<Record<string, any> | null>;
}) {
  const isAdding = useSignal<boolean>(false);
  const newMetric = useSignal<
    MetricTemplateInner & {
      metric: string;
    }
  >({
    metric: '',
    weight: 0,
  });

  if (!isAdding.value) {
    return <button onClick={() => (isAdding.value = true)}>+ Add Metric</button>;
  }

  return (
    <div>
      <button onClick={() => (isAdding.value = false)}>Cancel</button>

      <div>
        <EditTextbox account={newMetric} val="metric" placeholder="Metric">
          Metric
        </EditTextbox>

        <div>
          <h4>Weight</h4>
          <input
            type="range"
            min={1}
            max={10}
            value={newMetric.value.weight}
            onInput={val =>
              (newMetric.value = {
                ...newMetric.value,
                weight: Number.parseInt(val.currentTarget.value),
              })
            }
          />
          <div>
            {tasks.map(task => {
              return (
                <div>
                  <p>{task.title}</p>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={newMetric.value.tasks?.[task.title!] ?? newMetric.value.weight}
                    onInput={val => {
                      newMetric.value = {
                        ...newMetric.value,
                        tasks: {
                          [task.title!]: Number.parseInt(val.currentTarget.value),
                        },
                      };
                    }}
                  />

                  <button
                    onClick={() => {
                      newMetric.value = {
                        ...newMetric.value,
                        tasks: {
                          [task.title!]: null,
                        },
                      };
                    }}
                  >
                    reset
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          isAdding.value = false;
          editableRecord.value = {
            ...editableRecord.value,
            metrics: {
              ...editableRecord.value!.metrics,
              [newMetric.value.metric]: {
                weight: newMetric.value.weight,
                tasks: { ...newMetric.value.tasks },
              },
            },
          };
        }}
      >
        Save
      </button>
    </div>
  );
}

function MetricCard({ name, value }: { name: string; value: MetricTemplateInner }) {
  return (
    <div>
      <h2>{name}</h2>
      <h2>{value.weight}</h2>
    </div>
  );
}
