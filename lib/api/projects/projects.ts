import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Project } from "../../types/index.ts";
import { supabase } from "../../supabase/client.ts";
import { fetchTasksByProject } from "./tasks.ts";
import { fetchTeamByID } from "../teams/teams.ts";

export async function fetchProjects(searchValue?: string | null): Promise<Project[] | null> {
  const search = searchValue ? searchValue : "" 

  const { data, error } = await supabase
    .from("projects.projects")
    .select("*")
    .or(
      `title.ilike.%${search}%,description.ilike.%${search}%`
    )

  if (error) {
    console.log("fetchProjects: error was found :( - " + error.message);
    return null;
  }

  const projects: Project[] = await Promise.all(
    data.map(async (d) => {
      const org = await fetchTeamByID(d.team_id);

      return {
        id: d.id,
        organisation: org!,
        title: d.title,
        description: d.description,
        status: d.status,
        meta: d.meta,
        attachments: d.attachments,
        tasks: await fetchTasksByProject(d.id),
        createdAt: DateTime.fromISO(d.created_at)
      };
    })
  );

  return projects;
}

export async function fetchProjectByID(id: string): Promise<Project | null> {
    const { data, error } = await supabase
        .from("projects.projects")
        .select('*')
        .eq('id', id)

    if(error){
        console.log("fetchProjectByID: error was found :( - " + error.message);
        return null;
    }

    const projects: Project[] = await Promise.all(
        data.map(async (d) => {
            return {
                id: d.id,
                organisation: await fetchTeamByID(d.team_id),
                title: d.title,
                description: d.description,
                status: d.status,
                meta: d.meta,
                attachments: d.attachments,
                tasks: await fetchTasksByProject(d.id),
                createdAt: DateTime.fromISO(d.created_at)
            };
        })
    );

    return projects[0];
}