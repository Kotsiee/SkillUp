import { Signal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';
import { Task } from '../../../../lib/newtypes/index.ts';
import Timeline from '../../../UI/Timeline/Timeline.tsx';

export default function ProjectTimeline({
  jobs,
}: //   ...props
{
  jobs: Signal<Task[]>;
} & JSX.HTMLAttributes<HTMLDivElement>) {
  //   const selectedJob = useSignal<Task | null>(null);

  return (
    <div>
      <p>Hello</p>
      <Timeline
        plots={jobs.value
          .filter(job => job.id && job.title && job.startDate && job.endDate)
          .map(job => {
            return {
              id: job.id!,
              item: job.title!,
              startDate: job.startDate!,
              endDate: job.endDate!,

              subItems: job.tasks?.map(task => {
                return {
                  id: task.id!,
                  item: task.title!,
                  startDate: task.startDate!,
                  endDate: task.endDate!,
                };
              }),
            };
          })}
      />
    </div>
  );
}
