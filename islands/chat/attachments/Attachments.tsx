import { PageProps } from '$fresh/server.ts';
import { useSignal } from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js';
import PreviewFile from './PreviewFile.tsx';
import FileList from './FileList.tsx';
import { FileMessage } from '../../../lib/newtypes/index.ts';
import { useChat } from '../../contexts/ChatProvider.tsx';

export default function Attachments({ pageProps }: { pageProps: PageProps }) {
  const selectedFile = useSignal<FileMessage | null>(null);
  const selectedFiles = useSignal<FileMessage[]>([]);
  const multiSelect = useSignal<boolean>(false);
  const { chat } = useChat();

  if (!chat) return null;

  return (
    <div class="attachments chat-layout__panel--right__body">
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
