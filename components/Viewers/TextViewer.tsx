import { Signal } from '@preact/signals';
import { Files } from '../../lib/newtypes/index.ts';

export default function TextViewer({
  file,
  controller,
}: {
  file: Files;
  controller: Signal<{ [ctrl: string]: Signal<any> } | null>;
}) {
  return (
    <div class="image-viewer">
      <h1>CBA</h1>
    </div>
  );
}
