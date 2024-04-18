import { Technology, getCurrentTechnologies } from "@/lib/technologies";
import { Heading } from "@navikt/ds-react";
import Link from "next/link";
import React from "react";

const getTags = async () => {
  const technologies: Technology[] = await getCurrentTechnologies();

  const tagSet = new Set<string>();
  technologies.forEach((technology) => {
    technology.labels.forEach((label) => {
      tagSet.add(label.name);
    });
  });

  return [...tagSet.values()];
};

const Tags = async () => {
  const tags = await getTags();

  return (
    <div>
      <Heading size="xlarge" className="color-teal my-4">
        Tags
      </Heading>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>
            <Link href={`/tags/${tag.toLowerCase()}`}>{tag}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tags;
