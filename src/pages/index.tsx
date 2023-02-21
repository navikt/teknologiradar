import type { NextPage } from "next";
import { FORMS_LINK, KOMITÈ_LINK, LOCAL_TIMEZONE } from "@/lib/fagtorsdag";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";
import { FagtorsdagCountdown } from "@/components/FagtorsdagCountdown";
import { Heading, Ingress, Table } from "@navikt/ds-react";
import Link from "next/link";
import NextLink from "next/link";
import { getCurrentActivities, NextLearningActivity } from "@/lib/activities";
import { ActivityLocation } from "@/components/ActivityLocation";
import noNb from "date-fns/locale/nb";
import { Linkify } from "@/components/Linkify";

export async function getServerSideProps() {
  const activities: NextLearningActivity[] = await getCurrentActivities();
  return { props: { activities } };
}

const formatDate = (nextOccurrenceAt: number): string => {
  const dt = new Date(nextOccurrenceAt);
  const date = formatInTimeZone(dt, LOCAL_TIMEZONE, "d.MMM", { locale: noNb });
  const time = formatInTimeZone(dt, LOCAL_TIMEZONE, "HH.mm", { locale: noNb });
  return `${time}\n${date}`;
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
          ? formatDate(activity.nextOccurrenceAt)
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
    <Table>
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

const Home: NextPage<{ activities: NextLearningActivity[] }> = ({
  activities,
}) => {
  const now = utcToZonedTime(new Date(), LOCAL_TIMEZONE);

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
          Hva skjer fremover?
        </Heading>
        <ActivityOverview activities={activities} />
      </section>
    </>
  );
};

export default Home;
