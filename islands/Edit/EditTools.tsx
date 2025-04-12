// deno-lint-ignore-file no-explicit-any
import { Signal, useSignal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';
import { getByPath, setByPath } from '../../lib/utils/record.ts';
import { Files } from '../../lib/types/index.ts';
import FileCard from '../../components/cards/FileCard.tsx';

interface TextBoxProps extends JSX.HTMLAttributes<HTMLDivElement> {
  resize?: boolean;
  val: string;
  account: Signal<Record<string, any> | null>;
}

export function EditTextbox({
  account,
  val,
  resize,
  placeholder,
  class: className,
  children,
}: TextBoxProps) {
  if (!account.value) return null;

  const editable = account.value;
  const value = getByPath(editable, val);

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const newValue = target.value;

    const updated = setByPath(editable, val, newValue);
    account.value = updated;
  }

  return (
    <div class={`textbox ${className ?? ''}`}>
      <p class="tb-title">{children}</p>
      {resize ? (
        <textarea
          class="text-input"
          placeholder={placeholder}
          value={value}
          onInput={handleInput}
        />
      ) : (
        <input
          class="text-input"
          type="text"
          placeholder={placeholder}
          value={value}
          onInput={handleInput}
        />
      )}
    </div>
  );
}

interface IAttachments {
  modalRef: any;
  modalSettings: Signal<any>;
  onAdd: (files: Files[]) => void;
}

export function EditAttachments({ modalRef, modalSettings, onAdd }: IAttachments) {
  const files = useSignal<Files[]>([]);

  return (
    <div class="new-attachments">
      <div class="new-attachment">
        <p
          class="new-attachment-label"
          onClick={() => {
            modalSettings.value = {
              ...modalSettings.value,
              title: 'Project Attachments',
              path: 'shared/projects',

              onUpload: async (filess: Files[]) => {
                files.value = files.value.length ? [...files.value, ...filess] : filess;
                onAdd(files.value);
              },
            };
            modalRef.current.openModal();
          }}
        >
          + Add File
        </p>
      </div>

      <div class="new-files">
        {files.value.map(file => {
          return (
            <FileCard
              file={file}
              onRemove={() => {
                if (files.value.length == 1) files.value = [];
                else
                  files.value = files.value.filter(item => {
                    console.log(item.id);
                    return item.id != file.id;
                  });
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
