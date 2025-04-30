import { useEffect, useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { PageProps } from '$fresh/server.ts';
import { useUser } from '../../contexts/UserProvider.tsx';
import { useChat } from '../../contexts/ChatProvider.tsx';
import { Messages, User } from '../../../lib/newtypes/index.ts';
import MessageInput from '../../../components/UI/MessageInput/MessageInput.tsx';
import { useProject } from '../../contexts/ProjectProvider.tsx';
import ChatMessage from '../../chat/messages/ChatMessage.tsx';

export default function ProjectMessages({ pageProps }: { pageProps: PageProps }) {
  const { user } = useUser();
  const { chat, fetchChat } = useChat();
  const { project } = useProject();

  useEffect(() => {
    fetchChat(pageProps.params.chatid);
  }, [pageProps.params.chatid]);

  if (!user || !chat || !project) return <div>Not loaded</div>;

  const messages = useSignal<Messages[]>([]);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chats/${chat.id}/messages`);
        if (!res.ok) throw new Error('Failed to load messages');
        const { json } = await res.json();
        messages.value = json;
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    const eventSource = new EventSource(`/api/chats/${chat.id}/subscribe`);

    eventSource.onmessage = event => {
      const payload = JSON.parse(event.data);

      switch (payload.eventType) {
        case 'INSERT':
          console.log(payload);
          messages.value = messages.value.filter(msg => msg.id !== payload.new.id);
          messages.value = [...messages.value, payload.new];
          break;
        case 'UPDATE': {
          const temp = messages.value.map(msg =>
            msg.id === payload.new.id ? { ...payload.new } : msg
          );
          messages.value = [...(temp as Messages[])];
          break;
        }
        case 'DELETE':
          messages.value = messages.value.filter(msg => msg.id !== payload.old.id);
          break;
        default:
          return messages.value;
      }
    };

    eventSource.onerror = error => {
      console.error('SSE error:', error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [chat]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages.value.length]);

  return (
    <div class="chat-messages" role="region" aria-label="Chat Messages">
      <div class="chat-messages__input">
        <MessageInput chat={chat} user={user} messages={messages} />
      </div>

      <div
        class="chat-messages__list-container"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        ref={messageListRef}
      >
        {messages.value.map((msg, index) => (
          <ChatMessage
            key={msg.id}
            msg={msg}
            user={user}
            prevUser={messages.value[index - 1]?.user as User}
            allUsers={project.roles}
          />
        ))}
      </div>
    </div>
  );
}
