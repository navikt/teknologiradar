import { getCurrentTechnologies, Technology } from "@/lib/technologies";
import { Heading } from "@navikt/ds-react";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const date = context.query["date"] ?? null;
  const technologies: Technology[] = await getCurrentTechnologies();
  return { props: { technologies, date } };
};

const TechnologiesPage: NextPage<{
  technologies: Technology[];
  date: string | null;
}> = ({ technologies, date }) => {
  return (
    <div className="color-white pb-10">
      <Heading className="pb-4" size={"large"} level={"1"}>
        Technologies
      </Heading>

      <section key={date}>
        <ul>
          {technologies.map((technology) => (
            <li className="mb-2 list-disc list-inside" key={technology.id}>
              <Link href={`/activities/${technology.id}`}>
                {technology.title}{" "}
                <span className="lowercase">({technology.listName})</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default TechnologiesPage;
