// deno-lint-ignore-file no-explicit-any
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { TimelineData } from './Timeline.tsx';
import { Signal } from '@preact/signals';

export default function TimelineSVG({
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

  let format: 'days' | 'weeks' | 'months' | 'years' = 'days';
  if (noDaysDisplay < 40) {
    format = 'days';
  } else if (noDaysDisplay < 80) {
    format = 'weeks';
  } else if (noDaysDisplay < 200) {
    format = 'months';
  } else {
    format = 'years';
  }

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
      onMouseLeave={() => (isDragging.value = false)}
    >
      <g
        style={{
          translate: xPos.value,
        }}
      >
        {data.map((point, index) => {
          let startMult = 1;
          let endMult = 1;
          if (noDaysDisplay < 40) {
            startMult = 1;
            endMult = 1;
          } else if (noDaysDisplay < 80) {
            startMult = 7;
            endMult = 7;
          } else if (noDaysDisplay < 200) {
            startMult = point.startDate.daysInMonth!;
            endMult = point.endDate.daysInMonth!;
          } else {
            startMult = point.startDate.daysInYear!;
            endMult = point.endDate.daysInYear!;
          }

          return (
            <g class="bar">
              <line
                x1={`calc((100%/${noDaysDisplay} * ${
                  point.startDate.diff(startDate).as(format) * startMult
                }) + ${STROKEWIDTH}px)`}
                x2={`calc((100%/${noDaysDisplay} * ${
                  point.endDate.diff(startDate).as(format) * endMult
                }) )`}
                y1={`calc(12px + 10px + (1.3em * ${index} ))`}
                y2={`calc(12px + 10px + (1.3em * ${index} ))`}
                stroke-width={STROKEWIDTH}
                stroke-linecap="round"
              />

              {point.subItems?.map((point2, index2) => {
                let startMult = 1;
                let endMult = 1;
                if (noDaysDisplay < 40) {
                  startMult = 1;
                  endMult = 1;
                } else if (noDaysDisplay < 80) {
                  startMult = 7;
                  endMult = 7;
                } else if (noDaysDisplay < 200) {
                  startMult = point.startDate.daysInMonth!;
                  endMult = point.endDate.daysInMonth!;
                } else {
                  startMult = point.startDate.daysInYear!;
                  endMult = point.endDate.daysInYear!;
                }

                return (
                  <g class="sub-bar">
                    <line
                      x1={`calc((100%/${noDaysDisplay} * ${
                        point2.startDate.diff(startDate).as(format) * startMult
                      }) + ${STROKEWIDTH}px)`}
                      x2={`calc((100%/${noDaysDisplay} * ${
                        point2.endDate.diff(startDate).as(format) * endMult
                      }) )`}
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
