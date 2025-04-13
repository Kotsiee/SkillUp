import { DateTime } from 'https://esm.sh/luxon@3.5.0';

export function TimeAgo(time: DateTime, time1?: DateTime) {
  const date = DateTime.fromISO(time.toString());
  const diff = Math.abs(
    time1
      ? date.diff(DateTime.fromISO(time1.toString())).as('minutes')
      : date.diffNow().as('minutes')
  );

  if (diff > 1440) {
    const days = Math.floor(diff / 1440);
    if (days > 28) {
      return {
        value: Math.floor(
          Math.abs(
            time1
              ? date.diff(DateTime.fromISO(time1.toString())).as('months')
              : date.diffNow().as('months')
          )
        ),
        unit: 'Months',
      };
    }

    if (days > 7) {
      return { value: Math.floor(days / 7), unit: 'Weeks' };
    }
    return { value: days, unit: 'Days' };
  } else if (diff > 60) {
    return { value: Math.floor(diff / 60), unit: 'Hours' };
  } else {
    return { value: Math.floor(diff), unit: 'Minutes' };
  }
}
