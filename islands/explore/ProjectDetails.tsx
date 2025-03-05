import { useSignal } from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js';
import { JSX } from "preact/jsx-runtime";
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Project } from "../../lib/types/index.ts";
import { useEffect, useState } from "preact/hooks";

export function ProjectDetails( props: JSX.HTMLAttributes<HTMLDivElement> & { project: Project | null }) {
  const [project, setProject] = useState<Project | null>(props.project);
  const currentTask = useSignal<string>("");
  const currentDesc = useSignal<string | undefined>("");

  useEffect(() => {
    if (!project) {
      fetch("/api/projects")
        .then((res) => res.json())
        .then((data) => setProject(data[0]))
        .catch((err) => console.error("Failed to fetch project:", err));
    }
  }, [project]);

  useEffect(() => {
    if (project) {
      currentTask.value = `task-overview-${project.id}`;
      currentDesc.value = project.description;
    }
  }, [project]);

  const calculateTimeDifference = () => {
    if (!project) return { value: 0, unit: "Minutes" };
    const date = DateTime.fromISO(project.createdAt.toString());
    const diff = Math.abs(date.diffNow().as("minutes"));

    if (diff > 1440) {
      const days = Math.floor(diff / 1440);
      if (days > 7) {
        return { value: Math.floor(days / 7), unit: "Weeks" };
      }
      return { value: days, unit: "Days" };
    } else if (diff > 60) {
      return { value: Math.floor(diff / 60), unit: "Hours" };
    } else {
      return { value: Math.floor(diff), unit: "Minutes" };
    }
  };

  const { value: timeValue, unit: timeUnit } = calculateTimeDifference();

  const handleTaskChange = (taskId: string, description: string | undefined) => {
    currentTask.value = taskId;
    currentDesc.value = description;
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div class={`projectDetails ${props.class}`}>
      <div class="projectCard-container">
        <div class="title-container">
          <div class="title-container-right">
            <img
              class="logo"
              src={project.organisation.logo}
              loading="lazy"
              alt={`${project.organisation.name} logo`}
            />
            <div>
              <h2 class="title">{project.title}</h2>
              <p class="org">
                {project.organisation.name}
                <b> • Posted {timeValue} {timeUnit} ago</b>
              </p>
            </div>
          </div>
          <div class="actions">
            <a class="join">Join</a>
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
                  onChange={() =>
                    handleTaskChange(`task-overview-${project.id}`, project.description )
                  }
                  checked={
                    currentTask.value === `task-overview-${project.id}`
                  }
                  hidden
                />
                <label for={`task-overview-${project.id}`}>Overview</label>
              </li>

              {project.tasks?.map((task) => (
                <li key={task.id}>
                  <input
                    type="radio"
                    class="selectTask"
                    name={`selectTask-${project.id}`}
                    id={`task-${task.id}`}
                    value={`task-${task.id}`}
                    onChange={() => handleTaskChange(`task-${task.id}`, task.description) }
                    checked={currentTask.value === `task-${task.id}`}
                    hidden
                  />
                  <label for={`task-${task.id}`}>{task.title}</label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div class="description-container">
          <p class="description">{currentDesc.value}</p>
        </div>

        <div class="details-container">
          <hr />
          <div className="container">
            <div>
              <p className="title">Budget</p>
              <p className="info">£100</p>
            </div>
            <div>
              <p className="title">Duration</p>
              <p className="info">6 Months</p>
            </div>
            <div>
              <p className="title">Contributors</p>
              <p className="info">34</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}