import { Signal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';
import FileCard from '../../cards/FileCard.tsx';
import { FileReference, Files } from '../../../lib/newtypes/index.ts';
import { MutableRef } from 'preact/hooks/src/index.d.ts';

export default function FileField({
  uploadedFiles,
  fileUploader,
  ...props
}: {
  uploadedFiles: Signal<(Files | FileReference)[]>;
  fileUploader: MutableRef<any>;
} & JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <div class={`input-field input-field--files ${props.class}`}>
      <p class="input-field-title input-field--files-title">{props.children}</p>
      <div class="input-field--files__uploads">
        {uploadedFiles.value.map((file, index) => {
          return (
            <FileCard
              file={file}
              onRemove={() =>
                (uploadedFiles.value = uploadedFiles.value.filter((_, i) => i !== index))
              }
            />
          );
        })}
      </div>

      <button
        class="input-field--files-open"
        onClick={() => {
          fileUploader.current.openModal();
        }}
      >
        + Add File
      </button>
    </div>
  );
}
