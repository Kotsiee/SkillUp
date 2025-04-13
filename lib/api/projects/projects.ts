import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { Project, ProjectRole } from '../../types/index.ts';
import { supabase } from '../../supabase/client.ts';
import { fetchTeamByID } from '../teams/teams.ts';
import { fetchJobsByProject, newJob } from './tasks.ts';

export async function fetchProjects(searchValue?: string | null): Promise<Project[] | null> {
  const search = searchValue ? searchValue : '';

  const { data, error } = await supabase
    .schema('projects')
    .from('projects')
    .select('*')
    .or(`title.ilike.%${search}%,description.ilike.%${search}%`);

  if (error) {
    console.log('fetchProjects: error was found :( - ' + error.message);
    return null;
  }

  const projects: Project[] = await Promise.all(
    data.map(async d => {
      const team = (await fetchTeamByID(d.team_id)) || undefined;

      return {
        id: d.id,
        team,
        title: d.title,
        description: d.description,
        status: d.status,
        meta: d.meta,
        attachments: d.attachments,
        jobs: (await fetchJobsByProject(d.id)) || undefined,
        totalBudget: d.total_budget,
        createdAt: DateTime.fromISO(d.created_at),
        updatedAt: DateTime.fromISO(d.updated_at),
        startDate: DateTime.fromISO(d.start_date),
        endDate: DateTime.fromISO(d.end_date),
      };
    })
  );

  return projects;
}

export async function fetchProjectByID(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .schema('projects')
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.log('fetchProjectByID: error was found :( - ' + error.message);
    return null;
  }

  const team = (await fetchTeamByID(data.team_id)) || undefined;
  const projects: Project = {
    id: data.id,
    team,
    title: data.title,
    description: data.description,
    status: data.status,
    meta: data.meta,
    attachments: data.attachments,
    jobs: (await fetchJobsByProject(data.id)) || undefined,
    totalBudget: data.total_budget,
    createdAt: DateTime.fromISO(data.created_at),
    updatedAt: DateTime.fromISO(data.updated_at),
    startDate: DateTime.fromISO(data.start_date),
    endDate: DateTime.fromISO(data.end_date),
  };

  return projects;
}

export async function newProject(project: Project, accessToken: string): Promise<Project | null> {
  const { data, error } = await supabase
    .schema('projects')
    .from('projects')
    .insert([
      {
        id: crypto.randomUUID(),
        team_id: project.team?.id,
        title: project.title,
        description: project.description,
        status: 'In Progress',
        total_budget: project.totalBudget,
        budget_locked: project.budgetLocked || 0,
        budget_used: 0,
        budget_returned: 0,
        is_public: project.is_public,
      },
    ])
    .select('*')
    .single();

  if (error) {
    console.log('newProject: error was found :( - ' + error.message);
    return null;
  }

  if (project.jobs && project.jobs.length > 0)
    for (let i = 0; i < project.jobs.length; i++) {
      const job = {
        ...project.jobs[i],
        project: { id: data.id },
      };
      await newJob(job, accessToken);
    }

  return data;
}

export async function newProjectRole(
  project: ProjectRole,
  accessToken: string
): Promise<ProjectRole | null> {
  const { data, error } = await supabase
    .schema('projects')
    .from('roles')
    .insert([
      {
        project_id: project.project!.id,
        user_id: project.user!.id,
      },
    ])
    .select('*')
    .single();

  if (error) {
    console.log('newProject: error was found :( - ' + error.message);
    return null;
  }

  return data;
}
