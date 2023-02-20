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
        <title>Fagtorsdag – Åpen delingsarena for alle</title>
      </Head>
      <Header>
        <Header.Title as="h1">
          <NextLink className="header--link" href={"/"}>
            <img
              src={"/img/fagtorsdag.png"}
              alt={"Fagtorsdag logo"}
              width={"25px"}
              height={"25px"}
            />
            Fagtorsdag
          </NextLink>
        </Header.Title>
      </Header>
      <main className="layout">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
