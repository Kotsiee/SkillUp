// deno-lint-ignore-file no-explicit-any
import { JSX } from "preact/jsx-runtime";
import { MutableRef, useEffect, useRef } from "preact/hooks";
import {
  Signal,
  useSignal,
} from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { KeyboardBindings } from "./KeyboardBindings.ts";
import TextToolbar from "./Toolbar.tsx";
import AIcon, { Icons } from "../Icons.tsx";
import AttachmentModal from "./AttachmentModal.tsx";
import { handleSendMessage } from "./MessagesUtils.ts";
import Quill from "https://esm.sh/quill@2.0.3";
import FileCard from "../cards/FileCard.tsx";
import { Chat, User, Messages, Files } from "../../lib/types/index.ts";

interface TextboxProps extends JSX.HTMLAttributes<HTMLDivElement> {
  chat: Chat;
  user: User;
  setMessages: (update: (prevMessages: Messages[]) => Messages[]) => void;
  fileUploader: MutableRef<any>;
  attachments: Signal<Files[]>;
}

export default function Textbox(
  { chat, user, setMessages, fileUploader, attachments, ...props }:
    TextboxProps,
) {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const profileModalRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<AIcon>();
  const isToolbarOpen = useSignal(false);

  const styles = useSignal({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    list: {},
    colour: {},
    header: {},
  });

  useEffect(() => {
    if (typeof window !== "undefined" && editorRef.current) {
      import("https://esm.sh/quill@2.0.3")
        .then(({ default: Quill }) => {
          quillRef.current = new Quill(editorRef.current!, {
            placeholder: "Type your message...",
            modules: {
              toolbar: toolbarRef.current,
              keyboard: {
                bindings: KeyboardBindings(
                  quillRef,
                  setMessages,
                  chat,
                  user,
                  isToolbarOpen,
                  fileUploader,
                  attachments.value,
                ),
              },
            },
          });
        })
        .catch((error) => console.error("Error loading Quill editor:", error));
    }
  }, [attachments.value]);

  return (
    <div {...props}>
      <div class="container">
        {attachments.value.length
          ? (
            <div class="attachment-files">
              {attachments.value.map((file) => {
                return (
                  <FileCard
                    file={file}
                    onRemove={() => {
                      attachments.value = attachments.value.filter((item) =>
                        item.id !== file.id
                      );
                    }}
                  />
                );
              })}
            </div>
          )
          : null}

        {isToolbarOpen.value && (
          <TextToolbar quillRef={quillRef} styles={styles} />
        )}
        <div class="chat-input-text">
          <AIcon
            ref={addButtonRef}
            startPaths={Icons.Plus}
            endPaths={Icons.X}
            className="additional-btn"
            size={20}
            onClick={() => profileModalRef.current?.classList.toggle("show")}
          />
          <AttachmentModal
            closeBtn={addButtonRef}
            modalRef={profileModalRef}
            fileUploader={fileUploader}
          />
          <div class="message-input">
            <div ref={editorRef}></div>
          </div>
          <div class="options">
            <ul>
              <li class={`advanced-text${isToolbarOpen.value ? " show" : ""}`}>
                <button
                  onClick={() => isToolbarOpen.value = !isToolbarOpen.value}
                >
                  <AIcon
                    startPaths={Icons.EditText}
                    className="advanced-text-icon"
                  />
                </button>
              </li>
              <li class="record-message">
                <button>
                  <AIcon startPaths={Icons.Mic} className="record-icon" />
                </button>
              </li>
              <li class="message-sent">
                <button
                  onClick={() =>
                    handleSendMessage(
                      quillRef,
                      setMessages,
                      chat,
                      user,
                      fileUploader,
                      attachments.value,
                    )}
                >
                  <AIcon startPaths={Icons.Send} className="send-icon" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
