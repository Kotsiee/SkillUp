import { ChatType, Files, Messages } from "../types/index.ts";
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { fetchChatRole } from "./chatRolesApi.ts";
import { fetchChatByID } from "./chatApi.ts";
import { getSupabaseClient } from "../supabase/client.ts";
import { fetchFileReference, insertFileReference } from "./filesApi.ts";
import { uploadFile } from "./filesApi.ts";

export async function fetchMessagesByChat(chatId: string, hasAttachment?: boolean): Promise<Messages[] | null> {
    let query = getSupabaseClient()
    .from('messages')
    .select('*, chat_id(*)')
    .eq('chat_id', chatId)
    .order('sent_at', {ascending: true})

    if (hasAttachment) {
      query = query.eq("hasAttachment", "TRUE")
    }

    const { data, error } = await query


    if(error){
        console.log("fetchMessagesByChat: error was found :( - " + error);
        return null;
    }

    const messages: Messages[] = await Promise.all(
        data.map(async (d) => {
            const chat = d.chat_id;
            const user = await fetchChatRole(d.user_id, chat.id, true);
            const attachments = hasAttachment ? (await fetchFileReference(user!.user!.id,'message', d.id)) :
            (await fetchFileReference(user!.user!.id,'message', d.id))?.map(item => item.file!);

            return {
                id: d.id,
                user,
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
                textContent: d.textContent,
                attachments,
                sentAt: DateTime.fromISO(d.sent_at)
            };
        })
    );

    return messages;
}

export async function newMessage(msg: Messages, accessToken: string): Promise<Messages | null> {
    const { data, error } = await getSupabaseClient()
    .from('messages')
    .insert([
        {
            id: msg.id,
            user_id: msg.user?.user?.id,
            chat_id: msg.chat?.id,
            content: msg.content,
            textContent: msg.textContent,
            sent_at: msg.sentAt,
            hasAttachment: msg.attachments ? msg.attachments.length > 0 : false,
        },
    ])
    .select('*')
    .single()

    if(error){
        console.log("newMessage: error was found :( - " + error.details);
        return null;
    }

    if (msg.attachments?.length) {
        msg.attachments.forEach(async (file: Files) => {
            if (file.isUpload){
                await uploadFile(file, accessToken)
            }

            await insertFileReference({
                id: crypto.randomUUID(),
                file: file,
                entityType: 'message',
                entityId: msg.id,
                meta: {
                    publicName: file.publicName,
                }
            })
        })
    }

    const message: Messages = {
        id: data.id,
        user: await fetchChatRole(data.user_id, data.chat_id, true),
        chat: await fetchChatByID(data.chat_id, true),
        content: data.content,
        textContent: data.textContent,
        attachments: msg.attachments,
        sentAt: DateTime.fromISO(data.sent_at)
    };

    return message;
}