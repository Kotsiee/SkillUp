import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { useRef, useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

export default function TableView({
  fields,
  widths,
  data,
  className,
  sortField,
  onClickRow,
}: {
  fields: string[];
  widths?: (number | string)[];
  data: { [field: string]: string | number | boolean | DateTime | undefined }[];
  className?: string;
  sortField?: string;
  onClickRow?: (d: any) => void;
}) {
  const columnRefs = useRef<(HTMLTableCellElement | null)[]>([]);
  const order = useSignal<1 | -1>(1);
  const sort = useSignal<string | undefined>(sortField);

  useEffect(() => {
    columnRefs.current.forEach((th, index) => {
      const resizer = th?.querySelector('.resizer') as HTMLDivElement;
      if (!resizer || !th) return;

      let startX = 0;
      let startWidth = 0;
      let nextTh: HTMLTableCellElement | null = null;
      let nextStartWidth = 0;

      const onMouseDown = (e: MouseEvent) => {
        startX = e.clientX;
        startWidth = th.offsetWidth;

        nextTh = columnRefs.current[index + 1];
        nextStartWidth = nextTh?.offsetWidth ?? 0;

        // Lock widths before resizing
        columnRefs.current.forEach(col => {
          if (col) {
            col.style.width = `${col.getBoundingClientRect().width}px`;
          }
        });

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };

      const onMouseMove = (e: MouseEvent) => {
        const delta = e.clientX - startX;
        const newWidth = Math.max(startWidth + delta, 80);
        const newNextWidth = Math.max(nextStartWidth - delta, 80);

        th.style.width = `${newWidth}px`;

        if (nextTh) {
          nextTh.style.width = `${newNextWidth}px`;
        }
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      resizer.addEventListener('mousedown', onMouseDown);
    });
  }, []);

  return (
    <div class={className}>
      <table>
        <thead>
          <tr>
            {fields.map((col, i) => (
              <th
                ref={el => (columnRefs.current[i] = el)}
                style={{
                  width:
                    widths && widths[i]
                      ? typeof widths[i] === 'number'
                        ? `${widths[i]}px`
                        : widths[i]
                      : `calc(100% / ${fields.length})`,
                }}
              >
                <p>{col}</p>
                {i !== fields.length - 1 ? <div class="resizer" /> : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data
            .sort((a, b) => {
              if (!sort.value) return 0;

              const aVal = a[sort.value];
              const bVal = b[sort.value];

              if (aVal === undefined) return 1;
              if (bVal === undefined) return -1;

              if (typeof aVal === 'number' && typeof bVal === 'number') {
                return (aVal - bVal) * order.value;
              }

              if (typeof aVal === 'string' && typeof bVal === 'string') {
                return aVal.localeCompare(bVal) * order.value;
              }

              if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
                return (Number(aVal) - Number(bVal)) * order.value;
              }

              if (DateTime.isDateTime(aVal) && DateTime.isDateTime(bVal)) {
                return aVal.toMillis() < bVal.toMillis()
                  ? -1 * order.value
                  : aVal.toMillis() > bVal.toMillis()
                  ? 1 * order.value
                  : 0;
              }

              return 0;
            })
            .map((row, i) => (
              <tr
                onClick={() => {
                  onClickRow?.(row);
                }}
              >
                {fields.map(field => (
                  <td key={field}>{row[field]}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
