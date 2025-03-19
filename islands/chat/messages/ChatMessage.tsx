import { useEffect, useRef } from "preact/hooks";
import { Files, Messages, User } from "../../../lib/types/index.ts";
import { toHTML } from "../../../lib/utils/messages.ts";
import AIcon, { Icons } from "../../../components/Icons.tsx";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { fileImage } from "../../../components/cards/FileCard.tsx";

interface ChatMessageProps {
  msg: Messages;
  user: User;
  prevUser?: User | null;
}

export default function ChatMessage({ msg, user, prevUser }: ChatMessageProps) {
  const isSender = msg.user?.user?.id === user.id;
  return (
    <li class="chat-message">
      <div class={isSender ? "isSender" : ""}>
        {!isSender && (!prevUser || prevUser.id !== msg.user?.user?.id) && (
          <div class="user">
            <img
              src={msg.user?.user?.profilePicture?.small?.publicURL}
              alt="User Profile"
            />
            <p>{msg.user?.user?.username}</p>
          </div>
        )}

        <div class="message">
          <Options isSender={isSender}/>
          <div class="content">
            <TextContent msg={msg} />
            <AttachmentContent files={msg.attachments} />
          </div>
          <Options isSender={!isSender}/>
        </div>
      </div>
    </li>
  );
}

function TextContent({ msg }: { msg: Messages }) {
  if (!msg || !msg.content.Children) return null;

  const ref = useRef<HTMLDivElement>(null);
  const seeMore = useRef<HTMLDivElement>(null);
  const seeMoreVal = useSignal(false);

  useEffect(() => {
    const fragment = document.createDocumentFragment();

    msg.content.Children?.forEach((tag) => {
      fragment.appendChild(toHTML(tag));
    });

    ref.current?.appendChild(fragment);

    if (msg.content.range) {
      seeMore.current!.hidden = msg.content.range <= 6;
    } else {
      seeMore.current!.hidden = true;
    }
  }, []);

  return (
    <div class="text-content">
      <div class="align">
        <div
          class="text"
          ref={ref}
          style={!seeMoreVal.value
            ? { maxHeight: "calc(1.3em * 6)", overflow: "hidden" }
            : {}}
        >
        </div>
        <p
          class="see-more"
          ref={seeMore}
          onClick={() => (seeMoreVal.value = !seeMoreVal.value)}
        >
          {seeMoreVal.value ? "Less" : "More"}...
        </p>
      </div>
    </div>
  );
}

function AttachmentContent({ files }: { files?: Files[] | null }) {
  if (!files || !files.length) return null;

  return (
    <div class="attachment-content">
      {files.map((file) => {
        return <img src={fileImage(file)} />;
      })}
    </div>
  );
}

function Options({isSender}: {isSender: boolean}) {
  return (
    <div class={`options ${isSender ? "active" : ""}`}>
      <AIcon className="option-icon reply" startPaths={Icons.Filter} />
      <AIcon className="option-icon menu" startPaths={Icons.DotMenu} />
    </div>
  );
}
