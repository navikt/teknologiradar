import type { NextPage } from "next";
import { getCurrentActivities, NextLearningActivity } from "@/lib/activities";
import { parseLocation } from "@/components/ActivityLocation";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";
import { getNextFagtorsdag, LOCAL_TIMEZONE } from "@/lib/fagtorsdag";
import { isBefore, isSameDay } from "date-fns";
import NextLink from "next/link";
import { Heading } from "@navikt/ds-react";
import noNb from "date-fns/locale/nb";

export async function getServerSideProps() {
  const activities: NextLearningActivity[] = await getCurrentActivities();
  return { props: { activities } };
}

const CalendarPage: NextPage<{ activities: NextLearningActivity[] }> = ({
  activities,
}) => {
  const now = utcToZonedTime(new Date(), LOCAL_TIMEZONE);

  const upcomingFagtorsdag = getNextFagtorsdag(now);
  const upcomingActivities = activities.filter((activity) => {
    if (!activity.nextOccurrenceAt) return false;
    const date = new Date(activity.nextOccurrenceAt);
    return (
      isSameDay(date, upcomingFagtorsdag) || isBefore(date, upcomingFagtorsdag)
    );
  });

  const groupedByRooms: { [key: string]: NextLearningActivity[] } = {};

  upcomingActivities.forEach((activity) => {
    const physicalRoom = activity.locations
      .map((location) => parseLocation(location))
      .find((location) => location.link === undefined);
    if (!physicalRoom) return;
    const roomName = physicalRoom.label;

    if (!groupedByRooms[roomName]) groupedByRooms[roomName] = [];
    groupedByRooms[roomName].push(activity);
  });

  const startHour = 10;
  const endHour = 16;

  const timeSlots: string[] = ["Rom"];
  for (let i = startHour; i <= endHour; i++) timeSlots.push(`${i}.00`);
  const hourWidth = 100 / timeSlots.length;

  const timeStartToLeft = (timeStart: string | null) => {
    if (!timeStart) return 0;
    const [hour, minutes] = timeStart
      .split(".")
      .map((str) => parseInt(str, 10));
    const totalMin = hour * 60 + minutes;
    const startMin = startHour * 60;
    const offset = totalMin - startMin;
    return (offset / 60.0) * hourWidth;
  };

  return (
    <>
      <Heading level={"1"} size={"large"}>
        Timeplan for Fyrstikkalléen,{" "}
        {formatInTimeZone(upcomingFagtorsdag, LOCAL_TIMEZONE, "dd. MMMM", {
          locale: noNb,
        })}
      </Heading>
      <section className={"calendar"}>
        <div className={"calendar--timeline"}>
          {timeSlots.map((timeSlot) => (
            <span
              key={timeSlot}
              className={"calendar--timeline-slot"}
              style={{ width: hourWidth + "%" }}
            >
              {timeSlot}
            </span>
          ))}
        </div>

        {Object.keys(groupedByRooms).map((roomName, idx) => {
          const activities = groupedByRooms[roomName];

          return (
            <div key={idx} className={"calendar--row"}>
              <div className={"calendar--timegrid"}>
                {timeSlots.map((timeSlot) => (
                  <span
                    key={timeSlot}
                    className={"calendar--timeline-slot"}
                    style={{ width: hourWidth + "%" }}
                  >
                    &nbsp;
                  </span>
                ))}
              </div>
              <div
                className={"calendar--room-label"}
                style={{ width: hourWidth + "%" }}
              >
                {roomName}
              </div>
              {activities.map((activity, idx) => (
                <NextLink
                  className={"calendar--activity"}
                  href={`/activities/${activity.id}`}
                  key={idx}
                  title={`${activity.timeStart} i ${roomName}: ${activity.title}`}
                  style={{
                    width: (activity.durationMinutes! / 60.0) * hourWidth + "%",
                    left: timeStartToLeft(activity.timeStart) + hourWidth + "%",
                  }}
                >
                  <span className={"calendar--activity-title"}>
                    {activity.title}
                  </span>
                  <span className={"calendar--activity-room"}>
                    {activity.contactName}
                  </span>
                </NextLink>
              ))}
            </div>
          );
        })}
      </section>
    </>
  );
};

export default CalendarPage;
