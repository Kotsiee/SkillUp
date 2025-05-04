import { Project, ProjectRole, Task } from '../../../lib/newtypes/index.ts';
import { useSignal } from '@preact/signals';
import { TimeAgo } from '../../../lib/utils/time.ts';
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { formatWithCommas } from '../../../lib/utils/math.ts';
import { useUser } from '../../contexts/UserProvider.tsx';

export function ProjectDetails({
  project,
  className,
  userProjects,
}: {
  project: Project | null;
  className?: string;
  userProjects: ProjectRole[];
}) {
  if (!project) return <div>Loading...</div>;

  const currentTask = useSignal<Task | 'overview'>('overview');
  const { value: timeValue, unit: timeUnit } = TimeAgo(project?.createdAt ?? DateTime.now());
  const { value: timeValue1, unit: timeUnit1 } = TimeAgo(
    project?.startDate ?? DateTime.now(),
    project?.endDate
  );

  async function handleJoin() {
    await fetch(`/api/projects/${project!.id}/newRole`, {
      method: 'POST',
    });
  }

  return (
    <div class={`projectDetails ${className}`}>
      <div class="projectCard-container">
        <div class="title-container">
          <div class="title-container-right">
            <img
              class="logo"
              src={project.team?.logo?.med?.publicURL}
              loading="lazy"
              alt={`${project.team?.name} logo`}
            />
            <div>
              <h2 class="title">{project.title}</h2>
              <p class="org">
                {project.team?.name}
                <b>
                  {' '}
                  • Posted {timeValue} {timeUnit} ago
                </b>
              </p>
            </div>
          </div>
          <div class="actions">
            {userProjects.findIndex(p => p.project === project.id) === -1 ? (
              <button
                class="join"
                onClick={() => {
                  handleJoin();
                }}
              >
                Join
              </button>
            ) : null}
          </div>
          <div>
            <ul class="tasks">
              <li>
                <input
                  type="radio"
                  class="selectTask"
                  name={`selectTask-${project.id}`}
                  id={`task-overview-${project.id}`}
                  value={`task-overview-${project.id}`}
                  onInput={() => (currentTask.value = 'overview')}
                  checked={currentTask.value === 'overview'}
                  hidden
                />
                <label for={`task-overview-${project.id}`}>Overview</label>
              </li>

              {project.jobs?.map(task => (
                <li key={task.id}>
                  <input
                    type="radio"
                    class="selectTask"
                    name={`selectTask-${project.id}`}
                    id={`task-${task.id}`}
                    value={`task-${task.id}`}
                    onInput={() => (currentTask.value = task)}
                    checked={(currentTask.value as Task).id === task.id}
                    hidden
                  />
                  <label for={`task-${task.id}`}>{task.title}</label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div class="description-container">
          <p class="description">
            {(currentTask.value as Task).description ?? project.description}
          </p>
        </div>

        <div class="details-container">
          <hr />
          <div className="container">
            <div>
              <p className="title">Budget</p>
              <p className="info">£{formatWithCommas(project.totalBudget || 0)}</p>
            </div>
            <div>
              <p className="title">Duration</p>
              <p className="info">
                {timeValue1} {timeUnit1}
              </p>
            </div>
            <div>
              <p className="title">Submissions</p>
              <p className="info">{project.meta?.no_submissions || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
