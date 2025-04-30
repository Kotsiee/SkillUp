import { useEffect, useState } from 'preact/hooks';

export default function SideNav({ sections }: { sections?: string[] }) {
  if (!sections?.length) return null;
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const topVisible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (topVisible.length) {
          setActiveSection(topVisible[0].target.id);
        }
      },
      {
        rootMargin: '0px 0px -75% 0px',
        threshold: 0.1,
      }
    );

    document.querySelectorAll('section').forEach(s => observer.observe(s));
    return () => document.querySelectorAll('section').forEach(s => observer.unobserve(s));
  }, []);

  return (
    <div class="side-nav">
      <ul>
        {sections.map(id => (
          <li key={id}>
            <a href={`#${id}`} class={activeSection === id ? 'active' : ''}>
              {id.replace('-', ' ')}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
