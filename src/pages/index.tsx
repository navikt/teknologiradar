import type { NextPage } from "next";
import {
  FORMS_LINK,
  getNextFagtorsdag,
  KOMITÈ_LINK,
  LOCAL_TIMEZONE,
} from "@/lib/fagtorsdag";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";
import { FagtorsdagCountdown } from "@/components/FagtorsdagCountdown";
import { Heading, Ingress, Table } from "@navikt/ds-react";
import Link from "next/link";
import NextLink from "next/link";
import {
  formatTimeSpan,
  getCurrentActivities,
  NextLearningActivity,
  RecurringInterval,
} from "@/lib/activities";
import { ActivityLocation } from "@/components/ActivityLocation";
import noNb from "date-fns/locale/nb";
import { Linkify } from "@/components/Linkify";
import { GetServerSideProps } from "next";
import { occursOnOrAfter, occursOnOrBefore } from "@/lib/scheduling";
import { useEffect } from "react";
import * as metrics from "@/lib/metrics";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const date = context.query["date"] ?? null;
  const activities: NextLearningActivity[] = await getCurrentActivities(
    date as string | null,
    false
  );
  return { props: { activities, date } };
};

const formatDate = (
  nextOccurrenceAt: number,
  durationMinutes: number | null
): string => {
  const dt = new Date(nextOccurrenceAt);
  const timeStart = formatInTimeZone(dt, LOCAL_TIMEZONE, "HH.mm", {
    locale: noNb,
  });
  return formatTimeSpan(timeStart, durationMinutes);
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

const ActivityRow = ({ activity }: { activity: NextLearningActivity }) => {
  return (
    <Table.Row>
      <Table.HeaderCell scope={"row"}>
        {activity.nextOccurrenceAt
          ? formatDate(activity.nextOccurrenceAt, activity.durationMinutes)
          : "Uplanlagt"}
      </Table.HeaderCell>
      <Table.DataCell>
        <NextLink href={`/activities/${activity.id}`}>
          {activity.title}
        </NextLink>
      </Table.DataCell>
      <Table.DataCell>
        {activity.contactName && (
          <ContactInfo
            name={activity.contactName}
            role={activity.contactRole}
          />
        )}
      </Table.DataCell>
      <Table.DataCell>
        {activity.locations.map((location, idx) => (
          <ActivityLocation key={idx} location={location} />
        ))}
      </Table.DataCell>
    </Table.Row>
  );
};

const ActivityOverview = ({
  activities,
}: {
  activities: NextLearningActivity[];
}) => {
  return (
    <Table className={"activity--table"}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Når</Table.HeaderCell>
          <Table.HeaderCell scope="col">Hva</Table.HeaderCell>
          <Table.HeaderCell scope="col">Hvem</Table.HeaderCell>
          <Table.HeaderCell scope="col">Hvor</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {activities.map((activity, idx) => (
          <ActivityRow activity={activity} key={idx} />
        ))}
      </Table.Body>
    </Table>
  );
};

const Home: NextPage<{
  activities: NextLearningActivity[];
  date: string | null;
}> = ({ activities, date }) => {
  const now = utcToZonedTime(
    date ? new Date(date) : new Date(),
    LOCAL_TIMEZONE
  );

  useEffect(() => {
    metrics.logPageView({ page: date ? `Oversikt (${date})` : "Oversikt" });
  }, [date]);

  const upcomingFagtorsdag = getNextFagtorsdag(now);
  const upcomingActivities = activities.filter(
    (activity) =>
      occursOnOrAfter(activity, now) &&
      occursOnOrBefore(activity, upcomingFagtorsdag)
  );

  const upcomingOneTimeActivities = upcomingActivities.filter(
    (activity) => activity.recurringInterval === RecurringInterval.ONE_TIME
  );
  const upcomingRecurringActivities = upcomingActivities.filter(
    (activity) => activity.recurringInterval !== RecurringInterval.ONE_TIME
  );

  return (
    <>
      <Heading level={"1"} size={"large"}>
        Fagtorsdag – åpen delingsarena for alle
      </Heading>
      <section>
        <Heading level={"2"} size={"medium"} spacing>
          <FagtorsdagCountdown currentDate={now} />
        </Heading>

        <Ingress>
          Har du noe å dele? Kanskje en presentasjon eller et kurs du vil holde?
          Eller en faggruppe eller lesesirkel du ønsker å starte?{" "}
          <Link href={FORMS_LINK}>Meld det inn</Link> i dag, så vil{" "}
          <Link href={KOMITÈ_LINK}>komitéen</Link> hjelpe deg komme i gang.
        </Ingress>
      </section>

      <section className={"activity--overview"}>
        <Heading level={"2"} size={"medium"}>
          Aktiviteter førstkommende fagtorsdag:
        </Heading>
        <ActivityOverview activities={upcomingOneTimeActivities} />
        <Heading level={"2"} size={"medium"}>
          Faste aktiviteter hver fagtorsdag:
        </Heading>
        <ActivityOverview activities={upcomingRecurringActivities} />
      </section>
    </>
  );
};

export default Home;
