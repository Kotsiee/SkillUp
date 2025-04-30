// deno-lint-ignore-file no-explicit-any
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { toJSON, toMessage } from '../../../lib/utils/messages.ts';
import { Chat, Files, Messages, User } from '../../../lib/newtypes/index.ts';

export async function handleSendMessage(
  quillRef: any,
  setMessages: any,
  chat: Chat,
  user: User,
  fileUploader: any,
  attachments: Files[]
) {
  if (!quillRef.current) return;

  console.log(fileUploader, attachments);

  const content = toJSON(quillRef.current.root, 'ROOT', 0);
  if (!content) return;

  const newMessage: Messages = {
    id: crypto.randomUUID(),
    content,
    sentAt: DateTime.now(),
    user: user.id,
    attachments,
  };

  setMessages((prevMessages: any) => [...prevMessages, toMessage(newMessage, chat)]);
  quillRef.current.root.innerHTML = '';

  try {
    await fetch(`/api/chats/${chat.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toMessage(newMessage, chat)),
    });
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}
