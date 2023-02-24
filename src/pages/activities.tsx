import type { NextPage } from "next";
import { Detail, Heading, Ingress, Panel } from "@navikt/ds-react";
import { getCurrentActivities, NextLearningActivity } from "@/lib/activities";
import { ActivityLocation } from "@/components/ActivityLocation";
import NextLink from "next/link";
import { Linkify } from "@/components/Linkify";
import { ActivityContact } from "@/components/ActivityContact";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const date = context.query["date"] ?? null;
  const activities: NextLearningActivity[] = await getCurrentActivities(
    date as string | null
  );
  return { props: { activities, date } };
};

const ActivitiesPage: NextPage<{
  activities: NextLearningActivity[];
  date: string | null;
}> = ({ activities, date }) => {
  return (
    <>
      {activities.map((activity, idx) => (
        <ActivityEntry activity={activity} key={idx} />
      ))}
    </>
  );
};

const TimeLabel = ({ time }: { time: string }) => {
  return <span className={"time-label"}>{time}</span>;
};

const ActivityEntry = ({ activity }: { activity: NextLearningActivity }) => {
  return (
    <Panel border className={"activity"}>
      <Heading level="2" size={"large"} className={"activity--header"}>
        {activity.timeStart && <TimeLabel time={activity.timeStart} />}
        <NextLink href={`/activities/${activity.id}`}>
          {activity.title}
        </NextLink>
      </Heading>
      {activity.contactName && (
        <Detail className={"activity--details"}>
          <ActivityContact
            name={activity.contactName}
            role={activity.contactRole}
          />
        </Detail>
      )}
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
    </Panel>
  );
};

export default ActivitiesPage;
