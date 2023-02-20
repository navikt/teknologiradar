import { LOCAL_TIMEZONE } from "./fagtorsdag";
import { add, isBefore, isSameDay } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { LearningActivity, RecurringInterval } from "@/lib/activities";

export function timeAndDateToLocalDateTime(
  dateString: string,
  timeString: string
) {
  const normalizedTime = timeString.replace(/\./, ":") + ":00.000";
  const dtString = `${dateString}T${normalizedTime}`;
  return zonedTimeToUtc(dtString, LOCAL_TIMEZONE);
}

export function getActivityNextStartDate(
  activity: LearningActivity,
  currentDate: Date
): Date | null {
  if (!activity.date || !activity.timeStart) return null;
  const initialDate = timeAndDateToLocalDateTime(
    activity.date,
    activity.timeStart
  );

  if (activity.recurringInterval === RecurringInterval.ONE_TIME) {
    return initialDate;
  }

  const nextDateString = nextDateOnOrAfterAtInterval(
    initialDate,
    currentDate,
    activity.recurringInterval
  )
    .toISOString()
    .substring(0, 10);
  return timeAndDateToLocalDateTime(nextDateString, activity.timeStart);
}

function nextDateOnOrAfterAtInterval(
  initialDate: Date,
  currentDate: Date,
  interval: RecurringInterval
) {
  if (isSameDay(initialDate, currentDate)) return initialDate;

  // TODO Implement a better algorithm for finding next date
  const maxIterations = 100;
  let numIterations = 0;
  let nextDate: Date = initialDate;
  do {
    if (numIterations++ > maxIterations) break;
    nextDate = nextDateAtInterval(nextDate, interval);
  } while (
    isBefore(nextDate, currentDate) &&
    !isSameDay(currentDate, nextDate)
  );
  return nextDate;
}

function nextDateAtInterval(date: Date, interval: RecurringInterval): Date {
  switch (interval) {
    case RecurringInterval.WEEKLY:
      return add(date, { weeks: 1 });
    case RecurringInterval.BI_WEEKLY:
      return add(date, { weeks: 2 });
    case RecurringInterval.MONTHLY:
      return add(date, { months: 1 });
    default:
      throw new Error(`Unrecognized interval: ${interval}`);
  }
}
