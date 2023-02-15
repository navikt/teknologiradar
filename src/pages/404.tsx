import { NextPage } from "next";
import { Heading, Ingress } from "@navikt/ds-react";

const NotFoundPage: NextPage = () => {
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
