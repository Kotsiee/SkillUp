import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { User } from "../../types/index.ts";
import { supabase } from "../../supabase/client.ts";
import { fetchTeamsByUser } from "../teams/teamRoles.ts";
import { fetchFileByPath } from "../files/file.ts";

export async function fetchUsers(): Promise<User[] | null> {
  const { data, error } = await supabase
  .schema("users")
    .from("users")
    .select("*");

  if (error) {
    console.log("fetchUsers: error was found :( - " + error.message);
    return null;
  }

  const users: User[] = await Promise.all(
    data.map(async (d) => {
      const newUser: User = {
        id: d.id,
        email: d.primary_email,
        username: d.username,
        firstName: d.first_name,
        lastName: d.last_name,
        meta: d.meta,
        teams: await fetchTeamsByUser(d.id) ?? undefined,
        createdAt: DateTime.fromISO(d.created_at),
      };

      const ppSmall = await fetchFileByPath(
        newUser.id,
        `profile/avatar`,
        "ppSmall.webp",
      );
      const ppMed = await fetchFileByPath(
        newUser.id,
        `profile/avatar`,
        "ppMed.webp",
      );
      const ppLarge = await fetchFileByPath(
        newUser.id,
        `profile/avatar`,
        "ppLarge.webp",
      );

      newUser.profilePicture = { small: ppSmall, med: ppMed, large: ppLarge };

      return newUser;
    }),
  );

  return users;
}

export async function fetchUserByID(id: string): Promise<User | null> {
  const { data, error } = await supabase
  .schema("users")
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log("fetchUserByID: error was found :( - " + error.message);
    return null;
  }

  const user: User = {
    id: data.id,
    email: data.primary_email,
    username: data.username,
    firstName: data.first_name,
    lastName: data.last_name,
    meta: data.meta,
    teams: await fetchTeamsByUser(data.id) ?? undefined,
    createdAt: DateTime.fromISO(data.created_at),
  };

  const ppSmall = await fetchFileByPath(user.id, `profile/avatar`, "ppSmall.webp");
  const ppMed = await fetchFileByPath(user.id, `profile/avatar`, "ppMed.webp");
  const ppLarge = await fetchFileByPath(user.id, `profile/avatar`, "ppLarge.webp");

  user.profilePicture = { small: ppSmall, med: ppMed, large: ppLarge };

  return user;
}

export async function fetchUserByUsername(
  username: string,
): Promise<User | null> {
  const { data, error } = await supabase
  .schema("users")
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.log("fetchUserByUsername: error was found :( - " + error.message);
    return null;
  }

  const user: User = {
    id: data.id,
    email: data.primary_email,
    username: data.username,
    firstName: data.first_name,
    lastName: data.last_name,
    meta: data.meta,
    teams: await fetchTeamsByUser(data.id) ?? undefined,
    createdAt: DateTime.fromISO(data.created_at),
  };

  const ppSmall = await fetchFileByPath(user.id, `profile/avatar`, "ppSmall.webp");
  const ppMed = await fetchFileByPath(user.id, `profile/avatar`, "ppMed.webp");
  const ppLarge = await fetchFileByPath(user.id, `profile/avatar`, "ppLarge.webp");

  user.profilePicture = { small: ppSmall, med: ppMed, large: ppLarge };

  return user;
}

export async function searchUsers(term: string): Promise<User[] | null> {
  const { data, error } = await supabase
    .from("users.users")
    .select("*")
    .ilike("username", `%${term}%`);

  if (error) {
    console.log("error was found :( - " + error);
    return null;
  }

  return data;
}
