// deno-lint-ignore-file no-explicit-any
import { MutableRef, Ref } from 'preact/hooks';
import AIcon, { Icons } from '../../Icons.tsx';

interface AttachmentModalProps {
  closeBtn: MutableRef<AIcon | undefined>;
  modalRef: Ref<HTMLDivElement>;
  fileUploader: MutableRef<any>;
}

export default function AttachmentModal({
  closeBtn,
  modalRef,
  fileUploader,
}: AttachmentModalProps) {
  return (
    <div
      class="chat-input-additional hide"
      ref={modalRef}
      hidden
      tabIndex={0}
      onBlur={() => closeBtn.current?.click()}
    >
      <ul>
        <li class="File" onClick={() => fileUploader.current.openModal()}>
          <AIcon startPaths={Icons.Clip} />
        </li>
        <li class="Poll">
          <AIcon startPaths={Icons.Poll} />
        </li>
      </ul>
    </div>
  );
}
