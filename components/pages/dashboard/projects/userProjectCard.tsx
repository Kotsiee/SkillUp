import { Project, ProjectRole, Task, Team } from '../../../../lib/newtypes/index.ts';

export function UserProjectCard({
  project,
}: {
  project: {
    project: Project;
    role: ProjectRole;
  };
}) {
  function nextDeadline() {
    const next = project.project
      .jobs!.filter(job => job.status === 'open')
      .map(job => job.endDate)
      .sort((a, b) => a!.diff(b!).as('milliseconds'))[0];
    return next ? next.toFormat('dd LLL yyyy') : 'No deadline';
  }

  console.log('project', project);

  return (
    <div
      class="dashboard__content__projects-content__project-card user-project-card"
      role="group"
      aria-labelledby="project-card-title"
    >
      <a
        class="dashboard__content__projects-content__project-card__header"
        href={`/${project.project.team?.handle}`}
      >
        <img
          src={project.project.team?.logo?.small?.publicURL}
          alt={`${project.project.team?.name ?? 'Team'} logo`}
          class="dashboard__content__projects-content__project-card__logo"
        />
        <div class="dashboard__content__projects-content__project-card__details">
          <h5
            id="project-card-title"
            class="dashboard__content__projects-content__project-card__title"
          >
            {project.project.title}
          </h5>
          <p class="dashboard__content__projects-content__project-card__team">
            {project.project.team?.name}
            <span
              class="dashboard__content__projects-content__project-card__created-date"
              aria-label="Project created date"
            >
              {project.project.createdAt}
            </span>
          </p>
        </div>
      </a>

      <div class="dashboard__content__projects-content__project-card__stats">
        <div
          class="dashboard__content__projects-content__project-card__stat"
          role="group"
          aria-label="Submissions count"
        >
          <p class="dashboard__content__projects-content__project-card__stat-title">Submissions</p>
          <p class="dashboard__content__projects-content__project-card__stat-value">0</p>
          {/* Add dynamic value */}
        </div>

        <div
          class="dashboard__content__projects-content__project-card__stat"
          role="group"
          aria-label="Next deadline"
        >
          <p class="dashboard__content__projects-content__project-card__stat-title">
            Next Deadline
          </p>
          <p class="dashboard__content__projects-content__project-card__stat-value">
            {nextDeadline()}
          </p>
        </div>
      </div>

      <div
        class="dashboard__content__projects-content__project-card__earnings"
        role="contentinfo"
        aria-label="Predicted earnings"
      >
        <p class="dashboard__content__projects-content__project-card__earnings-title">
          Predicted Earnings
        </p>
        <p class="dashboard__content__projects-content__project-card__earnings-value">£0.00</p>
      </div>
    </div>
  );
}
