// deno-lint-ignore-file no-explicit-any
import { useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { useUser } from '../contexts/UserProvider.tsx';
import FileUploader from '../../components/FileUploader/FileUploader.tsx';
import EditLayout from '../Edit/EditLayout.tsx';
import { AccountProfile } from '../../lib/types/index.ts';

export default function EditProfile({ account }: { account: AccountProfile }) {
  const { user } = useUser();
  if (!account.account || !user) return null;

  const modalRef = useRef<any>(null);
  const modalSettings = useSignal({
    title: '',
    path: '',
    uploadType: '',
    fileType: '',
    onUpload: () => {},
  });

  const editableUser = useSignal<Record<string, any> | null>(account.account);

  return (
    <div class="bod">
      <EditLayout
        editableRecord={editableUser}
        modalRef={modalRef}
        modalSettings={modalSettings}
        type="profile"
      />

      <FileUploader
        path={modalSettings.value.path}
        title={modalSettings.value.title}
        user={user}
        uploadType={modalSettings.value.uploadType}
        fileType={modalSettings.value.fileType}
        thisRef={modalRef}
        onUpload={modalSettings.value.onUpload}
      />
    </div>
  );
}
