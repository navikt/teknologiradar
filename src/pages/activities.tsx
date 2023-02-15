import { Header } from "@navikt/ds-react-internal";
import type { NextPage } from "next";
import Head from "next/head";
import { Detail, Heading, Ingress, Panel } from "@navikt/ds-react";
import Link from "next/link";
import Image from "next/image";

export enum RecurringInterval {
  ONE_TIME,
  WEEKLY,
  BI_WEEKLY,
  MONTHLY,
}

export interface LearningActivity {
  id: string;
  date?: string;
  recurringInterval: RecurringInterval;
  timeStart?: string;
  durationMinutes: number | null;
  title: string;
  emoji: string;
  contactName: string;
  contactRole: string;
  imageUrl?: string;
  description: string;
  locations: string[];
}

function getActivities(): LearningActivity[] {
  return [];
}

const ActivitiesPage: NextPage = () => {
  const activities = getActivities();

  return (
    <div>
      <Head>
        <title>Aktiviteter</title>
      </Head>
      <Header>
        <Header.Title as="h1">Fagtorsdag</Header.Title>
      </Header>
      <main className="layout">
        {activities.map((activity, idx) => (
          <ActivityEntry activity={activity} key={idx} />
        ))}
      </main>
    </div>
  );
};

const TimeLabel = ({ time }: { time: string }) => {
  return <span className={"time-label"}>{time}</span>;
};

const parseLocation = (
  location: string
): { label: string; link?: string; icon?: string; iconAlt?: string } => {
  if (/\.zoom\.us/.test(location)) {
    return {
      link: location,
      label: "Zoom-møte",
      icon: "/img/zoom.png",
      iconAlt: "Zoom",
    };
  }
  if (/teams\.microsoft\.com/.test(location)) {
    return {
      link: location,
      label: "Teams-møte",
      icon: "/img/teams.png",
      iconAlt: "Teams",
    };
  }
  if (/^#/.test(location)) {
    const slackChannelName = location.substring(1).trim();
    const slackUrl = `https://nav-it.slack.com/archives/${slackChannelName}`;
    return {
      link: slackUrl,
      label: slackChannelName,
      icon: "/img/slack.png",
      iconAlt: "Slack-kanal",
    };
  }
  return {
    label: location,
    icon: "/img/fya1.jpg",
    iconAlt: "Fyrstikkalléen 1",
  };
};

const ActivityLocation = ({ location }: { location: string }) => {
  const iconSize = 20;
  const loc = parseLocation(location);

  return (
    <span className={"activity--location"}>
      {loc.icon && (
        <Image
          src={loc.icon}
          alt={loc.iconAlt!}
          width={iconSize}
          height={iconSize}
        />
      )}
      {loc.link ? (
        <Link href={loc.link}>{loc.label}</Link>
      ) : (
        <span>{loc.label}</span>
      )}
    </span>
  );
};

const ActivityEntry = ({ activity }: { activity: LearningActivity }) => {
  return (
    <Panel border className={"activity"}>
      <Heading level="2" size={"large"} className={"activity--header"}>
        {activity.timeStart && <TimeLabel time={activity.timeStart} />}
        {activity.title}
      </Heading>
      <Detail className={"activity--contact"}>
        {activity.contactName}, {activity.contactRole}
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
