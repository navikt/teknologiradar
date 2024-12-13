"use client";

import { TechnologyTable } from "@/components/TechnologyTable";
import { Technology, getCurrentTechnologies } from "@/lib/technologies";
import { Chips, Heading, Search, Table } from "@navikt/ds-react";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { forumOptions, ForumOptions } from "@/lib/forumOptions";
// @ts-expect-error
import { useStatesToNextQuery } from "use-states-to-next-query";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const date = context.query["date"] ?? null;

  const technologies: Technology[] = await getCurrentTechnologies();
  return { props: { technologies, date } };
};

// DRY: duplication of this on client & server side (get via API?)
const decisionOptions = ["Bruk", "Eksperimenter", "Avstå"] as const;
type DecisionOptions = (typeof decisionOptions)[number][];

const TechnologyPage: NextPage<{
  technologies: Technology[];
}> = ({ technologies }) => {
  const router = useRouter();

  const forums = useState<ForumOptions>([]);
  const [selectedForums, setSelectedForums] = forums;
  const decisions = useState<DecisionOptions>([]);
  const [selectedDecisions, setSelectedDecisions] = decisions;
  const search = useState("");
  const [currentSearch, setSearch] = search;

  useStatesToNextQuery(router, {
    search,
    forums,
    decisions,
  });

  const [showfilter] = useState(true);

  const handleSearchChange = (e: React.SetStateAction<string>) => {
    setSearch(e);
  };

  const filteredTechnologies = technologies.filter((technology) => {
    if (
      selectedForums.length === 0 &&
      selectedDecisions.length === 0 &&
      currentSearch === ""
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
          technology.labels.length > 0 && // check if labels array has at least one element
          technology.labels[0].name &&
          selectedForums.some((item) =>
            technology.labels[0].name.includes(item),
          ));
      const searchMatches =
        currentSearch === "" ||
        (technology.title &&
          technology.title.toLowerCase().includes(currentSearch.toLowerCase()));
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
          value={currentSearch}
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

      <TechnologyTable technologies={filteredTechnologies} />

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
