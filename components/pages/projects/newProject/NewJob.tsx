// deno-lint-ignore-file no-explicit-any
import { useRef } from 'preact/hooks';
import { Signal, useSignal } from '@preact/signals';
import FileUploader from '../../../UI/FileUploader/FileUploader.tsx';
import AIcon, { Icons } from '../../../Icons.tsx';
import RichTextField from '../../../UI/Fields/RichTextField.tsx';
import TextField from '../../../UI/Fields/TextField.tsx';
import { FileReference, Files, jsonTag, Task, User } from '../../../../lib/newtypes/index.ts';
import FileField from '../../../UI/Fields/FileField.tsx';
import NewTask from './NewTask.tsx';

export default function NewJob({
  open,
  user,
  job,
}: {
  open: Signal<boolean>;
  user: User;
  job?: Task;
}) {
  const title = useSignal<string>('');
  const description = useSignal<jsonTag | undefined>(undefined);
  const uploadedFiles = useSignal<(Files | FileReference)[]>([]);
  const tasks = useSignal<Task[]>([]);

  const modalRef = useRef<any>(null);
  const modalSettings = useSignal({
    title: '',
    path: '',
    uploadType: '',
    fileType: '',
    onUpload: (files?: Files[] | undefined) => {},
  });

  async function createNewTeam() {}

  return (
    <div class="new-job">
      <div class="new-job__header" role="navigation" aria-label="job creation header">
        <div class="new-job__back">
          <button
            class="new-job__back-link"
            aria-label="Go back to project"
            onClick={() => {
              open.value = false;
            }}
          >
            <AIcon startPaths={Icons.LeftChevron} size={16} /> Back
          </button>
        </div>
        <div class="new-job__submit">
          <button
            class="new-job__submit-button"
            onClick={() => createNewTeam()}
            aria-label="Create new job"
          >
            + Create Job
          </button>
        </div>
      </div>

      <div class="new-job__create">
        <section
          class="new-job__create-section new-job__create__profile"
          aria-labelledby="profile-section"
        >
          <h2 id="profile-section" class="visually-hidden">
            Job Details
          </h2>
          <TextField val={title} placeholder="Title">
            Title
          </TextField>
          <RichTextField val={description}>Description</RichTextField>

          <FileField
            uploadedFiles={uploadedFiles}
            fileUploader={modalRef}
            onClick={() => {
              modalSettings.value = {
                ...modalSettings.value,
                title: 'Job Attachments',
                path: 'shared/jobs',
                fileType: '*',
                onUpload: (files?: Files[] | undefined) => {
                  uploadedFiles.value = [...uploadedFiles.value, ...(files ?? [])];
                },
              };
            }}
          >
            Attachments
          </FileField>
        </section>

        <section
          class="new-job__create-section new-job__create__tasks"
          aria-labelledby="tasks-section"
        >
          <h2 id="tasks-section" class="visually-hidden">
            Tasks
          </h2>

          <NewTask tasks={tasks} />
        </section>

        <section
          class="new-job__create-section new-job__create__metrics"
          aria-labelledby="metrics-section"
        >
          <h2 id="metrics-section" class="visually-hidden">
            Metrics
          </h2>
        </section>
      </div>

      <FileUploader
        multiple
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
