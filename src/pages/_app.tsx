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
        <title>Fagtorsdag</title>
      </Head>
      <Header>
        <Header.Title as="h1">
          <NextLink className="home--link" href={"/"}>
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
