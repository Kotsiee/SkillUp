// deno-lint-ignore-file no-explicit-any
import { useState, useEffect, useContext } from 'preact/hooks';
import { createContext } from 'preact';
import { PageProps } from '$fresh/server.ts';
import { Project } from '../../lib/newtypes/index.ts';

const ProjectContext = createContext<any>(null);

export function ProjectProvider({
  pageProps,
  children,
}: {
  pageProps: PageProps;
  children: preact.ComponentChildren;
}) {
  const [project, setProject] = useState<Project | null>(null);

  async function fetchProject(c: string): Promise<Project | null> {
    try {
      const response = await fetch(`/api/projects/${c}`);
      if (!response.ok) throw new Error('Failed to fetch chat data');
      const json = await response.json();
      setProject(json);
      return project;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  }

  useEffect(() => {
    if ((!project || project.id !== pageProps.params.projectid) && pageProps.params.projectid) {
      console.log('fetching project');
      fetchProject(pageProps.params.projectid);
    }
  }, [pageProps]);

  return (
    <ProjectContext.Provider value={{ project, fetchProject }}>{children}</ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
}
