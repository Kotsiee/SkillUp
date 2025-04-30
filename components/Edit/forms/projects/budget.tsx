import { Signal, useSignal } from '@preact/signals';
import { Project, Task } from '../../../../lib/types/index.ts';
import AIcon, { Icons } from '../../../Icons.tsx';
import LabelSlider from '../../../UI/Sliders/LabelSlider.tsx';
import { formatWithCommas } from '../../../../lib/utils/math.ts';

export function Budget({ project }: { project: Signal<Project> }) {
  return (
    <div class="budget">
      <h2 class="budget-title">Budget</h2>

      <div class="set-budgets">
        {(project.value as Project).jobs?.map(job => (
          <BudgetCard key={job.id} project={project} job={job} />
        ))}
      </div>

      <div class="total-budget">
        <p>Total Budget</p>
        <h3>
          £
          {formatWithCommas(
            project.value.jobs?.reduce((sum, job) => sum + (job.budgetAllocated ?? 0), 0) || 0
          )}
        </h3>
      </div>
    </div>
  );
}

function BudgetCard({ project, job, task }: { project: Signal<Project>; job: Task; task?: Task }) {
  if (!project.value) return null;

  const budget = useSignal<number>(task?.budgetAllocated || job.budgetAllocated || 0);
  const hasSubTasks = job.tasks && job.tasks.length > 0;
  const isLeaf = !!task || !hasSubTasks;
  const title = task?.title || job.title;

  const hideChildren = useSignal<boolean>(false);

  const saveBudget = () => {
    const newJob = job;
    if (task) {
      newJob.budgetAllocated = 0;
      newJob.tasks?.map(thisTask => {
        if (task.id === thisTask.id) {
          thisTask.budgetAllocated = budget.value;
        }

        newJob.budgetAllocated! += thisTask.budgetAllocated!;
        return thisTask;
      });
    } else {
      newJob.budgetAllocated = budget.value;
    }

    project.value = {
      ...project.value,
      jobs: project.value.jobs?.map(thisJob => {
        if (job.id === thisJob.id) return newJob;
        return thisJob;
      }),
    };
  };

  return (
    <div class={`sub-budget ${task ? 'task-budget' : 'job-budget'}`}>
      <div class="budget-content">
        {isLeaf ? (
          <p class="budget-title">{title}</p>
        ) : (
          <label class="budget-title">
            <input type="checkbox" hidden />
            <AIcon
              startPaths={Icons.UpChevron}
              endPaths={Icons.DownChevron}
              onClick={state => {
                hideChildren.value = !state;
              }}
              initalState={false}
              size={20}
              className="budget-title-icon"
            />
            <p>{job.title}</p>
          </label>
        )}

        {isLeaf ? (
          <div className="set-budget">
            <div className="budget-setter">
              <LabelSlider
                value={budget}
                min={0}
                max={999999999999}
                steps={5}
                onValInput={val => {
                  budget.value = val;
                  saveBudget();
                }}
              >
                £
              </LabelSlider>
              <input
                type="number"
                value={budget.value}
                min={0}
                max={999999999999}
                step={0.01}
                placeholder="0.00"
                onInput={e => {
                  budget.value = Number.parseFloat(e.currentTarget.value);
                  saveBudget();
                }}
                onBlur={() => {
                  budget.value = Math.round(budget.value * 100) / 100;
                }}
              />
            </div>
          </div>
        ) : (
          <p>£{formatWithCommas(job.budgetAllocated || 0)}</p>
        )}
      </div>

      {!isLeaf && (
        <div class="sub-sub-budgets" hidden={hideChildren.value}>
          {job.tasks!.map(subTask => (
            <BudgetCard key={subTask.id} project={project} job={job} task={subTask} />
          ))}
        </div>
      )}
    </div>
  );
}
