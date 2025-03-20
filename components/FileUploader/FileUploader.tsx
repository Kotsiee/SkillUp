// deno-lint-ignore-file no-explicit-any
import { useEffect, useImperativeHandle, useState } from "preact/hooks";
import AIcon, { Icons } from "../../components/Icons.tsx";
import UploadFile from "./UploadFile.tsx";
import EditFile from "./EditFile.tsx";
import ReviewFile from "./ReviewFile.tsx";
import { fetchStorageFiles } from "./utils/FileUtils.ts";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";

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
  const selectedView = useSignal<string>("upload");
  const selectedFiles = useSignal<Files[]>([]);
  const uploadedFiles = useSignal<Files[]>([]);
  const modificationHistory = useSignal<editFile[]>([]);
  const [storageFiles, setStorageFiles] = useState<Files[]>([]);

  const openModal = () => {
    modificationHistory.value = [];
    selectedFiles.value = [];
    selectedView.value = "upload";
    close.value = false;
  };

  const upload = (files: any) => {
    console.log(files)
  };

  useImperativeHandle(thisRef, () => ({ openModal, upload }));

  useEffect(() => {
    fetchStorageFiles(fileType).then((files) => {
      setStorageFiles(files.json);
    });
  }, []);

  if (close.value) return null;

  function View({ view }: { view: string }) {
    switch (view) {
      case "upload":
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

      case "edit":
        return (
          <EditFile
            selectedFiles={selectedFiles}
            modificationHistory={modificationHistory}
            selectedView={selectedView}
          />
        );

      case "review":
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
  }

  return (
    <div class="modals">
      <div class="back" onClick={() => (close.value = true)} />
      <div class="new-file">
        <div class="modal-title">
          <h2>{title}</h2>
          <AIcon
            className="modal-exit-icon"
            startPaths={Icons.X}
            onClick={() => (close.value = true)}
          />
        </div>

        <div class="new-file-selection-container">
          {["upload", "edit", "review"].map((section) => (
            <label key={section}>
              <input
                type="radio"
                name="file-section"
                checked={selectedView.value === section}
                onChange={() => (selectedView.value = section)}
                hidden
              />
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </label>
          ))}
        </div>

        <div class="modal-content">
          <View view={selectedView.value}/>
        </div>
      </div>
    </div>
  );
}
