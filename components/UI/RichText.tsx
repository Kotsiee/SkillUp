import { useRef, useEffect } from 'preact/hooks';
import { jsonTag } from '../../lib/newtypes/index.ts';
import { toHTML } from '../../lib/utils/messages.ts';
import { JSX } from 'preact/jsx-runtime';

export default function RichText({
  jsonText,
  className,
}: { jsonText: jsonTag } & JSX.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.innerHTML = '';

    const fragment = document.createDocumentFragment();
    jsonText.Children?.forEach(tag => {
      fragment.appendChild(toHTML(tag));
    });

    ref.current.appendChild(fragment);
  }, [jsonText]);

  return <div class={`richtext ${className}`} ref={ref} />;
}
