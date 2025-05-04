// deno-lint-ignore-file no-explicit-any no-unused-vars
import { useRef } from 'preact/hooks';
import { Signal, useSignal } from '@preact/signals';
import FileUploader from '../../../UI/FileUploader/FileUploader.tsx';
import AIcon, { Icons } from '../../../Icons.tsx';
import RichTextField from '../../../UI/Fields/RichTextField.tsx';
import TextField from '../../../UI/Fields/TextField.tsx';
import {
  FileReference,
  Files,
  jsonTag,
  Metrics,
  Task,
  User,
} from '../../../../lib/newtypes/index.ts';
import FileField from '../../../UI/Fields/FileField.tsx';
import NewTask from './NewTask.tsx';
import NewMetric from './NewMetric.tsx';
import DateField from '../../../UI/Fields/DateField.tsx';
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import CurrencyField from '../../../UI/Fields/CurrencyField.tsx';

export default function NewJob({
  open,
  user,
  job,
  jobs,
}: {
  open: Signal<boolean>;
  user: User;
  job?: Task | null;
  jobs: Signal<Task[]>;
}) {
  const title = useSignal<string>('');
  const description = useSignal<jsonTag | undefined>(undefined);
  const uploadedFiles = useSignal<(Files | FileReference)[]>([]);
  const tasks = useSignal<Task[]>([]);
  const metrics = useSignal<Metrics>({});
  const budget = useSignal<number>(0);
  const now = DateTime.now().plus({ day: 1 });
  const startDate = useSignal<string>(now.toFormat("yyyy-LL-dd'T'00:00"));
  const endDate = useSignal<string>(now.plus({ month: 1 }).toFormat("yyyy-LL-dd'T'00:00"));

  if (job) {
    title.value = job.title || '';
    description.value = (job.description as jsonTag) || undefined;
    uploadedFiles.value = job.attachments || [];
    tasks.value = job.tasks || [];
    metrics.value = job.metrics || {};
    budget.value = job.budgetAllocated || 0;
    startDate.value =
      job.startDate?.toFormat("yyyy-LL-dd'T'00:00") || now.toFormat("yyyy-LL-dd'T'00:00");
    endDate.value =
      job.endDate?.toFormat("yyyy-LL-dd'T'00:00") ||
      now.plus({ month: 1 }).toFormat("yyyy-LL-dd'T'00:00");
  }

  const modalRef = useRef<any>(null);
  const modalSettings = useSignal({
    title: '',
    path: '',
    uploadType: '',
    fileType: '',
    onUpload: (files?: Files[] | undefined) => {},
  });

  function createNewJob() {
    if (!title.value.trim()) {
      alert('Please provide a job title');
      return;
    }

    if (tasks.value.length > 0) {
      const startDates = tasks.value.map(task => DateTime.fromISO(task.startDate!.toISO()!));
      const endDates = tasks.value.map(task => DateTime.fromISO(task.endDate!.toISO()!));

      startDate.value = DateTime.min(...startDates).toFormat("yyyy-LL-dd'T'00:00");
      endDate.value = DateTime.max(...endDates).toFormat("yyyy-LL-dd'T'00:00");
    }

    const newJob: Task = {
      id: crypto.randomUUID(),
      title: title.value,
      description: description.value || undefined,
      budgetAllocated:
        tasks.value.length > 0
          ? tasks.value.reduce((sum, task) => sum + (task.budgetAllocated || 0), 0)
          : budget.value,
      startDate: DateTime.fromFormat(startDate.value, "yyyy-LL-dd'T'00:00"),
      endDate: DateTime.fromFormat(endDate.value, "yyyy-LL-dd'T'00:00"),
      attachments: uploadedFiles.value as Files[],
      metrics: metrics.value,
      tasks: tasks.value,
    };

    if (job) {
      jobs.value = [
        ...jobs.value.map(j => {
          if (j.id === job!.id) j = newJob;
          return j;
        }),
      ];
    } else jobs.value = [...jobs.value, newJob];

    console.log(jobs.value);

    open.value = false;
    title.value = '';
    description.value = undefined;
    uploadedFiles.value = [];
    tasks.value = [];
    metrics.value = {};
  }

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
            onClick={() => createNewJob()}
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

          {tasks.value.length === 0 ? (
            <>
              <CurrencyField val={budget}>Budget</CurrencyField>

              <div class="new-job__create__profile-dates">
                <DateField val={startDate} min={now.toFormat("yyyy-LL-dd'T'00:00")}>
                  Start Date
                </DateField>
                <DateField
                  val={endDate}
                  min={startDate.value ?? now.toFormat("yyyy-LL-dd'T'00:00")}
                >
                  End Date
                </DateField>
              </div>
            </>
          ) : (
            <>
              <div>
                <p>Budget</p>
                <p>{tasks.value.reduce((sum, task) => sum + (task.budgetAllocated || 0), 0)}</p>
              </div>

              <div>
                {(() => {
                  const startDates = tasks.value.map(task =>
                    DateTime.fromISO(task.startDate!.toISO()!)
                  );
                  const endDates = tasks.value.map(task =>
                    DateTime.fromISO(task.endDate!.toISO()!)
                  );

                  const minStart = DateTime.min(...startDates);
                  const maxEnd = DateTime.max(...endDates);

                  // return `From ${minStart.toFormat('DDD')} to ${maxEnd.toFormat('DDD')}`;
                  return (
                    <div class="new-job__create__profile-dates-minmax">
                      <div class="new-job__create__profile-dates-start">
                        <p class="new-job__create__profile-dates-title">Start Date</p>
                        <p class="new-job__create__profile-dates-date">
                          {minStart.toFormat('DD - HH:mm')}
                        </p>
                      </div>

                      <div class="new-job__create__profile-dates-end">
                        <p class="new-job__create__profile-dates-title">End Date</p>
                        <p class="new-job__create__profile-dates-date">
                          {maxEnd.toFormat('DD - HH:mm')}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          )}
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

          <NewMetric metrics={metrics} />
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
