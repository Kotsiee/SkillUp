// deno-lint-ignore-file no-explicit-any no-unused-vars
import { PageProps } from '$fresh/server.ts';
import { useEffect, useState } from 'preact/hooks';
import {
  Signal,
  useSignal,
} from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js';
import { VNode } from 'preact/src/index.d.ts';
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import LabelSlider from '../../../components/UI/Sliders/LabelSlider.tsx';
import AIcon, { Icons } from '../../../components/Icons.tsx';
import { FileReference, Files } from '../../../lib/newtypes/index.ts';

export default function Attachment({ pageProps }: { pageProps: PageProps }) {
  const [file, setFile] = useState<FileReference | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetch(`/api/files/${pageProps.params.attId}`);
        if (!response.ok) throw new Error('Failed to fetch chat data');
        const { json } = await response.json();
        setFile(json);
      } catch (error) {
        console.error('Error fetching chat:', error);
      }
    };

    fetchFile();
  }, [pageProps.params.chatid]);

  if (!file) return null;

  const controller = useSignal<{ [ctrl: string]: Signal<any> } | null>(null);

  const switchView = (file: Files): [VNode<any> | null, VNode<any> | null] => {
    if (!file.verified) return [null, null];

    switch (file.fileType!.toLowerCase()) {
      case 'image':
        return [
          <ImageViewer file={file} controller={controller} />,
          <ImageController controller={controller} />,
        ];
      case 'video':
        return [
          <VideoViewer file={file} controller={controller} />,
          <ImageController controller={controller} />,
        ];
      case 'audio':
        return [
          <AudioViewer file={file} controller={controller} />,
          <ImageController controller={controller} />,
        ];
      case 'text':
        return [
          <TextViewer file={file} controller={controller} />,
          <ImageController controller={controller} />,
        ];
      default:
        return [null, null];
    }
  };

  const switchTab = (currentTab: string) => {
    switch (currentTab) {
      case 'Overview':
        return <OverviewTab />;
      case 'Controls':
        return <ControlsTab controller={controllerType} />;
      case 'Comments':
        return <CommentsTab />;
      case 'Review':
        return <ReviewTab />;
      default:
        return <div>Null</div>;
    }
  };

  const viewController = switchView(file.file!);

  const viewerType = useSignal<any>(viewController?.[0]);
  const controllerType = useSignal<any>(viewController?.[1]);

  const currentTab = useSignal<string>('Overview');
  const tabs = ['Overview', 'Controls', 'Comments', 'Review'];

  const createdAtDate = DateTime.fromISO(file.createdAt as any);

  return (
    <div class="attachment-viewer">
      <div class="file-actions">
        <a>Back</a>

        <div>
          <button>Download</button>
          <button>Copy Link</button>
          <button>Share</button>
          <div>
            <button>...</button>
            <div>
              <button>Report</button>
              <button>Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div class="file-viewer">{viewerType.value}</div>

      <div class="file-details">
        <div class="obj-info">
          <h5 class="title">{file.publicName}</h5>
          <p class="obj-type">{file.file?.fileType || file.file?.mimeType}</p>
          <p class="sent-at">{createdAtDate.toFormat("DDDD' - 'HH':'mm")}</p>
        </div>

        <div class="tabs">
          <div class="tabs-nav">
            {tabs.map((tab, index) => (
              <label key={`${tab}-${index}`}>
                <input
                  type="radio"
                  name="file-details-tab-nav"
                  onInput={() => {
                    currentTab.value = tab;
                  }}
                  checked={currentTab.value === tab}
                  hidden
                />
                {tab}
              </label>
            ))}
          </div>

          <div class="file-tab">{switchTab(currentTab.value)}</div>
        </div>
      </div>
    </div>
  );
}

// Message, Sender,
function OverviewTab() {
  return <div></div>;
}

function ControlsTab({
  controller,
}: {
  controller: Signal<{ [ctrl: string]: Signal<any> } | null>;
}) {
  return <div>{controller.value}</div>;
}

function ReviewTab() {
  return <div></div>;
}

function CommentsTab() {
  return <div></div>;
}
