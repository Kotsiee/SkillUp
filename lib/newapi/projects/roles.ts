import { normalizeProjectRole, ProjectRole } from '../../newtypes/index.ts';
import { getSupabaseClient } from '../../supabase/client.ts';
/**
 * Fetch a role by ID.
 */
export async function fetchRoleById(id: string, accessToken: string): Promise<ProjectRole> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase.from('roles').select('*').eq('id', id).single();

  if (error) throw new Error(error.message);
  return normalizeProjectRole(data);
}

/**
 * Fetch all roles in a project.
 */
export async function fetchRolesByProjectId(
  projectId: string,
  accessToken: string
): Promise<ProjectRole[]> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase.from('roles').select('*').eq('project_id', projectId);

  if (error) throw new Error(error.message);
  return (data || []).map(normalizeProjectRole);
}

/**
 * Fetch all roles held by a user.
 */
export async function fetchRolesByUserId(
  userId: string,
  accessToken: string
): Promise<ProjectRole[]> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase.from('roles').select('*').eq('user_id', userId);

  if (error) throw new Error(error.message);
  return (data || []).map(normalizeProjectRole);
}

/**
 * Add a new project role.
 */
export async function addRole(
  projectId: string,
  userId: string,
  type: string,
  accessToken: string
): Promise<ProjectRole> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase
    .from('roles')
    .insert({
      project_id: projectId,
      user_id: userId,
      type,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return normalizeProjectRole(data);
}

/**
 * Update a role's type.
 */
export async function updateRoleType(
  roleId: string,
  type: string,
  accessToken: string
): Promise<ProjectRole> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase
    .from('roles')
    .update({ type })
    .eq('id', roleId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return normalizeProjectRole(data);
}

/**
 * Delete a role.
 */
export async function deleteRole(roleId: string, accessToken: string): Promise<boolean> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { error } = await supabase.from('roles').delete().eq('id', roleId);
  if (error) throw new Error(error.message);
  return true;
}
