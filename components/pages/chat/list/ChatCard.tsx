import { Chat, User } from '../../../../lib/newtypes/index.ts';

export function ChatCard({ chat, user }: { chat: Chat; user: User }) {
  let lastUser = null;

  if (chat.chatType === 'private') {
    lastUser = chat.users!.find(chat => chat.user?.id !== user.id)!.user;
  }

  console.log(`/messages/partials/${chat.id}/chat`);

  return (
    <a
      class="chat-card"
      href={`/messages/${chat.id}/chat`}
      f-partial={`/messages/partials/${chat.id}/chat`}
      aria-label={`Open chat with ${chat.name ? chat.name : lastUser?.username}`}
    >
      <div class="chat-card__container">
        <div class="chat-card__photo" role="img" aria-label="Chat photo">
          <img
            class="chat-card__photo-image"
            src={
              lastUser?.profilePicture?.small?.publicURL ??
              'assets/images/placeholders/messages.webp'
            }
            alt={`${chat.name ? chat.name : lastUser?.username} chat photo`}
            loading="lazy"
          />
        </div>

        <div class="chat-card__details">
          <p class="chat-card__name">{chat.name ? chat.name : lastUser?.username}</p>
        </div>
      </div>
    </a>
  );
}
