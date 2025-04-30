import { Files } from '../../newtypes/index.ts';
import { normalizeSubmission, Submission } from '../../newtypes/projects/submissions.ts';
import { getSupabaseClient } from '../../supabase/client.ts';
import { fetchFileById } from '../files/files.ts';
import { uploadFileToBucket } from '../storage/storage.ts';

/**
 * Fetch a submission by ID.
 */
export async function fetchSubmissionById(
  id: string,
  accessToken: string
): Promise<Submission | null> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase.rpc('get_submission_by_id', { submission_uuid: id });

  if (error) {
    console.error('Error fetching submission:', error.message);
    return null;
  }

  const submission = await Promise.all(
    (data.fileRefs || []).map(async (fileRef: any) => {
      const file = await fetchFileById(fileRef.file.id, accessToken);
      return {
        ...fileRef,
        file,
      };
    })
  );

  console.log({ ...data, fileRefs: submission });

  return data ? normalizeSubmission({ ...data, file: submission }) : null;
}

/**
 * Fetch all submissions for a given job ID.
 */
export async function fetchSubmissionsByJobId(
  jobId: string,
  accessToken: string
): Promise<Submission[]> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase.rpc('get_submissions_by_job', { job_uuid: jobId });

  if (error) throw new Error('fetchSubmissionsByJobId - ' + error.message);

  return (data || []).map((row: any) => normalizeSubmission(row.submission));
}

/**
 * Fetch all submissions made by a specific user.
 */
export async function fetchSubmissionsByUserId(
  userId: string,
  accessToken: string
): Promise<Submission[]> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase.from('submissions').select('*').eq('user_id', userId);

  if (error) throw new Error(error.message);

  return (data || []).map(normalizeSubmission);
}

/**
 * Create a new submission.
 */
export async function addSubmission(
  submission: Omit<Submission, 'id' | 'createdAt'>,
  accessToken: string
): Promise<Submission | null> {
  const supabase = getSupabaseClient(accessToken);

  const { data: rpcData, error: rpcError } = await supabase
    .schema('projects')
    .rpc('add_submission', {
      job_uuid: submission.job,
      task_uuid: submission.task,
      user_uuid: submission.user,
      team_uuid: submission.team,
      title: submission.title,
      description: submission.description,
      meta: submission.meta,
      files: (submission.files as Files[]).map(file => {
        return {
          mime_type: file.mimeType,
          extension: file.extension,
          public_name: file.publicName,
          verified: file.verified,
          meta: file.meta,
        };
      }),
    });

  if (rpcError) throw new Error('addSubmission - RPC failed: ' + rpcError.message);

  const submissionId = rpcData.submission_id;
  const uploadedFiles = rpcData.files; // [{ file_id, file_reference_id }]

  if (!submissionId || !uploadedFiles.length) {
    throw new Error('addSubmission - Invalid RPC response');
  }

  // 3. Upload each physical file to storage
  await Promise.all(
    uploadedFiles.map(async (uploadedFile: { file_id: any }, index: number) => {
      const fileObj = submission.files[index] as Files;
      if (!fileObj) return;

      //   const filePath = `profile/${submission.team}/shared/submissions/${submissionId}/${
      //     uploadedFile.file_id
      //   }.${fileObj.extension}`;

      fileObj.filePath = `shared/submissions/${submissionId}`;
      fileObj.storedName = `${uploadedFile.file_id}.${fileObj.extension}`;
      fileObj.recipient = submission.team;

      const fp = await uploadFileToBucket('user_uploads', fileObj, accessToken);

      console.log(fp);
    })
  );

  return rpcData;
}

/**
 * Update an existing submission.
 */
export async function updateSubmission(
  id: string,
  updates: Partial<Submission>,
  accessToken: string
): Promise<Submission> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { data, error } = await supabase
    .from('submissions')
    .update({
      is_disqualified: updates.isDisqualified,
      meta: updates.meta,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return normalizeSubmission(data);
}

/**
 * Delete a submission by ID.
 */
export async function deleteSubmission(id: string, accessToken: string): Promise<boolean> {
  const supabase = getSupabaseClient(accessToken).schema('projects');

  const { error } = await supabase.from('submissions').delete().eq('id', id);

  if (error) throw new Error(error.message);

  return true;
}
