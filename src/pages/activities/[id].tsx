import type { GetServerSideProps, NextPage } from "next";
import { Detail, Heading, Ingress } from "@navikt/ds-react";
import {
  ActivityLabel,
  formatTimeSpan,
  getCurrentActivities,
  LearningActivity,
  RecurringInterval,
} from "@/lib/activities";
import { ActivityLocation } from "@/components/ActivityLocation";
import { isFagtorsdagDay, LOCAL_TIMEZONE } from "@/lib/fagtorsdag";
import { formatInTimeZone } from "date-fns-tz";
import noNb from "date-fns/locale/nb";
import { ActivityContact } from "@/components/ActivityContact";
import { ExternalLink, Back } from "@navikt/ds-icons";
import Link from "next/link";
import { Linkify } from "@/components/Linkify";
import Head from "next/head";
import { useEffect } from "react";
import * as metrics from "@/lib/metrics";
import ReactMarkdown from "react-markdown";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query["id"];
  const date = context.query["date"] ?? null;

  const activities: LearningActivity[] = await getCurrentActivities(
    date as string | null,
    true
  );
  const activity = activities.find((activity) => activity.id === id);
  if (!activity) return { notFound: true };

  return { props: { activity, date } };
};

const ActivityPage: NextPage<{ activity: LearningActivity }> = ({
  activity,
}) => {
  useEffect(() => {
    metrics.logPageView({
      page: "Aktivitet",
      activityTitle: activity.title,
      activityId: activity.id,
    });
  }, [activity]);

  return (
    <>
      <Head>
        <title>{activity.title} | Fagtorsdag</title>
        <meta name="description" content={activity.description} />
      </Head>
      <Link href={"/"} className={"link-with-icon"}>
        <Back /> Tilbake til oversikt
      </Link>
      <ActivityEntry activity={activity} />
    </>
  );
};

const formatTimeAndDate = ({
  date,
  time,
  durationMinutes,
  recurring,
}: {
  date: string | null;
  time: string | null;
  durationMinutes: number | null;
  recurring: RecurringInterval;
}) => {
  if (!date && !time) return null;

  if (recurring === RecurringInterval.ONE_TIME) {
    const parts = [];
    if (date)
      parts.push(
        formatInTimeZone(date, LOCAL_TIMEZONE, "d. MMMM", { locale: noNb })
      );
    if (time) parts.push(`kl. ${formatTimeSpan(time, durationMinutes)}`);
    return parts.join(", ");
  }

  if (
    recurring === RecurringInterval.BI_WEEKLY &&
    date &&
    isFagtorsdagDay(new Date(date))
  ) {
    return time
      ? `Hver fagtorsdag, kl. ${formatTimeSpan(time, durationMinutes)}`
      : `Hver fagtorsdag`;
  }
  return null;
};

const TimeAndDate = ({
  date,
  time,
  durationMinutes,
  recurring,
}: {
  date: string | null;
  time: string | null;
  durationMinutes: number | null;
  recurring: RecurringInterval;
}) => {
  const dtString = formatTimeAndDate({
    date,
    time,
    durationMinutes,
    recurring,
  });
  if (!dtString) return null;

  return (
    <Heading level="2" size={"medium"} className={"activity--datetime"}>
      {dtString}
    </Heading>
  );
};

const Label = ({ label }: { label: ActivityLabel }) => {
  return (
    <span
      className={"activity--label"}
      style={{ backgroundColor: label.color }}
    >
      {label.name}
    </span>
  );
};

const LabelList = ({ labels }: { labels: ActivityLabel[] }) => {
  return (
    <span className={"activity--label-list"}>
      {labels.map((label, idx) => (
        <Label key={idx} label={label} />
      ))}
    </span>
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
          durationMinutes={activity.durationMinutes}
          recurring={activity.recurringInterval}
        />
        <span className={"activity--edit-link"}>
          <Link href={activity.editUrl} className={"link-with-icon"}>
            Trello-kort <ExternalLink />
          </Link>
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
      <Ingress className={"activity--ingress"} as={"div"}>
        {activity.imageUrl && (
          <img
            className={"activity--image"}
            src={activity.imageUrl!}
            alt={activity.contactName ?? activity.contactRole ?? activity.title}
          />
        )}
        <ReactMarkdown>{activity.description}</ReactMarkdown>
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
