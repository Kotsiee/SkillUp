import { Chat, User } from '../../lib/newtypes/index.ts';

export default function ChatCard({ chat, user }: { chat: Chat; user: User }) {
  return (
    <li class="chat-item">
      <a
        class={`chat-link`}
        href={`/messages/${chat.id}/chat`}
        f-partial={`/messages/${chat.id}/partials/chat`}
      >
        <Card chat={chat} user={user} />
      </a>
    </li>
  );
}

const Card = ({ chat, user }: { chat: Chat; user: User }) => {
  let lastUser = null;

  if (chat.chatType === 'private') {
    lastUser = chat.users!.find(chat => chat.user?.id !== user.id)!.user;
  }

  let image = chat.photo ? chat.photo.publicURL : lastUser?.profilePicture?.med?.publicURL;

  if (!image)
    image =
      'https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg';

  return (
    <div class="container">
      <div class="chat-photo">
        <img class="chat-photo-image" src={image} loading="lazy" />
      </div>
      <div>
        <p>{chat.name ? chat.name : lastUser?.username}</p>
        <p className="lastMessage">
          {chat.lastMessage ? chat.lastMessage.content : 'Start the conversation...'}
        </p>
      </div>
    </div>
  );
};
