import { getSupabaseClient } from "../supabase/client.ts";
import { ChatRoles, Roles } from "../types/index.ts";
import { fetchChatByID } from "./chatApi.ts";
import { fetchUserByID } from "./userApi.ts";
import { DateTime } from "https://esm.sh/luxon@3.5.0";

export async function fetchChatRole(userId: string, chatId: string, simplify?: boolean): Promise<ChatRoles | null> {
    const { data, error } = await getSupabaseClient()
        .from('chat roles')
        .select('*, chat_id(*)')
        .eq('user_id', userId)
        .eq('chat_id', chatId)
        .single()

    if(error){
        console.log("fetchChatRole: error was found :( - " + error.cause);
        return null;
    }

    const chatRole: ChatRoles = {
        id: data.id,
        user: await fetchUserByID(data.user_id),
        chat: simplify == true ? null : await fetchChatByID(data.chat_id),
        role: Roles[data.role as keyof typeof Roles],
        joinedAt: DateTime.fromISO(data.joined_at)
    }

    return chatRole;
}

export async function fetchChatRolesByUserID(userId: string, simplify?: boolean): Promise<ChatRoles[] | null> {
    const { data, error } = await getSupabaseClient()
        .from('chat roles')
        .select('*')
        .eq('user_id', userId)

    if(error){
        console.log("fetchChatRolesByUserID: error was found :( - " + error);
        return null;
    }

    const chatRoles: ChatRoles[] = await Promise.all(
        data.map(async (d) => {
            return {
                id: d.id,
                user: await fetchUserByID(d.user_id),
                chat: simplify == true ? null : await fetchChatByID(d.chat_id),
                role: Roles[d.role as keyof typeof Roles],
                joinedAt: DateTime.fromISO(d.joined_at)
            };
        })
    );

    return chatRoles;
}

export async function fetchChatRolesByChatID(chatId: string, simplify?: boolean): Promise<ChatRoles[] | null> {
    const { data, error } = await getSupabaseClient()
        .from('chat roles')
        .select('*, chat_id(*)')
        .eq('chat_id', chatId)

    if(error){
        console.log("fetchChatRolesByChatID: error was found :( - " + error);
        return null;
    }

    const chatRoles: ChatRoles[] = await Promise.all(
        data.map(async (d) => {
            return {
                id: d.id,
                user: await fetchUserByID(d.user_id),
                chat: simplify == true ? null : await fetchChatByID(d.chat_id),
                role: Roles[d.role as keyof typeof Roles],
                joinedAt: DateTime.fromISO(d.joined_at)
            };
        })
    );

    return chatRoles;
}