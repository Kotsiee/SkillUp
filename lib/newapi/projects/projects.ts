// deno-lint-ignore-file no-explicit-any
import {
  normalizeProject,
  normalizeProjectRole,
  normalizeTask,
  Project,
} from '../../newtypes/index.ts';
import { getSupabaseClient } from '../../supabase/client.ts';
import { fetchTeamLogo } from '../teams/teams.ts';
import { normalizeTeam } from './../../newtypes/teams/teams.ts';

/**
 * Fetch a single project by ID.
 */
export async function fetchProjectById(id: string, accessToken: string): Promise<Project> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase.rpc('get_full_project_by_id', { project_uuid: id });

  if (error) throw new Error('fetchProjectById - ' + error.message);

  data.team.logo = await fetchTeamLogo(data.team.id, accessToken);

  return normalizeProject(data); // You can write normalizeProject to map the nested JSON if needed
}

/**
 * Fetch projects linked to a team ID.
 */
export async function fetchProjectsByTeamId(
  teamId: string,
  accessToken: string
): Promise<Project[]> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase.from('projects').select('*').eq('team_id', teamId);

  if (error) throw new Error(error.message);
  return (data || []).map(normalizeProject);
}

/**
 * Fetch projects a user is linked to via roles.
 */
export async function fetchProjectsByUserId(
  userId: string,
  accessToken: string
): Promise<Project[]> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase.rpc('get_projects_by_user', {
    user_id_input: userId,
  });

  if (error) throw new Error(error.message);

  const projects = await Promise.all(
    (data || []).map(async (item: { project: any; role: any; jobs: any[]; team: any }) => {
      const project = normalizeProject(item.project);
      const role = normalizeProjectRole(item.role);

      if (item.jobs) {
        project.jobs = item.jobs.map((rawJob: any) => {
          const job = normalizeTask(rawJob);
          if (rawJob.tasks) {
            job.tasks = rawJob.tasks.map((rawTask: any) => normalizeTask(rawTask));
          } else {
            job.tasks = [];
          }
          return job;
        });
      } else {
        project.jobs = [];
      }

      if (item.team.has_logo) {
        item.team.logo = await fetchTeamLogo(item.team.id, accessToken);
      }
      project.team = normalizeTeam(item.team) ?? undefined;

      return { project, role };
    })
  );

  return projects;
}

/**
 * Search & filter projects.
 */
export async function searchProjects(
  query: string,
  filters: {
    status?: string[];
    minBudget?: number;
    maxBudget?: number;
    startDate?: Date;
    endDate?: Date;
  },
  accessToken?: string
): Promise<Project[]> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  let base = supabase.from('projects').select(`
      *,
      jobs:jobs (
        *,
        tasks:tasks (*)
      )
    `);

  if (filters.status) base = base.in('status', filters.status);
  if (filters.minBudget) base = base.gte('total_budget', filters.minBudget);
  if (filters.maxBudget) base = base.lte('total_budget', filters.maxBudget);
  if (filters.startDate) base = base.gte('start_date', filters.startDate.toISOString());
  if (filters.endDate) base = base.lte('end_date', filters.endDate.toISOString());

  const { data, error } = await base;
  if (error) throw new Error(error.message);

  const flatSearch = (text: string) => text?.toLowerCase().includes(query.toLowerCase());

  return (data || [])
    .map((raw: any) => {
      const project = normalizeProject(raw);
      project.jobs = (raw.jobs || []).map((job: any) => {
        const jobObj = normalizeTask(job);
        jobObj.tasks = (job.tasks || []).map(normalizeTask);
        return jobObj;
      });
      return project;
    })
    .filter((project: Project) => {
      const titleMatch = flatSearch(project.title || '');
      const descMatch = flatSearch(project.description || '');
      const jobMatch = project.jobs?.some(
        job => flatSearch(job.title || '') || flatSearch(job.description || '')
      );
      const taskMatch = project.jobs?.some(job =>
        job.tasks?.some(task => flatSearch(task.title || '') || flatSearch(task.description || ''))
      );
      return titleMatch || descMatch || jobMatch || taskMatch;
    });
}

/**
 * Create a new project.
 */
export async function addProject(
  project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
  accessToken: string
): Promise<Project> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase
    .from('projects')
    .insert({
      team_id: project.team?.id,
      title: project.title,
      description: project.description,
      attachments: project.attachments ?? [],
      is_public: project.is_public ?? false,
      status: project.status ?? 'active',
      start_date: project.startDate,
      end_date: project.endDate,
      total_budget: project.totalBudget ?? 0,
      budget_locked: project.budgetLocked ?? 0,
      budget_used: project.budgetUsed ?? 0,
      budget_returned: project.budgetReturned ?? 0,
      meta: project.meta ?? {},
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return normalizeProject(data);
}

/**
 * Update an existing project.
 */
export async function updateProject(
  id: string,
  updates: Partial<Project>,
  accessToken: string
): Promise<Project> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase
    .from('projects')
    .update({
      title: updates.title,
      description: updates.description,
      status: updates.status,
      attachments: updates.attachments,
      is_public: updates.is_public,
      start_date: updates.startDate,
      end_date: updates.endDate,
      total_budget: updates.totalBudget,
      budget_locked: updates.budgetLocked,
      budget_used: updates.budgetUsed,
      budget_returned: updates.budgetReturned,
      meta: updates.meta,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return normalizeProject(data);
}

/**
 * Delete a project.
 */
export async function deleteProject(id: string, accessToken: string): Promise<boolean> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}
