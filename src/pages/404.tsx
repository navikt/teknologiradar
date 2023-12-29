import { NextPage } from "next";
import { Heading } from "@navikt/ds-react";
import { useEffect } from "react";
import * as metrics from "@/lib/metrics";

const NotFoundPage: NextPage = () => {
  useEffect(() => {
    metrics.logPageView({ page: `404` });
  }, []);

  return (
    <div className="color-white mb-10">
      <Heading spacing level={"1"} size={"large"}>
        Fant ikke siden
      </Heading>
      <p>Det kan hende aktiviteten har blitt slettet.</p>
    </div>
  );
};

export default NotFoundPage;
