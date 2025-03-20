// deno-lint-ignore-file no-explicit-any
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { Chat } from "../../types/index.ts";
import { supabase } from "../../supabase/client.ts";
import { fetchChatRolesByChatID } from "./chatRoles.ts";
import { fetchTasksByID } from "../projects/tasks.ts";

export async function fetchChatByID(id: string, simplify?: boolean): Promise<Chat | null> {

    const { data, error } = await supabase
        .from("messages.chats")
        .select('*')
        .eq('id', id)
        .single()

    if(error){
        console.log("fetchChatByID error was found :( - " + error.message);
        return null;
    }

    const chats: Chat = {
        id: data.id,
        chatType: data.chat_type,
        users: simplify == true ? undefined : await fetchChatRolesByChatID(data.id, true) ?? undefined,
        task: await fetchTasksByID(data.task_id) ?? undefined,
        name: data.name,
        meta: data.meta,
        // lastMessage?: Messages,
        photo: undefined,
        createdAt: DateTime.fromISO(data.created_at)
    }

    return chats;
}

export async function fetchUserChatsByID(userId: string, simplify?: boolean): Promise<Chat[] | null> {
    const { data, error } = await supabase
        .from("chat roles")
        .select('user_id, chat_id(*), chats!inner(chat_type)')
        .eq('user_id', userId)
        .eq('chats.chat_type', 'private_chat')

    if(error){
        console.log("fetchUserChatsByID: error was found :( - " + error.message);
        return null;
    }

    const chats: Chat[] = await Promise.all(
        data.map(async (d: any) => {
            return {
                id: d.chat_id.id,
                chatType: d.chat_id.chat_type,
                users: simplify == true ? undefined : await fetchChatRolesByChatID(d.chat_id.id, true) ?? undefined,
                task: await fetchTasksByID(d.task_id) ?? undefined,
                name: d.chat_id.name,
                meta: d.chat_id.meta,
                photo: undefined,
                createdAt: DateTime.fromISO(d.chat_id.created_at)
            };
        })
    );

    return chats;
}


export async function fetchUserChatsByProject(id: string, simplify?: boolean): Promise<Chat[] | null> {
    const { data, error } = await supabase
    .from("messages.chats")
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
                chatType: d.chat_type,
                users: simplify == true ? undefined : await fetchChatRolesByChatID(d.id, true) ?? undefined,
                task: await fetchTasksByID(d.task_id) ?? undefined,
                name: d.name,
                meta: d.meta,
                // lastMessage?: Messages,
                photo: undefined,
                createdAt: DateTime.fromISO(d.created_at)
            };
        })
    );

    return chats;
}