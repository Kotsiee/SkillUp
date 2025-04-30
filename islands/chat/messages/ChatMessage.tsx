import { useEffect, useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { toHTML } from '../../../lib/utils/messages.ts';
import AIcon, { Icons } from '../../../components/Icons.tsx';
import { fileImage } from '../../../components/cards/FileCard.tsx';
import {
  ChatRole,
  FileReference,
  Files,
  jsonTag,
  Messages,
  User,
} from '../../../lib/newtypes/index.ts';

interface ChatMessageProps {
  msg: Messages;
  user: User;
  prevUser?: User | null;
  allUsers: ChatRole[];
}

export default function ChatMessage({ msg, user, prevUser, allUsers }: ChatMessageProps) {
  const msgUser = allUsers.find(
    usr => usr.user.id === (msg.user as User).id || usr.user.id === msg.user
  );
  const isSender = msgUser?.user.id === user.id;

  return (
    <div
      class={`chat-message ${isSender ? 'chat-message--sender' : ''}`}
      role="listitem"
      aria-label="Chat message"
    >
      <div class="chat-message__wrapper">
        {/* Display username + photo if different user */}
        {!isSender &&
          (!prevUser || prevUser.id !== (msg.user as User).id || prevUser.id == msg.user) && (
            <div
              class="chat-message__user"
              role="group"
              aria-label={`Message from ${msgUser?.user.username}`}
            >
              <img
                class="chat-message__user-photo"
                src={
                  msgUser?.user.profilePicture?.small?.publicURL ??
                  '/assets/images/placeholders/user.webp'
                }
                alt={`${msgUser?.user.username}'s profile picture`}
                loading="lazy"
              />
              <p class="chat-message__user-name">{msgUser?.user.username}</p>
            </div>
          )}

        <div class="chat-message__content" role="group" aria-label="Message content">
          {isSender ? <Options /> : null}

          <div class="chat-message__body">
            <TextContent msg={msg} />
            <AttachmentContent files={msg.attachments as FileReference[]} />
          </div>

          {!isSender ? <Options /> : null}
        </div>
      </div>
    </div>
  );
}

function TextContent({ msg }: { msg: Messages }) {
  if (!msg || !msg.content?.Children) return null;

  const ref = useRef<HTMLDivElement>(null);
  const seeMore = useRef<HTMLButtonElement>(null);
  const seeMoreVal = useSignal(false);

  useEffect(() => {
    if (!ref.current) return;

    const fragment = document.createDocumentFragment();
    msg.content.Children?.forEach(tag => {
      fragment.appendChild(toHTML(tag));
    });

    ref.current.appendChild(fragment);

    if (msg.content.range) {
      seeMore.current!.hidden = msg.content.range <= 6;
    } else {
      seeMore.current!.hidden = true;
    }
  }, []);

  return (
    <div class="chat-message__text-content">
      <div class="chat-message__align">
        <div
          class="chat-message__text"
          ref={ref}
          style={!seeMoreVal.value ? { maxHeight: 'calc(1.3em * 6)', overflow: 'hidden' } : {}}
        ></div>
        <button
          class="chat-message__see-more"
          ref={seeMore}
          onClick={() => (seeMoreVal.value = !seeMoreVal.value)}
          aria-expanded={seeMoreVal.value}
        >
          {seeMoreVal.value ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
  );
}

function AttachmentContent({ files }: { files?: FileReference[] | null }) {
  if (!files || files.length === 0) return null;

  return (
    <div class="chat-message__attachments" role="group" aria-label="Message attachments">
      {files.map((file, index) => (
        <img
          key={index}
          class="chat-message__attachment-image"
          loading="lazy"
          src={fileImage((file.file as Files) || file)}
          alt="Attachment image"
        />
      ))}
    </div>
  );
}

function Options() {
  return (
    <div class="chat-message__options" role="group" aria-label="Message options">
      <AIcon
        className="chat-message__option-icon chat-message__option-icon--reply"
        startPaths={Icons.Filter}
        aria-label="Reply"
      />
      <AIcon
        className="chat-message__option-icon chat-message__option-icon--menu"
        startPaths={Icons.DotMenu}
        aria-label="Message options menu"
      />
    </div>
  );
}
