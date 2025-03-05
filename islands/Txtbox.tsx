// deno-lint-ignore-file no-explicit-any
import Quill from "https://esm.sh/quill@2.0.3";
import { Dispatch, MutableRef, Ref, StateUpdater, useEffect, useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import AIcon, { Icons } from "../components/Icons.tsx";
import {
  Signal,
  useSignal,
} from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { ChatRoles } from "../lib/types/chatRoles.ts";
import { Messages } from "../lib/types/messages.ts";
import messages from "../routes/messages/index.tsx";
import { toJSON, toMessage } from "../lib/utils/messages.ts";
import { Chat, User } from "../lib/types/index.ts";

export default function Textbox(
  props: JSX.HTMLAttributes<HTMLDivElement> & {
    chat: Chat;
    user: User;
    setMessages: Dispatch<StateUpdater<Messages[]>>;
  }
) {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  const openState = useSignal<boolean>(false);
  const profileModal = useRef<HTMLDivElement>(null);
  
  const openStateAdvancedText = useSignal<boolean>(false);

  const addOpen = useRef<AIcon>();
  const container = useRef<HTMLDivElement>(null);

  const MAX_INDENT_LEVEL = 3;

  const styles = useSignal({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    list: "",
    colour: "",
    header: 1,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && editorRef.current) {
      import("https://esm.sh/quill@2.0.3")
        .then(({ default: Quill }) => {
          const bindings = {
            tab: {
              key: 9,
              handler: function (range: any, context: any) {
                if (context.format.list) {
                  const currentIndent = context.format.indent || 0;
                  if (currentIndent <= MAX_INDENT_LEVEL)
                    quillRef.current?.format("indent", "+1");
                  else context.format.indent = MAX_INDENT_LEVEL;
                } else {
                  if (openStateAdvancedText.value)
                    quillRef.current?.insertText(range.index, "\t");
                }
              },
            },

            bold: {
              key: ["b", "B"],
              handler: function () {
                if (openStateAdvancedText.value)
                  quillRef.current?.format("bold", !styles.value.bold);
              },
            },

            italic: {
              key: ["i", "I"],
              handler: function () {
                if (openStateAdvancedText.value)
                  quillRef.current?.format("italic", !styles.value.italic);
              },
            },

            underline: {
              key: ["u", "U"],
              handler: function () {
                if (openStateAdvancedText.value)
                  quillRef.current?.format(
                    "underline",
                    !styles.value.underline
                  );
              },
            },

            enter: {
              key: "Enter",
              handler: function (_range: any, _context: any) {
                if (openStateAdvancedText.value) return true;
                else {
                  if (quillRef.current?.root)
                    enterMessage(
                      quillRef.current.root,
                      props.setMessages,
                      props.chat,
                      props.user
                    );
                }
              },
            },
          };

          quillRef.current = new Quill(editorRef.current!, {
            placeholder: "Type your message...",
            modules: {
              toolbar: toolRef.current,
              keyboard: {
                bindings: bindings,
              },
            },
          });
        })
        .catch((error) => console.error("Failed to load Quill:", error));
    }
  }, []);

  const updateStyles = () => {
    const range = quillRef.current?.getSelection(); // Get the current selection range
    if (!range) return; // Exit if no selection found

    const newStyles = { ...styles.value }; // Clone the styles object
    newStyles.bold = quillRef.current?.getFormat(range.index + 1)
      .bold as boolean;
    newStyles.italic = quillRef.current?.getFormat(range.index + 1)
      .italic as boolean;
    newStyles.underline = quillRef.current?.getFormat(range.index + 1)
      .underline as boolean;
    newStyles.strike = quillRef.current?.getFormat(range.index + 1)
      .strike as boolean;
    newStyles.list = quillRef.current?.getFormat(range.index + 1)
      .list as string;
    newStyles.colour = quillRef.current?.getFormat(range.index + 1)
      .color as string;
    newStyles.header = quillRef.current?.getFormat(range.index + 1)
      .header as number;
    styles.value = newStyles;
  };

  return (
    <div {...props}>
      <div class="container">
        <div ref={toolRef} hidden={!openStateAdvancedText.value}>
          <div class="advanced-text-area">
            <ul className="text-style">
              <li
                class={`bold${styles.value.bold ? " enabled" : ""}`}
                onClick={() => {
                  quillRef.current?.format("bold", !styles.value.bold);
                  updateStyles();
                }}
              >
                <AIcon startPaths={Icons.Bold} />
              </li>
              <li
                class={`italic${styles.value.italic ? " enabled" : ""}`}
                onClick={() => {
                  quillRef.current?.format("italic", !styles.value.italic);
                  updateStyles();
                }}
              >
                <AIcon startPaths={Icons.Italic} />
              </li>
              <li
                class={`underline${styles.value.underline ? " enabled" : ""}`}
                onClick={() => {
                  quillRef.current?.format(
                    "underline",
                    !styles.value.underline
                  );
                  updateStyles();
                }}
              >
                <AIcon startPaths={Icons.Underline} />
              </li>
              <li
                class={`strike${styles.value.strike ? " enabled" : ""}`}
                onClick={() => {
                  quillRef.current?.format("strike", !styles.value.strike);
                  updateStyles();
                }}
              >
                <AIcon startPaths={Icons.Strike} />
              </li>
            </ul>

            <ul className="list-style">
              <li
                class={`bullet${
                  styles.value.list === "bullet" ? " enabled" : ""
                }`}
                onClick={() => {
                  quillRef.current?.format(
                    "list",
                    styles.value.list === "bullet" ? undefined : "bullet"
                  );
                  updateStyles();
                }}
              >
                <AIcon startPaths={Icons.UList} />
              </li>
              <li
                class={`numbered${
                  styles.value.list === "ordered" ? " enabled" : ""
                }`}
                onClick={() => {
                  quillRef.current?.format(
                    "list",
                    styles.value.list === "ordered" ? undefined : "ordered"
                  );
                  updateStyles();
                }}
              >
                <AIcon startPaths={Icons.NList} />
              </li>
            </ul>
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
                profileModal.current.classList.remove(!profileModal.current.hidden ? 'hide' : 'show')
                profileModal.current.classList.add(profileModal.current.hidden ? 'hide' : 'show')
                
                profileModal.current.focus();
              }
            }}
            initalState={openState.value}
          />

            <AttachmentModal closeBtn={addOpen} r={profileModal}/>

          <div class="message-input">
            <div
              ref={editorRef}
              onKeyUp={() => {
                updateStyles();
              }}
              onMouseUp={() => {
                updateStyles();
              }}
            ></div>
          </div>

          <div class="options">
            <ul>
              <li
                class={`advanced-text${
                  openStateAdvancedText.value ? " show" : ""
                }`}
              >
                <button
                  onClick={() => {
                    openStateAdvancedText.value = !openStateAdvancedText.value;
                  }}
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
              <li class="message-sent" hidden>
                <button>
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

