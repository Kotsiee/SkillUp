// deno-lint-ignore-file no-explicit-any
import { Project } from '../../../../lib/newtypes/index.ts';
import AIcon, { Icons } from '../../../Icons.tsx';
import { UserProjectCard } from '../projects/userProjectCard.tsx';

export default function DashboardUserProjects({ projects }: { projects: Project[] }) {
  return (
    <div class="dashboard__content__projects">
      <h4 class="dashboard__content__projects-title dashboard__content-title">Projects</h4>
      {/*Change Views*/}
      <div class="dashboard__content__projects-content">
        <div class="dashboard__content__projects-content-views">
          <div class="dashboard__content__projects-content__history">
            <label class="dashboard__content__projects-content__history-input">
              <input type="radio" name="projects-history" value="ongoing" checked hidden />
              Ongoing
            </label>
            <label class="dashboard__content__projects-content__history-input">
              <input type="radio" name="projects-history" value="completed" hidden />
              Completed
            </label>
          </div>
          <div class="dashboard__content__projects-content__views">
            <label class="dashboard__content__projects-content__views-input">
              <input type="radio" name="projects-views" value="ongoing" checked hidden />
              <AIcon startPaths={Icons.Grid} />
            </label>
            <label class="dashboard__content__projects-content__views-input">
              <input type="radio" name="projects-views" value="completed" hidden />
              <AIcon startPaths={Icons.Table} />
            </label>
          </div>
        </div>
        {/*View Projects*/}
        <div class="dashboard__content__projects-content__projects">
          {projects.map((project: any) => (
            <UserProjectCard project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
