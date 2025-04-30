import { normalizeTask, Task } from '../../newtypes/index.ts';
import { getSupabaseClient } from '../../supabase/client.ts';

/**
 * Fetch all jobs for a project.
 */
export async function fetchJobsByProjectId(
  projectId: string,
  accessToken: string
): Promise<Task[]> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase.from('jobs').select('*').eq('project_id', projectId);

  if (error) throw new Error(error.message);
  return (data || []).map(normalizeTask);
}

/**
 * Fetch a job by its ID.
 */
export async function fetchJobById(id: string, accessToken: string): Promise<Task> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();

  if (error) throw new Error(error.message);
  return normalizeTask(data);
}

/**
 * Add a new job under a project.
 */
export async function addJob(
  job: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  projectId: string,
  accessToken: string
): Promise<Task> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      project_id: projectId,
      title: job.title,
      description: job.description,
      status: job.status,
      start_date: job.startDate,
      end_date: job.endDate,
      metrics: job.metrics ?? {},
      meta: job.meta ?? {},
      budget_allocated: job.budgetAllocated ?? 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return normalizeTask(data);
}

/**
 * Update a job.
 */
export async function updateJob(
  id: string,
  updates: Partial<Task>,
  accessToken: string
): Promise<Task> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase
    .from('jobs')
    .update({
      title: updates.title,
      description: updates.description,
      status: updates.status,
      start_date: updates.startDate,
      end_date: updates.endDate,
      metrics: updates.metrics,
      meta: updates.meta,
      budget_allocated: updates.budgetAllocated,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return normalizeTask(data);
}

/**
 * Delete a job.
 */
export async function deleteJob(id: string, accessToken: string): Promise<boolean> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { error } = await supabase.from('jobs').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}