const AttachmentModal = ({
  closeBtn,
  r,
}: {
  closeBtn: MutableRef<AIcon | undefined>;
  r: Ref<HTMLDivElement>;
}) => {
  const defaultVal = "Select Item";
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

      onFocus={() => {console.log('focus')}}

      onBlur={() => {
        if(!r.current) return;

        closeBtn.current?.click();
        r.current.hidden = true;
        r.current.classList.remove(!r.current!.hidden ? 'hide' : 'show');
        r.current.classList.add(r.current!.hidden ? 'hide' : 'show');
      }}
    >
      <p class="item-select">{addHover.value}</p>

      <ul>
        <li class="File" onMouseEnter={() => (addHover.value = "File")}>
          <AIcon startPaths={Icons.Clip} />
        </li>
        <li class="Poll" onMouseEnter={() => (addHover.value = "Poll")}>
          <AIcon startPaths={Icons.Poll} />
        </li>
        <li class="Project" onMouseEnter={() => (addHover.value = "Project")}>
          <AIcon startPaths={Icons.Filter} />
        </li>
        <li class="Person" onMouseEnter={() => (addHover.value = "Person")}>
          <AIcon startPaths={Icons.Filter} />
        </li>
        <li class="Post" onMouseEnter={() => (addHover.value = "Post")}>
          <AIcon startPaths={Icons.Filter} />
        </li>
      </ul>
    </div>
  );
};

const enterMessage = async (
  type: HTMLDivElement,
  setMessages: Dispatch<StateUpdater<Messages[]>>,
  chat: Chat,
  user: User
) => {
  const content = toJSON(type, "ROOT", 0);

  const id = `msg-${messages.length}`;

  const newMessage: Messages = {
    id: id,
    content: content,
    sentAt: DateTime.now(),
    user: chat?.users?.find((u) => u.user?.id == user.id) as ChatRoles,
  };

  setMessages((prevMessages) => [
    ...prevMessages,
    toMessage(newMessage as Messages, chat),
  ]);

  type.innerHTML = "";

  const loadedMessage = await fetch(`/api/chats/${chat.id}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toMessage(newMessage as Messages, chat)),
  });

  if (loadedMessage) {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== id)
    );
  }
};

// function toJSON(parent: HTMLElement, tag: string): jsonTag {
//   const newTag: jsonTag = { }

//   if(tag == 'SPAN') {
//     newTag.Content = parent.textContent!
//     newTag.Style = toStyle(parent.style)!
//   }
//   else {
//     newTag.Tag = parent.tagName
//     newTag.Children = []
//   }

//   if(parent.hasChildNodes()){
//     (Array.from(parent.children) as HTMLElement[]).forEach(item => {
//       newTag.Children?.push(toJSON(item, item.tagName))
//     })
//   }

//   return newTag
// }

// const enterMessage = async (inputMessage: Signal<string>) => {
//     const id = `msg-${messages.length}`

//     const newMessage: Messages = {
//         id: id,
//         content: inputMessage.value,
//         sentAt: DateTime.now(),
//         user: chat?.users?.find(u => u.user?.id == user.id) as ChatRoles
//     }

//     setMessages((prevMessages) => [...prevMessages, message(newMessage as Messages) ]);

//     inputMessage.value = ''

//     const loadedMessage = await fetch(`/api/chats/${props.pageProps.params.id}/messages`, {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify(message(newMessage as Messages)),
//     });

//     if (loadedMessage) {
//         setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
//     }
// }
