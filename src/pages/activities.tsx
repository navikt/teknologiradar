import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import {
  activityComparator,
  getCurrentActivities,
  NextLearningActivity,
  RecurringInterval,
} from "@/lib/activities";
import { Heading, Ingress } from "@navikt/ds-react";
import Link from "next/link";
import { KOMITÈ_LINK, LOCAL_TIMEZONE } from "@/lib/fagtorsdag";
import { formatInTimeZone } from "date-fns-tz";
import noNb from "date-fns/locale/nb";
import { isAfter } from "date-fns";
/*import * as metrics from "@/lib/metrics";*/

export const getServerSideProps: GetServerSideProps = async (context) => {
  const date = context.query["date"] ?? null;
  const activities: NextLearningActivity[] = await getCurrentActivities(
    date as string | null,
    true,
  );
  return { props: { activities, date } };
};

const ActivitiesPage: NextPage<{
  activities: NextLearningActivity[];
  date: string | null;
}> = ({ activities, date }) => {
  const now = date ? new Date(date) : new Date();

  /*  useEffect(() => {
    metrics.logPageView({ page: "Tidligere aktiviteter" });
  }, []);*/

  const groupedByDate: { [key: string]: NextLearningActivity[] } = {};
  const recurring = activities.filter(
    (act) => act.recurringInterval !== RecurringInterval.ONE_TIME,
  );

  activities
    .filter((act) => act.recurringInterval === RecurringInterval.ONE_TIME)
    .forEach((activity) => {
      const activityDate = activity.date;
      if (!activityDate || isAfter(new Date(activityDate), now)) return;
      if (!groupedByDate[activityDate]) groupedByDate[activityDate] = [];
      groupedByDate[activityDate].push(activity);
    });

  Object.values(groupedByDate).forEach((activities) =>
    activities.sort(activityComparator),
  );
  const dates = Object.keys(groupedByDate);
  dates.sort((a, b) => (a === b ? 0 : a > b ? -1 : 1));

  return (
    <>
      <Heading size={"large"} level={"1"}>
        Oversikt over tidligere aktiviteter
      </Heading>
      <p>
        Ser du noe du kunne tenke deg å bli med på igjen?{" "}
        <Link href={KOMITÈ_LINK}>Ta kontakt</Link>, så ser vi om det er mulig!
      </p>

      {dates.map((date) => (
        <section key={date}>
          <Heading size={"medium"} level={"3"}>
            {formatInTimeZone(date, LOCAL_TIMEZONE, "EEEE d. MMMM yyyy", {
              locale: noNb,
            })}
          </Heading>
          <ul>
            {groupedByDate[date].map((activity) => (
              <li key={activity.id}>
                <Link href={`/activities/${activity.id}`}>
                  {activity.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
};

export default ActivitiesPage;
