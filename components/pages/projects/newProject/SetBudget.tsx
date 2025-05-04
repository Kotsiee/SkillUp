import { Signal, useSignal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';
import CurrencyField from '../../../UI/Fields/CurrencyField.tsx';
import { Task } from '../../../../lib/newtypes/index.ts';
import { formatWithCommas } from '../../../../lib/utils/math.ts';

export default function SetBudgets({
  jobs,
  ...props
}: {
  jobs: Signal<Task[]>;
} & JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} class={`set-budgets ${props.class || ''}`}>
      <div class="set-budgets-list">
        {jobs.value.map(job => (
          <JobBudgetRow key={job.id} job={job} jobs={jobs} />
        ))}
      </div>

      <p class="set-budgets-totalbudget">
        <span class="set-budgets-totalbudget-currency">£</span>
        {formatWithCommas(
          jobs.value.reduce((sum, job) => sum + (job.budgetAllocated || 0), 0) || 0
        )}
      </p>
    </div>
  );
}

function JobBudgetRow({ job, jobs }: { job: Task; jobs: Signal<Task[]> }) {
  const budget = useSignal(job.budgetAllocated || 0);

  return (
    <div class="job-budget">
      <div class="job-budget-row">
        <p class="job-budget-row-title">{job.title}</p>

        {job.tasks && job.tasks.length > 0 ? (
          <p class="job-budget-row-totalbudget">
            <span class="job-budget-currency">£</span>
            {formatWithCommas(job.budgetAllocated || 0)}
          </p>
        ) : (
          <CurrencyField
            val={budget}
            onValInput={val => {
              jobs.value = jobs.value.map(j =>
                j.id === job.id ? { ...j, budgetAllocated: val } : j
              );
            }}
          />
        )}
      </div>

      {job.tasks && job.tasks.length > 0 && (
        <div class="job-budget-row__tasks">
          {job.tasks.map(task => (
            <TaskBudgetRow key={task.id} task={task} job={job} jobs={jobs} />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskBudgetRow({ task, job, jobs }: { task: Task; job: Task; jobs: Signal<Task[]> }) {
  const taskBudget = useSignal(task.budgetAllocated || 0);

  return (
    <div class="task-budget-row">
      <p class="task-budget-row-title">{task.title}</p>
      <CurrencyField
        val={taskBudget}
        onValInput={val => {
          jobs.value = jobs.value.map(j => {
            if (j.id === job.id) {
              const updatedTasks = j.tasks!.map(t =>
                t.id === task.id ? { ...t, budgetAllocated: val } : t
              );

              return {
                ...j,
                tasks: updatedTasks,
                budgetAllocated: updatedTasks.reduce((sum, t) => sum + (t.budgetAllocated || 0), 0),
              };
            }
            return j;
          });
        }}
      />
    </div>
  );
}
