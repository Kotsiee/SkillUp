import { Project } from "../types/project.ts";
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { fetchOrganisationByID } from "./organisationApi.ts";
import { fetchTasksByProject } from "./taskApi.ts";
import { getSupabaseClient } from "../supabase/client.ts";

export async function fetchProjects(searchValue?: string | null): Promise<Project[] | null> {
  const search = searchValue ? searchValue : "" 

  const { data, error } = await getSupabaseClient()
    .from("projects")
    .select("*")
    .or(
      `title.ilike.%${search}%,description.ilike.%${search}%`
    )

  if (error) {
    console.log("error was found :( - " + data);
    return null;
  }

  const projects: Project[] = await Promise.all(
    data.map(async (d) => {
      const org = await fetchOrganisationByID(d.organization_id);

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
    const { data, error } = await getSupabaseClient()
        .from('projects')
        .select('*')
        .eq('id', id)

    if(error){
        console.log("error was found :( - " + error);
        return null;
    }

    const projects: Project[] = await Promise.all(
        data.map(async (d) => {
            const attachments: string[] = d.attachments;

            return {
                id: d.id,
                organisation: await fetchOrganisationByID(d.organization_id),
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