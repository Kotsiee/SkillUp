// deno-lint-ignore-file no-explicit-any
import { useEffect, useState } from "preact/hooks";
import { Chat, Messages, User } from "../../lib/types/index.ts";
import { PageProps } from '$fresh/server.ts';
import AIcon, { Icons } from "../../components/Icons.tsx";
import { createClient, RealtimePostgresChangesPayload, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.47.10";
import Textbox from "../Textbox.tsx";
import { toHTML, toMessage } from "../../lib/utils/messages.ts";
import { jsonTag } from "../../lib/types/messages.ts";
import { useRef } from 'preact/hooks';
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";

interface IChatMessages {
    supabaseUrl: string;
    supabaseAnonKey: string;
    user: User;
}

export default function ChatMessages({pageProps, p}: { pageProps: PageProps, p: IChatMessages }) {
    const [chat, setChat] = useState<Chat>();
    const user = p.user;
    const supabase = createClient(p.supabaseUrl, p.supabaseAnonKey);

    useEffect(() => {
        async function fetchMessages() {
            const res = await fetch(`/api/chats/${pageProps.params.chatid}/chat`);
            const data = await res.json();
            const thisChat: Chat = data.json
            setChat(thisChat);
        console.log(thisChat)

        }

        fetchMessages();
    }, [pageProps.params.chatid]);

    return (
        <div class="chat-messages-container">
            { chat ? (
                <ChatSection chat={chat} user={user} p={p} supabase={supabase}/>
            )
            : (<></>)
        }
        </div>
    );
}

const ChatSection = (props: {p: IChatMessages, chat: Chat, user: User, supabase: SupabaseClient<any, "public", any>}) => {
    const [messages, setMessages] = useState<Messages[]>([]);
    const supabase = props.supabase

    const handleSubscription = (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>, c: Chat) => {
        switch (payload.eventType) {
            case "INSERT":
                setMessages((prevMessages) => [...prevMessages, toMessage(payload.new as Messages, c)]);
                break;
            case "UPDATE":
                setMessages((prevMessages) => prevMessages.map((message) => 
                    message.id === (payload.new as Messages).id ? { ...message, content: (payload.new as Messages).content } : message ));
                break;
            case "DELETE":
                setMessages((prevMessages) => prevMessages.filter((message) => message.id !== (payload.old as Messages).id));
                break;
        }
    }

    useEffect(() => {
        let channel: any;
        async function fetchMessages() {
            const res1 = await fetch(`/api/chats/${props.chat.id}/messages`, {method: 'GET'});
            const data1 = await res1.json();
            setMessages(data1.json);

            channel = supabase
            .channel('public:messages')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'messages' },
                async (payload) => {

                    const res = await fetch(`/api/chats/${props.chat.id}/chat`);
                    const data = await res.json();
                    const c: Chat = data.json

                    handleSubscription(payload, c)

                    setTimeout(() => {
                        globalThis.scrollTo({ top: globalThis.innerHeight, behavior: 'smooth' });
                    }, 0);
                }
            )
            .subscribe();

            // Handle reconnect attempts
            channel.on("close", () => {
                console.warn("Subscription closed, attempting to reconnect...");
                setTimeout(() => {
                supabase.channel("public:messages").subscribe();
                }, 5000); // Reconnect after 5 seconds
            });

            setTimeout(() => {
                globalThis.scrollTo({ top: globalThis.innerHeight });
            }, 0);
        }

        fetchMessages();

        return () => {
            if (channel) channel.unsubscribe();
        };
    }, [props.chat]);

    const getChatInfo = (type: 'photo' | 'name') => {
        if (!props.chat)
            return '';

        const otherUser = props.chat.users!.find(u => u.user?.id != props.user.id)?.user!; 

        switch (type) {
            case 'photo':
                return props.chat.photo != null ? props.chat.photo.url : otherUser?.profilePicture?.url;
            case 'name': 
                return props.chat.name ? props.chat.name : otherUser?.username;
        }
    }

    return(
        <div>
            <Textbox class='chat-input' setMessages={setMessages} user={props.user} chat={props.chat}/>

            <div class="modals">
                <div class="addFile"></div>
                <div class="addPoll"></div>
                <div class="addMention"></div>
                <div class="addProject"></div>
            </div>

            <div class="chat-messages-area">
                <div class="empty">
                    <div><img class="chat-messages-photo" src={ getChatInfo('photo') }/></div>
                    <div><p>&#9432; Chat Info</p></div>
                </div>
                <ul class="chat-messages-list">
                    {messages?.map((msg, index) => {
                        return ( <ChatMessage msg={msg} userId={props.user!.id} prevUID={messages[index-1]?.user?.user?.id}/> );
                    })}
                </ul>
            </div>
        </div>
    )
}

const ChatMessage = (props: {msg: Messages, userId: string, prevUID?: string}) => {
    const isSender = props.msg.user?.user?.id == props.userId
    const ref = useRef<HTMLDivElement>(null)
    const seeMore = useRef<HTMLDivElement>(null)
    const seeMoreVal = useSignal<boolean>(false)

    useEffect(() => {
        const fragment = document.createDocumentFragment();
        
        (props.msg.content.Children as jsonTag[])?.forEach(tag => {
            fragment.appendChild(toHTML(tag))
            if (props.msg.content.range)
                seeMore.current!.hidden = props.msg.content.range <= 6
            else seeMore.current!.hidden = true
        })

        ref.current?.appendChild(fragment)
    }, [])

    return(
        <li class="chat-message">
            <div class={isSender ? "isSender" : ""}>
                { !isSender && props.prevUID == props.userId ? 
                    <div class="user">
                        <img src={ props.msg.user?.user?.profilePicture?.url }/>
                        <p> { props.msg.user?.user?.username } </p>
                    </div> : <></>
                }

                <div class="message">
                    <div class={`options ${isSender ? 'active' : ''}`}>
                        <AIcon className="option-icon reply" startPaths={Icons.Filter}/>
                        <AIcon className="option-icon menu" startPaths={Icons.DotMenu}/>
                    </div>

                    <div class="content">
                        <div class="text" ref={ref}
                        style={!seeMoreVal.value ? 
                            {
                                webkitLineClamp: '6',
                                overflow: 'hidden',
                                maxHeight: 'calc(1.3em * 6)'
                            } : 
                            {}}
                        ></div>
                        <p class="see-more" ref={seeMore} onClick={() => {seeMoreVal.value = !seeMoreVal.value}}>{seeMoreVal.value ? 'Less' : 'More'}...</p>
                    </div>

                    <div class={`options ${!isSender ? 'active' : ''}`}>
                        <AIcon className="option-icon menu" startPaths={Icons.DotMenu}/>
                        <AIcon className="option-icon reply" startPaths={Icons.Filter}/>
                    </div>
                </div>
            </div>
        </li>
    )
}