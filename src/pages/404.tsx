import { NextPage } from "next";
import { Heading, Ingress } from "@navikt/ds-react";
import { useEffect } from "react";
import * as metrics from "@/lib/metrics";

const NotFoundPage: NextPage = () => {
  useEffect(() => {
    /*metrics.logPageView({ page: `404` });*/
  }, []);

  return (
    <>
      <Heading level={"1"} size={"large"}>
        Fant ikke siden
      </Heading>
      <Ingress>Det kan hende aktiviteten har blitt slettet.</Ingress>
    </>
  );
};

export default NotFoundPage;
