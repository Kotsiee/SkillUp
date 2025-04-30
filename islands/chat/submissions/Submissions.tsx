import { PageProps } from '$fresh/server.ts';
import { useSignal } from '@preact/signals';
import { useChat } from '../../contexts/ChatProvider.tsx';
import AIcon, { Icons } from '../../../components/Icons.tsx';
import { useProject } from '../../contexts/ProjectProvider.tsx';
import TableView from '../../../components/UI/TableView.tsx';
import { useEffect } from 'preact/hooks';
import { useUser } from '../../contexts/UserProvider.tsx';
import { Chat, Submission, Task } from '../../../lib/newtypes/index.ts';
import NewSubmission from '../../../components/pages/projects/submissions/SubmissionModal.tsx';
import { DateTime } from 'https://esm.sh/luxon@3.5.0';

export default function Submissions({ pageProps }: { pageProps: PageProps }) {
  const { project } = useProject();
  const { chat } = useChat();
  const { user } = useUser();

  if (!chat || !project || !user) return null;

  const job = project.jobs.find((job: Task & { chat: Chat }) => job.chat.id === chat.id);
  const currentTask = useSignal<Task | null>(job.tasks[0] || null);
  const view = useSignal<'table' | 'grid'>('table');
  const openSubmissionsModal = useSignal<boolean>(false);
  const fields = ['Rank', 'Submission', 'Files', 'Views', 'Downloads', 'Reviews', 'Date'];
  const submissions = useSignal<{}[]>([]);

  useEffect(() => {
    fetch(`/api/projects/submissions/${job.id}`, { method: 'GET' })
      .then(res => res.json())
      .then((data: Submission[]) => {
        submissions.value = data
          .sort((a, b) => b.score - a.score)
          .map((submission, index) => {
            return {
              id: submission.id,
              Rank: submission.score !== 0 ? index + 1 : 'N/A',
              Submission: submission.title,
              Files: submission.meta.files,
              Views: submission.meta.views,
              Downloads: submission.meta.downloads,
              Reviews: submission.meta.reviews,
              Date: DateTime.fromISO(submission.createdAt!.toString()).toFormat('dd/MM/yyyy'),
            };
          });
      });
  }, []);

  return (
    <div class="submissions chat-layout__panel--right__body">
      <div class="submissions-container">
        <div class="tasks">
          {job.tasks?.map((task: Task) => {
            return (
              <label class="submission-tasks">
                <input
                  type="radio"
                  name="submission-tasks"
                  id={task.id}
                  checked={currentTask.value?.id == task.id}
                  hidden
                  onInput={() => {
                    currentTask.value = task;
                  }}
                />
                {task.title}
              </label>
            );
          })}
        </div>

        <div class="leaderboard">
          <div class="actions">
            <div class="switch-views">
              <label>
                <input
                  type="radio"
                  name="submissions-view"
                  checked={view.value === 'table'}
                  onInput={() => {
                    view.value = 'table';
                  }}
                  hidden
                />
                <AIcon startPaths={Icons.Table} />
              </label>
              <label>
                <input
                  type="radio"
                  name="submissions-view"
                  checked={view.value === 'grid'}
                  onInput={() => {
                    view.value = 'grid';
                  }}
                  hidden
                />
                <AIcon startPaths={Icons.Grid} />
              </label>
            </div>

            <div class="search">
              <AIcon startPaths={Icons.Search} />
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          <TableView
            widths={[90, '50%', 90, 90, 140, 100, '20%']}
            fields={fields}
            data={submissions.value}
            className="table"
            onClickRow={d => {
              globalThis.location.assign(`/projects/${project.id}/${chat.id}/submissions/${d.id}`);
            }}
          />
        </div>
      </div>

      <button class="new-submission-btn" onClick={() => (openSubmissionsModal.value = true)}>
        + New Submission
      </button>
      <NewSubmission
        project={project}
        user={user}
        job={job}
        task={currentTask.value || undefined}
        openSubmissionsModal={openSubmissionsModal}
      />
    </div>
  );
}
