import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import {
  ActivityLabel,
  activityComparator,
  getCurrentActivities,
  NextLearningActivity,
  RecurringInterval,
} from "@/lib/activities";
import {
  Heading,
  Ingress,
  Table,
  Search,
  HelpText,
  Chips,
  ExpansionCard,
  Switch,
} from "@navikt/ds-react";
import Link from "next/link";
import { KOMITÈ_LINK, LOCAL_TIMEZONE } from "@/lib/fagtorsdag";
import { formatInTimeZone } from "date-fns-tz";
import noNb from "date-fns/locale/nb";
import { isAfter } from "date-fns";
import { useEffect, useState } from "react";
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
      /*    if (activity.listName === "Kandidat")*/
      groupedByDate[activityDate].push(activity);
    });

  Object.values(groupedByDate).forEach((activities) =>
    activities.sort(activityComparator)
  );
  const dates = Object.keys(groupedByDate);
  dates.sort((a, b) => (a === b ? 0 : a > b ? -1 : 1));

  const options = [
    "Applikasjon & Backend",
    "Data",
    "Design",
    "DevOps",
    "Frontend",
    "Integrasjon",
    "Modellering og arkitektur",
    "Plattform",
    "Produktutvikling",
    "Sikkerhet",
    "Teamarbeid",
    "Utviklingsteknikker",
  ];
  const [selected, setSelected] = useState([]);

  const options2 = ["Kandidat", "Assess", "Trial", "Adopt", "Omstridt", "Hold"];
  const [selected2, setSelected2] = useState([]);

  const [showfilter, setShowfilter] = useState(true);

  const [search, setSearch] = useState("");
  const handleSearchChange = (e: React.SetStateAction<string>) => {
    setSearch(e);
  };

  // @ts-ignore
  return (
    <>
      <Heading size={"large"} level={"1"} style={{ marginTop: "10px" }}>
        Teknologiradaren
      </Heading>

      <form className="searchform">
        <Search
          label="Søk"
          variant="simple"
          onChange={handleSearchChange}
          value={search}
          onClear={() => setSearch("")}
        />
      </form>

      {/* <Switch aria-hidden="false" onChange={() => setShowfilter(!showfilter)}
                checked={showfilter}
                className="mobilvisning-button" size="medium" position="left">
            Vis filter
        </Switch>*/}

      {showfilter == true && (
        <>
          <Heading size={"xsmall"} level={"2"} style={{ marginTop: "10px" }}>
            Tema
          </Heading>
          <Chips>
            {options.map((c) => (
              <Chips.Toggle
                selected={selected.includes(c)}
                key={c}
                onClick={() =>
                  setSelected(
                    selected.includes(c)
                      ? selected.filter((x) => x !== c)
                      : [...selected, c]
                  )
                }
              >
                {c}
              </Chips.Toggle>
            ))}
          </Chips>

          <Heading size={"xsmall"} level={"2"} style={{ marginTop: "10px" }}>
            Status
          </Heading>
          <Chips>
            {options2.map((c) => (
              <Chips.Toggle
                selected={selected2.includes(c)}
                key={c}
                onClick={() =>
                  setSelected2(
                    selected2.includes(c)
                      ? selected2.filter((x) => x !== c)
                      : [...selected2, c]
                  )
                }
              >
                {c}
              </Chips.Toggle>
            ))}
          </Chips>
        </>
      )}

      <Table
        className={"activity--table"}
        style={{ overflow: "scroll", marginTop: "35px" }}
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Dato</Table.HeaderCell>
            <Table.HeaderCell scope="col">Teknologi</Table.HeaderCell>
            <Table.HeaderCell scope="col">Tema</Table.HeaderCell>
            <Table.HeaderCell scope="col">Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {dates.map((date) => (
            <>
              {groupedByDate[date]
                // @ts-ignore
                .filter((activity) => {
                  if (selected.length === 0 && selected2.length === 0) {
                    return true; // Show all activities if no filter is applied
                  } else {
                    const listNameMatches =
                      selected2.length === 0 ||
                      (activity.listName &&
                        selected2.some((item) =>
                          activity.listName.includes(item)
                        ));
                    const categoryMatches =
                      selected.length === 0 ||
                      (activity.labels &&
                        selected.some((item) =>
                          activity.labels[0].name.includes(item)
                        ));
                    return listNameMatches && categoryMatches;
                  }
                })
                .map((activity) => (
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

      <Ingress style={{ marginBottom: "80px", marginTop: "0px" }}>
        Du kan påvirke Teknologiradaren ved å gi innspill eller diskutere i{" "}
        <Link
          href="https://nav-it.slack.com/archives/CEHSHMNBF"
          target="_blank"
        >
          #teknologiradar
        </Link>
        .
      </Ingress>
    </>
  );
};

export default ActivitiesPage;
