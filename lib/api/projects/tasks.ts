// deno-lint-ignore-file no-explicit-any
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { supabase } from '../../supabase/client.ts';
import { Task } from '../../types/index.ts';

export async function fetchJobByID(id: string): Promise<Task | null> {
  if (!id) return null;

  const { data, error } = await supabase
    .schema('projects')
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.log('fetchTasksByID error was found :( - ' + error.message);
    return null;
  }

  const tasks: Task = {
    id: data.id,
    project: data.project_id,
    title: data.title,
    description: data.description,
    status: data.status,
    attachments: undefined,
    createdAt: DateTime.fromISO(data.created_at),
  };

  return tasks;
}

export async function fetchJobsByProject(id: string): Promise<Task[] | null> {
  const { data, error } = await supabase
    .schema('projects')
    .from('jobs')
    .select('*')
    .eq('project_id', id);

  if (error) {
    console.log('fetchTasksByProject error was found :( - ' + error.message);
    return null;
  }

  const tasks: Task[] = await Promise.all(
    data.map((d: any) => {
      return {
        id: d.id,
        project: d.project_id,
        title: d.title,
        description: d.description,
        status: d.status,
        attachments: undefined,
        createdAt: DateTime.fromISO(d.created_at),
      };
    })
  );

  return tasks;
}

interface MetricTemplateInner {
  weight: number;
  tasks?: {
    [taskName: string]: number | null;
  };
}

interface MetricTemplate {
  [metric: string]: MetricTemplateInner;
}

export async function newJob(task: Task, accessToken: string): Promise<Task | null> {
  const metrics: MetricTemplate = task.metrics ?? {};

  const taskWeights: Record<string, number> = Object.values(metrics).reduce(
    (acc: Record<string, number>, metric: MetricTemplateInner) => {
      if (metric.tasks) {
        for (const [taskName, weight] of Object.entries(metric.tasks)) {
          if (weight != null) {
            acc[taskName] = weight;
          }
        }
      }
      return acc;
    },
    {}
  );

  function extractTaskWeightsByMetric(
    metrics: MetricTemplate,
    taskName: string
  ): Record<string, number> {
    const result: Record<string, number> = {};

    for (const [metricName, metric] of Object.entries(metrics)) {
      const taskWeight = metric.tasks?.[taskName];
      if (taskWeight != null) {
        result[metricName] = taskWeight;
      }
    }

    return result;
  }

  const { data, error } = await supabase
    .schema('projects')
    .from('jobs')
    .insert([
      {
        id: crypto.randomUUID(),
        project_id: task.project?.id,
        title: task.title,
        description: task.description,
        status: 'In Progress',
        start_date: task.startDate,
        end_date: task.endDate,
        metrics: taskWeights,
        budget_allocated: task.budgetAllocated,
        hasTasks: task.tasks && task.tasks?.length > 0,
      },
    ])
    .select('*')
    .single();

  if (error) {
    console.log('newJob: error was found :( - ' + error.message);
    return null;
  }

  if (task.tasks && task.tasks?.length > 0)
    for (let i = 0; i < task.tasks.length; i++) {
      const newTask = {
        ...task.tasks[i],
        metrics: extractTaskWeightsByMetric(metrics, task.tasks[i].id!),
        id: crypto.randomUUID(),
        project: { id: data.id },
      };

      await newTasks(newTask, accessToken);
    }

  return data;
}

export async function newTasks(task: Task, accessToken: string): Promise<Task | null> {
  const { data, error } = await supabase
    .schema('projects')
    .from('tasks')
    .insert([
      {
        id: crypto.randomUUID(),
        job_id: task.project?.id,
        title: task.title,
        description: task.description,
        status: 'In Progress',
        start_date: task.startDate,
        end_date: task.endDate,
        metrics: task.metrics,
        budget_allocated: task.budgetAllocated,
      },
    ])
    .select('*')
    .single();

  if (error) {
    console.log('newTasks: error was found :( - ' + error.message);
    return null;
  }

  console.log(data);

  return data;
}
