import { useEffect } from 'preact/hooks';
import AIcon, { Icons } from '../../components/Icons.tsx';
import { useSignal } from '@preact/signals';
import { Chat, User } from '../../lib/newtypes/index.ts';
import { ChatCard } from '../../components/pages/chat/list/ChatCard.tsx';
import { useUser } from '../contexts/UserProvider.tsx';

export default function ChatList() {
  const chats = useSignal<Chat[]>([]);
  const { user } = useUser();

  useEffect(() => {
    fetch(`/api/chats`)
      .then(res => res.json())
      .then(data => {
        chats.value = data;
      });
  }, []);

  if (!user) return null;

  return (
    <div class="chat-list" role="region" aria-label="Chat List">
      <div class="chat-list__header" role="heading" aria-level={2}>
        <h3 class="chat-list__title">Messages</h3>
        <AIcon startPaths={Icons.Search} size={20} aria-label="Search chats" />
      </div>

      <div class="chat-list__options" role="navigation" aria-label="Chat Options">
        {/* Options content here */}
      </div>

      <div class="chat-list__chats" role="list" aria-label="Chats">
        {chats.value.length > 0
          ? chats.value.map(chat => <ChatCard chat={chat} user={user} key={chat.id} />)
          : null}
      </div>
    </div>
  );
}
