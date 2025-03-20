// deno-lint-ignore-file no-explicit-any
import { MutableRef } from "preact/hooks/src/index.d.ts";
import { handleSendMessage } from "./MessagesUtils.ts";

export function KeyboardBindings(
  quillRef: any,
  setMessages: (update: (prevMessages: Messages[]) => Messages[]) => void,
  chat: Chat,
  user: User,
  openStateAdvancedText: any,
  fileUploader: MutableRef<any>,
  attachments: Files[],
) {
  return {
    tab: {
      key: 9,
      handler: (range: any, context: any) => {
        if (context.format.list) {
          quillRef.current?.format("indent", "+1");
        } else {
          quillRef.current?.insertText(range.index, "\t");
        }
      },
    },
    enter: {
      key: "Enter",
      handler: function (_range: any, _context: any) {
        if (openStateAdvancedText.value) return true;
        else {
          if (quillRef.current?.root) {
            handleSendMessage(quillRef, setMessages, chat, user, fileUploader, attachments);
          }
        }
      },
    },
  };
}
