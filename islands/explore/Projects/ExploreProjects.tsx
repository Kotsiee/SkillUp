import { useEffect, useState } from 'preact/hooks';
import { PageProps } from '$fresh/server.ts';
import ExploreFilters from '../ExploreFilter.tsx';
import { parseProjectFilter } from '../../../lib/utils/parsers.ts';
import ProjectList from './ExploreProjectsList.tsx';
import { useSignal } from '@preact/signals';
import { ProjectDetails } from './ExploreProjectsDetails.tsx';

export default function ExploreProjects({ ctx }: { ctx: PageProps }) {
  const url = useSignal(new URL(ctx.url));
  const project = useSignal(null);
  const filters = parseProjectFilter(url.value.search);

  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
    fetch(`/api/user/projects/allprojects`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(projs => {
        setUserProjects(projs.json);
        console.log(projs.json);
      });
  }, []);

  useEffect(() => {
    url.value = new URL(ctx.url);
  }, [ctx.url]);

  return (
    <div>
      <ExploreFilters
        url={url.value}
        sort={['Best Match', 'Most Recent', 'Recently Updated', 'Estimated Budget', 'Contributors']}
        startSort={url.value.searchParams.get('sort') || 'Best Match'}
        filter={[
          {
            contentType: 'multi-dropdown',
            items: ['English', 'French'],
            name: 'Job Type',
            placeholder: 'Job Type...',
            startFilters: {
              items: url.value.searchParams.get('jobType')?.split(','),
            },
          },
          {
            contentType: 'multi-dropdown',
            items: ['English', 'French'],
            name: 'Language',
            placeholder: 'Language...',
            startFilters: {
              items: url.value.searchParams.get('language')?.split(','),
            },
          },
          {
            contentType: 'dual-slider',
            name: 'Budget',
            min: 0,
            max: 123,
            step: 3,
            startFilters: {
              min: url.value.searchParams.get('minBudget') as any as number | 'min',
              max: url.value.searchParams.get('maxBudget') as any as number | 'max',
            },
          },
          {
            contentType: 'dual-slider',
            name: 'Contributors',
            min: 0,
            max: 500,
            step: 20,
            startFilters: {
              min: url.value.searchParams.get('minContributors') as any as number | 'min',
              max: url.value.searchParams.get('maxContributors') as any as number | 'max',
            },
          },
        ]}
      />

      <div class="explore-projects" f-client-nav>
        <div class="explore-projects-items">
          <ProjectList
            project={project}
            filters={{
              project: url.value.searchParams.get('project') || undefined,
            }}
          />
        </div>

        <div class="explore-projects-details">
          <div class="container">
            <ProjectDetails project={project.value} userProjects={userProjects} />
          </div>
        </div>
      </div>
    </div>
  );
}
