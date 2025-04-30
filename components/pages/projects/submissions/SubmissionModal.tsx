// deno-lint-ignore-file no-explicit-any
import { useRef } from 'preact/hooks';
import { Signal, useSignal } from '@preact/signals';
import { Files, Project, Task, User, Submission, jsonTag } from '../../../../lib/newtypes/index.ts';
import FileUploader from '../../../UI/FileUploader/FileUploader.tsx';
import AIcon, { Icons } from '../../../Icons.tsx';
import TextField from '../../../UI/Fields/TextField.tsx';
import RichTextField from '../../../UI/Fields/RichTextField.tsx';
import FileField from '../../../UI/Fields/FileField.tsx';

export default function NewSubmission({
  project,
  user,
  job,
  task,
  openSubmissionsModal,
}: {
  project: Project;
  user: User;
  job: Task;
  task?: Task;
  openSubmissionsModal: Signal<boolean>;
}) {
  if (!openSubmissionsModal.value) return null;

  const title = useSignal<string>('');
  const description = useSignal<jsonTag>({});
  const seletedTask = useSignal<Task | undefined>(task);
  const submissionFiles = useSignal<Files[]>([]);
  const fileUploader = useRef<any>(null);

  const newSubmission = useSignal<Submission>({
    id: crypto.randomUUID(),
    job: job.id!,
    task: seletedTask.value?.id || undefined,
    team: project.team!.id,
    user: user.id,
    files: [],
    meta: {
      views: 0,
      downloads: 0,
      files: 0,
      reviews: 0,
    },
    score: 0,
  });

  const handleUpload = async () => {
    newSubmission.value = {
      ...newSubmission.value,
      title: title.value,
      description: JSON.stringify(description.value),
      task: seletedTask.value?.id || undefined,
      files: submissionFiles.value,
      meta: {
        ...newSubmission.value.meta,
        files: submissionFiles.value.length,
      },
    };

    await fetch('/api/projects/create/submission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSubmission.value),
    });
  };

  return (
    <div class="new-submission">
      <div class="back" onClick={() => (openSubmissionsModal.value = false)} />
      <div class="new-submission__modal">
        <div class="new-submission__modal-header">
          <h1 class="new-submission__modal-title">New Submission</h1>
          <div
            class="new-submission__modal-exit"
            onClick={() => (openSubmissionsModal.value = false)}
          >
            <AIcon startPaths={Icons.X} size={20} />
          </div>
        </div>

        <div class="new-submission__modal-details">
          <div class="new-submission__modal__job">
            <div class="new-submission__modal__job-details">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
            </div>

            {job.tasks && job.tasks?.length > 0 && (
              <div class="new-submission__modal__job-tasks">
                <div class="new-submission__modal__job-tasks__select">
                  {job.tasks?.map(tsk => {
                    return (
                      <label class="new-submission__modal__job-tasks__select-item">
                        <input
                          type="radio"
                          name="selectedTask"
                          id={tsk.id}
                          checked={seletedTask.value?.id == tsk.id}
                          onInput={() => {
                            seletedTask.value = tsk;
                          }}
                          hidden
                        />
                        {tsk.title}
                      </label>
                    );
                  })}
                </div>

                <div>
                  <p>{seletedTask.value?.description}</p>
                </div>
              </div>
            )}
          </div>

          <div class="new-submission__modal__upload">
            <TextField val={title} placeholder="Title">
              Title
            </TextField>

            <RichTextField val={description} placeholder="Description">
              Description
            </RichTextField>

            <FileField uploadedFiles={submissionFiles} fileUploader={fileUploader}>
              Files
            </FileField>

            <div class="new-submission__modal__upload-button-container">
              <button
                disabled={title.value.length === 0 || submissionFiles.value.length === 0}
                class="new-submission__modal__upload-button"
                onClick={() => {
                  handleUpload();
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <FileUploader
        multiple
        path="shared/submissions"
        title="New Submission"
        user={user}
        thisRef={fileUploader}
        onUpload={async files => {
          if (!files) return;
          for (let i = 0; i < files.length; i++) {
            if (!files[i].isUpload) {
              console.log(files[i].publicURL);
              const response = await fetch(
                `/api/files/process/tobase64?url=${encodeURIComponent(files![i].publicURL!)}`
              );
              const dataUri = await response.text();

              files[i].publicURL = dataUri;
              files[i].isUpload = true;
            }
          }

          submissionFiles.value = [...submissionFiles.value, ...(files ?? [])];
        }}
      />
    </div>
  );
}
