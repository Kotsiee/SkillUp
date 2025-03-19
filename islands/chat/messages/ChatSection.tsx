// deno-lint-ignore-file no-explicit-any
import { useEffect, useRef, useState } from "preact/hooks";
import FileUploader from "../../../components/FileUploader/FileUploader.tsx";
import {
  Chat,
  ChatType,
  Files,
  Messages,
  User,
} from "../../../lib/types/index.ts";
import ChatMessage from "./ChatMessage.tsx";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import Textbox from "../../../components/Textbox/Textbox.tsx";
import { toMessage } from "../../../lib/utils/messages.ts";

interface ChatSectionProps {
  chat: Chat;
  user: User;
}

export default function ChatSection({ chat, user }: ChatSectionProps) {
  const [messages, setMessages] = useState<Messages[]>([]);
  const fileUploader = useRef<any>(null);
  const attachments = useSignal<Files[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chats/${chat.id}/messages`);
        if (!res.ok) throw new Error("Failed to load messages");
        const { json } = await res.json();
        setMessages(json);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    const eventSource = new EventSource(`/api/chats/${chat.id}/subscribe`);

    eventSource.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      setMessages((prev) => {
        switch (payload.eventType) {
          case "INSERT":
            return [
              ...prev.filter((msg) => msg.id !== payload.new.id),
              toMessage(payload.new, chat),
            ];
          case "UPDATE":
            return prev.map((msg) =>
              msg.id === payload.new.id
                ? { ...msg, content: payload.new.content }
                : msg
            );
          case "DELETE":
            return prev.filter((msg) => msg.id !== payload.old.id);
          default:
            return prev;
        }
      });
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [chat.id]);

  const getChatInfo = (type: "photo" | "name") => {
    const otherUser = chat.users?.find((u) => u.user?.id !== user.id)?.user;
    return type === "photo"
      ? chat.photo?.url || otherUser?.profilePicture?.small?.publicURL
      : chat.name || otherUser?.username;
  };

  return (
    <div>
      <Textbox
        class="chat-input"
        chat={chat}
        user={user}
        setMessages={setMessages}
        fileUploader={fileUploader}
        attachments={attachments}
      />

      <div class="attachmentss">
        <FileUploader
          title="Add Attachment"
          path={`shared/messages/${chat.id}`}
          user={user}
          thisRef={fileUploader}
          onUpload={(files) => (attachments.value = files ?? [])}
        />
      </div>

      <div class="chat-messages-area">
        {chat.chatType === ChatType.private_group && (
          <div class="top">
            <img
              class="chat-messages-photo"
              src={getChatInfo("photo")}
              alt="Chat Profile"
            />
            <p>&#9432; Chat Info</p>
          </div>
        )}

        <ul class="chat-mess">
          {messages.map((msg, index) => (
            <ChatMessage
              key={msg.id}
              msg={msg}
              user={user}
              prevUser={messages[index - 1]?.user?.user}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
