// deno-lint-ignore-file no-explicit-any
import { useState, useEffect, useContext } from 'preact/hooks';
import { createContext } from 'preact';
import { PageProps } from '$fresh/server.ts';
import { Chat } from '../../lib/newtypes/index.ts';

const ChatContext = createContext<any>(null);

export function ChatProvider({
  pageProps,
  children,
}: {
  pageProps: PageProps;
  children: preact.ComponentChildren;
}) {
  const [chat, setChat] = useState<Chat | null>(null);

  async function fetchChat(c: string): Promise<Chat | null> {
    try {
      const response = await fetch(`/api/chats/${c}`);
      if (!response.ok) throw new Error('Failed to fetch chat data');
      const { json } = await response.json();
      setChat(json);
      return chat;
    } catch (error) {
      console.error('Error fetching chat:', error);
      return null;
    }
  }

  useEffect(() => {
    if ((!chat || chat.id !== pageProps.params.chatid) && pageProps.params.chatid) {
      console.log('fetching chat');
      fetchChat(pageProps.params.chatid);
    }
  }, [pageProps]);

  return <ChatContext.Provider value={{ chat, fetchChat }}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
