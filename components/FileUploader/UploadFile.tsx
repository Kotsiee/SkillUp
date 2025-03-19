import {
  Signal,
  useSignal,
} from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { Files, User } from "../../lib/types/index.ts";
import FileCard from "../cards/FileCard.tsx";
import { processFile } from "./utils/FileUtils.ts";
import AIcon, { Icons } from "../Icons.tsx";

interface UploadFileProps {
  storageFiles: Files[];
  selectedFiles: Signal<Files[]>;
  uploadedFiles: Signal<Files[]>;
  selectedView: Signal<string>;
  multiple?: boolean;
  fileType?: string;

  path: string;
  user: User;
}

export default function UploadFile(
  {
    storageFiles,
    selectedFiles,
    uploadedFiles,
    multiple,
    fileType,
    path,
    user,
  }: UploadFileProps,
) {
  const searchText = useSignal<string>("");
  const fileLocations = [
    { name: "All", fileLocation: "" },
    { name: "Storage", fileLocation: "shared/storage" },
    { name: "Messages", fileLocation: "shared/messages" },
    { name: "Posts", fileLocation: "shared/posts" },
    { name: "Projects", fileLocation: "shared/projects" },
    { name: "Drafts", fileLocation: "drafts" },
  ];

  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    Array.from(input.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          processFile(
            file,
            e.target.result as string,
            path,
            user,
            uploadedFiles,
            selectedFiles,
            multiple,
          );
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div class="upload-file">
      <div class="actions">
        <div class="top">
          <div class="newFile-container">
            <input
              type="file"
              accept={`${fileType}`}
              onChange={handleFileUpload}
              id="newFile"
              multiple={multiple}
              hidden
            />

            <label for="newFile">+ New File</label>
          </div>

          <div class="search">
            <input
              type="text"
              placeholder="Search your files..."
              value={searchText.value}
              onInput={(val) => searchText.value = val.currentTarget.value}
            />

            <AIcon
              className="x-icon"
              startPaths={Icons.X}
              style={{ display: searchText.value ? "block" : "none" }}
              onClick={() => searchText.value = ""}
            />

            <AIcon className="search-icon" startPaths={Icons.Search} />
          </div>
        </div>

        <div class="file-locations">
          <ul>
            {fileLocations.map((location) => (
              <li key={`file-location-${location.name}`}>
                <input
                  type="radio"
                  name="file-location"
                  id={`file-location-${location.name}`}
                  hidden
                />

                <label htmlFor={`file-location-${location.name}`}>
                  {location.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {uploadedFiles.value.length
        ? (
          <div class="uploaded-files-container view-files-container">
            <h6>Uploaded Files</h6>
            <div class="uploaded-files view-files">
              {uploadedFiles.value.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  selected={selectedFiles.value.findIndex((item) =>
                    item.id === file.id
                  ) !== -1}
                  onSelect={() =>
                    selectedFiles.value.findIndex((item) =>
                        item.id === file.id
                      ) === -1
                      ? selectedFiles.value = [...selectedFiles.value, file]
                      : selectedFiles.value = selectedFiles.value.filter(
                        (item) => item.id !== file.id,
                      )}
                  onRemove={() => {
                    uploadedFiles.value = uploadedFiles.value.filter(
                      (item) => item.id !== file.id,
                    );

                    if (
                      selectedFiles.value.findIndex((item) =>
                        item.id === file.id
                      ) !== -1
                    ) {
                      selectedFiles.value = selectedFiles.value.filter(
                        (item) => item.id !== file.id,
                      );
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )
        : null}

      {storageFiles.length
        ? (
          <div class="storage-files-container view-files-container">
            <h6>All Files</h6>

            <div class="storage-files view-files">
              {storageFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  selected={selectedFiles.value.findIndex((item) =>
                    item.id === file.id
                  ) !== -1}
                  onSelect={() =>
                    selectedFiles.value.findIndex((item) =>
                        item.id === file.id
                      ) === -1
                      ? selectedFiles.value = [...selectedFiles.value, file]
                      : selectedFiles.value = selectedFiles.value.filter(
                        (item) => item.id !== file.id,
                      )}
                />
              ))}
            </div>
          </div>
        )
        : null}
    </div>
  );
}
