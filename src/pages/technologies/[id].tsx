import {
  Technology,
  TechnologyLabel,
  getCurrentTechnologies,
} from "@/lib/technologies";
import { Back } from "@navikt/ds-icons";
import { Detail, Heading } from "@navikt/ds-react";
import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query["id"];
  const date = context.query["date"] ?? null;

  const technologies: Technology[] = await getCurrentTechnologies();
  const technology = technologies.find((technology) => technology.id === id);
  if (!technology) return { notFound: true };

  return { props: { technology, date } };
};

const TechnologyPage: NextPage<{ technology: Technology }> = ({
  technology,
}) => {
  return (
    <>
      <Head>
        <title>{`${technology.title} | Fagtorsdag`}</title>
        <meta name="description" content={technology.description} />
      </Head>
      <Link href={"/"} className={"link-with-icon color-blue"}>
        <Back /> Tilbake til oversikt
      </Link>
      <TechnologyEntry technology={technology} />
    </>
  );
};

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

const TechnologyEntry = ({ technology }: { technology: Technology }) => {
  return (
    <>
      <Heading
        level="1"
        size={"large"}
        className={"activity--header color-white"}
      >
        {technology.title}
      </Heading>
      <p className={"activity--subtext color-white"}>
        Status: {technology.listName}
      </p>
      <Detail className={"activity--details"}>
        {technology.labels.length > 0 && (
          <LabelList labels={technology.labels} />
        )}
      </Detail>
      <div className={"activity--ingress color-white"}>
        <ReactMarkdown className="mt-10 markdowndetails">
          {technology.description}
        </ReactMarkdown>
      </div>
    </>
  );
};

export default TechnologyPage;
