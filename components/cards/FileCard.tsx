// deno-lint-ignore-file no-explicit-any
import { FileReference, Files, FileTypesImages } from '../../lib/newtypes/index.ts';
import AIcon, { Icons } from '../Icons.tsx';

interface IFileCard {
  file: Files | FileReference;
  selected?: boolean;
  onRemove?: (e?: any) => void;
  onSelect?: (e?: any) => void;
}

export default function FileCard({ file, selected, onRemove, onSelect }: IFileCard) {
  const fileRef = 'file' in file ? (file as FileReference) : null;
  const thisFile = (fileRef ? fileRef.file : file) as Files;
  const title = fileRef ? fileRef.publicName : thisFile.publicName;

  return (
    <div class={`file-card ${selected ? 'selected' : ''}`}>
      {/* Main Clickable Card */}
      <div
        class="file-card-container"
        onClick={e => (onSelect ? onSelect(e) : null)}
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        aria-label={`Select file ${title}`}
      >
        <div class="file-image">
          <img class="background" src={fileImage(thisFile)} alt="" loading="lazy" />
          <img class="foreground" src={fileImage(thisFile)} alt={title} loading="lazy" />
        </div>

        <div class="file-details">
          <p class="title">{title}</p>
        </div>
      </div>

      {/* Remove Button */}
      {onRemove && (
        <div class="file-actions-container">
          <div class="file-actions">
            <AIcon
              onClick={() => onRemove()}
              className="file-remove"
              startPaths={Icons.X}
              aria-label={`Remove file ${title}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export const fileImage = (file: Files) => {
  if (file)
    if (file.verified && file.fileType === 'Image') {
      return file.publicURL;
    } else if (file.fileType) {
      return `/assets/images/${FileTypesImages[file.fileType]}`;
    }
};
