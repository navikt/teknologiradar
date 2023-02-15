import type { NextPage } from "next";
import { Detail, Heading, Ingress, Panel } from "@navikt/ds-react";
import Link from "next/link";
import Image from "next/image";
import { getExampleData, LearningActivity } from "@/lib/activities";
import { ActivityLocation } from "@/components/ActivityLocation";

export async function getServerSideProps() {
  const activities: LearningActivity[] = await getExampleData();
  return { props: { activities } };
}

const ActivitiesPage: NextPage<{ activities: LearningActivity[] }> = ({
  activities,
}) => {
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

const ActivityEntry = ({ activity }: { activity: LearningActivity }) => {
  return (
    <Panel border className={"activity"}>
      <Heading level="2" size={"large"} className={"activity--header"}>
        {activity.timeStart && <TimeLabel time={activity.timeStart} />}
        {activity.title}
      </Heading>
      <Detail className={"activity--contact"}>
        <b>{activity.contactName}</b>, {activity.contactRole}
      </Detail>
      <Ingress className={"activity--ingress"}>
        {activity.imageUrl && (
          <img
            className={"activity--image"}
            src={activity.imageUrl!}
            alt={activity.contactName}
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
