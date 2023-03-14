import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import {
  ActivityLabel,
  activityComparator,
  getCurrentActivities,
  NextLearningActivity,
  RecurringInterval,
} from "@/lib/activities";
import { Heading, Ingress, Table } from "@navikt/ds-react";
import Link from "next/link";
import { KOMITÈ_LINK, LOCAL_TIMEZONE } from "@/lib/fagtorsdag";
import { formatInTimeZone } from "date-fns-tz";
import noNb from "date-fns/locale/nb";
import { isAfter } from "date-fns";
import { useEffect } from "react";
import NextLink from "next/link";
import { ActivityLocation } from "@/components/ActivityLocation";
/*import * as metrics from "@/lib/metrics";*/

export const getServerSideProps: GetServerSideProps = async (context) => {
  const date = context.query["date"] ?? null;
  const activities: NextLearningActivity[] = await getCurrentActivities(
    date as string | null,
    true
  );
  return { props: { activities, date } };
};

const ActivitiesPage: NextPage<{
  activities: NextLearningActivity[];
  date: string | null;
}> = ({ activities, date }) => {
  const now = date ? new Date(date) : new Date();

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
  /*  useEffect(() => {
        metrics.logPageView({ page: "Tidligere aktiviteter" });
      }, []);*/

  const groupedByDate: { [key: string]: NextLearningActivity[] } = {};
  const recurring = activities.filter(
    (act) => act.recurringInterval !== RecurringInterval.ONE_TIME
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
    activities.sort(activityComparator)
  );
  const dates = Object.keys(groupedByDate);
  dates.sort((a, b) => (a === b ? 0 : a > b ? -1 : 1));

  return (
    <>
      <Heading size={"large"} level={"1"}>
        Teknologiradaren
      </Heading>
      <Ingress>
        Alle i NAV IT kan involvere seg i utviklingen av Teknologiradaren - jo
        flere som bidrar, jo bedre blir den!
      </Ingress>
      <Ingress>
        Det enkleste er å bidra konstruktivt i{" "}
        <Link
          href="https://nav-it.slack.com/archives/CEHSHMNBF"
          target="_blank"
        >
          #teknologiradar-kanalen på Slack
        </Link>
        , gjennom enten å poste et konkret forslag til endring - eller delta i
        en trådet dialog på et konkret forslag.
      </Ingress>

      <Table className={"activity--table"}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Dato</Table.HeaderCell>
            <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
            <Table.HeaderCell scope="col">Tema</Table.HeaderCell>
            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {dates.map((date) => (
            <>
              {groupedByDate[date].map((activity) => (
                <Table.Row key={activity.id}>
                  <Table.HeaderCell scope={"row"}>
                    {activity.date}
                  </Table.HeaderCell>
                  <Table.DataCell>
                    <Link href={`/activities/${activity.id}`}>
                      {activity.title}
                    </Link>
                  </Table.DataCell>
                  <Table.DataCell>
                    {activity.labels.length > 0 && (
                      <LabelList labels={activity.labels} />
                    )}
                  </Table.DataCell>
                  <Table.DataCell>
                    <span
                      className={`activity--label 
  ${
    activity.listName === "Kandidat"
      ? "kandidat-color"
      : activity.listName === "Trial"
      ? "trial-color"
      : activity.listName === "Assess"
      ? "assess-color"
      : activity.listName === "Adopt"
      ? "adopt-color"
      : activity.listName === "Hold"
      ? "hold-color"
      : activity.listName === "Omstridt"
      ? "omstridt-color"
      : ""
  }`}
                    >
                      {activity.listName}
                    </span>
                  </Table.DataCell>
                </Table.Row>
              ))}
            </>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default ActivitiesPage;
