// deno-lint-ignore-file no-explicit-any
import { useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import FileUploader from '../../components/UI/FileUploader/FileUploader.tsx';
import AIcon, { Icons } from '../../components/Icons.tsx';
import { useUser } from '../contexts/UserProvider.tsx';
import RichTextField from '../../components/UI/Fields/RichTextField.tsx';
import TextField from '../../components/UI/Fields/TextField.tsx';
import { FileReference, Files, jsonTag, Task } from '../../lib/newtypes/index.ts';
import FileField from '../../components/UI/Fields/FileField.tsx';
import NewJob from '../../components/pages/projects/newProject/NewJob.tsx';
import JobCard from '../../components/pages/projects/newProject/JobCard.tsx';
import SetBudgets from '../../components/pages/projects/newProject/SetBudget.tsx';
import ProjectTimeline from '../../components/pages/projects/newProject/Timeline.tsx';

export default function NewProject() {
  const { user, team } = useUser();
  if (!user) return null;

  const name = useSignal<string>('');
  const description = useSignal<jsonTag | undefined>(undefined);
  const uploadedFiles = useSignal<(Files | FileReference)[]>([]);
  const jobs = useSignal<Task[]>([]);
  const selectedJob = useSignal<Task | null>(null);

  const openJobs = useSignal<boolean>(false);

  const modalRef = useRef<any>(null);
  const modalSettings = useSignal({
    title: '',
    path: '',
    uploadType: '',
    fileType: '',
    onUpload: () => {},
  });

  async function createNewProject() {}

  return (
    <div class="new-project">
      <div class="new-project__header" role="navigation" aria-label="Project creation header">
        <div class="new-project__back">
          <a
            class="new-project__back-link"
            href="/projects"
            f-partial="/projects/partials"
            aria-label="Go back to Projects"
          >
            <AIcon startPaths={Icons.LeftChevron} size={16} /> Back
          </a>
        </div>
        <div class="new-project__submit">
          <button
            class="new-project__submit-button"
            onClick={() => createNewProject()}
            aria-label="Create new Project"
          >
            + Create Project
          </button>
        </div>
      </div>

      <div class="new-project__create">
        {/* Profile Info */}
        <section
          hidden
          class="new-project__create-section new-project__create__details"
          aria-labelledby="details-section"
        >
          <h2 id="details-section" class="visually-hidden">
            Project Details
          </h2>
          <TextField val={name} placeholder="Title">
            Title
          </TextField>
          <RichTextField val={description}>Description</RichTextField>

          <FileField
            uploadedFiles={uploadedFiles}
            fileUploader={modalRef}
            onClick={() => {
              modalSettings.value = {
                ...modalSettings.value,
                title: 'Project Attachments',
                path: 'shared/projects',
                fileType: '*',
              };
            }}
          >
            Attachments
          </FileField>
        </section>

        {/* About + Industries */}
        <section
          class="new-project__create-section new-project__create__jobs"
          aria-labelledby="jobs-section"
        >
          <h2 id="jobs-section" class="visually-hidden">
            Jobs
          </h2>

          <div class="new-project__create-jobs-list">
            {jobs.value.map(job => {
              return (
                <JobCard
                  job={job}
                  onSelect={job => {
                    selectedJob.value = job;
                    openJobs.value = true;
                  }}
                />
              );
            })}
          </div>

          <button
            class="input-field--job-open"
            onClick={() => {
              openJobs.value = true;
            }}
          >
            + Add Job
          </button>
        </section>

        <section
          hidden
          class="new-project__create-section new-project__create__budget"
          aria-labelledby="budget-section"
        >
          <h2 id="budget-section" class="visually-hidden">
            Budget
          </h2>

          <SetBudgets jobs={jobs} />
        </section>

        <section
          class="new-project__create-section new-project__create__timeline"
          aria-labelledby="timeline-section"
        >
          <h2 id="timeline-section" class="visually-hidden">
            Timeline
          </h2>

          <ProjectTimeline jobs={jobs} />
        </section>
      </div>

      {openJobs.value && (
        <div class="new-project__create-jobs">
          <div
            class="back"
            onClick={() => {
              openJobs.value = false;
            }}
          />

          <div class="new-project__create-jobs-modal">
            <NewJob open={openJobs} user={user} jobs={jobs} job={selectedJob.value} />
          </div>
        </div>
      )}

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
