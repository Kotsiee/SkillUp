import AIcon from '../Icons.tsx';
import { Icons } from '../Icons.tsx';
import { Project } from '../../lib/types/index.ts';
import { formatWithCommas } from '../../lib/utils/math.ts';
import { TimeAgo } from '../../lib/utils/time.ts';
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { Signal } from '@preact/signals';

export function ProjectCard({
  project,
  query,
  className,
  currentProject,
}: {
  className?: string;
  project: Project;
  query: string;
  currentProject: Signal<Project | null>;
}) {
  const { value: timeValue, unit: timeUnit } = TimeAgo(project.createdAt ?? DateTime.now());

  return (
    <div class={`projectCard ${className}`}>
      <a
        href={`/explore/projects?project=${project.id}&${query}`}
        f-partial={`/explore/partials/projects?project=${project.id}&${query}`}
        f-preserve-scroll
        onClick={() => {
          currentProject.value = project;
        }}
      >
        <div class="projectCard-container">
          <div class="title-container">
            <div class="title-container-right">
              <img
                class="logo"
                src={project.team?.logo?.small?.publicURL}
                loading="lazy"
                alt={`${project.team?.name} logo`}
              />
              <div>
                <h4 class="title">{project.title}</h4>
                <p class="org">
                  {project.team?.name}
                  <b>
                    {' '}
                    • Posted {timeValue} {timeUnit} ago
                  </b>
                </p>
              </div>
            </div>
          </div>

          <div class="description-container">
            <p class="description">{project.description}</p>
            <ul class="tasks">
              {project.jobs?.map((task, index) => (
                <li key={index}>{task.title}</li>
              ))}
            </ul>
          </div>

          <div class="details-container">
            <hr />
            <div className="deets">
              <div>
                <p className="title">Budget</p>
                <p className="info">£{formatWithCommas(project.totalBudget || 0)}</p>
              </div>

              <div>
                <p className="title">Duration</p>
                <p className="info">6 Months</p>
              </div>

              <div>
                <p className="title">Submissions</p>
                <p className="info">{project.meta?.no_submissions || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </a>
      <div className="save">
        <AIcon startPaths={Icons.Save} size={20} className="save-icon" />
      </div>
    </div>
  );
}
