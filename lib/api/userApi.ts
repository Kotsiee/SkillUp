import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { User } from "../types/index.ts";
import { fetchFileByPath, getFileUrl } from "./filesApi.ts";
import { getSupabaseClient } from "../supabase/client.ts";

export async function fetchUsers(): Promise<User[] | null> {
  const { data, error } = await getSupabaseClient()
    .from("users")
    .select("*");

  if (error) {
    console.log("error was found :( - " + error);
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
        createdAt: DateTime.fromISO(d.created_at),
      };

      const ppSmall = await fetchFileByPath(
        newUser.id,
        `profile/avatar`,
        "pp32.webp",
      );
      const ppMed = await fetchFileByPath(
        newUser.id,
        `profile/avatar`,
        "pp128.webp",
      );
      const ppLarge = await fetchFileByPath(
        newUser.id,
        `profile/avatar`,
        "pp512.webp",
      );

      newUser.profilePicture = { small: ppSmall, med: ppMed, large: ppLarge };

      return newUser;
    }),
  );

  return users;
}

export async function fetchUserByID(id: string): Promise<User | null> {
  const { data, error } = await getSupabaseClient()
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log("error was found :( - " + error);
    return null;
  }

  const user: User = {
    id: data.id,
    email: data.primary_email,
    username: data.username,
    firstName: data.first_name,
    lastName: data.last_name,
    meta: data.meta,
    createdAt: DateTime.fromISO(data.created_at),
  };

  const ppSmall = await fetchFileByPath(user.id, `profile/avatar`, "pp32.webp");
  const ppMed = await fetchFileByPath(user.id, `profile/avatar`, "pp128.webp");
  const ppLarge = await fetchFileByPath(user.id, `profile/avatar`, "pp512.webp");

  user.profilePicture = { small: ppSmall, med: ppMed, large: ppLarge };

  return user;
}

export async function fetchUserByUsername(
  username: string,
): Promise<User | null> {
  const { data, error } = await getSupabaseClient()
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.log("error was found :( - " + error);
    return null;
  }

  const user: User = {
    id: data.id,
    email: data.primary_email,
    username: data.username,
    firstName: data.first_name,
    lastName: data.last_name,
    meta: data.meta,
    createdAt: DateTime.fromISO(data.created_at),
  };

  const ppSmall = await fetchFileByPath(user.id, `profile/avatar`, "pp32.webp");
  const ppMed = await fetchFileByPath(user.id, `profile/avatar`, "pp128.webp");
  const ppLarge = await fetchFileByPath(user.id, `profile/avatar`, "pp512.webp");

  user.profilePicture = { small: ppSmall, med: ppMed, large: ppLarge };

  return user;
}

export async function searchUsers(term: string): Promise<User[] | null> {
  const { data, error } = await getSupabaseClient()
    .from("users")
    .select("*")
    .ilike("username", `%${term}%`);

  if (error) {
    console.log("error was found :( - " + error);
    return null;
  }

  return data;
}
