import {
  addWeeks,
  getISODay,
  getISOWeek,
  setDay,
  setHours,
  setISODay,
  startOfHour,
} from "date-fns";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";

export const LOCAL_TIMEZONE = "Europe/Oslo";
export const FAGTORSDAG_ISO_DAY = 4;

function isFagtorsdagWeek(date: Date) {
  return getISOWeek(date) % 2 === 0;
}

export function isFagtorsdagDay(date: Date) {
  return isFagtorsdagWeek(date) && getISODay(date) === FAGTORSDAG_ISO_DAY;
}

export function isFagtorsdag(date: Date) {
  if (!isFagtorsdagDay(date)) return false;
  const hour = formatInTimeZone(date, LOCAL_TIMEZONE, "HH");
  return hour >= "12";
}

export function getNextFagtorsdag(date: Date) {
  const localDate = utcToZonedTime(date, LOCAL_TIMEZONE);
  const day = getISODay(localDate);

  if (isFagtorsdagDay(localDate)) {
    return startOfHour(setHours(localDate, 12));
  }

  if (isFagtorsdagWeek(localDate) && day < FAGTORSDAG_ISO_DAY) {
    return startOfHour(setHours(setISODay(localDate, FAGTORSDAG_ISO_DAY), 12));
  }

  let nextPotentialFagtorsdag = localDate;
  do {
    nextPotentialFagtorsdag = addWeeks(nextPotentialFagtorsdag, 1);
  } while (!isFagtorsdagWeek(nextPotentialFagtorsdag));

  return startOfHour(
    setHours(setISODay(nextPotentialFagtorsdag, FAGTORSDAG_ISO_DAY), 12)
  );
}
