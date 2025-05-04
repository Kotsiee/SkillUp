import { Signal } from 'https://esm.sh/@preact/signals-core@1.5.1/dist/signals-core.js';
import AIcon, { Icons } from '../../Icons.tsx';
import { TimelineData } from './Timeline.tsx';

export default function TimelineItems({
  item,
  opened,
  selectedItem,
}: {
  item: TimelineData;
  opened: Signal<string[]>;
  selectedItem: Signal<string | null>;
}) {
  return (
    <div class="timeline-items">
      <div class="timeline-item level-1">
        <label>
          <input
            type="checkbox"
            hidden
            onInput={val => {
              if (!val.currentTarget.checked) opened.value = opened.value.filter(i => i != item.id);
              else opened.value = [...opened.value, item.id];
            }}
          />
          <AIcon
            className="timeline-item-more"
            startPaths={Icons.DownChevron}
            endPaths={Icons.UpChevron}
            size={20}
          />
        </label>

        <p
          class={selectedItem.value === item.id ? 'active' : ''}
          onClick={() => {
            if (selectedItem.value === item.id) selectedItem.value = null;
            else selectedItem.value = item.id;
            console.log(selectedItem.value);
          }}
        >
          {item.item.replaceAll(' ', '\u00A0')}
        </p>
      </div>

      {opened.value.includes(item.id) ? (
        <div>
          {item.subItems?.map(subItem => {
            return (
              <label class="timeline-item level-2">
                <p
                  class={selectedItem.value === subItem.id ? 'active' : ''}
                  onClick={() => {
                    if (selectedItem.value === subItem.id) selectedItem.value = null;
                    else selectedItem.value = subItem.id;
                    console.log(selectedItem.value);
                  }}
                >
                  {subItem.item.replaceAll(' ', '\u00A0')}
                </p>
              </label>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
