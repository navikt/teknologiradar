import { NextPage } from "next";
import { BodyShort, Heading } from "@navikt/ds-react";

import resources from "@/data/resources.json";
import Link from "next/link";
import { KOMITÈ_LINK } from "@/lib/fagtorsdag";
import { useEffect } from "react";
import * as metrics from "@/lib/metrics";

interface LearningList {
  title: string;
  href?: string;
  links?: LearningList[];
}

const LearningList = ({ list }: { list: LearningList }) => {
  return (
    <li>
      {list.href ? <Link href={list.href!}>{list.title}</Link> : list.title}
      {list.links && list.links.length > 0 && (
        <ul>
          {list.links.map((link, idx) => (
            <LearningList list={link} key={idx} />
          ))}
        </ul>
      )}
    </li>
  );
};

const LearnPage: NextPage = () => {
  useEffect(() => {
    metrics.logPageView({ page: "Lær" });
  }, []);

  return (
    <>
      <Heading size={"large"} level={"1"}>
        Læringsressurser
      </Heading>
      <p>
        Har du lyst til å lære deg noe nytt, eller fordype deg i et tema du vil
        lære mer om? Da er fagtorsdag dagen for deg! Trenger du tips eller
        inspirasjon til hva du kan lære? Se oversikten under.
      </p>
      {(resources.diciplines as LearningList[]).map((dicipline, idx) => (
        <section key={idx}>
          <Heading size={"medium"} level={"2"}>
            {dicipline.title}
          </Heading>
          <ul>
            {dicipline.links!.map((link, idx) => (
              <LearningList list={link} key={idx} />
            ))}
          </ul>
        </section>
      ))}
      <BodyShort>
        Er det noe du savner, eller har du forslag til flere læringsressurser?{" "}
        <Link href={KOMITÈ_LINK}>Ta kontakt!</Link>
      </BodyShort>
    </>
  );
};

export default LearnPage;
