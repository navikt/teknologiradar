import {
  getNextFagtorsdag,
  isFagtorsdag,
  isFagtorsdagDay,
  LOCAL_TIMEZONE,
} from "@/lib/fagtorsdag";
import { formatInTimeZone } from "date-fns-tz";
import noNb from "date-fns/locale/nb";

export const FagtorsdagCountdown = ({ currentDate }: { currentDate: Date }) => {
  if (isFagtorsdag(currentDate)) {
    return <span>Det er fagtorsdag! 🥳</span>;
  }
  if (isFagtorsdagDay(currentDate)) {
    return <span>Det er snart fagtorsdag! 🥳</span>;
  }
  const nextFagtorsdagDate = getNextFagtorsdag(currentDate);
  return (
    <span>
      Neste fagtorsdag er{" "}
      {formatInTimeZone(nextFagtorsdagDate, LOCAL_TIMEZONE, "d. MMMM", {
        locale: noNb,
      })}{" "}
      😃
    </span>
  );
};
