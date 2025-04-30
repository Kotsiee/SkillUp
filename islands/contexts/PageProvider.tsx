import { createContext } from 'preact';
import { useContext, useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

const PageContext = createContext<{
  url: ReturnType<typeof useSignal<string>>;
  params: ReturnType<typeof useSignal<Record<string, string>>>;
} | null>(null);

export function PageProvider(props: { children: preact.ComponentChildren }) {
  const url = useSignal(globalThis.location?.pathname);
  const params = useSignal<Record<string, string>>({});

  // Update on navigation
  useEffect(() => {
    const handler = () => {
      url.value = globalThis.location.pathname;

      // Extract params manually if needed
      const searchParams = new URLSearchParams(globalThis.location.search);
      const paramsObj: Record<string, string> = {};
      searchParams.forEach((value, key) => (paramsObj[key] = value));
      params.value = paramsObj;
    };

    globalThis.addEventListener('popstate', handler);
    globalThis.addEventListener('pushstate', handler); // optional if you patch pushstate
    globalThis.addEventListener('replacestate', handler);

    return () => {
      globalThis.removeEventListener('popstate', handler);
      globalThis.removeEventListener('pushstate', handler);
      globalThis.removeEventListener('replacestate', handler);
    };
  }, []);

  return <PageContext.Provider value={{ url, params }}>{props.children}</PageContext.Provider>;
}

export function usePage() {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error('usePage must be used inside a PageProvider');
  return ctx;
}
