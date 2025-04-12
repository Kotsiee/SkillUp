// deno-lint-ignore-file no-explicit-any
import { useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { useUser } from '../contexts/UserProvider.tsx';
import FileUploader from '../../components/FileUploader/FileUploader.tsx';
import EditLayout from '../Edit/EditLayout.tsx';

export default function EditProfile() {
  const { user } = useUser();
  if (!user) return null;

  const modalRef = useRef<any>(null);
  const modalSettings = useSignal({
    title: '',
    path: '',
    uploadType: '',
    fileType: '',
    onUpload: () => {},
  });

  const editableTeam = useSignal<Record<string, any> | null>({
    name: '',
    username: '',
    headline: '',
    description: '',
  });

  async function createNewTeam() {
    const formData = new FormData();
    formData.set('team', JSON.stringify(editableTeam.value));
    await fetch('/api/teams', {
      method: 'POST',
      body: formData,
    });
  }

  return (
    <div class="bod">
      <EditLayout
        editableRecord={editableTeam}
        modalRef={modalRef}
        modalSettings={modalSettings}
        type="teams/create"
      />

      <div>
        <button onClick={() => createNewTeam()}>Create Team</button>
      </div>

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
