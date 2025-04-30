import { Signal, useSignal } from '@preact/signals';
import Quill from 'https://esm.sh/quill@2.0.3';
import { useEffect, useRef } from 'preact/hooks';
import { JSX } from 'preact/jsx-runtime';
import AIcon, { Icons } from '../../Icons.tsx';
import { toJSON } from '../../../lib/utils/messages.ts';

export default function RichTextField({
  val,
  ...props
}: {
  val: Signal<any>;
} & JSX.HTMLAttributes<HTMLInputElement>) {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  const styles = useSignal({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    list: {},
    colour: {},
    header: {},
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && editorRef.current) {
      import('https://esm.sh/quill@2.0.3')
        .then(({ default: Quill }) => {
          quillRef.current = new Quill(editorRef.current!, {
            placeholder: 'hello',
            modules: {
              toolbar: toolRef.current,
            },
          });
        })
        .catch(error => console.error('Failed to load Quill:', error));
    }
  }, []);

  return (
    <div class={`input-field input-field--richtext ${props.class}`}>
      <p class="input-field-title input-field--richtext-title">{props.children}</p>

      <div class="input-field--richtext-area">
        <div
          class="input-field--richtext-area-input"
          ref={editorRef}
          onInput={() => {
            val.value = toJSON(quillRef.current!.root, 'ROOT', 0);
          }}
        />
        <TextToolbar quillRef={quillRef} styles={styles} />
      </div>
    </div>
  );
}

function TextToolbar({ quillRef, styles }: { quillRef: any; styles: any }) {
  function updateStyles() {
    const range = quillRef.current?.getSelection();
    if (!range) return;

    const format = quillRef.current!.getFormat(range.index);
    styles.value = {
      bold: !!format.bold,
      italic: !!format.italic,
      underline: !!format.underline,
      strike: !!format.strike,
      list: format.list || {},
      colour: format.color || {},
      header: format.header || {},
    };
  }

  return (
    <div class="input-field--richtext__toolbar">
      <div class="input-field--richtext__toolbar-style">
        {['bold', 'italic', 'underline', 'strike'].map(style => (
          <div
            key={style}
            class={`input-field--richtext__toolbar-style-item ${style} ${
              styles.value[style] ? '--enabled' : ''
            }`}
            onClick={() => {
              quillRef.current?.format(style, !styles.value[style]);
              updateStyles();
            }}
          >
            <AIcon startPaths={Icons[style.charAt(0).toUpperCase() + style.slice(1)]} size={20} />
          </div>
        ))}
      </div>

      <div className="input-field--richtext__toolbar-style">
        {['bullet', 'ordered'].map(style => (
          <div
            key={style}
            class={`input-field--richtext__toolbar-style-item ${style} ${
              styles.value[style] ? '--enabled' : ''
            }`}
            onClick={() => {
              quillRef.current?.format('list', (styles.value.list = style));
              updateStyles();
            }}
          >
            <AIcon startPaths={Icons[style.charAt(0).toUpperCase() + style.slice(1)]} size={20} />
          </div>
        ))}
      </div>
    </div>
  );
}
