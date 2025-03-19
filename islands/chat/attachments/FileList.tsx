import { useEffect, useState } from "preact/hooks";
import FileCard from "../../../components/cards/FileCard.tsx";
import { Chat } from "../../../lib/types/chats.ts";
import { FileReference } from "../../../lib/types/files.ts";
import { FileMessage, Messages } from "../../../lib/types/messages.ts";
import { Signal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";

interface IFileList {
  chat: Chat | null;
  selectedFile: Signal<FileMessage | null>;
  selectedFiles: Signal<FileMessage[]>;
  multiSelect: boolean;
}

export default function FileList(
  { chat, selectedFile, selectedFiles, multiSelect }: IFileList,
) {
  if (!chat) return null;
  const [messages, setMessages] = useState<Messages[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `/api/chats/${chat.id}/messages?hasAttachments=True`,
        );
        if (!res.ok) throw new Error("Failed to load messages");
        const { json } = await res.json();
        setMessages(json);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  if (!messages.length) return null;

  const files = messages.flatMap((msg) =>
    msg.attachments as FileReference[]
  ) as FileReference[];

  return (
    <div>
      {files.map((fileRef) => {
        const file = fileRef.file!;
        return (
          <FileCard
            file={file}
            selected={(selectedFiles.value.findIndex((item) =>
              item.fileRef.id === fileRef.id
            ) !== -1) || selectedFile.value?.fileRef.id === fileRef.id}
            onSelect={() => {
              const newFileRef = {
                fileRef,
                message: messages.find((item) => item.id === fileRef.entityId),
              };
              if (multiSelect) {
                if (
                  !selectedFiles.value.find((item) =>
                    item.fileRef.id === fileRef.id
                  )
                ) {
                  selectedFiles.value = [...selectedFiles.value, newFileRef];
                  selectedFile.value = newFileRef;
                } else {
                  selectedFiles.value = selectedFiles.value.filter((item) =>
                    item.fileRef.id !== fileRef.id
                  );
                  selectedFile.value = null;
                }
              } else {
                selectedFile.value =
                  selectedFile.value?.fileRef.id !== fileRef.id
                    ? newFileRef
                    : null;
              }
            }}
          />
        );
      })}
    </div>
  );
}
