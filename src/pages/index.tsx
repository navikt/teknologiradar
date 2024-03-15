import { eqSet } from "@/lib/sets";
import {
  Technology,
  TechnologyLabel,
  getCurrentTechnologies,
} from "@/lib/technologies";
import { Chips, Heading, Search, Table } from "@navikt/ds-react";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const date = context.query["date"] ?? null;

  const technologies: Technology[] = await getCurrentTechnologies();
  return { props: { technologies, date } };
};

const colorMap = {
  Uavklart: "kandidat-color",
  Eksperiment: "trial-color",
  Vurder: "trial-color",
  Bruk: "adopt-color",
  Avstå: "hold-color",
  Omstridt: "omstridt-color",
};

const forumOptions = [
  "Design",
  "Frontend",
  "Backend",
  "Data science",
  "Data engineering",
] as const;
type ForumOptions = (typeof forumOptions)[number][];

const decisionOptions = ["Bruk", "Vurder", "Avstå"] as const;
type DecisionOptions = (typeof decisionOptions)[number][];

const extractParams = ({ forums, statuses }: ParsedUrlQuery) => {
  let paramForums = Array.isArray(forums)
    ? (forums as ForumOptions)
    : ([forums] as ForumOptions);

  let paramStatuses = Array.isArray(statuses)
    ? (statuses as DecisionOptions)
    : ([statuses] as DecisionOptions);

  paramForums = paramForums.filter((x) => !!x);
  paramStatuses = paramStatuses.filter((x) => !!x);

  return { paramForums, paramStatuses };
};

const TechnologyPage: NextPage<{
  technologies: Technology[];
  date: string | null;
}> = ({ technologies, date }) => {
  const router = useRouter();

  const Label = ({ label }: { label: TechnologyLabel }) => {
    return (
      <span
        className={"activity--label"}
        style={{ backgroundColor: label.color }}
      >
        {label.name}
      </span>
    );
  };

  const LabelList = ({ labels }: { labels: TechnologyLabel[] }) => {
    return (
      <span className={"activity--label-list"}>
        {labels.map((label, idx) => (
          <Label key={idx} label={label} />
        ))}
      </span>
    );
  };

  const [selectedForums, setSelectedForums] = useState<ForumOptions>([]);
  const [selectedDecisions, setSelectedDecisions] = useState<DecisionOptions>(
    [],
  );

  const [showfilter] = useState(true);

  const [search, setSearch] = useState("");
  const handleSearchChange = (e: React.SetStateAction<string>) => {
    setSearch(e);
  };

  useEffect(() => {
    let { paramForums, paramStatuses } = extractParams(router.query);

    if (paramForums.length > 0) {
      setSelectedForums(paramForums);
    }
    if (paramStatuses.length > 0) {
      setSelectedDecisions(paramStatuses);
    }
  }, [router]);

  useEffect(() => {
    let { paramForums, paramStatuses } = extractParams(router.query);

    const oldForums = new Set(paramForums);
    const oldStatus = new Set(paramStatuses);
    const newForums = new Set(selectedForums);
    const newStatus = new Set(selectedDecisions);

    if (!eqSet(oldForums, newForums) || !eqSet(oldStatus, newStatus)) {
      router.query.forums = selectedForums;
      router.query.statuses = selectedDecisions;
      router.replace({ pathname: "/", query: router.query }, undefined, {
        shallow: true,
      });
    }
  }, [selectedForums, selectedDecisions, router]);

  const filteredTechnologies = technologies.filter((technology) => {
    if (
      selectedForums.length === 0 &&
      selectedDecisions.length === 0 &&
      search === ""
    ) {
      return true; // Show all activities if no filter is applied
    } else {
      const listNameMatches =
        selectedDecisions.length === 0 ||
        (technology.listName &&
          selectedDecisions.some((item) => technology.listName.includes(item)));
      const categoryMatches =
        selectedForums.length === 0 ||
        (technology.labels &&
          selectedForums.some((item) =>
            technology.labels[0].name.includes(item),
          ));
      const searchMatches =
        search === "" ||
        (technology.title &&
          technology.title.toLowerCase().includes(search.toLowerCase()));
      return listNameMatches && categoryMatches && searchMatches;
    }
  });

  return (
    <>
      <Heading
        size={"large"}
        level={"1"}
        style={{ marginTop: "10px", color: "rgb(34 211 238 / 1)" }}
      >
        Teknologiradar
      </Heading>

      <form
        className="searchform"
        style={{ marginTop: "10px", marginBottom: "0px" }}
      >
        <Search
          style={{ borderRadius: "60px" }}
          label="Søk"
          variant="simple"
          onChange={handleSearchChange}
          value={search}
          onClear={() => setSearch("")}
        />
      </form>

      {showfilter == true && (
        <>
          <Heading
            className={"color-blue"}
            size={"xsmall"}
            level={"2"}
            style={{ marginTop: "10px" }}
          >
            Forum
          </Heading>
          <Chips>
            {forumOptions.map((c) => (
              <Chips.Toggle
                className={"chip-effect"}
                selected={selectedForums.includes(c)}
                key={c}
                onClick={() =>
                  setSelectedForums(
                    selectedForums.includes(c)
                      ? selectedForums.filter((x) => x !== c)
                      : [...selectedForums, c],
                  )
                }
              >
                {c}
              </Chips.Toggle>
            ))}
          </Chips>

          <Heading
            className={"color-blue"}
            size={"xsmall"}
            level={"2"}
            style={{ marginTop: "10px" }}
          >
            Status
          </Heading>
          <Chips>
            {decisionOptions.map((c) => (
              <Chips.Toggle
                className={"chip-effect"}
                selected={selectedDecisions.includes(c)}
                key={c}
                onClick={() =>
                  setSelectedDecisions(
                    selectedDecisions.includes(c)
                      ? selectedDecisions.filter((x) => x !== c)
                      : [...selectedDecisions, c],
                  )
                }
              >
                {c}
              </Chips.Toggle>
            ))}
          </Chips>
        </>
      )}

      <div style={{ overflowX: "auto", width: "100%" }}>
        <Table
          className={"activity--table"}
          style={{ overflow: "scroll", marginTop: "20px" }}
        >
          <Table.Header className={"color-blue"}>
            <Table.Row>
              <Table.HeaderCell scope="col">Teknologi</Table.HeaderCell>
              <Table.HeaderCell scope="col">Status</Table.HeaderCell>
              <Table.HeaderCell scope="col">Forum</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredTechnologies.map((technology) => (
              <Table.Row key={technology.id}>
                <Table.DataCell>
                  <Link
                    className={"blue-link"}
                    href={`/technologies/${technology.id}`}
                  >
                    {technology.title}
                  </Link>
                </Table.DataCell>
                <Table.DataCell>
                  <span
                    className={`activity--label ${colorMap[technology.listName]}`}
                  >
                    {technology.listName}
                  </span>
                </Table.DataCell>
                <Table.DataCell className="whitespace-nowrap">
                  {technology.labels.length > 0 && (
                    <LabelList labels={technology.labels} />
                  )}
                </Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <footer>
        <p
          className={"color-white"}
          style={{ marginBottom: "80px", marginTop: "30px", lineHeight: "1.5" }}
        >
          Du kan påvirke Teknologiradaren ved å gi innspill eller diskutere i{" "}
          <Link
            className={"blue-link"}
            href={`https://delta.nav.no/faggrupper`}
          >
            faggrupper
          </Link>
          .
        </p>
      </footer>
    </>
  );
};

export default TechnologyPage;
