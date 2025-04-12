import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { supabase } from "../../supabase/client.ts";
import { ProjectRole } from "../../types/index.ts";
import { fetchUserByID } from "../user/user.ts";
import { fetchProjectByID } from "./projects.ts";

export async function fetchProjectRoleByID(
  id: string,
): Promise<ProjectRole | null> {
  const { data, error } = await supabase
    .schema("projects")
    .from("roles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log("fetchProjectRoleByID: error was found :( - " + error.message);
    return null;
  }

  const roles: ProjectRole = {
    id: data.id,
    project: await fetchProjectByID(data.project_id),
    user: await fetchUserByID(data.user_id),
    createdAt: DateTime.fromISO(data.created_at),
  };

  return roles;
}

export async function fetchProjectRoleByProject(
  id: string,
): Promise<ProjectRole[] | null> {
  const { data, error } = await supabase
    .schema("projects")
    .from("roles")
    .select("*")
    .eq("project_id", id);

  if (error) {
    console.log(
      "fetchProjectRoleByProject: error was found :( - " + error.message,
    );
    return null;
  }

  const roles: ProjectRole[] = await Promise.all(
    data.map(async (d) => {
      return {
        id: d.id,
        project: await fetchProjectByID(d.project_id),
        user: await fetchUserByID(d.user_id),
        createdAt: DateTime.fromISO(d.created_at),
      };
    }),
  );

  return roles;
}

export async function fetchProjectRoleByUser(
  id: string,
): Promise<ProjectRole[] | null> {
  const { data, error } = await supabase
    .schema("projects")
    .from("roles")
    .select("*")
    .eq("user_id", id);

  if (error) {
    console.log(
      "fetchProjectRoleByUser: error was found :( - " + error.message,
    );
    return null;
  }

  const roles: ProjectRole[] = await Promise.all(
    data.map(async (d) => {
      return {
        id: d.id,
        project: await fetchProjectByID(d.project_id),
        user: await fetchUserByID(d.user_id),
        createdAt: DateTime.fromISO(d.created_at),
      };
    }),
  );

  return roles;
}
