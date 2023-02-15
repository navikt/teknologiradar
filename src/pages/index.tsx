import type { NextPage } from "next";
import { LOCAL_TIMEZONE } from "@/lib/fagtorsdag";
import { utcToZonedTime } from "date-fns-tz";
import { FagtorsdagCountdown } from "@/components/FagtorsdagCountdown";
import { Heading } from "@navikt/ds-react";

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
    </>
  );
};

export default Home;
