import { TechnologyTable } from "@/components/TechnologyTable";
import { Technology, getCurrentTechnologies } from "@/lib/technologies";
import { Back } from "@navikt/ds-icons";
import { Heading } from "@navikt/ds-react";
import Head from "next/head";
import Link from "next/link";

type Params = { slug: string };

export async function generateStaticParams() {
  const technologies: Technology[] = await getCurrentTechnologies();
  const tagSet = new Set<string>();
  technologies.forEach((technology) => {
    technology.labels.forEach((label) => {
      tagSet.add(label.name);
    });
  });

  const processed = [...tagSet.values()].map((t) => {
    return { slug: t?.toLowerCase() };
  });

  return processed;
}

const TagsPage = async ({ params }: { params: Params }) => {
  if (!params) return null;

  const technologies: Technology[] = await getCurrentTechnologies();
  const _technologies = technologies.filter((technology) =>
    technology.labels
      .map((l) => l.name?.toLowerCase())
      .includes(params.slug?.toLowerCase()),
  );

  return (
    <>
      <Head>
        <title>{`${params.slug} | Teknologiradar`}</title>
      </Head>
      <Heading size="xlarge" className="color-teal my-4">
        {params.slug}
      </Heading>
      <TechnologyTable technologies={_technologies} />
      <Link href={"/"} className={"link-with-icon color-blue"}>
        <Back /> Tilbake til oversikt
      </Link>
    </>
  );
};

export default TagsPage;
