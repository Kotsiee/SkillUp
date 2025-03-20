// deno-lint-ignore-file no-explicit-any
import { DateTime } from "https://esm.sh/luxon@3.5.0";
import { FileMessage } from "../../../lib/types/index.ts";

export default function PreviewFile({ fileRef }: { fileRef: FileMessage | null }) {
    if (!fileRef) return null;
  
    const file = fileRef.fileRef.file!
    const createdAtDate = DateTime.fromISO(file.createdAt as any);
  
    return (
      <div class="preview">
        <div class="preview-image">
          <img src={file.publicURL} />
        </div>
  
        <div class="preview-info">
          <div class="obj-info">
            <h5 class="title">{file.publicName}</h5>
            <p class="obj-type">
              {file.meta?.application || file.fileType || file.mimeType}
            </p>
            <p class="sent-at">
              {createdAtDate.setLocale("en-GB").toFormat("DDDD' - 'HH':'mm")}
            </p>
          </div>
          <hr />
          <div class="message-info">
            <button class="goto">Go to message</button>
            <p class="msg">{fileRef.message?.textContent}</p>
          </div>
        </div>
  
        <div class="preview-actions">
          <ul>
            <li class="open">
              <a 
              href={`${globalThis.location.pathname}/${fileRef.fileRef.id}`}
              f-partial={`${globalThis.location.pathname.split('/attachments').join('/partials/attachments')}/${fileRef.fileRef.id}`}
              >Open</a>
            </li>
            <li>
              <button>Download</button>
            </li>
            <li>
              <button>Copy Link</button>
            </li>
            <li>
              <button>Share</button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  