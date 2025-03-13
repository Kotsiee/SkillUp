// deno-lint-ignore-file no-explicit-any
import {
  computed,
  Signal,
  useSignal,
} from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { editFile, Files, User } from "../../lib/types/index.ts";
import { useEffect, useImperativeHandle, useRef } from "preact/hooks";
import { useState } from "preact/hooks";
import { identifyFile } from "../../lib/utils/fileDetector.ts";
import AIcon, { Icons } from "../../components/Icons.tsx";
import { JSX } from "preact/jsx-runtime";
import ImageEditor from "./edit/imageEditor.tsx";
import FileCard from "../../components/cards/FileCard.tsx";
import VideoEditor from "./edit/videoEditor.tsx";
import AudioEditor from "./edit/audioEditor.tsx";
import TextEditor from "./edit/textEditor.tsx";

interface IFileUploader {
  multiple?: boolean;
  path: string;
  title: string;
  fileType?: string;
  user: User;

  uploadType?: string | "profile" | "banner";
  onUpload?: (files?: Files[]) => void;
  thisRef: any;
}

export default function FileUploader(
  { multiple, title, fileType, user, path, uploadType, thisRef, onUpload }:
    IFileUploader,
) {
  const close = useSignal<boolean>(true);

  const selectedView = useSignal<string>("upload");
  const selectedFiles = useSignal<Files[]>([]);
  const modificationHistory = useSignal<editFile[]>([]);
  const [storageFiles, setStorageFiles] = useState<Files[] | null>(null);

  const openModal = () => {
    modificationHistory.value = [];
    selectedFiles.value = [];
    selectedView.value = "upload";
    close.value = false;
  };

  useImperativeHandle(thisRef, () => ({
    openModal,
  }));

  if (close.value) {
    return null;
  }

  useEffect(() => {
    fetch(
      `/api/storage/files${
        fileType ? `?types=${fileType.replace(" ", "+")}` : ""
      }`,
      {
        method: "GET",
      },
    )
      .then((res) => res.json())
      .then((res) => {
        setStorageFiles(res.json);
      });
  }, []);

  return (
    <div class="modals">
      <div class="back"
      onClick={() => { close.value = true }}/>
      <div class="new-file">
        <div class="modal-title">
          <h2>{title}</h2>
          <AIcon
            className="modal-exit-icon"
            startPaths={Icons.X}
            onClick={() => {close.value = true;}}
          />
        </div>
        <div class="new-file-selection-container">
          <ul>
            <li>
              <input
                class="select-file-section"
                type="radio"
                name="select-file-section"
                id="upload"
                onChange={() => selectedView.value = "upload"}
                checked={selectedView.value === "upload"}
                hidden
              />
              <label for="upload">Upload</label>
            </li>

            <li>
              <input
                class="select-file-section"
                type="radio"
                name="select-photo-section"
                id="edit"
                onChange={() => selectedView.value = "edit"}
                checked={selectedView.value === "edit"}
                hidden
              />
              <label for="edit">Edit</label>
            </li>

            <li>
              <input
                class="select-file-section"
                type="radio"
                name="select-file-section"
                id="review"
                onChange={() => selectedView.value = "review"}
                checked={selectedView.value === "review"}
                hidden
              />
              <label for="review">Review</label>
            </li>
          </ul>
        </div>

        <div class="modal-content">
          <UploadFile
            storageFiles={storageFiles}
            selectedFiles={selectedFiles}
            selectedView={selectedView}
            multiple={multiple}
            fileType={fileType}
            user={user}
            path={path}
          />

          <EditFile
            selectedFiles={selectedFiles}
            selectedView={selectedView}
            modificationHistory={modificationHistory}
          />

          <ReviewFile
            selectedFiles={selectedFiles}
            modificationHistory={modificationHistory}
            selectedView={selectedView}
            uploadType={uploadType}
            onUpload={onUpload}
            close={close}
          />
        </div>
      </div>
    </div>
  );
}

