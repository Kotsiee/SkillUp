export interface ProjectFilter {
  project?: string;

  sort?: string;
  sortOrder?: string;

  search?: string;
  jobType?: string;
  language?: string;

  minContributors?: number;
  maxContributors?: number;

  minBudget?: number;
  maxBudget?: number;
}

export function parseProjectFilter(query: string): ProjectFilter {
  const params = new URLSearchParams(query);

  const filter: ProjectFilter = {
    sort: params.get('sort') || undefined,
    sortOrder: params.get('sortOrder') || undefined,

    search: params.get('q') || undefined,

    jobType: params.get('jobType') || undefined,
    language: params.get('language') || undefined,

    minContributors: params.get('minContributors')
      ? parseInt(params.get('minContributors')!)
      : undefined,
    maxContributors: params.get('maxContributors')
      ? parseInt(params.get('maxContributors')!)
      : undefined,

    minBudget: params.get('minBudget') ? parseFloat(params.get('minBudget')!) : undefined,
    maxBudget: params.get('maxBudget') ? parseFloat(params.get('maxBudget')!) : undefined,
  };

  return filter;
}

export function joinProjectFilter(filter: ProjectFilter | null): string {
  if (!filter) return '';

  const strArr: string[] = [];

  if (filter.sort) strArr.push(`sort=${filter.sort}`);
  if (filter.sortOrder !== undefined) strArr.push(`sortOrder=${filter.sortOrder}`);
  if (filter.search) strArr.push(`q=${encodeURIComponent(filter.search)}`);

  if (filter.jobType && filter.jobType.length > 0) strArr.push(`jobType=${filter.jobType}`);
  if (filter.language && filter.language.length > 0) strArr.push(`language=${filter.language}`);

  if (filter.minContributors !== undefined)
    strArr.push(`minContributors=${filter.minContributors}`);
  if (filter.maxContributors !== undefined)
    strArr.push(`maxContributors=${filter.maxContributors}`);

  if (filter.minBudget !== undefined) strArr.push(`minBudget=${filter.minBudget}`);
  if (filter.maxBudget !== undefined) strArr.push(`maxBudget=${filter.maxBudget}`);

  return strArr.join('&');
}

export function getCookie(name: string, cookies: string): string | undefined {
  return cookies
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1];
}
