// deno-lint-ignore-file no-explicit-any
import { useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { useUser } from '../contexts/UserProvider.tsx';
import FileUploader from '../../components/UI/FileUploader/FileUploader.tsx';
import EditLayout from '../../components/Edit/EditLayout.tsx';
import { Project } from '../../lib/types/index.ts';
import { DateTime } from 'https://esm.sh/luxon@3.5.0';

export default function NewProject() {
  const { user, team } = useUser();
  if (!user) return null;

  const modalRef = useRef<any>(null);
  const modalSettings = useSignal({
    title: '',
    path: '',
    uploadType: '',
    fileType: '',
    onUpload: () => {},
  });

  const editableProject = useSignal<Project | null>({
    id: crypto.randomUUID(),
    team: team ?? undefined,
    title: 'Test Project',
    description: 'desc',
    jobs: [
      {
        id: '123456abcdef',
        title: 'Graphic Designer',
        description: 'Make a few designs n that',
        budgetAllocated: 100,
        startDate: DateTime.now(),
        endDate: DateTime.now().plus({ days: 10 }),
        metrics: {
          creativity: {
            weight: 0.3,
            tasks: {
              '12345abcde': 0.5,
              '1234abcd': 0.5,
            },
          },
          colour: {
            weight: 0.3,
            tasks: {
              '12345abcde': 0.2,
              '1234abcd': 0.3,
            },
          },
          relevance: {
            weight: 0.4,
            tasks: {
              '12345abcde': 0.3,
              '1234abcd': 0.2,
            },
          },
        },

        tasks: [
          {
            id: '12345abcde',
            title: 'Logo Design',
            description: 'Make a quick logo for meh',
            budgetAllocated: 50,
            startDate: DateTime.now(),
            endDate: DateTime.now().plus({ days: 5 }),
          },
          {
            id: '1234abcd',
            title: 'T-Shirt Design',
            description: 'A line of new t-shirts',
            budgetAllocated: 50,
            startDate: DateTime.now().plus({ days: 3 }),
            endDate: DateTime.now().plus({ days: 10 }),
          },
        ],
      },
      {
        id: '123456abcdefghi',
        title: 'Web Developers',
        description: 'Make a whole ass website yk',
        budgetAllocated: 100,
        startDate: DateTime.now(),
        endDate: DateTime.now().plus({ days: 10 }),

        metrics: {
          creativity: {
            weight: 0.2,
          },
          functionality: {
            weight: 0.6,
          },
          relevance: {
            weight: 0.2,
          },
        },
      },
      {
        id: '123456abcdef342343',
        title: 'Marketers',
        description: 'This shii needs to POP',
        budgetAllocated: 100,
        startDate: DateTime.now(),
        endDate: DateTime.now().plus({ days: 10 }),
        metrics: {
          creativity: {
            weight: 0.3,
            tasks: {
              '12345abcde34342': 0.3,
              '1234abcd34234': 0.3,
            },
          },
          colour: {
            weight: 0.3,
            tasks: {
              '12345abcde34342': 0.3,
              '1234abcd34234': 0.3,
            },
          },
          relevance: {
            weight: 0.4,
            tasks: {
              '12345abcde34342': 0.4,
              '1234abcd34234': 0.4,
            },
          },
        },
        tasks: [
          {
            id: '12345abcde34342',
            title: 'Logo Design',
            description: 'Make a quick logo for meh',
            budgetAllocated: 50,
            startDate: DateTime.now(),
            endDate: DateTime.now().plus({ days: 5 }),
          },
          {
            id: '1234abcd34234',
            title: 'T-Shirt Design',
            description: 'A line of new t-shirts',
            budgetAllocated: 50,
            startDate: DateTime.now().plus({ days: 3 }),
            endDate: DateTime.now().plus({ days: 10 }),
          },
        ],
      },
    ],
  });

  async function createNewTeam() {
    editableProject.value = {
      ...editableProject.value,
      totalBudget:
        editableProject.value?.jobs?.reduce((sum, job) => sum + (job.budgetAllocated ?? 0), 0) || 0,
    };

    const formData = new FormData();
    formData.set('project', JSON.stringify(editableProject.value));
    await fetch('/api/projects/newProject', {
      method: 'POST',
      body: formData,
    });
  }

  return (
    <div class="bod">
      <div>
        <a href="/projects" f-partial="/projects/partials">
          Back
        </a>
        <button onClick={() => createNewTeam()}>Create Project</button>
      </div>

      <EditLayout
        editableRecord={editableProject}
        modalRef={modalRef}
        modalSettings={modalSettings}
        type="projects/create"
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