const UploadFile = (
  { storageFiles, selectedFiles, selectedView, fileType, multiple, user, path }:
    {
      storageFiles: Files[] | null;
      selectedFiles: Signal<Files[]>;
      selectedView: Signal<string>;
      fileType?: string;
      multiple?: boolean;

      path: string;
      user: User;
    },
) => {
  if (selectedView.value !== "upload") return null;

  const uploadedFiles = useSignal<Files[]>([]);

  const searchText = useSignal<string>("");
  const fileLocations = [
    { name: "All", fileLocation: "" },
    { name: "Storage", fileLocation: "shared/storage" },
    { name: "Messages", fileLocation: "shared/messages" },
    { name: "Posts", fileLocation: "shared/posts" },
    { name: "Projects", fileLocation: "shared/projects" },
    { name: "Drafts", fileLocation: "drafts" },
  ];

  const selectFile = (selectedItem: Files) => {
    if (selectedFiles.value.find((item) => item.id === selectedItem.id)) {
      selectedFiles.value = [
        ...selectedFiles.value.filter((item) => item.id !== selectedItem.id),
      ];
    } else {
      selectedFiles.value = [...selectedFiles.value, selectedItem];
    }
  };

  const processFile = (file: File, result: string) => {
    const type = identifyFile(file);

    const newFile: Files = {
      id: crypto.randomUUID(),
      user: user.id,
      filePath: path,
      storedName: file.name,
      publicName: file.name,
      mimeType: file.type,
      publicURL: result,
      fileType: type.category,
      verified: type.verified,
      extension: type.extension,
      isUpload: true,
      meta: {
        application: type.application,
        size: file.size,
      },
    };

    uploadedFiles!.value = multiple
      ? [...uploadedFiles!.value, newFile]
      : [newFile];

    selectFile(newFile);
  };

  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    Array.from(input.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) processFile(file, e.target.result as string);
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
          <div class="uploaded-files-container">
            <h6>Uploaded Files</h6>
            <div class="uploaded-files">
              {uploadedFiles.value.map((file) => {
                return (
                  <FileCard
                    key={`${file.id}`}
                    file={file}
                    onRemove={() => {
                      uploadedFiles.value = uploadedFiles.value.filter((
                        item,
                      ) => item !== file);
                    }}
                    selected={selectedFiles.value.findIndex((item) =>
                      item.id === file.id
                    ) !== -1}
                    onSelect={() => selectFile(file)}
                  />
                );
              })}
            </div>
          </div>
        )
        : null}

      {storageFiles
        ? (
          <div class="storage-files-container">
            <h6>All Files</h6>
            <div class="storage-files">
              {storageFiles.map((file) => {
                return (
                  <FileCard
                    key={`${file.id}`}
                    file={file}
                    selected={selectedFiles.value.findIndex((item) =>
                      item.id === file.id
                    ) !== -1}
                    onSelect={() => selectFile(file)}
                  />
                );
              })}
            </div>
          </div>
        )
        : <h1>Nothing Here</h1>}
    </div>
  );
};

interface IReviewFile {
  selectedFiles: Signal<Files[]>;
  modificationHistory: Signal<editFile[]>;
  selectedView: Signal<string>;
  uploadType: string | undefined;
  onUpload?: (files?: Files[]) => void;
  close: Signal<boolean>
}

