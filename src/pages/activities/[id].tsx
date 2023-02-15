import type { GetServerSideProps, NextPage } from "next";
import { Detail, Heading, Ingress, Panel } from "@navikt/ds-react";
import { getExampleData, LearningActivity } from "@/lib/activities";
import { ActivityLocation } from "@/components/ActivityLocation";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query["id"];

  const activities: LearningActivity[] = await getExampleData();
  const activity = activities.find((activity) => activity.id === id);
  if (!activity) return { notFound: true };

  return { props: { activity } };
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

export default ActivityPage;
