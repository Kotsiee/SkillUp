import { Signal, useSignal } from '@preact/signals';
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { JSX } from 'preact/jsx-runtime';
import AIcon, { Icons } from '../../../../components/Icons.tsx';

interface TimelineData {
  id: string;
  item: string;
  startDate: DateTime;
  endDate: DateTime;

  subItems?: TimelineData[];
}

interface ITimeline extends JSX.HTMLAttributes<HTMLDivElement> {
  plots?: TimelineData[];
  view?: 'day' | 'week' | 'month' | 'year';
}

export function Timeline({ data, ...props }: ITimeline) {
  const isDragging = useSignal(false);
  const xPos = useSignal(0);
  const startDate = DateTime.fromFormat('2025-03-14T00:00', "yyyy-LL-dd'T'HH:mm");

  const allDays = (noDaysDisplay: number, before: number, after: number) => {
    const start = startDate.minus({ days: before });
    const totalDays = before + noDaysDisplay + after;

    return Array.from({ length: totalDays }, (_, i) => start.plus({ days: i }));
  };

  const noDaysDisplay = useSignal(30);
  const noDaysDisplayBefore = useSignal(noDaysDisplay.value);
  const noDaysDisplayAfter = useSignal(noDaysDisplay.value);
  const showDays = useSignal(
    allDays(noDaysDisplay.value, noDaysDisplayBefore.value, noDaysDisplayAfter.value)
  );

  const tempData: TimelineData[] = [
    {
      id: crypto.randomUUID(),
      item: 'Graphic Designer',
      startDate: DateTime.fromFormat('2025-03-15T00:00', "yyyy-LL-dd'T'HH:mm"),
      endDate: DateTime.fromFormat('2025-03-25T00:00', "yyyy-LL-dd'T'HH:mm"),

      subItems: [
        {
          id: crypto.randomUUID(),
          item: 'Logo Design',
          startDate: DateTime.fromFormat('2025-03-20T00:00', "yyyy-LL-dd'T'HH:mm"),
          endDate: DateTime.fromFormat('2025-03-25T00:00', "yyyy-LL-dd'T'HH:mm"),
        },
        {
          id: crypto.randomUUID(),
          item: 'UI Expert',
          startDate: DateTime.fromFormat('2025-03-15T00:00', "yyyy-LL-dd'T'HH:mm"),
          endDate: DateTime.fromFormat('2025-03-20T00:00', "yyyy-LL-dd'T'HH:mm"),
        },
        {
          id: crypto.randomUUID(),
          item: 'Just a pro init',
          startDate: DateTime.fromFormat('2025-03-11T00:00', "yyyy-LL-dd'T'HH:mm"),
          endDate: DateTime.fromFormat('2025-03-23T00:00', "yyyy-LL-dd'T'HH:mm"),
        },
      ],
    },
  ];

  const onScroll = (val: any) => {
    if (isDragging.value) {
      xPos.value += val.movementX;
      const scrolled = xPos.value / (val.currentTarget.clientWidth / noDaysDisplay.value);

      if (scrolled >= 10) {
        noDaysDisplayBefore.value = 50;
        showDays.value = allDays(
          noDaysDisplay.value,
          noDaysDisplayBefore.value,
          noDaysDisplayAfter.value
        );
      }
    }
  };

  const openedItems = useSignal<string[]>([]);
  const selectedItem = useSignal<string | null>(null);

  return (
    <div class={`timeline ${props.class}`}>
      <div class="timeline-content">
        <div class="item-list">
          {tempData.map(item => (
            <TimelineItems item={item} opened={openedItems} selectedItem={selectedItem} />
          ))}
        </div>

        <div class="timeline-display">
          <div
            class="dates-header"
            onMouseDown={() => (isDragging.value = true)}
            onMouseMove={val => {
              onScroll(val);
            }}
            onMouseUp={() => (isDragging.value = false)}
            onMouseLeave={() => (isDragging.value = false)}
          >
            <div class="top-meter"></div>
            <div
              class="bottom-meter"
              style={{
                translate: xPos.value,
              }}
            >
              {showDays.value.map(day => {
                return (
                  <div
                    class="day"
                    style={{
                      translate: `calc(100% * ${-noDaysDisplayBefore.value})`,
                      width: `calc(100%/${noDaysDisplay.value})`,
                      minWidth: `calc(100%/${noDaysDisplay.value})`,
                    }}
                  >
                    <p class="dow">{day.toFormat('ccc')}</p>
                    <p class="date">{day.day}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <TimelineSVG
            isDragging={isDragging}
            xPos={xPos}
            noDaysDisplay={noDaysDisplay.value}
            data={tempData}
            onScroll={onScroll}
            startDate={startDate}
          />
        </div>
      </div>

      <div class="selected-item-info">
        <div>
          <p>Title</p>
          <button>View</button>
        </div>

        <div>
          <p>Start / End Date</p>
        </div>
      </div>
    </div>
  );
}

function TimelineItems({
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

function TimelineSVG({
  isDragging,
  xPos,
  noDaysDisplay,
  data,
  onScroll,
  startDate,
}: {
  isDragging: Signal<boolean>;
  xPos: Signal<number>;
  noDaysDisplay: number;
  data: TimelineData[];
  onScroll: (val: any) => void;
  startDate: DateTime;
}) {
  const STROKEWIDTH = 10;

  return (
    <svg
      class="timeline-svg"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      onMouseDown={() => (isDragging.value = true)}
      onMouseMove={val => {
        onScroll(val);
      }}
      onMouseUp={() => (isDragging.value = false)}
    >
      <g
        style={{
          translate: xPos.value,
        }}
      >
        {data.map((point, index) => {
          return (
            <g class="bar">
              <line
                x1={`calc((100%/${noDaysDisplay} * ${point.startDate
                  .diff(startDate)
                  .as('days')}) + ${STROKEWIDTH / 5}px)`}
                x2={`calc((100%/${noDaysDisplay} * ${point.endDate
                  .diff(startDate)
                  .as('days')}) - ${STROKEWIDTH}px)`}
                y1={`calc(12px + 10px)`}
                y2={`calc(12px + 10px)`}
                stroke-width={STROKEWIDTH}
                stroke-linecap="round"
              />

              {point.subItems?.map((point2, index2) => {
                return (
                  <g class="sub-bar">
                    <line
                      x1={`calc((100%/${noDaysDisplay} * ${point2.startDate
                        .diff(startDate)
                        .as('days')}) + ${STROKEWIDTH / 5}px)`}
                      x2={`calc((100%/${noDaysDisplay} * ${point2.endDate
                        .diff(startDate)
                        .as('days')}) - ${STROKEWIDTH}px)`}
                      y1={`calc(12px + 10px + (1.3em * ${index + index2 + 1} ))`}
                      y2={`calc(12px + 10px + (1.3em * ${index + index2 + 1} ))`}
                      stroke-width={STROKEWIDTH}
                      stroke-linecap="round"
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
