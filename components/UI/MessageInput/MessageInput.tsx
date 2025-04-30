// deno-lint-ignore-file no-explicit-any
import Quill from 'https://esm.sh/quill@2.0.3';
import { MutableRef, Ref, useEffect, useRef } from 'preact/hooks';
import { JSX } from 'preact/jsx-runtime';
import AIcon, { Icons } from '../../Icons.tsx';
import {
  Signal,
  useSignal,
} from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js';
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { toJSON, toText } from '../../../lib/utils/messages.ts';
import { Chat, Files, Messages, User } from '../../../lib/newtypes/index.ts';
import FileUploader from '../FileUploader/FileUploader.tsx';
import FileCard from '../../cards/FileCard.tsx';

interface MessageInputProps extends JSX.HTMLAttributes<HTMLDivElement> {
  chat: Chat;
  user: User;
  messages: Signal<Messages[]>;
}

export default function MessageInput({ chat, user, messages, ...props }: MessageInputProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  const openState = useSignal<boolean>(false);
  const profileModal = useRef<HTMLDivElement>(null);

  const openStateAdvancedText = useSignal<boolean>(false);

  const addOpen = useRef<AIcon>();
  const container = useRef<HTMLDivElement>(null);

  const fileUploader = useRef<any>(null);
  const attachments = useSignal<Files[]>([]);

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
    if (typeof window !== 'undefined' && editorRef.current) {
      import('https://esm.sh/quill@2.0.3')
        .then(({ default: Quill }) => {
          quillRef.current = new Quill(editorRef.current!, {
            placeholder: 'Type your message...',
            modules: {
              toolbar: toolRef.current,
              keyboard: {
                bindings: getKeyboardBindings(
                  quillRef,
                  messages,
                  chat,
                  user,
                  openStateAdvancedText,
                  attachments
                ),
              },
            },
          });
        })
        .catch(error => console.error('Failed to load Quill:', error));
    }
  }, []);

  return (
    <div {...props}>
      <div class="chat-input">
        <div class="container">
          <div class="message-attachments">
            {attachments.value.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                onRemove={() => {
                  attachments.value = attachments.value.filter((_, i) => i !== index);
                }}
              />
            ))}
          </div>

          <div ref={toolRef} hidden={!openStateAdvancedText.value}>
            <div class="advanced-text-area">
              <TextToolbar quillRef={quillRef} styles={styles} />
            </div>
          </div>

          <div ref={container} class="chat-input-text">
            <AIcon
              ref={addOpen}
              startPaths={Icons.Plus}
              endPaths={Icons.X}
              className="additional-btn"
              size={20}
              onClick={() => {
                if (profileModal.current) {
                  profileModal.current.hidden = !profileModal.current.hidden;
                  profileModal.current.classList.remove(
                    !profileModal.current.hidden ? 'hide' : 'show'
                  );
                  profileModal.current.classList.add(profileModal.current.hidden ? 'hide' : 'show');

                  profileModal.current.focus();
                }
              }}
              initalState={openState.value}
            />

            <AttachmentModal closeBtn={addOpen} r={profileModal} fileUploader={fileUploader} />

            <div class="message-input">
              <div ref={editorRef}></div>
            </div>

            <div class="options">
              <ul>
                <li class={`advanced-text${openStateAdvancedText.value ? ' show' : ''}`}>
                  <button
                    onClick={() => {
                      openStateAdvancedText.value = !openStateAdvancedText.value;
                    }}
                  >
                    <AIcon startPaths={Icons.EditText} className="advanced-text-icon" />
                  </button>
                </li>
                <li class="record-message">
                  <button>
                    <AIcon startPaths={Icons.Mic} className="record-icon" />
                  </button>
                </li>
                <li class="message-sent" hidden>
                  <button>
                    <AIcon
                      startPaths={Icons.Send}
                      className="send-icon"
                      onClick={() => {
                        enterMessage(quillRef.current!.root, messages, chat, user, attachments);
                      }}
                    />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <FileUploader
        title="Add Attachment"
        path={`shared/messages/${chat.id}`}
        user={user}
        thisRef={fileUploader}
        onUpload={files => (attachments.value = [...attachments.value, ...(files ?? [])])}
      />
    </div>
  );
}

