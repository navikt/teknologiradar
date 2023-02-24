import type { GetServerSideProps, NextPage } from "next";
import { Detail, Heading, Ingress } from "@navikt/ds-react";
import {
  ActivityLabel,
  getCurrentActivities,
  LearningActivity,
  RecurringInterval,
} from "@/lib/activities";
import { ActivityLocation } from "@/components/ActivityLocation";
import { isFagtorsdagDay, LOCAL_TIMEZONE } from "@/lib/fagtorsdag";
import { formatInTimeZone } from "date-fns-tz";
import noNb from "date-fns/locale/nb";
import { ActivityContact } from "@/components/ActivityContact";
import { ExternalLink } from "@navikt/ds-icons";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query["id"];
  const date = context.query["date"] ?? null;

  const activities: LearningActivity[] = await getCurrentActivities(
    date as string | null
  );
  const activity = activities.find((activity) => activity.id === id);
  if (!activity) return { notFound: true };

  return { props: { activity, date } };
};

const ActivityPage: NextPage<{ activity: LearningActivity }> = ({
  activity,
}) => {
  return (
    <>
      <ActivityEntry activity={activity} />
    </>
  );
};

const formatTimeAndDate = ({
  date,
  time,
  recurring,
}: {
  date: string | null;
  time: string | null;
  recurring: RecurringInterval;
}) => {
  if (!date && !time) return null;

  if (recurring === RecurringInterval.ONE_TIME) {
    const parts = [];
    if (date)
      parts.push(
        formatInTimeZone(date, LOCAL_TIMEZONE, "d. MMMM", { locale: noNb })
      );
    if (time) parts.push(`kl. ${time}`);
    return parts.join(", ");
  }

  if (
    recurring === RecurringInterval.BI_WEEKLY &&
    date &&
    isFagtorsdagDay(new Date(date))
  ) {
    return time ? `Hver fagtorsdag, kl. ${time}` : `Hver fagtorsdag`;
  }
  return null;
};

const TimeAndDate = ({
  date,
  time,
  recurring,
}: {
  date: string | null;
  time: string | null;
  recurring: RecurringInterval;
}) => {
  const dtString = formatTimeAndDate({ date, time, recurring });
  if (!dtString) return null;

  return (
    <Heading level="2" size={"medium"} className={"activity--datetime"}>
      {dtString}
    </Heading>
  );
};

const Label = ({ label }: { label: ActivityLabel }) => {
  return (
    <div className={"activity--label"} style={{ backgroundColor: label.color }}>
      {label.name}
    </div>
  );
};

const LabelList = ({ labels }: { labels: ActivityLabel[] }) => {
  return (
    <div className={"activity--label-list"}>
      {labels.map((label, idx) => (
        <Label key={idx} label={label} />
      ))}
    </div>
  );
};

const ActivityEntry = ({ activity }: { activity: LearningActivity }) => {
  return (
    <>
      <Heading level="1" size={"large"} className={"activity--header"}>
        {activity.title}
      </Heading>
      <div className={"activity--subtext"}>
        <TimeAndDate
          date={activity.date}
          time={activity.timeStart}
          recurring={activity.recurringInterval}
        />
        <span className={"activity--edit-link"}>
          <a href={activity.editUrl}>
            Trello-kort <ExternalLink />
          </a>
        </span>
      </div>
      <Detail className={"activity--details"}>
        {activity.contactName && (
          <ActivityContact
            name={activity.contactName}
            role={activity.contactRole}
          />
        )}

        {activity.labels.length > 0 && <LabelList labels={activity.labels} />}
      </Detail>
      <Ingress className={"activity--ingress"}>
        {activity.imageUrl && (
          <img
            className={"activity--image"}
            src={activity.imageUrl!}
            alt={activity.contactName ?? activity.contactRole ?? activity.title}
          />
        )}
        {activity.description}
      </Ingress>
      <Detail className={"activity--locations"}>
        {activity.locations.map((loc, idx) => (
          <ActivityLocation key={idx} location={loc} />
        ))}
      </Detail>
    </>
  );
};

export default ActivityPage;
