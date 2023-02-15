import type { NextPage } from "next";
import { Detail, Heading, Ingress, Panel } from "@navikt/ds-react";
import { getCurrentActivities, LearningActivity } from "@/lib/activities";
import { ActivityLocation } from "@/components/ActivityLocation";
import NextLink from "next/link";
import { Linkify } from "@/components/Linkify";

export async function getServerSideProps() {
  const activities: LearningActivity[] = await getCurrentActivities();
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

const ContactInfo = ({ name, role }: { name: string; role: string | null }) => {
  return (
    <span>
      <span className={"activity--contact-name"}>
        <Linkify text={name} />
      </span>
      {role && <span className={"activity--contact-role"}>, {role}</span>}
    </span>
  );
};

const ActivityEntry = ({ activity }: { activity: LearningActivity }) => {
  return (
    <Panel border className={"activity"}>
      <Heading level="2" size={"large"} className={"activity--header"}>
        {activity.timeStart && <TimeLabel time={activity.timeStart} />}
        <NextLink href={`/activities/${activity.id}`}>
          {activity.title}
        </NextLink>
      </Heading>
      {activity.contactName && (
        <Detail className={"activity--contact"}>
          <ContactInfo
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