function TextToolbar({ quillRef, styles }: { quillRef: any; styles: any }) {
  function updateStyles() {
    const range = quillRef.current?.getSelection();
    if (!range) return;

    const format = quillRef.current!.getFormat(range.index);
    styles.value = {
      bold: !!format.bold,
      italic: !!format.italic,
      underline: !!format.underline,
      strike: !!format.strike,
      list: format.list || {},
      colour: format.color || {},
      header: format.header || {},
    };
  }

  return (
    <div class="advanced-text-area">
      <ul className="text-style">
        {['bold', 'italic', 'underline', 'strike'].map(style => (
          <li
            key={style}
            class={`${style}${styles.value[style] ? ' enabled' : ''}`}
            onClick={() => {
              quillRef.current?.format(style, !styles.value[style]);
              updateStyles();
            }}
          >
            <AIcon startPaths={Icons[style.charAt(0).toUpperCase() + style.slice(1)]} />
          </li>
        ))}
      </ul>

      <ul className="text-style">
        {['bullet', 'ordered'].map(style => (
          <li
            key={style}
            class={`${style}${styles.value[style] ? ' enabled' : ''}`}
            onClick={() => {
              quillRef.current?.format('list', (styles.value.list = style));
              updateStyles();
            }}
          >
            <AIcon startPaths={Icons[style.charAt(0).toUpperCase() + style.slice(1)]} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function getKeyboardBindings(
  quillRef: any,
  messages: Signal<Messages[]>,
  chat: Chat,
  user: User,
  openStateAdvancedText: any,
  attachments: Signal<Files[]>
) {
  return {
    tab: {
      key: 9,
      handler: (range: any, context: any) => {
        if (context.format.list) {
          quillRef.current?.format('indent', '+1');
        } else {
          quillRef.current?.insertText(range.index, '\t');
        }
      },
    },
    enter: {
      key: 'Enter',
      handler: function (_range: any, _context: any) {
        if (openStateAdvancedText.value) return true;
        else {
          if (quillRef.current?.root) {
            enterMessage(quillRef.current.root, messages, chat, user, attachments);
          }
        }
      },
    },
  };
}

const AttachmentModal = ({
  closeBtn,
  r,
  fileUploader,
}: {
  closeBtn: MutableRef<AIcon | undefined>;
  r: Ref<HTMLDivElement>;
  fileUploader: MutableRef<any>;
}) => {
  const defaultVal = 'Select Item';
  const addHover = useSignal<string>(defaultVal);
  const onHover = useSignal<boolean>(false);

  return (
    <div
      class={`chat-input-additional hide`}
      ref={r}
      hidden
      tabIndex={0}
      onMouseEnter={() => {
        onHover.value = true;
      }}
      onMouseLeave={() => {
        onHover.value = false;
      }}
      onFocus={() => {}}
      onBlur={() => {
        if (!r.current) return;

        closeBtn.current?.click();
        r.current.hidden = true;
        r.current.classList.remove(!r.current!.hidden ? 'hide' : 'show');
        r.current.classList.add(r.current!.hidden ? 'hide' : 'show');
      }}
    >
      <p class="item-select">{addHover.value}</p>

      <ul>
        <li
          class="File"
          onMouseEnter={() => (addHover.value = 'File')}
          onClick={() => {
            fileUploader.current.openModal();
          }}
        >
          <AIcon startPaths={Icons.Clip} />
        </li>
        <li class="Poll" onMouseEnter={() => (addHover.value = 'Poll')}>
          <AIcon startPaths={Icons.Poll} />
        </li>
        <li class="Project" onMouseEnter={() => (addHover.value = 'Project')}>
          <AIcon startPaths={Icons.Filter} />
        </li>
        <li class="Person" onMouseEnter={() => (addHover.value = 'Person')}>
          <AIcon startPaths={Icons.Filter} />
        </li>
        <li class="Post" onMouseEnter={() => (addHover.value = 'Post')}>
          <AIcon startPaths={Icons.Filter} />
        </li>
      </ul>
    </div>
  );
};

const enterMessage = async (
  type: HTMLDivElement,
  messages: Signal<Messages[]>,
  chat: Chat,
  user: User,
  attachments: Signal<Files[]>
) => {
  const content = toJSON(type, 'ROOT', 0);

  const id = crypto.randomUUID();

  const newMessage: Messages = {
    id: id,
    content: content,
    textContent: toText(content),
    sentAt: DateTime.now(),
    user: user.id,
    chatid: chat.id,
    attachments: attachments.value,
  };

  messages.value = [...messages.value, newMessage];

  await fetch(`/api/chats/${chat.id}/messages/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMessage),
  });

  type.innerHTML = '';
  attachments.value = [];
};
