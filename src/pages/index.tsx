import type { NextPage } from "next";
import { FORMS_LINK, KOMITÈ_LINK, LOCAL_TIMEZONE } from "@/lib/fagtorsdag";
import { utcToZonedTime } from "date-fns-tz";
import { FagtorsdagCountdown } from "@/components/FagtorsdagCountdown";
import { Heading, Ingress } from "@navikt/ds-react";
import Link from "next/link";

const Home: NextPage = () => {
  const now = utcToZonedTime(new Date(), LOCAL_TIMEZONE);

  return (
    <>
      <Heading level={"1"} size={"large"}>
        Fagtorsdag – åpen delingsarena for alle
      </Heading>
      <Heading level={"2"} size={"medium"}>
        <FagtorsdagCountdown currentDate={now} />
      </Heading>

      <Ingress>
        Har du noe å dele? Kanskje en presentasjon eller et kurs du vil holde?
        Eller en faggruppe eller lesesirkel du ønsker å starte?{" "}
        <Link href={FORMS_LINK}>Meld det inn</Link> i dag, så vil{" "}
        <Link href={KOMITÈ_LINK}>komitéen</Link> hjelpe deg komme i gang.
      </Ingress>
    </>
  );
};

export default Home;
