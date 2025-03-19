// deno-lint-ignore-file no-explicit-any
import AIcon, { Icons } from "../Icons.tsx";

export default function TextToolbar({ quillRef, styles }: { quillRef: any; styles: any }) {
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
      <div class="advanced-text-area">
        <ul className="text-style">
          {["bold", "italic", "underline", "strike"].map((style) => (
            <li
              key={style}
              class={`${style}${styles.value[style] ? " enabled" : ""}`}
              onClick={() => {
                quillRef.current?.format(style, !styles.value[style]);
                updateStyles();
              }}
            >
              <AIcon
                startPaths={Icons[style.charAt(0).toUpperCase() + style.slice(1)]}
              />
            </li>
          ))}
        </ul>
  
        <ul className="text-style">
          {["bullet", "ordered"].map((style) => (
            <li
              key={style}
              class={`${style}${styles.value[style] ? " enabled" : ""}`}
              onClick={() => {
                quillRef.current?.format("list", styles.value.list = style);
                updateStyles();
              }}
            >
              <AIcon
                startPaths={Icons[style.charAt(0).toUpperCase() + style.slice(1)]}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
