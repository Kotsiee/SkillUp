// deno-lint-ignore-file no-explicit-any
import { DateTime } from 'https://esm.sh/luxon@3.5.0';
import { useSignal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';
import TimelineItems from './TimelineItems.tsx';
import TimelineSVG from './TimelineSVG.tsx';
import { useRef } from 'preact/hooks';
import { useEffect } from 'preact/hooks';

export interface TimelineData {
  id: string;
  item: string;
  startDate: DateTime;
  endDate: DateTime;

  subItems?: TimelineData[];
}

export default function Timeline({
  plots,
  className,
}: { plots: TimelineData[] } & JSX.HTMLAttributes<HTMLDivElement>) {
  if (!plots || plots.length === 0) return null;

  const isDragging = useSignal(false);
  const xPos = useSignal(0);

  const startDates = plots.map(plot => DateTime.fromISO(plot.startDate.toISO()!));
  const endDates = plots.map(plot => DateTime.fromISO(plot.endDate.toISO()!));
  const startDate = DateTime.min(...startDates);
  const endDate = DateTime.max(...endDates);
  const noDaysDisplay = useSignal(endDate.diff(startDate).as('days'));

  const onScroll = (val: any) => {
    if (isDragging.value) {
      xPos.value += val.movementX;
    }
  };

  const openedItems = useSignal<string[]>([]);
  const selectedItem = useSignal<string | null>(null);

  useEffect(() => {
    if (!plots || plots.length === 0) return;

    const startDates = plots.map(plot => DateTime.fromISO(plot.startDate.toISO()!));
    const endDates = plots.map(plot => DateTime.fromISO(plot.endDate.toISO()!));
    const newStartDate = DateTime.min(...startDates);
    const newEndDate = DateTime.max(...endDates);
    noDaysDisplay.value = newEndDate.diff(newStartDate).as('days');
  }, [plots]);

  return (
    <div class={`timeline ${className}`}>
      <div class="timeline-content">
        <div class="item-list">
          {plots.map(plot => (
            <TimelineItems item={plot} opened={openedItems} selectedItem={selectedItem} />
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
            <TimelineHeader
              plots={plots}
              startDate={startDate}
              endDate={endDate}
              xPos={xPos.value}
              noDaysDisplay={noDaysDisplay.value}
            />
          </div>

          <TimelineSVG
            isDragging={isDragging}
            xPos={xPos}
            noDaysDisplay={noDaysDisplay.value}
            data={plots}
            onScroll={onScroll}
            startDate={startDate}
          />
        </div>
      </div>
    </div>
  );
}

function TimelineHeader({
  plots,
  startDate,
  endDate,
  xPos,
  noDaysDisplay,
}: {
  plots: TimelineData[];
  startDate: DateTime;
  endDate: DateTime;
  xPos: number;
  noDaysDisplay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const width = useSignal<number>(20);

  function getAllDatesInYear(year: number, zone: string = DateTime.local().zoneName): DateTime[] {
    // start at Jan 1 of that year, midnight in the chosen zone
    const start = DateTime.fromObject({ year, month: 1, day: 1 }, { zone });
    // daysInYear is either 365 or 366
    const daysInYear = start.daysInYear;

    // build an array [0, 1, …, daysInYear-1], map each to start.plus({ days: i })
    return Array.from({ length: daysInYear }, (_, i) => start.plus({ days: i }));
  }

  function getAllDatesInRange(
    startYear: number,
    endYear: number,
    zone: string = DateTime.local().zoneName
  ): DateTime[] {
    // ensure start ≤ end
    if (startYear > endYear) [startYear, endYear] = [endYear, startYear];
    const start = DateTime.fromObject({ year: startYear, month: 1, day: 1 }, { zone });
    const end = DateTime.fromObject({ year: endYear, month: 12, day: 31 }, { zone });
    const totalDays = Math.floor(end.diff(start, 'days').days) + 1;

    return Array.from({ length: totalDays }, (_, i) => start.plus({ days: i }));
  }

  const allDates =
    startDate.year !== endDate.year
      ? getAllDatesInRange(startDate.year, endDate.year)
      : getAllDatesInYear(startDate.year);
  const yrs = [...new Set(allDates.map(item => item.year))];

  useEffect(() => {
    width.value = ref.current!.clientWidth;
  }, [plots]);

  let format = 'days';

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
    <div
      ref={ref}
      class="timeline-header"
      style={{
        translate: xPos - startDate.diff(allDates[0]).as('days') * (width.value / noDaysDisplay),
      }}
    >
      {yrs.map(yr => {
        const mths = [...new Set(allDates.filter(d => d.year === yr).map(item => item.month))];
        const wks = [...new Set(allDates.filter(d => d.year === yr).map(item => item.weekNumber))];

        return (
          <div class="timeline-header-years">
            <p>{yr}</p>
            <div class="timeline-header-months">
              {mths.map(mth => {
                const days = [
                  ...new Set(
                    allDates.filter(d => d.year === yr && d.month === mth).map(item => item.day)
                  ),
                ];

                return (
                  <div
                    class="timeline-header-month"
                    style={
                      format !== 'days'
                        ? {
                            width: `${
                              (width.value / noDaysDisplay) *
                              DateTime.fromFormat(`${mth.toString()}/${yr.toString()}`, 'M/yyyy')
                                .daysInMonth!
                            }px`,
                            minWidth: `${
                              (width.value / noDaysDisplay) *
                              DateTime.fromFormat(`${mth.toString()}/${yr.toString()}`, 'M/yyyy')
                                .daysInMonth!
                            }px`,
                          }
                        : undefined
                    }
                  >
                    <p key={mth}>
                      {DateTime.fromFormat(`${mth.toString()}/${yr.toString()}`, 'M/yyyy').toFormat(
                        'MMM'
                      )}
                    </p>
                    {format === 'days' && (
                      <div class="timeline-header-days">
                        {days.map(day => (
                          <div
                            key={day}
                            style={{
                              width: `${width.value / noDaysDisplay}px`,
                              minWidth: `${width.value / noDaysDisplay}px`,
                            }}
                            class="timeline-header-day"
                          >
                            <p>
                              {DateTime.fromFormat(`${day}/${mth}/${yr}`, 'd/M/yyyy').toFormat(
                                'dd'
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {format === 'weeks' ? (
              <div class="timeline-header-weeks">
                {wks.map(wk => (
                  <div
                    key={wk}
                    style={{
                      width: `${(width.value / noDaysDisplay) * 7}px`,
                      minWidth: `${(width.value / noDaysDisplay) * 7}px`,
                    }}
                    class="timeline-header-week"
                  >
                    <p>WK: {wk}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

//   const allUnits = (noDaysDisplay: number, before: number, after: number) => {
//     const start = startDate.minus({ days: before });

//     if (noDaysDisplay < 40) {
//       return Array.from({ length: before + noDaysDisplay + after }, (_, i) =>
//         start.plus({ days: i })
//       );
//     } else if (noDaysDisplay < 80) {
//       return Array.from({ length: (before + noDaysDisplay + after) / 7 }, (_, i) =>
//         start.plus({ weeks: i })
//       );
//     } else if (noDaysDisplay < 200) {
//       return Array.from({ length: (before + noDaysDisplay + after) / 30 }, (_, i) =>
//         start.plus({ months: i })
//       );
//     } else {
//       return Array.from({ length: (before + noDaysDisplay + after) / 182.5 }, (_, i) =>
//         start.plus({ years: i })
//       );
//     }
//   };

//   const noDaysDisplayBefore = useSignal(noDaysDisplay.value);
//   const noDaysDisplayAfter = useSignal(noDaysDisplay.value);
//   const showDays = useSignal(
//     allUnits(noDaysDisplay.value, noDaysDisplayBefore.value, noDaysDisplayAfter.value)
//   );

/**
 * 
 *             <div
              class="top-meter"
              style={{
                translate: xPos.value,
              }}
            >
              {groupTopLabels(showDays.value, getTimeUnit(noDaysDisplay.value)).map(group => (
                <div
                  class="top-label"
                  style={{
                    width: `calc((100% / ${noDaysDisplay.value}) * ${group.length})`,
                    minWidth: `calc((100% / ${noDaysDisplay.value}) * ${group.length})`,
                    translate: `calc(100% * ${-noDaysDisplayBefore.value / group.length})`,
                  }}
                >
                  <p>{group.label}</p>
                </div>
              ))}
            </div>
            <div
              class="bottom-meter"
              style={{
                translate: xPos.value,
              }}
            >
              {showDays.value.map(day => {
                let divFactor = 1;
                let topFormat = day.toFormat('ccc');
                let bottomFormat = day.toFormat('dd');
                if (noDaysDisplay.value < 40) {
                  divFactor = 1;
                  topFormat = day.toFormat('ccc');
                  bottomFormat = day.toFormat('dd');
                } else if (noDaysDisplay.value < 80) {
                  divFactor = 7;
                  topFormat = day.toFormat('MMM');
                  bottomFormat = 'WK: ' + day.weekNumber.toString();
                } else if (noDaysDisplay.value < 200) {
                  divFactor = day.daysInMonth || 30;
                  topFormat = day.toFormat('yyyy');
                  bottomFormat = day.toFormat('MMMM');
                } else {
                  divFactor = day.daysInYear;
                  topFormat = 'Year';
                  bottomFormat = day.toFormat('yyyy');
                }

                return (
                  <div
                    class="day"
                    style={{
                      translate: `calc(100% * ${-noDaysDisplayBefore.value / divFactor})`,
                      width: `calc(100%/${noDaysDisplay.value}*${divFactor})`,
                      minWidth: `calc(100%/${noDaysDisplay.value}*${divFactor})`,
                    }}
                  >
                    <p class="dow">{topFormat}</p>
                    <p class="date">{bottomFormat}</p>
                  </div>
                );
              })}
            </div>
 * 
 */
