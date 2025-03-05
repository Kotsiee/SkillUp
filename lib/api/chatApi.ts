// deno-lint-ignore-file no-explicit-any
import { Chat } from "../types/index.ts";
import { ChatType } from "../types/types.ts";
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { fetchChatRolesByChatID } from "./chatRolesApi.ts";
import { fetchTasksByID } from "./taskApi.ts";
import { getSupabaseClient } from "../supabase/client.ts";

export async function fetchChatByID(id: string, simplify?: boolean): Promise<Chat | null> {

    const { data, error } = await getSupabaseClient()
        .from('chats')
        .select('*')
        .eq('id', id)
        .single()

    if(error){
        console.log("fetchChatByID error was found :( - " + error.message);
        return null;
    }

    const chats: Chat = {
        id: data.id,
        chatType: ChatType[data.chat_type as keyof typeof ChatType],
        users: simplify == true ? null : await fetchChatRolesByChatID(data.id, true),
        task: await fetchTasksByID(data.task_id) || null,
        name: data.name,
        meta: data.meta,
        // lastMessage?: Messages,
        photo: null,
        createdAt: DateTime.fromISO(data.created_at)
    }

    return chats;
}

export async function fetchUserChatsByID(userId: string, simplify?: boolean): Promise<Chat[] | null> {
    const { data, error } = await getSupabaseClient()
        .from('chat roles')
        .select('user_id, chat_id(*)')
        .eq('user_id', userId)

    if(error){
        console.log("fetchUserChatsByID: error was found :( - " + error.details);
        return null;
    }

    const chats: Chat[] = await Promise.all(
        data.map(async (d: any) => {
            return {
                id: d.chat_id.id,
                chatType: ChatType[d.chat_id.chat_type as keyof typeof ChatType],
                users: simplify == true ? null : await fetchChatRolesByChatID(d.chat_id.id, true),
                task: await fetchTasksByID(d.task_id) || null,
                name: d.chat_id.name,
                meta: d.chat_id.meta,
                // lastMessage?: Messages,
                photo: null,
                createdAt: DateTime.fromISO(d.chat_id.created_at)
            };
        })
    );

    return chats;
}


export async function fetchUserChatsByProject(id: string, simplify?: boolean): Promise<Chat[] | null> {
    const { data, error } = await getSupabaseClient()
    .from('chats')
    .select('*, tasks!inner(project_id)')
    .eq('tasks.project_id', id);


    if(error){
        console.log("fetchUserChatsByProject: error was found :( - " + error.details);
        return null;
    }

    const chats: Chat[] = await Promise.all(
        data.map(async (d: any) => {
            return {
                id: d.id,
                chatType: ChatType[d.chat_type as keyof typeof ChatType],
                users: simplify == true ? null : await fetchChatRolesByChatID(d.id, true),
                task: await fetchTasksByID(d.task_id) || null,
                name: d.name,
                meta: d.meta,
                // lastMessage?: Messages,
                photo: null,
                createdAt: DateTime.fromISO(d.created_at)
            };
        })
    );

    return chats;
}