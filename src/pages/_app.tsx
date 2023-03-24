import "@/styles/globals.css";
import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Header } from "@navikt/ds-react-internal";
import NextLink from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>Teknologiradaren</title>
      </Head>
      <Header>
        <Header.Title as="h1">
          <a className="header--link" href={"."}>
            Teknologiradaren
          </a>
        </Header.Title>
        {/* <Header.Title as="h2">
          <NextLink className="header--link" href={"/calendar"}>
            <img
              src={"/img/fya1.jpg"}
              alt={"Fyrstikkalléen 1"}
              width={"25px"}
              height={"25px"}
            />
            Timeplan
          </NextLink>
        </Header.Title>
        <Header.Title as="h2">
          <NextLink className="header--link" href={"/activities"}>
            Tidligere aktiviteter
          </NextLink>
        </Header.Title>
        <Header.Title as="h2">
          <NextLink className="header--link" href={"/learn"}>
            Lær
          </NextLink>
        </Header.Title>*/}
      </Header>
      <main className="layout">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
