// deno-lint-ignore-file no-explicit-any
import { Signal, useSignal } from '@preact/signals';
import { Project, Task } from '../../../../lib/types/index.ts';
import OptionSwitch from '../../../OptionSwitch.tsx';
import { setByPath } from '../../../../lib/utils/record.ts';
import { EditAttachments, EditTextbox } from '../../EditTools.tsx';
import { Timeline } from './timeline.tsx';
import { Budget } from './budget.tsx';
import EditLayout from '../../EditLayout.tsx';
import { useEffect } from 'preact/hooks';

interface LayoutProps {
  editableRecord: Signal<Record<string, any> | null>;
  modalRef?: any;
  modalSettings?: Signal<any>;
  type?: string;
}

export default function EditProject({
  editableRecord,
  modalRef,
  modalSettings,
  type,
}: LayoutProps) {
  const privacySetting = useSignal<string>('Private');
  const showJobsModal = useSignal<boolean>(false);
  const currentJob = useSignal<Task | null>(null);

  return (
    <div class="content">
      <link rel="stylesheet" href="/styles/islands/edit/projects/projects.css" />
      <h1>New Project</h1>
      <section id="Details">
        <h2>Project Details</h2>
        <div>
          <OptionSwitch
            options={['Private', 'Public']}
            currentOption={privacySetting}
            name="privacySetting"
            onSwitch={val => {
              const updated = setByPath(
                editableRecord,
                'is_public',
                val === 'Public' ? true : false
              );
              editableRecord.value = updated;
            }}
          />
        </div>

        <EditTextbox account={editableRecord} val="title" placeholder="Title">
          Project Title
        </EditTextbox>

        <EditTextbox account={editableRecord} val="description" placeholder="Description" resize>
          Description
        </EditTextbox>

        <EditAttachments
          modalRef={modalRef}
          modalSettings={modalSettings!}
          onAdd={files => {
            editableRecord.value = { ...editableRecord.value, attachments: files };
          }}
        />
      </section>
      <section id="Jobs">
        <h2>Jobs</h2>
        {(editableRecord.value as Project).jobs?.map(job => {
          return (
            <JobCard key={job.id} job={job} showJobsModal={showJobsModal} currentJob={currentJob} />
          );
        })}

        <NewJobModal
          modalRef={modalRef}
          modalSettings={modalSettings}
          editableRecord={editableRecord}
          showJobsModal={showJobsModal}
          currentJob={currentJob}
        />
      </section>
      <section id="Timeline">
        <h2>Timeline</h2>
        <Timeline />
      </section>
      <section id="Budget">
        <Budget project={editableRecord as Signal<Project>} />
      </section>
    </div>
  );
}

function NewJobModal({
  editableRecord,
  modalRef,
  modalSettings,
  showJobsModal,
  currentJob,
}: LayoutProps & {
  showJobsModal: Signal<boolean>;
  currentJob: Signal<Task | null>;
}) {
  const newJobTemplate = {
    title: '',
    budgetAllocated: 0,
    id: '',
  };

  const newJob = useSignal<Task>(newJobTemplate);

  useEffect(() => {
    if (currentJob.value) newJob.value = currentJob.value;
  }, [currentJob.value]);

  if (!showJobsModal.value)
    return (
      <div class="new-job-btn">
        <p
          onClick={() => {
            showJobsModal.value = true;
            currentJob.value = null;
            newJob.value = newJobTemplate;
          }}
        >
          + New Job
        </p>
      </div>
    );

  const processJob = () => {
    const newJobTasks = newJob.value.tasks;
    for (let i = 0; i < newJobTasks!.length; i++) {
      newJobTasks![i].budgetAllocated = 0;
      newJobTasks![i].id = crypto.randomUUID();
    }

    newJob.value = {
      ...newJob.value,
      id: crypto.randomUUID(),
      budgetAllocated: 0,
      tasks: newJobTasks,
    };
  };

  return (
    <div class="new-job-modal-container">
      <div class="back" onClick={() => (showJobsModal.value = false)} />
      <div class="new-job-modal">
        <div>
          <button
            onClick={() => {
              showJobsModal.value = false;
              newJob.value = newJobTemplate;
            }}
          >
            Back
          </button>
          <button
            onClick={() => {
              processJob();
              const jobs = [...((editableRecord.value as Project).jobs ?? []), newJob.value];

              editableRecord.value = { ...editableRecord.value, jobs: [...jobs] };
              newJob.value = newJobTemplate;
              console.log(editableRecord.value);
            }}
          >
            Create Job
          </button>
        </div>

        <EditLayout
          editableRecord={newJob}
          modalRef={modalRef}
          modalSettings={modalSettings!}
          type="jobs/create"
        />
      </div>
    </div>
  );
}

function JobCard({
  job,
  showJobsModal,
  currentJob,
}: {
  job: Task;
  showJobsModal: Signal<boolean>;
  currentJob: Signal<Task | null>;
}) {
  return (
    <div
      class="job-card"
      onClick={() => {
        currentJob.value = job;
        showJobsModal.value = true;
      }}
    >
      <div class="job-card-header">
        <h4 class="job-card-title">{job.title}</h4>
        <p class="job-card-desc">{job.description}</p>
      </div>

      {job.tasks && job.tasks.length > 0 ? (
        <div class="job-card-tasks">
          <p class="job-card-tasks-header">Tasks</p>
          <p class="job-card-tasks-data">{job.tasks?.map(task => task.title).join(', ')}</p>
        </div>
      ) : null}

      <div class="job-card-metrics">
        <p class="job-card-metrics-header">Metrics</p>
        <div class="job-card-metrics-data">
          {job.metrics
            ? Object.entries(job.metrics).map(([name, value]) => {
                return (
                  <p>
                    {name[0].toUpperCase() + name.substring(1, name.length)}: <b>{value.weight}</b>
                  </p>
                );
              })
            : null}
        </div>
      </div>

      <div class="job-card-dates">
        <p class="job-card-dates-header">Start / End Date</p>
        <p class="job-card-dates-data">
          {job.startDate?.toFormat('dd/MM/yyyy, HH:mm')} -{' '}
          {job.endDate?.toFormat('dd/MM/yyyy, HH:mm')}
        </p>
      </div>
    </div>
  );
}
