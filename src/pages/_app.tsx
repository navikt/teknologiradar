import "@/styles/globals.css";
import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Header } from "@navikt/ds-react-internal";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>Fagtorsdag</title>
      </Head>
      <Header>
        <Header.Title as="h1">Fagtorsdag</Header.Title>
      </Header>
      <main className="layout">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
