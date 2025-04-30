import FileCard from '../../cards/FileCard.tsx';
import { getBase64FileSize, standardizeImage } from './utils/ImageUtils.ts';
import { EditFile, Files } from '../../../lib/newtypes/index.ts';
import { computed, Signal } from '@preact/signals';

interface ReviewFileProps {
  selectedFiles: Signal<Files[]>;
  modificationHistory: Signal<EditFile[]>;
  uploadType?: string;
  onUpload?: (files?: Files[]) => void;
  selectedView: Signal<string>;
  close: Signal<boolean>;
}

export default function ReviewFile({
  selectedFiles,
  modificationHistory,
  uploadType,
  close,
  onUpload,
}: ReviewFileProps) {
  const outputFiles = computed(() => {
    const modified = modificationHistory.value
      .filter(edit => edit.file.isUpload)
      .map(edit => edit.file);
    return [...modified, ...selectedFiles.value];
  });

  // Handle final upload
  const handleUpload = async () => {
    if (outputFiles.value.length === 0) return;

    try {
      let uploadedFiles: Files[] = [];

      if (uploadType === 'profile' && outputFiles.value.length > 0) {
        uploadedFiles = await processProfileImages(outputFiles.value[0]);
      } else {
        uploadedFiles = await Promise.all(outputFiles.value);
      }

      onUpload?.(uploadedFiles);
      close.value = true;
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div class="review">
      {outputFiles.value.length === 0 ? (
        <p class="review__empty" role="alert">
          No files selected.
        </p>
      ) : (
        <>
          <div class="review__list">
            {outputFiles.value.map(file => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>

          <button class="review__upload-btn" onClick={handleUpload} aria-label="Upload files">
            Upload Files
          </button>
        </>
      )}
    </div>
  );
}

/**
 * Handle profile picture specific resizing
 */
async function processProfileImages(file: Files): Promise<Files[]> {
  const baseFile: Files = {
    ...file,
    extension: 'webp',
    mimeType: 'image/webp',
    filePath: 'profile/avatar',
    privacy: 'public',
    verified: true,
  };

  const sizes = [
    { size: 128, name: 'Profile Picture - Small', storedName: 'ppSmall.webp' },
    { size: 256, name: 'Profile Picture - Medium', storedName: 'ppMed.webp' },
    { size: 512, name: 'Profile Picture - Large', storedName: 'ppLarge.webp' },
  ];

  const processedFiles = await Promise.all(
    sizes.map(async ({ size, name, storedName }) => {
      const imageURL = await standardizeImage(file.publicURL!, size, size, 'webp');
      return {
        ...baseFile,
        id: crypto.randomUUID(),
        publicURL: imageURL,
        publicName: name,
        storedName,
        meta: { application: 'WebP Image', size: getBase64FileSize(imageURL) },
      };
    })
  );

  return processedFiles;
}
