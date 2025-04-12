// deno-lint-ignore-file no-explicit-any
import { Files, FileTypesImages } from '../../lib/types/index.ts';
import AIcon, { Icons } from '../Icons.tsx';

interface IFileCard {
  file: Files;
  selected?: boolean;
  onRemove?: (e?: any) => void;
  onSelect?: (e?: any) => void;
}

export default function FileCard({ file, selected, onRemove, onSelect }: IFileCard) {
  return (
    <div class={`file-card${selected ? ' selected' : ''}`}>
      <div class="file-card-container" onClick={e => (onSelect ? onSelect(e) : null)}>
        <div class="file-image">
          <img class="background" src={fileImage(file)} loading="lazy" />
          <img class="foreground" src={fileImage(file)} loading="lazy" />
        </div>

        <div class="file-details">
          <p class="title">{file.publicName}</p>
        </div>
      </div>

      {onRemove ? (
        <div class="file-actions-container">
          <div class="file-actions">
            <AIcon onClick={() => onRemove()} className="file-remove" startPaths={Icons.X} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const fileImage = (file: Files) => {
  if (file.verified && file.fileType === 'Image') {
    return file.publicURL;
  } else if (file.fileType) {
    return `/assets/images/${FileTypesImages[file.fileType]}`;
  }
};
