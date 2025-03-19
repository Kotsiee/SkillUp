import { Signal, computed } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { Files, editFile } from "../../lib/types/index.ts";
import FileCard from "../cards/FileCard.tsx";
import { getBase64FileSize, standardizeImage } from "./utils/ImageUtils.ts";

interface ReviewFileProps {
  selectedFiles: Signal<Files[]>;
  modificationHistory: Signal<editFile[]>;
  uploadType?: string;
  onUpload?: (files?: Files[]) => void;
  selectedView: Signal<string>;
  close: Signal<boolean>;
}

export default function ReviewFile({ selectedFiles, modificationHistory, uploadType, close, onUpload }: ReviewFileProps) {
  // Compute final output files: modified files + selected files
  const outputFiles = computed(() => {
    const modifiedFiles = modificationHistory.value.filter((edit) => edit.file.isUpload).map((edit) => edit.file);
    return [...modifiedFiles, ...selectedFiles.value];
  });

  // Handles the upload process
  const handleUpload = async () => {
    if (outputFiles.value.length === 0) return;

    try {
      let uploadedFiles: Files[] = [];

      if (uploadType === "profile" && outputFiles.value.length > 0) {
        uploadedFiles = await processProfileImages(outputFiles.value[0]);
      } else {
        uploadedFiles = await Promise.all(outputFiles.value);
      }

      onUpload?.(uploadedFiles);
      close.value = true;
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div class="reviewfile">
      {outputFiles.value.length === 0 ? (
        <p>No files selected.</p>
      ) : (
        <>
          {outputFiles.value.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
          <button onClick={handleUpload}>Upload</button>
        </>
      )}
    </div>
  );
}

/**
 * Processes and uploads images for profile pictures in multiple sizes.
 * @param file The original uploaded profile image.
 * @returns Array of processed profile images.
 */
async function processProfileImages(file: Files): Promise<Files[]> {
  const baseFile: Files = {
    ...file,
    extension: "webp",
    mimeType: "image/webp",
    filePath: "/profile",
    privacyLvl: "public",
    verified: true,
  };

  const sizes = [
    { size: 32, name: "Profile Picture - Small", storedName: "pp32.webp" },
    { size: 128, name: "Profile Picture - Medium", storedName: "pp128.webp" },
    { size: 512, name: "Profile Picture - Large", storedName: "pp512.webp" },
  ];

  const processedFiles = await Promise.all(
    sizes.map(async ({ size, name, storedName }) => {
      const imageURL = await standardizeImage(file.publicURL!, size, size, "webp");
      return {
        ...baseFile,
        id: crypto.randomUUID(),
        publicURL: imageURL,
        publicName: name,
        storedName,
        meta: { application: "WebP Image", size: getBase64FileSize(imageURL) },
      };
    })
  );

  await Promise.all(processedFiles);
  return processedFiles;
}
