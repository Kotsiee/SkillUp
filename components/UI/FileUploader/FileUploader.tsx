// deno-lint-ignore-file no-explicit-any
import { useEffect, useImperativeHandle, useState } from 'preact/hooks';
import AIcon, { Icons } from '../../Icons.tsx';
import UploadFile from './UploadFile.tsx';
import EditFiles from './EditFile.tsx';
import ReviewFile from './ReviewFile.tsx';
import { User, Files, EditFile } from '../../../lib/newtypes/index.ts';
import { useSignal } from '@preact/signals';

interface FileUploaderProps {
  multiple?: boolean;
  path: string;
  title: string;
  fileType?: string;
  user: User;
  uploadType?: string;
  onUpload?: (files?: Files[]) => void;
  thisRef: any;
}

export default function FileUploader({
  multiple,
  title,
  fileType,
  user,
  path,
  uploadType,
  thisRef,
  onUpload,
}: FileUploaderProps) {
  const close = useSignal(true);
  const selectedView = useSignal<string>('upload');
  const selectedFiles = useSignal<Files[]>([]);
  const uploadedFiles = useSignal<Files[]>([]);
  const modificationHistory = useSignal<EditFile[]>([]);
  const [storageFiles, setStorageFiles] = useState<Files[]>([]);

  // Open modal and reset state
  const openModal = () => {
    modificationHistory.value = [];
    selectedFiles.value = [];
    selectedView.value = 'upload';
    close.value = false;
  };

  // For external calls
  useImperativeHandle(thisRef, () => ({ openModal }));

  // Fetch existing files from storage
  useEffect(() => {
    fetch('/api/files', { method: 'GET' })
      .then(res => res.json())
      .then(setStorageFiles);
  }, []);

  if (close.value) return null;

  // View switcher logic
  const View = ({ view }: { view: string }) => {
    switch (view) {
      case 'upload':
        return (
          <UploadFile
            storageFiles={storageFiles}
            selectedFiles={selectedFiles}
            uploadedFiles={uploadedFiles}
            selectedView={selectedView}
            multiple={multiple}
            fileType={fileType}
            path={path}
            user={user}
          />
        );
      case 'edit':
        return (
          <EditFiles
            selectedFiles={selectedFiles}
            modificationHistory={modificationHistory}
            selectedView={selectedView}
          />
        );
      case 'review':
        return (
          <ReviewFile
            selectedFiles={selectedFiles}
            modificationHistory={modificationHistory}
            uploadType={uploadType}
            onUpload={onUpload}
            selectedView={selectedView}
            close={close}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div class="file-uploader-modal">
      <div class="file-uploader-modal__backdrop" onClick={() => (close.value = true)} />
      <div
        class="file-uploader-modal__container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fileUploaderTitle"
      >
        <div class="file-uploader-modal__header">
          <h1 id="fileUploaderTitle" class="file-uploader-modal__title">
            {title}
          </h1>
          <AIcon
            className="file-uploader-modal__exit"
            startPaths={Icons.X}
            aria-label="Close"
            onClick={() => (close.value = true)}
          />
        </div>

        <div class="file-uploader-modal__tabs" role="tablist">
          {['upload', 'edit', 'review'].map(section => (
            <label
              key={section}
              class={`file-uploader-modal__tab ${
                selectedView.value === section ? 'file-uploader-modal__tab--active' : ''
              }`}
              role="tab"
              aria-selected={selectedView.value === section}
              tabIndex={0}
              onClick={() => (selectedView.value = section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </label>
          ))}
        </div>

        <div class="file-uploader-modal__content" role="tabpanel">
          <View view={selectedView.value} />
        </div>
      </div>
    </div>
  );
}
