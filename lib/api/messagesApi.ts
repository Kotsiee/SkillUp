import { ChatType, Messages } from "../types/index.ts";
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { fetchChatRole } from "./chatRolesApi.ts";
import { fetchChatByID } from "./chatApi.ts";
import { getSupabaseClient } from "../supabase/client.ts";

export async function fetchMessagesByChat(chatId: string): Promise<Messages[] | null> {
    const { data, error } = await getSupabaseClient()
        .from('messages')
        .select('*, chat_id(*)')
        .eq('chat_id', chatId)
        .order('sent_at', {ascending: true})


    if(error){
        console.log("fetchMessagesByChat: error was found :( - " + error);
        return null;
    }

    const messages: Messages[] = await Promise.all(
        data.map(async (d) => {
            const chat = d.chat_id

            return {
                id: d.id,
                user: await fetchChatRole(d.user_id, chat.id, true),
                chat: {
                    id: chat.id,
                    chatType: ChatType[chat.chat_type as keyof typeof ChatType],
                    users: null,
                    name: chat.name,
                    meta: chat.meta,
                    photo: null,
                    createdAt: DateTime.fromISO(chat.created_at)
                },
                content: d.content,
                sentAt: DateTime.fromISO(d.sent_at)
            };
        })
    );

    return messages;
}

export async function newMessage(msg: Messages): Promise<Messages | null> {
    const { data, error } = await getSupabaseClient()
    .from('messages')
    .insert([
        {
            user_id: msg.user?.user?.id,
            chat_id: msg.chat?.id,
            content: msg.content,
            sent_at: msg.sentAt,
        },
    ])
    .select('*')
    .single()

    if(error){
        console.log("newMessage: error was found :( - " + error.details);
        return null;
    }

    const message: Messages = {
        id: data.id,
        user: await fetchChatRole(data.user_id, data.chat_id, true),
        chat: await fetchChatByID(data.chat_id, true),
        content: data.content,
        sentAt: DateTime.fromISO(data.sent_at)
    };

    return message;
}