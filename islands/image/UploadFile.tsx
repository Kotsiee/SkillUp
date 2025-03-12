import {
  computed,
  Signal,
  useSignal,
} from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import {
  editFile,
  Files,
  FileTypesImages,
  User,
} from "../../lib/types/index.ts";
import { useEffect, useImperativeHandle, useRef } from "preact/hooks";
import { useState } from "preact/hooks";
import { identifyFile } from "../../lib/utils/fileDetector.ts";
import AIcon, { Icons } from "../../components/Icons.tsx";
import { JSX } from "preact/jsx-runtime";
import CircleCrop from "./imageAdjust.tsx";

interface IFileUploader {
  multiple?: boolean;
  path: string;
  title: string;
  fileType?: string;
  user: User;

  uploadType?: string | "profile" | "banner";
}

export default function FileUploader(
  { multiple, title, fileType, user, path, uploadType }: IFileUploader,
) {
  const selectedView = useSignal<string>("upload");
  const selectedFiles = useSignal<Files[]>([]);
  const modificationHistory = useSignal<editFile[]>([]);
  const [storageFiles, setStorageFiles] = useState<Files[] | null>(null);

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
      <div class="new-file">
        <h2>{title}</h2>
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
      user: user,
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

const ReviewFile = (
  { selectedFiles, modificationHistory, selectedView, uploadType }: {
    selectedFiles: Signal<Files[]>;
    modificationHistory: Signal<editFile[]>;
    selectedView: Signal<string>;
    uploadType: string | undefined;
  },
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

  function getBase64FileSize(base64String: string) {
    // Remove metadata part (if present)
    const base64WithoutPrefix = base64String.split(",")[1] || base64String;
  
    // Calculate padding (if any)
    const padding = (base64WithoutPrefix.match(/=/g) || []).length;
  
    // Compute file size in bytes
    const fileSizeInBytes = (base64WithoutPrefix.length * 3) / 4 - padding;
  
    return fileSizeInBytes; // Returns size in bytes
  }

  const uploadFile = async (file: Files) => {
    const body = new FormData();
    body.set("file", JSON.stringify(file));

    await fetch("/api/storage/files", {
      method: "POST",
      body: body,
    });
  }

  const profileUpload = async (file: Files) => {

    const fileTemplate: Files = {
      ...file,
      extension: "webp",
      mimeType: "image/webp",
      filePath: "profile/avatar",
      privacyLvl: "public",
      verified: true,

      isUpload: true
    }

    const imageSmall = await standarisedImage(file.publicURL!, 32, 32, "webp");
    const fileSmall: Files = {
      ...fileTemplate,
      id: crypto.randomUUID(),
      publicURL: imageSmall,
      publicName: "Profile Picture - Small",
      storedName: "pp32.webp",
      meta: {
        application: "WebP Image",
        size: getBase64FileSize(imageSmall)
      }
    };

    const imageMedium = await standarisedImage(file.publicURL!, 128, 128, "webp");
    const fileMedium: Files = {
      ...fileTemplate,
      id: crypto.randomUUID(),
      publicURL: imageMedium,
      publicName: "Profile Picture - Medium",
      storedName: "pp128.webp",
      meta: {
        application: "WebP Image",
        size: getBase64FileSize(imageMedium)
      }
    };

    const imageLarge = await standarisedImage(file.publicURL!, 512, 512, "webp");
    const fileLarge: Files = {
      ...fileTemplate,
      id: crypto.randomUUID(),
      publicURL: imageLarge,
      publicName: "Profile Picture - Large",
      storedName: "pp512.webp",
      meta: {
        application: "WebP Image",
        size: getBase64FileSize(imageLarge)
      }
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

            img.value = fileArray.map(i => i.publicURL!)
          }}
        >
          Upload
        </button>

        <div>
          {img.value.map(item => {
            return (<img src={item}/>)
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
          <EditImage
            selectedFile={selectedFile.value}
            modificationHistory={modificationHistory}
            thisRef={ref}
            onSave={() => {
            }}
          />
        );
      case "video":
        return <EditVideo />;
      case "audio":
        return <EditAudio />;
      case "code":
        return <EditText />;
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

interface EditImageProps {
  selectedFile: Files;
  modificationHistory: Signal<editFile[]>;
  onSave?: (image?: string) => void;

  thisRef?: any;
}

const EditImage = (props: EditImageProps) => {
  const ref = useRef<any>(null);
  const { selectedFile, modificationHistory, onSave } = props;

  // Local signals for transformations
  const rotate = useSignal<number>(0);
  const scale = useSignal<number>(100);
  const flipX = useSignal<boolean>(false);
  const flipY = useSignal<boolean>(false);
  const lastPosX = useSignal<number>(0);
  const lastPosY = useSignal<number>(0);

  // On component mount (or whenever `selectedFile` changes),
  // load transformations from modificationHistory if they exist
  useEffect(() => {
    const existingEntry = modificationHistory.value.find((item) =>
      item.file.id === selectedFile.id
    );
    const t = existingEntry?.transformations?.image;

    rotate.value = t?.rotation ?? 0;
    scale.value = t?.scale ?? 100;
    flipX.value = t?.flipX ?? false;
    flipY.value = t?.flipY ?? false;
    lastPosX.value = t?.lastPosX ?? 0;
    lastPosY.value = t?.lastPosY ?? 0;
  }, [selectedFile]);

  // Whenever any transform changes, update the modificationHistory automatically
  useEffect(() => {
    // 1) Find or create the editFile entry
    const existingIndex = modificationHistory.value.findIndex(
      (item) => item.file.id === selectedFile.id,
    );

    let newHistory = [...modificationHistory.value];

    // If there's no record for this file, create one
    if (existingIndex === -1) {
      newHistory.push({
        file: selectedFile,
        transformations: { image: {} },
      });
    }

    // 2) Update transformations
    newHistory = newHistory.map((item) => {
      if (item.file.id !== selectedFile.id) return item;

      return {
        ...item,
        transformations: {
          ...item.transformations,
          image: {
            rotation: rotate.value,
            scale: scale.value,
            flipX: flipX.value,
            flipY: flipY.value,
            lastPosX: lastPosX.value,
            lastPosY: lastPosY.value,
          },
        },
      };
    });

    modificationHistory.value = newHistory;
  }, [
    rotate.value,
    scale.value,
    flipX.value,
    flipY.value,
    lastPosX.value,
    lastPosY.value,
  ]);

  // Example "Save Changes" handler
  const handleSave = async () => {
    const existingIndex = modificationHistory.value.findIndex(
      (item) => item.file.id === selectedFile.id,
    );

    if (existingIndex) {
      const image = await ref.current.generatePreview();

      const updated = modificationHistory.value.map((item) =>
        item.file.id === selectedFile.id
          ? {
            ...item,
            saved: true,
            file: { ...item.file, publicURL: image, isUpload: true },
          }
          : item
      );

      modificationHistory.value = updated;

      if (onSave) onSave(image);
    }

    // Optional callback if parent wants to do more on save
    if (onSave) onSave();
  };

  useImperativeHandle(props.thisRef, () => ({
    handleSave,
  }));

  return (
    <div class="edit-image">
      <div class="edit-area">
        <div class="bed" />
        <CircleCrop
          size={300}
          img={selectedFile.isUpload
            ? selectedFile.publicURL
            : `http://localhost:8000/api/image/proxy?url=${selectedFile.publicURL}`}
          zoom={scale}
          rotate={rotate}
          flipX={flipX}
          flipY={flipY}
          xPos={lastPosX}
          yPos={lastPosY}
          thisRef={ref}
        />
        <div class="bed" />
      </div>

      <div class="controls">
        <div class="rotation">
          <p>Rotation</p>

          <div class="rotation-input-container">
            <div class="rotation-input">
              <LabelSlider value={rotate} min={-180} max={180}>
                <AIcon startPaths={Icons.Filter} size={16} />
              </LabelSlider>

              <input
                type="number"
                value={rotate.value}
                min={-180}
                max={180}
                step={1}
                onInput={(val) =>
                  rotate.value = Number.parseInt(val.currentTarget.value)}
              />
              <p>°</p>
            </div>
          </div>

          <div class="fixed-rotate">
            <button
              onClick={() => {
                if ((rotate.value - 90) <= -180) {
                  const remainer = 180 + (rotate.value - 90);
                  rotate.value = 180 - remainer;
                } else {
                  rotate.value -= 90;
                }
              }}
            >
              <AIcon startPaths={Icons.Filter} size={16} />
            </button>

            <button
              onClick={() => {
                if ((rotate.value + 90) >= 180) {
                  const remainer = 180 - (rotate.value + 90);
                  rotate.value = -180 + remainer;
                } else {
                  rotate.value += 90;
                }
              }}
            >
              <AIcon startPaths={Icons.Filter} size={16} />
            </button>

            <button onClick={() => flipX.value = !flipX.value}>
              <AIcon startPaths={Icons.Filter} size={16} />
            </button>

            <button
              onClick={() => flipY.value = !flipY.value}
            >
              <AIcon startPaths={Icons.Filter} size={16} />
            </button>
          </div>
        </div>

        <div class="scale">
          <p>Scale</p>

          <div class="scale-input-container">
            <div class="scale-input">
              <LabelSlider value={scale} min={50} max={200}>
                <AIcon startPaths={Icons.Filter} size={16} />
              </LabelSlider>

              <input
                type="number"
                value={scale.value}
                min={50}
                max={200}
                onInput={(val) =>
                  scale.value = Number.parseInt(val.currentTarget.value)}
              />
              <p>%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditVideo = () => {
  return (
    <div>
      <h1>Video</h1>
    </div>
  );
};

const EditAudio = () => {
  return (
    <div>
      <h1>Audi</h1>
    </div>
  );
};

const EditText = () => {
  return (
    <div>
      <h1>Text</h1>
    </div>
  );
};

interface IFileCard {
  file: Files;
  selected?: boolean;
  onRemove?: (e?: any) => void;
  onSelect?: (e?: any) => void;
}

const FileCard = ({ file, selected, onRemove, onSelect }: IFileCard) => {
  return (
    <div class={`file-card${selected ? " selected" : ""}`}>
      <div
        class="file-card-container"
        onClick={(e) => onSelect ? onSelect(e) : null}
      >
        <div class="file-image">
          <img class="background" src={fileImage(file)} loading="lazy" />
          <img class="foreground" src={fileImage(file)} loading="lazy" />
        </div>

        <div class="file-details">
          <p class="title">{file.publicName}</p>
        </div>
      </div>

      {onRemove
        ? (
          <div class="file-actions-container">
            <div class="file-actions">
              <AIcon
                onClick={() => onRemove()}
                className="file-remove"
                startPaths={Icons.X}
              />
            </div>
          </div>
        )
        : null}
    </div>
  );
};

const fileImage = (file: Files) => {
  if (file.verified && file.fileType === "Image") {
    return file.publicURL;
  } else if (file.fileType) {
    return `/assets/images/${FileTypesImages[file.fileType]}`;
  }
};

function LabelSlider(
  { value, min, max, children, className }:
    & JSX.HTMLAttributes<HTMLDivElement>
    & { value: Signal<number>; min: number; max: number },
) {
  let isDragging = false;
  let startX = 0;
  let startValue = value.value;

  const startDrag = (event: MouseEvent | TouchEvent) => {
    isDragging = true;
    startX = "touches" in event ? event.touches[0].clientX : event.clientX;
    startValue = value.value;

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", onDrag);
    document.addEventListener("touchend", stopDrag);
  };

  const onDrag = (event: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const currentX = "touches" in event
      ? event.touches[0].clientX
      : event.clientX;
    const delta = currentX - startX; // Calculate movement
    const sensitivity = 0.5; // Adjust sensitivity (smaller = more precise)

    let newValue = Math.min(
      max,
      Math.max(min, startValue + delta * sensitivity),
    );
    value.value = Math.round(newValue); // Ensure integer values
  };

  const stopDrag = () => {
    isDragging = false;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", onDrag);
    document.removeEventListener("touchend", stopDrag);
  };

  return (
    <div class={`label-slider ${className}`}>
      {/* Hidden Range Input (Still Functional) */}
      <input
        type="range"
        id="test"
        min={min}
        max={max}
        value={value.value}
        onInput={(e) => (value.value = Number(e.currentTarget.value))}
        hidden
      />

      {/* Label Becomes the Slider */}
      <label
        for="test"
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        style={{
          cursor: "ew-resize",
          userSelect: "none",
        }}
      >
        {children}
      </label>
    </div>
  );
}

/**
 *
 *
                const base64Data = image.split(",")[1];
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
                const byteArray = new Uint8Array(byteNumbers);
                const imageBlob = new Blob([byteArray], { type: "image/png" });

                const file = new File([imageBlob], "image.png", { type: "image/png" });

                // Append to FormData
                const formData = new FormData();
                formData.append("file", file, "image.png");

                const newImage = await fetch(`/api/image/resize`, {
                  method: "POST",
                  body: formData,
              })

              const blob = await newImage.blob()

              const reader = new FileReader();
              reader.onloadend = () => {
                console.log(reader.result)
                img.value = reader.result as string
              };
              reader.readAsDataURL(blob)
 *
 */
