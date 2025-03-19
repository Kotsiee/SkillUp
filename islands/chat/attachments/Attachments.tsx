import { useEffect, useState } from "preact/hooks";
import { PageProps } from "$fresh/server.ts";
import {
  useSignal,
} from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import {
  Chat,
  FileMessage,
} from "../../../lib/types/index.ts";
import PreviewFile from "./PreviewFile.tsx";
import FileList from "./FileList.tsx";

export default function Attachments({ pageProps }: { pageProps: PageProps }) {
  const [chat, setChat] = useState<Chat | null>(null);
  const selectedFile = useSignal<FileMessage | null>(null);
  const selectedFiles = useSignal<FileMessage[]>([]);
  const multiSelect = useSignal<boolean>(false);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await fetch(
          `/api/chats/${pageProps.params.chatid}/chat`,
        );
        if (!response.ok) throw new Error("Failed to fetch chat data");
        const { json } = await response.json();
        setChat(json);
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };

    fetchChat();
  }, [pageProps.params.chatid]);

  return (
    <div class="attachments">
      <div class="actions actions-container">
        <div class="actions">
          <button class="new">New +</button>
          <button>Select</button> {/**Select, Deselect, Select All */}

          <div class="actions">
            <button>Select All</button>
            <button>Download</button>
            <button>Share</button>
          </div>
        </div>

        <div class="actions">
          <button>Report</button>
          <button>Delete</button>
        </div>
      </div>

      <div class="items">
        <div class="items-container">
          <FileList
            chat={chat}
            selectedFile={selectedFile}
            selectedFiles={selectedFiles}
            multiSelect={multiSelect.value}
          />
        </div>
      </div>

      <PreviewFile fileRef={selectedFile.value} />
    </div>
  );
}