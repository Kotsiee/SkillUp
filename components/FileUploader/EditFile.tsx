import ImageEditor from "./edit/imageEditor.tsx";
import VideoEditor from "./edit/videoEditor.tsx";
import TextEditor from "./edit/textEditor.tsx";
import {
  Signal,
  useSignal,
} from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import FileCard from "../cards/FileCard.tsx";
import { useRef } from "preact/hooks";
import AudioEditor from "./edit/audioEditor.tsx";
import { EditFile, Files } from "../../lib/types/index.ts";

interface EditFileProps {
  selectedFiles: Signal<Files[]>;
  modificationHistory: Signal<EditFile[]>;
  selectedView: Signal<string>;
}

export default function EditFiles({
  selectedFiles,
  modificationHistory,
  selectedView
}: EditFileProps) {
  const selectedFile = useSignal(selectedFiles.value[0]);
  // deno-lint-ignore no-explicit-any
  const ref = useRef<any>(null);

  if (!selectedFiles.value.length) return <p>No files to edit.</p>;

  function renderEditor(file: Files) {
    if (!file.verified) return <p>Unsupported file type</p>;

    switch (file.fileType?.toLowerCase()) {
      case "image":
        return (
          <ImageEditor
            selectedFile={selectedFile.value}
            modificationHistory={modificationHistory}
            thisRef={ref}
          />
        );
      case "video":
        return <VideoEditor />;
      case "audio":
        return <AudioEditor />;
      case "code":
        return <TextEditor />;
      default:
        return <p>Unsupported file type</p>;
    }
  }

  return (
    <div class="edit-file">
      <div class="uploaded-files view-files">
        {selectedFiles.value.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            selected={selectedFile.value.id === file.id}
            onSelect={() => (selectedFile.value = file)}
            onRemove={() => {
              selectedFiles.value = selectedFiles.value.filter(
                (item) => item.id !== file.id
              );
              
              if (!selectedFiles.value.length)
              {
                selectedView.value = "upload"
                return;
              }

              selectedFile.value = selectedFiles.value[0];
            }}
          />
        ))}
      </div>

      <div class="edit-content">
        <div class="save">
          <input
            class="fileName"
            type="text"
            value={selectedFile.value.publicName}
            onInput={(val) =>
              (selectedFile.value.publicName = val.currentTarget.value)
            }
            onBlur={() => {
              selectedFiles.value = selectedFiles.value.map((item) => {
                if (selectedFile.value.id === item.id) {
                  return {
                    ...item,

                    publicName: selectedFile.value.publicName,
                  };
                }

                return item;
              });
            }}
          />

          {selectedFile.value.verified ? (
            <button class="save-btn" onClick={() => ref.current.handleSave()}>
              Save Changes
            </button>
          ) : null}
        </div>
      </div>

      {renderEditor(selectedFile.value)}
    </div>
  );
}
