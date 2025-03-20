import { JSX } from "preact/jsx-runtime";
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import AIcon from "../Icons.tsx";
import { Icons } from "../Icons.tsx";

export function ProjectCard(props: JSX.HTMLAttributes<HTMLDivElement> & { project: Project, query: string }) {
  const calculateTimeDifference = () => {
    if (!props.project) return { value: 0, unit: "Minutes" };
    const date = DateTime.fromISO(props.project.createdAt.toString());
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

  return (
    <div class={`projectCard ${props.class}`} >
      <a
      href={`/explore/projects?project=${props.project.id}&${props.query}`} 
      f-partial={`/partials/explore/project?project=${props.project.id}&${props.query}`} 
      f-preserve-scroll
      >
        <div class="projectCard-container">
            <div class="title-container">
              <div class="title-container-right">
                <img class="logo" src={props.project.organisation.logo} loading="lazy" alt={`${props.project.organisation.name} logo`}/>
                <div>
                  <h4 class="title">{props.project.title}</h4>
                  <p class="org">{props.project.organisation.name}<b> • Posted {timeValue} {timeUnit} ago</b></p>
                </div>
              </div>
            </div>

            <div class="description-container">
                <p class="description">{props.project.description}</p>
                <ul class="tasks">
                  { props.project.tasks?.map((task, index) => ( <li key={index}>{task.title}</li> )) }
                </ul>
            </div>

            <div class="details-container">
              <hr />
              <div className="deets">
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
      </a>
      <div className="save">
        <AIcon startPaths={Icons.Save} size={20} className="save-icon"/>
      </div>
    </div>
  );
}