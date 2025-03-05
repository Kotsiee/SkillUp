import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { User } from "../types/index.ts";
import { getFileUrl } from "./fetchData.ts";
import { getSupabaseClient } from "../supabase/client.ts";

export async function fetchUsers(): Promise<User[] | null> {
    const { data, error } = await getSupabaseClient()
        .from('users')
        .select('*')

    if(error){
        console.log("error was found :( - " + error);
        return null;
    }

    const users: User[] = await Promise.all(
        data.map(async (d) => {
            const profilePic = await getFileUrl(`users/${d.id}/${d.profile_picture}`);

            return {
                id: d.id,
                email: d.primary_email,
                username: d.username,
                firstName: d.first_name,
                lastName: d.last_name,
                profilePicture: {url: profilePic},
                meta: d.meta,
                createdAt: DateTime.fromISO(d.created_at)
            };
        })
    );

    return users;
}

export async function fetchUserByID(id: string): Promise<User | null> {
    const { data, error } = await getSupabaseClient()
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

    if(error){
        console.log("error was found :( - " + error);
        return null;
    }

    const profilePic = await getFileUrl(`users/${data.id}/${data.profile_picture}`);

    const user: User = {
        id: data.id,
        email: data.primary_email,
        username: data.username,
        firstName: data.first_name,
        lastName: data.last_name,
        profilePicture: {url: profilePic},
        meta: data.meta,
        createdAt: DateTime.fromISO(data.created_at)
    }

    return user;
}

export async function fetchUserByUsername(username: string): Promise<User | null> {
    const { data, error } = await getSupabaseClient()
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

    if(error){
        console.log("error was found :( - " + error);
        return null;
    }

    const profilePic = await getFileUrl(`users/${data.id}/${data.profile_picture}`);

    const user: User = {
        id: data.id,
        email: data.primary_email,
        username: data.username,
        firstName: data.first_name,
        lastName: data.last_name,
        profilePicture: {url: profilePic},
        meta: data.meta,
        createdAt: DateTime.fromISO(data.created_at)
    }

    return user;
}

export async function searchUsers(term: string): Promise<User[] | null> {
    const { data, error } = await getSupabaseClient()
        .from('users')
        .select('*')
        .ilike('username', `%${term}%`)

    if(error){
        console.log("error was found :( - " + error);
        return null;
    }

    return data;
}