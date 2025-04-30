import { normalizeTask, Task } from '../../newtypes/index.ts';
import { getSupabaseClient } from '../../supabase/client.ts';

/**
 * Fetch tasks under a job.
 */
export async function fetchTasksByJobId(jobId: string, accessToken: string): Promise<Task[]> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase.from('tasks').select('*').eq('job_id', jobId);

  if (error) throw new Error(error.message);
  return (data || []).map(normalizeTask);
}

/**
 * Fetch a single task by ID.
 */
export async function fetchTaskById(id: string, accessToken: string): Promise<Task> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase.from('tasks').select('*').eq('id', id).single();

  if (error) throw new Error(error.message);
  return normalizeTask(data);
}

/**
 * Add a new task to a job.
 */
export async function addTask(
  task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  jobId: string,
  accessToken: string
): Promise<Task> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      job_id: jobId,
      title: task.title,
      description: task.description,
      status: task.status,
      start_date: task.startDate,
      end_date: task.endDate,
      budget_allocated: task.budgetAllocated,
      metrics: task.metrics ?? {},
      meta: task.meta ?? {},
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return normalizeTask(data);
}

/**
 * Update a task.
 */
export async function updateTask(
  taskId: string,
  updates: Partial<Task>,
  accessToken: string
): Promise<Task> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase
    .from('tasks')
    .update({
      title: updates.title,
      description: updates.description,
      status: updates.status,
      start_date: updates.startDate,
      end_date: updates.endDate,
      budget_allocated: updates.budgetAllocated,
      metrics: updates.metrics,
      meta: updates.meta,
    })
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return normalizeTask(data);
}

/**
 * Delete a task by ID.
 */
export async function deleteTask(id: string, accessToken: string): Promise<boolean> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}
