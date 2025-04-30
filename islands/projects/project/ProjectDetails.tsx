import { useEffect } from 'preact/hooks';
import { PageProps } from '$fresh/server.ts';

export default function ProjectDetails({ pageProps }: { pageProps: PageProps }) {
  useEffect(() => {
    console.log('ProjectDetails', pageProps.params);
  }, [pageProps.params]);

  return (
    <div class="projects-list" role="region" aria-label="Projects List">
      <h1>Select a Job</h1>
    </div>
  );
}
