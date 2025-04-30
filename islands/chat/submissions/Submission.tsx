// deno-lint-ignore-file../../../components/pages/projects/submissions/SubmissionModal.tsx
import { PageProps } from '$fresh/server.ts';
import { Signal, useSignal } from '@preact/signals';
import { useChat } from '../../contexts/ChatProvider.tsx';
import { useProject } from '../../contexts/ProjectProvider.tsx';
import { useUser } from '../../contexts/UserProvider.tsx';
import ImageViewer from '../../../components/Viewers/ImageViewer.tsx';
import { VNode } from 'preact/src/index.d.ts';
import ImageController from '../../../components/Viewers/ImageController.tsx';
import { FileReference, Files, jsonTag } from '../../../lib/newtypes/index.ts';
import AudioViewer from '../../../components/Viewers/AudioViewer.tsx';
import TextViewer from '../../../components/Viewers/TextViewer.tsx';
import VideoViewer from '../../../components/Viewers/VideoViewer.tsx';
import { useEffect } from 'preact/hooks';
import RichText from '../../../components/UI/RichText.tsx';
import { Submission } from './../../../lib/newtypes/projects/submissions.ts';
import AIcon, { Icons } from '../../../components/Icons.tsx';

export default function SubmissionItem({ pageProps }: { pageProps: PageProps }) {
  const { project } = useProject();
  const { chat } = useChat();
  const { user } = useUser();

  if (!chat || !project || !user) return null;

  const submission = useSignal<Submission | null>(null);

  useEffect(() => {
    fetch(`/api/projects/submissions/submission/${pageProps.params.submissionid}`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        submission.value = data;
        console.log(data);
      });
  }, [pageProps.params]);

  if (!submission.value) return null;

  const selectedFile = useSignal<FileReference>(submission.value.files[0] as FileReference);

  const controller = useSignal<{ [ctrl: string]: Signal<any> } | null>(null);

  const switchView = (file: Files): [VNode<any> | null, VNode<any> | null] => {
    if (!file.verified || !file.fileType) return [null, null];

    switch (file.fileType.toLowerCase()) {
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
        return <OverviewTab file={selectedFile.value} />;
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

  const viewController = switchView(selectedFile.value.file!);

  const viewerType = useSignal<any>(viewController?.[0]);
  const controllerType = useSignal<any>(viewController?.[1]);

  const currentTab = useSignal<string>('Overview');
  const tabs = ['Overview', 'Controls', 'Comments', 'Review'];

  return (
    <div class="submission-viewer" role="main" aria-label="Attachment Viewer">
      {/* Top file action controls */}
      <div class="submission-viewer__actions" role="region" aria-label="File actions">
        <a
          href={`/projects/${project.id}/${chat.id}/submissions`}
          f-partial={`/projects/partials/${project.id}/${chat.id}/submissions`}
          class="submission-viewer__back-link"
          aria-label="Go back to previous view"
        >
          <AIcon startPaths={Icons.LeftChevron} size={16} /> Back
        </a>

        <div class="submission-viewer__action-buttons">
          <button class="submission-viewer__action-button" aria-label="Download file">
            Download
          </button>
          <button class="submission-viewer__action-button" aria-label="Copy file link">
            Copy Link
          </button>
          <button class="submission-viewer__action-button" aria-label="Share file">
            Share
          </button>

          <div class="submission-viewer__dropdown">
            <button
              class="submission-viewer__dropdown-toggle"
              aria-haspopup="true"
              aria-expanded="false"
              aria-label="More options"
            >
              …
            </button>
            {/* <div
              class="submission-viewer__dropdown-menu"
              role="menu"
              aria-label="More file options"
            >
              <button class="submission-viewer__dropdown-item" role="menuitem">
                Report
              </button>
              <button class="submission-viewer__dropdown-item" role="menuitem">
                Delete
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Dynamic file viewer */}
      <div class="submission-viewer__preview" role="region" aria-label="File preview">
        {viewerType.value}
      </div>

      <div class="submission-viewer__files">
        {(submission.value.files as FileReference[]).map(file => {
          return (
            <label>
              <input
                type="radio"
                checked={selectedFile.value.id === file.id}
                onInput={() => {
                  selectedFile.value = file;
                }}
                hidden
              />
              {file.publicName ?? file.file?.publicName}
            </label>
          );
        })}
      </div>

      {/* File details and tabbed info */}
      <div class="submission-viewer__details" role="region" aria-label="File details and metadata">
        <div class="submission-viewer__info">
          <h5 class="submission-viewer__title">{submission.value?.title}</h5>
          {/* <p class="submission-viewer__sent-at">{createdAtDate.toFormat("DDDD' - 'HH':'mm")}</p> */}
        </div>

        <div class="submission-viewer__tabs" role="tablist" aria-label="File metadata tabs">
          <div class="submission-viewer__tabs-nav">
            {tabs.map((tab, index) => (
              <label key={`${tab}-${index}`} class="submission-viewer__tab-label">
                <input
                  class="submission-viewer__tab-radio"
                  type="radio"
                  name="file-details-tab-nav"
                  onInput={() => (currentTab.value = tab)}
                  checked={currentTab.value === tab}
                  hidden
                  role="tab"
                  aria-selected={currentTab.value === tab}
                  aria-controls={`tab-panel-${tab}`}
                  id={`tab-${tab}`}
                />
                {tab}
              </label>
            ))}
          </div>

          <div
            class="submission-viewer__tab-panel"
            id={`tab-panel-${currentTab.value}`}
            role="tabpanel"
            aria-labelledby={`tab-${currentTab.value}`}
          >
            {switchTab(currentTab.value)}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ file }: { file: FileReference }) {
  if (!file) return null;

  return (
    <div>
      <p class="file-viewer__overview-name">{file.publicName ?? file.file?.publicName}</p>
      <p class="file-viewer__overview-type">{file.file?.fileType ?? file.file?.mimeType}</p>
      <p class="file-viewer__overview-extension">{file.file?.extension}</p>
      {Object.entries(file.file?.meta ?? []).map(([name, value]) => {
        <p class="file-viewer__overview-meta">
          {name}: {value}
        </p>;
      })}
    </div>
  );
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
