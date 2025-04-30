// deno-lint-ignore-file no-explicit-any
import { useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import FileUploader from '../../../components/UI/FileUploader/FileUploader.tsx';
import AIcon, { Icons } from '../../../components/Icons.tsx';
import { useUser } from '../../contexts/UserProvider.tsx';
import RichTextField from '../../../components/UI/Fields/RichTextField.tsx';
import TextDropdownField from '../../../components/UI/Fields/TextDropdownField.tsx';
import TextField from '../../../components/UI/Fields/TextField.tsx';
import about from '../../../routes/about/index.tsx';
import { FileReference, Files, jsonTag } from '../../../lib/newtypes/index.ts';
import FileField from '../../../components/UI/Fields/FileField.tsx';
import NewJob from '../../../components/pages/projects/newProject/NewJob.tsx';

export default function NewProject() {
  const { user, team } = useUser();
  if (!user) return null;

  const name = useSignal<string>('');
  const description = useSignal<jsonTag | undefined>(undefined);
  const uploadedFiles = useSignal<(Files | FileReference)[]>([]);

  const openJobs = useSignal<boolean>(false);

  const modalRef = useRef<any>(null);
  const modalSettings = useSignal({
    title: '',
    path: '',
    uploadType: '',
    fileType: '',
    onUpload: () => {},
  });

  // const editableProject = useSignal<Project | null>({
  //   id: crypto.randomUUID(),
  //   team: team ?? undefined,
  //   title: 'Test Project',
  //   description: 'desc',
  //   jobs: [
  //     {
  //       id: '123456abcdef',
  //       title: 'Graphic Designer',
  //       description: 'Make a few designs n that',
  //       budgetAllocated: 100,
  //       startDate: DateTime.now(),
  //       endDate: DateTime.now().plus({ days: 10 }),
  //       metrics: {
  //         creativity: {
  //           weight: 0.3,
  //           tasks: {
  //             '12345abcde': 0.5,
  //             '1234abcd': 0.5,
  //           },
  //         },
  //         colour: {
  //           weight: 0.3,
  //           tasks: {
  //             '12345abcde': 0.2,
  //             '1234abcd': 0.3,
  //           },
  //         },
  //         relevance: {
  //           weight: 0.4,
  //           tasks: {
  //             '12345abcde': 0.3,
  //             '1234abcd': 0.2,
  //           },
  //         },
  //       },

  //       tasks: [
  //         {
  //           id: '12345abcde',
  //           title: 'Logo Design',
  //           description: 'Make a quick logo for meh',
  //           budgetAllocated: 50,
  //           startDate: DateTime.now(),
  //           endDate: DateTime.now().plus({ days: 5 }),
  //         },
  //         {
  //           id: '1234abcd',
  //           title: 'T-Shirt Design',
  //           description: 'A line of new t-shirts',
  //           budgetAllocated: 50,
  //           startDate: DateTime.now().plus({ days: 3 }),
  //           endDate: DateTime.now().plus({ days: 10 }),
  //         },
  //       ],
  //     },
  //     {
  //       id: '123456abcdefghi',
  //       title: 'Web Developers',
  //       description: 'Make a whole ass website yk',
  //       budgetAllocated: 100,
  //       startDate: DateTime.now(),
  //       endDate: DateTime.now().plus({ days: 10 }),

  //       metrics: {
  //         creativity: {
  //           weight: 0.2,
  //         },
  //         functionality: {
  //           weight: 0.6,
  //         },
  //         relevance: {
  //           weight: 0.2,
  //         },
  //       },
  //     },
  //     {
  //       id: '123456abcdef342343',
  //       title: 'Marketers',
  //       description: 'This shii needs to POP',
  //       budgetAllocated: 100,
  //       startDate: DateTime.now(),
  //       endDate: DateTime.now().plus({ days: 10 }),
  //       metrics: {
  //         creativity: {
  //           weight: 0.3,
  //           tasks: {
  //             '12345abcde34342': 0.3,
  //             '1234abcd34234': 0.3,
  //           },
  //         },
  //         colour: {
  //           weight: 0.3,
  //           tasks: {
  //             '12345abcde34342': 0.3,
  //             '1234abcd34234': 0.3,
  //           },
  //         },
  //         relevance: {
  //           weight: 0.4,
  //           tasks: {
  //             '12345abcde34342': 0.4,
  //             '1234abcd34234': 0.4,
  //           },
  //         },
  //       },
  //       tasks: [
  //         {
  //           id: '12345abcde34342',
  //           title: 'Logo Design',
  //           description: 'Make a quick logo for meh',
  //           budgetAllocated: 50,
  //           startDate: DateTime.now(),
  //           endDate: DateTime.now().plus({ days: 5 }),
  //         },
  //         {
  //           id: '1234abcd34234',
  //           title: 'T-Shirt Design',
  //           description: 'A line of new t-shirts',
  //           budgetAllocated: 50,
  //           startDate: DateTime.now().plus({ days: 3 }),
  //           endDate: DateTime.now().plus({ days: 10 }),
  //         },
  //       ],
  //     },
  //   ],
  // });

  async function createNewProject() {
    // editableProject.value = {
    //   ...editableProject.value,
    //   totalBudget:
    //     editableProject.value?.jobs?.reduce((sum, job) => sum + (job.budgetAllocated ?? 0), 0) || 0,
    // };
    // const formData = new FormData();
    // formData.set('project', JSON.stringify(editableProject.value));
    // await fetch('/api/projects/newProject', {
    //   method: 'POST',
    //   body: formData,
    // });
  }

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
          class="new-project__create-section new-project__create__profile"
          aria-labelledby="profile-section"
        >
          <h2 id="profile-section" class="visually-hidden">
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
                // onUpload: handleFileUpload,
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

          <button
            class="input-field--job-open"
            onClick={() => {
              openJobs.value = true;
            }}
          >
            + Add Job
          </button>
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
            <NewJob open={openJobs} user={user} />
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