const ReviewFile = (
  { selectedFiles, modificationHistory, selectedView, uploadType, onUpload, close }: IReviewFile,
) => {
  if (selectedView.value !== "review") return null;

  const img = useSignal<string[]>([]);

  const outputFiles = computed(() => {
    // 1) Gather all saved files
    const saved = modificationHistory.value
      .filter((item) => item.saved)
      .map((item) => item.file);

    // 2) Add currently selected files that are NOT already in saved
    const unsaved = selectedFiles.value.filter((item) =>
      !saved.some((s) => s.id === item.id)
    );

    // 3) Combine them in a single array
    return [...saved, ...unsaved];
  });

  if (!outputFiles.value.length) return null;

  const uploadFile = async (file: Files) => {
    const body = new FormData();
    body.set("file", JSON.stringify(file));

    await fetch("/api/storage/files", {
      method: "POST",
      body: body,
    });
  };

  const profileUpload = async (file: Files) => {
    const fileTemplate: Files = {
      ...file,
      extension: "webp",
      mimeType: "image/webp",
      filePath: "profile/avatar",
      privacyLvl: "public",
      verified: true,

      isUpload: true,
    };

    const imageSmall = await standarisedImage(file.publicURL!, 32, 32, "webp");
    const fileSmall: Files = {
      ...fileTemplate,
      id: crypto.randomUUID(),
      publicURL: imageSmall,
      publicName: "Profile Picture - Small",
      storedName: "pp32.webp",
      meta: {
        application: "WebP Image",
        size: getBase64FileSize(imageSmall),
      },
    };

    const imageMedium = await standarisedImage(
      file.publicURL!,
      128,
      128,
      "webp",
    );
    const fileMedium: Files = {
      ...fileTemplate,
      id: crypto.randomUUID(),
      publicURL: imageMedium,
      publicName: "Profile Picture - Medium",
      storedName: "pp128.webp",
      meta: {
        application: "WebP Image",
        size: getBase64FileSize(imageMedium),
      },
    };

    const imageLarge = await standarisedImage(
      file.publicURL!,
      512,
      512,
      "webp",
    );
    const fileLarge: Files = {
      ...fileTemplate,
      id: crypto.randomUUID(),
      publicURL: imageLarge,
      publicName: "Profile Picture - Large",
      storedName: "pp512.webp",
      meta: {
        application: "WebP Image",
        size: getBase64FileSize(imageLarge),
      },
    };

    uploadFile(fileSmall);
    uploadFile(fileMedium);
    uploadFile(fileLarge);

    return [fileSmall, fileMedium, fileLarge];
  };

  const standarisedImage = async (
    url: string,
    width?: number,
    height?: number,
    format?: "png" | "jpeg" | "webp",
  ) => {
    const formData = new FormData();
    formData.set("url", url);
    let apiURL = "/api/image/process";
    if (width || height || format) {
      apiURL += "?";

      if (width) apiURL += `w=${width}&`;
      if (height) apiURL += `h=${height}&`;
      if (format) apiURL += `format=${format}`;
    }

    const newImage = await fetch(apiURL, {
      method: "POST",
      body: formData,
    });

    return await newImage.text();
  };

  return (
    <div class="reviewfile">
      {outputFiles.value.map((item) => {
        return (
          <FileCard
            key={`${item.id}`}
            file={item}
          />
        );
      })}

      <div>
        <button
          onClick={async () => {
            const fileArray = await profileUpload(outputFiles.value[0]);

            img.value = fileArray.map((i) => i.publicURL!);

            onUpload?.(fileArray)
            close.value = true
          }}
        >
          Upload
        </button>

        <div>
          {img.value.map((item) => {
            return <img src={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

interface EditFileProps {
  selectedFiles: Signal<Files[]>;
  selectedView: Signal<string>;
  modificationHistory: Signal<editFile[]>;
}

const EditFile = (props: EditFileProps) => {
  const {
    selectedFiles,
    selectedView,
    modificationHistory,
  } = props;

  if (selectedView.value !== "edit") return null;
  if (!selectedFiles.value.length) return <p>No files to edit.</p>;

  const ref = useRef<any>(null);

  const validTypes = ["code", "image", "video", "audio"];
  const validMimeTypes = ["text/plain", "image/*", "video/*", "audio/*"];

  const selectedFile = useSignal(selectedFiles.value[0]);

  function matchesMimeType(mimeType: string): boolean {
    return validMimeTypes.some((pattern) => {
      if (pattern.endsWith("/*")) {
        const prefix = pattern.slice(0, pattern.indexOf("/*"));
        return mimeType.startsWith(prefix);
      } else {
        return mimeType === pattern;
      }
    });
  }

  const switchEdit = (item?: Files) => {
    if (!item) {
      return null;
    }

    const mime = item.mimeType?.toLowerCase() ?? "";
    const type = item.fileType?.toLowerCase() ?? "";

    if (!matchesMimeType(mime) && !validTypes.includes(type)) {
      return <EditDefault />;
    }

    switch (type) {
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
        return <EditDefault />;
    }
  };

  const EditContent = useSignal<JSX.Element | null>(
    switchEdit(selectedFile.value),
  );

  return (
    <div class="edit-file">
      <div class="select-file-container">
        {selectedFiles.value.length
          ? (
            <div class="select-file">
              {selectedFiles.value.map((file) => {
                return (
                  <FileCard
                    key={`${file.id}`}
                    file={file}
                    onRemove={() => {
                      selectedFiles.value = selectedFiles.value.filter((
                        item,
                      ) => item !== file);

                      if (selectedFiles.value.length === 0) {
                        selectedView.value = "upload";
                      }

                      if (selectedFile.value.id === file.id) {
                        selectedFile.value = selectedFiles.value[0];
                      }
                    }}
                    selected={selectedFile
                      ? selectedFile.value.id === file.id
                      : false}
                    onSelect={() => {
                      selectedFile.value = file;
                      EditContent.value = switchEdit(selectedFile.value);
                    }}
                  />
                );
              })}
            </div>
          )
          : null}
      </div>

      <div class="edit-content">
        <div class="save">
          <input
            class="fileName"
            type="text"
            value={selectedFile.value.publicName}
            onInput={(val) =>
              selectedFile.value.publicName = val.currentTarget.value}
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
          <button
            class="save-btn"
            onClick={() => ref.current.handleSave()}
          >
            Save&nbsp;Changes
          </button>
        </div>
        {EditContent.value}
      </div>
    </div>
  );
};

const EditDefault = () => {
  return (
    <div>
      <h1>Bitch Lasagne</h1>
    </div>
  );
};

function getBase64FileSize(base64String: string) {
  // Remove metadata part (if present)
  const base64WithoutPrefix = base64String.split(",")[1] || base64String;

  // Calculate padding (if any)
  const padding = (base64WithoutPrefix.match(/=/g) || []).length;

  // Compute file size in bytes
  const fileSizeInBytes = (base64WithoutPrefix.length * 3) / 4 - padding;

  return fileSizeInBytes; // Returns size in bytes
}
